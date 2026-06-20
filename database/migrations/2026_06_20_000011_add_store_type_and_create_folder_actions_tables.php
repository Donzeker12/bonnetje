<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('store_type')->default('supermarket');
            $table->index(['store_type']);
        });

        Schema::create('folder_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('image_path');
            $table->date('valid_from');
            $table->date('valid_until');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['valid_from', 'valid_until']);
        });

        Schema::create('folder_action_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folder_action_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name_raw')->nullable();
            $table->decimal('promo_price', 8, 2);
            $table->decimal('normal_price', 8, 2)->nullable();
            $table->string('unit_label')->nullable();
            $table->timestamps();

            $table->index(['product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folder_action_items');
        Schema::dropIfExists('folder_actions');

        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndex(['store_type']);
            $table->dropColumn('store_type');
        });
    }
};
