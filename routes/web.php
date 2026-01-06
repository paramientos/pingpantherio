<?php

use App\Http\Controllers\AlertChannelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MonitorController;
use App\Http\Controllers\StatusPageController;
use App\Http\Controllers\StatusPageManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/status/{slug}', [StatusPageController::class, 'show'])->name('status-page.show');

Route::middleware(['auth'])->group(function (): void {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('monitors', MonitorController::class)->except(['create', 'edit']);
    Route::resource('status-pages', StatusPageManagementController::class);
    Route::resource('alert-channels', AlertChannelController::class);
});

require __DIR__.'/auth.php';
