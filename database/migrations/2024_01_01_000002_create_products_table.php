<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('brand')->nullable();
            $table->string('category')->nullable();
            $table->string('unit')->default('stuks'); // stuks, kg, liter, etc.
            $table->decimal('unit_amount', 10, 2)->default(1); // 500 (gram), 1 (liter)
            $table->string('image_url')->nullable();
            $table->boolean('is_private_label')->default(false); // Huismerk?
            $table->timestamps();
            
            $table->index(['barcode']);
            $table->index(['category']);
            $table->index(['is_private_label']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
