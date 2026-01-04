<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    ];

    protected $casts = [
        'headers' => 'array',
        'last_checked_at' => 'datetime',
        'verify_ssl' => 'boolean',
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
}
