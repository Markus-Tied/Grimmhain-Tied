# Bug-Fix-Report — Mai 2026

## PRIO 1 — Kritische Fixes

- **Fix 1 (i18n Lone Wolf):** `js/core/i18n.js` EN-Block — `whiteWolfWait`, `noWhiteWolfActive`, `whiteWolfUsedTonight`, `whiteWolfNoTargets` + Translations-Array: "White Werewolf" → "Lone Wolf"
- **Fix 2 (SOLO-Set):** `game.html` — beide SOLO-Sets (renderSetupOverview + renderRoleChips) nutzen jetzt `window.SOLO_WIN_ROLES` (authoritative Quelle aus roles.js); Fallback inkl. Manipulator, Doppelspion, Grabräuber, Parasit, Todesprediger, Nekromant
- **Fix 3 (once-Reset):** `game.html` — `clearRolesNewRound()` setzt jetzt zusätzlich zurück: `RudelvaterSavedOnce`, `SeuchenwolfNextAttackPierces`, `FateWolfMarked`, `TodespredigerPrediction`, `MorningCount`, `NightUsedRoles`, `WhiteWolfCooldown`, `WhiteWolfUsedTonight`, `FirstThreeDeadIds`, `FateWolfNight4Used`, `SchmiedForgeNights`, `PackfatherExtraKillNextNight`, `PackfatherBlockNextDay`, `ManipulatorWasNominated`
- **Fix 4 (getFaction):** `js/core/night.js` — lokale hardcodierte `getFaction()` ersetzt durch Delegation an `getRoleFaction()` aus roles.js
- **Fix 5 (Undo-Tooltip):** `game.html` + `js/core/i18n.js` — "Bis zu 5 Schritte zurück" → "Letzten Schritt rückgängig machen" (DE), "Undo last step" (EN)
- **Fix 6 (akte.js):** Datei existiert — in `CLAUDE.md` Dateistruktur dokumentiert

## PRIO 2 — Mittlere Fixes

- **Fix 7 (localStorage):** `js/core/state.js` — `localStorage.setItem` und `load()` in try/catch gewrappt mit `console.warn` bei Fehler
- **Fix 8 (Viewport-Meta):** `game.html` — `<meta name="viewport">` an Anfang von `<head>` verschoben (vor alle Script-Tags)
- **Fix 9 (Schwarze Witwe/Loki):** `game.html` — `setupFertig.onclick` prüft jetzt ob "Schwarze Witwe" ohne "Loki" gewählt wurde; zeigt Fehlermeldung via `center()` und blockiert Weitergehen

## Rechtschreibung & Grammatik

- **Fix 10 (cards.js):** "Neu Anfang" → "Neuer Anfang"; "Der Spielleiter Nominiert" → "Der Spielleiter nominiert"; "für wieviele runden" → "für wie viele Runden"
- **Fix 11 (i18n Leerzeichen):** `js/core/i18n.js` — doppelte Leerzeichen in `prophetMarkUnholy` und `prophetKillOne` (DE-Block) entfernt

## QoL

- **Fix 12 (Gamelog Zeitstempel):** `js/ui/gamelog.js` — Zeitstempel (`HH:MM`) wird jetzt in jedem Log-Eintrag im Panel angezeigt (dezent, 45% Opacity, kleiner Font)

## Dokumentation

- `CLAUDE.md` — Dateistruktur ergänzt: `akte.js`, `abilities-helpers.js`, `abilities-roles-chunk.js`, `role-abilities.js`
- `ROADMAP.md` — Bug-Fix-Durchlauf als erledigt markiert
