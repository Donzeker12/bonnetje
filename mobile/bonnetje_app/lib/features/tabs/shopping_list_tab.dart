import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../auth/presentation/auth_controller.dart';
import '../shopping_list/data/shopping_list_repository.dart';

class ShoppingListTab extends ConsumerStatefulWidget {
  const ShoppingListTab({super.key});

  @override
  ConsumerState<ShoppingListTab> createState() => _ShoppingListTabState();
}

class _ShoppingListTabState extends ConsumerState<ShoppingListTab> {
  final TextEditingController _newListController = TextEditingController();
  final TextEditingController _productSearchController =
      TextEditingController();

  int? _selectedListId;
  bool _isCreatingList = false;
  bool _isLoadingDetails = false;
  bool _isOptimizing = false;
  int? _addingProductId;
  String? _message;
  String? _error;
  ShoppingListComparisonSummary? _comparison;
  ShoppingListOptimizationSummary? _optimization;
  List<ShoppingListProductSearchResult> _searchResults = const [];
  bool _searchingProducts = false;

  @override
  void dispose() {
    _newListController.dispose();
    _productSearchController.dispose();
    super.dispose();
  }

  Future<void> _loadComparison() async {
    if (_selectedListId == null) {
      return;
    }

    setState(() {
      _isLoadingDetails = true;
    });

    try {
      final comparison = await ref
          .read(shoppingListRepositoryProvider)
          .compare(_selectedListId!);
      if (!mounted) {
        return;
      }
      setState(() {
        _comparison = comparison;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Prijsvergelijking laden mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingDetails = false;
        });
      }
    }
  }

  Future<void> _loadOptimization() async {
    if (_selectedListId == null) {
      return;
    }

    setState(() {
      _isOptimizing = true;
      _error = null;
    });

    try {
      final optimization = await ref
          .read(shoppingListRepositoryProvider)
          .optimize(_selectedListId!);
      if (!mounted) {
        return;
      }
      setState(() {
        _optimization = optimization;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Optimalisatie laden mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isOptimizing = false;
        });
      }
    }
  }

  Future<void> _refreshLists() async {
    final lists = await ref.refresh(shoppingListsProvider.future);
    if (!mounted) {
      return;
    }

    final fallbackId = lists.any((list) => list.id == _selectedListId)
        ? _selectedListId
        : (lists.isNotEmpty
            ? (lists
                .firstWhere((list) => list.isActive, orElse: () => lists.first)
                .id)
            : null);

    setState(() {
      _selectedListId = fallbackId;
    });

    if (_selectedListId != null) {
      await _loadComparison();
    } else {
      setState(() {
        _comparison = null;
        _optimization = null;
      });
    }
  }

  Future<void> _createList(String? city) async {
    final name = _newListController.text.trim();
    if (name.isEmpty) {
      setState(() {
        _error = 'Vul eerst een lijstnaam in.';
      });
      return;
    }

    setState(() {
      _isCreatingList = true;
      _error = null;
      _message = null;
    });

    try {
      final created = await ref.read(shoppingListRepositoryProvider).createList(
            name: name,
            city: city,
            isActive: true,
          );

      _newListController.clear();
      await _refreshLists();
      if (!mounted) {
        return;
      }
      setState(() {
        _selectedListId = created.id;
        _message = 'Lijst aangemaakt.';
      });
      await _loadComparison();
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Lijst aanmaken mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isCreatingList = false;
        });
      }
    }
  }

  Future<void> _searchProducts(String query) async {
    if (query.trim().length < 2) {
      setState(() {
        _searchResults = const [];
        _searchingProducts = false;
      });
      return;
    }

    setState(() {
      _searchingProducts = true;
    });

    try {
      final results = await ref
          .read(shoppingListRepositoryProvider)
          .searchProducts(query.trim());
      if (!mounted) {
        return;
      }
      setState(() {
        _searchResults = results;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _searchResults = const [];
        _error = 'Producten zoeken mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _searchingProducts = false;
        });
      }
    }
  }

  Future<void> _addProduct(int productId) async {
    if (_selectedListId == null) {
      return;
    }

    setState(() {
      _addingProductId = productId;
      _error = null;
      _message = null;
    });

    try {
      await ref.read(shoppingListRepositoryProvider).addItem(
            listId: _selectedListId!,
            productId: productId,
          );
      _productSearchController.clear();
      setState(() {
        _searchResults = const [];
        _message = 'Product toegevoegd aan je lijst.';
      });
      await _refreshLists();
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Toevoegen mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _addingProductId = null;
        });
      }
    }
  }

  Future<void> _updateItem({
    required ShoppingListItemSummary item,
    int? quantity,
    bool? isChecked,
  }) async {
    if (_selectedListId == null) {
      return;
    }

    try {
      await ref.read(shoppingListRepositoryProvider).updateItem(
            listId: _selectedListId!,
            itemId: item.id,
            quantity: quantity,
            isChecked: isChecked,
          );
      await _refreshLists();
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Item bijwerken mislukt.';
      });
    }
  }

  Future<void> _removeItem(int itemId) async {
    if (_selectedListId == null) {
      return;
    }

    try {
      await ref.read(shoppingListRepositoryProvider).removeItem(
            listId: _selectedListId!,
            itemId: itemId,
          );
      await _refreshLists();
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Item verwijderen mislukt.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final user = auth.valueOrNull;

    if (user == null) {
      return const _AuthRequired(
        title: 'Boodschappenlijst',
        subtitle: 'Log in bij Profiel om je lijsten op te halen.',
      );
    }

    final listsAsync = ref.watch(shoppingListsProvider);
    final currency = NumberFormat.currency(locale: 'nl_NL', symbol: '€');

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: _refreshLists,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Boodschappenlijst',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text('Ingelogd als ${user.name}'),
            const SizedBox(height: 16),
            if (_error != null)
              Card(
                color: Theme.of(context).colorScheme.errorContainer,
                child: ListTile(
                  title: Text(
                    _error!,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onErrorContainer,
                    ),
                  ),
                ),
              ),
            if (_message != null)
              Card(
                color: Colors.green.shade50,
                child: ListTile(
                  title: Text(
                    _message!,
                    style: TextStyle(color: Colors.green.shade800),
                  ),
                ),
              ),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Nieuwe lijst',
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _newListController,
                      decoration: const InputDecoration(
                        labelText: 'Lijstnaam',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: _isCreatingList
                            ? null
                            : () => _createList(user.city),
                        child: Text(
                          _isCreatingList
                              ? 'Aanmaken...'
                              : 'Nieuwe lijst maken',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            listsAsync.when(
              data: (lists) {
                final activeList = _selectedListId == null
                    ? (lists.where((list) => list.isActive).isNotEmpty
                        ? lists.firstWhere((list) => list.isActive)
                        : (lists.isNotEmpty ? lists.first : null))
                    : lists
                            .where((list) => list.id == _selectedListId)
                            .isNotEmpty
                        ? lists.firstWhere((list) => list.id == _selectedListId)
                        : null;

                if (_selectedListId == null && activeList != null) {
                  WidgetsBinding.instance.addPostFrameCallback((_) {
                    if (!mounted) {
                      return;
                    }
                    setState(() {
                      _selectedListId = activeList.id;
                    });
                    _loadComparison();
                  });
                }

                if (lists.isEmpty) {
                  return const Card(
                    child: ListTile(
                      title: Text('Nog geen lijsten'),
                      subtitle: Text('Maak hierboven je eerste lijst aan.'),
                    ),
                  );
                }

                return Column(
                  children: [
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Kies lijst',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            DropdownButtonFormField<int>(
                              value: activeList?.id,
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                                labelText: 'Actieve lijst',
                              ),
                              items: lists
                                  .map(
                                    (list) => DropdownMenuItem<int>(
                                      value: list.id,
                                      child: Text(
                                        '${list.name} • ${list.itemsCount} items',
                                      ),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (value) async {
                                setState(() {
                                  _selectedListId = value;
                                  _optimization = null;
                                });
                                await _loadComparison();
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (activeList != null) ...[
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(activeList.name,
                                  style:
                                      Theme.of(context).textTheme.titleLarge),
                              const SizedBox(height: 4),
                              Text(
                                  '${activeList.city} • ${activeList.itemsCount} items'),
                              const SizedBox(height: 16),
                              TextField(
                                controller: _productSearchController,
                                onChanged: _searchProducts,
                                decoration: const InputDecoration(
                                  labelText: 'Zoek product om toe te voegen',
                                  border: OutlineInputBorder(),
                                ),
                              ),
                              if (_searchingProducts)
                                const Padding(
                                  padding: EdgeInsets.only(top: 8),
                                  child: LinearProgressIndicator(),
                                ),
                              if (_searchResults.isNotEmpty) ...[
                                const SizedBox(height: 12),
                                ..._searchResults.map(
                                  (result) => ListTile(
                                    contentPadding: EdgeInsets.zero,
                                    title: Text(result.name),
                                    subtitle:
                                        Text(result.brand ?? 'Onbekend merk'),
                                    trailing: _addingProductId == result.id
                                        ? const SizedBox(
                                            width: 18,
                                            height: 18,
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                            ),
                                          )
                                        : Text(
                                            result.lowestKnownPrice == null
                                                ? '-'
                                                : currency.format(
                                                    result.lowestKnownPrice),
                                          ),
                                    onTap: _addingProductId == null
                                        ? () => _addProduct(result.id)
                                        : null,
                                  ),
                                ),
                              ],
                              const SizedBox(height: 16),
                              ...activeList.items.map(
                                (item) {
                                  final receiptItem = _comparison
                                      ?.receipt?.items
                                      .where((receiptItem) =>
                                          receiptItem.productId ==
                                          item.productId)
                                      .cast<ShoppingListReceiptItem?>()
                                      .firstWhere(
                                        (receiptItem) => receiptItem != null,
                                        orElse: () => null,
                                      );

                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 12),
                                    child: ListTile(
                                      leading: Checkbox(
                                        value: item.isChecked,
                                        onChanged: (value) => _updateItem(
                                          item: item,
                                          isChecked: value ?? false,
                                        ),
                                      ),
                                      title:
                                          Text(item.product?.name ?? 'Product'),
                                      subtitle: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(item.product?.brand ??
                                              'Onbekend merk'),
                                          if (receiptItem != null)
                                            Text(
                                              receiptItem.available
                                                  ? '${currency.format(receiptItem.unitPrice)} bij ${_comparison?.receipt?.storeName}'
                                                  : 'Geen prijs beschikbaar in gekozen winkel',
                                            ),
                                        ],
                                      ),
                                      trailing: SizedBox(
                                        width: 132,
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.end,
                                          children: [
                                            IconButton(
                                              onPressed: item.quantity > 1
                                                  ? () => _updateItem(
                                                        item: item,
                                                        quantity:
                                                            item.quantity - 1,
                                                      )
                                                  : null,
                                              icon: const Icon(
                                                  Icons.remove_circle_outline),
                                            ),
                                            Text('${item.quantity}'),
                                            IconButton(
                                              onPressed: () => _updateItem(
                                                item: item,
                                                quantity: item.quantity + 1,
                                              ),
                                              icon: const Icon(
                                                  Icons.add_circle_outline),
                                            ),
                                            IconButton(
                                              onPressed: () =>
                                                  _removeItem(item.id),
                                              icon: const Icon(
                                                  Icons.delete_outline),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                              if (activeList.items.isEmpty)
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                  child: Text('Je lijst is nog leeg.'),
                                ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text('Prijsvergelijking',
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleMedium),
                                  ),
                                  FilledButton.tonal(
                                    onPressed: _isOptimizing
                                        ? null
                                        : _loadOptimization,
                                    child: Text(_isOptimizing
                                        ? 'Laden...'
                                        : 'Optimaliseer'),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              if (_isLoadingDetails)
                                const Center(child: CircularProgressIndicator())
                              else ...[
                                if (_comparison?.receipt != null) ...[
                                  Text(_comparison!.receipt!.storeName,
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleSmall),
                                  Text(_comparison!.receipt!.storeAddress),
                                  const SizedBox(height: 8),
                                  ..._comparison!.receipt!.items.take(5).map(
                                        (item) => Padding(
                                          padding:
                                              const EdgeInsets.only(bottom: 4),
                                          child: Row(
                                            children: [
                                              Expanded(child: Text(item.name)),
                                              Text(item.available
                                                  ? currency
                                                      .format(item.lineTotal)
                                                  : '-'),
                                            ],
                                          ),
                                        ),
                                      ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Totaal: ${currency.format(_comparison!.receipt!.subtotal)}',
                                    style:
                                        Theme.of(context).textTheme.titleSmall,
                                  ),
                                ],
                                const SizedBox(height: 12),
                                ...?_comparison?.comparison.take(5).map(
                                      (comparison) => ListTile(
                                        contentPadding: EdgeInsets.zero,
                                        title: Text(comparison.storeChain),
                                        subtitle: Text(
                                          '${comparison.storeAddress} • ${comparison.itemsAvailable}/${comparison.totalItems} producten',
                                        ),
                                        trailing: Text(
                                            currency.format(comparison.total)),
                                      ),
                                    ),
                                if (_optimization != null) ...[
                                  const Divider(height: 24),
                                  Text(
                                    'Potentiële besparing: ${currency.format(_optimization!.potentialSavings)}',
                                  ),
                                  Text(
                                      'Winkels nodig: ${_optimization!.storesNeeded}'),
                                  const SizedBox(height: 8),
                                  ..._optimization!.stores.map(
                                    (store) => ListTile(
                                      contentPadding: EdgeInsets.zero,
                                      title: Text(store.storeChain),
                                      subtitle: Text(
                                        '${store.storeAddress} • ${store.itemCount} items',
                                      ),
                                      trailing:
                                          Text(currency.format(store.total)),
                                    ),
                                  ),
                                ],
                              ],
                            ],
                          ),
                        ),
                      ),
                    ],
                  ],
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
