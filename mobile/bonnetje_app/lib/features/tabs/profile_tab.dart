import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/presentation/auth_controller.dart';
import '../profile/data/profile_repository.dart';

class ProfileTab extends ConsumerStatefulWidget {
  const ProfileTab({super.key});

  @override
  ConsumerState<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends ConsumerState<ProfileTab> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final authController = ref.read(authControllerProvider.notifier);
    final user = auth.valueOrNull;
    final isLoading = auth.isLoading;
    final profileAsync = user == null ? null : ref.watch(profileProvider);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Profiel', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          if (user == null) ...[
            const Text(
                'Log in met je Bonnetje account om API-functies te gebruiken.'),
            const SizedBox(height: 16),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'E-mail',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Wachtwoord',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: isLoading
                  ? null
                  : () async {
                      final messenger = ScaffoldMessenger.of(context);
                      await authController.login(
                        email: _emailController.text.trim(),
                        password: _passwordController.text,
                      );

                      final hasError =
                          ref.read(authControllerProvider).hasError;
                      if (!mounted) return;

                      messenger.showSnackBar(
                        SnackBar(
                          content: Text(
                            hasError
                                ? 'Inloggen mislukt. Controleer je gegevens.'
                                : 'Inloggen gelukt.',
                          ),
                        ),
                      );
                    },
              child: isLoading
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Inloggen'),
            ),
            if (auth.hasError) ...[
              const SizedBox(height: 8),
              Builder(
                builder: (context) {
                  final rawError = auth.error.toString();
                  // Clean "Exception: " prefix if present to make it beautiful
                  final displayError = rawError.startsWith('Exception: ')
                      ? rawError.substring(11)
                      : rawError;
                  return Text(
                    displayError,
                    style:
                        TextStyle(color: Theme.of(context).colorScheme.error),
                  );
                },
              ),
            ],
          ] else ...[
            Card(
              child: ListTile(
                title: Text(user.name),
                subtitle: Text(
                    '${user.email}\nRol: ${user.role} • Level: ${user.level ?? 1}'),
                isThreeLine: true,
              ),
            ),
            const SizedBox(height: 12),
            if (profileAsync != null)
              profileAsync.when(
                data: (profile) => Column(
                  children: [
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Statistieken',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            _ProfileStatRow(
                              label: 'Scans totaal',
                              value: '${profile.stats.totalScans}',
                            ),
                            _ProfileStatRow(
                              label: 'Scans deze week',
                              value: '${profile.stats.scansThisWeek}',
                            ),
                            _ProfileStatRow(
                              label: 'Punten',
                              value: '${profile.stats.totalPoints}',
                            ),
                            _ProfileStatRow(
                              label: 'Level',
                              value: '${profile.stats.level}',
                            ),
                            _ProfileStatRow(
                              label: 'Badges',
                              value: '${profile.stats.badgesCount}',
                            ),
                            _ProfileStatRow(
                              label: 'Rank',
                              value: profile.stats.rank?.toString() ?? '-',
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Verdiende badges',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            if (profile.earnedBadges.isEmpty)
                              const Text('Nog geen badges verdiend.')
                            else
                              ...profile.earnedBadges.map(
                                (badge) => ListTile(
                                  contentPadding: EdgeInsets.zero,
                                  leading: Text(badge.icon ?? '🏆',
                                      style: const TextStyle(fontSize: 24)),
                                  title: Text(badge.name),
                                  subtitle: Text(badge.description),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Beschikbaar / locked',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            Text(
                                'Bijna verdiend: ${profile.availableBadges.length}'),
                            Text('Locked: ${profile.lockedBadges.length}'),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                loading: () => const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Center(child: CircularProgressIndicator()),
                ),
                error: (error, _) => Card(
                  child: ListTile(
                    title: const Text('Profieldata laden mislukt'),
                    subtitle: Text(error.toString()),
                  ),
                ),
              ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: isLoading
                  ? null
                  : () async {
                      final messenger = ScaffoldMessenger.of(context);
                      await authController.logout();
                      if (!mounted) return;
                      messenger.showSnackBar(
                        const SnackBar(content: Text('Uitgelogd.')),
                      );
                    },
              child: const Text('Uitloggen'),
            ),
          ],
        ],
      ),
    );
  }
}

class _ProfileStatRow extends StatelessWidget {
  const _ProfileStatRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
