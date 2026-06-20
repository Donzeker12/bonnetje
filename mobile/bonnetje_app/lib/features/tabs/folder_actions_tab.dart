import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/presentation/auth_controller.dart';
import '../folder_actions/data/folder_actions_repository.dart';

class FolderActionsTab extends ConsumerWidget {
  const FolderActionsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final user = auth.valueOrNull;

    if (user == null) {
      return const _AuthRequired(
        title: 'Folder Acties',
        subtitle: 'Log in bij Profiel om jouw folderacties te zien.',
      );
    }

    final actionsAsync = ref.watch(folderActionsProvider);

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async => ref.refresh(folderActionsProvider.future),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Folder Acties',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text('Ingelogd als ${user.name}'),
            const SizedBox(height: 16),
            actionsAsync.when(
              data: (actions) {
                if (actions.isEmpty) {
                  return const Card(
                    child: ListTile(
                      title: Text('Nog geen folderacties'),
                      subtitle: Text('Upload acties in de webapp of scanflow.'),
                    ),
                  );
                }

                return Column(
                  children: actions
                      .map(
                        (action) => Card(
                          child: ListTile(
                            title: Text(action.storeName),
                            subtitle: Text(
                              '${action.validFrom} t/m ${action.validUntil}',
                            ),
                            trailing: Text(action.status),
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
                  title: const Text('Folderacties laden mislukt'),
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
