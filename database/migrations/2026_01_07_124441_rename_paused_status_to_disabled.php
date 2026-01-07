<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('monitors')->where('status', 'paused')->update(['status' => 'disabled']);
        
        if (Schema::hasTable('competitor_monitors')) {
            DB::table('competitor_monitors')->where('status', 'paused')->update(['status' => 'disabled']);
        }
    }

    public function down(): void
    {
        DB::table('monitors')->where('status', 'disabled')->update(['status' => 'paused']);
        
        if (Schema::hasTable('competitor_monitors')) {
            DB::table('competitor_monitors')->where('status', 'disabled')->update(['status' => 'paused']);
        }
    }
};
