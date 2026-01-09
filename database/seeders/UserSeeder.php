<?php

namespace Database\Seeders;

use App\Enums\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::create([
            'id' => Str::uuid(),
            'name' => 'Demo Admin',
            'email' => 'admin@pingpanther.io',
            'password' => bcrypt('password'),
            'role' => Role::ADMIN,
        ]);
    }
}
