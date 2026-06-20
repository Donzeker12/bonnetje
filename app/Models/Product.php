<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'barcode',
        'name',
        'description',
        'brand',
        'category',
        'unit',
        'unit_amount',
        'image_url',
        'is_private_label',
    ];

    protected $casts = [
        'unit_amount' => 'decimal:2',
        'is_private_label' => 'boolean',
    ];

    public function prices(): HasMany
    {
        return $this->hasMany(Price::class);
    }

    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }

    public function shoppingListItems(): HasMany
    {
        return $this->hasMany(ShoppingListItem::class);
    }

    public function folderActionItems(): HasMany
    {
        return $this->hasMany(FolderActionItem::class);
    }

    /**
     * Haal de huidige prijs op voor een specifieke winkel
     */
    public function currentPriceAt(Store $store)
    {
        return $this->prices()
            ->where('store_id', $store->id)
            ->latest()
            ->first();
    }

    /**
     * Haal prijshistorie op
     */
    public function priceHistory(Store $store, int $days = 30)
    {
        return $this->prices()
            ->where('store_id', $store->id)
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Vind de goedkoopste winkel voor dit product
     */
    public function cheapestStore(string $city = null)
    {
        $query = $this->prices()
            ->with('store')
            ->latest('created_at')
            ->groupBy('store_id');

        if ($city) {
            $query->whereHas('store', function ($q) use ($city) {
                $q->where('city', $city);
            });
        }

        return $query->orderBy('price', 'asc')->first();
    }
}
