import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

class ShoppingListSummary {
  const ShoppingListSummary({
    required this.id,
    required this.name,
    required this.city,
    required this.itemsCount,
  });

  final int id;
  final String name;
  final String city;
  final int itemsCount;

  factory ShoppingListSummary.fromJson(Map<String, dynamic> json) {
    final items = json['items'];
    final itemsCount = items is List ? items.length : 0;

    return ShoppingListSummary(
      id: json['id'] as int,
      name: json['name'] as String? ?? 'Lijst',
      city: json['city'] as String? ?? '-',
      itemsCount: itemsCount,
    );
  }
}

class ShoppingListRepository {
  Future<List<ShoppingListSummary>> fetchMine() async {
    final response = await ApiClient.dio.get<List<dynamic>>('/shopping-lists');
    final list = response.data ?? [];

    return list
        .whereType<Map<String, dynamic>>()
        .map(ShoppingListSummary.fromJson)
        .toList();
  }
}

final shoppingListRepositoryProvider = Provider<ShoppingListRepository>((ref) {
  return ShoppingListRepository();
});

final shoppingListsProvider = FutureProvider<List<ShoppingListSummary>>((ref) {
  return ref.watch(shoppingListRepositoryProvider).fetchMine();
});
