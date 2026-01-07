<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitors', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
        });

        DB::table('monitors')->where('status', 'active')->update(['status' => 'up']);

        if (Schema::hasTable('competitor_monitors')) {
            Schema::table('competitor_monitors', function (Blueprint $table) {
                $table->string('status')->default('up')->change();
            });
            DB::table('competitor_monitors')->where('status', 'active')->update(['status' => 'up']);
        }
    }

    public function down(): void
    {
        DB::table('monitors')->where('status', 'up')->update(['status' => 'active']);

        Schema::table('monitors', function (Blueprint $table) {
            $table->string('status')->default('active')->change();
        });

        if (Schema::hasTable('competitor_monitors')) {
            DB::table('competitor_monitors')->where('status', 'up')->update(['status' => 'active']);
            Schema::table('competitor_monitors', function (Blueprint $table) {
                $table->string('status')->default('active')->change();
            });
        }
    }
};
