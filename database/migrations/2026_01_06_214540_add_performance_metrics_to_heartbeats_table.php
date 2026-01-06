<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('heartbeats', function (Blueprint $table) {
            $table->float('dns_time', 8, 2)->nullable()->after('response_time');
            $table->float('connect_time', 8, 2)->nullable()->after('dns_time');
            $table->float('ttfb', 8, 2)->nullable()->after('connect_time');
        });
    }

    public function down(): void
    {
        Schema::table('heartbeats', function (Blueprint $table) {
            $table->dropColumn(['dns_time', 'connect_time', 'ttfb']);
        });
    }
};
