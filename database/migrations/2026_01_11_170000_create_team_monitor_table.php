<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_monitor', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('monitor_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['team_id', 'monitor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_monitor');
    }
};
