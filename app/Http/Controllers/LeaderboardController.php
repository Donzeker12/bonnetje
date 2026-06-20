<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\UserPoints;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    /**
     * Haal leaderboard op
     */
    public function index(Request $request)
    {
        $city = $request->input('city');
        $limit = $request->input('limit', 10);

        $leaderboard = UserPoints::leaderboard($city, $limit);

        return response()->json([
            'city' => $city,
            'leaderboard' => $leaderboard,
            'user_rank' => $this->getUserRank(auth()->user(), $city),
        ]);
    }

    /**
     * Haal badges op
     */
    public function badges()
    {
        $user = auth()->user();
        $allBadges = Badge::all();

        $userBadges = $user->badges;

        $available = $allBadges->filter(function ($badge) use ($user) {
            return !$user->badges->contains($badge->id) && $badge->checkEligibility($user);
        });

        $locked = $allBadges->filter(function ($badge) use ($user) {
            return !$user->badges->contains($badge->id) && !$badge->checkEligibility($user);
        });

        return response()->json([
            'earned' => $userBadges,
            'available' => $available,
            'locked' => $locked,
        ]);
    }

    /**
     * Haal user profiel op met statistieken
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $user->load(['points', 'badges', 'scans']);

        $stats = [
            'total_scans' => $user->scans->count(),
            'scans_this_week' => $user->scans()->where('created_at', '>=', now()->subWeek())->count(),
            'total_points' => $user->points->total_points ?? 0,
            'level' => $user->level,
            'badges_count' => $user->badges->count(),
            'rank' => $this->getUserRank($user, $user->city),
            'scans_by_day' => $user->scans()
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->get(),
        ];

        return response()->json([
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    /**
     * Bereken rank van user
     */
    private function getUserRank($user, $city = null)
    {
        // Check if user exists and has points
        if (!$user || !$user->points) {
            return null;
        }

        $query = UserPoints::where('total_points', '>', $user->points->total_points);

        if ($city) {
            $query->where('city', $city);
        }

        return $query->count() + 1;
    }

    /**
     * Haal alle badges op (admin/info)
     */
    public function allBadges()
    {
        return Badge::all();
    }

    /**
     * Maak badge aan
     */
    public function createBadge(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'type' => 'required|in:scan_count,verification_count,total_points,city_hero',
            'requirement' => 'required|integer|min:1',
        ]);

        $badge = Badge::create($validated);

        return response()->json($badge, 201);
    }
}
