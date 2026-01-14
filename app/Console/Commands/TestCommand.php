<?php

namespace App\Console\Commands;

use App\Jobs\CheckDomainExpirations;
use Illuminate\Console\Command;

class TestCommand extends Command
{
    protected $signature = 'app:test';

    protected $description = 'Command description';

    public function handle()
    {
        //
    }
}
