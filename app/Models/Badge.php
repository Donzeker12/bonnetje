<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'type',
        'requirement',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_badges')
            ->withTimestamps()
            ->withPivot('earned_at');
    }

    /**
     * Check of een user deze badge verdient
     */
    public function checkEligibility(User $user): bool
    {
        $userPoints = $user->points;

        if (!$userPoints) {
            return false;
        }

        return match ($this->type) {
            'scan_count' => $userPoints->scans_count >= $this->requirement,
            'verification_count' => $userPoints->verifications_count >= $this->requirement,
            'total_points' => $userPoints->total_points >= $this->requirement,
            default => false,
        };
    }
}
