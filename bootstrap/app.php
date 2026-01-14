<?php

use App\Console\Commands\PruneOldData;
use App\Jobs\CheckDomainExpirations;
use App\Jobs\CheckMonitors;
use App\Jobs\CheckSslCertificates;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withSchedule(function (Schedule $schedule): void {
        $schedule->job(new CheckMonitors)->everyMinute();
        $schedule->job(new CheckSslCertificates)->daily();
        $schedule->job(new CheckDomainExpirations)->daily();

        $schedule->command(PruneOldData::class)->daily();
    })
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\ForcePasswordChange::class,
            \App\Http\Middleware\TeamAccessMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
