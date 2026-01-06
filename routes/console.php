<?php

use App\Jobs\CheckMonitors;
use App\Jobs\CheckSslCertificates;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new CheckMonitors())->everyMinute();
Schedule::job(new CheckSslCertificates())->daily();
