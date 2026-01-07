<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $monitor_id
 * @property string $depends_on_monitor_id
 * @property string $relationship_type
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Monitor $dependsOnMonitor
 * @property-read \App\Models\Monitor $monitor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency whereDependsOnMonitorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency whereMonitorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency whereRelationshipType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonitorDependency whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
