<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPoints extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_points',
        'scans_count',
        'verifications_count',
        'city',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Voeg punten toe
     */
    public function addPoints(int $points, string $type = 'scan'): void
    {
        $this->increment('total_points', $points);
        
        if ($type === 'scan') {
            $this->increment('scans_count');
        } elseif ($type === 'verification') {
            $this->increment('verifications_count');
        }

        // Check of user een nieuw level haalt
        $this->user->checkLevelUp();
    }

    /**
     * Haal leaderboard voor stad op
     */
    public static function leaderboard(string $city = null, int $limit = 10)
    {
        $query = static::with('user')
            ->orderBy('total_points', 'desc');

        if ($city) {
            $query->where('city', $city);
        }

        return $query->limit($limit)->get();
    }
}
