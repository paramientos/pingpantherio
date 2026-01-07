<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $recovery_action_id
 * @property string|null $incident_id
 * @property string $status
 * @property string|null $output
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Incident|null $incident
 * @property-read \App\Models\RecoveryAction $recoveryAction
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog whereIncidentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog whereOutput($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog whereRecoveryActionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryLog whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class RecoveryLog extends Model
{
    use HasUuids;

    protected $fillable = [
        'recovery_action_id',
        'incident_id',
        'status',
        'output',
    ];

    public function recoveryAction(): BelongsTo
    {
        return $this->belongsTo(RecoveryAction::class);
    }

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}
