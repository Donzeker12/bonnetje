class AppConfig {
  static const appName = 'Bonnetje';

  // Override with: flutter run --dart-define=API_BASE_URL=http://<host>/api
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://bonnetje.shop/api',
  );
}
