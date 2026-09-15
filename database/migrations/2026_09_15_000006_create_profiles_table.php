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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('tagline')->nullable();
            $table->string('tagline_en')->nullable();
            $table->text('bio')->nullable();
            $table->text('bio_en')->nullable();
            $table->string('domisili')->nullable();
            $table->string('domisili_en')->nullable();
            $table->string('tempat_tinggal')->nullable();
            $table->string('tempat_tinggal_en')->nullable();
            $table->string('ttl')->nullable();
            $table->string('ttl_en')->nullable();
            $table->json('skills')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
