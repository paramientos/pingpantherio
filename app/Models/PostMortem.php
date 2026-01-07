<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostMortem extends Model
{
    use HasUuids;

    protected $fillable = [
        'incident_id',
        'created_by',
        'title',
        'summary',
        'root_cause',
        'impact_analysis',
        'resolution_steps',
        'preventive_measures',
        'timeline',
        'affected_services',
        'affected_users_count',
        'severity',
        'published_at',
    ];

    protected $casts = [
        'timeline' => 'array',
        'affected_services' => 'array',
        'published_at' => 'datetime',
    ];

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
