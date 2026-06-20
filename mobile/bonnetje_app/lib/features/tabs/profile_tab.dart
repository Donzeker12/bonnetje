import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/presentation/auth_controller.dart';

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
              Text(
                auth.error.toString(),
                style: TextStyle(color: Theme.of(context).colorScheme.error),
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
