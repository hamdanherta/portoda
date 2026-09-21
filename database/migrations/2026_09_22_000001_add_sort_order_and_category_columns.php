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
        Schema::table('documents', function (Blueprint $table) {
            if (!Schema::hasColumn('documents', 'category')) {
                $table->string('category')->nullable()->after('type');
            }
            if (!Schema::hasColumn('documents', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('file_name');
            }
        });

        Schema::table('certificates', function (Blueprint $table) {
            if (!Schema::hasColumn('certificates', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('gallery');
            }
        });

        Schema::table('experiences', function (Blueprint $table) {
            if (!Schema::hasColumn('experiences', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('media');
            }
        });

        Schema::table('contacts', function (Blueprint $table) {
            if (!Schema::hasColumn('contacts', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('subtext_en');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['category', 'sort_order']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropColumn(['sort_order']);
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn(['sort_order']);
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn(['sort_order']);
        });
    }
};
