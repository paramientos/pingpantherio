<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_mortems', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('incident_id')->constrained('incidents')->cascadeOnDelete();
            $table->foreignUuid('created_by')->constrained('users');
            $table->string('title');
            $table->text('summary')->nullable();
            $table->text('root_cause')->nullable();
            $table->text('impact_analysis')->nullable();
            $table->text('resolution_steps')->nullable();
            $table->text('preventive_measures')->nullable();
            $table->json('timeline')->nullable(); // Array of events
            $table->json('affected_services')->nullable();
            $table->integer('affected_users_count')->nullable();
            $table->string('severity')->nullable(); // low, medium, high, critical
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_mortems');
    }
};
