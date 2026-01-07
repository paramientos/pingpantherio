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
        Schema::table('incidents', function (Blueprint $table) {
            $table->string('screenshot_path')->nullable();
            $table->longText('html_snapshot')->nullable();
            $table->json('response_headers')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropColumn(['screenshot_path', 'html_snapshot', 'response_headers']);
        });
    }
};
