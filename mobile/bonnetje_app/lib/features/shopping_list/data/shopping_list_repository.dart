import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

class ShoppingListProductSummary {
  const ShoppingListProductSummary({
    required this.id,
    required this.name,
    required this.brand,
  });

  final int id;
  final String name;
  final String? brand;

  factory ShoppingListProductSummary.fromJson(Map<String, dynamic> json) {
    return ShoppingListProductSummary(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'Product',
      brand: json['brand'] as String?,
    );
  }
}

class ShoppingListProductSearchResult {
  const ShoppingListProductSearchResult({
    required this.id,
    required this.name,
    required this.brand,
    required this.lowestKnownPrice,
  });

  final int id;
  final String name;
  final String? brand;
  final double? lowestKnownPrice;

  factory ShoppingListProductSearchResult.fromJson(Map<String, dynamic> json) {
    final prices = json['prices'] as List<dynamic>? ?? [];
    double? lowestKnownPrice;

    for (final priceJson in prices.whereType<Map<String, dynamic>>()) {
      final rawPrice = priceJson['price'];
      final value = rawPrice is num
          ? rawPrice.toDouble()
          : double.tryParse(rawPrice?.toString() ?? '');
      if (value == null) {
        continue;
      }

      if (lowestKnownPrice == null || value < lowestKnownPrice) {
        lowestKnownPrice = value;
      }
    }

    return ShoppingListProductSearchResult(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'Product',
      brand: json['brand'] as String?,
      lowestKnownPrice: lowestKnownPrice,
    );
  }
}

class ShoppingListItemSummary {
  const ShoppingListItemSummary({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.isChecked,
    required this.product,
  });

  final int id;
  final int productId;
  final int quantity;
  final bool isChecked;
  final ShoppingListProductSummary? product;

  factory ShoppingListItemSummary.fromJson(Map<String, dynamic> json) {
    final productJson = json['product'] as Map<String, dynamic>?;

    return ShoppingListItemSummary(
      id: json['id'] as int? ?? 0,
      productId: json['product_id'] as int? ?? 0,
      quantity: json['quantity'] as int? ?? 1,
      isChecked: json['is_checked'] as bool? ?? false,
      product: productJson == null
          ? null
          : ShoppingListProductSummary.fromJson(productJson),
    );
  }
}

class ShoppingListSummary {
  const ShoppingListSummary({
    required this.id,
    required this.name,
    required this.city,
    required this.itemsCount,
    required this.isActive,
    required this.items,
  });

  final int id;
  final String name;
  final String city;
  final int itemsCount;
  final bool isActive;
  final List<ShoppingListItemSummary> items;

  factory ShoppingListSummary.fromJson(Map<String, dynamic> json) {
    final itemsJson = json['items'] as List<dynamic>? ?? [];
    final items = itemsJson
        .whereType<Map<String, dynamic>>()
        .map(ShoppingListItemSummary.fromJson)
        .toList();

    return ShoppingListSummary(
      id: json['id'] as int,
      name: json['name'] as String? ?? 'Lijst',
      city: json['city'] as String? ?? '-',
      itemsCount: items.length,
      isActive: json['is_active'] as bool? ?? false,
      items: items,
    );
  }
}

class ShoppingListReceiptItem {
  const ShoppingListReceiptItem({
    required this.productId,
    required this.name,
    required this.quantity,
    required this.available,
    required this.unitPrice,
    required this.lineTotal,
  });

  final int productId;
  final String name;
  final int quantity;
  final bool available;
  final double? unitPrice;
  final double lineTotal;

  factory ShoppingListReceiptItem.fromJson(Map<String, dynamic> json) {
    final unitPriceRaw = json['unit_price'];
    final lineTotalRaw = json['line_total'];

    return ShoppingListReceiptItem(
      productId: json['product_id'] as int? ?? 0,
      name: json['name'] as String? ?? 'Product',
      quantity: json['quantity'] as int? ?? 1,
      available: json['available'] as bool? ?? false,
      unitPrice: unitPriceRaw == null
          ? null
          : unitPriceRaw is num
              ? unitPriceRaw.toDouble()
              : double.tryParse(unitPriceRaw.toString()),
      lineTotal: lineTotalRaw is num
          ? lineTotalRaw.toDouble()
          : double.tryParse(lineTotalRaw?.toString() ?? '0') ?? 0,
    );
  }
}

class ShoppingListReceiptSummary {
  const ShoppingListReceiptSummary({
    required this.storeName,
    required this.storeAddress,
    required this.subtotal,
    required this.unavailableCount,
    required this.items,
  });

  final String storeName;
  final String storeAddress;
  final double subtotal;
  final int unavailableCount;
  final List<ShoppingListReceiptItem> items;

  factory ShoppingListReceiptSummary.fromJson(Map<String, dynamic> json) {
    final storeJson =
        json['store'] as Map<String, dynamic>? ?? <String, dynamic>{};
    final itemsJson = json['items'] as List<dynamic>? ?? [];
    final subtotalRaw = json['subtotal'];

    return ShoppingListReceiptSummary(
      storeName: storeJson['chain'] as String? ?? '-',
      storeAddress: storeJson['address'] as String? ?? '-',
      subtotal: subtotalRaw is num
          ? subtotalRaw.toDouble()
          : double.tryParse(subtotalRaw?.toString() ?? '0') ?? 0,
      unavailableCount: json['unavailable_count'] as int? ?? 0,
      items: itemsJson
          .whereType<Map<String, dynamic>>()
          .map(ShoppingListReceiptItem.fromJson)
          .toList(),
    );
  }
}

class StoreComparisonSummary {
  const StoreComparisonSummary({
    required this.storeId,
    required this.storeChain,
    required this.storeAddress,
    required this.total,
    required this.itemsAvailable,
    required this.totalItems,
  });

  final int storeId;
  final String storeChain;
  final String storeAddress;
  final double total;
  final int itemsAvailable;
  final int totalItems;

  factory StoreComparisonSummary.fromJson(Map<String, dynamic> json) {
    final storeJson =
        json['store'] as Map<String, dynamic>? ?? <String, dynamic>{};
    final totalRaw = json['total'];

    return StoreComparisonSummary(
      storeId: storeJson['id'] as int? ?? 0,
      storeChain: storeJson['chain'] as String? ?? '-',
      storeAddress: storeJson['address'] as String? ?? '-',
      total: totalRaw is num
          ? totalRaw.toDouble()
          : double.tryParse(totalRaw?.toString() ?? '0') ?? 0,
      itemsAvailable: json['items_available'] as int? ?? 0,
      totalItems: json['total_items'] as int? ?? 0,
    );
  }
}

class OptimizationStoreSummary {
  const OptimizationStoreSummary({
    required this.storeChain,
    required this.storeAddress,
    required this.total,
    required this.itemCount,
  });

  final String storeChain;
  final String storeAddress;
  final double total;
  final int itemCount;

  factory OptimizationStoreSummary.fromJson(Map<String, dynamic> json) {
    final storeJson =
        json['store'] as Map<String, dynamic>? ?? <String, dynamic>{};
    final totalRaw = json['total'];

    return OptimizationStoreSummary(
      storeChain: storeJson['chain'] as String? ?? '-',
      storeAddress: storeJson['address'] as String? ?? '-',
      total: totalRaw is num
          ? totalRaw.toDouble()
          : double.tryParse(totalRaw?.toString() ?? '0') ?? 0,
      itemCount: json['item_count'] as int? ?? 0,
    );
  }
}

class ShoppingListComparisonSummary {
  const ShoppingListComparisonSummary({
    required this.comparison,
    required this.receipt,
  });

  final List<StoreComparisonSummary> comparison;
  final ShoppingListReceiptSummary? receipt;

  factory ShoppingListComparisonSummary.fromJson(Map<String, dynamic> json) {
    final comparisonJson = json['comparison'] as List<dynamic>? ?? [];
    final receiptJson = json['receipt'] as Map<String, dynamic>?;

    return ShoppingListComparisonSummary(
      comparison: comparisonJson
          .whereType<Map<String, dynamic>>()
          .map(StoreComparisonSummary.fromJson)
          .toList(),
      receipt: receiptJson == null
          ? null
          : ShoppingListReceiptSummary.fromJson(receiptJson),
    );
  }
}

class ShoppingListOptimizationSummary {
  const ShoppingListOptimizationSummary({
    required this.totalCost,
    required this.potentialSavings,
    required this.storesNeeded,
    required this.stores,
  });

  final double totalCost;
  final double potentialSavings;
  final int storesNeeded;
  final List<OptimizationStoreSummary> stores;

  factory ShoppingListOptimizationSummary.fromJson(Map<String, dynamic> json) {
    final storesJson = json['optimization'] as List<dynamic>? ?? [];
    final totalCostRaw = json['total_cost'];
    final savingsRaw = json['potential_savings'];

    return ShoppingListOptimizationSummary(
      totalCost: totalCostRaw is num
          ? totalCostRaw.toDouble()
          : double.tryParse(totalCostRaw?.toString() ?? '0') ?? 0,
      potentialSavings: savingsRaw is num
          ? savingsRaw.toDouble()
          : double.tryParse(savingsRaw?.toString() ?? '0') ?? 0,
      storesNeeded: json['stores_needed'] as int? ?? 0,
      stores: storesJson
          .whereType<Map<String, dynamic>>()
          .map(OptimizationStoreSummary.fromJson)
          .toList(),
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

  Future<ShoppingListSummary> createList({
    required String name,
    String? city,
    bool isActive = true,
  }) async {
    final response = await ApiClient.dio.post<Map<String, dynamic>>(
      '/shopping-lists',
      data: {
        'name': name,
        'city': city,
        'is_active': isActive,
      },
    );

    return ShoppingListSummary.fromJson(response.data ?? <String, dynamic>{});
  }

  Future<ShoppingListSummary> updateList({
    required int listId,
    String? name,
    String? city,
    bool? isActive,
  }) async {
    final response = await ApiClient.dio.put<Map<String, dynamic>>(
      '/shopping-lists/$listId',
      data: {
        if (name != null) 'name': name,
        if (city != null) 'city': city,
        if (isActive != null) 'is_active': isActive,
      },
    );

    return ShoppingListSummary.fromJson(response.data ?? <String, dynamic>{});
  }

  Future<void> deleteList(int listId) async {
    await ApiClient.dio.delete('/shopping-lists/$listId');
  }

  Future<void> addItem({
    required int listId,
    required int productId,
    int quantity = 1,
  }) async {
    await ApiClient.dio.post('/shopping-lists/$listId/items', data: {
      'product_id': productId,
      'quantity': quantity,
    });
  }

  Future<void> updateItem({
    required int listId,
    required int itemId,
    int? quantity,
    bool? isChecked,
  }) async {
    await ApiClient.dio.put('/shopping-lists/$listId/items/$itemId', data: {
      if (quantity != null) 'quantity': quantity,
      if (isChecked != null) 'is_checked': isChecked,
    });
  }

  Future<void> removeItem({
    required int listId,
    required int itemId,
  }) async {
    await ApiClient.dio.delete('/shopping-lists/$listId/items/$itemId');
  }

  Future<List<ShoppingListProductSearchResult>> searchProducts(
      String query) async {
    final response = await ApiClient.dio.get<Map<String, dynamic>>(
      '/products/search',
      queryParameters: {'q': query},
    );

    final list = response.data?['data'] as List<dynamic>? ?? [];
    return list
        .whereType<Map<String, dynamic>>()
        .map(ShoppingListProductSearchResult.fromJson)
        .toList();
  }

  Future<ShoppingListComparisonSummary> compare(int listId) async {
    final response = await ApiClient.dio.get<Map<String, dynamic>>(
      '/shopping-lists/$listId/compare',
    );

    return ShoppingListComparisonSummary.fromJson(
      response.data ?? <String, dynamic>{},
    );
  }

  Future<ShoppingListOptimizationSummary> optimize(int listId) async {
    final response = await ApiClient.dio.get<Map<String, dynamic>>(
      '/shopping-lists/$listId/optimize',
    );

    return ShoppingListOptimizationSummary.fromJson(
      response.data ?? <String, dynamic>{},
    );
  }
}

final shoppingListRepositoryProvider = Provider<ShoppingListRepository>((ref) {
  return ShoppingListRepository();
});

final shoppingListsProvider = FutureProvider<List<ShoppingListSummary>>((ref) {
  return ref.watch(shoppingListRepositoryProvider).fetchMine();
});
