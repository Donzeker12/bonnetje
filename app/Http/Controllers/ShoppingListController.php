<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use App\Models\ShoppingListItem;
use App\Models\Store;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    /**
     * Haal alle lijsten van gebruiker op
     */
    public function index()
    {
        $lists = auth()->user()
            ->shoppingLists()
            ->with('items.product')
            ->latest()
            ->get();

        return response()->json($lists);
    }

    /**
     * Maak nieuwe boodschappenlijst
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Deactiveer andere lijsten als deze actief is
        if ($validated['is_active'] ?? false) {
            auth()->user()->shoppingLists()->update(['is_active' => false]);
        }

        $list = auth()->user()->shoppingLists()->create([
            ...$validated,
            'city' => $validated['city'] ?? auth()->user()->city,
        ]);

        return response()->json($list, 201);
    }

    /**
     * Toon specifieke lijst
     */
    public function show(ShoppingList $shoppingList)
    {
        $this->authorize('view', $shoppingList);

        $shoppingList->load('items.product.prices.store');

        return response()->json($shoppingList);
    }

    /**
     * Update lijst
     */
    public function update(Request $request, ShoppingList $shoppingList)
    {
        $this->authorize('update', $shoppingList);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'city' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['is_active']) && $validated['is_active']) {
            auth()->user()->shoppingLists()->update(['is_active' => false]);
        }

        $shoppingList->update($validated);

        return response()->json($shoppingList);
    }

    /**
     * Verwijder lijst
     */
    public function destroy(ShoppingList $shoppingList)
    {
        $this->authorize('delete', $shoppingList);

        $shoppingList->delete();

        return response()->json(['message' => 'Lijst verwijderd']);
    }

    /**
     * Voeg item toe aan lijst
     */
    public function addItem(Request $request, ShoppingList $shoppingList)
    {
        $this->authorize('update', $shoppingList);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = $shoppingList->items()->create($validated);

        return response()->json($item, 201);
    }

    /**
     * Update item
     */
    public function updateItem(Request $request, ShoppingList $shoppingList, ShoppingListItem $item)
    {
        $this->authorize('update', $shoppingList);

        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'is_checked' => 'boolean',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    /**
     * Verwijder item
     */
    public function removeItem(ShoppingList $shoppingList, ShoppingListItem $item)
    {
        $this->authorize('update', $shoppingList);

        $item->delete();

        return response()->json(['message' => 'Item verwijderd']);
    }

    /**
     * Bereken totalen per winkel
     */
    public function compare(ShoppingList $shoppingList)
    {
        $this->authorize('view', $shoppingList);

        $shoppingList->load('items.product');

        $city = $shoppingList->city ?? auth()->user()->city;

        $storesQuery = \App\Models\Store::query();
        if ($city) {
            $storesQuery->where('city', $city);
        }

        $stores = $storesQuery->get();
        if ($stores->isEmpty()) {
            $stores = \App\Models\Store::all();
        }

        $comparison = [];

        foreach ($stores as $store) {
            $total = $shoppingList->calculateTotalForStore($store);
            
            $comparison[] = [
                'store' => $store,
                'total' => $total,
                'items_available' => $this->countAvailableItems($shoppingList, $store),
                'total_items' => $shoppingList->items->count(),
            ];
        }

        // Sorteer op prijs
        usort($comparison, fn($a, $b) => $a['total'] <=> $b['total']);

        $cheapest = $comparison[0] ?? null;
        $receipt = $cheapest
            ? $this->buildReceiptForStore($shoppingList, $cheapest['store'])
            : null;

        return response()->json([
            'shopping_list' => $shoppingList,
            'city' => $city,
            'comparison' => $comparison,
            'cheapest' => $cheapest,
            'receipt' => $receipt,
        ]);
    }

    /**
     * Bouw een kassabon-overzicht voor een specifieke winkel
     */
    private function buildReceiptForStore(ShoppingList $shoppingList, Store $store): array
    {
        $items = [];
        $subtotal = 0;
        $unavailableCount = 0;

        foreach ($shoppingList->items as $item) {
            $price = $item->product->currentPriceAt($store);
            $isAvailable = (bool) $price;
            $unitPrice = $isAvailable ? (float) $price->price : 0;
            $lineTotal = $unitPrice * $item->quantity;

            if (!$isAvailable) {
                $unavailableCount++;
            }

            $subtotal += $lineTotal;

            $items[] = [
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'brand' => $item->product->brand,
                'quantity' => $item->quantity,
                'unit_price' => $isAvailable ? round($unitPrice, 2) : null,
                'line_total' => round($lineTotal, 2),
                'available' => $isAvailable,
            ];
        }

        return [
            'store' => $store,
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'item_count' => count($items),
            'unavailable_count' => $unavailableCount,
        ];
    }

    /**
     * Optimaliseer: splits lijst over meerdere winkels
     */
    public function optimize(ShoppingList $shoppingList)
    {
        $this->authorize('view', $shoppingList);

        $optimization = $shoppingList->optimizeAcrossStores();

        // Groepeer per winkel
        $byStore = collect($optimization)->groupBy('store.id')->map(function ($items, $storeId) {
            return [
                'store' => $items[0]['store'],
                'items' => $items,
                'total' => $items->sum('total'),
                'item_count' => $items->count(),
            ];
        })->values();

        $totalCost = $byStore->sum('total');
        
        // Vergelijk met single-store prijzen
        $singleStoreComparison = $this->compare($shoppingList)->original;
        $bestSingleStore = $singleStoreComparison['cheapest'];
        
        $savings = $bestSingleStore ? $bestSingleStore['total'] - $totalCost : 0;

        return response()->json([
            'optimization' => $byStore,
            'total_cost' => $totalCost,
            'best_single_store' => $bestSingleStore,
            'potential_savings' => $savings,
            'stores_needed' => $byStore->count(),
        ]);
    }

    /**
     * Tel hoeveel items beschikbaar zijn in een winkel
     */
    private function countAvailableItems(ShoppingList $list, $store): int
    {
        $count = 0;

        foreach ($list->items as $item) {
            if ($item->product->currentPriceAt($store)) {
                $count++;
            }
        }

        return $count;
    }
}
