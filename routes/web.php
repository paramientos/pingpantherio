<?php

use App\Http\Controllers\AlertChannelController;
use App\Http\Controllers\AlertRuleController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\EscalationPolicyController;
use App\Http\Controllers\CustomDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DomainMonitorController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\MaintenanceWindowController;
use App\Http\Controllers\MonitorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PushMonitorController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SslController;
use App\Http\Controllers\StatusPageController;
use App\Http\Controllers\StatusPageManagementController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::get('/status/{slug}', [StatusPageController::class, 'show'])->name('status-page.show');
Route::get('/ping/{uuid}', [PushMonitorController::class, 'ping'])->name('push.ping');

Route::middleware(['auth'])->group(function (): void {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/ssl', [SslController::class, 'index'])->name('ssl.index');
    Route::resource('escalation-policies', EscalationPolicyController::class);
    Route::resource('monitors', MonitorController::class)->except(['create', 'edit']);
    Route::post('/monitors/{monitor}/recovery-actions', [\App\Http\Controllers\RecoveryActionController::class, 'store'])->name('monitors.recovery-actions.store');
    Route::delete('/recovery-actions/{recoveryAction}', [\App\Http\Controllers\RecoveryActionController::class, 'destroy'])->name('recovery-actions.destroy');
    Route::resource('status-pages', StatusPageManagementController::class);
    Route::resource('alert-channels', AlertChannelController::class);
    Route::get('/incidents', [IncidentController::class, 'index'])->name('incidents.index');
    Route::resource('maintenance-windows', MaintenanceWindowController::class)->only(['index', 'create', 'store', 'destroy']);
    Route::resource('reports', ReportController::class);
    Route::resource('alert-rules', AlertRuleController::class);
    Route::resource('custom-dashboards', CustomDashboardController::class);
    Route::resource('domains', DomainMonitorController::class)->only(['index', 'store', 'destroy']);
    Route::resource('settings/webhooks', \App\Http\Controllers\WebhookController::class);
    Route::resource('settings/api-keys', ApiKeyController::class)->only(['index', 'store', 'destroy']);
    Route::get('/settings/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::resource('settings/teams', TeamController::class)->only(['index', 'store']);
    Route::post('/settings/teams/{team}/invite', [TeamController::class, 'invite'])->name('teams.invite');
    Route::delete('/settings/teams/{team}/members/{user}', [TeamController::class, 'removeMember'])->name('teams.members.destroy');
    Route::get('/invitations/{token}/accept', [TeamController::class, 'acceptInvite'])->name('invitations.accept');
    Route::get('/settings', fn () => redirect()->route('settings.notifications'));
    Route::get('/settings/notifications', [\App\Http\Controllers\SettingsController::class, 'notifications'])->name('settings.notifications');
    Route::post('/settings/notifications', [\App\Http\Controllers\SettingsController::class, 'updateNotifications'])->name('settings.notifications.update');
    Route::get('/settings/preferences', [\App\Http\Controllers\SettingsController::class, 'preferences'])->name('settings.preferences');
    Route::post('/settings/preferences', [\App\Http\Controllers\SettingsController::class, 'updatePreferences'])->name('settings.preferences.update');
    Route::get('/settings/security', [\App\Http\Controllers\SettingsController::class, 'security'])->name('settings.security');
    Route::delete('/settings/security/sessions/{id}', [\App\Http\Controllers\SettingsController::class, 'logoutSession'])->name('settings.sessions.destroy');
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('settings.profile');
});

require __DIR__.'/auth.php';
