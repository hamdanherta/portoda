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
        // Add MS specific tagline/bio fields to profiles
        Schema::table('profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('profiles', 'tagline_ms')) {
                $table->string('tagline_ms')->nullable()->after('tagline_dpd_en');
            }
            if (!Schema::hasColumn('profiles', 'tagline_ms_en')) {
                $table->string('tagline_ms_en')->nullable()->after('tagline_ms');
            }
            if (!Schema::hasColumn('profiles', 'bio_ms')) {
                $table->text('bio_ms')->nullable()->after('bio_dpd_en');
            }
            if (!Schema::hasColumn('profiles', 'bio_ms_en')) {
                $table->text('bio_ms_en')->nullable()->after('bio_ms');
            }
        });

        // Create software_skills table
        if (!Schema::hasTable('software_skills')) {
            Schema::create('software_skills', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->longText('image');
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['tagline_ms', 'tagline_ms_en', 'bio_ms', 'bio_ms_en']);
        });

        Schema::dropIfExists('software_skills');
    }
};
