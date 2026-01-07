<?php

namespace App\Jobs;

use App\Models\ActionLog;
use App\Models\Incident;
use App\Notifications\IncidentAlert;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Traits\SendsAlerts;

class ProcessEscalationStep implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, SendsAlerts;

    public function __construct(
        public Incident $incident,
        public int $stepIndex
    ) {}

    public function handle(): void
    {
        // 1. Check if incident is still active
        if ($this->incident->resolved_at) {
            return;
        }

        $monitor = $this->incident->monitor;
        if (!$monitor || !$monitor->escalation_policy_id) {
            return;
        }

        $policy = $monitor->escalationPolicy;
        $rules = $policy->rules()->orderBy('position')->get();

        if (!isset($rules[$this->stepIndex])) {
            return;
        }

        $rule = $rules[$this->stepIndex];
        $channel = $rule->channel;

        if ($channel && $channel->is_active) {
            $this->sendAlertToChannel($channel, $monitor, $this->incident, 'started');
        }

        // Schedule next step if exists
        if (isset($rules[$this->stepIndex + 1])) {
            $nextRule = $rules[$this->stepIndex + 1];
            
            // Dispatch next step after delay_minutes
            self::dispatch($this->incident, $this->stepIndex + 1)
                ->delay(now()->addMinutes($nextRule->delay_minutes));
        }
    }
}
