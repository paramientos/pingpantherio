<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $condition_type
 * @property array<array-key, mixed> $condition_value
 * @property int|null $threshold
 * @property int|null $duration
 * @property array<array-key, mixed>|null $monitor_ids
 * @property array<array-key, mixed>|null $channel_ids
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereChannelIds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereConditionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereConditionValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereMonitorIds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereThreshold($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertRule whereUserId($value)
 * @mixin \Eloquent
 */
class AlertRule extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'condition_type',
        'condition_value',
        'threshold',
        'duration',
        'monitor_ids',
        'channel_ids',
        'is_active',
    ];

    protected $casts = [
        'condition_value' => 'array',
        'monitor_ids' => 'array',
        'channel_ids' => 'array',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
