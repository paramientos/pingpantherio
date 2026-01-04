<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MonitorController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function (): void {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('monitors', MonitorController::class)->except(['show', 'create', 'edit']);
});

require __DIR__.'/auth.php';
