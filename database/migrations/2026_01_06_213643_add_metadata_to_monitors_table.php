<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitors', function (Blueprint $table) {
            $table->json('metadata')->nullable()->after('ssl_issuer');
        });

        Schema::table('heartbeats', function (Blueprint $table) {
            $table->json('metadata')->nullable()->after('error');
        });
    }

    public function down(): void
    {
        Schema::table('monitors', function (Blueprint $table) {
            $table->dropColumn('metadata');
        });

        Schema::table('heartbeats', function (Blueprint $table) {
            $table->dropColumn('metadata');
        });
    }
};
