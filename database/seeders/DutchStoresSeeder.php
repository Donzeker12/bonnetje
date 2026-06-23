<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class DutchStoresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Keep Dutch store list simple and deterministic.
        Store::where('country_code', 'NL')->delete();

        $stores = [
            ['chain' => 'Jumbo', 'name' => 'Jumbo', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk van den Broek', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'Albert Heijn', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
            ['chain' => 'Boni', 'name' => 'Boni', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
            ['chain' => 'Nettorama', 'name' => 'Nettorama', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
            ['chain' => 'Lidl', 'name' => 'Lidl', 'city' => 'Nederland', 'postal_code' => '0000 AA', 'address' => 'Nederland', 'latitude' => 52.1326, 'longitude' => 5.2913, 'store_type' => 'supermarket'],
        ];

        foreach ($stores as $storeData) {
            Store::create([
                'chain' => $storeData['chain'],
                'name' => $storeData['name'],
                'city' => $storeData['city'],
                'postal_code' => $storeData['postal_code'],
                'address' => $storeData['address'],
                'country_code' => 'NL',
                'currency_code' => 'EUR',
                'store_type' => $storeData['store_type'],
                'latitude' => $storeData['latitude'],
                'longitude' => $storeData['longitude'],
            ]);
        }
    }
}