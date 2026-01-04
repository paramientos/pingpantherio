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
        Schema::create('monitors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('url')->nullable();
            $table->string('type')->default('http'); // http, ping, port, keyword
            $table->string('status')->default('active'); // active, paused, pending
            $table->integer('interval')->default(60); // in seconds
            $table->integer('timeout')->default(10); // in seconds
            $table->string('method')->default('GET');
            $table->json('headers')->nullable();
            $table->text('keyword')->nullable(); // For keyword check
            $table->integer('port')->nullable(); // For port check
            $table->boolean('verify_ssl')->default(true);
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitors');
    }
};
