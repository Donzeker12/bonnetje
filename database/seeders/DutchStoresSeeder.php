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
        $stores = [
            // Albert Heijn
            ['chain' => 'Albert Heijn', 'name' => 'AH Amsterdam Centrum', 'city' => 'Amsterdam', 'postal_code' => '1012 JM', 'address' => 'Kalverstraat 192', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3011 BC', 'address' => 'Koopgertslaan 1', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Utrecht', 'city' => 'Utrecht', 'postal_code' => '3511 EP', 'address' => 'Steijnlaan 60', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Den Haag', 'city' => 'Den Haag', 'postal_code' => '2595 AA', 'address' => 'Gedempte Burgwal 50', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Eindhoven', 'city' => 'Eindhoven', 'postal_code' => '5611 CE', 'address' => 'Ketelhuisplein 1', 'latitude' => 51.4416, 'longitude' => 5.4697, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Groningen', 'city' => 'Groningen', 'postal_code' => '9711 PL', 'address' => 'Gedempte Zuiderdiep 52', 'latitude' => 53.2192, 'longitude' => 6.5623, 'store_type' => 'supermarket'],

            // Jumbo
            ['chain' => 'Jumbo', 'name' => 'Jumbo Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1081 HV', 'address' => 'Parnassusweg 819', 'latitude' => 52.3546, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3024 EB', 'address' => 'Gaffelierstraat 30', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Utrecht', 'city' => 'Utrecht', 'postal_code' => '3524 NR', 'address' => 'Graanmarkt 55', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Den Haag', 'city' => 'Den Haag', 'postal_code' => '2513 BA', 'address' => 'Loosduinse Hoofdstraat 265', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Eindhoven', 'city' => 'Eindhoven', 'postal_code' => '5616 BV', 'address' => 'Randweg 300', 'latitude' => 51.4416, 'longitude' => 5.4697, 'store_type' => 'supermarket'],

            // Lidl
            ['chain' => 'Lidl', 'name' => 'Lidl Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1057 DK', 'address' => 'Oost-Indisch Dorp 10', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3012 CK', 'address' => 'Blaaktuin 44', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Utrecht', 'city' => 'Utrecht', 'postal_code' => '3512 CR', 'address' => 'Zadelstraat 28', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Den Haag', 'city' => 'Den Haag', 'postal_code' => '2509 LA', 'address' => 'Bachplein 7', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Eindhoven', 'city' => 'Eindhoven', 'postal_code' => '5613 AE', 'address' => 'Woenselsestraat 152', 'latitude' => 51.4416, 'longitude' => 5.4697, 'store_type' => 'discount'],

            // Aldi
            ['chain' => 'Aldi', 'name' => 'Aldi Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1055 HR', 'address' => 'Amsterdam', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3015 AA', 'address' => 'Goudsesingel 321', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Utrecht', 'city' => 'Utrecht', 'postal_code' => '3511 LG', 'address' => 'Achter de Dom 8', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Den Haag', 'city' => 'Den Haag', 'postal_code' => '2544 BC', 'address' => 'Statenlaan 36', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'discount'],

            // C1000
            ['chain' => 'C1000', 'name' => 'C1000 Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1012 KM', 'address' => 'Nieuwendijk 99', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3011 BA', 'address' => 'Lijnbaan 135', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Utrecht', 'city' => 'Utrecht', 'postal_code' => '3511 DZ', 'address' => 'Steijnlaan 40', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],

            // Dirk van den Broek
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1064 SB', 'address' => 'Kinkerstraat 112', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3011 DP', 'address' => 'Blaaktuin 20', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Utrecht', 'city' => 'Utrecht', 'postal_code' => '3512 NA', 'address' => 'Jaarbeursplein 6', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'discount'],

            // Plus
            ['chain' => 'Plus', 'name' => 'Plus Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1073 RB', 'address' => 'Ceintuurbaan 99', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3021 HR', 'address' => 'Cillengerbrug 20', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Utrecht', 'city' => 'Utrecht', 'postal_code' => '3515 DZ', 'address' => 'Boothkade 12', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],

            // Spar
            ['chain' => 'Spar', 'name' => 'Spar Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1056 PC', 'address' => 'Piet Heinkade 5', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Den Haag', 'city' => 'Den Haag', 'postal_code' => '2583 ER', 'address' => 'Melis Stokelaan 35', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],

            // Coop
            ['chain' => 'Coop', 'name' => 'Coop Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3011 AA', 'address' => 'Nieuwstraat 50', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Coop', 'name' => 'Coop Utrecht', 'city' => 'Utrecht', 'postal_code' => '3511 DB', 'address' => 'Vredenburg 2', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],

            // DekaMarkt
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1012 NX', 'address' => 'Zeedijk 20', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Den Haag', 'city' => 'Den Haag', 'postal_code' => '2511 AA', 'address' => 'Marktstraat 1', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],

            // EkoPlaza
            ['chain' => 'EkoPlaza', 'name' => 'EkoPlaza Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1091 ER', 'address' => 'Ruysdaelkade 81', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'organic'],
            ['chain' => 'EkoPlaza', 'name' => 'EkoPlaza Rotterdam', 'city' => 'Rotterdam', 'postal_code' => '3012 CG', 'address' => 'Boezemkade 16', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'organic'],

            // Marqt
            ['chain' => 'Marqt', 'name' => 'Marqt Amsterdam', 'city' => 'Amsterdam', 'postal_code' => '1011 PC', 'address' => 'Nieuwendijk 34', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'premium'],
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
