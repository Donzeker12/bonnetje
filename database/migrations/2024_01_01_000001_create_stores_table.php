<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Albert Heijn, Jumbo, Lidl, etc.
            $table->string('chain'); // Keten naam
            $table->string('address');
            $table->string('city');
            $table->string('postal_code');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('store_number')->nullable(); // Filiaalnummer
            $table->timestamps();
            
            // Indexes voor snelle locatie-queries
            $table->index(['city']);
            $table->index(['chain']);
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
