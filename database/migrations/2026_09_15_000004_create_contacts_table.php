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
        Schema::create('contacts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('title_en')->nullable();
            $table->string('value');
            $table->text('url')->nullable();
            $table->string('type')->nullable();
            $table->string('subtext')->nullable();
            $table->string('subtext_en')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
