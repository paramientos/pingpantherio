<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetUserPassword extends Command
{
    protected $signature = 'pp:reset-password';
    protected $description = 'Reset a user password by email';

    public function handle(): int
    {
        $email = $this->ask('Enter user email address');

        if (empty($email)) {
            $this->error('Email address is required.');
            return Command::FAILURE;
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return Command::FAILURE;
        }

        $this->info("User found: {$user->name} ({$user->email})");
        
        $password = $this->secret('Enter new password');

        if (empty($password)) {
            $this->error('Password cannot be empty.');
            return Command::FAILURE;
        }

        $user->password = Hash::make($password);
        $user->save();

        $this->info("✓ Password successfully reset for user: {$user->name} ({$user->email})");
        
        return Command::SUCCESS;
    }
}
