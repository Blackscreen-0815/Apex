# Apex 2.0.0

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

- Datenschutz / Datensicherheit: Die App erhebt und überträgt keine Nutzerdaten. Einzige externe Anfrage ist das Tailwind-CSS-Script von `cdn.tailwindcss.com` (danach aus dem Cache).
- Eine Datenschutzerklärung (URL) wird trotzdem verlangt.
- Kategorie: Gesundheit & Fitness.

## Optional: komplett ohne CDN

Für maximale Robustheit Tailwind lokal bauen (`npx tailwindcss -o tailwind.css --minify` mit der Konfiguration aus `index.html`), das `<script src="https://cdn.tailwindcss.com">` durch `<link rel="stylesheet" href="tailwind.css">` ersetzen und `tailwind.css` in `SHELL_FILES` von `sw.js` aufnehmen.
