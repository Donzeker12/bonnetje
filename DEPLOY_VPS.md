# VPS Deploy Setup

Deze repo heeft nu een GitHub Actions workflow die `main` naar een VPS kan deployen.

## Doel

Na elke push naar `main` moet de live site:

- de nieuwste Laravel/React code draaien
- de nieuwste homepage-downloadflow tonen
- de nieuwste Android APK/AAB serveren via:
  - `/bonnetje.apk`
  - `/bonnetje.aab`
  - `/downloads/bonnetje-latest.apk`
  - `/downloads/bonnetje-latest.aab`

## Benodigd op GitHub

Voeg deze repository secrets toe:

- `VPS_HOST` - hostnaam of IP van de VPS
- `VPS_PORT` - meestal `22`
- `VPS_USER` - SSH gebruiker
- `VPS_SSH_KEY` - private key voor die gebruiker
- `VPS_DEPLOY_PATH` - pad naar de repo op de server, bijvoorbeeld `/var/www/bonnetje`

## Benodigd op de VPS

De server moet dit al hebben:

- PHP/Composer
- Node.js/npm
- de repo uitgecheckt op `VPS_DEPLOY_PATH`
- `.env` aanwezig en correct ingesteld
- webserver document root naar de Laravel `public/` map

Optioneel maar aanbevolen:

- de Flutter release-builds al op de server aanwezig in:
  - `mobile/bonnetje_app/build/app/outputs/flutter-apk/app-release.apk`
  - `mobile/bonnetje_app/build/app/outputs/bundle/release/app-release.aab`

## Wat de workflow doet

De workflow in `.github/workflows/deploy.yml` doet op de VPS:

1. `git fetch origin main`
2. `git reset --hard origin/main`
3. `composer install --no-interaction --prefer-dist --optimize-autoloader`
4. `npm install`
5. `npm run build`
6. `npm run publish:android-release` als release APK en AAB al bestaan
7. `php artisan migrate --force`
8. Laravel caches verversen

## Belangrijke noot over Android builds

De workflow bouwt de Flutter app nu niet op de server. Hij publiceert alleen de Android releasebestanden als die al op de VPS aanwezig zijn.

Dat is bewust zo, omdat Flutter/Android toolchains op de VPS vaak ontbreken of veel onderhoud vragen.

Als je wilt dat GitHub Actions ook de APK/AAB bouwt en daarna naar de VPS uploadt, is de volgende stap een aparte mobile release-workflow.

## Handmatige verificatie na deploy

Controleer daarna live:

1. `https://bonnetje.shop/`
2. `https://bonnetje.shop/bonnetje.apk`
3. `https://bonnetje.shop/downloads/android-release.json`

Als de homepage nog een oude knop of oude asset toont, dan draait de VPS nog niet op de nieuwste deploy of wordt een andere directory geserveerd.