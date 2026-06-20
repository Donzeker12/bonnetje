<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_id',
        'image_path',
        'ocr_raw_text',
        'parsed_items',
        'status',
        'items_count',
        'total_amount',
        'purchase_date',
    ];

    protected $casts = [
        'parsed_items' => 'array',
        'total_amount' => 'decimal:2',
        'purchase_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Verwerk de bon met OCR
     */
    public function process(): void
    {
        $this->update(['status' => 'processing']);

        // TODO: Implementeer OCR logica (bijv. Tesseract, Google Vision API)
        // Voor nu een placeholder
        
        $this->update([
            'status' => 'completed',
            'items_count' => 0,
        ]);
    }
}
