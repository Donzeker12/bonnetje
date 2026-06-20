import 'package:dio/dio.dart';

import '../../../core/network/api_client.dart';
import '../domain/auth_user.dart';

class AuthRepository {
  Future<AuthLoginResult> login({
    required String email,
    required String password,
    String deviceName = 'bonnetje_flutter',
  }) async {
    final response = await ApiClient.dio.post<Map<String, dynamic>>(
      '/mobile/login',
      data: {
        'email': email,
        'password': password,
        'device_name': deviceName,
      },
    );

    final data = response.data ?? <String, dynamic>{};
    final token = data['token'] as String?;
    final userMap = data['user'] as Map<String, dynamic>?;
    if (token == null || userMap == null) {
      throw const FormatException('Onverwachte login response van server.');
    }

    return AuthLoginResult(
      user: AuthUser.fromJson(userMap),
      token: token,
    );
  }

  Future<AuthUser> me() async {
    final response =
        await ApiClient.dio.get<Map<String, dynamic>>('/mobile/me');
    final data = response.data;
    if (data == null) {
      throw const FormatException('Geen profieldata ontvangen.');
    }

    return AuthUser.fromJson(data);
  }

  Future<void> logout() async {
    try {
      await ApiClient.dio.post('/mobile/logout');
    } on DioException {
      // Ignore network/logout failures locally; token removal is source of truth on device.
    }
  }
}
