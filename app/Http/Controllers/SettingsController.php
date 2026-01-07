<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\DB;
use App\Models\User;

class SettingsController extends Controller
{
    public function preferences(Request $request): Response
    {
        return Inertia::render('Settings/Preferences', [
            'settings' => $request->user()->settings ?? [
                'timezone' => 'UTC',
                'language' => 'en',
                'theme' => 'light',
                'refresh_rate' => 60,
            ],
            'timezones' => \DateTimeZone::listIdentifiers(),
        ]);
    }

    public function updatePreferences(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'timezone' => 'required|string',
            'language' => 'required|string',
            'theme' => 'required|string',
            'refresh_rate' => 'required|integer|min:0',
        ]);

        $user = $request->user();
        $settings = $user->settings ?? [];
        $settings['preferences'] = $validated;
        
        $user->settings = $settings;
        $user->save();

        return back()->with('success', 'Preferences updated.');
    }

    public function security(Request $request): Response
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) use ($request) {
                $agent = new \Jenssegers\Agent\Agent();
                $agent->setUserAgent($session->user_agent);
                
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'is_current_device' => $session->id === $request->session()->getId(),
                    'platform' => $agent->platform(),
                    'browser' => $agent->browser(),
                    'last_active' => \Carbon\Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                ];
            });

        return Inertia::render('Settings/Security', [
            'sessions' => $sessions,
        ]);
    }

    public function logoutSession(Request $request, string $id): RedirectResponse
    {
        DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->delete();

        return back()->with('success', 'Session logged out.');
    }

    public function notifications(Request $request): Response
    {
        return Inertia::render('Settings/Notifications', [
            'settings' => $request->user()->settings ?? [
                'notifications' => [
                    'email' => true,
                    'browser' => true,
                    'weekly_report' => true,
                ]
            ],
        ]);
    }

    public function updateNotifications(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'notifications' => 'required|array',
            'notifications.email' => 'boolean',
            'notifications.browser' => 'boolean',
            'notifications.weekly_report' => 'boolean',
        ]);

        $user = $request->user();
        $settings = $user->settings ?? [];
        $settings['notifications'] = $validated['notifications'];
        
        $user->settings = $settings;
        $user->save();

        return back()->with('success', 'Notification settings updated.');
    }
}
