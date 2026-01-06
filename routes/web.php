<?php

use App\Http\Controllers\AlertChannelController;
use App\Http\Controllers\AlertRuleController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\CustomDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\MaintenanceWindowController;
use App\Http\Controllers\MonitorController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StatusPageController;
use App\Http\Controllers\StatusPageManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/status/{slug}', [StatusPageController::class, 'show'])->name('status-page.show');

Route::middleware(['auth'])->group(function (): void {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('monitors', MonitorController::class)->except(['create', 'edit']);
    Route::resource('status-pages', StatusPageManagementController::class);
    Route::resource('alert-channels', AlertChannelController::class);
    Route::get('/incidents', [IncidentController::class, 'index'])->name('incidents.index');
    Route::resource('maintenance-windows', MaintenanceWindowController::class)->only(['index', 'create', 'store', 'destroy']);
    Route::resource('api-keys', ApiKeyController::class)->only(['index', 'store', 'destroy']);
    Route::resource('reports', ReportController::class);
    Route::resource('alert-rules', AlertRuleController::class);
    Route::resource('custom-dashboards', CustomDashboardController::class);
});

require __DIR__.'/auth.php';
