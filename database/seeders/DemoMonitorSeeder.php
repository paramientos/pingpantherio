<?php

namespace Database\Seeders;

use App\Enums\MonitorStatus;
use App\Models\Heartbeat;
use App\Models\Monitor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoMonitorSeeder extends Seeder
{
    public function run(): void
    {
        Model::unguard();
        $user = User::first();

        if (! $user) {
            return;
        }

        $monitors = [
            [
                'name' => 'Google Search',
                'url' => 'https://google.com',
                'type' => 'http',
            ],
            [
                'name' => 'GitHub API',
                'url' => 'https://api.github.com',
                'type' => 'http',
            ],
            [
                'name' => 'Local Database',
                'url' => '127.0.0.1',
                'type' => 'port',
                'port' => 5432,
            ],
        ];

        foreach ($monitors as $data) {
            $monitor = Monitor::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $data['name'],
                'url' => $data['url'],
                'type' => $data['type'],
                'status' => MonitorStatus::UP,
                'interval' => 60,
                'timeout' => 10,
                'method' => 'GET',
                'verify_ssl' => true,
                'port' => $data['port'] ?? null,
                'last_checked_at' => Carbon::now(),
            ]);

            // Generate heartbeats for the last 24 hours
            $now = Carbon::now();
            $heartbeats = [];

            // Create a heartbeat every ~10 minutes to save DB space but show history
            for ($i = 0; $i < 144; $i++) {
                $time = $now->copy()->subMinutes(10 * $i);
                $isUp = true;
                $responseTime = rand(40, 300); // Random latency between 40ms and 300ms

                // Simulate a small downtime 50 iterations ago
                if ($i > 48 && $i < 52) {
                    $isUp = false;
                    $responseTime = 0;
                }

                $heartbeats[] = [
                    'id' => Str::uuid(),
                    'monitor_id' => $monitor->id,
                    'is_up' => $isUp,
                    'status_code' => $isUp ? 200 : 0,
                    'response_time' => $responseTime,
                    'status' => $isUp ? 'up' : 'down',
                    'checked_at' => $time,
                    'created_at' => $time,
                    'updated_at' => $time,
                ];
            }

            Heartbeat::insert($heartbeats);
        }
    }
}
