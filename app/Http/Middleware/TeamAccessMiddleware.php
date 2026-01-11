<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\Role;

class TeamAccessMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if ($user && $user->role !== Role::ADMIN) {
            $hasTeam = $user->teams()->exists();
            
            if (!$hasTeam && 
                !$request->is('settings/profile*') && 
                !$request->is('profile*') && 
                !$request->is('logout') && 
                !$request->is('settings/security') && 
                !$request->routeIs('password.update') && 
                !$request->routeIs('profile.update')
            ) {
                return $next($request);
            }
        }

        return $next($request);
    }
}
