<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sla_configs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('monitor_id')->constrained('monitors')->cascadeOnDelete();
            $table->string('name');
            $table->decimal('uptime_target', 5, 2)->default(99.9); // 99.9%
            $table->integer('max_downtime_minutes_monthly')->nullable(); // e.g., 43 minutes/month for 99.9%
            $table->decimal('response_time_target', 8, 2)->nullable(); // e.g., 500ms
            $table->string('period')->default('monthly'); // monthly, weekly, daily
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sla_configs');
    }
};
