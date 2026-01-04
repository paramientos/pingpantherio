<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="pingpanther">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ isset($title) ? $title . ' - ' . config('app.name') : config('app.name') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen font-sans antialiased bg-base-200">

    {{-- Top Navigation Bar --}}
    <header class="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
        <div class="navbar px-6 max-w-[1920px] mx-auto">
            {{-- Logo --}}
            <div class="navbar-start">
                <x-app-brand />
            </div>

            {{-- Desktop Menu --}}
            <div class="navbar-center hidden lg:flex">
                <ul class="menu menu-horizontal px-1 gap-1">
                    <li>
                        <a href="/" wire:navigate
                            class="font-medium {{ request()->is('/') ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="/monitors" wire:navigate
                            class="font-medium {{ request()->is('monitors*') ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                            Monitors
                        </a>
                    </li>
                    <li>
                        <a href="/incidents" wire:navigate
                            class="font-medium {{ request()->is('incidents*') ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                            Incidents
                        </a>
                    </li>
                    <li>
                        <a href="/status-pages" wire:navigate
                            class="font-medium {{ request()->is('status-pages*') ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                            Status Pages
                        </a>
                    </li>
                </ul>
            </div>

            {{-- User Menu --}}
            <div class="navbar-end gap-2">
                @if ($user = auth()->user())
                    <div class="dropdown dropdown-end">
                        <label tabindex="0"
                            class="btn btn-ghost btn-sm gap-2 text-slate-300 hover:text-white normal-case">
                            <div class="avatar placeholder">
                                <div class="bg-primary text-white rounded-full w-8">
                                    <span class="text-xs">{{ strtoupper(substr($user->name, 0, 2)) }}</span>
                                </div>
                            </div>
                            <span class="hidden md:inline">{{ $user->name }}</span>
                            <i class="fas fa-chevron-down text-xs"></i>
                        </label>
                        <ul tabindex="0"
                            class="dropdown-content z-[1] menu p-2 shadow-xl bg-slate-800 rounded-box w-56 mt-3 border border-slate-700">
                            <li class="menu-title">
                                <span class="text-slate-400 text-xs">{{ $user->email }}</span>
                            </li>
                            <div class="divider my-1"></div>
                            <li><a href="/settings/notifications" wire:navigate
                                    class="text-slate-300 hover:text-white"><i class="fas fa-cog"></i> Settings</a></li>
                            <li><a href="/settings/team" wire:navigate class="text-slate-300 hover:text-white"><i
                                        class="fas fa-users"></i> Team</a></li>
                            <li><a href="/settings/api" wire:navigate class="text-slate-300 hover:text-white"><i
                                        class="fas fa-key"></i> API Keys</a></li>
                            <div class="divider my-1"></div>
                            <li><a href="/logout" class="text-error hover:bg-error/10"><i
                                        class="fas fa-sign-out-alt"></i> Logout</a></li>
                        </ul>
                    </div>
                @endif

                {{-- Mobile Menu Toggle --}}
                <div class="dropdown dropdown-end lg:hidden">
                    <label tabindex="0" class="btn btn-ghost btn-square text-slate-300">
                        <i class="fas fa-bars"></i>
                    </label>
                    <ul tabindex="0"
                        class="dropdown-content z-[1] menu p-2 shadow-xl bg-slate-800 rounded-box w-52 mt-3 border border-slate-700">
                        <li><a href="/" wire:navigate class="text-slate-300 hover:text-white"><i
                                    class="fas fa-chart-pie"></i> Dashboard</a></li>
                        <li><a href="/monitors" wire:navigate class="text-slate-300 hover:text-white"><i
                                    class="fas fa-desktop"></i> Monitors</a></li>
                        <li><a href="/incidents" wire:navigate class="text-slate-300 hover:text-white"><i
                                    class="fas fa-exclamation-triangle"></i> Incidents</a></li>
                        <li><a href="/status-pages" wire:navigate class="text-slate-300 hover:text-white"><i
                                    class="fas fa-broadcast-tower"></i> Status Pages</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>

    {{-- Main Content --}}
    <main class="min-h-[calc(100vh-65px)]">
        {{ $slot }}
    </main>

    {{-- Toast Notifications --}}
    <x-toast />

</body>

</html>
