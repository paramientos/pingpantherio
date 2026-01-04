@props([
    'search' => null,
    'drawer' => 'drawer',
])

<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-2 flex-1 max-w-sm">
        @if ($search !== null)
            <x-input placeholder="Hızlı ara..." wire:model.live.debounce="search" clearable icon="fas.search"
                class="w-full bg-base-100 border-none shadow-sm" />
        @endif
    </div>

    <div class="flex items-center gap-2">
        {{ $slot }}

        <x-button label="Gelişmiş Filtre" icon="fas.sliders-h" @click="$wire.{{ $drawer }} = true"
            class="btn-ghost shadow-sm bg-base-100 border-none" />
    </div>
</div>
