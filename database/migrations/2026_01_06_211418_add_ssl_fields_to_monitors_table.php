<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitors', function (Blueprint $table) {
            $table->boolean('check_ssl')->default(false)->after('verify_ssl');
            $table->timestamp('ssl_expires_at')->nullable()->after('check_ssl');
            $table->integer('ssl_days_until_expiry')->nullable()->after('ssl_expires_at');
            $table->string('ssl_issuer')->nullable()->after('ssl_days_until_expiry');
        });
    }

    public function down(): void
    {
        Schema::table('monitors', function (Blueprint $table) {
            $table->dropColumn(['check_ssl', 'ssl_expires_at', 'ssl_days_until_expiry', 'ssl_issuer']);
        });
    }
};
