<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
