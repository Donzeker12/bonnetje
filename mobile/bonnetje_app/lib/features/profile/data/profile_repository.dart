import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';

class ProfileBadgeSummary {
  const ProfileBadgeSummary({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
  });

  final int id;
  final String name;
  final String description;
  final String? icon;

  factory ProfileBadgeSummary.fromJson(Map<String, dynamic> json) {
    return ProfileBadgeSummary(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'Badge',
      description: json['description'] as String? ?? '',
      icon: json['icon'] as String?,
    );
  }
}

class ProfileStatsSummary {
  const ProfileStatsSummary({
    required this.totalScans,
    required this.scansThisWeek,
    required this.totalPoints,
    required this.level,
    required this.badgesCount,
    required this.rank,
  });

  final int totalScans;
  final int scansThisWeek;
  final int totalPoints;
  final int level;
  final int badgesCount;
  final int? rank;

  factory ProfileStatsSummary.fromJson(Map<String, dynamic> json) {
    return ProfileStatsSummary(
      totalScans: json['total_scans'] as int? ?? 0,
      scansThisWeek: json['scans_this_week'] as int? ?? 0,
      totalPoints: json['total_points'] as int? ?? 0,
      level: json['level'] as int? ?? 1,
      badgesCount: json['badges_count'] as int? ?? 0,
      rank: json['rank'] as int?,
    );
  }
}

class ProfileSummary {
  const ProfileSummary({
    required this.userName,
    required this.email,
    required this.city,
    required this.level,
    required this.stats,
    required this.earnedBadges,
    required this.availableBadges,
    required this.lockedBadges,
  });

  final String userName;
  final String email;
  final String? city;
  final int level;
  final ProfileStatsSummary stats;
  final List<ProfileBadgeSummary> earnedBadges;
  final List<ProfileBadgeSummary> availableBadges;
  final List<ProfileBadgeSummary> lockedBadges;
}

class ProfileRepository {
  Future<ProfileSummary> fetchProfile() async {
    final profileResponse =
        await ApiClient.dio.get<Map<String, dynamic>>('/profile');
    final badgesResponse =
        await ApiClient.dio.get<Map<String, dynamic>>('/badges');

    final profileData = profileResponse.data ?? <String, dynamic>{};
    final userJson =
        profileData['user'] as Map<String, dynamic>? ?? <String, dynamic>{};
    final statsJson =
        profileData['stats'] as Map<String, dynamic>? ?? <String, dynamic>{};
    final badgesData = badgesResponse.data ?? <String, dynamic>{};

    List<ProfileBadgeSummary> parseBadges(String key) {
      final list = badgesData[key] as List<dynamic>? ?? [];
      return list
          .whereType<Map<String, dynamic>>()
          .map(ProfileBadgeSummary.fromJson)
          .toList();
    }

    return ProfileSummary(
      userName: userJson['name'] as String? ?? 'Gebruiker',
      email: userJson['email'] as String? ?? '',
      city: userJson['city'] as String?,
      level: userJson['level'] as int? ?? 1,
      stats: ProfileStatsSummary.fromJson(statsJson),
      earnedBadges: parseBadges('earned'),
      availableBadges: parseBadges('available'),
      lockedBadges: parseBadges('locked'),
    );
  }
}

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return ProfileRepository();
});

final profileProvider = FutureProvider<ProfileSummary>((ref) {
  return ref.watch(profileRepositoryProvider).fetchProfile();
});
