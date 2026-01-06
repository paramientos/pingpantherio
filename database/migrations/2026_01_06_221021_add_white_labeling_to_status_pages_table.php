<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('status_pages', function (Blueprint $table) {
            $table->string('favicon_url')->nullable()->after('logo_url');
            $table->json('branding')->nullable()->after('favicon_url'); // social links, custom css, etc.
            $table->boolean('hide_branding')->default(false)->after('branding'); // "Powered by PingPanther" toggle
        });
    }

    public function down(): void
    {
        Schema::table('status_pages', function (Blueprint $table) {
            $table->dropColumn(['favicon_url', 'branding', 'hide_branding']);
        });
    }
};
