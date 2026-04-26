# -*- coding: utf-8 -*-
"""
Update Night Order in:
  1. GRIMMHAIN_Card_Reference.html  (ROLES array + makeCard + v42)
  2. Grimmhain_Roles_EN.html        (ORDER object)
  3. Grimmhein_Rollen.html          (add night order script if missing)
"""
import re, json, sys

# ──────────────────────────────────────────────────────────────────
# NEUE TIER-WERTE (exakter Rollenname aus ROLES array)
# ──────────────────────────────────────────────────────────────────
NEW_TIER = {
    "Loki":                    "0.1",
    "Dorfchronistin":          "0.3",
    "Die Gebundenen":          "0.5",
    "Schattenhund":            "0.7",
    "Wolfskind":               "0.9",
    "Lehrling":                "1.1",
    "Schutzengel":             "1.3",
    "Korrupter Richter":       "1.5",
    "Dorfschmied":             "1.7",
    "Werwolf":                 "2.0",
    "Doppelspion":             "X",
    "Albtraumwolf":            "2.1",
    "Rachsüchtiger Wolf":      "2.2",
    "Verdammniswächter":       "2.3",
    "König Lykaon":            "2.4",
    "Schicksalswolf":          "2.5",
    "Schattenwanderer":        "2.6",
    "Giftwolf":                "2.7",
    "Schwarze Witwe":          "2.8",
    "Nekromant":               "3.0",
    "Kopfgeldjäger":           "3.2",
    "Waldhexe":                "3.4",
    "Dr. Victor Frankenstein": "3.6",
    "Kutscher":                "3.8",
    "Kartenschlucker":         "4.0",
    "Rattenfänger":            "4.2",
    "König":                   "4.4",
    "Das Orakel":              "4.6",
    "Die Ewigen":              "4.8",
    "Doktor":                  "5.0",
    "Fährtenleser":            "5.2",
    "Waldläufer":              "5.4",
    "Schutzgeist":             "5.6",
    "Amalia":                  "5.8",
    "Kriegerin des Lichts":    "6.0",
    "Parasit":                 "6.2",
    "Grabräuber":              "6.4",
    "Todesprediger":           "6.6",
    "Spürhund":                "6.8",
    "Traumdeuter":             "7.0",
    "Pestbringerin":           "7.2",
    "Rotkäppchen":             "7.4",
    "Feuerteufel":             "7.6",
    "Henker":                  "7.8",
    "Seelentauscher":          "8.0",
    "Blutpriester":            "8.2",
    "Voodoo-Priester":         "8.4",
    "Prophet des Untergangs":  "8.6",
    "Märtyrerin":              "9.0",
    "Zeitwächter":             "9.5",
    "Hades":                   "9.9",
}

# EN name → new tier (for Grimmhain_Roles_EN.html ORDER object)
NEW_TIER_EN = {
    "Loki":                    "0.1",
    "Village Chronicler":      "0.3",
    "The Bound":               "0.5",
    "Shadow Hound":            "0.7",
    "Wolf Child":              "0.9",
    "Apprentice":              "1.1",
    "Guardian Angel":          "1.3",
    "Corrupt Judge":           "1.5",
    "Village Blacksmith":      "1.7",
    "Werewolf":                "2.0",
    "Nightmare Wolf":          "2.1",
    "Lone Wolf":               "2.2",
    "Vengeful Wolf":           "2.2",   # alt name in file
    "Doom Warden":             "2.3",
    "King Lykaon":             "2.4",
    "Fate Wolf":               "2.5",
    "Shadow Wanderer":         "2.6",
    "Shadowwalker":            "2.6",   # alt name
    "Poison Wolf":             "2.7",
    "Black Widow":             "2.8",
    "Necromancer":             "3.0",
    "Bounty Hunter":           "3.2",
    "Forest Witch":            "3.4",
    "Witch of the Woods":      "3.4",   # alt name
    "Dr. Victor Frankenstein": "3.6",
    "Coachman":                "3.8",
    "Card Swallower":          "4.0",
    "The Collector":           "4.0",   # alt name
    "Pied Piper":              "4.2",
    "King":                    "4.4",
    "The Oracle":              "4.6",
    "The Eternal Ones":        "4.8",
    "Doctor":                  "5.0",
    "Tracker":                 "5.2",
    "Ranger":                  "5.4",
    "Guardian Spirit":         "5.6",
    "Protective Spirit":       "5.6",  # alt name
    "Amalia":                  "5.8",
    "Warrior of Light":        "6.0",
    "Parasite":                "6.2",
    "Grave Robber":            "6.4",
    "Death Prophet":           "6.6",
    "Scent Hound":             "6.8",
    "Dreamer":                 "7.0",
    "Dream Reader":            "7.0",  # alt name
    "Plague Bringer":          "7.2",
    "Little Red Riding Hood":  "7.4",
    "Pyromaniac":              "7.6",
    "Executioner":             "7.8",
    "Soul Swapper":            "8.0",
    "Blood Priest":            "8.2",
    "Voodoo Priest":           "8.4",
    "Prophet of Doom":         "8.6",
    "Martyr":                  "9.0",
    "Time Warden":             "9.5",
    "Hades":                   "9.9",
}

# ──────────────────────────────────────────────────────────────────
# pos-Neuberechnung (sequenziell nach Tier sortiert)
# ──────────────────────────────────────────────────────────────────
sorted_roles = sorted(
    [(name, tier) for name, tier in NEW_TIER.items() if tier != "X"],
    key=lambda x: float(x[1])
)
NEW_POS = {name: str(i+1) for i, (name, _) in enumerate(sorted_roles)}
for name in NEW_TIER:
    if NEW_TIER[name] == "X":
        NEW_POS[name] = "X"

print("Neue Positionen:")
for name, pos in sorted(NEW_POS.items(), key=lambda x: (int(x[1]) if x[1] != "X" else 999, x[0])):
    if pos != "X":
        print(f"  {pos:>3}. {name} -> tier {NEW_TIER[name]}")

# ──────────────────────────────────────────────────────────────────
# 1. GRIMMHAIN_Card_Reference.html
# ──────────────────────────────────────────────────────────────────
ref_path = "C:/Users/Marku/Downloads/GRIMMHAIN_Card_Reference.html"
with open(ref_path, "r", encoding="utf-8") as f:
    content = f.read()

# Parse ROLES array
m = re.search(r'(var ROLES = )(\[.*?\]);', content, re.DOTALL)
assert m, "ROLES array not found"
roles = json.loads(m.group(2))

# Update each role's tier, pos, and v42 text
for r in roles:
    de_name = r["de"]
    if de_name in NEW_TIER:
        old_pos = r["pos"]
        old_tier = r["tier"]
        new_tier = NEW_TIER[de_name]
        new_pos  = NEW_POS[de_name]

        r["tier"] = new_tier
        r["pos"]  = new_pos

        # Update v42 text
        v42 = r.get("v42", "")

        # Fix ZONE A line  e.g. "ZONE A:         1 — gold serif..."
        # and placement line e.g. 'Place "1" in ZONE A'
        if new_tier == "X":
            # X roles: "X — kein Nacht-Slot" (DE) and "X — no night slot" (EN)
            zone_a_val_de = "X — kein Nacht-Slot"
            zone_a_val_en = "X — no night slot"
        else:
            zone_a_val_de = new_pos
            zone_a_val_en = new_pos

        # Replace old pos in ZONE A and Place lines
        # Both DE and EN versions in the same v42 block
        for old_val in [old_pos, f'"{old_pos}"', f'"{old_pos} (kein Nacht-Slot)"', f'"{old_pos} (no night slot)"',
                        "X (kein Nacht-Slot)", "X (no night slot)"]:
            pass  # handled below via regex

        # Regex replace: ZONE A value and Place line value
        # Pattern: ZONE A:  <spaces>  <value>  <rest>
        v42 = re.sub(
            r'(ZONE A:\s+)"?[^"\n—]+"?([^"\n]*)',
            lambda mo: f'ZONE A:         "{zone_a_val_de}"{mo.group(2)}',
            v42
        )
        # Pattern: Place "<value>" in ZONE A
        v42 = re.sub(
            r'(Place ")([^"]+)(" in ZONE A)',
            lambda mo: f'{mo.group(1)}{zone_a_val_de}{mo.group(3)}',
            v42
        )
        r["v42"] = v42

    else:
        print(f"  WARNING: '{de_name}' not in NEW_TIER mapping")

# Serialize updated ROLES back into the file
new_roles_json = json.dumps(roles, ensure_ascii=False, separators=(',', ': '))
# Keep the format similar to original (compact but readable)
new_roles_json = "[\n" + ",\n".join(
    json.dumps(r, ensure_ascii=False) for r in roles
) + "\n]"

content = content[:m.start()] + "var ROLES = " + new_roles_json + ";" + content[m.end():]

# ── Add NO-Badge CSS ─────────────────────────────────────────────
no_badge_css = """
.no-badge{font-family:"Cinzel",serif;font-size:.5rem;letter-spacing:.07em;text-transform:uppercase;
  padding:2px 7px;border-radius:4px;border:1px solid;margin-right:4px;flex-shrink:0;
  white-space:nowrap;}
.dorf .no-badge{color:var(--gold);border-color:var(--gold-dim);background:var(--gold-glow)}
.wolf .no-badge{color:var(--wolf);border-color:var(--wolf-dim);background:var(--wolf-glow)}
.solo .no-badge{color:var(--solo);border-color:var(--solo-dim);background:var(--solo-glow)}
.no-badge.no-slot{color:var(--dim);border-color:rgba(82,76,66,.35);background:rgba(82,76,66,.06)}
"""
# Insert before </style>
if ".no-badge" not in content:
    content = content.replace("</style>", no_badge_css + "</style>", 1)

# ── Update makeCard: add NO-badge in .ri after .ren ─────────────
old_make = "h += '<span class=\"ren\">'+esc(sub)+'</span>';"
new_make = (
    "h += '<span class=\"ren\">'+esc(sub)+'</span>';\n"
    "  var noLabel = r.tier !== 'X' ? 'NO\\u00a0' + r.tier : (lang === 'de' ? 'kein Slot' : 'no slot');\n"
    "  var noClass = r.tier !== 'X' ? 'no-badge' : 'no-badge no-slot';\n"
    "  h += '<span class=\"'+noClass+'\">'+esc(noLabel)+'</span>';"
)
if old_make in content:
    content = content.replace(old_make, new_make)
    print("makeCard: NO-badge added")
else:
    print("WARNING: makeCard old_make string not found")

with open(ref_path, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Saved: {ref_path}")

# ──────────────────────────────────────────────────────────────────
# 2. Grimmhain_Roles_EN.html — ORDER object updaten
# ──────────────────────────────────────────────────────────────────
en_path = "C:/Users/Marku/Downloads/Grimmhain-Cards/Grimmhain_Roles_EN.html"
with open(en_path, "r", encoding="utf-8") as f:
    en = f.read()

# Build new ORDER object
new_order_lines = []
for name, new_t in NEW_TIER_EN.items():
    if new_t != "X":
        new_order_lines.append(f'    "{name}":"{new_t}"')

new_order_str = "  const ORDER = {\n" + ",\n".join(new_order_lines) + "\n  };"

# Replace old ORDER block
en = re.sub(
    r'const ORDER = \{[^}]+\};',
    new_order_str,
    en
)

with open(en_path, "w", encoding="utf-8") as f:
    f.write(en)
print(f"Saved: {en_path}")

# ──────────────────────────────────────────────────────────────────
# 3. Grimmhein_Rollen.html — Night Order Badge Script hinzufügen
# ──────────────────────────────────────────────────────────────────
de_path = "C:/Users/Marku/Desktop/Grimmhein_Rollen.html"
with open(de_path, "r", encoding="utf-8") as f:
    de = f.read()

if "night-badge" not in de:
    # Build DE ORDER mapping
    de_order_lines = []
    for name, new_t in NEW_TIER.items():
        if new_t != "X":
            de_order_lines.append(f'    "{name}":"{new_t}"')

    badge_css = """
<style>
/* NIGHT ORDER BADGE */
.night-badge{position:absolute;top:8px;right:8px;min-width:40px;height:36px;border-radius:999px;
  display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-weight:700;
  font-size:11px;z-index:2;pointer-events:none;line-height:1;padding:0 10px;white-space:nowrap}
.night-badge.nb-active{background:rgba(201,168,76,.14);border:2px solid rgba(201,168,76,.5);
  color:#e8c060;text-shadow:0 0 10px rgba(201,168,76,.5)}
.night-badge.nb-passive{font-size:14px;background:rgba(80,72,112,.15);border:2px solid rgba(80,72,112,.35);color:#5a5280}
</style>
"""
    badge_script = """
<script>
(function(){
  const ORDER = {
""" + ",\n".join(de_order_lines) + """
  };
  document.querySelectorAll('.char-card').forEach(function(card){
    var name = card.dataset.name;
    var badge = document.createElement('div');
    badge.className = 'night-badge';
    if(ORDER[name] !== undefined){
      badge.classList.add('nb-active');
      badge.textContent = ORDER[name];
    } else {
      badge.classList.add('nb-passive');
      badge.textContent = '✕';
    }
    card.appendChild(badge);
  });
})();
</script>
"""
    # Insert CSS before </head> and script before </body>
    de = de.replace("</head>", badge_css + "</head>", 1)
    de = de.replace("</body>", badge_script + "</body>", 1)
    print("DE Rollen: Night-badge CSS + Script hinzugefügt")
else:
    # Update existing ORDER in DE file
    de_order_lines = []
    for name, new_t in NEW_TIER.items():
        if new_t != "X":
            de_order_lines.append(f'    "{name}":"{new_t}"')
    new_de_order = "  const ORDER = {\n" + ",\n".join(de_order_lines) + "\n  };"
    de = re.sub(r'const ORDER = \{[^}]+\};', new_de_order, de)
    print("DE Rollen: ORDER aktualisiert")

with open(de_path, "w", encoding="utf-8") as f:
    f.write(de)
print(f"Saved: {de_path}")

print("\nAlle 3 Dateien erfolgreich aktualisiert!")
