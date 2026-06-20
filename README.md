# 🛒 Bonnetje - Community-Gestuurde Boodschappen App

**De eerste community-gestuurde boodschappen-app van Nederland die de échte, lokale prijzen in de supermarkt onthult.**

## 🎯 Het Concept

Bonnetje geeft de macht terug aan de consument door de kracht van de massa te gebruiken om de goedkoopste boodschappenmand per stad (en per filiaal) te vinden. Geen misleidende folders meer - alleen échte prijzen van échte mensen.

## ✨ Features

### 1. **Lokale Prijs-Vergelijker** 
Inzicht in de prijzen van jouw specifieke supermarkt om de hoek, niet alleen de landelijke adviesprijs.

### 2. **Smart Boodschappenlijst**
- Voer je lijstje in en zie direct de totaalprijs bij verschillende winkels
- Ontdek welke producten je beter bij een andere winkel kunt halen
- Krijg een optimalisatie-suggestie voor maximale besparing

### 3. **Community Scanner (Gamification)**
- **Barcode-scanner**: Check en update prijzen in de winkel
- **Kassabon-OCR**: Upload bonnen om automatisch de database te vullen
- **Beloningssysteem**: Verdien punten, badges en een plek op het lokale leaderboard

### 4. **Prijs-Historie & Voorspelling**
Zie of een huidige prijs écht een goede deal is of dat deze volgende week waarschijnlijk lager wordt.

### 5. **Huismerk-Matches**
De app herkent welk huismerk-product vergelijkbaar is tussen verschillende supermarkten.

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (API-driven, veilig en schaalbaar)
- **Frontend**: React + Vite + TypeScript
- **Framework**: Inertia.js (seamless SPAs)
- **Database**: MySQL (met locatie-ondersteuning voor PostGIS mogelijk)
- **Platform**: PWA (Progressive Web App) - werkt op elke smartphone

## 📦 Database Structuur

### Core Tables
- `stores` - Supermarkt filialen met GPS-coördinaten
- `products` - Producten met barcode, merk, categorie
- `prices` - Prijzen per product per winkel (met verificatie)
- `shopping_lists` - Boodschappenlijstjes van gebruikers
- `shopping_list_items` - Items op de lijstjes

### Gamification Tables
- `scans` - Gebruiker scans (voor punten)
- `user_points` - Puntensysteem per gebruiker
- `badges` - Badges die verdiend kunnen worden
- `user_badges` - Koppeltabel tussen users en badges
- `receipts` - Kassabon uploads voor OCR verwerking

## 🚀 Installatie & Setup

### Vereisten
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Stappen

1. **Clone het project**
```bash
cd c:\xampp\htdocs\Bonnetje
```

2. **Install dependencies**
```bash
composer install
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database configuratie**
Update `.env` met je database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bonnetje
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run migrations**
```bash
php artisan migrate
```

6. **Seed initial data** (optioneel)
```bash
php artisan db:seed
```

7. **Build frontend**
```bash
npm run dev
```

8. **Start de server**
```bash
php artisan serve
```

Bezoek: `http://localhost:8000`

## 🎮 API Endpoints

### Public Routes
```
GET  /api/products/search              - Zoek producten
GET  /api/products/barcode/{barcode}   - Vind product via barcode
GET  /api/stores                       - Alle winkels
GET  /api/stores/nearby                - Winkels in de buurt
GET  /api/leaderboard                  - Leaderboard
```

### Protected Routes (require auth)
```
POST /api/prices                       - Nieuwe prijs scannen
POST /api/prices/{id}/verify           - Prijs verifiëren
GET  /api/shopping-lists               - Mijn lijsten
POST /api/shopping-lists               - Nieuwe lijst maken
GET  /api/shopping-lists/{id}/compare  - Prijzen vergelijken
GET  /api/shopping-lists/{id}/optimize - Optimaliseer besparing
GET  /api/profile                      - Mijn profiel & stats
GET  /api/profile/badges               - Mijn badges
```

## 📱 Features Overzicht

### Voor Gebruikers
1. **Scan & Verdien**: Scan barcodes in de winkel en verdien punten
2. **Vergelijk Prijzen**: Zie direct welke winkel het goedkoopst is
3. **Optimaliseer**: Krijg een persoonlijk besparingsadvies
4. **Compete**: Klim op het lokale leaderboard
5. **Collect**: Verzamel badges en unlock achievements

### Voor de Community
- Crowdsourced prijsdata = altijd actueel
- Lokale focus = relevante informatie voor jouw stad
- Gamification = motivatie om actief bij te dragen
- Transparantie = eerlijke prijsvergelijking

## 🎯 Roadmap

### Fase 1: De Stadstest (MVP)
- [x] Database & backend opzetten
- [x] Core features implementeren
- [x] Gamification systeem
- [ ] Eerste groep gebruikers in één stad
- [ ] Data validatie algoritme

### Fase 2: Validatie
- [ ] OCR voor kassabonnen
- [ ] Mobiele app optimalisatie
- [ ] Prijs-voorspelling ML model
- [ ] Huismerk matching systeem

### Fase 3: Landelijke Uitrol
- [ ] Schalen naar alle Nederlandse steden
- [ ] Partnership met supermarkten
- [ ] Premium features
- [ ] Mobile apps (iOS/Android)

## 🤝 Bijdragen

Dit is een community-project! Bijdragen zijn welkom:

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is open-source en beschikbaar onder de MIT License.

## 🏆 Gamification Details

### Punten Verdienen
- Nieuwe prijs scannen: **10 punten**
- Prijs verifiëren: **3 punten**
- Kassabon uploaden: **5-20 punten** (afhankelijk van aantal items)
- Dagelijkse login: **1 punt**

### Levels
- Elke 100 punten = 1 level omhoog
- Speciale perks per level (bijv. early access features)

### Badges
- **Scanner Starter**: 10 scans
- **Prijs Politie**: 50 scans
- **Deal Hunter**: 100 scans
- **Bespaar Koning**: 1000 punten
- **Stads Champion**: #1 in je stad
- En meer...

## 🌟 Waarom Bonnetje?

- ✅ **Transparant**: Échte prijzen van échte mensen
- ✅ **Lokaal**: Focus op jouw buurt, jouw stad
- ✅ **Leuk**: Gamification maakt besparen een sport
- ✅ **Gratis**: Geen verborgen kosten of premium accounts (voorlopig)
- ✅ **Community**: Van en voor de mensen

## 📞 Contact & Support

- Website: [bonnetje.nl](https://bonnetje.nl) (coming soon)
- Email: support@bonnetje.nl
- Twitter: [@BonnetjeApp](https://twitter.com/BonnetjeApp)

---

**Gemaakt met ❤️ voor de Nederlandse consument**

*"Stop met gissen, start met weten!"* 🎯
