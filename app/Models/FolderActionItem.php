<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FolderActionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'folder_action_id',
        'product_id',
        'product_name_raw',
        'promo_price',
        'normal_price',
        'unit_label',
    ];

    protected $casts = [
        'promo_price' => 'decimal:2',
        'normal_price' => 'decimal:2',
    ];

    public function folderAction(): BelongsTo
    {
        return $this->belongsTo(FolderAction::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
