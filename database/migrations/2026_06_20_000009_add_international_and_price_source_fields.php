<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('country_code', 2)->default('NL');
            $table->string('currency_code', 3)->default('EUR');

            $table->index(['country_code']);
            $table->index(['currency_code']);
        });

        Schema::table('prices', function (Blueprint $table) {
            $table->string('price_type')->default('normal'); // normal, promotion
            $table->decimal('normal_price', 8, 2)->nullable();
            $table->string('source_type')->default('manual'); // manual, barcode, receipt, folder
            $table->string('proof_image_path')->nullable();

            $table->index(['price_type']);
            $table->index(['source_type']);
        });
    }

    public function down(): void
    {
        Schema::table('prices', function (Blueprint $table) {
            $table->dropIndex(['price_type']);
            $table->dropIndex(['source_type']);

            $table->dropColumn([
                'price_type',
                'normal_price',
                'source_type',
                'proof_image_path',
            ]);
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndex(['country_code']);
            $table->dropIndex(['currency_code']);

            $table->dropColumn([
                'country_code',
                'currency_code',
            ]);
        });
    }
};
