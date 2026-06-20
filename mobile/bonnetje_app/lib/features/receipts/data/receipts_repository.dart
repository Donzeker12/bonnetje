import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

class ReceiptStoreSummary {
  const ReceiptStoreSummary({
    required this.id,
    required this.name,
    required this.chain,
    required this.address,
    required this.city,
  });

  final int id;
  final String name;
  final String chain;
  final String address;
  final String city;

  factory ReceiptStoreSummary.fromJson(Map<String, dynamic> json) {
    return ReceiptStoreSummary(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '-',
      chain: json['chain'] as String? ?? '-',
      address: json['address'] as String? ?? '-',
      city: json['city'] as String? ?? '-',
    );
  }
}

class ReceiptItemSummary {
  const ReceiptItemSummary({
    required this.name,
    required this.price,
  });

  final String name;
  final double price;

  factory ReceiptItemSummary.fromJson(Map<String, dynamic> json) {
    final rawPrice = json['price'];

    return ReceiptItemSummary(
      name: json['name'] as String? ?? '-',
      price: rawPrice is num
          ? rawPrice.toDouble()
          : double.tryParse(rawPrice?.toString() ?? '0') ?? 0,
    );
  }
}

class ReceiptSummary {
  const ReceiptSummary({
    required this.id,
    required this.status,
    required this.imagePath,
    required this.itemsCount,
    required this.totalAmount,
    required this.purchaseDate,
    required this.store,
    required this.parsedItems,
  });

  final int id;
  final String status;
  final String imagePath;
  final int itemsCount;
  final double? totalAmount;
  final String? purchaseDate;
  final ReceiptStoreSummary? store;
  final List<ReceiptItemSummary> parsedItems;

  bool get canProcess => status == 'pending';

  factory ReceiptSummary.fromJson(Map<String, dynamic> json) {
    final parsedItemsJson = json['parsed_items'] as List<dynamic>? ?? [];
    final totalAmountRaw = json['total_amount'];
    final storeJson = json['store'] as Map<String, dynamic>?;

    return ReceiptSummary(
      id: json['id'] as int? ?? 0,
      status: json['status'] as String? ?? 'pending',
      imagePath: json['image_path'] as String? ?? '-',
      itemsCount: json['items_count'] as int? ?? 0,
      totalAmount: totalAmountRaw == null
          ? null
          : totalAmountRaw is num
              ? totalAmountRaw.toDouble()
              : double.tryParse(totalAmountRaw.toString()),
      purchaseDate: json['purchase_date'] as String?,
      store: storeJson == null ? null : ReceiptStoreSummary.fromJson(storeJson),
      parsedItems: parsedItemsJson
          .whereType<Map<String, dynamic>>()
          .map(ReceiptItemSummary.fromJson)
          .toList(),
    );
  }
}

class ReceiptsRepository {
  Future<List<ReceiptSummary>> fetchMine() async {
    final response = await ApiClient.dio.get<List<dynamic>>('/receipts');
    final list = response.data ?? [];

    return list
        .whereType<Map<String, dynamic>>()
        .map(ReceiptSummary.fromJson)
        .toList();
  }

  Future<ReceiptSummary> uploadReceipt({
    required int storeId,
    required String imagePath,
    String? ocrRawText,
  }) async {
    final formData = FormData.fromMap({
      'store_id': storeId,
      'image': await MultipartFile.fromFile(imagePath),
      if (ocrRawText != null && ocrRawText.trim().isNotEmpty)
        'ocr_raw_text': ocrRawText.trim(),
    });

    final response = await ApiClient.dio.post<Map<String, dynamic>>(
      '/receipts',
      data: formData,
      options: Options(
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      ),
    );

    final data = response.data ?? <String, dynamic>{};
    final receiptJson = data['receipt'] as Map<String, dynamic>?;
    if (receiptJson == null) {
      throw const FormatException('Onverwachte receipt response van server.');
    }

    return ReceiptSummary.fromJson(receiptJson);
  }

  Future<ReceiptSummary> processReceipt(int receiptId) async {
    final response = await ApiClient.dio.post<Map<String, dynamic>>(
      '/receipts/$receiptId/process',
    );

    final data = response.data ?? <String, dynamic>{};
    final receiptJson = data['receipt'] as Map<String, dynamic>?;
    if (receiptJson == null) {
      throw const FormatException('Onverwachte process response van server.');
    }

    return ReceiptSummary.fromJson(receiptJson);
  }
}

final receiptsRepositoryProvider = Provider<ReceiptsRepository>((ref) {
  return ReceiptsRepository();
});

final receiptsProvider = FutureProvider<List<ReceiptSummary>>((ref) {
  return ref.watch(receiptsRepositoryProvider).fetchMine();
});
