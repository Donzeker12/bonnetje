import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/shell/app_shell_page.dart';
import '../../features/splash/splash_page.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashPage(),
    ),
    GoRoute(
      path: '/',
      builder: (context, state) => const AppShellPage(),
    ),
  ],
  errorBuilder: (context, state) {
    return Scaffold(
      body: Center(
        child: Text('Route error: ${state.error}'),
      ),
    );
  },
);
