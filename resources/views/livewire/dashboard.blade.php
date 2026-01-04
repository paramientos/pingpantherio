<?php

use Livewire\Volt\Component;
use App\Models\Monitor;
use App\Models\Incident;
use App\Models\Heartbeat;
use Carbon\Carbon;

new class extends Component {
    public function with(): array
    {
        return [
            'totalMonitors' => Monitor::count(),
            'upMonitors' => Monitor::where('status', 'active')
                ->whereDoesntHave('heartbeats', function ($q) {
                    $q->where('status', 'down')->where('created_at', '>', now()->subMinutes(5));
                })
                ->count(),
            'downMonitors' => Monitor::whereHas('heartbeats', function ($q) {
                $q->where('status', 'down')->where('created_at', '>', now()->subMinutes(5));
            })->count(),
            'recentIncidents' => Incident::with('monitor')->latest()->take(5)->get(),
            'stats' => $this->getStats(),
        ];
    }

    protected function getStats(): array
    {
        // Simple mock stats for now
        return [['label' => 'Uptime (24h)', 'value' => '99.9%', 'icon' => 'fas.check-circle', 'color' => 'text-success'], ['label' => 'Avg Response', 'value' => '245ms', 'icon' => 'fas.clock', 'color' => 'text-info'], ['label' => 'Incidents', 'value' => Incident::where('created_at', '>', now()->subDay())->count(), 'icon' => 'fas.exclamation-triangle', 'color' => 'text-warning']];
    }
}; ?>

<div class="p-6 max-w-7xl mx-auto">
    <x-header title="System Overview" separator progress-indicator>
        <x-slot:actions>
            <x-button label="Global Status" icon="fas.globe" class="btn-ghost text-success" />
            <x-button label="Add Monitor" icon="fas.plus" class="btn-primary shadow-lg shadow-primary/20" link="/monitors"
                spinner />
        </x-slot:actions>
    </x-header>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        @foreach ($stats as $stat)
            <x-card class="border-none shadow-sm hover:shadow-md transition-shadow cursor-default group">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            {{ $stat['label'] }}</div>
                        <div class="text-3xl font-black text-slate-900 dark:text-white">{{ $stat['value'] }}</div>
                    </div>
                    <div
                        class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/5 transition-colors">
                        <x-icon :name="$stat['icon']" class="w-8 h-8 {{ $stat['color'] }}" />
                    </div>
                </div>
                <div class="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <i class="fas.caret-up text-success"></i>
                    <span>LIVE DATA</span>
                </div>
            </x-card>
        @endforeach
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {{-- Recent Incidents --}}
        <div class="lg:col-span-3 space-y-6">
            <x-card title="Operational Log" icon="fas.stream" shadow separator>
                <x-table :headers="[
                    ['key' => 'monitor.name', 'label' => 'Monitor'],
                    ['key' => 'title', 'label' => 'Event'],
                    ['key' => 'status', 'label' => 'Status'],
                    ['key' => 'started_at', 'label' => 'Time'],
                ]" :rows="$recentIncidents" class="mary-table-dense">
                    @scope('cell_monitor.name', $incident)
                        <span class="font-bold text-slate-700 dark:text-slate-200">{{ $incident->monitor->name }}</span>
                    @endscope
                    @scope('cell_status', $incident)
                        <span
                            class="px-2 py-0.5 rounded text-[10px] font-black border {{ $incident->status === 'open' ? 'bg-error/10 text-error border-error/20' : 'bg-success/10 text-success border-success/20' }}">
                            {{ strtoupper($incident->status) }}
                        </span>
                    @endscope
                    @scope('cell_started_at', $incident)
                        <span class="text-xs opacity-50">{{ $incident->started_at->diffForHumans() }}</span>
                    @endscope
                </x-table>
                @if ($recentIncidents->isEmpty())
                    <div class="text-center py-12 opacity-30">
                        <x-icon name="fas.check-double" class="w-16 h-16 mx-auto mb-4" />
                        <p class="font-bold">No active incidents found.</p>
                        <p class="text-sm">All systems are reporting normal behavior.</p>
                    </div>
                @endif
            </x-card>
        </div>

        {{-- Uptime Overview --}}
        <div class="lg:col-span-2 space-y-6">
            <x-card title="Global Availability" icon="fas.signal" shadow separator>
                <div class="space-y-6">
                    <div class="flex justify-between items-center bg-success/5 border border-success/20 p-4 rounded-xl">
                        <div class="flex items-center gap-3">
                            <div class="w-2.5 h-2.5 bg-success rounded-full animate-status-pulse"></div>
                            <span class="font-black text-slate-900 dark:text-white tracking-tight">Main
                                Infrastructure</span>
                        </div>
                        <span class="text-success font-black text-xs uppercase letter-spacing-widest">NORMAL</span>
                    </div>

                    <div class="p-1">
                        <div class="flex justify-between items-end mb-3">
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">30 Day Availability
                            </div>
                            <div class="text-xl font-black text-primary">99.98%</div>
                        </div>
                        <div class="h-10 w-full flex gap-1 p-0.5">
                            @for ($i = 0; $i < 30; $i++)
                                <div class="flex-1 bg-success rounded-sm opacity-{{ rand(50, 100) }} hover:opacity-100 transition-opacity cursor-pointer"
                                    title="Availability {{ 100 - rand(0, 5) / 100 }}%"></div>
                            @endfor
                        </div>
                        <div
                            class="flex justify-between text-[10px] mt-2 font-bold text-slate-300 uppercase tracking-tighter">
                            <span>30 days ago</span>
                            <span>Currently</span>
                        </div>
                    </div>

                    <x-button label="View Status Pages" icon="fas.external-link-alt"
                        class="btn-outline btn-block btn-sm" />
                </div>
            </x-card>

            <x-card class="bg-primary text-white border-none overflow-hidden relative">
                <div class="relative z-10">
                    <div class="font-black text-lg mb-1">Developer API</div>
                    <p class="text-xs opacity-80 mb-4">Integrate PingPanther into your CI/CD workflow with our webhooks.
                    </p>
                    <x-button label="View Documentation"
                        class="btn-sm bg-white/20 border-none text-white hover:bg-white/30" />
                </div>
                <x-icon name="fas.code" class="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
            </x-card>
        </div>
    </div>
</div>
