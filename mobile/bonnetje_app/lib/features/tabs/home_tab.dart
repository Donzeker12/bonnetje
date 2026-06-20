import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../stores/data/stores_repository.dart';

class HomeTab extends ConsumerWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storesAsync = ref.watch(storesListProvider);

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async => ref.refresh(storesListProvider.future),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Dashboard', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('Live supermarkten uit de Laravel API.'),
            const SizedBox(height: 16),
            storesAsync.when(
              data: (stores) {
                if (stores.isEmpty) {
                  return const Card(
                    child: ListTile(
                      title: Text('Geen winkels gevonden'),
                      subtitle: Text('Controleer of de backend data bevat.'),
                    ),
                  );
                }

                return Column(
                  children: stores
                      .take(10)
                      .map(
                        (store) => Card(
                          child: ListTile(
                            title: Text(store.name),
                            subtitle: Text('${store.chain} • ${store.city}'),
                            trailing: Text(store.countryCode),
                          ),
                        ),
                      )
                      .toList(),
                );
              },
              loading: () => const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: CircularProgressIndicator(),
                ),
              ),
              error: (error, _) => Card(
                child: ListTile(
                  title: const Text('Winkels laden mislukt'),
                  subtitle: Text(error.toString()),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
