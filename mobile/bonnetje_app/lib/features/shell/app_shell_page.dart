import 'package:flutter/material.dart';

import '../tabs/folder_actions_tab.dart';
import '../tabs/home_tab.dart';
import '../tabs/profile_tab.dart';
import '../tabs/scan_tab.dart';
import '../tabs/shopping_list_tab.dart';

class AppShellPage extends StatefulWidget {
  const AppShellPage({super.key});

  @override
  State<AppShellPage> createState() => _AppShellPageState();
}

class _AppShellPageState extends State<AppShellPage> {
  int _index = 0;

  static const _tabs = [
    HomeTab(),
    ScanTab(),
    ShoppingListTab(),
    FolderActionsTab(),
    ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _tabs[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
          NavigationDestination(
              icon: Icon(Icons.qr_code_scanner), label: 'Scan'),
          NavigationDestination(
              icon: Icon(Icons.shopping_cart_outlined), label: 'Lijst'),
          NavigationDestination(
              icon: Icon(Icons.local_offer_outlined), label: 'Folder'),
          NavigationDestination(
              icon: Icon(Icons.person_outline), label: 'Profiel'),
        ],
      ),
    );
  }
}
