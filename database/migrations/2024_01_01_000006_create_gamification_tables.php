<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // User points tabel
        Schema::create('user_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('total_points')->default(0);
            $table->integer('scans_count')->default(0);
            $table->integer('verifications_count')->default(0);
            $table->string('city')->nullable(); // Voor lokaal leaderboard
            $table->timestamps();
            
            $table->index(['city', 'total_points']);
        });

        // Badges tabel
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->string('icon')->nullable();
            $table->string('type'); // scan_count, verification_count, city_hero
            $table->integer('requirement'); // Bijv. 100 scans
            $table->timestamps();
        });

        // User badges koppeltabel
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('badge_id')->constrained()->onDelete('cascade');
            $table->timestamp('earned_at');
            
            $table->unique(['user_id', 'badge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('user_points');
    }
};
