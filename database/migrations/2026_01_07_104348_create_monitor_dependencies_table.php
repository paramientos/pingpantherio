<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitor_dependencies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('monitor_id')->constrained('monitors')->cascadeOnDelete();
            $table->foreignUuid('depends_on_monitor_id')->constrained('monitors')->cascadeOnDelete();
            $table->string('relationship_type')->default('depends_on'); // depends_on, impacts, related
            $table->text('description')->nullable();
            $table->timestamps();

            // Prevent duplicate dependencies
            $table->unique(['monitor_id', 'depends_on_monitor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitor_dependencies');
    }
};
