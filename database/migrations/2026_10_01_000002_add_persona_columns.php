<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds 'persona' column to portfolio_items (MGD | DPD)
     * Adds MGD & DPD specific tagline/bio fields to profiles.
     */
    public function up(): void
    {
        // Add persona column to portfolio_items
        Schema::table('portfolio_items', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolio_items', 'persona')) {
                $table->string('persona')->nullable()->default('MGD')->after('category');
            }
        });

        // Add MGD / DPD specific fields to profiles
        Schema::table('profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('profiles', 'tagline_mgd')) {
                $table->string('tagline_mgd')->nullable()->after('tagline_en');
            }
            if (!Schema::hasColumn('profiles', 'tagline_mgd_en')) {
                $table->string('tagline_mgd_en')->nullable()->after('tagline_mgd');
            }
            if (!Schema::hasColumn('profiles', 'tagline_dpd')) {
                $table->string('tagline_dpd')->nullable()->after('tagline_mgd_en');
            }
            if (!Schema::hasColumn('profiles', 'tagline_dpd_en')) {
                $table->string('tagline_dpd_en')->nullable()->after('tagline_dpd');
            }
            if (!Schema::hasColumn('profiles', 'bio_mgd')) {
                $table->text('bio_mgd')->nullable()->after('bio_en');
            }
            if (!Schema::hasColumn('profiles', 'bio_mgd_en')) {
                $table->text('bio_mgd_en')->nullable()->after('bio_mgd');
            }
            if (!Schema::hasColumn('profiles', 'bio_dpd')) {
                $table->text('bio_dpd')->nullable()->after('bio_mgd_en');
            }
            if (!Schema::hasColumn('profiles', 'bio_dpd_en')) {
                $table->text('bio_dpd_en')->nullable()->after('bio_dpd');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn('persona');
        });

        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['tagline_mgd', 'tagline_mgd_en', 'tagline_dpd', 'tagline_dpd_en', 'bio_mgd', 'bio_mgd_en', 'bio_dpd', 'bio_dpd_en']);
        });
    }
};
