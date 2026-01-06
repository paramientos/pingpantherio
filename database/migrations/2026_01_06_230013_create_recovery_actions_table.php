<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recovery_actions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('monitor_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['webhook', 'ssh', 'restart_process']); // Eylem tipi
            $table->json('config'); // URL, Command, Credentials vb.
            $table->integer('delay_seconds')->default(0); // Hata görüldükten ne kadar sonra çalışsın?
            $table->boolean('is_active')->default(true);
            $table->integer('max_retries')->default(1);
            $table->timestamps();
        });

        // Kurtarma eylemlerinin logları
        Schema::create('recovery_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recovery_action_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('incident_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['running', 'success', 'failed']);
            $table->text('output')->nullable(); // SSH çıktısı veya HTTP response
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recovery_logs');
        Schema::dropIfExists('recovery_actions');
    }
};
