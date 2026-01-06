<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        $reports = Report::where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn ($report) => [
                'id' => $report->getKey(),
                'name' => $report->name,
                'type' => $report->type,
                'frequency' => $report->frequency,
                'is_active' => $report->is_active,
                'last_sent_at' => $report->last_sent_at?->format('M d, Y H:i'),
                'next_send_at' => $report->next_send_at?->format('M d, Y H:i'),
            ]);

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
        ]);
    }

    public function create(): Response
    {
        $monitors = Monitor::where('user_id', auth()->id())
            ->get()
            ->map(fn ($m) => [
                'value' => $m->getKey(),
                'label' => $m->name,
            ]);

        return Inertia::render('Reports/Create', [
            'monitors' => $monitors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:uptime,response_time,slas',
            'frequency' => 'required|in:daily,weekly,monthly',
            'monitor_ids' => 'required|array|min:1',
            'recipients' => 'required|array|min:1',
            'recipients.*' => 'email',
            'is_active' => 'boolean',
        ]);

        $report = Report::create([
            ...$validated,
            'user_id' => auth()->id(),
            'next_send_at' => now()->addDay(), // Basit mantık
        ]);

        return redirect()->route('reports.index')
            ->with('message', 'Automatic report scheduled successfully');
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return redirect()->route('reports.index');
    }
}
