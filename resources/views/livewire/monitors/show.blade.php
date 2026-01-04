<?php

use Livewire\Volt\Component;
use App\Models\Monitor;
use App\Models\Heartbeat;
use App\Models\Incident;
use Mary\Traits\Toast;

new class extends Component {
    use Toast;

    public Monitor $monitor;

    public function mount(Monitor $monitor): void
    {
        $this->monitor = $monitor->load(['heartbeats' => fn($q) => $q->latest()->take(50), 'incidents' => fn($q) => $q->latest()->take(10)]);
    }

    public function toggleStatus(): void
    {
        $this->monitor->status = $this->monitor->status === 'active' ? 'paused' : 'active';
        $this->monitor->save();
        $this->success('Monitor status updated.');
    }

    public function delete(): void
    {
        $this->monitor->delete();
        $this->success('Monitor deleted.', redirectTo: '/monitors');
    }

    public function with(): array
    {
        return [
            'uptime_24h' => $this->calculateUptime(24),
            'avg_response' => $this->calculateAvgResponse(),
            'last_heartbeat' => $this->monitor->heartbeats->first(),
        ];
    }

    protected function calculateUptime(int $hours): float
    {
        $total = $this->monitor
            ->heartbeats()
            ->where('created_at', '>', now()->subHours($hours))
            ->count();
        if ($total === 0) {
            return 100.0;
        }

        $up = $this->monitor
            ->heartbeats()
            ->where('created_at', '>', now()->subHours($hours))
            ->where('status', 'up')
            ->count();
        return round(($up / $total) * 100, 2);
    }

    protected function calculateAvgResponse(): int
    {
        return (int) $this->monitor
            ->heartbeats()
            ->where('created_at', '>', now()->subDay())
            ->avg('response_time') ?? 0;
    }
}; ?>

<div class="p-6">
    <x-header :title="$monitor->name" separator progress-indicator>
        <x-slot:subtitle>
            <div class="flex items-center gap-2 mt-1">
                <x-badge :value="strtoupper($monitor->status)" :class="$monitor->status === 'active' ? 'badge-success' : 'badge-warning'" />
                <span class="opacity-50 text-xs">{{ $monitor->url }}</span>
            </div>
        </x-slot:subtitle>
        <x-slot:actions>
            <x-button label="Back" icon="fas.arrow-left" link="/monitors" class="btn-ghost" />
            <x-button :label="$monitor->status === 'active' ? 'Pause' : 'Resume'" :icon="$monitor->status === 'active' ? 'fas.pause' : 'fas.play'" wire:click="toggleStatus" spinner :class="$monitor->status === 'active' ? 'btn-warning' : 'btn-success'" />
            <x-button icon="fas.trash" class="btn-error" wire:click="delete" wire:confirm="Are you sure?" spinner />
        </x-slot:actions>
    </x-header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <x-card class="bg-base-100 border-none shadow-sm">
            <div class="flex items-center gap-4">
                <div class="p-4 bg-success/10 rounded-xl text-success">
                    <x-icon name="fas.arrow-up" class="w-8 h-8" />
                </div>
                <div>
                    <div class="text-xs opacity-50 uppercase font-bold tracking-wider">Uptime (24h)</div>
                    <div class="text-3xl font-black text-success">{{ $uptime_24h }}%</div>
                </div>
            </div>
        </x-card>

        <x-card class="bg-base-100 border-none shadow-sm">
            <div class="flex items-center gap-4">
                <div class="p-4 bg-info/10 rounded-xl text-info">
                    <x-icon name="fas.bolt" class="w-8 h-8" />
                </div>
                <div>
                    <div class="text-xs opacity-50 uppercase font-bold tracking-wider">Avg Response</div>
                    <div class="text-3xl font-black text-info">{{ $avg_response }}ms</div>
                </div>
            </div>
        </x-card>

        <x-card class="bg-base-100 border-none shadow-sm">
            <div class="flex items-center gap-4">
                <div class="p-4 bg-primary/10 rounded-xl text-primary">
                    <x-icon name="fas.history" class="w-8 h-8" />
                </div>
                <div>
                    <div class="text-xs opacity-50 uppercase font-bold tracking-wider">Last Incident</div>
                    <div class="text-3xl font-black text-primary">
                        {{ $monitor->incidents->first()?->started_at?->diffForHumans() ?? 'None' }}
                    </div>
                </div>
            </div>
        </x-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {{-- Uptime History --}}
        <div class="lg:col-span-2 space-y-8">
            <x-card title="Uptime History" icon="fas.chart-area" separator shadow class="border-none">
                <div class="py-6">
                    <div class="h-24 w-full bg-base-200/50 rounded-xl flex items-end gap-1 p-2 border border-base-300">
                        @foreach ($monitor->heartbeats->reverse() as $hb)
                            <div class="flex-1 rounded-sm {{ $hb->status === 'up' ? 'bg-success h-full' : 'bg-error h-12' }} opacity-{{ $hb->status === 'up' ? '80' : '100' }}"
                                title="{{ $hb->created_at }} - {{ $hb->response_time }}ms"></div>
                        @endforeach
                    </div>
                    <div class="flex justify-between text-[10px] mt-2 opacity-50 font-mono">
                        <span>{{ $monitor->heartbeats->last()?->created_at?->format('H:i') ?? 'N/A' }}</span>
                        <span>Now</span>
                    </div>
                </div>
            </x-card>

            <x-card title="Recent Checks" icon="fas.list-ul" separator shadow class="border-none">
                <x-table :headers="[
                    ['key' => 'id', 'label' => '#'],
                    ['key' => 'status', 'label' => 'Status'],
                    ['key' => 'response_time', 'label' => 'Response'],
                    ['key' => 'created_at', 'label' => 'Time'],
                ]" :rows="$monitor->heartbeats->take(10)">
                    @scope('cell_status', $hb)
                        <x-badge :value="strtoupper($hb->status)" :class="$hb->status === 'up' ? 'badge-success' : 'badge-error'" />
                    @endscope
                    @scope('cell_response_time', $hb)
                        <span class="font-mono text-sm">{{ $hb->response_time }}ms</span>
                    @endscope
                    @scope('cell_created_at', $hb)
                        <span class="text-xs opacity-50">{{ $hb->created_at->diffForHumans() }}</span>
                    @endscope
                </x-table>
            </x-card>
        </div>

        {{-- Incident Sidebar --}}
        <div class="space-y-8">
            <x-card title="Live Incidents" icon="fas.exclamation-circle" separator shadow
                class="border-none bg-error/5 border-l-4 border-l-error">
                <div class="space-y-4">
                    @forelse($monitor->incidents->where('status', 'open') as $incident)
                        <div class="p-3 bg-base-100 rounded shadow-sm">
                            <div class="font-bold text-error">{{ $incident->title }}</div>
                            <div class="text-xs opacity-50">Started {{ $incident->started_at->diffForHumans() }}</div>
                        </div>
                    @empty
                        <div class="text-center py-6">
                            <x-icon name="fas.check-circle" class="w-10 h-10 text-success opacity-20 mb-2" />
                            <div class="text-sm font-bold opacity-30">No active incidents</div>
                        </div>
                    @endforelse
                </div>
            </x-card>

            <x-card title="Technical Info" icon="fas.microchip" separator shadow class="border-none">
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="opacity-50">Type</span>
                        <span class="font-bold capitalize">{{ $monitor->type }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="opacity-50">Interval</span>
                        <span class="font-bold">{{ $monitor->interval }}s</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="opacity-50">Timeout</span>
                        <span class="font-bold">{{ $monitor->timeout }}s</span>
                    </div>
                    @if ($monitor->method)
                        <div class="flex justify-between">
                            <span class="opacity-50">Method</span>
                            <span class="font-bold">{{ $monitor->method }}</span>
                        </div>
                    @endif
                    @if ($monitor->port)
                        <div class="flex justify-between">
                            <span class="opacity-50">Port</span>
                            <span class="font-bold">{{ $monitor->port }}</span>
                        </div>
                    @endif
                </div>
            </x-card>
        </div>
    </div>
</div>
