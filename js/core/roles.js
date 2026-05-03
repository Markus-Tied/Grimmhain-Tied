const ALL_ROLES=["Loki","Nachtwächter","Die Gebundenen","Waldhexe","Rattenfänger","Sensenträger","Wolfskind","Das Orakel","Die Ewigen","Spürhund","Schutzengel","Werwolf","Rachsüchtiger Wolf","König Lykaon","Siegreicher Wolf","Seuchenwolf","Schicksalswolf","Schattenwanderer","Giftwolf","Rudelvater","Schwarze Witwe","Der Weise","Verdammniswächter","Lehrling","Wahnsinniger Kutscher","Korrupter Richter","Märtyrerin","Dorfwache","Pestbringerin","Prophet des Untergangs","Spiegelwolf","Dämonischer Wolf","Trugbilderwolf","Schattenhund","Besessener Wolf","Fenrir","Kutscher","Seelentauscher","Blutpriester","Traumdeuter","Henker","Feuerteufel","Voodoo-Priester","Blutwolf","Albtraumwolf","Cerberus","Ritter","Rotkäppchen","Selbstmörder","Kopfgeldjäger","König","Dr. Victor Frankenstein","Nekromant","Kartenschlucker","Hades","Doktor","Fährtenleser","Waldläufer","Schutzgeist","Dorfchronistin","Wächter am Tor","Zeitwächter","Amalia","Kriegerin des Lichts","Detektiv","Dorfschmied","Manipulator","Doppelspion","Grabräuber","Parasit","Todesprediger","Dorfbewohner"]

const ORDER_BASE=[
  // ── Gruppe A: Einmalige Nacht-1-Rollen (0.1 – 1.1) ──
  {r:"Loki",tier:0.1,once:true},
  {r:"Dorfchronistin",tier:0.3,once:true},
  {r:"Die Gebundenen",tier:0.5,once:true},
  {r:"Schattenhund",tier:0.7,once:true},
  {r:"Wolfskind",tier:0.9,once:true},
  {r:"Lehrling",tier:1.1,once:true},
  // ── Gruppe B: Vor den Wölfen (1.3 – 1.7) ──
  {r:"Schutzengel",tier:1.3},
  {r:"Korrupter Richter",tier:1.5},
  {r:"Dorfschmied",tier:1.7},
  // ── Gruppe C: Wolfphase (2.0 – 2.8, Abstand 0.1) ──
  {r:"Werwolf",tier:2.0},
  {r:"Albtraumwolf",tier:2.1},
  {r:"Rachsüchtiger Wolf",tier:2.2},
  {r:"Verdammniswächter",tier:2.3},
  {r:"König Lykaon",tier:2.4,once:true},
  {r:"Schicksalswolf",tier:2.5},
  {r:"Schattenwanderer",tier:2.6,once:true},
  {r:"Giftwolf",tier:2.7},
  {r:"Schwarze Witwe",tier:2.8},
  // ── Gruppe D: Post-Wolf Reaktion (3.0 – 3.4) ──
  {r:"Nekromant",tier:3.0},
  {r:"Kopfgeldjäger",tier:3.2},
  {r:"Waldhexe",tier:3.4},
  // ── Gruppe E: Dorf Nachtaktionen (3.6 – 7.0) ──
  {r:"Dr. Victor Frankenstein",tier:3.6},
  {r:"Kutscher",tier:3.8},
  {r:"Kartenschlucker",tier:4.0},
  {r:"Rattenfänger",tier:4.2},
  {r:"König",tier:4.4},
  {r:"Das Orakel",tier:4.6},
  {r:"Die Ewigen",tier:4.8},
  {r:"Doktor",tier:5.0},
  {r:"Fährtenleser",tier:5.2},
  {r:"Waldläufer",tier:5.4},
  {r:"Schutzgeist",tier:5.6},
  {r:"Amalia",tier:5.8},
  {r:"Kriegerin des Lichts",tier:6.0,once:true},
  {r:"Parasit",tier:6.2},
  {r:"Grabräuber",tier:6.4,once:true},
  {r:"Todesprediger",tier:6.6,once:true},
  {r:"Spürhund",tier:6.8},
  {r:"Traumdeuter",tier:7.0},
  // ── Gruppe F: Aktive Spezialisten (7.2 – 8.6) ──
  {r:"Pestbringerin",tier:7.2},
  {r:"Rotkäppchen",tier:7.4},
  {r:"Feuerteufel",tier:7.6},
  {r:"Henker",tier:7.8},
  {r:"Seelentauscher",tier:8.0,once:true},
  {r:"Blutpriester",tier:8.2,once:true},
  {r:"Voodoo-Priester",tier:8.4},
  {r:"Prophet des Untergangs",tier:8.6},
  // ── Gruppe G: Letztes Wort (9.0 – 9.9) ──
  {r:"Märtyrerin",tier:9.0},
  {r:"Zeitwächter",tier:9.5,once:true},
  {r:"Hades",tier:9.9}
].sort((a,b)=>a.tier-b.tier)

window.ROLE_DESCRIPTIONS={
"Loki": "Eros und Eris leihen dir ihre Kraft. Verbinde einmalig zwei Seelen als unzertrennliche Liebende — oder verfluche zwei als ewige Rivalen.", 
"Nachtwächter": "Bewacht die Grenzen und spürt, wenn ein Nachbar nicht ins Dorf gehört. Es ertönen öffentlich die Alarmglocken.", 
"Die Gebundenen": "Wacht in der ersten Nacht auf und lernt alle anderen Gebundenen kennen.", 
"Waldhexe": "Sieht jede Nacht die Zukunft des Opfers und entscheidet: Einmalig kannst du diesen vor seinem Schicksal bewahren oder einen anderen Spieler in eine tödliche Zukunft weisen.", 
"Rattenfänger": "Du spielst jede Nacht dein Lied und verzauberst 1 oder 2 Spieler. Sobald alle lebenden Spieler in deinem Bann sind, gewinnst du die Runde.", 
"Sensenträger": "Beim Tod: erntet eine letzte Seele seiner Wahl.",
"Wolfskind": "Wähle zu Beginn des Spiels einen Feind aus. Sollte dieser sterben, erwacht dein animalisches Blut und du zählst fortan als Wolf.", 
"Das Orakel": "Sieh in deine Kugel und erfahre die Rolle eines Spielers.", 
"Die Ewigen": "Prüfen jede Nacht ob ein Spieler eine Solo-Siegbedingung hat — und gewinnen gemeinsam mit ihm.", 
"Spürhund": "Wähle 3 Spieler. ✅ wenn einer Wolf, Solo oder falsche Spur ist — sonst ❌. Bei ❌ wird heimlich ein Spieler als falsche Spur markiert.", 
"Schutzengel": "Wähle jede Nacht einen Spieler und schütze diesen vor dem nächsten Werwolfangriff.", 
"Werwolf": "Tötet jede Nacht gemeinsam ein Opfer.", 
"Rachsüchtiger Wolf": "Jedermann ist dein Feind. Du wachst neben den Werwölfen zusätzlich jede dritte Nacht auf und hast die Möglichkeit, einen anderen Werwolf zu reißen. Du willst alleine gewinnen.", 
"König Lykaon": "Wähle in der ersten Nacht einen verbündeten Wolf. Gemeinsam entscheidet ihr, welcher Dorfbewohner es wert ist, einer von euch zu werden. Dieser wird dann zu einem Trugbilderwolf.", 
"Der Weise": "Du überlebst dank deines Wissens und deiner Vorbereitung den ersten Werwolfangriff. Sollte das Dorf dich jedoch lynchen, verlieren diese 1–3 Nächte und Tage lang ihre Fähigkeiten.", 
"Verdammniswächter": "Jede Nacht: Wähle 1 von 2 Spielern — entweder das Nachtopfer stirbt oder ein zufällig angebotener anderer Spieler stirbt stattdessen.", 
"Lehrling": "Wählt einen Mentor und übernimmt die Rolle nach dessen Tod.", 
"Wahnsinniger Kutscher": "Wird er gelyncht, sterben beide direkten Nachbarn mit ihm.",
"Korrupter Richter": "Kann einen Spieler für den Tag markieren; dieser ist automatisch mit +1 Stimme nominiert.", 
"Märtyrerin": "Kann sich selbst opfern, um das Nachtopfer zu retten.", 
"Dorfwache": "Stirbt nicht, wenn er nachts Ziel der Werwölfe wird.", 
"Pestbringerin": "Verbreitet jede Nacht eine tödliche Seuche, die sich ausbreitet.", 
"Prophet des Untergangs": "Markiert drei Spieler. Wenn alle tot sind, erhält er die Fähigkeit, jede Nacht zu töten — und gewinnt alleine.", 
"Spiegelwolf": "Reflektiert die erste Lynchung auf den Spieler, der ihn nominiert hat.", 
"Dämonischer Wolf":"Verflucht Opfer, sodass sie als Werwölfe gesehen werden.", 
"Trugbilderwolf": "Täuscht das Orakel mit zufälliger Nicht-Wolf-Rolle.", 
"Schattenhund": "Kann einmalig alle Dorf-Fähigkeiten für eine Nacht blockieren.", 
"Besessener Wolf": "Reißt beim Tod (bei ≥5 Spielern) einen weiteren mit in den Tod.", 
"Fenrir": "Wird mit jeder überlebten Nacht mächtiger. Ab Stufe 3 überlebt er einmalig jeden Tod.", 
"Kutscher": "Wenn mindestens 10 Spieler tot sind, kann er drei Tote wiederbeleben — einer davon wird Wolf.", 
"Seelentauscher": "Tauscht einmalig die Rollen zweier Spieler unabhängig davon, ob lebendig oder tot.", 
"Blutpriester": "Opfert jemanden und deckt 0–3 Werwölfe auf.", 
"Traumdeuter": "Erhält Visionen über Rollen oder Zustände von Spielern.", 
"Henker": "Wird nach drei Lynchungen aktiv. Markiert nächtlich ein Ziel, das zusätzlich nach Lynchung stirbt.", 
"Feuerteufel": "Wählt ein Ziel; beim Tod des Ziels verbrennen auch die Nachbarn.", 
"Voodoo-Priester": "Gibt einem Spieler eine Voodoo-Puppe. Solange eine Puppe aktiv ist, stirbt bei seinem Tod stattdessen der Puppenträger.", 
"Blutwolf": "Seine Stimme zählt +1 für jeden direkten toten Nachbarn.", 
"Albtraumwolf": "Blockiert jede Nacht die Fähigkeit eines Dorfbewohners.", 
"Cerberus": "Baut Köpfe auf (bis zu 3); bei 3 kann er eine Lynchung abwehren.", 
"Ritter": "Tötet beim Sterben in der Nacht den nächstliegenden Werwolf.", 
"Rotkäppchen": "Jede Nacht sucht sie bei einem anderen Spieler Zuflucht. Gewährt er sie, erhält er einen Apfel: Seine nächste Fähigkeit wird doppelt ausgeführt. Außerdem verbindet beide eine Todeskette — stirbt einer, stirbt der andere mit.", 
"Selbstmörder": "Gewinnt sobald 5+ Tote sind und er am Tage Gelyncht wird.", 
"Kopfgeldjäger": "Sobald ein Werwolf gelyncht wird, sieht er drei Spieler (einer davon ist ein Werwolf).", 
"König": "Sobald mehr Tote als Lebende existieren, lernt er in dieser Nacht einen Dorfbewohner (und dessen Rolle) kennen.", 
"Dr. Victor Frankenstein": "Kann einmalig einen Toten wiederbeleben und ihm eine neue Rolle geben.",
"Nekromant": "Mit mindestens drei Toten kann er nachts drei Stimmen opfern und ein Schild errichten, das die nächste Tötung (beliebig) verhindert; ungenutzt verfällt es mit der nächsten Nacht. Wird er nachts angegriffen, kann er alternativ drei Tote wählen und den Kill umlenken. Gewinnt allein, wenn er am Tag einen lebenden Werwolf korrekt benennt.",
"Kartenschlucker": "Erhält einen Stapel, jedes Mal wenn ein Toter ihre Karten austauscht. Bei 10 Stapeln gewinnt er sofort.",
"Hades": "Sammelt Lebenslichter von Toten. Kauft Fähigkeiten und gewinnt bei 10 Lichtern.",
"Siegreicher Wolf": "Solange er lebt, zählt er für die Siegbedingung wie zwei Werwölfe.",
"Seuchenwolf": "Nach seinem Ableben durchdringt der nächste Wolfsangriff alle Schutzeffekte.",
"Schicksalswolf": "Wähle zu Beginn des Spiels drei Spieler. Für jeden von ihnen, der unter den ersten drei Toten ist, erhältst du in Nacht 4 die Möglichkeit, einen zusätzlichen Spieler zu reißen.",
"Schattenwanderer": "Knüpft eine Todeskette mit einem anderen Spieler. Stirbt einer von euch, stirbt stattdessen der andere — und umgekehrt.",
"Giftwolf": "Darf zweimal im Spiel ein Ziel mit seinen Giftpranken angreifen. Dieses erfährt davon und stirbt zwei Tage später.",
"Rudelvater": "Überlebt den ersten Tod durch eine Sonderfähigkeit. Wird er jedoch gelyncht, dürfen die Werwölfe in der folgenden Nacht ein zusätzliches Opfer wählen. Dieser zweite Angriff ignoriert alle Schutzfähigkeiten.",
"Schwarze Witwe": "Loki wird automatisch gewählt. Wähle jede Nacht einen Spieler. Findest du einen Verliebten oder Verhassten, sterben beide am folgenden Tag.",
"Doktor": "Nimmt jede Nacht Blutproben von zwei Spielern und erfährt, ob sie demselben Team angehören.",
"Fährtenleser": "Wacht jede Nacht auf und darf einmal im Spiel erfahren, in welche Richtung der nächstliegende Wolf von ihm sitzt: links oder rechts.",
"Waldläufer": "Erfährt, wie viele lebende Werwölfe im Spiel sind.",
"Schutzgeist": "Wählt in der Nacht nach ihrem Ableben einen Spieler. Dieser erhält ein Schutzschild. Hat sie einen Werwolf gewählt, erfährt das Dorf davon.",
"Dorfchronistin": "Erfährt zu Beginn des Spiels, wie viele Solo-Rollen im Spiel sind.",
"Wächter am Tor": "Solange er lebt, werden neu entstehende Werwölfe blockiert — der betroffene Spieler wird stattdessen zum Dorfbewohner.",
"Zeitwächter": "Kann einmalig eine Nacht einfrieren — alle Nachtaktionen dieser Nacht werden abgebrochen. Die Nacht gilt als nicht stattgefunden.",
"Amalia": "Trägt den Willen Hestias in sich. Solange mehr als zwei Werwölfe im Spiel sind, kann sie sich opfern, um öffentlich eine Ja-/Nein-Frage zu stellen.",
"Kriegerin des Lichts": "Greift einmalig nachts direkt an und wählt einen Spieler. Der Spielleiter sagt, ob dieser Spieler ein Wolf ist. Ist er keiner, stirbt sie selbst.",
"Detektiv": "Nach dem Tod eines Wolfes wird öffentlich ein Hinweis auf einen anderen Wolf verkündet.",
"Dorfschmied": "Schmiedet fünf Nächte lang an einer Waffe. In der sechsten Nacht kann er sie einem Spieler geben. Dieser wehrt einen Wolfsangriff ab und tötet dabei einen zufälligen Wolf.",
"Manipulator": "Gewinnt, wenn er es bis in die Final 3 schafft, ohne je nominiert worden zu sein. Sobald er nominiert wird, stirbt er sofort.",
"Doppelspion": "Wacht gemeinsam mit den Werwölfen auf. Gewinnt alleine, wenn alle Werwölfe tot sind. Der Angriff des Rachsüchtigen Wolfs verpufft an ihm.",
"Grabräuber": "Kann einmalig die Fähigkeit eines toten Spielers stehlen. Gewinnt alleine.",
"Parasit": "Wacht jede Nacht auf und kann sich an einen lebenden Spieler heften. Er stirbt nur, wenn sein Wirt stirbt. Gewinnt, wenn er die Final 3 erreicht.",
"Todesprediger": "Kündigt an, in welcher Nacht oder an welchem Tag er sterben wird. Liegt er richtig, gewinnt er alleine.",
"Dorfbewohner": "Hat keine aktive Nachtfähigkeit."};

window.ROLE_NAMES_EN = {
  "Loki": "Loki",
  "Nachtwächter": "Night Warden",
  "Die Gebundenen": "The Bound",
  "Waldhexe": "Witch of the Woods",
  "Rattenfänger": "Pied Piper",
  "Sensenträger": "Reaper",
  "Wolfskind": "Wolf Child",
  "Das Orakel": "The Oracle",
  "Die Ewigen": "The Eternal Ones",
  "Spürhund": "Scent Hound",
  "Schutzengel": "Guardian Angel",
  "Werwolf": "Werewolf",
  "Rachsüchtiger Wolf": "Lone Wolf",
  "König Lykaon": "King Lycaon",
  "Der Weise": "The Elder",
  "Verdammniswächter": "Doom Warden",
  "Lehrling": "Apprentice",
  "Wahnsinniger Kutscher": "Mad Coachman",
  "Korrupter Richter": "Corrupt Judge",
  "Märtyrerin": "Martyr",
  "Dorfwache": "Village Guard",
  "Pestbringerin": "Plague Bringer",
  "Prophet des Untergangs": "Prophet of Doom",
  "Spiegelwolf": "Mirror Wolf",
  "Dämonischer Wolf": "Demonic Wolf",
  "Trugbilderwolf": "Decoy Wolf",
  "Schattenhund": "Shadow Hound",
  "Besessener Wolf": "Possessed Wolf",
  "Fenrir": "Fenrir",
  "Kutscher": "Coachman",
  "Seelentauscher": "Soul Swapper",
  "Blutpriester": "Blood Priest",
  "Traumdeuter": "Dreamer",
  "Henker": "Executioner",
  "Feuerteufel": "Pyromaniac",
  "Voodoo-Priester": "Voodoo Priest",
  "Blutwolf": "Blood Wolf",
  "Albtraumwolf": "Nightmare Wolf",
  "Cerberus": "Cerberus",
  "Ritter": "Knight",
  "Rotkäppchen": "Little Red Riding Hood",
  "Selbstmörder": "Death Seeker",
  "Kopfgeldjäger": "Bounty Hunter",
  "König": "King",
  "Dr. Victor Frankenstein": "Dr. Victor Frankenstein",
  "Nekromant": "Necromancer",
  "Kartenschlucker": "The Collector",
  "Hades": "Hades",
  "Siegreicher Wolf": "Victorious Wolf",
  "Seuchenwolf": "Blight Wolf",
  "Schicksalswolf": "Fate Wolf",
  "Schattenwanderer": "Shadowwalker",
  "Giftwolf": "Poison Wolf",
  "Rudelvater": "Packfather",
  "Schwarze Witwe": "Black Widow",
  "Doktor": "Doctor",
  "Fährtenleser": "Tracker",
  "Waldläufer": "Ranger",
  "Schutzgeist": "Guardian Spirit",
  "Dorfchronistin": "Village Chronicler",
  "Wächter am Tor": "Gatewarden",
  "Zeitwächter": "Time Warden",
  "Amalia": "Amalia",
  "Kriegerin des Lichts": "Warrior of Light",
  "Detektiv": "Detective",
  "Dorfschmied": "Village Blacksmith",
  "Manipulator": "Manipulator",
  "Doppelspion": "Double Agent",
  "Grabräuber": "Grave Robber",
  "Parasit": "Parasite",
  "Todesprediger": "Death Prophet",
  "Dorfbewohner": "Villager"
};

window.ROLE_DESCRIPTIONS_EN = {
  "Loki": "Once per game: bind two souls as inseparable lovers — or curse two players as eternal rivals.",
  "Nachtwächter": "Guards the borders and senses when a neighbor doesn't belong to the village. The alarm bells ring publicly.",
  "Die Gebundenen": "Wake in night 1 and learn all other Bound players.",
  "Waldhexe": "Each night sees the fate of the victim and decides: once per game you can spare them or doom another player instead.",
  "Rattenfänger": "Charms players each night. Wins when all living players are charmed.",
  "Sensenträger": "Upon death: harvests one final soul of his choice.",
  "Wolfskind": "At the start of the game, choose an enemy. If they die, your animal blood awakens and you count as a werewolf from then on.",
  "Das Orakel": "Receives visions about roles or states of players.",
  "Die Ewigen": "Each night check whether a player has a solo win condition — and win together with them.",
  "Spürhund": "Choose 3 players. ✅ if one is a wolf, solo, or false lead — otherwise ❌.",
  "Schutzengel": "Each night, choose a player and protect them from the next werewolf attack.",
  "Werwolf": "Each night kills a victim together.",
  "Rachsüchtiger Wolf": "Everyone is your enemy. In addition to the werewolves, you wake up every third night and may kill another werewolf.",
  "König Lykaon": "In the first night, choose an allied wolf. Together you decide which villager is worthy of becoming one of you.",
  "Der Weise": "Thanks to your knowledge and preparation, you survive the first werewolf attack. However, if the village lynches you, they lose their abilities for 1–3 nights and days.",
  "Verdammniswächter": "Each night: chooses 1 of 2 players — either the night victim dies or a randomly offered player dies instead.",
  "Lehrling": "Chooses a mentor and takes over their role upon their death.",
  "Wahnsinniger Kutscher": "If lynched, both living neighbors die with him.",
  "Korrupter Richter": "Can mark a player for the day; they are automatically nominated with +1 vote.",
  "Märtyrerin": "Can sacrifice herself before the night victim is announced.",
  "Dorfwache": "Does not die when targeted by werewolves at night.",
  "Pestbringerin": "Each night spreads a lethal plague that keeps spreading.",
  "Prophet des Untergangs": "Marks three players. When all are dead, gains the ability to kill each night — and wins alone.",
  "Spiegelwolf": "On first lynch, the nominator dies instead of him.",
  "Dämonischer Wolf": "Curses victims so they appear as werewolves.",
  "Trugbilderwolf": "Deceives the Oracle with a random non-wolf role.",
  "Schattenhund": "Can once block all village abilities for one night.",
  "Besessener Wolf": "Upon death (with ≥5 players), drags another player to their death.",
  "Fenrir": "Grows more powerful with each survived night. From stage 3, survives any death once.",
  "Kutscher": "With 10+ dead: revives 3 dead players — one of them becomes a wolf.",
  "Seelentauscher": "Once swaps the roles of two players, regardless of whether they are alive or dead.",
  "Blutpriester": "Sacrifices someone and reveals 0–3 werewolves.",
  "Traumdeuter": "Receives visions about roles or states of players.",
  "Henker": "Activates after three lynchings. Each night marks a target who dies additionally after the next lynch.",
  "Feuerteufel": "Chooses a target; when the target dies, neighbors burn as well.",
  "Voodoo-Priester": "Gives a voodoo doll to a player. If he would die, the doll holder dies instead.",
  "Blutwolf": "Their vote counts +1 for each directly adjacent dead neighbor.",
  "Albtraumwolf": "Each night, blocks the ability of one villager.",
  "Cerberus": "Builds up to 3 heads; at 3 heads, can block a lynch.",
  "Ritter": "Upon dying at night, kills the nearest werewolf.",
  "Rotkäppchen": "Each night she seeks refuge with another player. If he grants it, he receives an apple: his next ability is executed twice. The two are also bound by a death chain — if one dies, the other dies with them.",
  "Selbstmörder": "Wins if lynched when >=5 players are already dead.",
  "Kopfgeldjäger": "Once a werewolf has been lynched, learns three names — one of them is a werewolf.",
  "König": "When more players are dead than alive: learns one living villager's identity.",
  "Dr. Victor Frankenstein": "Once revives a dead player who receives a brand new role.",
  "Nekromant": "With at least three dead players, he may spend three votes at night to raise a shield that prevents the next death of any kind; if unused, it expires when the next night begins. If attacked at night, he may instead sacrifice three dead players and redirect the kill. Wins alone if he correctly names a living werewolf during the day.",
  "Kartenschlucker": "Gains a stack each time a dead player exchanges their cards. At 10 stacks, wins immediately.",
  "Hades": "Collects life lights from the dead. Buys abilities and wins at 10 lights.",
  "Dorfbewohner": "Has no active night ability.",
  "Siegreicher Wolf": "As long as they live, counts as two werewolves toward the win condition.",
  "Seuchenwolf": "After their death, the next wolf attack pierces all protection effects.",
  "Schicksalswolf": "At the start of the game, choose three players. For each of them among the first three dead, you gain a kill ability in night 4.",
  "Schattenwanderer": "Creates a death link with another player. If one of you dies, the other dies instead — and vice versa.",
  "Giftwolf": "May twice per game attack a target with poison claws. The target is informed and dies two days later.",
  "Rudelvater": "Survives the first death not caused by a wolf attack or lynch. If lynched, the werewolves receive a second target the following night; this second attack ignores all protection.",
  "Schwarze Witwe": "Loki is chosen automatically. Each night, choose a player. If you find a lover or rival, both die.",
  "Doktor": "Each night takes blood samples from two players and learns whether they belong to the same team.",
  "Fährtenleser": "Wakes up every night and may once per game learn in which direction the nearest wolf sits: left or right.",
  "Waldläufer": "Learns how many living werewolves are in the game.",
  "Schutzgeist": "On the night after their death, chooses a player. That player receives a shield.",
  "Dorfchronistin": "Learns at the start of the game how many solo roles are in play.",
  "Wächter am Tor": "While alive, new werewolves are blocked — the affected player becomes a Villager instead.",
  "Zeitwächter": "Once per game, he may freeze a night — all night actions are canceled. That night is treated as though it never happened.",
  "Amalia": "Carries the will of Hestia. As long as more than two werewolves are in play, may sacrifice herself to publicly ask a yes/no question.",
  "Kriegerin des Lichts": "Once per game, attacks directly at night and chooses a player. The moderator reveals if that player is a wolf. If not a wolf, she dies.",
  "Detektiv": "After a wolf dies, a public clue about another wolf is revealed.",
  "Dorfschmied": "Forges a weapon over five nights. On the sixth night, he may give it to a player. That player repels one wolf attack and kills a random wolf in the process.",
  "Manipulator": "Wins if he reaches the final three without ever being nominated. The moment he is nominated, he dies immediately.",
  "Doppelspion": "Wakes up together with the werewolves. Wins alone when all werewolves are dead. The Revenge Wolf's attack has no effect on him.",
  "Grabräuber": "May once steal the ability of a dead player. Wins alone.",
  "Parasite": "Wakes each night and may attach himself to a living player. He only dies when his host dies. Wins if he reaches the final three.",
  "Todesprediger": "Predicts the exact night or day of his own death. If he is correct, he wins alone."
};

window.GRIMM_ROLE_TAGS = {
  "Dr. Victor Frankenstein": ["revive", "dead-interaction", "creates-wolf"],
  "Kutscher": ["revive", "dead-interaction", "creates-wolf"],
  "Lehrling": ["role-return", "dead-interaction"],
  "Wolfskind": ["death-trigger-transform", "creates-wolf", "dead-interaction"],
  "Wächter am Tor": ["blocks-new-wolves"],
  "Nekromant": ["solo-win", "vote-manipulation", "dead-interaction"],
  "Kartenschlucker": ["solo-win", "dead-interaction"],
  "Hades": ["solo-win", "dead-interaction"],
  "Loki": ["chain-reaction", "vote-manipulation"],
  "Rotkäppchen": ["chain-reaction", "dead-interaction"]
};

function getRoleTags(roleName){
  const r = String(roleName || "").trim();
  const m = window.GRIMM_ROLE_TAGS && window.GRIMM_ROLE_TAGS[r];
  return m && m.length ? m.slice() : [];
}

function roleHasTag(roleName, tag){
  if(!tag) return false;
  return getRoleTags(roleName).indexOf(tag) !== -1;
}

function anySeatHasRoleTag(tag, opts){
  const aliveOnly = !opts || opts.aliveOnly !== false;
  const seats = (typeof state !== "undefined" && state && state.seats) ? state.seats : [];
  return seats.some(function(s){
    if(!s || !s.role) return false;
    if(aliveOnly && s.flags && s.flags.dead) return false;
    return roleHasTag(s.role, tag);
  });
}

function anyLivingSeatHasRoleTag(tag){
  return anySeatHasRoleTag(tag, { aliveOnly: true });
}

function anyLivingSeatHasAnyRoleTags(tagList){
  if(!tagList || !tagList.length) return false;
  return tagList.some(function(t){ return anyLivingSeatHasRoleTag(t); });
}

window.getRoleTags = getRoleTags;
window.roleHasTag = roleHasTag;
window.anySeatHasRoleTag = anySeatHasRoleTag;
window.anyLivingSeatHasRoleTag = anyLivingSeatHasRoleTag;
window.anyLivingSeatHasAnyRoleTags = anyLivingSeatHasAnyRoleTags;

(function () {
  var tipEl = null;
  var tipTimer = null;
  var tipAttached = new WeakSet();
  function ensureTip() {
    if (!tipEl) {
      tipEl = document.createElement("div");
      tipEl.className = "tooltip-role";
      document.body.appendChild(tipEl);
    }
  }
  function positionTip(target, text) {
    ensureTip();
    if (!text) return;
    var r = target.getBoundingClientRect();
    tipEl.textContent = text;
    tipEl.style.left = r.right + 12 + window.scrollX + "px";
    tipEl.style.top = r.top + window.scrollY + "px";
    tipEl.classList.add("show");
  }
  function hideTip() {
    if (tipEl) tipEl.classList.remove("show");
  }
  window.attachRoleHoverTooltip = function (el) {
    if (!el || tipAttached.has(el)) return;
    var role = (el.getAttribute("data-role") || el.dataset.role || "").trim();
    function resolveDesc() {
      return window.getRoleDescription
        ? window.getRoleDescription(role)
        : window.ROLE_DESCRIPTIONS && window.ROLE_DESCRIPTIONS[role];
    }
    if (!role || !resolveDesc()) return;
    tipAttached.add(el);
    el.addEventListener("mouseenter", function () {
      tipTimer = setTimeout(function () {
        positionTip(el, resolveDesc());
      }, 500);
    });
    el.addEventListener("mouseleave", function () {
      if (tipTimer) {
        clearTimeout(tipTimer);
        tipTimer = null;
      }
      hideTip();
    });
  };
  window.hideRoleTooltip = function () {
    if (tipTimer) {
      clearTimeout(tipTimer);
      tipTimer = null;
    }
    hideTip();
  };
})();

const WOLF_ROLES_SET = new Set([
  "Werwolf","Rachsüchtiger Wolf","König Lykaon","Siegreicher Wolf","Seuchenwolf",
  "Schicksalswolf","Schattenwanderer","Giftwolf","Rudelvater","Schwarze Witwe",
  "Spiegelwolf","Dämonischer Wolf","Trugbilderwolf","Schattenhund","Besessener Wolf",
  "Fenrir","Blutwolf","Albtraumwolf","Cerberus"
]);

// Authoritative solo list — abilities-helpers.js references window.SOLO_WIN_ROLES instead of duplicating
const SOLO_ROLES_SET = window.SOLO_WIN_ROLES = new Set([
  "Selbstmörder","Rattenfänger","Pestbringerin","Prophet des Untergangs",
  "Feuerteufel","Voodoo-Priester","Hades","Kartenschlucker","Nekromant",
  "Manipulator","Doppelspion","Grabräuber","Parasit","Todesprediger"
]);

function getRoleFaction(name) {
  if (WOLF_ROLES_SET.has(name)) return "wolf";
  if (SOLO_ROLES_SET.has(name)) return "solo";
  return "dorf";
}

const _RP_IMG_EXCEPTIONS = {
  "Loki": "Loki_DE.png",
  "Dorfchronistin": "Dorfchronistin_DE.png",
  "Wahnsinniger Kutscher": "Wahnsinniger Kutscher.png",
  "Voodoo-Priester": "Voodoo_Priester.png"
};
function roleToImagePath(name) {
  const file = _RP_IMG_EXCEPTIONS[name] || (name.replace(/-/g, "_").replace(/ /g, "_") + ".png");
  return "assets/cards/de/" + file;
}

window.showRoleInfoPopup = function (role, desc) {
  if (window._roleInfoPopupDismiss) {
    document.removeEventListener("pointerdown", window._roleInfoPopupDismiss, true);
    window._roleInfoPopupDismiss = null;
  }
  var old = document.getElementById("roleInfoPopup");
  if (old) old.remove();
  var popup = document.createElement("div");
  popup.id = "roleInfoPopup";
  var title = document.createElement("div");
  title.className = "rip-title";
  title.textContent = role;
  var body = document.createElement("div");
  body.className = "rip-desc";
  body.textContent = desc || "";
  popup.appendChild(title);
  popup.appendChild(body);
  document.body.appendChild(popup);
  function onDoc() {
    document.removeEventListener("pointerdown", onDoc, true);
    window._roleInfoPopupDismiss = null;
    var p = document.getElementById("roleInfoPopup");
    if (p) p.remove();
  }
  window._roleInfoPopupDismiss = onDoc;
  setTimeout(function () {
    document.addEventListener("pointerdown", onDoc, true);
  }, 50);
};

