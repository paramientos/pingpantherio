<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SslController extends Controller
{
    public function index(): Response
    {
        $monitors = Monitor::where('check_ssl', true)
            ->whereNotNull('ssl_expires_at')
            ->orderBy('ssl_days_until_expiry', 'asc')
            ->get()
            ->map(fn ($monitor) => [
                'id' => $monitor->id,
                'name' => $monitor->name,
                'url' => $monitor->url,
                'status' => $monitor->status,
                'ssl_expires_at' => $monitor->ssl_expires_at?->format('M d, Y'),
                'ssl_days_until_expiry' => $monitor->ssl_days_until_expiry,
                'ssl_issuer' => $monitor->ssl_issuer,
                'is_expiring_soon' => $monitor->ssl_days_until_expiry <= 14,
                'is_critical' => $monitor->ssl_days_until_expiry <= 7,
            ]);

        return Inertia::render('Ssl/Index', [
            'monitors' => $monitors,
        ]);
    }
}
