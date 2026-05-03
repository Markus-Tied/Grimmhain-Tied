// === Totenkarten – Kartendaten ======================================
const TOTENKARTEN = {
  // ══════════════════════════════════════
  // SEGEN — Buff für dein ehemaliges Team
  // ══════════════════════════════════════
  segen: [
    {
      id: "segen_01",
      kategorie: "SEGEN",
      name: "Heilende Hand",
      wolf: "Das nächste Mal wenn ein Werwolf sterben würde stirbt stattdessen ein zufälliger Dorfbewohner.",
      dorf: "Das nächste Mal wenn ein Werwolf einen Dorfbewohner reißen würde überlebt er und erhält ein einmaliges Schutzschild."
    },
    {
      id: "segen_02",
      kategorie: "SEGEN",
      name: "Flüsterwind",
      wolf: "Ein Werwolf deiner Wahl darf dem Spielleiter heute öffentlich eine Ja/Nein Frage über einen Dorfbewohner stellen.",
      dorf: "Ein Dorfbewohner deiner Wahl darf dem Spielleiter heute öffentlich eine Ja/Nein Frage über einen Mitspieler stellen."
    },
    {
      id: "segen_03",
      kategorie: "SEGEN",
      name: "Wachsame Augen",
      wolf: "Die Wölfe erfahren heute Nacht die Rolle ihres gewählten Opfers bevor sie es reißen — und dürfen das Ziel danach noch wechseln.",
      dorf: "Vor der Lynchung wird das aktuelle Opfer dem Dorf enthüllt — das Dorf entscheidet ob die Lynchung vollzogen wird oder nicht."
    },
    {
      id: "segen_04",
      kategorie: "SEGEN",
      name: "Stille Nacht",
      wolf: "Die Wölfe dürfen heute Nacht zusätzlich zu ihrem normalen Opfer ein zweites Ziel reißen.",
      dorf: "Die Wölfe dürfen heute Nacht kein Opfer wählen — sie schlafen."
    },
    {
      id: "segen_05",
      kategorie: "SEGEN",
      name: "Wahre Stimme",
      wolf: "Ein Werwolf deiner Wahl erhält beim heutigen Lynch doppelte Stimmkraft.",
      dorf: "Ein Dorfbewohner deiner Wahl erhält beim heutigen Lynch doppelte Stimmkraft."
    },
    {
      id: "segen_06",
      kategorie: "SEGEN",
      name: "Schattenmantel",
      wolf: "Das nächste Mal wenn ein Werwolf vom Orakel gesehen werden würde wird er ihr als eine zufällige noch lebende Dorfbewohnerrolle angezeigt.",
      dorf: "Die Wölfe werden die folgende Nacht geblendet — ein zufälliges Opfer stirbt, es könnte auch ein Werwolf selbst sein."
    },
    {
      id: "segen_07",
      kategorie: "SEGEN",
      name: "Blutpakt",
      wolf: "Die nächste Sonderfähigkeit die einen Werwolf töten würde wird negiert.",
      dorf: "Basierend auf dem Charakter des nächsten nächtlichen Opfers deckt der Spielleiter 0 bis 2 Werwölfe auf."
    },
    {
      id: "segen_08",
      kategorie: "SEGEN",
      name: "Zweites Leben",
      wolf: "Ein toter Werwolf deiner Wahl kehrt als vollwertiger Werwolf mit seiner ursprünglichen Rolle zurück.",
      dorf: "Ein toter Dorfbewohner deiner Wahl kehrt als vollwertiger Dorfbewohner mit seiner ursprünglichen Rolle zurück.",
      deathCardRequirements: { requiresAnyLivingRoleTag: ["revive", "role-return", "death-trigger-transform"] }
    },
    {
      id: "segen_09",
      kategorie: "SEGEN",
      name: "Gerechter Zorn",
      wolf: "Wird beim nächsten Lynch ein Werwolf gelyncht dürfen die Wölfe in dieser Nacht zwei Opfer reißen statt einem.",
      dorf: "Sollte beim nächsten Lynch ein Dorfbewohner gelyncht werden wird er automatisch befreit und der Tag endet ohne Opfer."
    },
    {
      id: "segen_10",
      kategorie: "SEGEN",
      name: "Totenurteil",
      wolf: "Die toten Werwölfe stimmen heimlich ab — ein Dorfbewohner ihrer Wahl stirbt noch in dieser Nacht.",
      dorf: "Die toten Dorfbewohner stimmen heimlich ab — ein Werwolf ihrer Wahl stirbt noch in dieser Nacht."
    },
    {
      id: "segen_11",
      kategorie: "SEGEN",
      name: "Spiegelschutz",
      wolf: "Sollte am nächsten Tag ein Wolf gelyncht werden stirbt stattdessen derjenige der die Nominierung ausgesprochen hat.",
      dorf: "Sollten die Werwölfe in der Folgenacht einen Dorfbewohner erwischen stirbt stattdessen einer von ihnen."
    },
    {
      id: "segen_12",
      kategorie: "SEGEN",
      name: "Geisterhand",
      wolf: "Ein von dir ausgewählter Spieler erhält zusätzlich für die nächste Nacht die Fähigkeit des zuletzt verstorbenen Werwolfs.",
      dorf: "Ein von dir ausgewählter Spieler erhält zusätzlich für die nächste Nacht die Fähigkeit des zuletzt verstorbenen Dorfbewohners."
    },
    {
      id: "segen_13",
      kategorie: "SEGEN",
      name: "Schattenvorteil",
      wolf: "In der Folgenacht missglückt die erste Fähigkeit die einen Wolf trifft.",
      dorf: "Die Werwölfe werden in der Folgenacht als erstes geweckt und ihr Opfer wird laut nach der Einigung angesagt."
    },
    {
      id: "segen_14",
      kategorie: "SEGEN",
      name: "Eiserner Wille",
      wolf: "Erhalte Einsicht ins Spiel und wähle einen Spieler aus der seine Fähigkeit entweder erneut oder zweimal einsetzen darf in der Folgenacht.",
      dorf: "Erhalte Einsicht ins Spiel und wähle einen Spieler aus der seine Fähigkeit entweder erneut oder zweimal einsetzen darf in der Folgenacht."
    },
  ],

  // ══════════════════════════════════════
  // SCHICKSAL — Betrifft alle Spieler
  // ══════════════════════════════════════
  schicksal: [
    {
      id: "schicksal_01",
      kategorie: "SCHICKSAL",
      name: "Nebelhorn",
      neutral: "Niemand darf in der nächsten Tagesphase über Rollen sprechen — nur über Verhalten und Beobachtungen. Wer es tut scheidet sofort aus der Diskussion aus."
    },
    {
      id: "schicksal_02",
      kategorie: "SCHICKSAL",
      name: "Offene Bücher",
      neutral: "Jeder lebende Spieler muss öffentlich sagen ob er heute Nacht eine Fähigkeit genutzt hat — lügen erlaubt. Reihenfolge bestimmt der Spielleiter."
    },
    {
      id: "schicksal_03",
      kategorie: "SCHICKSAL",
      name: "Amnestie",
      neutral: "Die aktuelle Lynchung wird sofort abgebrochen. Alle Stimmen verfallen. Kein neuer Lynch heute — direkt in die Nacht."
    },
    {
      id: "schicksal_04",
      kategorie: "SCHICKSAL",
      name: "Großes Schweigen",
      neutral: "Die gesamte nächste Tagesphase dauert exakt 2 Minuten. Danach wird sofort abgestimmt — ohne weitere Diskussion."
    },
    {
      id: "schicksal_05",
      kategorie: "SCHICKSAL",
      name: "Spiegel",
      neutral: "Alle Spieler zeigen nach einem 5-Sekunden-Countdown gleichzeitig auf einen Spieler. Wer keine einzige Stimme erhält stirbt sofort."
    },
    {
      id: "schicksal_06",
      kategorie: "SCHICKSAL",
      name: "Zeitsprung",
      neutral: "Diese Nacht wird vollständig übersprungen — keine Fähigkeiten, kein Wolf-Angriff, kein Tod. Direkt zum nächsten Tag."
    },
    {
      id: "schicksal_07",
      kategorie: "SCHICKSAL",
      name: "Gleichgewicht",
      neutral: "Der Spielleiter beobachtet den aktuellen Spielstand verkündet laut wer vorne liegt und blockiert die erste aktive gewählte Fähigkeit zu Gunsten des verlierenden Teams."
    },
    {
      id: "schicksal_08",
      kategorie: "SCHICKSAL",
      name: "Neu Anfang",
      neutral: "Zwei ausgewählte lebende Spieler erhalten eine neue Rolle innerhalb ihrer Fraktion — der Spielleiter informiert beide still."
    },
    {
      id: "schicksal_09",
      kategorie: "SCHICKSAL",
      name: "Stimmentausch",
      neutral: "Beim nächsten Lynch zählt jede Stimme für den Spieler links daneben statt für den Nominierten."
    },
    {
      id: "schicksal_10",
      kategorie: "SCHICKSAL",
      name: "Anarchie",
      neutral: "In der kommenden Nacht wird eine zufällige bereits verbrauchte Einmalfähigkeit eines lebenden Spielers deiner Fraktion wieder verfügbar."
    },
    {
      id: "schicksal_11",
      kategorie: "SCHICKSAL",
      name: "Kettenreaktion",
      neutral: "Stirbt jemand durch Lynch, stirbt auch der Spieler mit den zweitmeisten Stimmen sofort — ohne weitere Abstimmung."
    },
    {
      id: "schicksal_12",
      kategorie: "SCHICKSAL",
      name: "Totengericht",
      neutral: "Der nächste Tag wird von den Toten geleitet — nur tote Spieler dürfen nominieren und abstimmen. Lebende Spieler hören schweigend zu."
    },
    {
      id: "schicksal_13",
      kategorie: "SCHICKSAL",
      name: "Stille Wahl",
      neutral: "Heute findet keine Diskussion statt — lediglich Nominierung und sofortige Abstimmung. Kein Spieler darf zuvor das Wort ergreifen."
    },
    {
      id: "schicksal_14",
      kategorie: "SCHICKSAL",
      name: "Richterstuhl",
      neutral: "Das Dorf wählt sofort einen temporären Richter — exakt wie die Bürgermeisterwahl. Dieser Richter allein verhängt das Urteil des Tages."
    },
  ],

  // ══════════════════════════════════════
  // FLUCH — Schadet deinem ehemaligen Team
  // ══════════════════════════════════════
  fluch: [
    {
      id: "fluch_01",
      kategorie: "FLUCH",
      name: "Blinder Fleck",
      wolf: "Ein zufälliger Werwolf verliert diese Nacht seine Sonderfähigkeit — nur der Wolf-Angriff bleibt.",
      dorf: "Ein zufälliger Dorfbewohner verliert diese Nacht seine Sonderfähigkeit."
    },
    {
      id: "fluch_02",
      kategorie: "FLUCH",
      name: "Falsche Fährte",
      wolf: "Der Spielleiter lenkt den Werwolf-Angriff diese Nacht auf ein Ziel seiner Wahl um.",
      dorf: "Der Spielleiter gibt einem Dorfbewohner seiner Wahl heute Nacht eine falsche Information."
    },
    {
      id: "fluch_03",
      kategorie: "FLUCH",
      name: "Lähmung",
      wolf: "Ein zufälliger Werwolf darf beim nächsten Lynch nicht abstimmen.",
      dorf: "Ein zufälliger Dorfbewohner darf beim nächsten Lynch nicht abstimmen."
    },
    {
      id: "fluch_04",
      kategorie: "FLUCH",
      name: "Verrat",
      wolf: "Die Wölfe müssen heute Nacht zwingend einen ihrer eigenen fressen — kein Dorfbewohner kann heute sterben.",
      dorf: "Es wird heute solange gelyncht bis ein Mitglied der Dorf-Fraktion getroffen wurde."
    },
    {
      id: "fluch_05",
      kategorie: "FLUCH",
      name: "Gebrochener Schild",
      wolf: "Alle aktiven Schutz-Effekte auf Werwölfen werden für 1 bis 3 Tage aufgehoben — der Spielleiter entscheidet die Dauer.",
      dorf: "Alle aktiven Schutz-Effekte auf Dorfbewohnern werden für 1 bis 3 Tage aufgehoben — der Spielleiter entscheidet die Dauer."
    },
    {
      id: "fluch_06",
      kategorie: "FLUCH",
      name: "Schwarzes Mal",
      wolf: "Der Spielleiter offenbart die Rolle eines Werwolfs seiner Wahl öffentlich dem Dorf.",
      dorf: "Der Spielleiter offenbart die Rolle eines Dorfbewohners seiner Wahl öffentlich dem Dorf."
    },
    {
      id: "fluch_07",
      kategorie: "FLUCH",
      name: "Alptraum",
      wolf: "Die Wölfe schlafen so schlecht dass sie heute Nacht kein Opfer reißen können.",
      dorf: "Ein zufälliger Dorfbewohner wird dem Dorf als verdächtig angezeigt — der Spielleiter gibt es öffentlich bekannt."
    },
    {
      id: "fluch_08",
      kategorie: "FLUCH",
      name: "Kettenfluch",
      wolf: "Stirbt heute Nacht ein Werwolf durch eine Sonderfähigkeit stirbt der Werwolf rechts von ihm mit.",
      dorf: "Stirbt heute Nacht ein Dorfbewohner durch die Wölfe stirbt der Dorfbewohner links von ihm mit."
    },
    {
      id: "fluch_09",
      kategorie: "FLUCH",
      name: "Verlorene Stimme",
      wolf: "Die Werwölfe verlieren beim nächsten Lynch die Wertigkeit ihrer Stimmen — der Spielleiter hält die Anzahl geheim, offenbart jedoch wer das Opfer ist.",
      dorf: "Die Dorfbewohner verlieren beim nächsten Lynch die Wertigkeit ihrer Stimmen — der Spielleiter hält die Anzahl geheim, offenbart jedoch wer das Opfer ist."
    },
    {
      id: "fluch_10",
      kategorie: "FLUCH",
      name: "Schlechtes Omen",
      wolf: "Sollten die Wölfe heute Nacht keine starke Rolle erwischen entscheidet der Spielleiter ob einer von ihnen stirbt.",
      dorf: "Sollte heute kein Werwolf gelyncht werden stirbt ein weiterer zufälliger Dorfbewohner noch am selben Tag."
    },
    {
      id: "fluch_11",
      kategorie: "FLUCH",
      name: "Rabe des Unheils",
      wolf: "Du musst einen Wolf deiner Wahl dem Dorf öffentlich enthüllen.",
      dorf: "Du musst einen Dorfbewohner deiner Wahl dem Dorf öffentlich enthüllen."
    },
    {
      id: "fluch_12",
      kategorie: "FLUCH",
      name: "Doppeltes Leid",
      wolf: "Stirbt als nächstes ein Wolf stirbt automatisch ein weiterer zufälliger Wolf mit ihm.",
      dorf: "Stirbt als nächstes ein Dorfbewohner stirbt automatisch ein weiterer zufälliger Dorfbewohner mit ihm."
    },
    {
      id: "fluch_13",
      kategorie: "FLUCH",
      name: "Lähmungswelle",
      wolf: "Alle Wölfe können beim nächsten Lynch nicht abstimmen.",
      dorf: "Alle Dorfbewohner mit einer aktiven Fähigkeit können beim nächsten Lynch nicht abstimmen."
    },
  ],

  // ══════════════════════════════════════
  // WENDE — Nur aktiv bei 4:1 Verhältnis
  // ══════════════════════════════════════
  wende: [
    {
      id: "wende_01",
      kategorie: "WENDE",
      name: "Letzter Atemzug",
      wolf: "Ein Werwolf deiner Wahl darf seine bereits genutzte Fähigkeit diese Nacht erneut einsetzen.",
      dorf: "Ein Dorfbewohner deiner Wahl darf seine bereits genutzte Fähigkeit diese Nacht erneut einsetzen."
    },
    {
      id: "wende_02",
      kategorie: "WENDE",
      name: "Verzweiflungsschrei",
      wolf: "Ein Werwolf deiner Wahl kann die nächsten 2 Tage nicht gelyncht werden.",
      dorf: "Ein Dorfbewohner deiner Wahl erhält 3 Tage lang einen Schutz gegen Werwolf-Angriffe."
    },
    {
      id: "wende_03",
      kategorie: "WENDE",
      name: "Wendepunkt",
      wolf: "Die Wölfe dürfen diese Nacht zwei Opfer reißen statt einem.",
      dorf: "Das Dorf darf heute lynchen — trifft die Lynchung einen Dorfbewohner schreitet der Spielleiter ein und verhindert sie. Trifft sie einen Werwolf wird vollstreckt."
    },
    {
      id: "wende_04",
      kategorie: "WENDE",
      name: "Wiedergeburt",
      wolf: "Der Spielleiter wählt nach eigenem Ermessen einen toten Werwolf — er kehrt mit seiner ursprünglichen Fähigkeit zurück.",
      dorf: "Der Spielleiter wählt nach eigenem Ermessen einen toten Dorfbewohner — er kehrt mit seiner ursprünglichen Fähigkeit zurück.",
      deathCardRequirements: { requiresAnyLivingRoleTag: ["revive", "role-return", "death-trigger-transform"] }
    },
    {
      id: "wende_05",
      kategorie: "WENDE",
      name: "Notanker",
      wolf: "Die Wölfe dürfen den nächsten Tod in den eigenen Reihen einmalig auf den übernächsten Tag verschieben — der Spielleiter vollstreckt ihn dann automatisch.",
      dorf: "Das Dorf darf den nächsten Tod in den eigenen Reihen einmalig auf den übernächsten Tag verschieben — der Spielleiter vollstreckt ihn dann automatisch."
    },
    {
      id: "wende_06",
      kategorie: "WENDE",
      name: "Trotz",
      wolf: "Die Wölfe sind diese Nacht komplett geschützt — keine Sonderfähigkeit kann heute einen Wolf töten.",
      dorf: "Das Dorf ist diese Nacht komplett geschützt — die Wölfe können heute Nacht kein Opfer reißen."
    },
    {
      id: "wende_07",
      kategorie: "WENDE",
      name: "Befreiung",
      wolf: "Ein toter Werwolf kehrt mit halber Fähigkeit zurück — er darf sie einmalig einsetzen dann stirbt er erneut.",
      dorf: "Ein toter Dorfbewohner kehrt mit halber Fähigkeit zurück — er darf sie einmalig einsetzen dann stirbt er erneut.",
      deathCardRequirements: { requiresAnyLivingRoleTag: ["revive", "role-return", "death-trigger-transform"] }
    },
    {
      id: "wende_08",
      kategorie: "WENDE",
      name: "Auserwählt",
      wolf: "Der Spielleiter wählt nach bestem Gewissen einen Werwolf — dieser darf seine Fähigkeit in der nächsten Nacht zweimal einsetzen.",
      dorf: "Der Spielleiter wählt nach bestem Gewissen einen Dorfbewohner — dieser darf seine Fähigkeit in der nächsten Nacht zweimal einsetzen."
    },
    {
      id: "wende_09",
      kategorie: "WENDE",
      name: "Rückenwind",
      wolf: "Alle Wolf-Stimmen beim nächsten Lynch werden verdoppelt — der Spielleiter hält die Gesamtmenge an Stimmen geheim, offenbart jedoch wer das Opfer ist.",
      dorf: "Alle Dorf-Stimmen beim nächsten Lynch werden verdoppelt — der Spielleiter hält die Gesamtmenge an Stimmen geheim, offenbart jedoch wer das Opfer ist."
    },
    {
      id: "wende_10",
      kategorie: "WENDE",
      name: "Schicksalsumkehr",
      wolf: "Die stärkste aktive Schutzfähigkeit eines Dorfbewohners wird für eine Nacht deaktiviert — der Spielleiter wählt welche.",
      dorf: "Die stärkste aktive Fähigkeit eines Werwolfs wird für eine Nacht deaktiviert — der Spielleiter wählt welche."
    },
    {
      id: "wende_11",
      kategorie: "WENDE",
      name: "Schicksalswende",
      wolf: "König Lykaon erwacht in dir — verleihe einem Wolf deiner Wahl die Fähigkeit einen Spieler in einen Trugbildwolf zu verwandeln.",
      dorf: "Sollte der nächste Lynch einen Dorfbewohner treffen wird das Urteil auf einen zufälligen Wolf umgeleitet."
    },
    {
      id: "wende_12",
      kategorie: "WENDE",
      name: "Geheimrat",
      wolf: "Die Werwölfe werden in dieser Nacht als letztes aufgerufen — du darfst für diese Nacht die Augen öffnen und ihnen Hinweise geben.",
      dorf: "Du darfst dem Spielleiter eine Frage stellen die er wahrheitsgemäß beantworten muss. (Nur in Spielen mit Wiederbelebungs-Szenarien)"
    },
  ],

  // ══════════════════════════════════════
  // LOKI — Reines Chaos
  // ══════════════════════════════════════
  loki: [
    {
      id: "loki_01",
      kategorie: "LOKI",
      name: "Spiegelwelt",
      neutral: "Alle Lynch-Stimmen heute zählen für den Spieler links daneben statt für den Nominierten. Niemand weiß wer wirklich stirbt bis der Spielleiter es verkündet."
    },
    {
      id: "loki_02",
      kategorie: "LOKI",
      name: "Stille Abstimmung",
      neutral: "Der Tag wird auf 60 Sekunden verkürzt. Gibt es nicht mindestens 3 Nominierungen sterben 1-5 zufällige Spieler. Wird die Nominierung und Lynchung nicht innerhalb der 60 Sekunden abgeschlossen sterben alle 3 Nominierten."
    },
    {
      id: "loki_03",
      kategorie: "LOKI",
      name: "Zeitwarp",
      neutral: "Diese Nacht wird übersprungen. Alle Nacht-Fähigkeiten verfallen — kein Tod, kein Angriff, kein Schutz. Direkt zum nächsten Tag."
    },
    {
      id: "loki_04",
      kategorie: "LOKI",
      name: "Doppelgänger",
      neutral: "Der Spielleiter markiert heimlich einen zufälligen Spieler als verdächtig — alle sehen den Marker, niemand weiß warum. Ob er wirklich ein Wolf ist bleibt offen."
    },
    {
      id: "loki_05",
      kategorie: "LOKI",
      name: "Totenerwachen",
      neutral: "Alle Toten zeigen gleichzeitig auf einen lebenden Spieler — der meistgenannte stirbt sofort. Bei Gleichstand sterben beide."
    },
    {
      id: "loki_06",
      kategorie: "LOKI",
      name: "Rollenroulette",
      neutral: "Der Spielleiter tauscht die Rollen zweier zufälliger lebender Spieler beide gehören der selben Fraktion an — beide werden still informiert."
    },
    {
      id: "loki_07",
      kategorie: "LOKI",
      name: "Anarchie",
      neutral: "Alle aktiven Schutz-Effekte aller Spieler werden sofort aufgehoben. Alle bereits genutzten Einmal-Fähigkeiten kehren für alle zurück."
    },
    {
      id: "loki_08",
      kategorie: "LOKI",
      name: "Verhexte Nacht",
      neutral: "Der Spielleiter entscheidet ob deine nächtliche Fähigkeit durchgeht oder ein anderes Ziel trifft — auch du selbst. Überlege weise ob du deine Fähigkeit diese Nacht überhaupt einsetzen willst."
    },
    {
      id: "loki_09",
      kategorie: "LOKI",
      name: "Puppenspieler",
      neutral: "Der Spielleiter Nominiert am nächsten Tag 5 Spieler es ist mindestens einer aus jeder Fraktion darunter."
    },
    {
      id: "loki_10",
      kategorie: "LOKI",
      name: "Phoenix",
      neutral: "Es werden zwei Würfel gewürfelt, der erste belebt Entsprechend viele zufällige Spieler wieder, der zweite entscheidet für wieviele runden sie am leben bleiben.",
      deathCardRequirements: { requiresAnyLivingRoleTag: ["revive", "role-return", "death-trigger-transform"] }
    },
    {
      id: "loki_11",
      kategorie: "LOKI",
      name: "Stummfilm",
      neutral: "Heute darf niemand sprechen — nur Handzeichen und Mimik erlaubt. Wer auch nur ein Wort spricht stirbt sofort."
    },
    {
      id: "loki_12",
      kategorie: "LOKI",
      name: "Kosmisches Gleichgewicht",
      neutral: "Stirbt heute ein Wolf stirbt auch ein Dorfbewohner. Stirbt ein Dorfbewohner stirbt auch ein Wolf. Der Spielleiter entscheidet die Opfer nach Rollenstärke."
    },
    {
      id: "loki_13",
      kategorie: "LOKI",
      name: "Verhexte Lynch",
      neutral: "Beim heutigen Lynch stirbt der Spieler mit den wenigsten Stimmen — nicht der mit den meisten."
    },
  ],

  // ══════════════════════════════════════
  // SOLO — Nur für Solo-Spieler beim Tod
  // ══════════════════════════════════════
  solo: [
    {
      id: "solo_01",
      kategorie: "SOLO",
      name: "Todesprojektion",
      solo: "Schreibe auf einen Zettel einen Spieler und gebe sie dem Spielleiter, sollte dieser Spieler bei der nächsten Lynchung sterben nimmst du seine Rolle & Fraktion an und nimmst wieder am spielgeschehen teil."
    },
    {
      id: "solo_02",
      kategorie: "SOLO",
      name: "Schwarze Prophezeiung",
      solo: "Du tippt dem SL geheim welches Team das Spiel gewinnt. Liegt du richtig wirst du am Spielende als stiller Mitsieger anerkannt."
    },
    {
      id: "solo_03",
      kategorie: "SOLO",
      name: "Racheschwur",
      solo: "Der Spieler der dich zuletzt nominiert hat (oder dich nachts angegriffen hat) erhält dauerhaft +3 Startstimmen gegen sich bei jedem zukünftigen Lynch. Der Fluch endet erst wenn er stirbt."
    },
    {
      id: "solo_04",
      kategorie: "SOLO",
      name: "Apokalyptischer Abgang",
      solo: "Wähle 2 lebende Spieler. Sie sind ab sofort durch ein Todesband verbunden: Stirbt einer in den nächsten 4 Nächten stirbt der andere am selben Abend sofort nach."
    },
    {
      id: "solo_05",
      kategorie: "SOLO",
      name: "Vermächtnis der Einsamkeit",
      solo: "Wähle einen lebenden Spieler. Er erbt deine Fähigkeit und deine Siegbedingung zusätzlich, sollte dieser unter den Gewinnern sein gewinnst du mit."
    },
    {
      id: "solo_06",
      kategorie: "SOLO",
      name: "Geisterstimme",
      solo: "Du agierst ab sofort vom Totenreich aus — du darfst in den folgenden drei Tagen Nominieren und mit Abstimmen, dazu zählt deine Stimme Doppelt, sollte es dir gelingen dadurch jemanden zu Lynchen wirst du mit einer Neuen Solo-Rolle wiederbelebt."
    },
    {
      id: "solo_07",
      kategorie: "SOLO",
      name: "Martyrium",
      solo: "Wähle Dorf oder Wölfe. Diese Fraktion erhält sofort einen Bonus: Dorf = die nächste Nacht findet kein Wolf-Angriff statt. Wölfe = der nächste Lynch wird annulliert."
    },
    {
      id: "solo_08",
      kategorie: "SOLO",
      name: "Stiller Zeuge",
      solo: "Du hast das ganze Spiel beobachtet. Nenne dem SL heimlich den Spieler den du für den gefährlichsten hältst. Sollte dieser Gewinnen, gewinnst du mit ihm."
    },
    {
      id: "solo_09",
      kategorie: "SOLO",
      name: "Chaosgeist",
      solo: "Würfle laut einen Würfel. Die gewürfelte Zahl entspricht der Anzahl Spieler die heute durch Lynchung sterben müssen."
    },
    {
      id: "solo_10",
      kategorie: "SOLO",
      name: "Einsames Erbe",
      solo: "Du hinterlässt zwei Zettel beim SL. Auf einem steht der Name des Spielers der gewinnen wird. Auf dem anderen steht der erste Spieler der nach dir stirbt. Beide Zettel werden zu ihrem jeweiligen Zeitpunkt geöffnet. Lagen beide richtig — du gewinnst posthum."
    },
    {
      id: "solo_11",
      kategorie: "SOLO",
      name: "Richter aus dem Totenreich",
      solo: "Nach jeder Abstimmung darfst du erneut einmal Nominieren — nur wenn mindestens 50% der Spieler dafür sind wird diese Person zusätzlich gelyncht."
    },
    {
      id: "solo_12",
      kategorie: "SOLO",
      name: "Familienbande aus dem Totenreich",
      solo: "Wähle einen Spieler — dieser erhält dauerhaft +3 auf seiner Stimme, er gewinnt automatisch wenn er unter den letzten 2 Lebenden ist und du gewinnst mit ihm."
    },
    {
      id: "solo_13",
      kategorie: "SOLO",
      name: "Das Totenreich Regiert",
      solo: "Die nächsten 2 Tagphasen werden von den Toten regiert — nur diese dürfen Reden, Nominieren und Lynchen."
    },
    {
      id: "solo_14",
      kategorie: "SOLO",
      name: "Verrat oder Verbrüderung",
      solo: "Du darfst einen deiner lebenden Nachbarn beschuldigen böse zu sein — sollte der andere Nachbar zustimmen stirbt der besagte Bösewicht."
    },
  ],
};

// Alle 80 Karten als flaches Array
const ALLE_KARTEN = [
  ...TOTENKARTEN.segen,
  ...TOTENKARTEN.schicksal,
  ...TOTENKARTEN.fluch,
  ...TOTENKARTEN.wende,
  ...TOTENKARTEN.loki,
  ...TOTENKARTEN.solo,
];

const GRIMM_DEATHCARD_LEGACY_REVIVE_TAGS = ["revive", "role-return", "death-trigger-transform"];

function normalizeDeathCardRequirements(card){
  if(!card || typeof card !== "object") return { requiresAnyLivingRoleTag: [] };
  const src = card.deathCardRequirements && typeof card.deathCardRequirements === "object" ? card.deathCardRequirements : {};
  const req = { requiresAnyLivingRoleTag: Array.isArray(src.requiresAnyLivingRoleTag) ? src.requiresAnyLivingRoleTag.slice() : [] };
  if(card.requiresReviveRole === true && !req.requiresAnyLivingRoleTag.length){
    req.requiresAnyLivingRoleTag = GRIMM_DEATHCARD_LEGACY_REVIVE_TAGS.slice();
  }
  return req;
}

function deathCardLivingTagsSatisfied(seats, tags){
  if(!tags || !tags.length) return true;
  const list = seats || [];
  const rh = typeof window.roleHasTag === "function" ? window.roleHasTag : function(){ return false; };
  return tags.some(function(tag){
    return list.some(function(x){
      return x && x.role && !(x.flags && x.flags.dead) && rh(x.role, tag);
    });
  });
}

function getDeathCardRequirementState(card, seats){
  const list = seats && seats.length !== undefined ? seats : (typeof state !== "undefined" && state && state.seats ? state.seats : []);
  const req = normalizeDeathCardRequirements(card);
  const tags = req.requiresAnyLivingRoleTag;
  if(!tags.length){
    return { setupOk: true, runtimeOk: true, showRestricted: false, requiresTags: [] };
  }
  const ok = deathCardLivingTagsSatisfied(list, tags);
  return { setupOk: ok, runtimeOk: ok, showRestricted: !ok, requiresTags: tags };
}

function deathCardSetupMeetsRequirements(card, seats){
  return getDeathCardRequirementState(card, seats).setupOk;
}

function deathCardMeetsRequirements(card, seats, options){
  const st = getDeathCardRequirementState(card, seats);
  if(options && options.phase === "setup") return st.setupOk;
  return st.runtimeOk;
}

function getEligibleDeathCardsForSetup(cards, seats){
  const c = cards || [];
  return c.filter(function(card){ return deathCardSetupMeetsRequirements(card, seats); });
}

window.GRIMM_DEATHCARD_LEGACY_REVIVE_TAGS = GRIMM_DEATHCARD_LEGACY_REVIVE_TAGS;
window.normalizeDeathCardRequirements = normalizeDeathCardRequirements;
window.getDeathCardRequirementState = getDeathCardRequirementState;
window.deathCardSetupMeetsRequirements = deathCardSetupMeetsRequirements;
window.deathCardMeetsRequirements = deathCardMeetsRequirements;
window.getEligibleDeathCardsForSetup = getEligibleDeathCardsForSetup;

// Zufällige Karte aus dem gesamten Stapel ziehen (gewichtet nach 1:4 Wende-Logik)
function zieheZufallsKarte(seat) {
  try {
    // Bereits vergebene Karten aussortieren
    const vergeben = new Set();
    if (state && state.once && state.once.totenkarten) {
      Object.values(state.once.totenkarten).forEach(d => {
        if (d && d.karteId) vergeben.add(d.karteId);
      });
    }

    // Lebende zählen
    const alive = state.seats.filter(s => !s.flags.dead);
    const wolves = alive.filter(s => isWolf(s)).length;
    const villagers = alive.length - wolves;
    const seatIsWolf = seat ? isWolf(seat) : false;
    const seatIsSolo = seat && (
      (typeof getFaction === "function" && getFaction(seat.role) === "solo") ||
      (typeof SOLO_WIN_ROLES !== "undefined" && SOLO_WIN_ROLES.has(seat.role))
    );

    // Solo-Spieler ziehen fast ausschließlich SOLO-Karten
    if (seatIsSolo) {
      const weights = { WENDE: 0, SEGEN: 0, FLUCH: 0, SCHICKSAL: 10, LOKI: 10, SOLO: 80 };
      const verfuegbar = ALLE_KARTEN.filter(k => !vergeben.has(k.id));
      const pool = verfuegbar.length > 0 ? verfuegbar : ALLE_KARTEN;
      const byKat = {};
      pool.forEach(k => { if (!byKat[k.kategorie]) byKat[k.kategorie] = []; byKat[k.kategorie].push(k); });
      const weightedPool = [];
      Object.entries(weights).forEach(([kat, w]) => {
        if (w === 0) return;
        const karten = byKat[kat] || [];
        if (!karten.length) return;
        const wpc = w / karten.length;
        karten.forEach(k => weightedPool.push({ karte: k, weight: wpc }));
      });
      if (weightedPool.length) {
        const totalW = weightedPool.reduce((sum, e) => sum + e.weight, 0);
        let rand = Math.random() * totalW;
        for (const entry of weightedPool) { rand -= entry.weight; if (rand <= 0) return entry.karte; }
        return weightedPool[weightedPool.length - 1].karte;
      }
    }

    // Hinten liegend bestimmen mit 1:4 Verhältnis
    const factionBehind = seatIsWolf
      ? (wolves * 4 < villagers)
      : (villagers <= wolves);

    // WENDE nur wenn exakt 4:1 aktiv — verhindert Ziehen bei inaktiver Wende
    const wendeWeight = (typeof isWendeAktiv === "function" && isWendeAktiv()) ? 40 : 0;

    // Gewichtungen festlegen — SOLO immer 0 für Nicht-Solo-Spieler
    const weights = factionBehind
      ? { WENDE: wendeWeight, SEGEN: 20, FLUCH: 10, SCHICKSAL: 20, LOKI: 10, SOLO: 0 }
      : { WENDE: 0,           SEGEN: 30, FLUCH: 20, SCHICKSAL: 30, LOKI: 20, SOLO: 0 };

    // Gewichteten Pool aufbauen — jede Karte bekommt ein Gewicht basierend auf ihrer Kategorie
    // Bereits vergebene Karten rausfiltern
    const verfuegbar = ALLE_KARTEN.filter(k => !vergeben.has(k.id));
    const pool = verfuegbar.length > 0 ? verfuegbar : ALLE_KARTEN;

    let setupEligible = getEligibleDeathCardsForSetup(pool, state.seats);
    if(setupEligible.length === 0 && pool.length > 0){
      setupEligible = pool.filter(function(k){
        const r = normalizeDeathCardRequirements(k);
        return !r.requiresAnyLivingRoleTag.length;
      });
    }
    if(setupEligible.length === 0) setupEligible = pool;
    const drawPool = setupEligible;

    // Karten nach Kategorie gruppieren
    const byKat = {};
    drawPool.forEach(k => {
      const kat = k.kategorie;
      if (!byKat[kat]) byKat[kat] = [];
      byKat[kat].push(k);
    });

    // Gewichteten Gesamtpool erstellen
    // Jede Kategorie bekommt ihren prozentualen Anteil am Pool
    // Gewicht pro Karte = Kategorie-Gewicht / Anzahl Karten in dieser Kategorie
    const weightedPool = [];
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    Object.entries(weights).forEach(([kat, w]) => {
      if (w === 0) return;
      const karten = byKat[kat] || [];
      if (!karten.length) return;
      const weightPerCard = w / karten.length;
      karten.forEach(k => {
        weightedPool.push({ karte: k, weight: weightPerCard });
      });
    });

    if (!weightedPool.length) {
      return drawPool[Math.floor(Math.random() * drawPool.length)];
    }

    // Gewichtete Zufallsauswahl
    const totalW = weightedPool.reduce((sum, e) => sum + e.weight, 0);
    let rand = Math.random() * totalW;
    for (const entry of weightedPool) {
      rand -= entry.weight;
      if (rand <= 0) return entry.karte;
    }

    return weightedPool[weightedPool.length - 1].karte;

  } catch(e) {
    try{
      const fb = typeof getEligibleDeathCardsForSetup === "function" ? getEligibleDeathCardsForSetup(ALLE_KARTEN, state && state.seats) : ALLE_KARTEN;
      const u = fb.length ? fb : ALLE_KARTEN;
      return u[Math.floor(Math.random() * u.length)];
    }catch(e2){
      return ALLE_KARTEN[Math.floor(Math.random() * ALLE_KARTEN.length)];
    }
  }
}

// Gibt den richtigen Kartentext basierend auf Fraktion zurück
function getKartenText(karte,seat){
  if(karte.solo) return karte.solo;
  if(karte.neutral) return karte.neutral;
  if(isWolf(seat)) return karte.wolf;
  return karte.dorf;
}

// Kategorie-Farbe für UI
function getKategorieColor(kategorie){
  switch(kategorie){
    case "SEGEN": return "#2bd46d";
    case "SCHICKSAL": return "#8b9fd4";
    case "FLUCH": return "#ff5d73";
    case "WENDE": return "#ffb020";
    case "LOKI": return "#ff3355";
    case "SOLO": return "#b06aff";
    default: return "#ffffff";
  }
}

// Kategorie-Emoji
function getKategorieEmoji(kategorie){
  switch(kategorie){
    case "SEGEN": return "🟢";
    case "SCHICKSAL": return "⚫";
    case "FLUCH": return "🔴";
    case "WENDE": return "🔄";
    case "LOKI": return "🃏";
    case "SOLO": return "☠️";
    default: return "❓";
  }
}

// Fallback: ensureTotenkarten falls abilities-helpers.js / abilities nicht geladen wurden (z.B. Syntaxfehler)
if (typeof window.ensureTotenkarten === "undefined") {
  window.ensureTotenkarten = function() {
    if (typeof state === "undefined" || !state) return;
    state.once = state.once || {};
    if (!state.once.totenkarten) {
      if (typeof assignTotenkarten === "function") {
        assignTotenkarten();
      } else {
        state.once.totenkarten = {};
        state.once.KartenschluckerStapel = state.once.KartenschluckerStapel || 0;
        if (state.seats) {
          state.seats.forEach(function(seat) {
            if (!seat || !seat.id) return;
            var karte = zieheZufallsKarte(seat);
            state.once.totenkarten[seat.id] = { karteId: karte.id, gespielt: false, shown: false };
          });
        }
      }
    } else {
      Object.keys(state.once.totenkarten).forEach(function(id) {
        var e = state.once.totenkarten[id];
        if (!e) {
          var seatForId = state.seats && state.seats.find(function(s){ return String(s.id) === String(id); });
          state.once.totenkarten[id] = { karteId: zieheZufallsKarte(seatForId).id, gespielt: false, shown: false };
        }
        else {
          if (typeof e.gespielt !== "boolean") e.gespielt = false;
          if (typeof e.shown !== "boolean") e.shown = false;
        }
      });
    }
    if (typeof state.once.KartenschluckerStapel !== "number") state.once.KartenschluckerStapel = 0;
  };
}

