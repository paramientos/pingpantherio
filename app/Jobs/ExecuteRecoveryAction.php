<?php

namespace App\Jobs;

use App\Models\RecoveryAction;
use App\Models\RecoveryLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class ExecuteRecoveryAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected RecoveryAction $action,
        protected string $incidentId
    ) {}

    public function handle(): void
    {
        $log = RecoveryLog::create([
            'recovery_action_id' => $this->action->id,
            'incident_id' => $this->incidentId,
            'status' => 'running',
        ]);

        try {
            $output = '';

            if ($this->action->type === 'webhook') {
                $response = Http::timeout(30)->post($this->action->config['url'], $this->action->config['payload'] ?? []);
                $output = 'HTTP '.$response->status().': '.$response->body();

                if ($response->failed()) {
                    throw new \Exception('Recovery webhook failed: '.$output);
                }
            }
            // SSH desteği ileride eklenebilir

            $log->update([
                'status' => 'success',
                'output' => $output,
            ]);

        } catch (\Exception $e) {
            $log->update([
                'status' => 'failed',
                'output' => $e->getMessage(),
            ]);
        }
    }
}
