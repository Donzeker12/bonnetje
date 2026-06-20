import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import '../auth/presentation/auth_controller.dart';
import '../folder_actions/data/folder_actions_repository.dart';
import '../shopping_list/data/shopping_list_repository.dart';
import '../stores/data/stores_repository.dart';

class FolderActionsTab extends ConsumerStatefulWidget {
  const FolderActionsTab({super.key});

  @override
  ConsumerState<FolderActionsTab> createState() => _FolderActionsTabState();
}

class _FolderActionsTabState extends ConsumerState<FolderActionsTab> {
  final ImagePicker _picker = ImagePicker();
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _rawNameController = TextEditingController();
  final TextEditingController _promoPriceController = TextEditingController();
  final TextEditingController _normalPriceController = TextEditingController();
  final TextEditingController _unitLabelController = TextEditingController();

  XFile? _selectedImage;
  int? _selectedStoreId;
  DateTime? _validFrom;
  DateTime? _validUntil;
  int? _selectedActionId;
  int? _selectedProductId;
  bool _isUploading = false;
  bool _isAddingItem = false;
  bool _isLoadingAdmin = false;
  List<ShoppingListProductSearchResult> _searchResults = const [];
  List<FolderActionSummary> _adminActions = const [];
  String? _message;
  String? _error;

  @override
  void dispose() {
    _searchController.dispose();
    _rawNameController.dispose();
    _promoPriceController.dispose();
    _normalPriceController.dispose();
    _unitLabelController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    final image = await _picker.pickImage(source: source, imageQuality: 85);
    if (!mounted || image == null) {
      return;
    }
    setState(() {
      _selectedImage = image;
    });
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: DateTime(now.year - 1),
      lastDate: DateTime(now.year + 2),
    );

    if (!mounted || picked == null) {
      return;
    }

    setState(() {
      if (isFrom) {
        _validFrom = picked;
      } else {
        _validUntil = picked;
      }
    });
  }

  Future<void> _refreshMine() async {
    await ref.read(folderActionsProvider.future);
    ref.invalidate(folderActionsProvider);
  }

  Future<void> _loadAdminActions() async {
    setState(() {
      _isLoadingAdmin = true;
    });

    try {
      final actions =
          await ref.read(folderActionsRepositoryProvider).fetchAdminPending();
      if (!mounted) {
        return;
      }
      setState(() {
        _adminActions = actions;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Admin folderacties laden mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingAdmin = false;
        });
      }
    }
  }

  Future<void> _createAction() async {
    if (_selectedStoreId == null ||
        _validFrom == null ||
        _validUntil == null ||
        _selectedImage == null) {
      setState(() {
        _error = 'Kies supermarkt, datums en foto.';
      });
      return;
    }

    setState(() {
      _isUploading = true;
      _error = null;
      _message = null;
    });

    try {
      final formatter = DateFormat('yyyy-MM-dd');
      final action = await ref.read(folderActionsRepositoryProvider).create(
            storeId: _selectedStoreId!,
            validFrom: formatter.format(_validFrom!),
            validUntil: formatter.format(_validUntil!),
            imagePath: _selectedImage!.path,
          );
      await _refreshMine();
      if (!mounted) {
        return;
      }
      setState(() {
        _selectedActionId = action.id;
        _selectedImage = null;
        _message = 'Folderactie opgeslagen. Voeg nu producten toe.';
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Folderactie aanmaken mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isUploading = false;
        });
      }
    }
  }

  Future<void> _searchProducts(String query) async {
    if (query.trim().length < 2) {
      setState(() {
        _searchResults = const [];
      });
      return;
    }

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
        _error = 'Product zoeken mislukt.';
      });
    }
  }

  Future<void> _addItem() async {
    if (_selectedActionId == null ||
        _promoPriceController.text.trim().isEmpty) {
      setState(() {
        _error = 'Selecteer eerst een folderactie en actieprijs.';
      });
      return;
    }

    if (_selectedProductId == null && _rawNameController.text.trim().isEmpty) {
      setState(() {
        _error = 'Kies een product of vul een ruwe productnaam in.';
      });
      return;
    }

    setState(() {
      _isAddingItem = true;
      _error = null;
      _message = null;
    });

    try {
      await ref.read(folderActionsRepositoryProvider).addItem(
            folderActionId: _selectedActionId!,
            productId: _selectedProductId,
            productNameRaw: _selectedProductId == null
                ? _rawNameController.text.trim()
                : null,
            promoPrice: double.parse(_promoPriceController.text.trim()),
            normalPrice: _normalPriceController.text.trim().isEmpty
                ? null
                : double.parse(_normalPriceController.text.trim()),
            unitLabel: _unitLabelController.text.trim(),
          );
      await _refreshMine();
      if (!mounted) {
        return;
      }
      setState(() {
        _searchController.clear();
        _searchResults = const [];
        _rawNameController.clear();
        _promoPriceController.clear();
        _normalPriceController.clear();
        _unitLabelController.clear();
        _selectedProductId = null;
        _message = 'Actieproduct toegevoegd.';
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = 'Actieproduct toevoegen mislukt.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isAddingItem = false;
        });
      }
    }
  }

  Future<void> _reviewAction(int id, {required bool approve}) async {
    try {
      if (approve) {
        await ref.read(folderActionsRepositoryProvider).approve(id);
      } else {
        await ref.read(folderActionsRepositoryProvider).reject(id);
      }
      await _loadAdminActions();
      if (!mounted) {
        return;
      }
      setState(() {
        _message =
            approve ? 'Folderactie goedgekeurd.' : 'Folderactie afgekeurd.';
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _error = approve ? 'Goedkeuren mislukt.' : 'Afkeuren mislukt.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final user = auth.valueOrNull;

    if (user == null) {
      return const _AuthRequired(
        title: 'Folder Acties',
        subtitle: 'Log in bij Profiel om jouw folderacties te zien.',
      );
    }

    final actionsAsync = ref.watch(folderActionsProvider);
    final storesAsync = ref.watch(storesListProvider);

    if (user.isAdmin && _adminActions.isEmpty && !_isLoadingAdmin) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          _loadAdminActions();
        }
      });
    }

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          await _refreshMine();
          if (user.isAdmin) {
            await _loadAdminActions();
          }
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Folder Acties',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text('Ingelogd als ${user.name}'),
            const SizedBox(height: 16),
            if (_error != null)
              Card(
                color: Theme.of(context).colorScheme.errorContainer,
                child: ListTile(title: Text(_error!)),
              ),
            if (_message != null)
              Card(
                color: Colors.green.shade50,
                child: ListTile(title: Text(_message!)),
              ),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('1. Upload folderfoto en datums',
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    storesAsync.when(
                      data: (stores) => DropdownButtonFormField<int>(
                        value: _selectedStoreId,
                        decoration: const InputDecoration(
                          labelText: 'Supermarkt',
                          border: OutlineInputBorder(),
                        ),
                        items: stores
                            .map(
                              (store) => DropdownMenuItem<int>(
                                value: store.id,
                                child: Text('${store.chain} • ${store.city}'),
                              ),
                            )
                            .toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedStoreId = value;
                          });
                        },
                      ),
                      loading: () => const LinearProgressIndicator(),
                      error: (error, _) => Text(error.toString()),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => _pickDate(isFrom: true),
                            child: Text(_validFrom == null
                                ? 'Van datum'
                                : DateFormat('dd-MM-yyyy').format(_validFrom!)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => _pickDate(isFrom: false),
                            child: Text(_validUntil == null
                                ? 'Tot datum'
                                : DateFormat('dd-MM-yyyy')
                                    .format(_validUntil!)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        OutlinedButton.icon(
                          onPressed: _isUploading
                              ? null
                              : () => _pickImage(ImageSource.gallery),
                          icon: const Icon(Icons.photo_library_outlined),
                          label: const Text('Bestand kiezen'),
                        ),
                        OutlinedButton.icon(
                          onPressed: _isUploading
                              ? null
                              : () => _pickImage(ImageSource.camera),
                          icon: const Icon(Icons.photo_camera_outlined),
                          label: const Text('Foto maken'),
                        ),
                      ],
                    ),
                    if (_selectedImage != null) ...[
                      const SizedBox(height: 12),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.image_outlined),
                        title: Text(_selectedImage!.name),
                        subtitle: Text(_selectedImage!.path),
                      ),
                    ],
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: _isUploading ? null : _createAction,
                        child: Text(_isUploading
                            ? 'Uploaden...'
                            : 'Folderactie opslaan'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            actionsAsync.when(
              data: (actions) {
                final selectedAction = actions
                        .where((action) => action.id == _selectedActionId)
                        .isNotEmpty
                    ? actions
                        .firstWhere((action) => action.id == _selectedActionId)
                    : null;

                return Column(
                  children: [
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('2. Voeg actieproducten toe',
                                style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            if (actions.isEmpty)
                              const Text(
                                  'Nog geen folderacties. Upload eerst een actie hierboven.')
                            else ...[
                              DropdownButtonFormField<int>(
                                value: selectedAction?.id,
                                decoration: const InputDecoration(
                                  labelText: 'Jouw folderactie',
                                  border: OutlineInputBorder(),
                                ),
                                items: actions
                                    .map(
                                      (action) => DropdownMenuItem<int>(
                                        value: action.id,
                                        child: Text(
                                            '#${action.id} ${action.storeChain} [${action.status}]'),
                                      ),
                                    )
                                    .toList(),
                                onChanged: (value) {
                                  setState(() {
                                    _selectedActionId = value;
                                  });
                                },
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: _searchController,
                                onChanged: _searchProducts,
                                decoration: const InputDecoration(
                                  labelText: 'Zoek product in database',
                                  border: OutlineInputBorder(),
                                ),
                              ),
                              if (_searchResults.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                ..._searchResults.map(
                                  (result) => ListTile(
                                    contentPadding: EdgeInsets.zero,
                                    title: Text(result.name),
                                    subtitle:
                                        Text(result.brand ?? 'Onbekend merk'),
                                    onTap: () {
                                      setState(() {
                                        _selectedProductId = result.id;
                                        _searchController.text = result.name;
                                        _searchResults = const [];
                                        _rawNameController.clear();
                                      });
                                    },
                                  ),
                                ),
                              ],
                              const SizedBox(height: 12),
                              if (_selectedProductId == null)
                                TextField(
                                  controller: _rawNameController,
                                  decoration: const InputDecoration(
                                    labelText: 'Of ruwe productnaam uit folder',
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      controller: _promoPriceController,
                                      keyboardType:
                                          const TextInputType.numberWithOptions(
                                              decimal: true),
                                      decoration: const InputDecoration(
                                        labelText: 'Actieprijs',
                                        border: OutlineInputBorder(),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: TextField(
                                      controller: _normalPriceController,
                                      keyboardType:
                                          const TextInputType.numberWithOptions(
                                              decimal: true),
                                      decoration: const InputDecoration(
                                        labelText: 'Normale prijs',
                                        border: OutlineInputBorder(),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: _unitLabelController,
                                decoration: const InputDecoration(
                                  labelText: 'Eenheid (bijv. 500g, 1L)',
                                  border: OutlineInputBorder(),
                                ),
                              ),
                              const SizedBox(height: 12),
                              SizedBox(
                                width: double.infinity,
                                child: FilledButton(
                                  onPressed: _isAddingItem ? null : _addItem,
                                  child: Text(_isAddingItem
                                      ? 'Toevoegen...'
                                      : 'Actieproduct toevoegen'),
                                ),
                              ),
                              if (selectedAction != null &&
                                  selectedAction.items.isNotEmpty) ...[
                                const SizedBox(height: 12),
                                ...selectedAction.items.map(
                                  (item) => ListTile(
                                    contentPadding: EdgeInsets.zero,
                                    title: Text(item.productName),
                                    trailing: Text(
                                        '€${item.promoPrice.toStringAsFixed(2)}'),
                                  ),
                                ),
                              ],
                            ],
                          ],
                        ),
                      ),
                    ),
                    if (user.isAdmin) ...[
                      const SizedBox(height: 16),
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('3. Admin review',
                                  style:
                                      Theme.of(context).textTheme.titleMedium),
                              const SizedBox(height: 12),
                              if (_isLoadingAdmin)
                                const Center(child: CircularProgressIndicator())
                              else if (_adminActions.isEmpty)
                                const Text('Geen open folderacties.')
                              else
                                ..._adminActions.map(
                                  (action) => Card(
                                    margin: const EdgeInsets.only(bottom: 12),
                                    child: Padding(
                                      padding: const EdgeInsets.all(12),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                              '#${action.id} ${action.storeChain}'),
                                          Text(
                                              '${action.validFrom} t/m ${action.validUntil}'),
                                          Text('Items: ${action.items.length}'),
                                          const SizedBox(height: 8),
                                          Row(
                                            children: [
                                              Expanded(
                                                child: FilledButton.tonal(
                                                  onPressed: () =>
                                                      _reviewAction(action.id,
                                                          approve: true),
                                                  child:
                                                      const Text('Goedkeuren'),
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: FilledButton.tonal(
                                                  onPressed: () =>
                                                      _reviewAction(action.id,
                                                          approve: false),
                                                  child: const Text('Afkeuren'),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
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
