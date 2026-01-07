<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $schedule_id
 * @property string $user_id
 * @property int $order_index
 * @property int $duration_days
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\OnCallSchedule $schedule
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation whereDurationDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation whereOrderIndex($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation whereScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallRotation whereUserId($value)
 * @mixin \Eloquent
 */
class OnCallRotation extends Model
{
    use HasUuids;

    protected $fillable = [
        'schedule_id',
        'user_id',
        'order_index',
        'duration_days',
    ];

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(OnCallSchedule::class, 'schedule_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
