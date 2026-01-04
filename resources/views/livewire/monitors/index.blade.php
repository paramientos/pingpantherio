<?php

use App\Models\Monitor;
use Illuminate\Database\Eloquent\Builder;
use Livewire\Volt\Component;
use Livewire\WithPagination;
use Mary\Traits\Toast;

new class extends Component {
    use Toast;
    use WithPagination;

    public string $search = '';

    public string $filterType = '';

    public string $filterStatus = '';

    public bool $monitorDrawer = false;

    public ?Monitor $selectedMonitor = null;

    // Form fields
    public string $name = '';

    public ?string $url = null;

    public string $type = 'http';

    public string $status = 'active';

    public int $interval = 60;

    public int $timeout = 10;

    public string $method = 'GET';

    public ?string $keyword = null;

    public ?int $port = null;

    public bool $verify_ssl = true;

    public string $formHeaders = '';

    public array $sortBy = ['column' => 'name', 'direction' => 'asc'];

    public function clearFilters(): void
    {
        $this->reset(['search', 'filterType', 'filterStatus']);
    }

    public function clearForm(): void
    {
        $this->reset(['selectedMonitor', 'name', 'url', 'type', 'status', 'interval', 'timeout', 'method', 'keyword', 'port', 'verify_ssl', 'formHeaders', 'monitorDrawer']);
    }

    public function create(): void
    {
        $this->clearForm();
        $this->monitorDrawer = true;
    }

    public function edit(Monitor $monitor): void
    {
        $this->selectedMonitor = $monitor;
        $this->name = $monitor->name;
        $this->url = $monitor->url;
        $this->type = $monitor->type;
        $this->status = $monitor->status;
        $this->interval = $monitor->interval;
        $this->timeout = $monitor->timeout;
        $this->method = $monitor->method;
        $this->keyword = $monitor->keyword;
        $this->port = $monitor->port;
        $this->verify_ssl = $monitor->verify_ssl;
        $this->formHeaders = json_encode($monitor->headers ?? [], JSON_PRETTY_PRINT);

        $this->monitorDrawer = true;
    }

    public function save(): void
    {
        $rules = [
            'name' => 'required|min:3',
            'type' => 'required|in:http,ping,port,keyword',
            'interval' => 'required|integer|min:10',
            'timeout' => 'required|integer|min:1',
        ];

        if ($this->type === 'http' || $this->type === 'keyword') {
            $rules['url'] = 'required|url';
        }

        if ($this->type === 'port') {
            $rules['port'] = 'required|integer|min:1|max:65535';
        }

        $this->validate($rules);

        $data = [
            'name' => $this->name,
            'url' => $this->url,
            'type' => $this->type,
            'status' => $this->status,
            'interval' => $this->interval,
            'timeout' => $this->timeout,
            'method' => $this->method,
            'keyword' => $this->keyword,
            'port' => $this->port,
            'verify_ssl' => $this->verify_ssl,
            'headers' => json_decode($this->formHeaders, true) ?? [],
        ];

        if ($this->selectedMonitor) {
            $this->selectedMonitor->update($data);
            $this->success('Monitor updated successfully.');
        } else {
            $data['user_id'] = auth()->id();
            Monitor::create($data);
            $this->success('Monitor created successfully.');
        }

        $this->clearForm();
    }

    public function delete(Monitor $monitor): void
    {
        $monitor->delete();
        $this->success('Monitor deleted.');
    }

    public function toggleStatus(Monitor $monitor): void
    {
        $monitor->status = $monitor->status === 'active' ? 'paused' : 'active';
        $monitor->save();
        $this->success('Monitor status updated.');
    }

    public function monitors(): mixed
    {
        return Monitor::query()->when($this->search, fn(Builder $q) => $q->arrayLike(['name', 'url'], $this->search))->when($this->filterType, fn(Builder $q) => $q->where('type', $this->filterType))->when($this->filterStatus, fn(Builder $q) => $q->where('status', $this->filterStatus))->orderBy($this->sortBy['column'], $this->sortBy['direction'])->paginate(10);
    }

    public function with(): array
    {
        return [
            'rows' => $this->monitors(),
            'headers' => [['key' => 'name', 'label' => 'Monitor Name', 'class' => 'w-72'], ['key' => 'type', 'label' => 'Type', 'class' => 'w-32'], ['key' => 'interval', 'label' => 'Interval', 'class' => 'w-32'], ['key' => 'last_checked_at', 'label' => 'Last Check', 'class' => 'w-48'], ['key' => 'status', 'label' => 'Status', 'class' => 'w-32'], ['key' => 'actions', 'label' => '', 'sortable' => false]],
            'typeOptions' => [['id' => 'http', 'name' => 'HTTP/HTTPS'], ['id' => 'ping', 'name' => 'Ping (ICMP)'], ['id' => 'port', 'name' => 'Port (TCP)'], ['id' => 'keyword', 'name' => 'Keyword Check']],
            'statusOptions' => [['id' => 'active', 'name' => 'Active'], ['id' => 'paused', 'name' => 'Paused'], ['id' => 'pending', 'name' => 'Pending']],
        ];
    }
}; ?>

<div class="p-6 max-w-7xl mx-auto">
    <x-header title="Monitors" separator progress-indicator>
        <x-slot:subtitle>
            <div class="flex items-center gap-4 mt-1 opacity-70">
                <span class="flex items-center gap-1"><i class="fas.check-circle text-success"></i>
                    {{ $rows->where('status', 'active')->count() }} Active</span>
                <span class="flex items-center gap-1"><i class="fas.pause-circle text-warning"></i>
                    {{ $rows->where('status', 'paused')->count() }} Paused</span>
            </div>
        </x-slot:subtitle>
        <x-slot:actions>
            <x-button label="Add New Monitor" icon="fas.plus" class="btn-primary shadow-lg shadow-primary/20"
                wire:click="create" spinner />
        </x-slot:actions>
    </x-header>

    <div class="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex-1 w-full max-w-sm">
            <x-input placeholder="Search by name, URL..." wire:model.live.debounce="search" icon="fas.search"
                class="bg-base-100" />
        </div>
        <div class="flex gap-2">
            <x-select :options="$typeOptions" wire:model.live="filterType" placeholder="Any Type" class="w-40 bg-base-100" />
            <x-select :options="$statusOptions" wire:model.live="filterStatus" placeholder="Any Status"
                class="w-40 bg-base-100" />
            <x-button icon="fas.sync-alt" wire:click="$refresh" spinner class="btn-ghost" />
        </div>
    </div>

    {{-- Main Content --}}
    <x-card class="overflow-hidden">
        <x-table :headers="$headers" :rows="$rows" :sort-by="$sortBy" with-pagination link="/monitors/{id}">
            @scope('cell_name', $monitor)
                <div class="flex items-start gap-3">
                    <div class="mt-1.5 flex items-center">
                        <span
                            class="status-dot {{ $monitor->status === 'active' ? 'status-dot-up animate-status-pulse' : 'status-dot-paused' }}"></span>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-900 dark:text-white leading-none mb-1">{{ $monitor->name }}</span>
                        <div class="flex items-center gap-2 opacity-50 text-[11px] font-mono tracking-tight">
                            @if ($monitor->url)
                                <span class="truncate max-w-[240px]">{{ $monitor->url }}</span>
                            @else
                                <span>Port: {{ $monitor->port }}</span>
                            @endif
                            <i class="fas.external-link-alt text-[9px]"></i>
                        </div>
                    </div>
                </div>
            @endscope

            @scope('cell_type', $monitor)
                <div class="flex items-center gap-2 px-2 py-1 bg-base-200 rounded-md w-fit">
                    <x-icon
                        name="{{ match ($monitor->type) {
                            'http' => 'fas.globe',
                            'ping' => 'fas.network-wired',
                            'port' => 'fas.plug',
                            'keyword' => 'fas.font',
                            default => 'fas.circle',
                        } }}"
                        class="w-3 h-3 opacity-60" />
                    <span class="text-[10px] font-bold uppercase tracking-wider opacity-70">{{ $monitor->type }}</span>
                </div>
            @endscope

            @scope('cell_interval', $monitor)
                <div class="flex flex-col">
                    <span class="text-xs font-semibold">{{ $monitor->interval }}s</span>
                    <span class="text-[10px] opacity-40 uppercase">Every</span>
                </div>
            @endscope

            @scope('cell_status', $monitor)
                @php
                    $statusClass = match ($monitor->status) {
                        'active' => 'bg-success/10 text-success border-success/20',
                        'paused' => 'bg-warning/10 text-warning border-warning/20',
                        default => 'bg-slate-100 text-slate-500 border-slate-200',
                    };
                @endphp
                <span class="px-2 py-0.5 rounded text-[10px] font-black border {{ $statusClass }}">
                    {{ strtoupper($monitor->status) }}
                </span>
            @endscope

            @scope('cell_last_checked_at', $monitor)
                <div class="flex flex-col items-end text-right">
                    <span class="text-xs font-medium">
                        {{ $monitor->last_checked_at ? $monitor->last_checked_at->diffForHumans() : 'Never' }}
                    </span>
                    @if ($monitor->last_checked_at)
                        <span
                            class="text-[10px] opacity-40 font-mono">{{ $monitor->last_checked_at->format('H:i:s') }}</span>
                    @endif
                </div>
            @endscope

            @scope('actions', $monitor)
                <div class="flex gap-1 justify-end" @click.stop>
                    <x-button icon="{{ $monitor->status === 'active' ? 'fas.pause' : 'fas.play' }}"
                        wire:click="toggleStatus('{{ $monitor->id }}')" spinner
                        class="btn-ghost btn-xs text-slate-400 hover:text-{{ $monitor->status === 'active' ? 'warning' : 'success' }}"
                        tooltip="{{ $monitor->status === 'active' ? 'Pause' : 'Resume' }}" />

                    <x-button icon="fas.edit" wire:click="edit('{{ $monitor->id }}')" spinner
                        class="btn-ghost btn-xs text-slate-400 hover:text-info" tooltip="Edit" />

                    <x-button icon="fas.trash" wire:click="delete('{{ $monitor->id }}')"
                        wire:confirm="Silmek istediğinizden emin misiniz?" spinner
                        class="btn-ghost btn-xs text-slate-400 hover:text-error" tooltip="Delete" />
                </div>
            @endscope
        </x-table>
    </x-card>

    {{-- Monitor Create/Edit Drawer --}}
    <x-drawer wire:model="monitorDrawer" :title="$selectedMonitor ? 'Edit Monitor' : 'New Monitor'" right separator with-close-button class="lg:w-1/3">
        <x-form wire:submit="save">
            <x-tabs selected="general">
                <x-tab name="general" label="General" icon="fas.info-circle">
                    <div class="space-y-4 mt-4">
                        <x-input label="Friendly Name" wire:model="name" placeholder="e.g. Main API Server"
                            icon="fas.tag" hint="A descriptive name for your monitor" />

                        <x-select label="Monitor Type" :options="$typeOptions" wire:model.live="type"
                            icon="fas.layer-group" />

                        @if (in_array($type, ['http', 'keyword']))
                            <x-input label="URL / Endpoint" wire:model="url"
                                placeholder="https://api.example.com/health" icon="fas.link" />
                        @endif

                        @if ($type === 'port')
                            <x-input label="Hostname / IP" wire:model="url" placeholder="192.168.1.1 or server.local"
                                icon="fas.network-wired" />
                            <x-input label="Port" wire:model="port" type="number" placeholder="80" icon="fas.plug" />
                        @endif

                        @if ($type === 'keyword')
                            <x-input label="Keyword to find" wire:model="keyword" placeholder="Status: OK"
                                icon="fas.search" />
                        @endif
                    </div>
                </x-tab>

                <x-tab name="settings" label="Settings" icon="fas.cog">
                    <div class="space-y-4 mt-4">
                        <div class="grid grid-cols-2 gap-4">
                            <x-input label="Check Interval" wire:model="interval" type="number" suffix="sec"
                                icon="fas.stopwatch" />
                            <x-input label="Timeout" wire:model="timeout" type="number" suffix="sec"
                                icon="fas.hourglass-half" />
                        </div>

                        @if (in_array($type, ['http', 'keyword']))
                            <x-select label="Request Method" :options="[
                                ['id' => 'GET', 'name' => 'GET'],
                                ['id' => 'POST', 'name' => 'POST'],
                                ['id' => 'HEAD', 'name' => 'HEAD'],
                            ]" wire:model="method"
                                icon="fas.exchange-alt" />
                            <x-checkbox label="Verify SSL Certificate" wire:model="verify_ssl" tight />
                        @endif

                        <x-select label="Initial Status" :options="$statusOptions" wire:model="status" />
                    </div>
                </x-tab>

                @if (in_array($type, ['http', 'keyword']))
                    <x-tab name="headers" label="Headers" icon="fas.file-code">
                        <div class="mt-4">
                            <x-textarea label="Custom Headers (JSON)" wire:model="formHeaders"
                                placeholder='{"Authorization": "Bearer ...", "X-Custom": "Value"}' rows="8" />
                            <span class="text-[10px] opacity-50">Enter headers in JSON format.</span>
                        </div>
                    </x-tab>
                @endif
            </x-tabs>

            <x-slot:actions>
                <x-button label="Cancel" @click="$wire.monitorDrawer = false" />
                <x-button :label="$selectedMonitor ? 'Update Monitor' : 'Create Monitor'" icon="fas.check" class="btn-primary" type="submit" spinner="save" />
            </x-slot:actions>
        </x-form>
    </x-drawer>

    {{-- Filters Drawer --}}
    <x-drawer wire:model="drawer" title="Filter Monitors" right separator with-close-button class="lg:w-1/4">
        <div class="space-y-6">
            <x-input label="Search" wire:model.live.debounce="search" icon="fas.search"
                placeholder="Name or URL..." />

            <x-select label="Type" :options="$typeOptions" wire:model.live="filterType" placeholder="All Types" />

            <x-select label="Status" :options="$statusOptions" wire:model.live="filterStatus" placeholder="All Status" />
        </div>

        <x-slot:actions>
            <x-button label="Reset Filters" icon="fas.undo" wire:click="clearFilters" spinner />
            <x-button label="Close" icon="fas.times" class="btn-ghost" @click="$wire.drawer = false" />
        </x-slot:actions>
    </x-drawer>
</div>
