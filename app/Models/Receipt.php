<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;
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
        $parsedItems = $this->attachMatchedProducts($parsedItems);
        $detectedTotal = $this->extractTotalAmount($this->ocr_raw_text ?? '');

        $this->createPricesFromParsedItems($parsedItems);

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
                'matched_product_id' => null,
                'matched_product_name' => null,
                'price_created' => false,
            ];
        }

        return $items;
    }

    private function attachMatchedProducts(array $items): array
    {
        if ($items === []) {
            return [];
        }

        $products = Product::query()->get(['id', 'name']);

        return collect($items)
            ->map(function (array $item) use ($products) {
                $matchedProduct = $this->findMatchingProduct($products, $item['name']);

                if (!$matchedProduct) {
                    return $item;
                }

                $item['matched_product_id'] = $matchedProduct->id;
                $item['matched_product_name'] = $matchedProduct->name;

                return $item;
            })
            ->values()
            ->all();
    }

    private function findMatchingProduct(Collection $products, string $itemName): ?Product
    {
        $normalizedItemName = $this->normalizeProductName($itemName);

        if ($normalizedItemName === '') {
            return null;
        }

        return $products->first(function (Product $product) use ($normalizedItemName) {
            return $this->normalizeProductName($product->name) === $normalizedItemName;
        });
    }

    private function normalizeProductName(string $name): string
    {
        $normalized = Str::of($name)
            ->lower()
            ->ascii()
            ->replaceMatches('/[^a-z0-9]+/', ' ')
            ->squish();

        return (string) $normalized;
    }

    private function createPricesFromParsedItems(array &$items): void
    {
        foreach ($items as &$item) {
            $productId = $item['matched_product_id'] ?? null;

            if (!$productId) {
                continue;
            }

            $existingPrice = Price::query()
                ->where('product_id', $productId)
                ->where('store_id', $this->store_id)
                ->where('user_id', $this->user_id)
                ->where('source_type', 'receipt')
                ->where('price', $item['price'])
                ->where('created_at', '>=', now()->subDay())
                ->latest()
                ->first();

            if ($existingPrice) {
                $item['price_created'] = false;
                continue;
            }

            Price::create([
                'product_id' => $productId,
                'store_id' => $this->store_id,
                'user_id' => $this->user_id,
                'price' => $item['price'],
                'price_type' => 'normal',
                'source_type' => 'receipt',
                'proof_image_path' => $this->image_path,
                'is_promotion' => false,
                'verification_count' => 1,
            ]);

            $item['price_created'] = true;
        }
    }

    private function extractTotalAmount(string $rawText): ?float
    {
        if (preg_match('/totaal\s*[:\-]?\s*(\d+[\.,]\d{2})/iu', $rawText, $matches) === 1) {
            return round((float) str_replace(',', '.', $matches[1]), 2);
        }

        return null;
    }
}
