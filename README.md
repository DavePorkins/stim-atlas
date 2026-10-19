# Stim Atlas

Eine statische Bildwand zum Entdecken von Stim-Objekten, Materialien und Aktivitäten. Dunkel als Standard, optional hell, ohne Quiz oder Anmeldung.

Aktueller Stand: **390 Einträge, 72 zusätzliche Herstellerbeispiele für Farben und Oberflächen, 461 Galeriekacheln mit eingeschalteten Varianten**. Davon haben 238 Einträge externe Bildreferenzen; 152 verwenden eigene Illustrationen. Jeder Eintrag besitzt außerdem eine lokale Illustration als Ausfallalternative.

## Nutzen

`index.html` öffnen oder den gesamten Ordner statisch hosten. Keine Installation, API-Schlüssel, Frameworks oder Serverlogik nötig. Code, Katalog und Illustrationen liegen lokal. Fotos werden von ihren ursprünglichen Anbietern geladen und benötigen eine Internetverbindung.

- Alle / Objekte / Aktivitäten; Suche auch nach Material und benannten Farbvarianten.
- Wahrnehmung und Material als unabhängig auswählbare Checkbox-Chips: ODER innerhalb einer Zeile, UND zwischen den Dimensionen.
- Farbvarianten sind standardmäßig eingeschaltet und lassen sich unter Filter ausblenden. Favoriten gelten für das ganze Objekt einschließlich seiner Varianten.
- Echte Produktreferenzen zeigen Titel und Herz bei Hover oder Tastaturfokus. Auf Touch und kleinen Bildschirmen bleibt das Herz erreichbar, mit 44 × 44 CSS-Pixeln Interaktionsfläche.
- Illustrationen, Symbolfotos und Herstellerdarstellungen zeigen ihren Namen immer. Die Bildart ist gesondert gekennzeichnet. Ein Symbolfoto bildet ein Material oder eine Aktivität ab und ist kein genaues Verkaufsangebot.
- Details enthalten Quellen, Bildersuche und eine YouTube-Suche. Mehrere Fotos lassen sich durchblättern und nebeneinander vergleichen.
- Automatisches Nachladen mit IntersectionObserver; 36 Kacheln je Abschnitt. Der Katalog ist endlich, ohne einen „Mehr laden“-Knopf.
- Suche mit `/` oder Ctrl/Cmd+K; Dialoge mit Escape schließen. Fokus kehrt zur Kachel zurück. Reduzierte Bewegung wird berücksichtigt.

## Favoriten

Lokal im Browser gespeichert. Die alten Schlüssel `stim-studio-v10-progress`, `stim-studio-v9-progress` und `stim-studio-v6-progress` bleiben zur Kompatibilität erhalten. Alle ursprünglichen v9-IDs sind unverändert. Explizite aktuelle Änderungen haben Vorrang vor automatisch übernommenen alten Daten.

Beim Wechsel von lokaler Vorschau zu einer öffentlichen Webadresse zuerst ein persönliches Backup exportieren, dann dort über das Archivsymbol importieren. Ein ergänzender Import entfernt keine bestehenden Favoriten. Persönliche Backups sind nicht Bestandteil dieses Repositorys.

## GitHub Pages

Die Dateien liegen bereits in der passenden Struktur: `index.html`, `assets/` und `.nojekyll` im Stamm. Veröffentlichen aus Branch `main`, Ordner `/(root)`. Relative interne Pfade unterstützen auch Projektadressen wie `https://name.github.io/stim-atlas/`. [GitHub-Anleitung](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Redaktion und Build

Die Website benötigt zur Nutzung keinen Build. Änderungen reproduzierbar in den Quellen vornehmen:

```text
python tools/prepare_data.py
node tools/test_core.cjs
python tools/build.py --preview STIM_ATLAS_v11_Vorschau.html
```

`source_data/v9-catalog.json` und das alte Recherchepaket bleiben erhalten. Neuere Ergänzungen stehen in `extra-objects.json`, `visual-examples.json` und `research-v11.json`. `image-audit.json` dokumentiert technische Bildprüfungen. Direkte Änderungen an `data/catalog.json` würden beim nächsten Build überschrieben.

Die 21 neuen Einträge umfassen zehn Kleidungsstücke/Wearables, acht Duftprodukte und drei Aktivitäten mit Kräutern, Zitronenschalen oder Blüten. Die ursprünglichen Ideen bleiben eigenständig recherchierte Konzepte. Materialzusammensetzungen werden nicht aus Fotos geraten; unklare Angaben bleiben ungeklärt. Katalogeinträge enthalten keine klinischen Wirkungsversprechen.

## Bilder und Lizenz

Eigener Anwendungscode, Build-Werkzeuge und die neuen SVG-Illustrationen stehen unter MIT, siehe `LICENSE`. Bestehende Eingangsdateien, fremde Produkttexte, Markennamen und externe Fotos sind davon ausgenommen; deren jeweilige Rechte bleiben bestehen. Sie werden nicht pauschal unter MIT gestellt.

Herstellerfotos bleiben externe Verweise. Technische Erreichbarkeit und Dekodierung beweisen weder Motividentität noch Nutzungsrechte oder dauerhafte Verfügbarkeit. Ein Stimm-Herstellerbild ist vorsorglich als Herstellerdarstellung markiert, weil der Anbieter KI-erzeugte oder bearbeitete Bilder nicht einzeln zuordnet. Das Lush-Bild ist nur 256 × 256 Pixel groß. Das Origami-Symbolfoto stammt von Laitche / Wikimedia Commons (Public domain); genaue Attributionen und Bildquellen stehen am jeweiligen Eintrag.

Recherche und Prüfung: 19.10.2026. Siehe `RECHERCHE.md` und `TESTBERICHT.md`.
