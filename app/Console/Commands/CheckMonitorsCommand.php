<?php

namespace App\Console\Commands;

use App\Jobs\CheckMonitors;
use Illuminate\Console\Command;

class CheckMonitorsCommand extends Command
{
    protected $signature = 'pp:monitors-check';

    protected $description = 'Check all active monitors';

    public function handle(): int
    {
        $this->info('Checking monitors...');

        dispatch(new CheckMonitors());

        $this->info('Monitor check job dispatched!');

        return Command::SUCCESS;
    }
}
