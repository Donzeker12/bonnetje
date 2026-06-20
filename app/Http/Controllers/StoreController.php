<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Haal alle winkels op
     */
    public function index(Request $request)
    {
        $query = Store::query();

        // Current phase: default to supermarkets only unless explicitly overridden.
        if (!$request->has('store_type')) {
            $query->where('store_type', 'supermarket');
        }

        if ($request->has('city')) {
            $query->where('city', $request->input('city'));
        }

        if ($request->has('chain')) {
            $query->where('chain', $request->input('chain'));
        }

        if ($request->has('country_code')) {
            $query->where('country_code', strtoupper($request->input('country_code')));
        }

        if ($request->has('currency_code')) {
            $query->where('currency_code', strtoupper($request->input('currency_code')));
        }

        if ($request->has('store_type')) {
            $query->where('store_type', $request->input('store_type'));
        }

        return $query->get();
    }

    /**
     * Zoek winkels in de buurt
     */
    public function nearby(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'nullable|integer|min:1|max:50',
        ]);

        $stores = Store::nearby(
            $validated['latitude'],
            $validated['longitude'],
            $validated['radius'] ?? 5
        );

        return response()->json($stores->map(function ($store) use ($validated) {
            return [
                ...$store->toArray(),
                'distance' => round($store->distanceTo($validated['latitude'], $validated['longitude']), 2),
            ];
        })->sortBy('distance')->values());
    }

    /**
     * Haal winkel details op
     */
    public function show(Store $store)
    {
        $store->load(['prices' => function ($query) {
            $query->with('product')
                ->where('created_at', '>=', now()->subDays(7))
                ->latest()
                ->limit(50);
        }]);

        return response()->json($store);
    }

    /**
     * Maak nieuwe winkel aan
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'chain' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'country_code' => 'nullable|string|size:2',
            'currency_code' => 'nullable|string|size:3',
            'store_type' => 'nullable|in:supermarket',
            'postal_code' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'store_number' => 'nullable|string',
        ]);

        $validated['country_code'] = strtoupper($validated['country_code'] ?? 'NL');
        $validated['currency_code'] = strtoupper($validated['currency_code'] ?? 'EUR');
        $validated['store_type'] = $validated['store_type'] ?? 'supermarket';

        $store = Store::create($validated);

        return response()->json($store, 201);
    }

    /**
     * Haal alle steden op waar we winkels hebben
     */
    public function cities()
    {
        $cities = Store::distinct('city')
            ->orderBy('city', 'asc')
            ->pluck('city');

        return response()->json($cities);
    }

    /**
     * Haal alle ketens op
     */
    public function chains()
    {
        $chains = Store::distinct('chain')
            ->orderBy('chain', 'asc')
            ->pluck('chain');

        return response()->json($chains);
    }

    /**
     * Statistieken per winkel
     */
    public function statistics(Store $store)
    {
        $stats = [
            'total_products' => $store->prices()->distinct('product_id')->count('product_id'),
            'total_scans' => $store->scans()->count(),
            'recent_scans' => $store->scans()->where('created_at', '>=', now()->subWeek())->count(),
            'last_update' => $store->prices()->latest()->first()?->created_at,
            'avg_price_age_days' => $store->prices()
                ->selectRaw('AVG(DATEDIFF(NOW(), created_at)) as avg_age')
                ->value('avg_age'),
        ];

        return response()->json($stats);
    }
}
