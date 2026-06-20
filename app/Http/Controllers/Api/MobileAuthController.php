<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MobileToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class MobileAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:120'],
        ]);

        if (!Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ])) {
            throw ValidationException::withMessages([
                'email' => ['De ingevoerde gegevens zijn onjuist.'],
            ]);
        }

        $user = $request->user();
        $plainToken = Str::random(80);

        MobileToken::create([
            'user_id' => $user->id,
            'name' => $credentials['device_name'] ?? 'mobile-app',
            'token' => hash('sha256', $plainToken),
            'expires_at' => now()->addDays(45),
        ]);

        return response()->json([
            'message' => 'Succesvol ingelogd.',
            'token' => $plainToken,
            'token_type' => 'Bearer',
            'expires_at' => now()->addDays(45)->toIso8601String(),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'city' => $user->city,
                'role' => $user->role,
                'level' => $user->level,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'city' => $user->city,
            'role' => $user->role,
            'level' => $user->level,
        ]);
    }

    public function logout(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if ($bearerToken) {
            MobileToken::where('token', hash('sha256', $bearerToken))->delete();
        }

        Auth::logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'message' => 'Succesvol uitgelogd.',
        ]);
    }
}
