<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $escalation_policy_id
 * @property string $alert_channel_id
 * @property int $delay_minutes
 * @property int $position
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $on_call_schedule_id
 * @property-read \App\Models\AlertChannel $channel
 * @property-read \App\Models\OnCallSchedule|null $onCallSchedule
 * @property-read \App\Models\EscalationPolicy $policy
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule whereAlertChannelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule whereDelayMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule whereEscalationPolicyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule whereOnCallScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule wherePosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationRule whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class EscalationRule extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'escalation_policy_id',
        'alert_channel_id',
        'delay_minutes',
        'position',
        'on_call_schedule_id',
    ];

    public function policy(): BelongsTo
    {
        return $this->belongsTo(EscalationPolicy::class, 'escalation_policy_id');
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(AlertChannel::class, 'alert_channel_id');
    }

    public function onCallSchedule(): BelongsTo
    {
        return $this->belongsTo(OnCallSchedule::class, 'on_call_schedule_id');
    }
}
