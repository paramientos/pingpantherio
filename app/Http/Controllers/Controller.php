<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function authorizeWrite()
    {
        $user = auth()->user();

        if ($user && $user->role->isUser()) {
            abort(403, 'Unauthorized action. Your account is restricted to read-only access.');
        }
    }
}
