<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MonitorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Demo Admin',
            'email' => 'admin@pingpanther.io',
            'password' => bcrypt('password'),
            'role' => \App\Enums\Role::ADMIN,
        ]);

        $monitors = [
            ['name' => 'PingPanther Landing', 'url' => 'https://pingpanther.io', 'type' => 'http'],
            ['name' => 'Main API Gateway', 'url' => 'https://api.pingpanther.io/health', 'type' => 'http'],
            ['name' => 'Global Database Cluster', 'url' => '127.0.0.1', 'type' => 'ping'],
            ['name' => 'Auth Service (EU-West)', 'url' => 'https://auth.pingpanther.io', 'type' => 'http'],
        ];

        foreach ($monitors as $m) {
            $monitor = \App\Models\Monitor::create(array_merge($m, [
                'user_id' => $user->id,
                'status' => 'active',
                'interval' => 60,
                'last_checked_at' => now()->subMinutes(rand(1, 10)),
            ]));

            // Add some heartbeats
            for ($i = 0; $i < 10; $i++) {
                $status = rand(0, 10) > 1 ? 'up' : 'down';
                \App\Models\Heartbeat::create([
                    'monitor_id' => $monitor->id,
                    'status' => $status,
                    'status_code' => $status === 'up' ? 200 : 503,
                    'response_time' => rand(100, 500),
                    'created_at' => now()->subMinutes($i * 5),
                ]);
            }
        }

        // Add an open incident
        \App\Models\Incident::create([
            'monitor_id' => \App\Models\Monitor::first()->id,
            'title' => 'DDoS Attack Detected',
            'description' => 'Unusual traffic patterns reaching the landing page.',
            'status' => 'open',
            'started_at' => now()->subHours(2),
        ]);
    }
}
