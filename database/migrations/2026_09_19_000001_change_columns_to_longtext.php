<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify portfolio_items text columns to LONGTEXT to support large base64 WebP images
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `image_url` LONGTEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `cover_image` LONGTEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `description` LONGTEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `description_en` LONGTEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `video_url` LONGTEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `prototype_url` LONGTEXT NULL");

        // Modify certificates text columns to LONGTEXT
        DB::statement("ALTER TABLE `certificates` MODIFY `cover` LONGTEXT NULL");
        DB::statement("ALTER TABLE `certificates` MODIFY `description` LONGTEXT NULL");

        // Modify experiences text columns to LONGTEXT
        DB::statement("ALTER TABLE `experiences` MODIFY `description` LONGTEXT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `image_url` TEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `cover_image` TEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `description` TEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `description_en` TEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `video_url` TEXT NULL");
        DB::statement("ALTER TABLE `portfolio_items` MODIFY `prototype_url` TEXT NULL");

        DB::statement("ALTER TABLE `certificates` MODIFY `cover` TEXT NULL");
        DB::statement("ALTER TABLE `certificates` MODIFY `description` TEXT NULL");

        DB::statement("ALTER TABLE `experiences` MODIFY `description` TEXT NULL");
    }
};
