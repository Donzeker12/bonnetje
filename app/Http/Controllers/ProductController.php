<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Zoek producten
     */
    public function search(Request $request)
    {
        $query = Product::query();

        if ($request->has('q')) {
            $searchTerm = $request->input('q');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('brand', 'like', "%{$searchTerm}%")
                  ->orWhere('barcode', $searchTerm);
            });
        }

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->has('is_private_label')) {
            $query->where('is_private_label', $request->boolean('is_private_label'));
        }

        return $query->with(['prices' => function ($q) {
            $q->latest()->limit(5);
        }])->paginate(20);
    }

    /**
     * Haal product op via barcode
     */
    public function findByBarcode(string $barcode)
    {
        $product = Product::where('barcode', $barcode)
            ->with('prices.store')
            ->firstOrFail();

        return response()->json($product);
    }

    /**
     * Maak nieuw product aan
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'barcode' => 'required|string|unique:products',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'category' => 'nullable|string',
            'unit' => 'nullable|string',
            'unit_amount' => 'nullable|numeric',
            'image_url' => 'nullable|url',
            'is_private_label' => 'boolean',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Update product
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'category' => 'nullable|string',
            'unit' => 'nullable|string',
            'unit_amount' => 'nullable|numeric',
            'image_url' => 'nullable|url',
            'is_private_label' => 'boolean',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Haal prijs historie op voor een product
     */
    public function priceHistory(Request $request, Product $product)
    {
        $storeId = $request->input('store_id');
        $days = $request->input('days', 30);

        $store = Store::findOrFail($storeId);
        $history = $product->priceHistory($store, $days);

        return response()->json([
            'product' => $product,
            'store' => $store,
            'history' => $history,
        ]);
    }

    /**
     * Vergelijk prijzen voor een product over verschillende winkels
     */
    public function comparePrices(Request $request, Product $product)
    {
        $city = $request->input('city', $request->user()?->city);
        $countryCode = $request->input('country_code');

        $storesQuery = Store::query();

        if ($city) {
            $storesQuery->where('city', $city);
        }

        if ($countryCode) {
            $storesQuery->where('country_code', strtoupper($countryCode));
        }

        $stores = $storesQuery->get();
        $comparison = [];

        foreach ($stores as $store) {
            $currentPrice = $product->currentPriceAt($store);
            
            if ($currentPrice) {
                $currencyCode = $store->currency_code ?? 'EUR';
                $priceEur = $this->convertToEur((float) $currentPrice->price, $currencyCode);

                $comparison[] = [
                    'store' => $store,
                    'price' => $currentPrice,
                    'currency_code' => $currencyCode,
                    'price_eur' => round($priceEur, 2),
                    'unit_price_eur' => $product->unit_amount > 0
                        ? round($priceEur / (float) $product->unit_amount, 2)
                        : null,
                    'is_current' => $currentPrice->isCurrent(),
                ];
            }
        }

        // Sorteer op prijs
        usort($comparison, fn($a, $b) => $a['price_eur'] <=> $b['price_eur']);

        return response()->json([
            'product' => $product,
            'city' => $city,
            'country_code' => $countryCode,
            'comparison' => $comparison,
        ]);
    }

    private function convertToEur(float $amount, string $currencyCode): float
    {
        $ratesToEur = [
            'EUR' => 1.0,
            'USD' => 0.92,
            'GBP' => 1.17,
            'CHF' => 1.04,
        ];

        $currencyCode = strtoupper($currencyCode);
        $rate = $ratesToEur[$currencyCode] ?? 1.0;

        return $amount * $rate;
    }

    /**
     * Haal alle categorieën op
     */
    public function categories()
    {
        $categories = Product::distinct('category')
            ->whereNotNull('category')
            ->pluck('category');

        return response()->json($categories);
    }
}
