<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alert_channels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type');
            $table->json('config');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('alert_channel_monitor', function (Blueprint $table) {
            $table->foreignUuid('alert_channel_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('monitor_id')->constrained()->cascadeOnDelete();
            $table->primary(['alert_channel_id', 'monitor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alert_channel_monitor');
        Schema::dropIfExists('alert_channels');
    }
};
