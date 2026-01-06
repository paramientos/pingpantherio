<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitors', function (Blueprint $table) {
            $table->uuid('uuid')->unique()->nullable()->after('id'); // Push URL için benzersiz token
            $table->integer('grace_period')->default(5)->after('interval'); // Gecikme toleransı (dakika)
            $table->timestamp('last_ping_at')->nullable()->after('last_checked_at');
        });
    }

    public function down(): void
    {
        Schema::table('monitors', function (Blueprint $table) {
            $table->dropColumn(['uuid', 'grace_period', 'last_ping_at']);
        });
    }
};
