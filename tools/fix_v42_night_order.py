# -*- coding: utf-8 -*-
"""
Aktualisiert in GRIMMHAIN_Card_Reference.html für ALLE Rollen:
  - r.pos   (sequential position)
  - r.tier  (new decimal tier)
  - v42-Text: Night Order Nummer, Tier-Wert, Nacht-Slot, Night Slot,
              ZONE A, In ZONE A drucken, Place-Zeile
"""
import re, json

FILE = "C:/Users/Marku/Downloads/GRIMMHAIN_Card_Reference.html"

# ── Neue Werte (DE-Name → [new_tier, new_pos]) ──────────────────
MAPPING = {
  "Loki":                    ("0.1",  "1"),
  "Dorfchronistin":          ("0.3",  "2"),
  "Die Gebundenen":          ("0.5",  "3"),
  "Schattenhund":            ("0.7",  "4"),
  "Wolfskind":               ("0.9",  "5"),
  "Lehrling":                ("1.1",  "6"),
  "Schutzengel":             ("1.3",  "7"),
  "Korrupter Richter":       ("1.5",  "8"),
  "Dorfschmied":             ("1.7",  "9"),
  "Werwolf":                 ("2.0",  "10"),
  "Doppelspion":             ("X",    "X"),
  "Albtraumwolf":            ("2.1",  "11"),
  "Rachsüchtiger Wolf":      ("2.2",  "12"),
  "Verdammniswächter":       ("2.3",  "13"),
  "König Lykaon":            ("2.4",  "14"),
  "Schicksalswolf":          ("2.5",  "15"),
  "Schattenwanderer":        ("2.6",  "16"),
  "Giftwolf":                ("2.7",  "17"),
  "Schwarze Witwe":          ("2.8",  "18"),
  "Nekromant":               ("3.0",  "19"),
  "Kopfgeldjäger":           ("3.2",  "20"),
  "Waldhexe":                ("3.4",  "21"),
  "Dr. Victor Frankenstein": ("3.6",  "22"),
  "Kutscher":                ("3.8",  "23"),
  "Kartenschlucker":         ("4.0",  "24"),
  "Rattenfänger":            ("4.2",  "25"),
  "König":                   ("4.4",  "26"),
  "Das Orakel":              ("4.6",  "27"),
  "Die Ewigen":              ("4.8",  "28"),
  "Doktor":                  ("5.0",  "29"),
  "Fährtenleser":            ("5.2",  "30"),
  "Waldläufer":              ("5.4",  "31"),
  "Schutzgeist":             ("5.6",  "32"),
  "Amalia":                  ("5.8",  "33"),
  "Kriegerin des Lichts":    ("6.0",  "34"),
  "Parasit":                 ("6.2",  "35"),
  "Grabräuber":              ("6.4",  "36"),
  "Todesprediger":           ("6.6",  "37"),
  "Spürhund":                ("6.8",  "38"),
  "Traumdeuter":             ("7.0",  "39"),
  "Pestbringerin":           ("7.2",  "40"),
  "Rotkäppchen":             ("7.4",  "41"),
  "Feuerteufel":             ("7.6",  "42"),
  "Henker":                  ("7.8",  "43"),
  "Seelentauscher":          ("8.0",  "44"),
  "Blutpriester":            ("8.2",  "45"),
  "Voodoo-Priester":         ("8.4",  "46"),
  "Prophet des Untergangs":  ("8.6",  "47"),
  "Märtyrerin":              ("9.0",  "48"),
  "Zeitwächter":             ("9.5",  "49"),
  "Hades":                   ("9.9",  "50"),
}

with open(FILE, "r", encoding="utf-8") as f:
    raw = f.read()

# ── ROLES-Array lokalisieren ─────────────────────────────────────
m = re.search(r'var ROLES = (\[.*?\]);', raw, re.DOTALL)
assert m, "ROLES array not found"
roles = json.loads(m.group(1))

updated = 0
skipped = []

for r in roles:
    de = r["de"]
    if de not in MAPPING:
        skipped.append(de)
        continue

    new_tier, new_pos = MAPPING[de]
    old_pos  = r["pos"]
    old_tier = r["tier"]

    # Werte updaten
    r["pos"]  = new_pos
    r["tier"] = new_tier

    # ── v42-Text updaten ────────────────────────────────────────
    v = r.get("v42", "")
    if not v:
        continue

    if new_tier == "X":
        # X-Rollen: kein Nacht-Slot
        zone_a_val = "X — kein Nacht-Slot"
        nacht_slot_de = "Nein — kein Nacht-Slot (passiv / reaktiv)"
        nacht_slot_en = "No — no night slot (passive / reactive)"
        night_order_nr = "X"
        tier_val       = "X"
    else:
        zone_a_val    = new_pos
        nacht_slot_de = f"Ja — wacht in Nacht {new_pos} auf"
        nacht_slot_en = f"Yes — wakes on night {new_pos}"
        night_order_nr = new_pos
        tier_val       = new_tier

    def repl_field(text, label, new_val):
        """Ersetzt '  label:  <alter_wert>' mit neuem Wert, beliebige Abstände."""
        return re.sub(
            r'(  ' + re.escape(label) + r':\s+)\S.*',
            lambda mo: mo.group(1) + str(new_val),
            text
        )

    # Felder mit festem Label ersetzen
    v = repl_field(v, "Night Order Nummer", night_order_nr)
    v = repl_field(v, "Tier-Wert",          tier_val)
    v = repl_field(v, "Nacht-Slot",         nacht_slot_de)
    v = repl_field(v, "Night Slot",         nacht_slot_en)
    v = repl_field(v, "In ZONE A drucken",  zone_a_val)

    # ZONE A Zeile
    v = re.sub(
        r'(  ZONE A:\s+)"?[^"\n]+"?',
        lambda mo: f'  ZONE A:         "{zone_a_val}"',
        v
    )

    # Place "X" in ZONE A Zeile
    v = re.sub(
        r'(\[ \] Night Order ")([^"]+)(" in ZONE A)',
        lambda mo: mo.group(1) + str(zone_a_val) + mo.group(3),
        v
    )
    # Place "X" in ZONE A top-left circle Zeile (englische Variante)
    v = re.sub(
        r'(\[ \] Place ")([^"]+)(" in ZONE A)',
        lambda mo: mo.group(1) + str(zone_a_val) + mo.group(3),
        v
    )

    r["v42"] = v
    updated += 1

print(f"Rollen aktualisiert: {updated}")
if skipped:
    print(f"Nicht in Mapping (X-Rollen erwartet): {skipped}")

# ── JSON sauber zurückschreiben ──────────────────────────────────
# Jede Rolle als eine kompakte Zeile, \n in v42 korrekt escaped
new_roles_json = "[\n"
parts = []
for r in roles:
    parts.append(json.dumps(r, ensure_ascii=False, separators=(',', ': ')))
new_roles_json += ",\n".join(parts) + "\n]"

new_raw = raw[:m.start()] + "var ROLES = " + new_roles_json + ";" + raw[m.end():]

# Schnelltest: Re-parse und Stichprobe
test = json.loads(re.search(r'var ROLES = (\[.*?\]);', new_raw, re.DOTALL).group(1))
checks = [("Loki","1","0.1"), ("Schattenhund","4","0.7"), ("Werwolf","10","2.0"),
          ("Doppelspion","X","X"), ("Kutscher","23","3.8"), ("Hades","50","9.9")]
print("\nStichprobe nach Update:")
for name, exp_pos, exp_tier in checks:
    r = next(x for x in test if x["de"] == name)
    ok_p = "OK" if r["pos"] == exp_pos else f"FAIL (got {r['pos']})"
    ok_t = "OK" if r["tier"] == exp_tier else f"FAIL (got {r['tier']})"
    # v42 check
    v = r["v42"]
    has_no = f"Night Order Nummer:  {exp_pos}" in v or exp_pos == "X"
    has_tv = f"Tier-Wert:           {exp_tier}" in v or exp_pos == "X"
    print(f"  {name:<30} pos={ok_p}  tier={ok_t}  v42_no={'OK' if has_no else 'CHECK'}  v42_tv={'OK' if has_tv else 'CHECK'}")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(new_raw)
print(f"\nGespeichert: {FILE}")
