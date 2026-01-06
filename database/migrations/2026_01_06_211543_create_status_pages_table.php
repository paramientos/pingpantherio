<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('status_pages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_url')->nullable();
            $table->text('description')->nullable();
            $table->string('custom_domain')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('show_uptime')->default(true);
            $table->boolean('show_incidents')->default(true);
            $table->json('theme_colors')->nullable();
            $table->timestamps();
        });

        Schema::create('monitor_status_page', function (Blueprint $table) {
            $table->foreignUuid('monitor_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('status_page_id')->constrained()->cascadeOnDelete();
            $table->integer('display_order')->default(0);
            $table->primary(['monitor_id', 'status_page_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitor_status_page');
        Schema::dropIfExists('status_pages');
    }
};
