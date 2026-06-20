import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

class StoreSummary {
  const StoreSummary({
    required this.id,
    required this.name,
    required this.chain,
    required this.city,
    required this.countryCode,
  });

  final int id;
  final String name;
  final String chain;
  final String city;
  final String countryCode;

  factory StoreSummary.fromJson(Map<String, dynamic> json) {
    return StoreSummary(
      id: json['id'] as int,
      name: json['name'] as String? ?? '-',
      chain: json['chain'] as String? ?? '-',
      city: json['city'] as String? ?? '-',
      countryCode: json['country_code'] as String? ?? 'NL',
    );
  }
}

class StoresRepository {
  Future<List<StoreSummary>> fetchStores({String countryCode = 'NL'}) async {
    final response = await ApiClient.dio.get<List<dynamic>>(
      '/stores',
      queryParameters: {
        'country_code': countryCode,
      },
    );

    final list = response.data ?? [];
    return list
        .whereType<Map<String, dynamic>>()
        .map(StoreSummary.fromJson)
        .toList();
  }
}

final storesRepositoryProvider = Provider<StoresRepository>((ref) {
  return StoresRepository();
});

final storesListProvider = FutureProvider<List<StoreSummary>>((ref) {
  return ref.watch(storesRepositoryProvider).fetchStores();
});
