<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Alleen admins hebben toegang tot deze actie.',
                ], 403);
            }

            abort(403, 'Alleen admins hebben toegang tot deze pagina.');
        }

        return $next($request);
    }
}
