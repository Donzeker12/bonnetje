import 'package:bonnetje_app/app.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Bootstraps app shell', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: BonnetjeApp(),
      ),
    );
    await tester.pump(const Duration(milliseconds: 1000));
    await tester.pumpAndSettle();

    expect(find.text('Dashboard'), findsOneWidget);
  });
}
