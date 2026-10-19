# Stim Atlas v11.1 – Prüfung am 19.10.2026

24 automatisierte Regressionstests bestanden: Original-IDs und Favoritenmigration, ODER-/UND-Filter, Suche, Sortierung, Bildquellen, 27 neue Produkte, 49 Fotozuordnungen, alle 152 Bildreviews und 488 eindeutige Galeriekacheln. Zufall wird pro Katalogeintrag geprüft, unabhängig von dessen Zahl an Farbvarianten; aktueller Eintrag und leere Auswahl werden korrekt behandelt.

Browserprüfung: Zufall bleibt innerhalb der aktiven Suche. Zwei aufeinanderfolgende Ziehungen öffnen unterschiedliche Einträge. Materialien und Rubriken schließen das Detail und öffnen die passende Auswahl. Zweistufiges Weiterstöbern lässt sich mit Zurück schrittweise rückgängig machen. Ein Rücksprung nach tiefem Scrollen stellte exakt 2848,57 CSS-Pixel, alle 72 gerenderten Kacheln und den Tastaturfokus auf der vorherigen Kachel wieder her. Browser-Zurück stellt auch die URL-Filter wieder her.

Bei 320 CSS-Pixeln kein horizontaler Überlauf. Der feste Zufallsbutton hat 44 Pixel Höhe; der Zufallsbutton im Detail misst 44 × 44 Pixel und bleibt beim Scrollen in der oberen festen Steuerleiste sichtbar. Bei null Treffern ist Zufall deaktiviert; bei nur einem geöffneten Treffer ist erneutes Ziehen deaktiviert. Escape schließt den Dialog.

Die neuen Foto-URLs wurden vollständig geladen und dekodiert; die zugehörigen Motive visuell auf Kontaktbögen geprüft. Das beweist weder dauerhafte Erreichbarkeit noch die Rechtefreiheit von Herstellerbildern. Illustrationen bleiben als lokale Ausfallalternative vorhanden. Die Galerie enthält Fotos bis zum Ende und verteilt die Farbvarianten gleichmäßiger; keine behauptete Popularitätssortierung.

Weitere Messwerte: `atlas-browser-qa.json`. Screenshots zeigen die laufende Website; nur die ungenutzte Browser-Leinwand durch Windows-Anzeigeskalierung wird am Rand abgeschnitten.
