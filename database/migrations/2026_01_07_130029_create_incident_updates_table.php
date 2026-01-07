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
        Schema::create('incident_updates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('incident_id')->constrained()->cascadeOnDelete();
            $table->text('message');
            $table->string('type')->default('update'); // update, investigating, identified, monitoring, resolved
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incident_updates');
    }
};
