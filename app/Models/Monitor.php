<?php

namespace App\Models;

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
 * @property string $status
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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AlertChannel> $alertChannels
 * @property-read int|null $alert_channels_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Heartbeat> $heartbeats
 * @property-read int|null $heartbeats_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Incident> $incidents
 * @property-read int|null $incidents_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MaintenanceWindow> $maintenanceWindows
 * @property-read int|null $maintenance_windows_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereCheckSsl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereHeaders($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereKeyword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereLastCheckedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereName($value)
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Monitor whereVerifySsl($value)
 * @mixin \Eloquent
 */
class Monitor extends Model
{
    use HasUuids;

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
    ];

    protected $casts = [
        'headers' => 'array',
        'metadata' => 'array',
        'tags' => 'array',
        'last_checked_at' => 'datetime',
        'verify_ssl' => 'boolean',
        'check_ssl' => 'boolean',
        'ssl_expires_at' => 'datetime',
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
}
