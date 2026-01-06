<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityFinding extends Model
{
    use HasUuids, Auditable;

    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'title',
        'description',
        'severity',
        'status',
        'remediation_steps',
        'detected_at',
        'resolved_at',
    ];

    protected $casts = [
        'remediation_steps' => 'array',
        'detected_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
