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
        Schema::table('portfolio_items', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolio_items', 'role')) {
                $table->string('role')->nullable()->after('platform');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            if (Schema::hasColumn('portfolio_items', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};
