<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitor_team_user', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('monitor_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('team_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['monitor_id', 'team_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitor_team_user');
    }
};
