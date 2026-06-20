import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/auth_token_storage.dart';
import '../data/auth_repository.dart';
import '../domain/auth_user.dart';

final secureStorageProvider = Provider<FlutterSecureStorage>(
  (ref) => const FlutterSecureStorage(),
);

final authTokenStorageProvider = Provider<AuthTokenStorage>(
  (ref) => AuthTokenStorage(ref.watch(secureStorageProvider)),
);

final authRepositoryProvider =
    Provider<AuthRepository>((ref) => AuthRepository());

final authControllerProvider =
    AsyncNotifierProvider<AuthController, AuthUser?>(AuthController.new);

class AuthController extends AsyncNotifier<AuthUser?> {
  @override
  Future<AuthUser?> build() async {
    final token = await ref.read(authTokenStorageProvider).readToken();
    ApiClient.setAuthToken(token);

    if (token == null || token.isEmpty) {
      return null;
    }

    try {
      final user = await ref.read(authRepositoryProvider).me();
      return user;
    } on DioException {
      await ref.read(authTokenStorageProvider).clearToken();
      ApiClient.setAuthToken(null);
      return null;
    }
  }

  Future<void> login({required String email, required String password}) async {
    final repository = ref.read(authRepositoryProvider);
    final storage = ref.read(authTokenStorageProvider);

    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final result = await repository.login(email: email, password: password);
      await storage.writeToken(result.token);
      ApiClient.setAuthToken(result.token);
      return result.user;
    });
  }

  Future<void> logout() async {
    final repository = ref.read(authRepositoryProvider);
    final storage = ref.read(authTokenStorageProvider);

    await repository.logout();
    await storage.clearToken();
    ApiClient.setAuthToken(null);
    state = const AsyncData(null);
  }
}
