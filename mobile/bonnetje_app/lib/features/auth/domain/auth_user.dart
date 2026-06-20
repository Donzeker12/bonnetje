class AuthUser {
  const AuthUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.city,
    this.level,
  });

  final int id;
  final String name;
  final String email;
  final String role;
  final String? city;
  final int? level;

  bool get isAdmin => role == 'admin';

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as int,
      name: json['name'] as String? ?? 'Onbekend',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? 'user',
      city: json['city'] as String?,
      level: json['level'] as int?,
    );
  }
}

class AuthLoginResult {
  const AuthLoginResult({required this.user, required this.token});

  final AuthUser user;
  final String token;
}
