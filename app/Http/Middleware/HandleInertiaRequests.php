<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $pendingInvitationsCount = 0;
        
        if ($request->user()) {
            $pendingInvitationsCount = \App\Models\Invitation::where('email', $request->user()->email)->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'has_team' => $request->user() ? $request->user()->teams()->exists() : false,
                'team_has_monitors' => $request->user() ? $request->user()->teams()->whereHas('monitors')->exists() : false,
                'pending_invitations_count' => $pendingInvitationsCount,
            ],
            'flash' => [
                'message' => $request->session()->get('message'),
                'newKey' => $request->session()->get('newKey'),
            ],
            'url' => $request->url(),
        ];
    }
}
