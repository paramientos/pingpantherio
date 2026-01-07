<?php

namespace App\Jobs;

use App\Models\CompetitorMonitor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class CheckCompetitors implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private ?CompetitorMonitor $competitor = null)
    {
    }

    public function handle(): void
    {
        if ($this->competitor) {
            $this->check($this->competitor);
            return;
        }

        $competitors = CompetitorMonitor::where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('last_checked_at')
                    ->orWhere('last_checked_at', '<=', now()->subSeconds(60)); // Check every minute if possible
            })
            ->get();

        foreach ($competitors as $competitor) {
            $this->check($competitor);
        }
    }

    private function check(CompetitorMonitor $competitor): void
    {
        $start = microtime(true);
        
        try {
            $response = Http::timeout(10)->get($competitor->url);
            $responseTime = (int) ((microtime(true) - $start) * 1000);
            
            $competitor->update([
                'last_checked_at' => now(),
                'is_up' => $response->successful(),
                'response_time' => $responseTime,
            ]);
        } catch (\Exception $e) {
            $competitor->update([
                'last_checked_at' => now(),
                'is_up' => false,
                'response_time' => 0,
            ]);
        }
    }
}
