<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('escalation_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('escalation_policy_id')->constrained('escalation_policies')->cascadeOnDelete();
            $table->foreignUuid('alert_channel_id')->constrained('alert_channels')->cascadeOnDelete();
            $table->integer('delay_minutes')->default(0);
            $table->integer('position')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escalation_rules');
    }
};
