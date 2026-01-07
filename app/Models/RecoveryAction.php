<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RecoveryAction extends Model
{
    use HasUuids, Auditable;

    protected $fillable = [
        'monitor_id',
        'name',
        'type',
        'config',
        'delay_seconds',
        'is_active',
        'max_retries',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(RecoveryLog::class);
    }
}
