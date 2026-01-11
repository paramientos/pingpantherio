<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && 
            auth()->user()->must_change_password && 
            !$request->is('settings/profile*') && 
            !$request->is('profile*') && 
            !$request->is('logout') && 
            !$request->is('settings/security') && 
            !$request->routeIs('password.update') &&
            !$request->routeIs('profile.update')
        ) {
            return redirect()->route('settings.profile')
                ->with('warning', 'Please change your password for your security.');
        }

        return $next($request);
    }
}
