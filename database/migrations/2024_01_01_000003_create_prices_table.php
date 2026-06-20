<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Wie heeft dit gespot?
            $table->decimal('price', 8, 2);
            $table->boolean('is_promotion')->default(false);
            $table->date('promotion_end_date')->nullable();
            $table->integer('verification_count')->default(1); // Hoeveel users hebben dit bevestigd?
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            
            // Een product kan maar 1 actieve prijs per winkel hebben
            $table->index(['product_id', 'store_id', 'created_at']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prices');
    }
};
