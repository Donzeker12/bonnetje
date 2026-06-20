<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@bonnetje.nl',
            'password' => bcrypt('password'),
            'city' => 'Nijkerk',
            'postal_code' => '3861BS',
            'level' => 1,
        ]);

        // Create some stores in Amsterdam and Nijkerk
        $stores = [
            // Amsterdam stores
            [
                'name' => 'Albert Heijn Damrak',
                'chain' => 'Albert Heijn',
                'address' => 'Damrak 88',
                'city' => 'Amsterdam',
                'postal_code' => '1012LP',
                'latitude' => 52.3755,
                'longitude' => 4.8947,
                'store_number' => '1234',
            ],
            [
                'name' => 'Jumbo Kinkerstraat',
                'chain' => 'Jumbo',
                'address' => 'Kinkerstraat 50',
                'city' => 'Amsterdam',
                'postal_code' => '1053DZ',
                'latitude' => 52.3676,
                'longitude' => 4.8731,
                'store_number' => '5678',
            ],
            [
                'name' => 'Lidl Westerstraat',
                'chain' => 'Lidl',
                'address' => 'Westerstraat 23',
                'city' => 'Amsterdam',
                'postal_code' => '1015LZ',
                'latitude' => 52.3789,
                'longitude' => 4.8820,
                'store_number' => '9012',
            ],
            [
                'name' => 'Plus Oosterpark',
                'chain' => 'Plus',
                'address' => 'Eerste van Swindenstraat 1',
                'city' => 'Amsterdam',
                'postal_code' => '1093GA',
                'latitude' => 52.3600,
                'longitude' => 4.9180,
                'store_number' => '3456',
            ],
            // Nijkerk stores
            [
                'name' => 'Albert Heijn Nijkerk Centrum',
                'chain' => 'Albert Heijn',
                'address' => 'Stationsstraat 15',
                'city' => 'Nijkerk',
                'postal_code' => '3861BS',
                'latitude' => 52.2222,
                'longitude' => 5.4806,
                'store_number' => '2234',
            ],
            [
                'name' => 'Jumbo Nijkerk',
                'chain' => 'Jumbo',
                'address' => 'Arkade 30',
                'city' => 'Nijkerk',
                'postal_code' => '3861RK',
                'latitude' => 52.2200,
                'longitude' => 5.4820,
                'store_number' => '6678',
            ],
            [
                'name' => 'Lidl Nijkerk',
                'chain' => 'Lidl',
                'address' => 'Van Heemstraweg 21',
                'city' => 'Nijkerk',
                'postal_code' => '3861MA',
                'latitude' => 52.2190,
                'longitude' => 5.4750,
                'store_number' => '8012',
            ],
            [
                'name' => 'Plus Nijkerk',
                'chain' => 'Plus',
                'address' => 'Beverstraat 2',
                'city' => 'Nijkerk',
                'postal_code' => '3861BE',
                'latitude' => 52.2240,
                'longitude' => 5.4790,
                'store_number' => '4456',
            ],
            [
                'name' => 'Nettorama Nijkerk',
                'chain' => 'Nettorama',
                'address' => 'Zandstraat 40',
                'city' => 'Nijkerk',
                'postal_code' => '3862CB',
                'latitude' => 52.2210,
                'longitude' => 5.4770,
                'store_number' => '7789',
            ],
            [
                'name' => 'Dirk van den Broek Nijkerk',
                'chain' => 'Dirk',
                'address' => 'Industrieweg 5',
                'city' => 'Nijkerk',
                'postal_code' => '3861RW',
                'latitude' => 52.2180,
                'longitude' => 5.4830,
                'store_number' => '5512',
            ],
        ];

        $createdStores = [];
        foreach ($stores as $storeData) {
            $createdStores[] = Store::create($storeData);
        }

        // Create sample products
        $products = [
            [
                'barcode' => '8710398000019',
                'name' => 'Melk Volle',
                'description' => 'Verse volle melk 1 liter',
                'brand' => 'Campina',
                'category' => 'Zuivel',
                'unit' => 'liter',
                'unit_amount' => 1,
                'is_private_label' => false,
            ],
            [
                'barcode' => '8718114011080',
                'name' => 'Volkoren Brood',
                'description' => 'Heel tarwe brood',
                'brand' => 'AH',
                'category' => 'Brood',
                'unit' => 'stuks',
                'unit_amount' => 1,
                'is_private_label' => true,
            ],
            [
                'barcode' => '8710398510129',
                'name' => 'Kaas Belegen',
                'description' => 'Belegen kaas gesneden',
                'brand' => 'Beemster',
                'category' => 'Zuivel',
                'unit' => 'gram',
                'unit_amount' => 150,
                'is_private_label' => false,
            ],
            [
                'barcode' => '8712100604560',
                'name' => 'Pindakaas',
                'description' => 'Pindakaas met stukjes',
                'brand' => 'Calvé',
                'category' => 'Broodbeleg',
                'unit' => 'gram',
                'unit_amount' => 350,
                'is_private_label' => false,
            ],
            [
                'barcode' => '8710398000026',
                'name' => 'Yoghurt Naturel',
                'description' => 'Volle yoghurt naturel',
                'brand' => 'Campina',
                'category' => 'Zuivel',
                'unit' => 'gram',
                'unit_amount' => 500,
                'is_private_label' => false,
            ],
            [
                'barcode' => '8718114025209',
                'name' => 'Bananen',
                'description' => 'Verse bananen',
                'brand' => 'AH',
                'category' => 'Fruit',
                'unit' => 'kilogram',
                'unit_amount' => 1,
                'is_private_label' => false,
            ],
        ];

        $createdProducts = [];
        foreach ($products as $productData) {
            $createdProducts[] = Product::create($productData);
        }

        // Add prices for products in stores (both Amsterdam and Nijkerk)
        $priceData = [
            // Melk Volle - product index 0
            ['store_index' => 0, 'price' => 1.89], // AH Amsterdam
            ['store_index' => 1, 'price' => 1.79], // Jumbo Amsterdam
            ['store_index' => 2, 'price' => 1.69], // Lidl Amsterdam
            ['store_index' => 3, 'price' => 1.85], // Plus Amsterdam
            ['store_index' => 4, 'price' => 1.92], // AH Nijkerk
            ['store_index' => 5, 'price' => 1.75], // Jumbo Nijkerk
            ['store_index' => 6, 'price' => 1.65], // Lidl Nijkerk
            ['store_index' => 7, 'price' => 1.82], // Plus Nijkerk
            ['store_index' => 8, 'price' => 1.59], // Nettorama Nijkerk
            ['store_index' => 9, 'price' => 1.72], // Dirk Nijkerk
        ];

        foreach ($priceData as $price) {
            \App\Models\Price::create([
                'product_id' => $createdProducts[0]->id,
                'store_id' => $createdStores[$price['store_index']]->id,
                'user_id' => $user->id,
                'price' => $price['price'],
                'verification_count' => rand(1, 5),
                'verified_at' => now(),
            ]);
        }

        // Brood - product index 1
        $breadPrices = [
            ['store_index' => 0, 'price' => 2.49],
            ['store_index' => 1, 'price' => 2.39],
            ['store_index' => 2, 'price' => 1.99],
            ['store_index' => 3, 'price' => 2.45],
            ['store_index' => 4, 'price' => 2.52],
            ['store_index' => 5, 'price' => 2.35],
            ['store_index' => 6, 'price' => 1.95],
            ['store_index' => 7, 'price' => 2.42],
            ['store_index' => 8, 'price' => 1.89],
            ['store_index' => 9, 'price' => 2.15],
        ];

        foreach ($breadPrices as $price) {
            \App\Models\Price::create([
                'product_id' => $createdProducts[1]->id,
                'store_id' => $createdStores[$price['store_index']]->id,
                'user_id' => $user->id,
                'price' => $price['price'],
                'verification_count' => rand(1, 3),
                'verified_at' => now(),
            ]);
        }

        // Kaas - product index 2
        $cheesePrices = [
            ['store_index' => 0, 'price' => 3.49],
            ['store_index' => 1, 'price' => 3.29],
            ['store_index' => 2, 'price' => 2.99],
            ['store_index' => 3, 'price' => 3.39],
            ['store_index' => 4, 'price' => 3.55],
            ['store_index' => 5, 'price' => 3.25],
            ['store_index' => 6, 'price' => 2.95],
            ['store_index' => 7, 'price' => 3.42],
            ['store_index' => 8, 'price' => 2.79],
            ['store_index' => 9, 'price' => 3.05],
        ];

        foreach ($cheesePrices as $price) {
            \App\Models\Price::create([
                'product_id' => $createdProducts[2]->id,
                'store_id' => $createdStores[$price['store_index']]->id,
                'user_id' => $user->id,
                'price' => $price['price'],
                'verification_count' => rand(1, 4),
                'verified_at' => now(),
            ]);
        }

        // Create user points for test user
        \App\Models\UserPoints::create([
            'user_id' => $user->id,
            'total_points' => 150,
            'city' => 'Nijkerk',
        ]);

        // Create badges
        $badges = [
            [
                'name' => 'Scanner Starter',
                'description' => 'Je eerste 10 scans!',
                'icon' => '🌟',
                'type' => 'scan_count',
                'requirement' => 10,
            ],
            [
                'name' => 'Prijs Politie',
                'description' => '50 prijzen gescand',
                'icon' => '👮',
                'type' => 'scan_count',
                'requirement' => 50,
            ],
            [
                'name' => 'Deal Hunter',
                'description' => '100 scans voltooid!',
                'icon' => '🎯',
                'type' => 'scan_count',
                'requirement' => 100,
            ],
            [
                'name' => 'Verificatie Held',
                'description' => '25 prijzen geverifieerd',
                'icon' => '✅',
                'type' => 'verification_count',
                'requirement' => 25,
            ],
            [
                'name' => 'Bespaar Koning',
                'description' => '1000 punten verzameld',
                'icon' => '👑',
                'type' => 'total_points',
                'requirement' => 1000,
            ],
            [
                'name' => 'Stads Champion',
                'description' => 'Nummer 1 in je stad!',
                'icon' => '🏆',
                'type' => 'city_hero',
                'requirement' => 1,
            ],
        ];

        foreach ($badges as $badgeData) {
            Badge::create($badgeData);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Test user credentials:');
        $this->command->info('Email: test@bonnetje.nl');
        $this->command->info('Password: password');
    }
}
