# Stim Atlas v11.2

Eine statische Bildwand zum Entdecken von Stim-Objekten, Materialien und Aktivitäten. Dunkel als Standard, optional hell, ohne Quiz oder Anmeldung.

Aktueller Stand: **432 Einträge, 72 zusätzliche Herstellerbeispiele für Farben und Oberflächen, 503 Galeriekacheln mit eingeschalteten Varianten**. Davon haben 324 Einträge externe Bildreferenzen; 108 verwenden eigene Illustrationen. Jeder Eintrag besitzt außerdem eine lokale Illustration als Ausfallalternative.

## Nutzen

`index.html` öffnen oder den gesamten Ordner statisch hosten. Keine Installation, API-Schlüssel, Frameworks oder Serverlogik nötig. Code, Katalog und Illustrationen liegen lokal. Fotos werden von ihren ursprünglichen Anbietern geladen und benötigen eine Internetverbindung.

- Alle / Objekte / Aktivitäten; Suche auch nach Material und benannten Farbvarianten.
- Wahrnehmung und Material als unabhängig auswählbare Checkbox-Chips: ODER innerhalb einer Zeile, UND zwischen den Dimensionen.
- Farbvarianten sind standardmäßig eingeschaltet und lassen sich unter Filter ausblenden. Favoriten gelten für das ganze Objekt einschließlich seiner Varianten.
- Echte Produktreferenzen zeigen Titel und Herz bei Hover oder Tastaturfokus. Auf Touch und kleinen Bildschirmen bleibt das Herz erreichbar, mit 44 × 44 CSS-Pixeln Interaktionsfläche.
- Illustrationen, Symbolfotos und Herstellerdarstellungen zeigen ihren Namen immer. Die Bildart ist gesondert gekennzeichnet. Ein Symbolfoto bildet ein Material oder eine Aktivität ab und ist kein genaues Verkaufsangebot.
- Der feste Button **Zufall** öffnet einen zufälligen Eintrag aus der aktuellen Auswahl. Jede Katalog-ID zählt einmal; Farbvarianten erhöhen ihre Chance nicht. Im geöffneten Detail bleibt ein zweiter Zufallsbutton oben erreichbar. Der unmittelbar zuvor geöffnete Eintrag wird ausgeschlossen. Bei null Treffern bzw. nur dem aktuellen Eintrag ist der passende Button deaktiviert.
- Material, Wahrnehmung und Rubrik in Details sind anklickbar. Ein Klick öffnet die Galerie mit genau diesem Filter; widersprüchliche alte Filter werden dafür abgelegt. **← Zurück** stellt die vorherige Auswahl, Scrollposition und Kachel wieder her. **Zurücksetzen** entfernt alle Filter.
- **Entdecken** verteilt Illustrationen über die komplette Galerie und streut Farbvarianten ein. Es gibt weder einen Fotoblock mit anschließendem Illustrationsblock noch eine behauptete Beliebtheitswertung.
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
python tools/build.py --preview STIM_ATLAS_v11_2_Vorschau.html
```

`source_data/v9-catalog.json` und das alte Recherchepaket bleiben erhalten. Neuere Ergänzungen stehen in `extra-objects.json`, `visual-examples.json` und `research-v11.json`. `research-v11-1.json` enthält weitere 27 Produkte, 49 Fotozuordnungen und die Einzelprüfung aller 152 früher illustrierten Einträge. `image-audit.json` dokumentiert technische Bildprüfungen. `research-v11-2.json` enthält die kuratierten Gemini-Ergänzungen, Zusammenführungen und Materialkorrekturen. Direkte Änderungen an `data/catalog.json` würden beim nächsten Build überschrieben.

Die 21 neuen Einträge umfassen zehn Kleidungsstücke/Wearables, acht Duftprodukte und drei Aktivitäten mit Kräutern, Zitronenschalen oder Blüten. Die ursprünglichen Ideen bleiben eigenständig recherchierte Konzepte. Materialzusammensetzungen werden nicht aus Fotos geraten; unklare Angaben bleiben ungeklärt. Katalogeinträge enthalten keine klinischen Wirkungsversprechen.

## Bilder und Lizenz

Eigener Anwendungscode, Build-Werkzeuge und die neuen SVG-Illustrationen stehen unter MIT, siehe `LICENSE`. Bestehende Eingangsdateien, fremde Produkttexte, Markennamen und externe Fotos sind davon ausgenommen; deren jeweilige Rechte bleiben bestehen. Sie werden nicht pauschal unter MIT gestellt.

Herstellerfotos bleiben externe Verweise. Technische Erreichbarkeit und Dekodierung beweisen weder Motividentität noch Nutzungsrechte oder dauerhafte Verfügbarkeit. Ein Stimm-Herstellerbild ist vorsorglich als Herstellerdarstellung markiert, weil der Anbieter KI-erzeugte oder bearbeitete Bilder nicht einzeln zuordnet. Das Lush-Bild ist nur 256 × 256 Pixel groß. Das Origami-Symbolfoto stammt von Laitche / Wikimedia Commons (Public domain); genaue Attributionen und Bildquellen stehen am jeweiligen Eintrag.

Recherche: 19.10.2026; Integration und Browserprüfung: 20.10.2026. Siehe `RECHERCHE.md` und `TESTBERICHT.md`.

## Erweiterung v11.1

27 zusätzliche Produkte: drei unterschiedliche Pop-Bälle, fünf Lava-/Glitzerlampen, neun Hänge-/Balance-/Druckobjekte sowie weitere Saugnapf-, Gel-, Licht- und Klangobjekte. 49 bisher illustrierte Einträge haben nun geprüfte Fotos. Die verbleibenden 103 Illustrationen vermeiden unter anderem missverständliche Stockbilder für Körperinnenwahrnehmung und abstrakte digitale Abläufe.

Die Bildprüfung ist eine dokumentierte Eignungsprüfung mit gezielter Recherche für passende Fotokandidaten, keine Behauptung einer erschöpfenden Einzel-Websuche für jedes Konzept. Die 82 neu verwendeten Bildadressen wurden geladen und vollständig dekodiert; ausgewählte Motive wurden visuell auf Kontaktbögen geprüft. Herstellerfotos und Commons-Symbolfotos behalten ihre Quellen-/Lizenzangaben. Externe Bilder bleiben externe Verweise.

Die frühere Bezeichnung „Stimmbarer Daumen-Klangstab (Tuning Fork)“ wurde zu „Stimmgabel (Klangstab)“ korrigiert: Das gezeigte Instrument hat feste 440 Hz. Der tote Mini-Minky-Produktlink wurde ersetzt. Neue Dateiversionen laden Styles und Skripte mit Inhaltskennung, damit alte Browserdateien nicht mit neuer Oberfläche vermischt werden.

## Erweiterung v11.2

36 Gemini-Vorschläge redaktionell abgeglichen: 15 neue Einträge, 15 Anreicherungen bestehender Einträge, sechs nicht übernommen. Bestehende IDs und Fotoverweise bleiben erhalten. Neu sind unter anderem Kugellager, Baoding-Kugeln, eine Fühlschale, gefüllter Bimsstein, Filter-Ohrstöpsel und ein geschlossenes Ferrofluid-Display. Neun neue Objekte erhalten zugeordnete Bildreferenzen; sechs Körperaktivitäten behalten benannte, zurückhaltende Illustrationen. Ein bestehendes Kaleidoskop-/Teleidoskop-Konzept erhält ein passendes Symbolfoto.

Alle 147 R01-Aktionsfelder wurden überarbeitet. Von 68 gezielt geprüften Materialangaben sind 58 eingeordnet, zehn bleiben mangels Beleg ungeklärt. Herstellerbelege und aus vorhandenen Beschreibungen abgeleitete Materialklassen werden in den Quellen unterschieden. Ein unbekannter Kunststoff wird nicht automatisch als Silikon oder PLA ausgegeben.

Übernommene Alltagsalternativen und zusätzliche Suchbegriffe stehen ausschließlich im aufklappbaren Detailbereich **Alltagsideen & Suchbegriffe**. Die Bildwand bleibt unverändert kompakt. Die Vorschläge wurden als Rechercheinput behandelt; ungeprüfte medizinische Wirkversprechen und problematische Anleitungen wurden nicht übernommen. `source_data/research-v11-2.json` dokumentiert jede Entscheidung. Aktuelle Tests: `TESTBERICHT.md`.
