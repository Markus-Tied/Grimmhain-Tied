/** Escaped HTML für sichere innerHTML-Nutzung (Spielernamen, Kartentexte). */
function escapeHtml(s){
  if(s==null||s==="") return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
window.escapeHtml = escapeHtml;

function isWolf(seat){
  if(!seat) return false;
  const role=(seat.role||"")+"";
  const meta=seat.meta||{};
  const flags=seat.flags||{};
  if(role==="Doppelspion"||role==="Manipulator"||role==="Parasit"||role==="Grabräuber"||role==="Todesprediger") return false;
  return !!flags.werewolf || /wolf/i.test(role) || role==="Schattenhund" || role==="König Lykaon" || role==="Schattenwanderer" || role==="Schwarze Witwe" || !!meta.cursedWolfAura;
}

function countLivingWolfPower(){
  const alive=(state.seats||[]).filter(s=>!s.flags.dead);
  let p=0;
  alive.forEach(s=>{
    if(!isWolf(s)) return;
    p += (s.role==="Siegreicher Wolf") ? 2 : 1;
  });
  return p;
}

function gatewardenBlocksNewWolves(){
  return (state.seats||[]).some(s=>!s.flags.dead && s.role==="Wächter am Tor");
}

function grimmLivingRoleInRound(roleName){
  if(!roleName||!state||!state.seats)return false;
  return state.seats.some(s=>s&&s.role===roleName&&s.flags&&!s.flags.dead);
}
window.grimmLivingRoleInRound=grimmLivingRoleInRound;

function applyRoleOrVillagerIfGatewardenWolf(seat, intendedRole, asWerewolf){
  if(!seat) return;
  const probe = {role:intendedRole, flags:{werewolf:!!asWerewolf}, meta:seat.meta||{}};
  const wolfish = typeof isWolf==="function" && isWolf(probe);
  if(wolfish && gatewardenBlocksNewWolves()){
    seat.role = "Dorfbewohner";
    seat.flags.werewolf = false;
    if(seat.meta) seat.meta.cursedWolfAura = false;
    try{ if(typeof center==="function") center((window.t&&window.t("gatewardenRedirectVillager"))||"Wächter am Tor: Neue Werwölfe sind blockiert. Der Spieler wird stattdessen zum Dorfbewohner.", false); }catch(e){}
    return;
  }
  seat.role = intendedRole;
  if(!!asWerewolf) seat.flags.werewolf = true;
  else if(typeof isWolf==="function" && isWolf({role:intendedRole, flags:{werewolf:false}, meta:seat.meta||{}})) seat.flags.werewolf = true;
  else seat.flags.werewolf = false;
}

function rotkppchenShelterLinkActive(a,b){
  if(!a||!b) return false;
  if(a.role==="Rotkäppchen"||b.role==="Rotkäppchen") return true;
  if(a.meta&&a.meta.appleBuff) return true;
  if(b.meta&&b.meta.appleBuff) return true;
  return false;
}

function detectiveEmitPublicClue(){
  try{
    if(!grimmLivingRoleInRound("Detektiv")) return;
    const wolves=(state.seats||[]).filter(s=>!s.flags.dead && isWolf(s));
    if(wolves.length<2) return;
    const w=wolves[Math.floor(Math.random()*wolves.length)];
    const n=state.seats.length;
    const idx=w.id-1;
    const left=wolves.filter(x=>x.id!==w.id && ((x.id-1+n)%n)===(idx-1+n)%n);
    const right=wolves.filter(x=>x.id!==w.id && ((x.id-1+n)%n)===(idx+1)%n);
    let hint="";
    if(left.length) hint=(window.t&&window.t("detectiveClueLeft"))||("Detektiv-Hinweis: Ein anderer Wolf sitzt links neben "+(w.name||("#"+w.id))+".");
    else if(right.length) hint=(window.t&&window.t("detectiveClueRight"))||("Detektiv-Hinweis: Ein anderer Wolf sitzt rechts neben "+(w.name||("#"+w.id))+".");
    else hint=(window.t&&window.t("detectiveClueParity"))||("Detektiv-Hinweis: Ein anderer lebender Wolf hat eine andere Sitz-Parität (gerade/ungerade) als "+(w.name||("#"+w.id))+".");
    if(typeof center==="function") center(hint,true);
    if(window.gameLog&&typeof gameLog.add==="function") gameLog.add("🔍",hint);
  }catch(e){}
}

function triggerWin(roleName,seat){
  const name=seat?(seat.name||("#"+seat.id)):"?";
  let shownRole = window.getRoleName ? window.getRoleName(roleName) : roleName;
  if(roleName==="Dorf") shownRole=(window.t&&window.t("villageTeam"))||"Dorfbewohner";
  if(roleName==="Werwölfe") shownRole=(window.t&&window.t("wolfTeam"))||"Werwölfe";
  try{
    state.once=state.once||{};
    if(roleName==="Dorf") state.once.TeamWinner="village";
    else if(roleName==="Werwölfe") state.once.TeamWinner="wolves";
    else state.once.TeamWinner="solo_"+roleName;
  }catch(e){}
  const winWord=(window.t&&window.t("wins"))||"gewinnt!";
  showWinBanner(shownRole+" "+winWord);
  const winBanner=(window.t&&window.t("winsBanner"))||"GEWINNT!";
  center("🏆 "+shownRole.toUpperCase()+" "+winBanner+"\n"+name,true);
}

function applyKill(seat,cause){
  if(!seat||!seat.flags||seat.flags.dead)return false;
  state.once=state.once||{};
  try{
    if(seat.role==="Parasit"){
      const hid=seat.meta&&seat.meta.parasiteHostId;
      const host=hid?state.seats.find(x=>x.id===hid):null;
      if(host&&!host.flags.dead&&cause!=="PARASITE_HOST")return false;
    }
    if(seat.role==="Rudelvater"&&!state.once.RudelvaterSavedOnce){
      if(cause!=="NIGHT_KILL"&&cause!=="LYNCH"&&cause!=="PACKFATHER_KILL"){
        state.once.RudelvaterSavedOnce=true;
        if(typeof center==="function")center((window.t&&window.t("rudelvaterSurvived"))||"Rudelvater überlebt den ersten Tod durch eine Sonderfähigkeit.",true);
        return false;
      }
    }
    if(seat.meta&&seat.meta.shadowSwapPartnerId&&!state.once._shadowApplying){
      const partner=state.seats.find(x=>x.id===seat.meta.shadowSwapPartnerId);
      if(partner&&!partner.flags.dead){
        state.once._shadowApplying=true;
        try{return applyKill(partner,cause);}finally{delete state.once._shadowApplying;}
      }
    }
  }catch(e){}
  state.once=state.once||{};
  if(state.once.TotenratDeathImmunityPending&&cause!=="PACKFATHER_KILL"){
    state.once.TotenratDeathImmunityPending=false;
    if(typeof center==="function"){
      try{ center((window.t&&window.t("shieldTotenratDeathBlocked"))||"Nekromant: Schild wehrt den Tod ab — totale Immunität verbraucht.", true); }catch(e){}
    }
    return false;
  }
  if(seat.role==="Kartenschlucker"&&state.once.KartenschluckerShield&&cause!=="PACKFATHER_KILL"){
    state.once.KartenschluckerShield=false;
    if(typeof center==="function") center((window.t&&window.t("shieldKartenschlucker"))||"🛡️ Kartenschlucker — Schutzschild absorbiert den Tod!",true);
    return false;
  }
  if(seat.role==="Hades"&&state.once.HadesBarriere&&cause!=="PACKFATHER_KILL"){
    state.once.HadesBarriere=false;
    if(typeof center==="function") center((window.t&&window.t("shieldHades"))||"🛡️ Hades — Barriere absorbiert den Tod!",true);
    return false;
  }
  if(!seat.meta)seat.meta={};
  seat.meta.lastKillCause=cause;
  seat.flags.dead=true;
  try{
    if(seat.role==="Seuchenwolf") state.once.SeuchenwolfNextAttackPierces=true;
    state.once.FirstThreeDeadIds=state.once.FirstThreeDeadIds||[];
    if(state.once.FirstThreeDeadIds.length<3) state.once.FirstThreeDeadIds.push(seat.id);
    if((seat.role||"")==="Schutzgeist") state.once.SchutzgeistAwaitingPick=true;
    if(isWolf(seat)&&seat.role!=="Doppelspion") detectiveEmitPublicClue();
    if(seat.role==="Todesprediger"&&state.once.TodespredigerPrediction){
      const pr=state.once.TodespredigerPrediction;
      let hit=false;
      if(pr.t==="night"&&typeof state.nightCount==="number"&&pr.n===state.nightCount) hit=true;
      if(pr.t==="day"&&typeof state.once.MorningCount==="number"&&pr.n===state.once.MorningCount) hit=true;
      if(hit) triggerWin("Todesprediger",seat);
    }
  }catch(e){}
  try{
    state.seats.forEach(p=>{
      if(p.role==="Parasit"&&!p.flags.dead&&p.meta&&p.meta.parasiteHostId===seat.id){
        applyKill(p,"PARASITE_HOST");
      }
    });
  }catch(e){}
  try{
    if(seat.meta&&seat.meta.rkLink){
      const partner=state.seats.find(x=>x.id===seat.meta.rkLink);
      if(partner&&!partner.flags.dead&&partner.meta&&partner.meta.rkLink===seat.id&&rotkppchenShelterLinkActive(seat,partner)){
        applyKill(partner,"RED_RIDING_HOOD_LINK");
      }
    }
  }catch(e){}
  try {
    if(seat.role==="Besessener Wolf"){
      const aliveNow = state.seats.filter(s=>!s.flags.dead).length;
      if(aliveNow>=4 && typeof startPick==="function"){
        startPick("Besessener Wolf – reißt 1 mit", s=>{
          if(!s.flags.dead){ applyKill(s,"BESESSENER_WOLF"); }
          save(); draw(); if(typeof postDeathHooks==="function") postDeathHooks();
        }, x=>!x.flags.dead && x!==seat);
      }
    }
  }catch(e){}
  try {
    if (typeof zieheZufallsKarte === "function") {
      state.once = state.once || {};
      state.once.totenkarten = state.once.totenkarten || {};
      const neueKarte = zieheZufallsKarte(seat);
      state.once.totenkarten[seat.id] = {
        karteId: neueKarte.id,
        gespielt: false,
        shown: false
      };
    }
  } catch(e) {}
  try{
    const hades=state.seats.find(s=>s.role==="Hades"&&!s.flags.dead);
    if(hades){ state.once.HadesLichter=(state.once.HadesLichter||0)+1; if(typeof checkHadesWin==="function") checkHadesWin(); }
  }catch(e){}
  try{
    if(typeof checkWinConditions==="function") checkWinConditions();
  }catch(e){}
  return true;
}

function checkWinConditions() {
  try{
    if(!state||!state.seats) return;
    state.once = state.once || {};
    if(state.once.TeamWinner) return;
    const alive = state.seats.filter(s => !s.flags.dead);
    const villagers = alive.filter(s => !isWolf(s));
    const wolfPower = countLivingWolfPower();
    const trueWolves = alive.filter(s => isWolf(s));
    if(trueWolves.length === 0){
      const da=alive.find(s=>s.role==="Doppelspion");
      if(da) triggerWin("Doppelspion", da);
      else triggerWin("Dorf", null);
      return;
    }
    if(wolfPower >= villagers.length) triggerWin("Werwölfe", null);
    const m=alive.find(s=>s.role==="Manipulator");
    if(m&&alive.length===3&&!state.once.ManipulatorWasNominated) triggerWin("Manipulator", m);
    const par=alive.find(s=>s.role==="Parasit");
    if(par&&alive.length===3) triggerWin("Parasit", par);
  }catch(e){}
}

function checkKartenschluckerWin(){
  try{ if(!state||!state.seats||state.once.TeamWinner) return;
    const ks=state.seats.find(s=>s.role==="Kartenschlucker"&&!s.flags.dead);
    if(!ks) return;
    if((state.once.KartenschluckerStapel||0)>=10) triggerWin("Kartenschlucker",ks);
  }catch(e){}
}

function checkHadesWin(){
  try{
    if(!state||!state.seats||state.once.TeamWinner) return;
    const hades=state.seats.find(s=>s.role==="Hades"&&!s.flags.dead);
    if(!hades) return;
    if((state.once.HadesLichter||0)>=10){
      triggerWin("Hades", hades);
    }
  }catch(e){}
}

function ensureHunterQueue(){
  try{ state.once=state.once||{}; if(!Array.isArray(state.once.hunterQueue)) state.once.hunterQueue=[] }catch(e){}
}

function checkPestWin(){
  if(state.once.PestWon)return;
  const alive=state.seats.filter(s=>!s.flags.dead);
  if(alive.length&&alive.every(s=>s.flags.poisoned)){
    state.once.PestWon=true;
    try{ state.once.TeamWinner="solo_Pestbringerin"; }catch(e){}
    showWinBanner((window.getRoleName?window.getRoleName("Pestbringerin"):"Pestbringerin")+" "+((window.t&&window.t("wins"))||"gewinnt!"));
  }
}

function checkFluteWin(){
  if(!state||!state.seats)return;
  const flute=state.seats.find(s=>!s.flags.dead&&s.role==="Rattenfänger");
  if(!flute)return;
  const alive=state.seats.filter(s=>!s.flags.dead&&s!==flute);
  if(!alive.length)return;
  if(!alive.every(s=>s.flags.charmed))return;
  try{ state.once=state.once||{}; state.once.TeamWinner="solo_Rattenfänger"; }catch(e){}
  showWinBanner((window.getRoleName?window.getRoleName("Rattenfänger"):"Rattenfänger")+" "+((window.t&&window.t("wins"))||"gewinnt!"));
}

function checkTeamWin(){
  try{
    if(!state||!state.seats)return;
    state.once=state.once||{};
    if(state.once.TeamWinner) return;              // schon entschieden
    if(state.once.PestWon) return;                 // spezielle Einzelsiege haben Vorrang

    const isWolfSeat=s=>{
      if(!s||s.flags.dead) return false;
      const role=(s.role||"")+"";
      if(role==="Doppelspion"||role==="Manipulator"||role==="Parasit"||role==="Grabräuber"||role==="Todesprediger") return false;
      return s.flags.werewolf || /wolf/i.test(role) || role==="König Lykaon" || role==="Schattenwanderer" || role==="Schwarze Witwe" || (s.meta && s.meta.cursedWolfAura);
    };
    const hasRealRole=s=>((s.role||"").trim()!=="");

    const alive=state.seats.filter(s=>!s.flags.dead);
    if(!alive.length) return;

    // Erst werten, wenn im Spielverlauf mindestens 1 Wolf- und 1 Nicht-Wolf-Rolle vergeben wurden
    const assigned=state.seats.filter(hasRealRole);
    if(!assigned.length) return;
    // hier bewusst OHNE Dead-Check: es reicht, dass diese Rollen KONFIGURIERT wurden
    const anyWolfAssigned=assigned.some(s=>{
      const role=(s.role||"")+"";
      if(role==="Doppelspion"||role==="Manipulator"||role==="Parasit"||role==="Grabräuber"||role==="Todesprediger") return false;
      return s.flags.werewolf || /wolf/i.test(role) || role==="König Lykaon" || role==="Schattenwanderer" || role==="Schwarze Witwe" || (s.meta && s.meta.cursedWolfAura);
    });
    const anyOtherAssigned=assigned.some(s=>{
      const role=(s.role||"")+"";
      if(role==="Doppelspion"||role==="Manipulator"||role==="Parasit"||role==="Grabräuber"||role==="Todesprediger") return true;
      return !(s.flags.werewolf || /wolf/i.test(role) || role==="König Lykaon" || role==="Schattenwanderer" || role==="Schwarze Witwe" || (s.meta && s.meta.cursedWolfAura));
    });
    if(!(anyWolfAssigned && anyOtherAssigned)) return;

    const wolves=alive.filter(s=>isWolfSeat(s) && hasRealRole(s));
    const others=alive.filter(s=>!isWolfSeat(s) && hasRealRole(s));
    let wolfPower=0;
    wolves.forEach(s=>{ wolfPower += (s.role==="Siegreicher Wolf")?2:1; });

    if(wolves.length===0 && others.length>0){
      const da=others.find(s=>s.role==="Doppelspion");
      if(da){
        state.once.TeamWinner="solo_Doppelspion";
        showWinBanner((window.getRoleName?window.getRoleName("Doppelspion"):"Doppelspion")+" "+((window.t&&window.t("wins"))||"gewinnt!"));
        return;
      }
      state.once.TeamWinner="village";
      showWinBanner((window.t&&window.t("villageWins"))||"Dorfbewohner gewinnen!");
      return;
    }
    if(others.length===0 && wolves.length>0){
      state.once.TeamWinner="wolves";
      showWinBanner((window.t&&window.t("wolvesWin"))||"Werwölfe gewinnen!");
      return;
    }
    if(wolfPower>=others.length && others.length>0 && wolves.length>0){
      state.once.TeamWinner="wolves";
      showWinBanner((window.t&&window.t("wolvesWin"))||"Werwölfe gewinnen!");
      return;
    }
    try{ checkKartenschluckerWin(); }catch(e){}
  }catch(e){}
}

function resetOnceForInheritedRole(role){
  state.once = state.once || {};
  const k = role + "Used";
  if (k in state.once) delete state.once[k];

  if (role === "Waldhexe") { state.once.WaldhexeL = false; state.once.WaldhexeD = false; }
  if (role === "Wolfskind") { delete state.once.MogliVorbildId; delete state.once.MogliUsed; }
  if (role === "König Lykaon") {
    delete state.once.UrwolfUsed;
    state.once.Used = state.once.Used || {};
    try {
      delete state.once.Used[usedKey("Urwolf")];
      delete state.once.Used[usedKey("König Lykaon")];
    } catch (e) {}
  }
  if (role === "Kopfgeldjäger") { state.once.BountyHunterActive = true; delete state.once.KopfgeldjägerUsed; }
  if (role === "Seelentauscher") { delete state.once.SeelentauscherUsed; }
  if (role === "Blutpriester") { delete state.once.BlutpriesterUsed; }
  if (role === "Dr. Victor Frankenstein") { state.once.FrankensteinUsed = false; }
  if (role === "Kutscher") { delete state.once.KutscherUsed; }
}

function postDeathHooks(){
  runDeathHooks()

    let loversTriggered=false;
  (function(){
    if(typeof isOnceUsed!=="function"||!isOnceUsed("Loki")) return;
    let changed;
    do{
      changed=false;
      const deadIds = new Set(state.seats.filter(a=>a.flags.dead).map(a=>a.id));
      [...state.seats].forEach(d=>{
        if(!d.flags.dead||!d.flags.inlove||!d.meta||!d.meta.loverId) return;
        const p=state.seats.find(z=>z.id===d.meta.loverId);
        if(!p||p.flags.dead||!p.flags.inlove||!p.meta||p.meta.loverId!==d.id) return;
        applyKill(p,"LOVER_HEARTBREAK"); changed=true; loversTriggered=true;
      });
      [...state.seats].forEach(p=>{
        if(p.flags.dead||!p.flags.inlove||!p.meta||!p.meta.loverId||!deadIds.has(p.meta.loverId)) return;
        const d=state.seats.find(z=>z.id===p.meta.loverId);
        if(!d||!d.flags.dead||!d.flags.inlove||!d.meta||d.meta.loverId!==p.id) return;
        applyKill(p,"LOVER_HEARTBREAK"); changed=true; loversTriggered=true;
      });
    }while(changed);
  })();
  if(loversTriggered){ queueSfxKey("sfxLovers"); try{ center((window.t&&window.t("loverHeartbreakCenter"))||"Verliebte – der/die andere stirbt aus Kummer", true) }catch(e){} }
const mogli=state.seats.find(s=>s.role==="Wolfskind"&&!s.flags.dead)
  if(mogli&&state.once.MogliVorbildId){const v=state.seats.find(s=>s.id===state.once.MogliVorbildId);if(v&&v.flags.dead){if(typeof gatewardenBlocksNewWolves==="function"&&gatewardenBlocksNewWolves()){mogli.role="Dorfbewohner";mogli.flags.werewolf=false;mogli.flags.vorbild=false;try{ if(typeof center==="function") center((window.t&&window.t("gatewardenRedirectVillager"))||"Wächter am Tor: Neue Werwölfe sind blockiert. Der Spieler wird stattdessen zum Dorfbewohner.", false); }catch(e){}}else{mogli.flags.werewolf=true}}}
  if(state.once.LehrlingMentorId){const l=state.seats.find(s=>s.role==="Lehrling");const m=state.seats.find(s=>s.id===state.once.LehrlingMentorId);if(l&&m&&m.flags.dead&&l.role==="Lehrling"){const mentorIsWolf=isWolf(m);if(mentorIsWolf&&typeof gatewardenBlocksNewWolves==="function"&&gatewardenBlocksNewWolves()){l.role="Dorfbewohner";l.flags.werewolf=false;resetOnceForInheritedRole(l.role);rebuildOrder()}else{l.role=m.role;if(mentorIsWolf)l.flags.werewolf=true;resetOnceForInheritedRole(l.role);rebuildOrder()}}}
  try{
    if(state && state.seats){
      const isNight = !!state.dark;
      state.seats.forEach(s=>{
        const role = (s.role||"").trim();
        if(!/^Sensenträger$/i.test(role)) return;
        if(!s.flags || !s.flags.dead) return;
        s.meta = s.meta || {};
        if(s.meta.hunterShot) return;
        if(isNight){
          if(typeof window.__queueHunterOnDeath==="function"){
            window.__queueHunterOnDeath(s);
          }
        }else{
          if(typeof triggerHunterOnce==="function"){
            triggerHunterOnce(s);
          }
        }
      });
    }
  }catch(e){}
  try{ maybeShowTodenkarten(); }catch(e){}
  doBearPing()
}

function findNearestWolf(id){
  const n=state.seats.length
  const isWolfLocal=x=>x&&!x.flags.dead&&(x.flags.werewolf||/wolf/i.test(x.role)||(x.meta&&x.meta.cursedWolfAura))
  const ok=x=>isWolfLocal(x)&&!(x.role==="Fenrir"&&state.fenrirStage>=2)
  for(let d=1;d<n;d++){
    const L=state.seats[(id-1-d+n)%n],R=state.seats[(id-1+d)%n]
    if(ok(L)) return L
    if(ok(R)) return R
  }
  return null
}

function spreadPoison(){
  const alive=state.seats.filter(s=>!s.flags.dead&&s.flags.poisoned)
  alive.forEach(p=>{const n=state.seats.length,i=p.id-1;const opts=[state.seats[(i-1+n)%n],state.seats[(i+1)%n]].filter(x=>x&&!x.flags.dead&&!x.flags.poisoned);if(opts.length){opts[Math.floor(Math.random()*opts.length)].flags.poisoned=true}})
}
