<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'chain',
        'address',
        'city',
        'country_code',
        'currency_code',
        'store_type',
        'postal_code',
        'latitude',
        'longitude',
        'store_number',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function prices(): HasMany
    {
        return $this->hasMany(Price::class);
    }

    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function folderActions(): HasMany
    {
        return $this->hasMany(FolderAction::class);
    }

    /**
     * Bereken afstand tot een gegeven coördinaat (in km)
     */
    public function distanceTo(float $lat, float $lng): float
    {
        $earthRadius = 6371; // km

        $latFrom = deg2rad($this->latitude);
        $lonFrom = deg2rad($this->longitude);
        $latTo = deg2rad($lat);
        $lonTo = deg2rad($lng);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos($latFrom) * cos($latTo) *
            sin($lonDelta / 2) * sin($lonDelta / 2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Vind winkels in de buurt
     */
    public static function nearby(float $lat, float $lng, int $radiusKm = 5)
    {
        return static::all()->filter(function ($store) use ($lat, $lng, $radiusKm) {
            return $store->distanceTo($lat, $lng) <= $radiusKm;
        });
    }
}
