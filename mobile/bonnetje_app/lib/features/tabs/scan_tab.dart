import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/presentation/auth_controller.dart';

class ScanTab extends ConsumerWidget {
  const ScanTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Scan', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text(
                'Barcode scannen en prijsinvoer worden in de volgende sprint gekoppeld.'),
            const SizedBox(height: 16),
            Card(
              child: ListTile(
                title: const Text('Authenticatie status'),
                subtitle: Text(
                  auth.valueOrNull == null
                      ? 'Niet ingelogd'
                      : 'Ingelogd als ${auth.valueOrNull!.name}',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
