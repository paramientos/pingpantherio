<?php

namespace App\Console\Commands;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateAdminUser extends Command
{
    protected $signature = 'user:create-admin {email} {password}';
    protected $description = 'Create an admin user with specified email and password';

    public function handle(): int
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->error("User with email {$email} already exists!");
            return self::FAILURE;
        }

        // Create the admin user
        $user = User::create([
            'id' => Str::uuid(),
            'name' => explode('@', $email)[0], // Use email prefix as name
            'email' => $email,
            'password' => bcrypt($password),
            'role' => Role::ADMIN,
        ]);

        $this->info("✓ Admin user created successfully!");
        $this->line("  Email: {$user->email}");
        $this->line("  Password: {$password}");

        return self::SUCCESS;
    }
}
