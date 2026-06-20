<?php

namespace App\Http\Middleware;

use App\Models\MobileToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateMobileToken
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            return $next($request);
        }

        $bearerToken = $request->bearerToken();
        if (!$bearerToken) {
            return $next($request);
        }

        $tokenHash = hash('sha256', $bearerToken);
        $mobileToken = MobileToken::with('user')
            ->where('token', $tokenHash)
            ->first();

        if (!$mobileToken) {
            return $next($request);
        }

        if ($mobileToken->isExpired()) {
            $mobileToken->delete();
            return $next($request);
        }

        if (!$mobileToken->user) {
            $mobileToken->delete();
            return $next($request);
        }

        Auth::login($mobileToken->user);
        $mobileToken->forceFill(['last_used_at' => now()])->save();

        return $next($request);
    }
}
