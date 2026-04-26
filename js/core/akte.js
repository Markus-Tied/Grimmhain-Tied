// ==========================================================
// GRIMMHAIN — AKTE (Skripte mit kuratierten Rollen-Sets)
// 72/72 Rollen vollständig abgedeckt über alle 4 Akte
// ==========================================================

const AKTE = {
  akt1: {
    id: "akt1",
    name_de: "Akt I — Howl of the Hollow",
    name_en: "Act I — Howl of the Hollow",
    subtitle_de: "Klassisches Werwolf · Einsteiger",
    subtitle_en: "Classic Werewolf · Beginner",
    schwierigkeit: 1,
    rollen: [
      // DORF (12)
      "Dorfbewohner", "Die Gebundenen", "Der Weise", "Sensenträger",
      "Loki", "Ritter", "Schutzengel", "Spürhund", "Waldhexe",
      "Wolfskind", "Das Orakel", "Nachtwächter",
      // WOLF (3)
      "Werwolf", "König Lykaon", "Rachsüchtiger Wolf",
      // SOLO (2)
      "Selbstmörder", "Rattenfänger"
    ]
  },
  akt2: {
    id: "akt2",
    name_de: "Akt II — Veins of the Old Forest",
    name_en: "Act II — Veins of the Old Forest",
    subtitle_de: "Blut, Flüche, Verwandlung · Fortgeschritten",
    subtitle_en: "Blood, Curses, Transformation · Advanced",
    schwierigkeit: 2,
    rollen: [
      // DORF (15)
      "Dorfbewohner", "Blutpriester", "Waldhexe", "Seelentauscher",
      "Verdammniswächter", "Korrupter Richter", "Kutscher",
      "Dr. Victor Frankenstein", "Die Ewigen", "Schutzgeist",
      "Märtyrerin", "Lehrling", "Loki", "Sensenträger", "Der Weise",
      // WOLF (7)
      "Werwolf", "Rachsüchtiger Wolf", "Blutwolf", "Dämonischer Wolf", "Giftwolf",
      "Rudelvater", "Schattenwanderer",
      // SOLO (5)
      "Pestbringerin", "Voodoo-Priester", "Todesprediger",
      "Nekromant", "Grabräuber"
    ]
  },
  akt3: {
    id: "akt3",
    name_de: "Akt III — The Looking-Glass Choir",
    name_en: "Act III — The Looking-Glass Choir",
    subtitle_de: "Spiegel, Trugbilder, Wahnsinn · Komplex",
    subtitle_en: "Mirrors, Illusions, Madness · Complex",
    schwierigkeit: 3,
    rollen: [
      // DORF (14)
      "Dorfbewohner", "Detektiv", "Traumdeuter", "Dorfchronistin",
      "Fährtenleser", "Zeitwächter", "Wahnsinniger Kutscher",
      "Rotkäppchen", "Henker", "König", "Lehrling",
      "Loki", "Sensenträger", "Der Weise",
      // WOLF (7)
      "Werwolf", "Rachsüchtiger Wolf", "Trugbilderwolf", "Spiegelwolf", "Albtraumwolf",
      "Besessener Wolf", "Schattenhund",
      // SOLO (5)
      "Manipulator", "Parasit", "Doppelspion",
      "Prophet des Untergangs", "Kartenschlucker"
    ]
  },
  akt4: {
    id: "akt4",
    name_de: "Akt IV — Ash Crown of Grimmhain",
    name_en: "Act IV — Ash Crown of Grimmhain",
    subtitle_de: "Götter, Höllenhunde, Mythos · Experte",
    subtitle_en: "Gods, Hellhounds, Myth · Expert",
    schwierigkeit: 4,
    rollen: [
      // DORF (14)
      "Dorfbewohner", "Amalia", "Doktor", "Dorfschmied", "Dorfwache",
      "Kopfgeldjäger", "Kriegerin des Lichts", "Waldläufer",
      "Wächter am Tor", "König", "Verdammniswächter",
      "Loki", "Sensenträger", "Der Weise",
      // WOLF (9)
      "Werwolf", "Rachsüchtiger Wolf", "Fenrir", "Cerberus", "Schwarze Witwe",
      "Schicksalswolf", "Seuchenwolf", "Siegreicher Wolf", "Albtraumwolf",
      // SOLO (4)
      "Hades", "Feuerteufel", "Kartenschlucker", "Prophet des Untergangs"
    ]
  },
  custom: {
    id: "custom",
    name_de: "Custom — Alle Rollen",
    name_en: "Custom — All Roles",
    subtitle_de: "Freies Setup · Alle 72 Rollen",
    subtitle_en: "Free Setup · All 72 Roles",
    schwierigkeit: 0,
    rollen: null  // null = alle Rollen erlaubt
  }
};

// Helper: Liefert die erlaubten Rollen für aktuellen Akt
// Wenn custom → ALLE Rollen aus ALL_ROLES
function getAktRollen(aktId) {
  const akt = AKTE[aktId] || AKTE.akt1;
  if (akt.rollen === null) {
    return [...ALL_ROLES]; // alle 72
  }
  return [...akt.rollen];
}

// Helper: Lokalisierter Akt-Name
function getAktName(aktId, lang = "de") {
  const akt = AKTE[aktId] || AKTE.akt1;
  return lang === "en" ? akt.name_en : akt.name_de;
}

function getAktSubtitle(aktId, lang = "de") {
  const akt = AKTE[aktId] || AKTE.akt1;
  return lang === "en" ? akt.subtitle_en : akt.subtitle_de;
}

// ==========================================================
// VALIDIERUNG: Beim Laden prüfen ob alle Akt-Rollen
// auch in ALL_ROLES (roles.js) existieren
// ==========================================================
(function validateAkte() {
  if (typeof ALL_ROLES === "undefined") {
    console.warn("[akte.js] ALL_ROLES nicht geladen — Validierung übersprungen.");
    return;
  }
  const allSet = new Set(ALL_ROLES);
  let problems = 0;
  for (const [aktId, akt] of Object.entries(AKTE)) {
    if (akt.rollen === null) continue;
    for (const r of akt.rollen) {
      if (!allSet.has(r)) {
        console.warn(`[akte.js] Akt "${aktId}": Rolle "${r}" existiert nicht in ALL_ROLES!`);
        problems++;
      }
    }
  }
  if (problems === 0) {
    console.log("[akte.js] ✓ Alle Akt-Rollen validiert (4 Akte + Custom)");
  } else {
    console.error(`[akte.js] ✗ ${problems} ungültige Rollen-Referenzen gefunden`);
  }
})();
