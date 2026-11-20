# Sicherheitsdatenblätter

Jedes Datenblatt hat eine eigene Seite, die das PDF direkt im Browser anzeigt (kein Download).
Die QR-Codes auf den Flaschen-Etiketten zeigen auf diese Seiten.

Übersicht: https://fredericuhl-stack.github.io/sdb/

## Neues Datenblatt hinzufügen

1. PDF in den Ordner `pdf/` hochladen – geht auch am Handy auf github.com
   (Ordner `pdf` öffnen → „Add file“ → „Upload files“). Dateiname am besten klein und
   ohne Leerzeichen, z. B. `labo-glico.pdf` → Adresse `…/sdb/labo-glico/`.
2. Optional in `produkte.json` einen Eintrag ergänzen (Marke, Name, Stand, kurze Adresse `slug`).
   Ohne Eintrag wird die Seite automatisch aus dem Dateinamen erzeugt.
3. Fertig: Nach jedem Upload baut GitHub die Seiten automatisch neu, nach ca. 1 Minute online.

## Datenblatt aktualisieren

Neue Version unter **demselben Dateinamen** in `pdf/` ersetzen und pushen.
Die Adresse bleibt gleich, die gedruckten QR-Codes müssen nicht neu gedruckt werden.
