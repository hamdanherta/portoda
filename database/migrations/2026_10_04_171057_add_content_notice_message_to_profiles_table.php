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
            if (!Schema::hasColumn('profiles', 'content_notice_title')) {
                $table->string('content_notice_title')->nullable()->after('content_notice_enabled');
            }
            if (!Schema::hasColumn('profiles', 'content_notice_message')) {
                $table->text('content_notice_message')->nullable()->after('content_notice_title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            if (Schema::hasColumn('profiles', 'content_notice_title')) {
                $table->dropColumn('content_notice_title');
            }
            if (Schema::hasColumn('profiles', 'content_notice_message')) {
                $table->dropColumn('content_notice_message');
            }
        });
    }
};
