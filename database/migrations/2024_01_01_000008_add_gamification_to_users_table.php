<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('city')->nullable()->after('email');
            $table->string('postal_code')->nullable()->after('city');
            $table->integer('level')->default(1)->after('password');
            $table->string('avatar_url')->nullable()->after('level');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['city', 'postal_code', 'level', 'avatar_url']);
        });
    }
};
