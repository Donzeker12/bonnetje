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
            // Albert Heijn - 15 locaties
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 001', 'city' => 'Nederland', 'postal_code' => '1012 JM', 'address' => 'Straat 1', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 002', 'city' => 'Nederland', 'postal_code' => '3011 BC', 'address' => 'Straat 2', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 003', 'city' => 'Nederland', 'postal_code' => '3511 EP', 'address' => 'Straat 3', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 004', 'city' => 'Nederland', 'postal_code' => '2595 AA', 'address' => 'Straat 4', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 005', 'city' => 'Nederland', 'postal_code' => '5611 CE', 'address' => 'Straat 5', 'latitude' => 51.4416, 'longitude' => 5.4697, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 006', 'city' => 'Nederland', 'postal_code' => '9711 PL', 'address' => 'Straat 6', 'latitude' => 53.2192, 'longitude' => 6.5623, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 007', 'city' => 'Nederland', 'postal_code' => '1100 AA', 'address' => 'Straat 7', 'latitude' => 52.3500, 'longitude' => 4.8800, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 008', 'city' => 'Nederland', 'postal_code' => '3100 AB', 'address' => 'Straat 8', 'latitude' => 51.9700, 'longitude' => 4.5100, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 009', 'city' => 'Nederland', 'postal_code' => '3500 CD', 'address' => 'Straat 9', 'latitude' => 52.0800, 'longitude' => 5.1300, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 010', 'city' => 'Nederland', 'postal_code' => '2600 EF', 'address' => 'Straat 10', 'latitude' => 52.0900, 'longitude' => 4.3200, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 011', 'city' => 'Nederland', 'postal_code' => '5600 GH', 'address' => 'Straat 11', 'latitude' => 51.4500, 'longitude' => 5.4800, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 012', 'city' => 'Nederland', 'postal_code' => '9700 IJ', 'address' => 'Straat 12', 'latitude' => 53.2300, 'longitude' => 6.5700, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 013', 'city' => 'Nederland', 'postal_code' => '1200 KL', 'address' => 'Straat 13', 'latitude' => 52.3600, 'longitude' => 4.9000, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 014', 'city' => 'Nederland', 'postal_code' => '3200 MN', 'address' => 'Straat 14', 'latitude' => 52.0000, 'longitude' => 4.5000, 'store_type' => 'supermarket'],
            ['chain' => 'Albert Heijn', 'name' => 'AH Winkel 015', 'city' => 'Nederland', 'postal_code' => '3600 OP', 'address' => 'Straat 15', 'latitude' => 52.1200, 'longitude' => 5.1500, 'store_type' => 'supermarket'],

            // Jumbo - 12 locaties
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 001', 'city' => 'Nederland', 'postal_code' => '1081 HV', 'address' => 'Straat 16', 'latitude' => 52.3546, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 002', 'city' => 'Nederland', 'postal_code' => '3024 EB', 'address' => 'Straat 17', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 003', 'city' => 'Nederland', 'postal_code' => '3524 NR', 'address' => 'Straat 18', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 004', 'city' => 'Nederland', 'postal_code' => '2513 BA', 'address' => 'Straat 19', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 005', 'city' => 'Nederland', 'postal_code' => '5616 BV', 'address' => 'Straat 20', 'latitude' => 51.4416, 'longitude' => 5.4697, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 006', 'city' => 'Nederland', 'postal_code' => '1150 CD', 'address' => 'Straat 21', 'latitude' => 52.3700, 'longitude' => 4.9100, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 007', 'city' => 'Nederland', 'postal_code' => '3050 EF', 'address' => 'Straat 22', 'latitude' => 52.0000, 'longitude' => 4.5200, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 008', 'city' => 'Nederland', 'postal_code' => '3550 GH', 'address' => 'Straat 23', 'latitude' => 52.1000, 'longitude' => 5.1400, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 009', 'city' => 'Nederland', 'postal_code' => '2550 IJ', 'address' => 'Straat 24', 'latitude' => 52.0800, 'longitude' => 4.3100, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 010', 'city' => 'Nederland', 'postal_code' => '5630 KL', 'address' => 'Straat 25', 'latitude' => 51.4600, 'longitude' => 5.4900, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 011', 'city' => 'Nederland', 'postal_code' => '1180 MN', 'address' => 'Straat 26', 'latitude' => 52.3800, 'longitude' => 4.9200, 'store_type' => 'supermarket'],
            ['chain' => 'Jumbo', 'name' => 'Jumbo Winkel 012', 'city' => 'Nederland', 'postal_code' => '3070 OP', 'address' => 'Straat 27', 'latitude' => 52.0100, 'longitude' => 4.5300, 'store_type' => 'supermarket'],

            // Lidl - 14 locaties
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 001', 'city' => 'Nederland', 'postal_code' => '1057 DK', 'address' => 'Straat 28', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 002', 'city' => 'Nederland', 'postal_code' => '3012 CK', 'address' => 'Straat 29', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 003', 'city' => 'Nederland', 'postal_code' => '3512 CR', 'address' => 'Straat 30', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 004', 'city' => 'Nederland', 'postal_code' => '2509 LA', 'address' => 'Straat 31', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 005', 'city' => 'Nederland', 'postal_code' => '5613 AE', 'address' => 'Straat 32', 'latitude' => 51.4416, 'longitude' => 5.4697, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 006', 'city' => 'Nederland', 'postal_code' => '1090 QR', 'address' => 'Straat 33', 'latitude' => 52.3500, 'longitude' => 4.9000, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 007', 'city' => 'Nederland', 'postal_code' => '3030 ST', 'address' => 'Straat 34', 'latitude' => 51.9500, 'longitude' => 4.5000, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 008', 'city' => 'Nederland', 'postal_code' => '3530 UV', 'address' => 'Straat 35', 'latitude' => 52.1100, 'longitude' => 5.1300, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 009', 'city' => 'Nederland', 'postal_code' => '2530 WX', 'address' => 'Straat 36', 'latitude' => 52.0600, 'longitude' => 4.3000, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 010', 'city' => 'Nederland', 'postal_code' => '5620 YZ', 'address' => 'Straat 37', 'latitude' => 51.4500, 'longitude' => 5.4800, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 011', 'city' => 'Nederland', 'postal_code' => '1110 AA', 'address' => 'Straat 38', 'latitude' => 52.3600, 'longitude' => 4.8900, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 012', 'city' => 'Nederland', 'postal_code' => '3040 BB', 'address' => 'Straat 39', 'latitude' => 51.9400, 'longitude' => 4.5100, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 013', 'city' => 'Nederland', 'postal_code' => '3540 CC', 'address' => 'Straat 40', 'latitude' => 52.1200, 'longitude' => 5.1400, 'store_type' => 'discount'],
            ['chain' => 'Lidl', 'name' => 'Lidl Winkel 014', 'city' => 'Nederland', 'postal_code' => '2540 DD', 'address' => 'Straat 41', 'latitude' => 52.0700, 'longitude' => 4.3100, 'store_type' => 'discount'],

            // Aldi - 11 locaties
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 001', 'city' => 'Nederland', 'postal_code' => '1055 HR', 'address' => 'Straat 42', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 002', 'city' => 'Nederland', 'postal_code' => '3015 AA', 'address' => 'Straat 43', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 003', 'city' => 'Nederland', 'postal_code' => '3511 LG', 'address' => 'Straat 44', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 004', 'city' => 'Nederland', 'postal_code' => '2544 BC', 'address' => 'Straat 45', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 005', 'city' => 'Nederland', 'postal_code' => '5615 PP', 'address' => 'Straat 46', 'latitude' => 51.4400, 'longitude' => 5.4600, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 006', 'city' => 'Nederland', 'postal_code' => '1070 QQ', 'address' => 'Straat 47', 'latitude' => 52.3600, 'longitude' => 4.8800, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 007', 'city' => 'Nederland', 'postal_code' => '3020 RR', 'address' => 'Straat 48', 'latitude' => 51.9300, 'longitude' => 4.4800, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 008', 'city' => 'Nederland', 'postal_code' => '3520 SS', 'address' => 'Straat 49', 'latitude' => 52.0900, 'longitude' => 5.1300, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 009', 'city' => 'Nederland', 'postal_code' => '2520 TT', 'address' => 'Straat 50', 'latitude' => 52.0500, 'longitude' => 4.2900, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 010', 'city' => 'Nederland', 'postal_code' => '5610 UU', 'address' => 'Straat 51', 'latitude' => 51.4300, 'longitude' => 5.4500, 'store_type' => 'discount'],
            ['chain' => 'Aldi', 'name' => 'Aldi Winkel 011', 'city' => 'Nederland', 'postal_code' => '1040 VV', 'address' => 'Straat 52', 'latitude' => 52.3400, 'longitude' => 4.8700, 'store_type' => 'discount'],

            // C1000 - 10 locaties
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 001', 'city' => 'Nederland', 'postal_code' => '1012 KM', 'address' => 'Straat 53', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 002', 'city' => 'Nederland', 'postal_code' => '3011 BA', 'address' => 'Straat 54', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 003', 'city' => 'Nederland', 'postal_code' => '3511 DZ', 'address' => 'Straat 55', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 004', 'city' => 'Nederland', 'postal_code' => '2512 WX', 'address' => 'Straat 56', 'latitude' => 52.0700, 'longitude' => 4.3000, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 005', 'city' => 'Nederland', 'postal_code' => '5614 KK', 'address' => 'Straat 57', 'latitude' => 51.4300, 'longitude' => 5.4600, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 006', 'city' => 'Nederland', 'postal_code' => '1060 LL', 'address' => 'Straat 58', 'latitude' => 52.3500, 'longitude' => 4.8900, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 007', 'city' => 'Nederland', 'postal_code' => '3010 MM', 'address' => 'Straat 59', 'latitude' => 51.9100, 'longitude' => 4.4700, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 008', 'city' => 'Nederland', 'postal_code' => '3510 NN', 'address' => 'Straat 60', 'latitude' => 52.0600, 'longitude' => 5.1100, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 009', 'city' => 'Nederland', 'postal_code' => '2510 OO', 'address' => 'Straat 61', 'latitude' => 52.0400, 'longitude' => 4.2800, 'store_type' => 'supermarket'],
            ['chain' => 'C1000', 'name' => 'C1000 Winkel 010', 'city' => 'Nederland', 'postal_code' => '5612 PP', 'address' => 'Straat 62', 'latitude' => 51.4200, 'longitude' => 5.4400, 'store_type' => 'supermarket'],

            // Dirk van den Broek - 9 locaties
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 001', 'city' => 'Nederland', 'postal_code' => '1064 SB', 'address' => 'Straat 63', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 002', 'city' => 'Nederland', 'postal_code' => '3011 DP', 'address' => 'Straat 64', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 003', 'city' => 'Nederland', 'postal_code' => '3512 NA', 'address' => 'Straat 65', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 004', 'city' => 'Nederland', 'postal_code' => '2515 AA', 'address' => 'Straat 66', 'latitude' => 52.0500, 'longitude' => 4.2900, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 005', 'city' => 'Nederland', 'postal_code' => '5625 DD', 'address' => 'Straat 67', 'latitude' => 51.4500, 'longitude' => 5.4900, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 006', 'city' => 'Nederland', 'postal_code' => '1080 EE', 'address' => 'Straat 68', 'latitude' => 52.3700, 'longitude' => 4.9000, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 007', 'city' => 'Nederland', 'postal_code' => '3025 FF', 'address' => 'Straat 69', 'latitude' => 51.9400, 'longitude' => 4.5000, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 008', 'city' => 'Nederland', 'postal_code' => '3515 GG', 'address' => 'Straat 70', 'latitude' => 52.0800, 'longitude' => 5.1400, 'store_type' => 'discount'],
            ['chain' => 'Dirk van den Broek', 'name' => 'Dirk Winkel 009', 'city' => 'Nederland', 'postal_code' => '2530 HH', 'address' => 'Straat 71', 'latitude' => 52.0600, 'longitude' => 4.3100, 'store_type' => 'discount'],

            // Plus - 10 locaties
            ['chain' => 'Plus', 'name' => 'Plus Winkel 001', 'city' => 'Nederland', 'postal_code' => '1073 RB', 'address' => 'Straat 72', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 002', 'city' => 'Nederland', 'postal_code' => '3021 HR', 'address' => 'Straat 73', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 003', 'city' => 'Nederland', 'postal_code' => '3515 DZ', 'address' => 'Straat 74', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 004', 'city' => 'Nederland', 'postal_code' => '2516 AA', 'address' => 'Straat 75', 'latitude' => 52.0600, 'longitude' => 4.3000, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 005', 'city' => 'Nederland', 'postal_code' => '5626 II', 'address' => 'Straat 76', 'latitude' => 51.4600, 'longitude' => 5.5000, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 006', 'city' => 'Nederland', 'postal_code' => '1085 JJ', 'address' => 'Straat 77', 'latitude' => 52.3800, 'longitude' => 4.9100, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 007', 'city' => 'Nederland', 'postal_code' => '3027 KK', 'address' => 'Straat 78', 'latitude' => 51.9500, 'longitude' => 4.5100, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 008', 'city' => 'Nederland', 'postal_code' => '3517 LL', 'address' => 'Straat 79', 'latitude' => 52.1000, 'longitude' => 5.1500, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 009', 'city' => 'Nederland', 'postal_code' => '2535 MM', 'address' => 'Straat 80', 'latitude' => 52.0700, 'longitude' => 4.3200, 'store_type' => 'supermarket'],
            ['chain' => 'Plus', 'name' => 'Plus Winkel 010', 'city' => 'Nederland', 'postal_code' => '5628 NN', 'address' => 'Straat 81', 'latitude' => 51.4700, 'longitude' => 5.5100, 'store_type' => 'supermarket'],

            // Spar - 8 locaties
            ['chain' => 'Spar', 'name' => 'Spar Winkel 001', 'city' => 'Nederland', 'postal_code' => '1056 PC', 'address' => 'Straat 82', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Winkel 002', 'city' => 'Nederland', 'postal_code' => '2583 ER', 'address' => 'Straat 83', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Winkel 003', 'city' => 'Nederland', 'postal_code' => '1070 OO', 'address' => 'Straat 84', 'latitude' => 52.3600, 'longitude' => 4.8800, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Winkel 004', 'city' => 'Nederland', 'postal_code' => '3030 PP', 'address' => 'Straat 85', 'latitude' => 51.9300, 'longitude' => 4.4800, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Winkel 005', 'city' => 'Nederland', 'postal_code' => '3518 QQ', 'address' => 'Straat 86', 'latitude' => 52.1100, 'longitude' => 5.1600, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Winkel 006', 'city' => 'Nederland', 'postal_code' => '2540 RR', 'address' => 'Straat 87', 'latitude' => 52.0800, 'longitude' => 4.3300, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Winkel 007', 'city' => 'Nederland', 'postal_code' => '5630 SS', 'address' => 'Straat 88', 'latitude' => 51.4800, 'longitude' => 5.5200, 'store_type' => 'supermarket'],
            ['chain' => 'Spar', 'name' => 'Spar Winkel 008', 'city' => 'Nederland', 'postal_code' => '1095 TT', 'address' => 'Straat 89', 'latitude' => 52.3900, 'longitude' => 4.9200, 'store_type' => 'supermarket'],

            // Coop - 7 locaties
            ['chain' => 'Coop', 'name' => 'Coop Winkel 001', 'city' => 'Nederland', 'postal_code' => '3011 AA', 'address' => 'Straat 90', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'supermarket'],
            ['chain' => 'Coop', 'name' => 'Coop Winkel 002', 'city' => 'Nederland', 'postal_code' => '3511 DB', 'address' => 'Straat 91', 'latitude' => 52.0705, 'longitude' => 5.1216, 'store_type' => 'supermarket'],
            ['chain' => 'Coop', 'name' => 'Coop Winkel 003', 'city' => 'Nederland', 'postal_code' => '2520 UU', 'address' => 'Straat 92', 'latitude' => 52.0500, 'longitude' => 4.2800, 'store_type' => 'supermarket'],
            ['chain' => 'Coop', 'name' => 'Coop Winkel 004', 'city' => 'Nederland', 'postal_code' => '5632 VV', 'address' => 'Straat 93', 'latitude' => 51.4900, 'longitude' => 5.5300, 'store_type' => 'supermarket'],
            ['chain' => 'Coop', 'name' => 'Coop Winkel 005', 'city' => 'Nederland', 'postal_code' => '1100 WW', 'address' => 'Straat 94', 'latitude' => 52.4000, 'longitude' => 4.9300, 'store_type' => 'supermarket'],
            ['chain' => 'Coop', 'name' => 'Coop Winkel 006', 'city' => 'Nederland', 'postal_code' => '3032 XX', 'address' => 'Straat 95', 'latitude' => 51.9600, 'longitude' => 4.5200, 'store_type' => 'supermarket'],
            ['chain' => 'Coop', 'name' => 'Coop Winkel 007', 'city' => 'Nederland', 'postal_code' => '3520 YY', 'address' => 'Straat 96', 'latitude' => 52.1200, 'longitude' => 5.1700, 'store_type' => 'supermarket'],

            // DekaMarkt - 6 locaties
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Winkel 001', 'city' => 'Nederland', 'postal_code' => '1012 NX', 'address' => 'Straat 97', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'supermarket'],
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Winkel 002', 'city' => 'Nederland', 'postal_code' => '2511 AA', 'address' => 'Straat 98', 'latitude' => 52.0705, 'longitude' => 4.3007, 'store_type' => 'supermarket'],
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Winkel 003', 'city' => 'Nederland', 'postal_code' => '1105 ZZ', 'address' => 'Straat 99', 'latitude' => 52.4100, 'longitude' => 4.9400, 'store_type' => 'supermarket'],
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Winkel 004', 'city' => 'Nederland', 'postal_code' => '3035 AA', 'address' => 'Straat 100', 'latitude' => 51.9700, 'longitude' => 4.5300, 'store_type' => 'supermarket'],
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Winkel 005', 'city' => 'Nederland', 'postal_code' => '3522 BB', 'address' => 'Straat 101', 'latitude' => 52.1300, 'longitude' => 5.1800, 'store_type' => 'supermarket'],
            ['chain' => 'DekaMarkt', 'name' => 'DekaMarkt Winkel 006', 'city' => 'Nederland', 'postal_code' => '2550 CC', 'address' => 'Straat 102', 'latitude' => 52.0900, 'longitude' => 4.3400, 'store_type' => 'supermarket'],

            // EkoPlaza - 5 locaties
            ['chain' => 'EkoPlaza', 'name' => 'EkoPlaza Winkel 001', 'city' => 'Nederland', 'postal_code' => '1091 ER', 'address' => 'Straat 103', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'organic'],
            ['chain' => 'EkoPlaza', 'name' => 'EkoPlaza Winkel 002', 'city' => 'Nederland', 'postal_code' => '3012 CG', 'address' => 'Straat 104', 'latitude' => 51.9225, 'longitude' => 4.4792, 'store_type' => 'organic'],
            ['chain' => 'EkoPlaza', 'name' => 'EkoPlaza Winkel 003', 'city' => 'Nederland', 'postal_code' => '1110 DD', 'address' => 'Straat 105', 'latitude' => 52.3600, 'longitude' => 4.8900, 'store_type' => 'organic'],
            ['chain' => 'EkoPlaza', 'name' => 'EkoPlaza Winkel 004', 'city' => 'Nederland', 'postal_code' => '3040 EE', 'address' => 'Straat 106', 'latitude' => 51.9400, 'longitude' => 4.5100, 'store_type' => 'organic'],
            ['chain' => 'EkoPlaza', 'name' => 'EkoPlaza Winkel 005', 'city' => 'Nederland', 'postal_code' => '3525 FF', 'address' => 'Straat 107', 'latitude' => 52.1400, 'longitude' => 5.1900, 'store_type' => 'organic'],

            // Marqt - 4 locaties
            ['chain' => 'Marqt', 'name' => 'Marqt Winkel 001', 'city' => 'Nederland', 'postal_code' => '1011 PC', 'address' => 'Straat 108', 'latitude' => 52.3702, 'longitude' => 4.8952, 'store_type' => 'premium'],
            ['chain' => 'Marqt', 'name' => 'Marqt Winkel 002', 'city' => 'Nederland', 'postal_code' => '1012 AB', 'address' => 'Straat 109', 'latitude' => 52.3750, 'longitude' => 4.8980, 'store_type' => 'premium'],
            ['chain' => 'Marqt', 'name' => 'Marqt Winkel 003', 'city' => 'Nederland', 'postal_code' => '1013 CD', 'address' => 'Straat 110', 'latitude' => 52.3800, 'longitude' => 4.9010, 'store_type' => 'premium'],
            ['chain' => 'Marqt', 'name' => 'Marqt Winkel 004', 'city' => 'Nederland', 'postal_code' => '1014 EF', 'address' => 'Straat 111', 'latitude' => 52.3850, 'longitude' => 4.9040, 'store_type' => 'premium'],

            // REWE (Duitse keten ook beschikbaar) - 3 locaties
            ['chain' => 'REWE', 'name' => 'REWE Winkel 001', 'city' => 'Nederland', 'postal_code' => '5900 GG', 'address' => 'Straat 112', 'latitude' => 51.5400, 'longitude' => 5.6000, 'store_type' => 'supermarket'],
            ['chain' => 'REWE', 'name' => 'REWE Winkel 002', 'city' => 'Nederland', 'postal_code' => '6800 HH', 'address' => 'Straat 113', 'latitude' => 51.8500, 'longitude' => 5.8000, 'store_type' => 'supermarket'],
            ['chain' => 'REWE', 'name' => 'REWE Winkel 003', 'city' => 'Nederland', 'postal_code' => '6200 II', 'address' => 'Straat 114', 'latitude' => 51.7000, 'longitude' => 5.7000, 'store_type' => 'supermarket'],
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
