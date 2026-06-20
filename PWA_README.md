# Bonnetje PWA Features

Bonnetje is nu een volledige **Progressive Web App (PWA)** met de volgende features:

## ✅ Geïmplementeerde PWA Features

### 🎯 Installeerbaar
- **Home Screen Installatie**: Gebruikers kunnen de app toevoegen aan hun home screen op iOS, Android en desktop
- **Standalone Mode**: App draait in fullscreen zonder browser UI
- **Custom Install Prompt**: Mooie install banner na 10 seconden gebruik

### 📱 App-achtige Ervaring
- **Splash Screen**: Custom loading screen met Bonnetje branding
- **App Iconen**: Gradient iconen in 5 verschillende formaten (72px - 512px)
- **Theme Color**: Indigo (#4f46e5) branding in status bar

### 🔄 Service Worker
- **Offline Support**: App werkt offline met cached content
- **Network First**: Altijd verse data wanneer mogelijk
- **Cache Fallback**: Offline fallback voor navigatie
- **Custom Offline Page**: Mooie offline pagina met tips

### 🚀 Performance
- **Asset Caching**: CSS, JS en images worden gecached
- **Runtime Caching**: Pagina's worden automatisch gecached tijdens gebruik
- **Background Sync**: Klaar voor background data synchronisatie (TODO)

### 📲 Shortcuts
Drie app shortcuts naar belangrijkste features:
1. **Scan Product** - Direct naar barcode scanner
2. **Boodschappenlijst** - Direct naar je lijst
3. **Zoek Producten** - Direct naar product zoeken

### 🔔 Update Notificaties
- **Auto-update Check**: Controleert elk uur op nieuwe versies
- **Update Banner**: Toont melding bij beschikbare update
- **One-click Update**: Simpele update actie

## 📝 Manifest Details

```json
{
  "name": "Bonnetje - Community Prijsvergelijker",
  "short_name": "Bonnetje",
  "display": "standalone",
  "theme_color": "#4f46e5",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "categories": ["shopping", "lifestyle", "utilities"]
}
```

## 🎨 Iconen

Alle iconen zijn SVG-based met gradient (indigo → purple):
- 72x72 (Shortcuts, small screens)
- 144x144 (Mid-size devices)
- 192x192 (Android home screen)
- 384x384 (Splash screen)
- 512x512 (High-res displays)

## 🔧 Service Worker Strategie

### API Requests (`/api/*`)
- **Strategie**: Network only
- **Fallback**: JSON error message bij offline

### Navigatie
- **Strategie**: Network first
- **Fallback 1**: Cached pagina
- **Fallback 2**: Offline.html

### Assets (CSS/JS/Images)
- **Strategie**: Cache first
- **Fallback**: Network fetch
- **Background Update**: Update cache in background

## 📊 PWA Score Checklist

- ✅ Web App Manifest
- ✅ Service Worker geregistreerd
- ✅ Werkt offline
- ✅ HTTPS (via Herd)
- ✅ Responsive design
- ✅ Fast load times (Vite HMR)
- ✅ App-like interactions
- ✅ Cross-browser compatible

## 🎯 Toekomstige PWA Features

### 📡 Background Sync
- Sync prijzen in background
- Queue offline scans
- Auto-upload wanneer online

### 🔔 Push Notifications
- Prijs alerts voor watchlist items
- Nieuwe deals in je buurt
- Weekly savings report

### 📍 Geolocation
- Automatische winkel detectie
- Location-based prijzen
- Nearby store notifications

### 📷 Advanced Features
- Share Target API (deel producten naar Bonnetje)
- Contact Picker (vrienden uitnodigen)
- File System Access (export lijsten)

## 🧪 Testen

### Desktop Install
1. Open Chrome/Edge
2. Klik op install icon in address bar
3. Of: Menu → Install Bonnetje

### Mobile Install (Android)
1. Open in Chrome
2. Menu → Add to Home Screen
3. Of: Wacht op install banner

### Mobile Install (iOS)
1. Open in Safari
2. Share → Add to Home Screen

### Offline Test
1. Open Developer Tools
2. Application → Service Workers
3. Enable "Offline" checkbox
4. Navigeer door app

## 📁 PWA Bestanden

```
public/
├── manifest.json          # Web App Manifest
├── sw.js                  # Service Worker
├── offline.html           # Offline fallback pagina
└── icons/                 # App icons
    ├── icon-72x72.svg
    ├── icon-144x144.svg
    ├── icon-192x192.svg
    ├── icon-384x384.svg
    └── icon-512x512.png

resources/js/components/
├── PWAInstallPrompt.tsx   # Install banner
└── UpdateNotification.tsx # Update banner
```

## 🎨 Branding

- **Primary**: Indigo (#4f46e5)
- **Secondary**: Purple (#7c3aed)
- **Gradient**: Linear van indigo naar purple
- **Icon**: 🛒 Shopping cart emoji

---

**Status**: ✅ Production Ready PWA
**Lighthouse PWA Score**: Potentieel 100/100
