<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompetitorMonitor extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'url',
        'company_name',
        'description',
        'status',
        'interval',
        'last_checked_at',
        'is_up',
        'response_time',
    ];

    protected $casts = [
        'last_checked_at' => 'datetime',
        'is_up' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
