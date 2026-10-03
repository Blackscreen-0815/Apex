# Apex 2.2.4

Single-File-PWA für Hypertrophie-Training im Home-Gym. Alle Daten bleiben lokal auf dem Gerät (localStorage), Backup per JSON.

## Dateien

```
apex/
├── index.html          App (HTML, CSS, JS in einer Datei)
├── manifest.json       Web App Manifest
├── sw.js               Service Worker (offline)
├── .nojekyll           für GitHub Pages
└── icons/
    ├── icon-192.png    purpose "any"
    ├── icon-512.png
    ├── maskable-192.png  purpose "maskable" (Glyph in der Safe Zone)
    └── maskable-512.png
```

## Funktionen

- Trainingsplan Upper/Lower (4 Tage), 5-Wochen-Mesozyklus mit Ziel-RIR, Zusatzsätzen und Deload
- Satz-Tracking mit Ghost-Werten der letzten Einheit, „Satz abschließen“, Auto-Pause-Timer
- Rekorde, XP, Level, Serie, Tagesziele, Körpergewicht mit 7-Tage-Trend
- Tools: Scheiben-Rechner (eigenes kg- und lb-Set), Aufwärm-Rechner, 1RM-Rechner (Epley), Timer
- Übungsbibliothek mit Anatomie-Grafik und Anleitungen (26 Übungen)
- Themes: Standard (Deep Charcoal mit Neon-Orange, Neon-Cyan oder Silber), Rose Gold (dunkel oder hell), Babyblau
- Sprache Deutsch oder Englisch, Einheiten metrisch (kg, cm) oder US (lb, in); Gewichte werden intern immer in kg gespeichert
- Import/Export als JSON, übernimmt auch Backups und lokale Daten aus Hypertrophy Pro
- Rechtliches im Profil: Impressum und Datenschutzerklärung (Vorlagen), eigenständig abrufbar unter `?legal=imprint` und `?legal=privacy`
- Werbung: ein AdMob-Interstitial nach dem Schließen der Workout-Zusammenfassung, nur in der Android-App (Ordner `android-app`), nie während des Trainings. Web-Version werbefrei
- Level-System: 15 XP pro Workout, Bonus für Rekorde (max. +15 pro Workout) und Serien (+5 ab 3, +10 ab 10 Workouts in Folge). Level n ab 7,5 × n × (n − 1) XP
- Belohnungen pro Level: Farbdesigns (Volt, Ember, Gold), Profilsymbole, Avatar-Accessoires, goldener Profilrahmen, freche Sprüche beim Level-up
- Avatar (Tamagotchi-Prinzip): wird beim ersten Start erstellt, entwickelt sich in vier Stufen mit dem Level, Laune und Energie hängen vom Trainingsrhythmus ab
- Achievements und Freunde-Rangliste über Freundeskarten (Link, Code oder QR-Code), ohne Server
- Gesundheitsdaten: Serviceschicht für Health Connect (Samsung Health über Health Connect) vorbereitet, aktiv nur in der Android-App mit Plugin
- Kein CDN mehr: Tailwind ist vorkompiliert eingebettet, die Web-Version stellt keine Anfragen an Dritte

## Update einspielen (GitHub Pages)

1. Im Repository „Add file“ → „Upload files“, geänderte Dateien bzw. Ordner hineinziehen, committen. Gleiche Namen überschreiben.
2. In `sw.js` steht die `VERSION`. Sie ist bei jeder Lieferung bereits erhöht; wenn du selbst etwas änderst, erhöhe sie.
3. App auf dem Handy öffnen: Die neue Version lädt im Hintergrund („Neue Version geladen“), beim nächsten Öffnen ist sie aktiv.
4. Android-App mit Werbung: im Ordner `android-app` `npm run sync`, neue .aab mit höherem `versionCode` bauen und hochladen.

## Vor der Veröffentlichung ausfüllen

Ganz oben im Script von `index.html` (Abschnitt „0 · Konfiguration“):

- `LEGAL`: Name, Anschrift, E-Mail, Telefon, optional USt-IdNr. Leere Felder erscheinen in der App orange.
- `ADS_CONFIG`: AdMob-Anzeigenblock-ID, `testMode` erst nach Freigabe auf `false`.
- `APP_URL`: öffentliche Adresse der Web-App, wird in Freundes-Links und QR-Codes verwendet.

Datenschutz-URL für die Play Console: `https://<benutzername>.github.io/apex/?legal=privacy`

## Hosting

Die App braucht HTTPS (oder localhost), damit der Service Worker läuft.

**GitHub Pages:** Repository anlegen, Inhalt des Ordners `apex/` ins Root hochladen, unter Settings → Pages den Branch `main` wählen. Die App läuft dann unter `https://<user>.github.io/<repo>/`.

**Lokal testen:** `npx serve apex` oder `python3 -m http.server -d apex 8080`, dann `http://localhost:8080`.

Nach jeder Änderung an `index.html` die Konstante `VERSION` in `sw.js` erhöhen.

## Play Store mit PWABuilder

1. Gehostete URL auf https://www.pwabuilder.com eingeben und analysieren lassen.
2. „Package for stores“ → Android → Google Play.
3. Package ID wählen, z. B. `de.<deinname>.apex`. App-Name „Apex“, Launcher-Name „Apex“.
4. Signing key: „New“ (PWABuilder erzeugt Keystore) oder eigenen Keystore verwenden. Keystore und Passwörter sicher aufbewahren, ohne sie sind keine Updates möglich.
5. Download enthält die `.aab` (für den Play Store), eine `.apk` zum Testen und `assetlinks.json`.

### Digital Asset Links (sonst zeigt die App eine Browser-Leiste)

`assetlinks.json` muss erreichbar sein unter:

```
https://<deine-domain>/.well-known/assetlinks.json
```

Wichtig: Bei GitHub Pages unter `<user>.github.io/<repo>/` liegt `.well-known` nicht im Domain-Root. Lösung: ein eigenes Repo `<user>.github.io` mit dem Ordner `.well-known/` anlegen (die `.nojekyll`-Datei dort nicht vergessen) oder eine eigene Domain nutzen.

Mit Play App Signing signiert Google die App neu. Den SHA-256-Fingerabdruck aus der Play Console (Einrichten → App-Integrität → App-Signatur) zusätzlich in `assetlinks.json` eintragen:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "de.<deinname>.apex",
    "sha256_cert_fingerprints": [
      "<Fingerabdruck aus PWABuilder-Keystore>",
      "<Fingerabdruck aus Play App Signing>"
    ]
  }
}]
```

### Play Console

- Datensicherheit: Die Web-Version (PWABuilder) erhebt und überträgt keine Nutzerdaten. Für die Version mit Werbung gilt `android-app/README.md`.
- Datenschutzerklärung (URL): `https://<benutzername>.github.io/apex/?legal=privacy`
- Kategorie: Gesundheit & Fitness.

## CSS ändern

Das Tailwind-CSS ist vorkompiliert im `<style id="tw">` eingebettet. Neue Tailwind-Klassen wirken erst nach einem Neubau mit der Konfiguration aus `tailwind.config.js` (`npx tailwindcss -c tailwind.config.js -o tw.css --minify`, Inhalt dann in den Style-Block kopieren).
