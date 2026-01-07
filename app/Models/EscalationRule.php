<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EscalationRule extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'escalation_policy_id',
        'alert_channel_id',
        'delay_minutes',
        'position',
    ];

    public function policy(): BelongsTo
    {
        return $this->belongsTo(EscalationPolicy::class, 'escalation_policy_id');
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(AlertChannel::class, 'alert_channel_id');
    }
}
