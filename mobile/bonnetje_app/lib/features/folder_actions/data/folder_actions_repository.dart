import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

class FolderActionItemSummary {
  const FolderActionItemSummary({
    required this.id,
    required this.productName,
    required this.promoPrice,
  });

  final int id;
  final String productName;
  final double promoPrice;

  factory FolderActionItemSummary.fromJson(Map<String, dynamic> json) {
    final productJson = json['product'] as Map<String, dynamic>?;
    final promoPriceRaw = json['promo_price'];

    return FolderActionItemSummary(
      id: json['id'] as int? ?? 0,
      productName: productJson?['name'] as String? ??
          json['product_name_raw'] as String? ??
          'Onbekend product',
      promoPrice: promoPriceRaw is num
          ? promoPriceRaw.toDouble()
          : double.tryParse(promoPriceRaw?.toString() ?? '0') ?? 0,
    );
  }
}

class FolderActionSummary {
  const FolderActionSummary({
    required this.id,
    required this.status,
    required this.storeName,
    required this.storeChain,
    required this.validFrom,
    required this.validUntil,
    required this.items,
  });

  final int id;
  final String status;
  final String storeName;
  final String storeChain;
  final String validFrom;
  final String validUntil;
  final List<FolderActionItemSummary> items;

  factory FolderActionSummary.fromJson(Map<String, dynamic> json) {
    final store = json['store'] as Map<String, dynamic>?;
    final itemsJson = json['items'] as List<dynamic>? ?? [];

    return FolderActionSummary(
      id: json['id'] as int? ?? 0,
      status: json['status'] as String? ?? 'pending',
      storeName: store?['name'] as String? ?? '-',
      storeChain: store?['chain'] as String? ?? '-',
      validFrom: json['valid_from'] as String? ?? '-',
      validUntil: json['valid_until'] as String? ?? '-',
      items: itemsJson
          .whereType<Map<String, dynamic>>()
          .map(FolderActionItemSummary.fromJson)
          .toList(),
    );
  }
}

class FolderActionsRepository {
  Future<List<FolderActionSummary>> fetchMine() async {
    final response =
        await ApiClient.dio.get<Map<String, dynamic>>('/folder-actions/mine');
    final data = response.data ?? <String, dynamic>{};
    final list = data['data'] as List<dynamic>? ?? [];

    return list
        .whereType<Map<String, dynamic>>()
        .map(FolderActionSummary.fromJson)
        .toList();
  }

  Future<FolderActionSummary> create({
    required int storeId,
    required String validFrom,
    required String validUntil,
    required String imagePath,
  }) async {
    final formData = FormData.fromMap({
      'store_id': storeId,
      'valid_from': validFrom,
      'valid_until': validUntil,
      'image': await MultipartFile.fromFile(imagePath),
    });

    final response = await ApiClient.dio.post<Map<String, dynamic>>(
      '/folder-actions',
      data: formData,
      options: Options(
        headers: {'Content-Type': 'multipart/form-data'},
      ),
    );

    final actionJson = response.data?['folder_action'] as Map<String, dynamic>?;
    if (actionJson == null) {
      throw const FormatException('Onverwachte folderactie response.');
    }

    return FolderActionSummary.fromJson(actionJson);
  }

  Future<FolderActionSummary> fetchById(int id) async {
    final response =
        await ApiClient.dio.get<Map<String, dynamic>>('/folder-actions/$id');
    return FolderActionSummary.fromJson(response.data ?? <String, dynamic>{});
  }

  Future<FolderActionItemSummary> addItem({
    required int folderActionId,
    int? productId,
    String? productNameRaw,
    required double promoPrice,
    double? normalPrice,
    String? unitLabel,
  }) async {
    final response = await ApiClient.dio.post<Map<String, dynamic>>(
      '/folder-actions/$folderActionId/items',
      data: {
        if (productId != null) 'product_id': productId,
        if (productNameRaw != null && productNameRaw.isNotEmpty)
          'product_name_raw': productNameRaw,
        'promo_price': promoPrice,
        if (normalPrice != null) 'normal_price': normalPrice,
        if (unitLabel != null && unitLabel.isNotEmpty) 'unit_label': unitLabel,
      },
    );

    final itemJson = response.data?['item'] as Map<String, dynamic>?;
    if (itemJson == null) {
      throw const FormatException('Onverwachte folderactie-item response.');
    }

    return FolderActionItemSummary.fromJson(itemJson);
  }

  Future<List<FolderActionSummary>> fetchAdminPending() async {
    final response = await ApiClient.dio.get<Map<String, dynamic>>(
      '/admin/folder-actions',
      queryParameters: {'status': 'pending'},
    );
    final data = response.data ?? <String, dynamic>{};
    final list = data['data'] as List<dynamic>? ?? [];

    return list
        .whereType<Map<String, dynamic>>()
        .map(FolderActionSummary.fromJson)
        .toList();
  }

  Future<void> approve(int id) async {
    await ApiClient.dio.post('/admin/folder-actions/$id/approve');
  }

  Future<void> reject(int id) async {
    await ApiClient.dio.post('/admin/folder-actions/$id/reject');
  }
}

final folderActionsRepositoryProvider =
    Provider<FolderActionsRepository>((ref) {
  return FolderActionsRepository();
});

final folderActionsProvider = FutureProvider<List<FolderActionSummary>>((ref) {
  return ref.watch(folderActionsRepositoryProvider).fetchMine();
});
