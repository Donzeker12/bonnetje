<?php

namespace App\Http\Controllers;

use App\Models\Price;
use App\Models\Product;
use App\Models\Scan;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PriceController extends Controller
{
    /**
     * Registreer een nieuwe prijs (via scan)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'store_id' => 'required|exists:stores,id',
            'price' => 'required|numeric|min:0',
            'price_type' => 'nullable|in:normal,promotion',
            'normal_price' => 'nullable|numeric|min:0',
            'source_type' => 'nullable|in:manual,barcode,receipt,folder',
            'proof_image_path' => 'nullable|string|max:255',
            'is_promotion' => 'boolean',
            'promotion_end_date' => 'nullable|date',
        ]);

        $priceType = $validated['price_type'] ?? (($validated['is_promotion'] ?? false) ? 'promotion' : 'normal');
        $isPromotion = $priceType === 'promotion';

        if ($isPromotion && isset($validated['normal_price']) && $validated['normal_price'] < $validated['price']) {
            throw ValidationException::withMessages([
                'normal_price' => 'Normale prijs moet hoger of gelijk zijn aan de actieprijs.',
            ]);
        }

        if ($isPromotion && empty($validated['normal_price'])) {
            throw ValidationException::withMessages([
                'normal_price' => 'Bij een actieprijs is de normale prijs verplicht.',
            ]);
        }

        $user = $request->user();

        // Check of er al een recente prijs bestaat
        $existingPrice = Price::where('product_id', $validated['product_id'])
            ->where('store_id', $validated['store_id'])
            ->where('created_at', '>=', now()->subHours(24))
            ->latest()
            ->first();

        if ($existingPrice) {
            // Als de prijs hetzelfde is, verhoog verification count
            if (abs($existingPrice->price - $validated['price']) < 0.01) {
                $existingPrice->verify();
                
                // Geef minder punten voor verificatie dan voor nieuwe scan
                $user->points->addPoints(5, 'verification');
                
                return response()->json([
                    'message' => 'Prijs geverifieerd',
                    'price' => $existingPrice,
                    'points_earned' => 5,
                ]);
            }
        }

        // Maak nieuwe prijs aan
        $price = Price::create([
            ...$validated,
            'price_type' => $priceType,
            'is_promotion' => $isPromotion,
            'source_type' => $validated['source_type'] ?? 'manual',
            'user_id' => $user->id,
        ]);

        // Registreer scan
        $scan = Scan::create([
            'user_id' => $user->id,
            'product_id' => $validated['product_id'],
            'store_id' => $validated['store_id'],
            'price_id' => $price->id,
            'scan_type' => $validated['source_type'] ?? 'barcode',
            'points_earned' => 10,
        ]);

        // Geef punten
        $user->initializePoints();
        $user->points->addPoints(10, 'scan');

        return response()->json([
            'message' => 'Prijs toegevoegd',
            'price' => $price,
            'scan' => $scan,
            'points_earned' => 10,
            'total_points' => $user->points->total_points,
            'level' => $user->level,
        ], 201);
    }

    /**
     * Update een bestaande prijs
     */
    public function update(Request $request, Price $price)
    {
        $validated = $request->validate([
            'price' => 'sometimes|numeric|min:0',
            'price_type' => 'sometimes|in:normal,promotion',
            'normal_price' => 'nullable|numeric|min:0',
            'source_type' => 'sometimes|in:manual,barcode,receipt,folder',
            'proof_image_path' => 'nullable|string|max:255',
            'is_promotion' => 'boolean',
            'promotion_end_date' => 'nullable|date',
        ]);

        if (($validated['price_type'] ?? $price->price_type) === 'promotion' && empty($validated['normal_price']) && empty($price->normal_price)) {
            throw ValidationException::withMessages([
                'normal_price' => 'Bij een actieprijs is de normale prijs verplicht.',
            ]);
        }

        $price->update($validated);

        return response()->json($price);
    }

    /**
     * Verifieer een prijs
     */
    public function verify(Request $request, Price $price)
    {
        $user = $request->user();

        $price->verify();

        // Geef verificatie punten
        $user->points->addPoints(3, 'verification');

        return response()->json([
            'message' => 'Prijs geverifieerd',
            'price' => $price,
            'points_earned' => 3,
        ]);
    }

    /**
     * Haal huidige prijzen op voor een stad
     */
    public function cityPrices(Request $request)
    {
        $city = $request->input('city');
        $category = $request->input('category');

        $query = Price::whereHas('store', function ($q) use ($city) {
            $q->where('city', $city);
        })
        ->with(['product', 'store'])
        ->where('created_at', '>=', now()->subDays(7));

        if ($category) {
            $query->whereHas('product', function ($q) use ($category) {
                $q->where('category', $category);
            });
        }

        $prices = $query->latest()
            ->get()
            ->unique(function ($price) {
                return $price->product_id . '-' . $price->store_id;
            });

        return response()->json($prices);
    }

    /**
     * Statistieken over prijzen
     */
    public function statistics(Request $request)
    {
        $city = $request->input('city');

        $stats = [
            'total_prices' => Price::count(),
            'verified_prices' => Price::whereNotNull('verified_at')->count(),
            'prices_last_week' => Price::where('created_at', '>=', now()->subWeek())->count(),
            'active_scanners' => Scan::where('created_at', '>=', now()->subWeek())
                ->distinct('user_id')
                ->count('user_id'),
        ];

        if ($city) {
            $stats['city_prices'] = Price::whereHas('store', function ($q) use ($city) {
                $q->where('city', $city);
            })->count();
        }

        return response()->json($stats);
    }

    /**
     * Upload bewijsfoto (bijv. actiefolder of bon)
     */
    public function uploadProof(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:5120',
            'source_type' => 'nullable|in:folder,receipt',
        ]);

        $path = $request->file('image')->store('price-proofs', 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::url($path),
            'source_type' => $validated['source_type'] ?? 'folder',
        ], 201);
    }
}
