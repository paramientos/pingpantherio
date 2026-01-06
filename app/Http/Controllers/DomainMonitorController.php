<?php

namespace App\Http\Controllers;

use App\Jobs\CheckDomainExpirations;
use App\Jobs\CheckSslCertificates;
use App\Models\DomainMonitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DomainMonitorController extends Controller
{
    public function index(): Response
    {
        $domains = DomainMonitor::where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn($domain) => [
                'id' => $domain->getKey(),
                'domain' => $domain->domain,
                'expires_at' => $domain->expires_at?->format('M d, Y'),
                'days_left' => $domain->daysUntilExpiry(),
                'is_active' => $domain->is_active,
                'last_checked' => $domain->last_checked_at?->diffForHumans(),
            ]);

        return Inertia::render('Domains/Index', [
            'domains' => $domains,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:255',
        ]);

        $domainMonitor = DomainMonitor::create([
            'user_id' => auth()->id(),
            'domain' => str_replace(['http://', 'https://'], '', $validated['domain']),
            'is_active' => true,
        ]);

        dispatch(new CheckDomainExpirations($domainMonitor));

        return redirect()->route('domains.index')
            ->with('message', 'Domain added for monitoring');
    }

    public function destroy(DomainMonitor $domain)
    {
        $domain->delete();

        return redirect()->route('domains.index');
    }
}
