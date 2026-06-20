<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'requested_by_user_id',
        'reviewed_by_user_id',
        'name',
        'chain',
        'address',
        'city',
        'postal_code',
        'country_code',
        'currency_code',
        'latitude',
        'longitude',
        'status',
        'admin_notes',
        'reviewed_at',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'reviewed_at' => 'datetime',
    ];

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }
}
