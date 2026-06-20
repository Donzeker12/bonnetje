<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Price extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'store_id',
        'user_id',
        'price',
        'price_type',
        'normal_price',
        'source_type',
        'proof_image_path',
        'is_promotion',
        'promotion_end_date',
        'verification_count',
        'verified_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'normal_price' => 'decimal:2',
        'is_promotion' => 'boolean',
        'promotion_end_date' => 'date',
        'verified_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Verifieer deze prijs
     */
    public function verify(): void
    {
        $this->increment('verification_count', 1);
        
        if ($this->verification_count >= 3 && !$this->verified_at) {
            $this->update(['verified_at' => now()]);
        }
    }

    /**
     * Check of de prijs nog actueel is (binnen 7 dagen)
     */
    public function isCurrent(): bool
    {
        return $this->created_at->diffInDays(now()) <= 7;
    }
}
