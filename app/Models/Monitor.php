<?php

namespace App\Models;

use App\Enums\MonitorStatus;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string|null $url
 * @property string $type
 * @property MonitorStatus $status
 * @property int $interval
 * @property int $timeout
 * @property string $method
 * @property array<array-key, mixed>|null $headers
 * @property string|null $keyword
 * @property int|null $port
 * @property bool $verify_ssl
 * @property \Illuminate\Support\Carbon|null $last_checked_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool $check_ssl
 * @property \Illuminate\Support\Carbon|null $ssl_expires_at
 * @property int|null $ssl_days_until_expiry
 * @property string|null $ssl_issuer
 * @property array<array-key, mixed>|null $metadata
 * @property array<array-key, mixed>|null $tags
 * @property string|null $group
 * @property string|null $uuid
 * @property int $grace_period
 * @property \Illuminate\Support\Carbon|null $last_ping_at
 * @property string|null $escalation_policy_id
 * @property string|null $playbook_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AlertChannel> $alertChannels
 * @property-read int|null $alert_channels_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MonitorDependency> $dependencies
 * @property-read int|null $dependencies_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MonitorDependency> $dependents
 * @property-read int|null $dependents_count
 * @property-read \App\Models\EscalationPolicy|null $escalationPolicy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Heartbeat> $heartbeats
 * @property-read int|null $heartbeats_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Incident> $incidents
 * @property-read int|null $incidents_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MaintenanceWindow> $maintenanceWindows
 * @property-read int|null $maintenance_windows_count
 * @property-read \App\Models\Playbook|null $playbook
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RecoveryAction> $recoveryActions
 * @property-read int|null $recovery_actions_count
 * @property-read \App\Models\SlaConfig|null $slaConfig
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereCheckSsl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereEscalationPolicyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereGracePeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereHeaders($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereKeyword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereLastCheckedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereLastPingAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor wherePlaybookId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor wherePort($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereSslDaysUntilExpiry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereSslExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereSslIssuer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereTags($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereTimeout($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereUuid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereVerifySsl($value)
 * @mixin \Eloquent
 */
class Monitor extends Model
{
    use Auditable, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'url',
        'type',
        'status',
        'interval',
        'timeout',
        'method',
        'headers',
        'keyword',
        'port',
        'verify_ssl',
        'last_checked_at',
        'ssl_expires_at',
        'ssl_days_until_expiry',
        'ssl_issuer',
        'check_ssl',
        'metadata',
        'tags',
        'group',
        'uuid',
        'grace_period',
        'last_ping_at',
        'escalation_policy_id',
        'playbook_id',
    ];

    protected $casts = [
        'headers' => 'array',
        'metadata' => 'array',
        'tags' => 'array',
        'last_checked_at' => 'datetime',
        'last_ping_at' => 'datetime',
        'verify_ssl' => 'boolean',
        'check_ssl' => 'boolean',
        'ssl_expires_at' => 'datetime',
        'status' => MonitorStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function heartbeats(): HasMany
    {
        return $this->hasMany(Heartbeat::class);
    }

    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }

    public function alertChannels(): BelongsToMany
    {
        return $this->belongsToMany(AlertChannel::class);
    }

    public function maintenanceWindows(): HasMany
    {
        return $this->hasMany(MaintenanceWindow::class);
    }

    public function recoveryActions(): HasMany
    {
        return $this->hasMany(RecoveryAction::class);
    }

    public function escalationPolicy(): BelongsTo
    {
        return $this->belongsTo(EscalationPolicy::class);
    }

    public function playbook(): BelongsTo
    {
        return $this->belongsTo(Playbook::class);
    }

    public function slaConfig(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(SlaConfig::class);
    }

    public function dependencies(): HasMany
    {
        return $this->hasMany(MonitorDependency::class, 'monitor_id');
    }

    public function dependents(): HasMany
    {
        return $this->hasMany(MonitorDependency::class, 'depends_on_monitor_id');
    }
}
