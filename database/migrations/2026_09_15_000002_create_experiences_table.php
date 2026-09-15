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
        Schema::create('experiences', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('company')->nullable();
            $table->string('period')->nullable();
            $table->string('period_id')->nullable();
            $table->string('period_en')->nullable();
            $table->integer('duration_months')->default(0);
            $table->text('description')->nullable();
            $table->text('description_en')->nullable();
            $table->json('media')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
