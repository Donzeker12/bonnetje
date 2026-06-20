import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/presentation/auth_controller.dart';
import '../shopping_list/data/shopping_list_repository.dart';

class ShoppingListTab extends ConsumerWidget {
  const ShoppingListTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final user = auth.valueOrNull;

    if (user == null) {
      return const _AuthRequired(
        title: 'Boodschappenlijst',
        subtitle: 'Log in bij Profiel om je lijsten op te halen.',
      );
    }

    final listsAsync = ref.watch(shoppingListsProvider);
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async => ref.refresh(shoppingListsProvider.future),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Boodschappenlijst',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text('Ingelogd als ${user.name}'),
            const SizedBox(height: 16),
            listsAsync.when(
              data: (lists) {
                if (lists.isEmpty) {
                  return const Card(
                    child: ListTile(
                      title: Text('Nog geen lijsten'),
                      subtitle:
                          Text('Maak eerst een lijst in de webapp of API.'),
                    ),
                  );
                }

                return Column(
                  children: lists
                      .map(
                        (list) => Card(
                          child: ListTile(
                            title: Text(list.name),
                            subtitle:
                                Text('${list.city} • ${list.itemsCount} items'),
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
                  title: const Text('Lijsten laden mislukt'),
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

class _AuthRequired extends StatelessWidget {
  const _AuthRequired({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(subtitle),
          ],
        ),
      ),
    );
  }
}
