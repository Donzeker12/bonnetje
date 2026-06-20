<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'city', 'postal_code', 'level', 'avatar_url', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function shoppingLists(): HasMany
    {
        return $this->hasMany(ShoppingList::class);
    }

    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }

    public function prices(): HasMany
    {
        return $this->hasMany(Price::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function mobileTokens(): HasMany
    {
        return $this->hasMany(MobileToken::class);
    }

    public function points(): HasOne
    {
        return $this->hasOne(UserPoints::class);
    }

    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'user_badges')
            ->withTimestamps()
            ->withPivot('earned_at');
    }

    /**
     * Initialiseer points voor nieuwe user
     */
    public function initializePoints(): void
    {
        if (!$this->points) {
            UserPoints::create([
                'user_id' => $this->id,
                'total_points' => 0,
                'scans_count' => 0,
                'verifications_count' => 0,
                'city' => $this->city,
            ]);
        }
    }

    /**
     * Check of user level omhoog gaat
     */
    public function checkLevelUp(): void
    {
        $points = $this->points->total_points;
        $newLevel = floor($points / 100) + 1; // Elke 100 punten = 1 level

        if ($newLevel > $this->level) {
            $this->update(['level' => $newLevel]);
        }

        // Check badges
        $this->checkBadges();
    }

    /**
     * Check welke badges de user verdient
     */
    public function checkBadges(): void
    {
        $allBadges = Badge::all();

        foreach ($allBadges as $badge) {
            if (!$this->badges->contains($badge->id) && $badge->checkEligibility($this)) {
                $this->badges()->attach($badge->id, ['earned_at' => now()]);
            }
        }
    }

    /**
     * Haal actieve boodschappenlijst op
     */
    public function activeShoppingList(): ?ShoppingList
    {
        return $this->shoppingLists()->where('is_active', true)->first();
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
