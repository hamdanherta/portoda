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
        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('title_en')->nullable();
            $table->string('category');
            $table->string('subcategory')->nullable();
            $table->string('subcategory_en')->nullable();
            $table->longText('description')->nullable();
            $table->longText('description_en')->nullable();
            $table->longText('image_url')->nullable();
            $table->longText('cover_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->json('images')->nullable();
            $table->longText('video_url')->nullable();
            $table->longText('prototype_url')->nullable();
            $table->string('client')->nullable();
            $table->string('year')->nullable();
            $table->string('project_type')->nullable();
            $table->string('tools_used')->nullable();
            $table->string('development_method')->nullable();
            $table->string('framework')->nullable();
            $table->string('platform')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_items');
    }
};
