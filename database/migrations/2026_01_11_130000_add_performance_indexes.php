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
        // Heartbeats are queried by monitor_id and created_at frequently
        Schema::table('heartbeats', function (Blueprint $table) {
            $table->index(['monitor_id']);
        });

        // Incidents are often filtered by monitor_id, status, and created_at
        Schema::table('incidents', function (Blueprint $table) {
            $table->index(['monitor_id', 'status']);
            $table->index('created_at');
        });

        // Monitors are often queried by user_id and status
        Schema::table('monitors', function (Blueprint $table) {
            $table->index(['user_id', 'status']);
        });

        // Team members are queried by team_id and user_id
        Schema::table('team_user', function (Blueprint $table) {
            $table->index(['team_id', 'user_id']);
        });

        // Monitor permissions are queried by team_id and user_id
        Schema::table('monitor_team_user', function (Blueprint $table) {
            $table->index(['team_id', 'user_id']);
            $table->index('monitor_id');
        });

        // Incident updates are queried by incident_id
        Schema::table('incident_updates', function (Blueprint $table) {
            $table->index('incident_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('heartbeats', function (Blueprint $table) {
            $table->dropIndex(['monitor_id', 'created_at']);
        });

        Schema::table('incidents', function (Blueprint $table) {
            $table->dropIndex(['monitor_id', 'status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('monitors', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'status']);
        });

        Schema::table('team_user', function (Blueprint $table) {
            $table->dropIndex(['team_id', 'user_id']);
        });

        Schema::table('monitor_team_user', function (Blueprint $table) {
            $table->dropIndex(['team_id', 'user_id']);
            $table->dropIndex(['monitor_id']);
        });

        Schema::table('incident_updates', function (Blueprint $table) {
            $table->dropIndex(['incident_id']);
        });
    }
};
