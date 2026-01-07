<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonitorDependency extends Model
{
    use HasUuids;

    protected $fillable = [
        'monitor_id',
        'depends_on_monitor_id',
        'relationship_type',
        'description',
    ];

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class, 'monitor_id');
    }

    public function dependsOnMonitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class, 'depends_on_monitor_id');
    }
}
