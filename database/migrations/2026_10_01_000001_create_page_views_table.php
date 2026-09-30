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
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45)->nullable();
            $table->string('url')->nullable();
            $table->string('path')->nullable();
            $table->string('karya_id')->nullable();
            $table->string('session_id')->nullable();
            $table->string('device_type')->default('desktop'); // desktop / mobile / tablet
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->date('view_date');
            $table->timestamps();

            $table->index('view_date');
            $table->index('karya_id');
            $table->index('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
