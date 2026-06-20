<?php

use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('uploads and processes a receipt', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $store = Store::create([
        'name' => 'Albert Heijn Centrum',
        'chain' => 'Albert Heijn',
        'address' => 'Dorpsstraat 1',
        'city' => 'Utrecht',
        'country_code' => 'NL',
        'currency_code' => 'EUR',
        'store_type' => 'supermarket',
        'postal_code' => '3511AA',
        'latitude' => 52.0907374,
        'longitude' => 5.1214201,
    ]);

    $uploadResponse = $this
        ->actingAs($user)
        ->postJson('/api/receipts', [
            'store_id' => $store->id,
            'image' => UploadedFile::fake()->image('receipt.jpg'),
            'ocr_raw_text' => "Melk 2,49\nBrood 1,99\nTotaal 4,48",
        ]);

    $uploadResponse
        ->assertCreated()
        ->assertJsonPath('receipt.status', 'pending')
        ->assertJsonPath('receipt.store.id', $store->id);

    $receiptId = $uploadResponse->json('receipt.id');

    $this
        ->actingAs($user)
        ->postJson("/api/receipts/{$receiptId}/process")
        ->assertOk()
        ->assertJsonPath('receipt.status', 'completed')
        ->assertJsonPath('receipt.items_count', 2)
        ->assertJsonPath('receipt.total_amount', '4.48')
        ->assertJsonPath('receipt.parsed_items.0.name', 'Melk')
        ->assertJsonPath('receipt.parsed_items.1.price', 1.99);

    expect(Storage::disk('public')->exists($uploadResponse->json('receipt.image_path')))->toBeTrue();
});