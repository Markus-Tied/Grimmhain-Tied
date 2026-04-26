# CLAUDE.md – Grimmhain: Werewolf Reckoning

---

## ⚡ BEIM START EINER NEUEN SESSION — IMMER ZUERST LESEN

**Lies `ROADMAP.md` im Hauptordner `Werwolf/` bevor du anfängst.**
Die Roadmap enthält den vollständigen Projektstand, alle erledigten Aufgaben und die priorisierten nächsten Schritte. Starte dort weiter wo die letzte Session aufgehört hat.

```
Werwolf/ROADMAP.md  ← Immer zuerst öffnen
```

Wenn Marcus keine konkrete Aufgabe nennt → nächsten offenen Punkt aus der Roadmap vorschlagen.
Wenn eine Aufgabe abgeschlossen wird → Checkbox in ROADMAP.md von `[ ]` auf `[x]` setzen.

---

## Arbeitsregeln für Claude

- **Immer fragen, bevor Änderungen gemacht werden.** Keine Datei verändern ohne explizite Bestätigung.
- Claude hat vollen Lese- und Schreibzugriff auf alle Dateien innerhalb des `Werwolf/`-Ordners.
- Vorschläge klar und verständlich formulieren — der Entwickler ist kein erfahrener Programmierer.
- Bei Fehlern oder Bugs: erst analysieren, dann Lösung vorschlagen, dann warten auf Freigabe.
- Code soll sauber, lesbar und kommentiert bleiben (Deutsch oder Englisch).

---

## Projektvision

**Grimmhain – Werewolf Reckoning** ist ein digitaler Spielleiter-Assistent für das Werwolf/Mafia-Kartenspiel.

### Ziele (in Reihenfolge):
1. **Aktuelle Web-App** stabilisieren, optimieren und bugfrei machen (PWA)
2. **Cross-Platform App** bauen: iOS, Android, Windows/Mac/Linux Desktop
   - Geplante Technologie: [Capacitor](https://capacitorjs.com/) (für Mobile) + [Tauri](https://tauri.app/) oder Electron (für Desktop/Steam)
3. **Vorlage für Online-Version** vorbereiten: Multiplayer, Standalone-Release, Steam
   - Die `js/core/`-Schicht ist die Grundlage dafür — DOM-frei halten!

### Wichtig für alle Entscheidungen:
- Änderungen sollen die spätere App-Portierung nicht erschweren
- `js/core/` darf **kein DOM** enthalten — das ist die portable Spiellogik
- `js/ui/` ist der Web-Layer — wird später durch React Native / native Layer ersetzt

---

## Projekt starten

Kein Build-System erforderlich. Statisch serven:

```bash
python -m http.server 8080
# oder
npx serve .
# oder index.html direkt im Browser öffnen
```

Übersetzungsschlüssel prüfen:
```bash
node tools/compare-i18n.js
```

---

## Dateistruktur

```
Werwolf/
├── index.html          ← Startseite (Spielerzahl + Sprache)
├── setup.html          ← Namenseingabe, Rollenzuweisung, Review
├── game.html           ← Hauptinterface des Spielleiters
├── css/
│   ├── tokens.css      ← Design-Tokens (Farben, Fonts)
│   ├── main.css        ← CSS Grid Layout (5 Spalten)
│   └── screens.css     ← Screen-spezifische Styles
├── js/
│   ├── core/           ← PORTABLE Spiellogik (kein DOM!)
│   │   ├── state.js    ← GameState, localStorage (Key: uw_custom_v16)
│   │   ├── roles.js    ← 75+ Rollendefinitionen
│   │   ├── abilities.js← Fähigkeiten-Auflösung (~1150 Zeilen)
│   │   ├── cards.js    ← Totenkarten-System (Post-Tod-Buffs)
│   │   ├── night.js    ← Nachtphasen-Reihenfolge
│   │   └── i18n.js     ← Übersetzungen DE/EN
│   └── ui/             ← Web-spezifischer Layer (DOM erlaubt)
│       ├── core.js     ← Kill-Logik, Tod-Hooks, Siegbedingungen
│       ├── ui.js       ← Rendering, Sitzkreis, Phasensteuerung
│       ├── audio.js    ← Rollengeräusche, Nachtmusik
│       └── gamelog.js  ← Spielprotokoll
├── assets/             ← Fonts, Sounds, Icons (strukturiert)
├── tools/
│   └── compare-i18n.js ← Fehlende Übersetzungsschlüssel finden
└── docs/
    └── README.md
```

---

## State-Schema (localStorage `uw_custom_v16`)

```js
{
  seats: [{
    id, name, role,
    flags: { dead, protected, targeted, inlove, rival, werewolf,
             nominated, charmed, poisoned, burned, puppet, hmark },
    meta:  { cerbHeads, killedTonight, cursedWolfAura, rivalId,
             loverId, unholy, blockedTonight }
  }],
  once:       { /* Einmalige Spielzustände, Totenkarten-Mapping, Rollendaten */ },
  dark:       boolean,   // false = Tag, true = Nacht
  nightCount: number,
  layout:     { scale, ratio, offx, offy },
  files:      { nightAudio, alarmAudio }
}
```

---

## Konventionen

| Thema | Regel |
|-------|-------|
| Neue Rolle | In `roles.js` definieren → Interaktionen in `abilities.js` → Nacht-Reihenfolge in `night.js` |
| Übersetzung | Schlüssel in beide Objekte (`de` + `en`) in `i18n.js` eintragen |
| Todes-Effekte | Vor Implementierung `cards.js` prüfen — könnte bereits behandelt werden |
| Styling | Design-Tokens aus `tokens.css` verwenden (Goldton: `#C9A84C`) |
| Mobile | Landscape-only, Safe-Area-Insets beachten |
| Fonts | Cinzel (Überschriften), IM Fell English (Fließtext) |

---

## Bekannte Schwachstellen / Aufgaben

- `abilities.js` ist mit ~1150 Zeilen sehr groß → Refactoring-Kandidat
- Doppelte Asset-Ordner (`/icons` + `/assets/icons`, `/Sounds` + `/assets/sounds`) → bereinigen
- Mobile-Unterstützung: aktuell nur Landscape → Portrait-Modus prüfen
- Kein automatisches Testing vorhanden

---

## Cross-Platform Roadmap (Referenz)

```
Phase 1: Web-PWA (aktuell)
  └─ Vanilla HTML/CSS/JS, läuft im Browser

Phase 2: Mobile App
  └─ Capacitor um bestehenden Web-Code wrappen
     → iOS App Store + Google Play

Phase 3: Desktop App
  └─ Tauri (empfohlen, klein) oder Electron
     → Windows, macOS, Linux + Steam

Phase 4: Online-Version
  └─ Backend hinzufügen (Node.js / Supabase)
     → Multiplayer, Accounts, Lobbys
```
