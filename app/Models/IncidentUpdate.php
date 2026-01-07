<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidentUpdate extends Model
{
    use HasUuids;

    protected $fillable = [
        'incident_id',
        'message',
        'type',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}
