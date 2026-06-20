import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import '../auth/presentation/auth_controller.dart';
import '../receipts/data/receipts_repository.dart';
import '../stores/data/stores_repository.dart';

class ScanTab extends ConsumerStatefulWidget {
  const ScanTab({super.key});

  @override
  ConsumerState<ScanTab> createState() => _ScanTabState();
}

class _ScanTabState extends ConsumerState<ScanTab> {
  final ImagePicker _imagePicker = ImagePicker();
  final TextEditingController _ocrController = TextEditingController();

  XFile? _selectedImage;
  int? _selectedStoreId;
  bool _isUploading = false;
  int? _processingReceiptId;
  ReceiptSummary? _selectedReceipt;

  @override
  void dispose() {
    _ocrController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    final image = await _imagePicker.pickImage(
      source: source,
      imageQuality: 85,
    );

    if (!mounted || image == null) {
      return;
    }

    setState(() {
      _selectedImage = image;
    });
  }

  Future<void> _uploadReceipt() async {
    final image = _selectedImage;
    final storeId = _selectedStoreId;

    if (image == null || storeId == null) {
      return;
    }

    setState(() {
      _isUploading = true;
    });

    try {
      await ref.read(receiptsRepositoryProvider).uploadReceipt(
            storeId: storeId,
            imagePath: image.path,
            ocrRawText: _ocrController.text,
            autoProcess: true,
          );

      ref.invalidate(receiptsProvider);

      if (!mounted) {
        return;
      }

      setState(() {
        _selectedImage = null;
        _ocrController.clear();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Bon geupload en verwerkt.')),
      );
    } on DioException catch (error) {
      if (!mounted) {
        return;
      }

      final data = error.response?.data;
      final message = data is Map<String, dynamic>
          ? data['message'] as String? ?? 'Upload mislukt.'
          : 'Upload mislukt.';

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    } catch (_) {
      if (!mounted) {
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Upload mislukt.')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isUploading = false;
        });
      }
    }
  }

  Future<void> _processReceipt(int receiptId) async {
    setState(() {
      _processingReceiptId = receiptId;
    });

    try {
      await ref.read(receiptsRepositoryProvider).processReceipt(receiptId);
      ref.invalidate(receiptsProvider);

      if (!mounted) {
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Bon verwerkt.')),
      );
    } on DioException catch (error) {
      if (!mounted) {
        return;
      }

      final data = error.response?.data;
      final message = data is Map<String, dynamic>
          ? data['message'] as String? ?? 'Verwerken mislukt.'
          : 'Verwerken mislukt.';

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    } catch (_) {
      if (!mounted) {
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Verwerken mislukt.')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _processingReceiptId = null;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final user = auth.valueOrNull;

    if (user == null) {
      return const _AuthRequired(
        title: 'Bonnen',
        subtitle: 'Log in bij Profiel om bonnen te uploaden en te verwerken.',
      );
    }

    final storesAsync = ref.watch(storesListProvider);
    final receiptsAsync = ref.watch(receiptsProvider);

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(storesListProvider);
          ref.invalidate(receiptsProvider);
          await Future.wait([
            ref.read(storesListProvider.future),
            ref.read(receiptsProvider.future),
          ]);
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Bonnen', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text('Ingelogd als ${user.name}'),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Nieuwe bon uploaden',
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    storesAsync.when(
                      data: (stores) {
                        if (stores.isEmpty) {
                          return const Text(
                            'Geen winkels beschikbaar. Voeg eerst winkels toe in de backend.',
                          );
                        }

                        return DropdownButtonFormField<int>(
                          value: _selectedStoreId,
                          decoration: const InputDecoration(
                            labelText: 'Winkel',
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
                        );
                      },
                      loading: () => const Padding(
                        padding: EdgeInsets.symmetric(vertical: 8),
                        child: LinearProgressIndicator(),
                      ),
                      error: (error, _) => Text(error.toString()),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _ocrController,
                      minLines: 3,
                      maxLines: 5,
                      decoration: const InputDecoration(
                        labelText: 'OCR tekst (optioneel)',
                        hintText: 'Plak bontekst voor directe parsing',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        OutlinedButton.icon(
                          onPressed: _isUploading
                              ? null
                              : () => _pickImage(ImageSource.camera),
                          icon: const Icon(Icons.photo_camera_outlined),
                          label: const Text('Camera'),
                        ),
                        OutlinedButton.icon(
                          onPressed: _isUploading
                              ? null
                              : () => _pickImage(ImageSource.gallery),
                          icon: const Icon(Icons.photo_library_outlined),
                          label: const Text('Galerij'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    if (_selectedImage != null)
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.receipt_long_outlined),
                        title: Text(_selectedImage!.name),
                        subtitle: Text(_selectedImage!.path),
                        trailing: IconButton(
                          onPressed: _isUploading
                              ? null
                              : () => setState(() => _selectedImage = null),
                          icon: const Icon(Icons.close),
                        ),
                      ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton.icon(
                        onPressed: _isUploading ||
                                _selectedImage == null ||
                                _selectedStoreId == null
                            ? null
                            : _uploadReceipt,
                        icon: _isUploading
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.cloud_upload_outlined),
                        label:
                            Text(_isUploading ? 'Uploaden...' : 'Bon uploaden'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text('Mijn bonnen', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            receiptsAsync.when(
              data: (receipts) {
                if (receipts.isEmpty) {
                  return const Card(
                    child: ListTile(
                      title: Text('Nog geen bonnen'),
                      subtitle: Text('Upload je eerste kassabon hierboven.'),
                    ),
                  );
                }

                return Column(
                  children: receipts
                      .map(
                        (receipt) => _ReceiptCard(
                          receipt: receipt,
                          isProcessing: _processingReceiptId == receipt.id,
                          onTapDetails: () {
                            setState(() {
                              _selectedReceipt = receipt;
                            });
                          },
                          onProcess: receipt.canProcess
                              ? () => _processReceipt(receipt.id)
                              : null,
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
                  title: const Text('Bonnen laden mislukt'),
                  subtitle: Text(error.toString()),
                ),
              ),
            ),
            if (_selectedReceipt != null) ...[
              const SizedBox(height: 16),
              _ReceiptDetailsCard(
                receipt: _selectedReceipt!,
                onClose: () {
                  setState(() {
                    _selectedReceipt = null;
                  });
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ReceiptCard extends StatelessWidget {
  const _ReceiptCard({
    required this.receipt,
    required this.isProcessing,
    required this.onTapDetails,
    required this.onProcess,
  });

  final ReceiptSummary receipt;
  final bool isProcessing;
  final VoidCallback onTapDetails;
  final VoidCallback? onProcess;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final formatter = NumberFormat.currency(locale: 'nl_NL', symbol: '€');

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    receipt.store == null
                        ? 'Onbekende winkel'
                        : '${receipt.store!.chain} • ${receipt.store!.city}',
                    style: theme.textTheme.titleMedium,
                  ),
                ),
                Chip(label: Text(receipt.status)),
              ],
            ),
            const SizedBox(height: 4),
            Text(receipt.store?.address ?? receipt.imagePath),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                Text('Items: ${receipt.itemsCount}'),
                Text(
                  'Totaal: ${receipt.totalAmount == null ? '-' : formatter.format(receipt.totalAmount)}',
                ),
                Text('Datum: ${receipt.purchaseDate ?? '-'}'),
              ],
            ),
            if (receipt.parsedItems.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text('Gevonden regels', style: theme.textTheme.labelLarge),
              const SizedBox(height: 6),
              ...receipt.parsedItems.take(5).map(
                    (item) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Text(
                        '${item.name} • ${formatter.format(item.price)}',
                      ),
                    ),
                  ),
            ],
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  OutlinedButton(
                    onPressed: onTapDetails,
                    child: const Text('Details'),
                  ),
                  FilledButton.tonalIcon(
                    onPressed: isProcessing ? null : onProcess,
                    icon: isProcessing
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.auto_fix_high_outlined),
                    label: Text(isProcessing ? 'Verwerken...' : 'Verwerk bon'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ReceiptDetailsCard extends StatelessWidget {
  const _ReceiptDetailsCard({
    required this.receipt,
    required this.onClose,
  });

  final ReceiptSummary receipt;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final formatter = NumberFormat.currency(locale: 'nl_NL', symbol: '€');

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Bon details',
                    style: theme.textTheme.titleLarge,
                  ),
                ),
                IconButton(
                  onPressed: onClose,
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
            Text(
              receipt.store == null
                  ? 'Onbekende winkel'
                  : '${receipt.store!.chain} • ${receipt.store!.address}',
            ),
            const SizedBox(height: 12),
            if (receipt.parsedItems.isEmpty)
              const Text('Geen parsed bonregels beschikbaar.')
            else
              ...receipt.parsedItems.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                item.name,
                                style: theme.textTheme.titleSmall,
                              ),
                            ),
                            Text(formatter.format(item.price)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          item.matchedProductName == null
                              ? 'Nog geen productmatch gevonden'
                              : 'Gekoppeld aan ${item.matchedProductName}',
                          style: theme.textTheme.bodySmall,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.priceCreated
                              ? 'Prijsrecord aangemaakt'
                              : 'Geen nieuw prijsrecord aangemaakt',
                          style: theme.textTheme.bodySmall,
                        ),
                      ],
                    ),
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
