import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

class FolderActionSummary {
  const FolderActionSummary({
    required this.id,
    required this.status,
    required this.storeName,
    required this.validFrom,
    required this.validUntil,
  });

  final int id;
  final String status;
  final String storeName;
  final String validFrom;
  final String validUntil;

  factory FolderActionSummary.fromJson(Map<String, dynamic> json) {
    final store = json['store'] as Map<String, dynamic>?;

    return FolderActionSummary(
      id: json['id'] as int,
      status: json['status'] as String? ?? 'pending',
      storeName: store?['name'] as String? ?? '-',
      validFrom: json['valid_from'] as String? ?? '-',
      validUntil: json['valid_until'] as String? ?? '-',
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
}

final folderActionsRepositoryProvider =
    Provider<FolderActionsRepository>((ref) {
  return FolderActionsRepository();
});

final folderActionsProvider = FutureProvider<List<FolderActionSummary>>((ref) {
  return ref.watch(folderActionsRepositoryProvider).fetchMine();
});
