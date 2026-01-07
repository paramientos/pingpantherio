<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competitor_monitors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('url');
            $table->string('company_name')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('active'); // active, paused
            $table->integer('interval')->default(300); // seconds
            $table->timestamp('last_checked_at')->nullable();
            $table->boolean('is_up')->nullable();
            $table->integer('response_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competitor_monitors');
    }
};
