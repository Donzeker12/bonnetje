<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken as Middleware;

class ApiCsrfOrToken extends Middleware
{
    protected function shouldPassThrough($request)
    {
        if ($request->bearerToken()) {
            return true;
        }

        return parent::shouldPassThrough($request);
    }
}
