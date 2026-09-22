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
        Schema::table('profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('profiles', 'content_notice_enabled')) {
                $table->boolean('content_notice_enabled')->default(true)->after('maintenance_mode');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            if (Schema::hasColumn('profiles', 'content_notice_enabled')) {
                $table->dropColumn('content_notice_enabled');
            }
        });
    }
};
