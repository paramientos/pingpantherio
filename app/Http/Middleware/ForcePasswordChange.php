<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->must_change_password && !$request->is('settings/profile*') && !$request->is('logout')) {
            return redirect()->route('settings.profile')
                ->with('warning', 'Güvenliğiniz için lütfen şifrenizi değiştirin.');
        }

        return $next($request);
    }
}
