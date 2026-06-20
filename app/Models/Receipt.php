<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

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

        $parsedItems = $this->parseReceiptText($this->ocr_raw_text ?? '');
        $detectedTotal = $this->extractTotalAmount($this->ocr_raw_text ?? '');

        $this->update([
            'status' => 'completed',
            'parsed_items' => $parsedItems,
            'items_count' => count($parsedItems),
            'total_amount' => $this->total_amount ?? $detectedTotal,
        ]);
    }

    private function parseReceiptText(string $rawText): array
    {
        $lines = preg_split('/\r\n|\r|\n/', $rawText) ?: [];
        $items = [];

        foreach ($lines as $line) {
            $normalizedLine = trim(preg_replace('/\s+/', ' ', $line) ?? '');

            if ($normalizedLine === '') {
                continue;
            }

            if (preg_match('/^(.*?)(\d+[\.,]\d{2})$/u', $normalizedLine, $matches) !== 1) {
                continue;
            }

            $name = trim($matches[1], " -\t\n\r\0\x0B");
            $amount = (float) str_replace(',', '.', $matches[2]);

            if ($name === '' || Str::lower($name) === 'totaal') {
                continue;
            }

            $items[] = [
                'name' => $name,
                'price' => round($amount, 2),
            ];
        }

        return $items;
    }

    private function extractTotalAmount(string $rawText): ?float
    {
        if (preg_match('/totaal\s*[:\-]?\s*(\d+[\.,]\d{2})/iu', $rawText, $matches) === 1) {
            return round((float) str_replace(',', '.', $matches[1]), 2);
        }

        return null;
    }
}
