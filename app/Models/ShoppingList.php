<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShoppingList extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'city',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ShoppingListItem::class);
    }

    /**
     * Bereken totaalprijs voor een specifieke winkel
     */
    public function calculateTotalForStore(Store $store): float
    {
        $total = 0;

        foreach ($this->items as $item) {
            $price = $item->product->currentPriceAt($store);
            if ($price) {
                $total += $price->price * $item->quantity;
            }
        }

        return $total;
    }

    /**
     * Vind de goedkoopste winkel voor deze lijst
     */
    public function findCheapestStore()
    {
        $city = $this->city ?? $this->user->city;
        $stores = Store::where('city', $city)->get();

        $storePrices = [];

        foreach ($stores as $store) {
            $storePrices[] = [
                'store' => $store,
                'total' => $this->calculateTotalForStore($store),
            ];
        }

        return collect($storePrices)->sortBy('total')->first();
    }

    /**
     * Optimaliseer: verdeel items over meerdere winkels voor max besparing
     */
    public function optimizeAcrossStores()
    {
        $city = $this->city ?? $this->user->city;
        $stores = Store::where('city', $city)->get();
        
        $optimization = [];
        $totalSavings = 0;

        foreach ($this->items as $item) {
            $bestPrice = null;
            $bestStore = null;

            foreach ($stores as $store) {
                $price = $item->product->currentPriceAt($store);
                
                if ($price && (!$bestPrice || $price->price < $bestPrice->price)) {
                    $bestPrice = $price;
                    $bestStore = $store;
                }
            }

            if ($bestStore) {
                $optimization[] = [
                    'product' => $item->product,
                    'quantity' => $item->quantity,
                    'store' => $bestStore,
                    'price' => $bestPrice->price,
                    'total' => $bestPrice->price * $item->quantity,
                ];
            }
        }

        return $optimization;
    }
}
