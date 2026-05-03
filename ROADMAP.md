# Grimmhain – Vollständige Roadmap
**Zuletzt aktualisiert:** April 2026
**Deadline:** März 2027 (Ende Elternzeit)
**Verbleibende Zeit:** ~11 Monate

---

## Übersicht: Die drei Produkte

| Produkt | Status | Priorität |
|---|---|---|
| `grimmhain-website` — Marketing-Website (Next.js) | 🟡 In Arbeit | 1 (Zuerst fertig machen) |
| Spielleiter-App (Vanilla JS) | 🟡 Funktioniert, hat Bugs | 2 |
| Kickstarter + Physisches Kartenset | 🔴 Noch nicht gestartet | 3 |

---

## PRODUKT 1 — Marketing-Website (`grimmhain-website/`)

### Was bereits fertig ist ✅

**Design-System:**
- `globals.css` mit vollem Gothic-Toolkit: `.grimm-card`, `.grimm-input`, `.grimm-textarea`, `.btn-gold`, `.btn-ghost`, `.fade-both`, `.sec-h`, `.sec-tag`, `.sec-p`, `.gold-bar`, `.sec-center`
- `GrimmButton` — Custom-Komponente mit SVG-Ornamentrahmen (gold + blood)
- `GrimmTab` — Faction-Tabs mit CSS Corner-Brackets
- `Icons.tsx` — komplettes Icon-System via Lucide React
- `ScrollReveal` — Scroll-Animations-Wrapper
- Design-Tokens: Void/Deep/Abyss/Pit/Dusk (Dark), Bone/Parch/Aged (Light), Blood/Crimson/Ember (Red), Silver/Moon/Cold (Blue), Gold/Gilt/Pale (Gold)

**Seiten & Sektionen:**
- `Hero` — Fullscreen-Video + Text-Sektion darunter, Embers, Scroll-Hint, Stats-Bar
- `Lore` — Cinema-Frame mit Video (transform.mp4.mov), Film-Streifen
- `HowToPlay` — Spielablauf mit Icons
- `DeathCards` — Totenkarten-System Erklärung
- `AppMockups` — 3-Phone Mockup mit Features
- `Testimonials` — Grimm-Cards mit Zitaten
- `RolesPreview` — Faction-Tabs (GrimmTab), Würfel-Randomizer, 12 Vorschau-Karten
- `Newsletter` — Supabase-Integration (E-Mails werden gespeichert)
- `Nav` — Sticky, Scroll-Effekt, GrimmButton, Cart-Icon mit Badge
- `Footer` — Atmosphärisch mit Diamant-Ornament
- `CountdownBanner` — Countdown bis März 2027

**Seiten (Pages):**
- `/[locale]` — Startseite (alle Sektionen)
- `/[locale]/rollen` — Alle 75+ Rollen, GrimmTab-Filter, Drawer mit Rollendaten
- `/[locale]/shop` — Produktkarten (Stripe placeholder), Merch-Teaser
- `/[locale]/shop/success` — Erfolgsseite nach Kauf
- `/[locale]/forum` — Forum-Index mit 6 Kategorie-Karten + Stats
- `/[locale]/forum/[category]` — Thread-Liste (PoE-Stil: sortierbar, Spalten)
- `/[locale]/forum/[category]/[id]` — Thread-Detail (PoE-Stil: Author-Sidebar, Replies, Likes)

**Tech-Stack:**
- Next.js 16.2.1 (App Router), React 19
- Tailwind CSS v4 (`@theme` in CSS)
- next-intl v4.8.3 (DE/EN)
- Framer Motion v12
- Supabase (verbunden, echte Keys in .env.local)
- Stripe v21 (Placeholder — noch keine echten Preise)

---

### Was noch fehlt — WEBSITE TODO

#### 🔴 Priorität 1 — Muss vor Launch fertig sein

- [ ] **Mobile Responsiveness** ← GRÖSSTE AUFGABE
  - Viele Komponenten haben feste px-Werte die auf Handys brechen
  - Forum-Tabellen kollapieren auf kleinen Screens
  - Hero Stats-Bar wird zu eng
  - GrimmButton SVG-Frame skaliert nicht gut auf <360px
  - Nav: Kein Hamburger-Menü für Mobile
  - RolesPreview: Grid zu eng auf Mobile
  - Ziel: Alles ab 375px (iPhone SE) einwandfrei nutzbar

- [ ] **Echte Videos einbinden**
  - `hero-bg.mp4` liegt im `public/videos/` Ordner — prüfen ob Qualität/Größe ok
  - `transform.mp4.mov` — prüfen ob Browser es abspielen
  - Poster-Frames (Standbilder) für Video-Fallback hinzufügen
  - Videos ggf. komprimieren (<10MB für hero, <5MB für lore)

- [ ] **Stripe vollständig einrichten** (wenn Shop live gehen soll)
  - Echte Stripe Price-IDs in `.env.local` eintragen
  - Webhook für Bestellbestätigung
  - E-Mail-Bestätigung nach Kauf
  - Checkout-Flow vollständig testen

- [ ] **Übersetzungen vervollständigen (DE/EN)**
  - `node tools/compare-i18n.js` ausführen (liegt im Spielleiter-App-Ordner)
  - Fehlende EN-Schlüssel ergänzen (Forum-Texte, neue Sektionen)
  - Alle hardcodierten deutschen Strings in Forum-Pages in i18n verschieben

#### 🟡 Priorität 2 — Wichtig für guten Eindruck

- [ ] **SEO & Meta-Tags**
  - `og:image` für Social-Media-Vorschau (1200×630px Bild erstellen)
  - `title` und `description` pro Seite individuell
  - `sitemap.xml` generieren
  - `robots.txt`
  - Favicon (Wolf-Silhouette, mehrere Größen)

- [ ] **Forum: Verbesserungen**
  - Suche / Stichwortfilter in Thread-Listen
  - Pagination (aktuell werden alle Posts geladen — bei 100+ Posts langsam)
  - Mod-Tools: Pin/Unpin direkt im UI (Passwort-geschützt)
  - "Kategorie ändern" beim Erstellen eines Threads in falscher Kategorie
  - Bild-Upload in Antworten (via Supabase Storage)

- [ ] **Rollen-Seite: Suche**
  - Suchfeld um Rollen nach Name zu filtern
  - Filterung nach Tags (Nacht-Aktion, Passive, etc.)

- [ ] **Shop-Seite: Echte Produkt-Bilder**
  - Produktfotos / Illustrations ersetzen die Icons
  - Kartenset-Preview (mockup Bild)

- [ ] **404-Seite gestalten**
  - `/not-found.tsx` mit Gothic-Design statt Standard-Next.js 404

- [ ] **Loading States**
  - Skeleton-Loader statt "Lade Thread..." Text
  - Optimistic Updates im Forum verbessern

#### 🟢 Priorität 3 — Nice to have

- [ ] **PWA (Progressive Web App)**
  - `manifest.json` mit App-Icon, Name, Farben
  - Service Worker für Offline-Zugriff auf Rollen-Seite
  - "Zur Startseite hinzufügen" Prompt

- [ ] **Performance**
  - `next/image` für alle Bilder einsetzen
  - Fonts lokal hosten statt Google Fonts (schneller)
  - Bundle-Analyse (`next build --profile`)

- [ ] **Animationen verfeinern**
  - Parallax-Effekt im Hero (Tiefe)
  - Rollen-Karten 3D-Flip auf Hover
  - Page-Transitions zwischen Routen

- [ ] **CountdownBanner aufwerten**
  - Aktuell sehr schlicht — mehr Gothic-Atmosphäre
  - Anzeige ab wann Kickstarter live geht

- [ ] **App-Mockups mit echten Screenshots**
  - Screenshots der echten Spielleiter-App einbinden
  - Nicht generische Platzhalter

---

## PRODUKT 2 — Spielleiter-App (`index.html`, `game.html`, `setup.html`)

### Was bereits fertig ist ✅
- 75+ Rollen implementiert und spielbar
- Automatische Nachtphasen-Reihenfolge
- Totenkarten-System (Post-Tod-Buffs)
- Spielkreis-Visualisierung (SVG)
- Mehrsprachig (DE/EN) via `i18n.js`
- PWA-fähig
- Audio-System (Rollen-Sounds, Nachtmusik)
- Spielprotokoll (Gamelog)

### Was noch fehlt — APP TODO

#### 🔴 Priorität 1
- [ ] **Mobile-Ansicht reparieren**
  - Auf kleinen Displays (< 600px) wird kein Spielkreis angezeigt
  - Portrait-Modus unterstützen (aktuell nur Landscape)
  - Touch-freundlichere Buttons

- [ ] **10 Kickstarter-Rollen implementieren**
  - Custom Rollen für die 10 höchsten Kickstarter-Spender
  - In `roles.js`, `abilities.js`, `night.js` einpflegen
  - Sind noch nicht definiert — müssen konzipiert werden

- [x] **Vollständiger Bug-Fix-Durchlauf (Mai 2026)**
  - Lone Wolf i18n (EN), SOLO-Set komplett, once-Reset, getFaction, Undo-Tooltip, localStorage try/catch, Viewport-Meta, Schwarze Witwe/Loki-Validierung, cards.js Rechtschreibung, i18n Leerzeichen, Gamelog Zeitstempel

#### 🟡 Priorität 2
- [ ] **Asset-Ordner bereinigen**
  - Doppelte Ordner: `/icons` + `/assets/icons` → zusammenführen
  - Doppelte Ordner: `/Sounds` + `/assets/sounds` → zusammenführen

- [ ] **`abilities.js` refactoren**
  - Aktuell ~1150 Zeilen → in Module aufteilen
  - Macht spätere App-Portierung einfacher

- [ ] **Letzte Polishing-Runde**
  - Spielleitungs-Erfahrung komplett durchspielen (Anfang bis Sieg)
  - Alle Rollen einmal testen

#### 🟢 Priorität 3
- [ ] **Capacitor-Wrapper (Mobile App)**
  - iOS App Store + Google Play
  - Tablet-Layout optimieren (Klassenzimmer-Nutzung)

- [ ] **Tauri oder Electron (Desktop)**
  - Windows/macOS/Linux
  - Steam-Veröffentlichung vorbereiten

---

## PRODUKT 3 — Kickstarter + Physisches Kartenset

### Was noch fehlt
- [ ] **Kartendesign finalisieren**
  - Karten werden mit ChatGPT + Gemini generiert (nicht Claude)
  - Print-Format festlegen (Standardgröße Pokémon-Karten: 63×88mm?)
  - Druckpartner finden

- [ ] **Kickstarter-Kampagne vorbereiten**
  - Kampagnen-Seite schreiben (Texte, Bilder, Video)
  - Reward-Tiers definieren
  - Funding-Ziel berechnen
  - Pre-Launch-Seite ist bereits aktiv

- [ ] **Kickstarter-Video**
  - Gameplay-Video aufnehmen (echte Runde zeigen)
  - Professionell schneiden

- [ ] **10 Custom-Rollen für Top-Spender**
  - Konzept entwickeln
  - In App + auf Karten implementieren

---

## Technologie-Entscheidungen (bereits getroffen)

| Was | Entscheidung |
|---|---|
| Frontend Framework | Next.js (App Router) |
| Styling | Tailwind CSS v4 |
| Datenbank | Supabase (PostgreSQL) |
| Payments | Stripe |
| Animations | Framer Motion |
| Icons | Lucide React |
| i18n | next-intl (DE/EN) |
| Mobile App | Capacitor (später) |
| Desktop App | Tauri (später) |

---

## Supabase — Tabellen die existieren (müssen)

```sql
-- Newsletter-Abonnenten
newsletter_subscribers (id, email, lang, created_at)

-- Forum-Posts (Threads)
forum_posts (id, author_name, author_avatar, title, content,
             tag, category, pinned, likes, replies, views, created_at)

-- Forum-Antworten
forum_replies (id, post_id, author_name, content, likes, created_at)
```

**Forum-Kategorien** (code-seitig in `src/lib/forum-config.ts` definiert):
`ankuendigungen` | `general` | `strategie` | `rollen` | `lore` | `support`

---

## Empfohlene nächste Schritte (in dieser Reihenfolge)

1. **Mobile-Responsiveness der Website** — größter einzelner Aufwand, früh angehen
2. **Videos prüfen** — ohne funktionierende Videos sieht die Seite leer aus
3. **SEO / Meta-Tags** — kleine Aufgabe, großer Effekt für den Launch
4. **Forum-Pagination** — damit das Forum bei echten Usern nicht langsam wird
5. **Rollen-Seite: Suchfeld** — User mit 75+ Rollen brauchen Suche
6. **Spielleiter-App Bug-Fix-Runde** — damit das Kernprodukt stabil ist
7. **10 Kickstarter-Rollen konzipieren + implementieren**
8. **Kickstarter-Kampagne vorbereiten**
