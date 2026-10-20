# Stim Atlas v11.4

Eine statische Bildwand zum Entdecken von Stim-Objekten, Materialien und Aktivitäten. Dunkel als Standard, optional hell, ohne Quiz oder Anmeldung.

Aktueller Stand: **620 Einträge, 72 zusätzliche Herstellerbeispiele für Farben und Oberflächen, 691 Galeriekacheln mit eingeschalteten Varianten**. Davon haben 513 Einträge externe Bildreferenzen; 107 verwenden eigene Illustrationen. Jeder Eintrag besitzt außerdem eine lokale Illustration als Ausfallalternative.

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
python tools/build.py --preview STIM_ATLAS_v11_3_Vorschau.html
```

`source_data/v9-catalog.json` und das alte Recherchepaket bleiben erhalten. Neuere Ergänzungen stehen in `extra-objects.json`, `visual-examples.json` und `research-v11.json`. `research-v11-1.json` enthält weitere 27 Produkte, 49 Fotozuordnungen und die Einzelprüfung aller 152 früher illustrierten Einträge. `image-audit.json` dokumentiert technische Bildprüfungen. `research-v11-2.json` enthält die kuratierten Gemini-Ergänzungen, Zusammenführungen und Materialkorrekturen. `research-v11-3.json` ergänzt weitere 80 Katalogeinträge und 34 verifizierte Wikimedia-Commons-Symbolfotos für zuvor illustrierte R01-Einträge. Direkte Änderungen an `data/catalog.json` würden beim nächsten Build überschrieben.

Die 21 neuen Einträge aus v11 umfassen zehn Kleidungsstücke/Wearables, acht Duftprodukte und drei Aktivitäten mit Kräutern, Zitronenschalen oder Blüten. Die ursprünglichen Ideen bleiben eigenständig recherchierte Konzepte. Materialzusammensetzungen werden nicht aus Fotos geraten; unklare Angaben bleiben ungeklärt. Katalogeinträge enthalten keine klinischen Wirkungsversprechen.

## Bilder und Lizenz

Eigener Anwendungscode, Build-Werkzeuge und die neuen SVG-Illustrationen stehen unter MIT, siehe `LICENSE`. Bestehende Eingangsdateien, fremde Produkttexte, Markennamen und externe Fotos sind davon ausgenommen; deren jeweilige Rechte bleiben bestehen. Sie werden nicht pauschal unter MIT gestellt.

Herstellerfotos bleiben externe Verweise. Technische Erreichbarkeit und Dekodierung beweisen weder Motividentität noch Nutzungsrechte oder dauerhafte Verfügbarkeit. Ein Stimm-Herstellerbild ist vorsorglich als Herstellerdarstellung markiert, weil der Anbieter KI-erzeugte oder bearbeitete Bilder nicht einzeln zuordnet. Das Lush-Bild ist nur 256 × 256 Pixel groß. Das Origami-Symbolfoto stammt von Laitche / Wikimedia Commons (Public domain); genaue Attributionen und Bildquellen stehen am jeweiligen Eintrag.

Recherche: 19.–20.10.2026; Integration und Browserprüfung: 20.10.2026. Siehe `RECHERCHE.md` und `TESTBERICHT.md`.

## Erweiterung v11.1

27 zusätzliche Produkte: drei unterschiedliche Pop-Bälle, fünf Lava-/Glitzerlampen, neun Hänge-/Balance-/Druckobjekte sowie weitere Saugnapf-, Gel-, Licht- und Klangobjekte. 49 bisher illustrierte Einträge haben nun geprüfte Fotos. Die verbleibenden 103 Illustrationen vermeiden unter anderem missverständliche Stockbilder für Körperinnenwahrnehmung und abstrakte digitale Abläufe.

Die Bildprüfung ist eine dokumentierte Eignungsprüfung mit gezielter Recherche für passende Fotokandidaten, keine Behauptung einer erschöpfenden Einzel-Websuche für jedes Konzept. Die 82 neu verwendeten Bildadressen wurden geladen und vollständig dekodiert; ausgewählte Motive wurden visuell auf Kontaktbögen geprüft. Herstellerfotos und Commons-Symbolfotos behalten ihre Quellen-/Lizenzangaben. Externe Bilder bleiben externe Verweise.

Die frühere Bezeichnung „Stimmbarer Daumen-Klangstab (Tuning Fork)“ wurde zu „Stimmgabel (Klangstab)“ korrigiert: Das gezeigte Instrument hat feste 440 Hz. Der tote Mini-Minky-Produktlink wurde ersetzt. Neue Dateiversionen laden Styles und Skripte mit Inhaltskennung, damit alte Browserdateien nicht mit neuer Oberfläche vermischt werden.

## Erweiterung v11.2

36 Gemini-Vorschläge redaktionell abgeglichen: 15 neue Einträge, 15 Anreicherungen bestehender Einträge, sechs nicht übernommen. Bestehende IDs und Fotoverweise bleiben erhalten. Neu sind unter anderem Kugellager, Baoding-Kugeln, eine Fühlschale, gefüllter Bimsstein, Filter-Ohrstöpsel und ein geschlossenes Ferrofluid-Display. Neun neue Objekte erhalten zugeordnete Bildreferenzen; sechs Körperaktivitäten behalten benannte, zurückhaltende Illustrationen. Ein bestehendes Kaleidoskop-/Teleidoskop-Konzept erhält ein passendes Symbolfoto.

Alle 147 R01-Aktionsfelder wurden überarbeitet. Von 68 gezielt geprüften Materialangaben sind 58 eingeordnet, zehn bleiben mangels Beleg ungeklärt. Herstellerbelege und aus vorhandenen Beschreibungen abgeleitete Materialklassen werden in den Quellen unterschieden. Ein unbekannter Kunststoff wird nicht automatisch als Silikon oder PLA ausgegeben.

Übernommene Alltagsalternativen und zusätzliche Suchbegriffe stehen ausschließlich im aufklappbaren Detailbereich **Alltagsideen & Suchbegriffe**. Die Bildwand bleibt unverändert kompakt. Die Vorschläge wurden als Rechercheinput behandelt; ungeprüfte medizinische Wirkversprechen und problematische Anleitungen wurden nicht übernommen. `source_data/research-v11-2.json` dokumentiert jede Entscheidung. Aktuelle Tests: `TESTBERICHT.md`.

## Erweiterung v11.3

80 neue Katalogeinträge (`R03-001` bis `R03-080`) sowie 34 verifizierte Wikimedia-Commons-Symbolfotos für bislang illustrierte gegenständliche `R01-*`-Einträge (`source_data/research-v11-3.json`):

- **34 Foto-Upgrades bestehender Einträge (`R01-*`)**: Gegenständliche Konzepte wie Memory-Foam-Block, Waffelgewebe, Edelstahl-Handstein, Taschen-Wärmekissen, Federdruck-Stempel, Flügelmutter, Handtrainer, Bolster-Kissen, Barfußpfad, Lentikularkarte, Newton-Pendel, Treibholz, Flusskiesel, Webrahmen und Fingerlabyrinth zeigen nun echte, lizenzierte Wikimedia-Commons-Fotos (`representative_photo`) statt Platzhalter-Illustrationen.
- **30 bekannte Klassiker (`R03-001` bis `R03-030`)**: Unter anderem Gewichtsdecke, Gewichtsplüschtier, Kapselgehörschutz, Tuch-Hängematte, Sitzball, Mini-Trampolin, Akupressurmatte, Kopfmassage-Spinne, Faszienrolle, Kirschkernkissen, Wärmflasche, Schlafmaske, Klick-Kugelschreiber, Magnet-Zeichentafel, Spirograph, Kratzbild, Bienenwachs-Knetwachs, Seifenblasen, Murmel-Klangbaum, Resonanz-Windspiel, Cabasa, Guiro-Klangfrosch, Egg Shaker, Kazoo, Zirbenkissen, ganze Gewürze, Trinkflasche mit Beißventil, gefrorene Trauben, Backoblaten und Brausepulver — alle 30 mit geprüften Commons-Fotos.
- **26 ungewöhnliche & weniger bekannte Entdeckungen (`R03-031` bis `R03-056`)**: Unter anderem Hoberman-Kugel, Eulersche Scheibe, Oloid, keltischer Wackelstein (Rattleback), Umkehrkreisel (Tippe Top), Lichtmühle (Crookes-Radiometer), Galileo-Thermometer, Sturmglas, chinesische Handwalnüsse, Chainmaille-Ringgeflecht, Metall-Vexier, Furin-Windglocke, Feder-Donnertrommel, Caxixi-Rasselkörbchen, Maultrommel, Temari-Fadenkugel, Sorgenpüppchen, Konjak-Schwamm, Luffa-Schwamm, Bienenwachstuch, Seidenkokon, Zählperlenkette, Soroban-Abakus, Faltfächer, Speckstein-Handschmeichler und singende Hämatit-Magnete — alle 26 mit geprüften Commons-Fotos.
- **24 Einträge zu Alltagssituationen, sozialer Entstigmatisierung & feiner Sensorik-Kultivierung (`R03-057` bis `R03-080`)**: Konkrete, schamfreie Bewegungen und Wahrnehmungsinseln im Alltag und in sozialen Situationen — darunter Vor-und-zurück-Wiegen (Rocking), Steh-Pendeln, Umhergehen beim Telefonieren/Nachdenken, leises Fußwippen, freie Sitzwahl (Schneidersitz/Boden), Anlehnen an Wand/Türrahmen, verdeckter Taschen-Anker, Blickpausen im Gespräch, warme Tasse in beiden Händen, Hände unter fließendem Wasser, Übergangs-Ritual beim Heimkommen, nahtlose/Zehensocken, Etiketten heraustrennen, Randplatz mit Wand im Rücken, Schirmmütze/Kapuze als Blendschutz, Oberflächen am Wegesrand berühren, Hör-Schichten einzeln wahrnehmen, Barfuß-Bodenwechsel, kurze Druck-Pause am Tag, Regentropfen am Fenster, wandernde Licht-/Schattenmuster, Freischwinger-Stuhl, Fuß-Hängematte unter dem Tisch und Gesicht in ein frisches Handtuch drücken (11 mit Commons-Fotos, 13 mit ruhigen SVG-Illustrationen).


## Erweiterung v11.4

108 neue Katalogeinträge (`R04-001` bis `R04-108`), drei neue bzw. vertiefte Hauptkategorien, verifizierte Produktfotos für `v8-23` und `R01-095`, ein Upgrade für `R01-088` (duftende Zedernholzkugeln) und vollständige Ersetzung aller Fotos mit echten Menschen durch reine Objekt-, Material- und Raumfotos (`source_data/research-v11-4.json`):

- **Ko-Regulation & Miteinander (`R04-001` bis `R04-032`, 32 Einträge)**: Dinge, Gesten und gemeinsame Routinen, die Menschen füreinander und miteinander tun können, um sich gegenseitig zu beruhigen und das Nervensystem sanft zu glätten — darunter ruhiges Handauflegen zwischen die Schulterblätter, „Decken-Burrito“ einschlagen, Rücken-an-Rücken-Sitzen, Haare langsam bürsten, Holz-Massageroller, Vibrationsmassage, tiefer Druck-Squeeze entlang der Arme/Waden, Füße unter der Decke halten, stilles Paralleles Beisammensein (Body Doubling), wortlos Tee/Obst hinstellen, synchrones Gehen, Hollywoodschaukel, nonverbaler Klopfcode/Pausensignal, gemeinsames Seufzen/Ausatmen, geteiltes Summen, Medizinball am Boden rollen, Katze schnurren lassen / Hund kraulen, vorgewärmtes Handtuch von der Heizung, stilles Wechsel-Zeichnen, Hand-Spiegelspiel, Igelball-Rückenabrollen, Raum runterdimmen, Beine übereinanderlegen und Deep-Pressure-Bärenumarmung (13 mit Commons-Fotos, 19 mit ruhigen Illustrationen).
- **Alltags-Erleichterung & Reizschutz (`R04-033` bis `R04-068`, 36 Einträge)**: Reizärmere Alltagsbegleiter, sanfte Körperpflege und Raumentlastung — darunter die explizit gewünschte Süßholzwurzel & Miswak (`R04-033`), dimmbare Bernsteinlampe, Falt-Paravent, Bettzelt/Schlafkoje, schwerer Verdunkelungsvorhang, Filzgleiter & Silikonpuffer, E-Ink-Lesegerät, matte Displayfolie mit Papierwiderstand, Lichtwecker, Holzbesteck/-schalen, geräuschlose Silikon-Kochlöffel, ultraweiche Sensitiv-Zahnbürste, mentholfreie Zahnpasta, breitzinkiger Holzkamm, Regenduschkopf mit Weichstrahl, Schafwoll-Trocknerbälle, Kiesel-Fußbad, kühler Jade-Gesichtsroller, Gel-Augenmaske, schwereloses Wassertreiben mit Ohren unter Wasser, Barfuß-Ufersand, Nackenhörnchen mit Buchweizenfüllung, Woll-Sitzfell, Kork-Schreibtischunterlage, mechanische Tastatur mit gedämpften Switches, Gel-Handballenauflage, Trackball-Maus, elektrisches Heizkissen, Ultraschall-Kaltvernebler, Salzkristalllampe, schwere Tetsubin-Gusseisenkanne, Glas-/Edelstahltrinkhalm, Isolierflasche mit matter Pulverbeschichtung, weiter Strick-Poncho, Barfußschuhe mit breiter Zehenbox und elastische Schnürsenkel mit Stopper (alle 36 mit verifizierten, personenfreien Commons-Fotos).
- **Sammeln, Sortieren & Ordnung + EDC, Taktil, Mund & Stimme (`R04-069` bis `R04-108`, 40 Einträge)**: Setzkasten, Holzarten-Mustersammlung (Xylothek), RAL-/Pantone-Farbfächer, Knopfsammlung in der Blechdose, samtiges Meerglas, Muschel-/Schneckenhaussammlung, Pergamin-Einsteckalbum, Münzen zu Türmen stapeln, Holz-Tangram, Dominosteine, Leinenprägung-Spielkarten, Glasmurmeln, schwerer Messing-Füllfederhalter, Edelstahl-Karabinerhaken, mechanische Skelett-Taschenuhr, Metall-Klappetui / Pfefferminzdose, breiter Band-/Siegelring, Siegelwachs mit Messingstempel, 3D-/Puffy-Sticker, holografische Regenbogen-Sticker, Washi-Tape, Leinen-Notizbuch, Wachsmalblöcke, Ocean Drum, Sansula auf Membranrahmen, Klangschale auf der Handfläche, Lippenblubbern (Lip Trills), tiefe Brustvokale, Kiefer-Pause, weich-elastische Tapioka-/Boba-Perlen, Chia-Pudding mit Gelee-Körnchen-Textur, geröstete Kichererbsen / Makhana, knackige Gurkenscheiben, getrocknete Mangostreifen für langen Kauwiderstand, trockener Natur-Bimsstein, Rosskastanien in der Manteltasche, samtige Wollziest-Blätter, Cord-/Samt-Scrunchie, mechanisches Pendel-Metronom und facettierter Sonnenfänger-Kristall (37 mit Commons-Fotos, 3 mit ruhigen Illustrationen).
- **Strikte Personenfreiheit & Foto-Korrekturen**:
  - `R03-018` (Seifenblasen): Ersetzt durch schillernde Seifenblasen im Sonnenlicht ohne Personen (`File:Soap_bubble_reflection_(Unsplash).jpg`).
  - `R01-045` (Kissen zum Drücken): Ersetzt durch reines Stoffkissen ohne Person (`File:Throw_Pillow.JPG`).
  - `R03-066` (Wasserstrahl): Ersetzt durch fließendes Wasser am Hahn ohne Hände/Person (`File:Flowingtap.jpg`).
  - `R02-014` (Atem-Anhänger): Ersetzt durch zylindrischen Metallröhrchen-Anhänger ohne Model (`File:Hundepfeife01.JPG`).
  - `R01-054` (Barfußpfad): Ersetzt durch leeren Barfußpfad in Bad Mergentheim ohne watende Personen (`File:Kneipp_Barfußpfad_Bad_Mergentheim-01.jpg`).
  - `R03-065` (Warme Tasse): Ersetzt durch Teetasse und Teekanne ohne gehaltene Hände (`File:Nice_Cup_of_Tea.jpg`).
  - `product-funfunction-mesh-swing`: Ersetzt durch Raum-Netzhängematten ohne Kind (`File:SVhammocks.jpg`).
- **Verifizierte Produktfotos für vermisste Einträge**:
  - `v8-23` (Mesh-Squeeze-Ball): Ausgestattet mit verifiziertem Produktfoto (`i5.walmartimages.com`).
  - `R01-095` (Silikon-Kauschlauch): Ausgestattet mit verifiziertem Foto einer lebensmittelechten Silikon-Zahnschutzspitze (`File:Metal_straw.jpg`).
  - `R01-088` (Duftende Zedernholz-Kugeln): Titel und Beschreibung auf Schrank- & Handschmeichler-Holzkugeln erweitert, mit echtem Foto gedrechselter Rotzedernholz-Kugeln (`File:Rdečeplodni_brin_zbirka_Antona_Suhadolca.jpg`).
