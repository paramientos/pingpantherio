<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class PruneOldData extends Command
{
    protected $signature = 'pingpanther:prune';
    protected $description = 'Prune data older than 1 month to keep the database small';

    public function handle()
    {
        $oneMonthAgo = Carbon::now()->subMonth();

        $this->info("Pruning records older than {$oneMonthAgo->toDateTimeString()}...");

        $heartbeatsCount = DB::table('heartbeats')
            ->where('created_at', '<', $oneMonthAgo)
            ->delete();

        $this->info("Deleted $heartbeatsCount heartbeats.");

        $updatesCount = DB::table('incident_updates')
            ->where('created_at', '<', $oneMonthAgo)
            ->delete();

        $this->info("Deleted $updatesCount incident updates.");

        if (Schema::hasTable('audit_logs')) {
            $logsCount = DB::table('audit_logs')
                ->where('created_at', '<', $oneMonthAgo)
                ->delete();

            $this->info("Deleted $logsCount audit logs.");
        }

        $this->info('Pruning complete.');
    }
}
