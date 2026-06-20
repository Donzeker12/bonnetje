# 🚀 Bonnetje - Setup & Implementatie Gids

## ✅ Wat is er al gebouwd?

### Backend (Laravel 11)

#### Database Structuur ✅
- **8 migrations** gemaakt voor alle benodigde tabellen
- Stores, Products, Prices, Shopping Lists
- Gamification systeem (Scans, Badges, User Points)
- Receipts voor OCR verwerking

#### Models ✅
- **9 Eloquent Models** met complete relaties
- Store, Product, Price, ShoppingList, ShoppingListItem
- Scan, UserPoints, Badge, Receipt
- User model uitgebreid met gamification

#### Controllers ✅
- **5 API Controllers** voor alle core features:
  - `ProductController` - Zoeken, scannen, prijzen vergelijken
  - `PriceController` - Prijzen scannen, verifiëren
  - `ShoppingListController` - Lijsten beheren, vergelijken, optimaliseren
  - `StoreController` - Winkels zoeken, nearby
  - `LeaderboardController` - Leaderboard, badges, profiel

#### API Routes ✅
- Complete REST API opgezet in `/routes/api.php`
- Public endpoints voor zoeken en vergelijken
- Protected endpoints voor scanning en gamification

### Frontend (React + TypeScript)

#### TypeScript Types ✅
- Volledige type definities voor alle models
- Type-safe API calls

#### API Client ✅
- Axios-gebaseerde API client in `lib/api.ts`
- Alle endpoints gedocumenteerd en typed

#### Pages ✅
- **Dashboard** - Overzicht met stats, leaderboard, nearby stores
- **ShoppingListPage** - Boodschappenlijst beheer + optimalisatie
- **LeaderboardPage** - Leaderboard, badges, user stats

## 🔧 Volgende Stappen

### 1. Database Setup
```bash
# Maak database aan
mysql -u root -e "CREATE DATABASE bonnetje CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
php artisan migrate

# Seed test data
php artisan db:seed
```

### 2. Missing Features

#### A. Barcode Scanner Component
Nog te bouwen:
```tsx
// resources/js/pages/ScanPage.tsx
// Gebruik: react-webcam of QuaggaJS voor barcode scanning
```

#### B. Product Search Component
```tsx
// resources/js/components/ProductSearch.tsx
// Autocomplete search met debouncing
```

#### C. Authentication Setup
Laravel Sanctum is al geïnstalleerd, maar nog te configureren:
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Routes toevoegen in `web.php`:
```php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
```

#### D. OCR voor Kassabonnen
Integratie met OCR service:
- Google Cloud Vision API
- Tesseract.js (client-side)
- Of Azure Computer Vision

#### E. PWA Configuratie
```bash
npm install vite-plugin-pwa
```

In `vite.config.ts`:
```ts
import { VitePWA } from 'vite-plugin-pwa'

// Add to plugins array
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Bonnetje',
    short_name: 'Bonnetje',
    description: 'Community-gestuurde boodschappen app',
    theme_color: '#4f46e5',
  }
})
```

### 3. Ontbrekende Routes (web.php)

```php
Route::inertia('/', 'Dashboard')->name('dashboard');
Route::inertia('/shopping-list', 'ShoppingListPage')->name('shopping-list');
Route::inertia('/leaderboard', 'LeaderboardPage')->name('leaderboard');
Route::inertia('/scan', 'ScanPage')->name('scan');
Route::inertia('/products', 'ProductsPage')->name('products');
Route::inertia('/profile', 'ProfilePage')->name('profile');
```

### 4. Environment Variables

Toevoegen aan `.env`:
```env
# App
APP_NAME=Bonnetje
APP_URL=http://localhost

# Database
DB_DATABASE=bonnetje
DB_USERNAME=root
DB_PASSWORD=

# Optioneel: OCR Service
GOOGLE_CLOUD_VISION_API_KEY=
```

### 5. Middleware & Policies

De `ShoppingListPolicy` is al gemaakt. Registreer in `AppServiceProvider` (optioneel, auto-discovery werkt):
```php
protected $policies = [
    ShoppingList::class => ShoppingListPolicy::class,
];
```

## 🎨 UI/UX Verbeteringen

### CSS Framework
Tailwind CSS is al geconfigureerd. Extra componenten:
```bash
npm install @headlessui/react @heroicons/react
```

### Icons
```bash
npm install lucide-react
```

### Animaties
```bash
npm install framer-motion
```

## 📱 Features om Uit te Breiden

### Prijs Voorspelling (ML)
1. Data verzamelen van prijshistorie
2. Python/TensorFlow model trainen
3. Laravel command voor dagelijkse voorspellingen
4. API endpoint: `/api/products/{id}/price-prediction`

### Huismerk Matching
Algoritme om vergelijkbare producten te vinden:
- Category matching
- Ingrediënten vergelijking
- Unit price normalisatie

### Social Features
- Vrienden toevoegen
- Private shopping lists delen
- Team challenges

### Notificaties
- Prijs alerts voor wishlist items
- Weekly savings report
- Badge unlock notifications

## 🧪 Testing

### Backend Tests
```bash
php artisan test
```

Nog te schrijven:
- `tests/Feature/ProductTest.php`
- `tests/Feature/PriceTest.php`
- `tests/Feature/ShoppingListTest.php`
- `tests/Feature/GamificationTest.php`

### Frontend Tests
```bash
npm run test
```

Setup Vitest:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

## 📊 Analytics & Monitoring

### Metrics om te Tracken
- Aantal actieve gebruikers
- Scans per dag
- Top gescande producten
- Gemiddelde besparing per lijst
- Engagement rate (daily/weekly active users)

### Tools
- Laravel Telescope (development)
- Sentry (error tracking)
- Google Analytics (user behavior)

## 🚀 Deployment

### Production Checklist
- [ ] `.env` configureren voor productie
- [ ] Database backups instellen
- [ ] SSL certificaat configureren
- [ ] CDN voor assets (Cloudflare)
- [ ] Cache optimalisatie (`php artisan optimize`)
- [ ] Queue worker voor OCR processing
- [ ] Cron jobs voor data cleanup

### Hosting Opties
- **VPS**: DigitalOcean, Linode (€10-20/maand)
- **PaaS**: Laravel Forge + DigitalOcean
- **Managed**: Ploi.io, Laravel Cloud

### Performance
```bash
# Cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build assets
npm run build
```

## 🎯 Launch Strategy

### Fase 1: Soft Launch (Week 1-2)
- 50-100 beta users in één stad (bijv. Amsterdam)
- Focus op data quality en bug fixes
- Dagelijkse check-ins met active users

### Fase 2: City Expansion (Week 3-4)
- Uitbreiding naar 3-5 steden
- Marketing via social media
- Influencer partnerships

### Fase 3: National Launch (Maand 2)
- PR push
- App Store & Play Store launch
- Partnership gesprekken met retailers

## 💡 Marketing Ideeën

1. **TikTok/Instagram**: "Hoeveel bespaar jij deze week?" challenges
2. **Reddit**: r/thenetherlands, r/dutch posts
3. **Partnerships**: Studentenverenigingen, gezinsblogs
4. **Guerrilla**: QR codes bij kassabonnen in supermarkten
5. **Content**: Blog posts over inflatie, bespaar tips

## 🆘 Troubleshooting

### Database Errors
```bash
php artisan migrate:fresh --seed
```

### API Niet Bereikbaar
Check `/bootstrap/app.php` - API routes moeten geladen zijn

### CORS Issues
Install `laravel-cors`:
```bash
composer require fruitcake/laravel-cors
```

### Sanctum Auth Issues
```bash
php artisan config:clear
php artisan cache:clear
```

## 📞 Support & Community

- Discord server voor beta testers
- GitHub Issues voor bugs
- Weekly community calls

---

**Veel succes met de lancering! 🚀**
