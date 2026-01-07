<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('escalation_rules', function (Blueprint $table) {
            $table->foreignUuid('on_call_schedule_id')->nullable()->constrained('on_call_schedules')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('escalation_rules', function (Blueprint $table) {
            $table->dropForeign(['on_call_schedule_id']);
            $table->dropColumn('on_call_schedule_id');
        });
    }
};
