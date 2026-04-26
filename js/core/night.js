// night.js – Nacht-/Tag-Logik, Lynch, Order, Sterne (rely on global: state, $, ORDER_BASE, save, draw, etc.)

function usedKey(k){return "role_"+String(k).replace(/\s+/g,"_")}
function isOnceUsed(k){if(state.ui&&state.ui.ghostCasting)return false;state.once=state.once||{};state.once.Used=state.once.Used||{};var uk=usedKey(k);return !!(state.once.Used[uk]||state.once[uk]||state.once[k]);}
function markOnceUsed(k){if(state.ui&&state.ui.ghostCasting)return;state.once=state.once||{};state.once.Used=state.once.Used||{};var uk=usedKey(k);state.once.Used[uk]=true;}
function rolesInGame(){return new Set(state.seats.filter(s=>s.role && !s.flags.dead).map(s=>s.role))}

function getFaction(roleName) {
  const r = String(roleName || "");
  const wolves = [
    "Werwolf","Rachsüchtiger Wolf","König Lykaon","Siegreicher Wolf","Seuchenwolf","Schicksalswolf","Schattenwanderer","Giftwolf","Rudelvater","Schwarze Witwe","Spiegelwolf",
    "Dämonischer Wolf","Trugbilderwolf","Schattenhund",
    "Besessener Wolf","Fenrir","Blutwolf","Albtraumwolf"
  ];
  const solos = [
    "Rattenfänger","Pestbringerin","Hades","Selbstmörder",
    "Prophet des Untergangs","Feuerteufel","Voodoo-Priester",
    "Kartenschlucker","Nekromant",
    "Dr. Victor Frankenstein","Kutscher",
    "Manipulator","Doppelspion","Grabräuber","Parasit","Todesprediger"
  ];
  if (wolves.some(w => r.toLowerCase().includes(w.toLowerCase()))) return "wolf";
  if (solos.includes(r)) return "solo";
  return "dorf";
}

function getFactionIcon(faction) {
  const map = {
    wolf: "assets/icons/game/wolficon.png",
    dorf: "assets/icons/game/villageicon.png",
    solo: "assets/icons/game/soloicon.png"
  };
  return map[faction] || "assets/icons/game/villageicon.png";
}

function rebuildOrder(){
  // nightCount/fenrirStage nur in onNightStart bzw. beim Nacht-Ende (afterCurses) ändern – nicht bei jedem rebuildOrder-Aufruf (verhinderte Tag 23 / Nacht 27 Bug)
  if(typeof state.nightCount!=="number") state.nightCount=1;
  document.getElementById('nightCounter')?.remove();
  const orderList=document.getElementById('order');
  if(!orderList) return;
  orderList.innerHTML="";
  const hasReviveRole = typeof window.anyLivingSeatHasAnyRoleTags==="function"
    ? window.anyLivingSeatHasAnyRoleTags(window.GRIMM_DEATHCARD_LEGACY_REVIVE_TAGS||["revive","role-return","death-trigger-transform"])
    : (state.seats||[]).some(s=>!s.flags.dead&&["Dr. Victor Frankenstein","Kutscher","Lehrling","Wolfskind"].includes(s.role));
  const hasDeadWithTotenkarte = (state.seats||[]).some(s => s.flags.dead && state.once && state.once.totenkarten && state.once.totenkarten[s.id] && !state.once.totenkarten[s.id].gespielt);
  if(hasReviveRole && hasDeadWithTotenkarte){
    const hint=document.createElement("div");
    hint.className="revive-totenkarten-hint";
    hint.style.cssText="color:#C9A84C;font-weight:bold;font-size:0.9em;margin-bottom:10px;padding:8px;background:rgba(201,168,76,0.12);border-radius:8px;border:1px solid #C9A84C;";
    hint.textContent=window.t ? window.t("reviveNightHint") : "⚠ Wiederbelebung möglich — Tote halten diese Nacht die Augen geschlossen";
    orderList.appendChild(hint);
  }
  const rig=rolesInGame()
  const hasAliveRole = role => (state.seats||[]).some(s=>s.role===role && !s.flags.dead);
  const deadCount=state.seats.filter(s=>s.flags.dead).length
  const dynamic=[]
  const WOLF_KILL_ROLES = new Set(["Rachsüchtiger Wolf","König Lykaon","Spiegelwolf","Dämonischer Wolf","Trugbilderwolf","Besessener Wolf","Fenrir","Blutwolf","Albtraumwolf","Cerberus"]);
  const noBaseWolf = !rig.has("Werwolf");
  const hasOtherWolf = [...WOLF_KILL_ROLES].some(r => rig.has(r));
  if(noBaseWolf && hasOtherWolf) {
    dynamic.push({r:"Werwolf", tier:2.0});
  }
  ORDER_BASE.forEach(o=>{

    if(!rig.has(o.r))return
    if(o.r==="Henker"&&state.once.LynchCount<3)return
    if(o.once&&isOnceUsed(o.r))return
    if(o.r==="Dr. Victor Frankenstein" && state.once && state.once.FrankensteinUsed) return
    if(o.r==="Schicksalswolf"){
      state.once=state.once||{};
      const nc=state.nightCount||1;
      if(nc===1&&state.once.FateWolfMarked&&state.once.FateWolfMarked.length>=3)return;
      if(nc>1&&nc<4)return;
      if(nc>=4){
        if(state.once.FateWolfNight4Used)return;
        const marks=state.once.FateWolfMarked||[];
        const f3=(state.once.FirstThreeDeadIds||[]).slice(0,3);
        if(!marks.filter(id=>f3.includes(id)).length)return;
      }
    }
    if(o.r==="Prophet des Untergangs"){
      try{
        const once = state.once||{}; const arr = once.ProphetTargets; const unlocked = !!once.ProphetUnlocked;
        if(Array.isArray(arr) && arr.length===3 && !unlocked){
          const allDead = arr.every(id => (state.seats||[]).find(s=>s.id===id)?.flags?.dead);
          if(!allDead) return
        }
      }catch(e){}
    }
    if(o.r==="Kutscher" && (deadCount < 10 || state.once.KutscherUsed)) return
    dynamic.push(o)
  })
  const anyAliveWolf = (state.seats||[]).some(s=>!s.flags.dead && isWolf(s));
dynamic.sort((a,b)=>a.tier-b.tier).forEach(o=>{
    if(o.r==="Werwolf"){
      if(!anyAliveWolf) return;
    }else{
      if(o.r==="Schutzgeist"){
        if(!state.seats.some(s=>s.role==="Schutzgeist"&&s.flags.dead&&state.once&&state.once.SchutzgeistAwaitingPick))return;
      }else if(!hasAliveRole(o.r))return;
    }
    const passive=new Set(["Sensenträger","Nachtwächter","Die Ewigen","Cerberus","Der Weise","Wahnsinniger Kutscher","Ritter","Selbstmörder","Dorfwache","Siegreicher Wolf","Seuchenwolf","Rudelvater","Wächter am Tor","Detektiv","Doppelspion","Manipulator"])
    if(passive.has(o.r))return
    const row=document.createElement("div")
    row.className="slot night-order-row night-order-chip";row.dataset.role=o.r
    const faction = getFaction(o.r);
    const iconSrc = getFactionIcon(faction);
    const displayName = window.getRoleName ? window.getRoleName(o.r) : o.r;
    row.dataset.faction = faction;
    const esc = typeof escapeHtml === "function" ? escapeHtml : function (x) { return String(x || ""); };
    row.innerHTML = `<span class="night-order-dot"></span><img class="slot-faction-icon night-order-icon" src="${iconSrc}" alt="${faction}" onerror="this.style.opacity='0'"><span class="name night-order-name">${esc(displayName)}</span><span class="info-btn night-order-trailing" data-role="${esc(o.r)}">❓</span>`;
    row.onclick=(e)=>{
      if(e.target.classList.contains('info-btn')) return;
      onOrderClick(o.r);
    }
    row.querySelector('.info-btn').addEventListener('click', function(e){
      e.stopPropagation();
      const desc = window.getRoleDescription ? window.getRoleDescription(o.r) : ((window.ROLE_DESCRIPTIONS && window.ROLE_DESCRIPTIONS[o.r]) || "Keine Beschreibung verfügbar.");
      window.showRoleInfoPopup(window.getRoleName ? window.getRoleName(o.r) : o.r, desc);
    });
    row.querySelector('.info-btn').addEventListener('touchstart', function(e){
      e.stopPropagation();
      const desc = window.getRoleDescription ? window.getRoleDescription(o.r) : ((window.ROLE_DESCRIPTIONS && window.ROLE_DESCRIPTIONS[o.r]) || "Keine Beschreibung verfügbar.");
      window.showRoleInfoPopup(window.getRoleName ? window.getRoleName(o.r) : o.r, desc);
    }, {passive:true});
    try{
      state.once = state.once || {};
      var usedList = Array.isArray(state.once.NightUsedRoles) ? state.once.NightUsedRoles : [];
      if(usedList.includes(o.r)) row.classList.add("night-used");
    }catch(e){}
    orderList.appendChild(row)
  })
}

function onNightStart(){
  if(typeof state.nightCount!=="number") state.nightCount=1;
  const fenrirAlive=(state.seats||[]).some(s=>s.role==="Fenrir"&&!s.flags.dead); if(fenrirAlive) state.fenrirStage=Math.min(3,(state.fenrirStage||0)+1);
  state.once = state.once || {};
  state.once.SchattenhundBlocked=false;
  state.once.WhiteWolfCooldown = Math.max(0,(state.once.WhiteWolfCooldown||0)-1);
  if(state.once.TotenratDeathImmunityPending){
    state.once.TotenratDeathImmunityPending=false;
    try{ if(typeof center==="function") center((window.t&&window.t("totenratShieldExpiredNight"))||"Nekromant: Der Schild verfällt mit Beginn der nächsten Nacht.", false); }catch(e){}
  }
  state.seats.forEach(s=>{s.flags.protected=(s.role==="Der Weise")?s.flags.protected:false;s.flags.targeted=false;s.flags.nominated=false;s.flags.burned=false;s.meta.blockedTonight=false;s.meta.killedTonight=false})
  state.seats.forEach(s=>{ if(s.meta) delete s.meta.packfatherPierce; })
  state.once.BlockedRolesTonight=[]
  state.seats.forEach(s=>{if(s.role==="Cerberus"&&!s.flags.dead){s.meta.cerbHeads=Math.min(3,(s.meta.cerbHeads||0)+1)}})
  var nightSrc = (state.files && state.files.night) ? state.files.night : (typeof SOUNDS_BASE !== "undefined" ? SOUNDS_BASE + "Nachtmusik.mp3" : "assets/sounds/Nachtmusik.mp3");
  if (nightSrc) {
    nightAudio.src = nightSrc;
    nightAudio.currentTime = (state.files && state.files.nightPos != null) ? state.files.nightPos : 0;
    nightAudio.play().catch(function(){});
  }
  document.body.classList.remove("is-day")
  applyBg(false)
  state.once.PestUsedTonight=false
  state.once.WhiteWolfUsedTonight=false
  state.once.ProphetKillUsedTonight=false
  state.once._kartenschluckerNightProcessed=false
  if((state.seats||[]).some(s=>s.role==="Dorfschmied"&&!s.flags.dead)){
    state.once.SchmiedForgeNights=Math.min(6,(state.once.SchmiedForgeNights||0)+1);
  }
  try{
    const lb=document.getElementById('lynchBtn');
    if(lb){lb.style.opacity='0.2';lb.style.pointerEvents='none';}
  }catch(e){}
  try{
    if(window.gameLog && typeof gameLog.add==="function"){
      const nc = typeof state.nightCount==="number" ? state.nightCount : "";
      gameLog.add("🌙", window.tf ? window.tf("logNightBegins", { n: nc }) : ("Nacht " + nc + " beginnt"));
    }
  }catch(e){}
  save();draw()
}

function onDayStart(){
  try {
    if (typeof nightAudio !== "undefined" && nightAudio.src) {
      state.files = state.files || {};
      state.files.nightPos = nightAudio.currentTime;
      try { save(); } catch(e) {}
      nightAudio.pause();
    }
  } catch(e) {}
  try { document.body.classList.add("is-day"); applyBg(true); } catch(e) {}

  state._allowBearPing = true;
  state._bearPingDone = false;
  state.once.MorningCount=(state.once.MorningCount||0)+1;
  try{
    const wk=state.once.WidowMorningKills;
    if(Array.isArray(wk)&&wk.length){
      state.once.WidowMorningKills=[];
      wk.forEach(id=>{const s=state.seats.find(x=>x.id===id);if(s&&!s.flags.dead)applyKill(s,"BLACK_WIDOW");});
      save();draw();postDeathHooks();
    }
  }catch(e){}
  try{
    const mc=state.once.MorningCount;
    let giftwolfKilled=false;
    (state.seats||[]).forEach(s=>{
      if(s.meta&&s.meta.giftwolfDieOnMorning===mc&&!s.flags.dead){
        if(applyKill(s,"GIFTWOLF_DELAY")) giftwolfKilled=true;
      }
    });
    if(giftwolfKilled){
      try{ save(); draw(); if(typeof postDeathHooks==="function") postDeathHooks(); }catch(e){}
    }
  }catch(e){}
  try{
    if(state.seats && state.seats.some(s=>s.flags && s.flags.nominated) && window.queueSfxKey){
      queueSfxKey("sfxJudge");
    }
  }catch(e){}
  try{
    const lb=document.getElementById('lynchBtn');
    if(lb){lb.style.opacity='1';lb.style.pointerEvents='auto';}
  }catch(e){}
  try{
    if(window.gameLog && typeof gameLog.add==="function"){
      gameLog.add("☀️", window.t ? window.t("logDayBegins") : "Tag beginnt");
    }
  }catch(e){}
  try{
    if(state.once && Array.isArray(state.once.ProphetTargets)){
      /* keep Prophet targets across day; unlock & SFX handled elsewhere */
    }
  }catch(e){}

  if(state.once.OldDebuff>0) state.once.OldDebuff--
  if(state.once.VoodooCooldown>0) state.once.VoodooCooldown--
  state.once.KoenigUsed=false;
  state.once.KartenschluckerKilledTonight=false;
  state.once.HadesKilledTonight=false;
  state.once.TotenratFuehrerUsedDeflect=false;
  const pierce=!!state.once.SeuchenwolfNextAttackPierces;
  let nightTargets=state.seats.filter(s=>s.flags.targeted&&!s.flags.dead)
  const ex=state.once.FateWolfExtraIds;
  if(Array.isArray(ex)&&ex.length){
    ex.forEach(id=>{const s=state.seats.find(x=>x.id===id);if(s&&!s.flags.dead&&!nightTargets.includes(s))nightTargets.push(s);});
    state.once.FateWolfExtraIds=[];
  }
  if(state.once.PackfatherBlockNextDay){
    state.once.PackfatherExtraKillNextNight=true;
    state.once.PackfatherBlockNextDay=false;
  }

  const continueResolveDay = ()=>{
    if(!pierce) nightTargets=nightTargets.filter(s=>s.role!=="Dorfwache" || (s.meta&&s.meta.packfatherPierce===true))
  const priest=state.seats.find(s=>s.role==="Voodoo-Priester"&&!s.flags.dead&&!(state.once.VoodooCooldown>0))
  if(priest&&nightTargets.some(x=>x===priest)){
    const puppet=state.seats.find(s=>s.flags.puppet&&!s.flags.dead)
    if(puppet){nightTargets=nightTargets.filter(x=>x!==priest);puppet.meta.killedTonight=true;applyKill(puppet,"VOODOO_PUPPET");state.once.VoodooCooldown=2}
  }
  const martyr=state.seats.find(s=>s.role==="Märtyrerin"&&!s.flags.dead&&!state.once.MaertyUsed)
  if(martyr&&nightTargets.length){
    const v=nightTargets[0];const ov=$("overlay")
    $("mt").textContent="Märtyrerin";$("mb").className="big";$("mb").textContent=(v.name||("Sitz "+v.id));$("mbtns").innerHTML=""
    const yes=document.createElement("button");yes.className="btn bad";yes.textContent=(window.t&&window.t("martyrSacrifice"))||"Opfern"
    yes.onclick=()=>{applyKill(martyr,"MARTYR_SACRIFICE");state.seats.forEach(s=>s.flags.targeted=false);state.once.MaertyUsed=true;save();draw();ov.style.display="none";resolveDayKills([])}
    const no=document.createElement("button");no.className="btn";no.textContent=window.t ? window.t("no") : "No";no.onclick=()=>{ov.style.display="none";resolveDayKills(nightTargets)}
    $("mbtns").append(yes,no);ov.style.display="flex";return
  }
    resolveDayKills(nightTargets)
  };

  if(state.once.PackfatherExtraKillNextNight && typeof startPick==="function"){
    startPick("Rudelvater – wähle zweites Opfer (ignoriert Schutz)", extra=>{
      if(extra && !nightTargets.includes(extra)){
        extra.meta = extra.meta || {};
        extra.meta.packfatherPierce = true;
        nightTargets.push(extra);
      }
      state.once.PackfatherExtraKillNextNight=false;
      continueResolveDay();
    }, x=>!x.flags.dead && !nightTargets.includes(x));
    return;
  }

  continueResolveDay();
}

function processDemonCurses(killedList,cb){
  const demons=killedList.filter(s=>s.role==="Dämonischer Wolf")
  if(!demons.length){cb();return}
  const next=demons.shift()
  startPick((window.t&&window.t("demonicWolfCurseOne"))||"Dämonischer Wolf — verfluche 1",t=>{t.meta.cursedWolfAura=true;save();draw();processDemonCurses(demons,cb)},x=>!x.flags.dead&&x!==next)
}

function resolveDayKills(nightTargets){
  if(state.once.TimekeeperFreezeMorning){
    state.once.TimekeeperFreezeMorning=false;
    state.seats.forEach(s=>{s.flags.targeted=false});
    postDeathHooks();
    state.dark=false;
    save(); draw(); rebuildOrder();
    try{center((window.t&&window.t("timekeeperFrozen"))||"Zeitwächter: Die Nacht wurde eingefroren und zählt nicht.",true)}catch(e){}
    return;
  }
  spreadPoison();
  checkPestWin();
  nightTargets = (nightTargets||[]).filter(s=>!s.meta.blockedTonight);
  const killedTonight=[];
  const pierceActive=!!state.once.SeuchenwolfNextAttackPierces;
  const runRest=()=>{
    if(pierceActive&&killedTonight.some(s=>s.meta&&s.meta.lastKillCause==="NIGHT_KILL")) state.once.SeuchenwolfNextAttackPierces=false;
    if(killedTonight.some(x=>x.flags&&x.flags.puppet)) state.once.VoodooCooldown=2;
    const burnedIds = new Set(state.seats.filter(s=>s.flags.burned && nightTargets.includes(s)).map(s=>s.id));
    if(burnedIds.size){
      burnedIds.forEach(id=>{
        const i=id-1, n=state.seats.length;
        [state.seats[(i-1+n)%n], state.seats[(i+1)%n]].forEach(nb=>{
          if(!nb.flags.dead){ nb.meta.killedTonight=true; applyKill(nb,"BURN_SPREAD"); killedTonight.push(nb) }
        });
      });
    }
    if(typeof applyRitterRetaliationFromNight==="function") applyRitterRetaliationFromNight();
    const afterCurses = ()=>{ postDeathHooks(); state.dark=false; state.nightCount=(state.nightCount||1)+1; save(); draw(); rebuildOrder(); if(typeof showBlutwolfInfo==="function") showBlutwolfInfo() };
    if(typeof processDemonCurses==="function") processDemonCurses(killedTonight, afterCurses); else afterCurses();
  };
  function processOne(idx){
    if(idx>=nightTargets.length){ runRest(); return; }
    const s=nightTargets[idx];
    state.once = state.once || {};
    const ignoreProtection = pierceActive || (s.meta && s.meta.packfatherPierce===true);
    if(s.role==="Der Weise" && !state.once.DerWeiseFirstAttackUsed && !ignoreProtection){
      state.once.DerWeiseFirstAttackUsed = true;
      s.flags.targeted = false;
      processOne(idx+1);
      return;
    }
    const tf=s.role==="Nekromant"&&!state.once.TotenratFuehrerUsedDeflect;
    const silenced=state.once.TotenratFuehrerSilenced||[];
    const available=state.seats.filter(x=>x.flags.dead&&!silenced.includes(x.id));
    if(tf&&available.length>=3){
      startMulti((window.t&&window.t("totenratPick3Dead"))||"Totenrat — 3 Tote zum Opfern wählen",3,x=>x.flags.dead&&!silenced.includes(x.id),chosen=>{
        chosen.forEach(t=>state.once.TotenratFuehrerSilenced.push(t.id));
        state.once.TotenratFuehrerUsedDeflect=true;
        s.flags.targeted=false;
        startPick((window.t&&window.t("totenratRedirectKill"))||"Totenrat — Kill umlenken auf",redir=>{
          redir.meta.killedTonight=true; applyKill(redir,"NIGHT_KILL"); killedTonight.push(redir);
          save(); draw(); processOne(idx+1);
        },x=>!x.flags.dead&&x!==s);
      });
      return;
    }
    s.meta.killedTonight=true;
    if(s.meta&&s.meta.schmiedWeapon&&!s.flags.dead){
      s.meta.schmiedWeapon=false;
      const wolves=(state.seats||[]).filter(x=>!x.flags.dead&&typeof isWolf==="function"&&isWolf(x));
      if(wolves.length){
        const victim=wolves[Math.floor(Math.random()*wolves.length)];
        applyKill(victim,"SCHMIED_WEAPON");
        try{center((window.t&&window.t("schmiedRepel"))||"Schmiede-Waffe: Angriff abgewehrt — ein Wolf stirbt.",true)}catch(e){}
      }
      s.flags.targeted=false;
      processOne(idx+1);
      return;
    }
    const killCause=(s.meta&&s.meta.packfatherPierce===true)?"PACKFATHER_KILL":"NIGHT_KILL";
    applyKill(s,killCause); killedTonight.push(s);
    processOne(idx+1);
  }
  processOne(0);
}

function doLynchFlow(){ snapshot();
  startPick((window.t&&window.t("lynchPickOne"))||"Lynch — wähle 1",target=>{
    const deadBefore=state.seats.filter(s=>s.flags.dead).length

    if(target.role==="Wahnsinniger Kutscher"){
      const n=state.seats.length;
      const i=(target.id||1)-1;
      const left=state.seats[(i-1+n)%n];
      const right=state.seats[(i+1)%n];
      [left,right,target].forEach(p=>{
        if(p && !p.flags.dead){
          applyKill(p,"BUSDRIVER_LYNCH");
        }
      });
      queueSfxKey("sfxWahnsinniger");
      save(); draw(); postDeathHooks();
      return;
    }
    if(target.role==="Voodoo-Priester"&&!(state.once.VoodooCooldown>0)){
      const puppet=state.seats.find(s=>s.flags.puppet&&!s.flags.dead)
      if(puppet){applyKill(puppet,"VOODOO_PUPPET");state.once.VoodooCooldown=2;save();draw();postDeathHooks();return}
    }
    if(target.flags.burned){
      const n=state.seats.length,i=target.id-1;[state.seats[(i-1+n)%n],state.seats[(i+1)%n]].forEach(nb=>{if(!nb.flags.dead && nb.role!=="Feuerteufel")applyKill(nb,"BURN_LYNCH_SPREAD")})
    }

    if(target.role==="Fenrir"&&state.fenrirStage>=3&&!state.fenrirSaved){state.fenrirSaved=true;save();draw();return}
    if(target.role==="Cerberus"&&(target.meta.cerbHeads||0)>=3){target.meta.cerbHeads=0;save();draw();return}
    if(target.role==="Der Weise"){
      var ov=document.getElementById("overlay"); if(!ov) return;
      document.getElementById("mt").textContent=((window.getRoleName&&window.getRoleName("Der Weise"))||"Der Weise")+" wurde gelyncht";
      document.getElementById("mb").className="big";
      document.getElementById("mb").textContent=(window.t&&window.t("elderLynchDaysQuestion"))||"Wie viele Tage verlieren die Dorfbewohner ihre Fähigkeiten?";
      document.getElementById("mbtns").innerHTML="";
      var runRest=function(days){
        state.once=state.once||{};
        state.once.OldDebuff=days;
        ov.style.display="none";
        if(target.flags.puppet){ state.once.VoodooCooldown=2; }
        applyKill(target,"LYNCH");
        if(isWolf(target)){ state.once.BountyHunterActive=true; }
        try{ if(window.gameLog&&typeof gameLog.add==="function"){ var ln=(target.name||("#"+target.id)); gameLog.add("⚖", "Lynch: " + ln + " " + (window.t ? window.t("logLynched") : "was lynched") + "."); }}catch(e){}
        state.once.LynchCount=(state.once.LynchCount||0)+1;
        var marked=state.seats.filter(function(s){return s.flags.hmark&&!s.flags.dead&&s!==target;}); marked.forEach(function(m){applyKill(m,"HANGMAN_EXECUTION");}); state.seats.forEach(function(s){s.flags.hmark=false;});
        save(); draw(); postDeathHooks();
      };
      [1,2,3].forEach(function(d){
        var btn=document.createElement("button"); btn.className="btn"; btn.textContent=d===1?((window.t&&window.t("elderLynchDayOne"))||"1 Tag"):((window.tf&&window.tf("elderLynchDaysN",{n:d}))||(d+" Tage"));
        btn.onclick=function(){ runRest(d); };
        document.getElementById("mbtns").appendChild(btn);
      });
      ov.style.display="flex";
      return;
    }
    if(target.role==="Selbstmörder" && deadBefore>=5){
      queueSfxKey("sfxSuicide");
      try{ state.once=state.once||{}; state.once.TeamWinner="solo_Selbstmörder"; }catch(e){}
      applyKill(target,"LYNCH");
      showWinBanner((window.getRoleName?window.getRoleName("Selbstmörder"):"Selbstmörder")+" "+(window.t?window.t("wins"):"gewinnt!"));
      save(); draw(); postDeathHooks();
      return;
    }
    if(target && target.role==="Spiegelwolf"){
      target.meta = target.meta || {};
      if(!target.meta.spMirrorUsed){
        queueSfxKey("sfxMirror");
        startPick((window.t&&window.t("mirrorWolfWhoNominated"))||"Wer hat nominiert? (Spiegelwolf)", (nom)=>{
          if(nom && !nom.flags.dead){
            applyKill(nom,"SPIEGELWOLF_RETALIATE");
          }
          target.meta.spMirrorUsed = true;
          state.once.LynchCount=(state.once.LynchCount||0)+1;
          save(); draw(); postDeathHooks();
        }, x=>!x.flags.dead && x!==target);
        return;
      }
    }
if(target.role==="Rudelvater") state.once.PackfatherExtraKillNextNight=true;
if(target.flags.puppet){ state.once.VoodooCooldown = 2; } applyKill(target,"LYNCH"); if (isWolf(target)) { state.once.BountyHunterActive = true; }
    try{
      if(window.gameLog && typeof gameLog.add==="function"){
        const name=target.name||("#"+target.id);
        gameLog.add("⚖","Lynch: "+name+" "+(window.t ? window.t("logLynched") : "was lynched")+".");
      }
    }catch(e){}

    state.once.LynchCount=(state.once.LynchCount||0)+1
    if(target.role==="Dämonischer Wolf"){startPick((window.t&&window.t("demonicWolfCurseOne"))||"Dämonischer Wolf — verfluche 1",t=>{t.meta.cursedWolfAura=true;save();draw();postDeathHooks()},x=>!x.flags.dead&&x!==target);return}
    const marked=state.seats.filter(s=>s.flags.hmark&&!s.flags.dead&&s!==target);marked.forEach(m=>{applyKill(m,"HANGMAN_EXECUTION")});state.seats.forEach(s=>{s.flags.hmark=false});
    save();draw();postDeathHooks()
  },x=>!x.flags.dead)
}

function resetNightState(){
  state.dark=false
  state.once.BlockedRolesTonight=[]
  state.seats.forEach(s=>{ s.meta.blockedTonight=false; s.flags.targeted=false; s.flags.nominated=false; s.flags.burned=false; s.meta.killedTonight=false })
}

function resetMarksOnly(){
  state.seats.forEach(s=>{
    s.flags.protected=false
    s.flags.targeted=false
    s.flags.inlove=false
    s.flags.rival=false
    s.flags.vorbild=false
    s.flags.nominated=false
    s.flags.charmed=false
    s.flags.poisoned=false
    s.flags.burned=false
    s.flags.puppet=false
    s.flags.hmark=false
    s.meta=s.meta||{}
    s.meta.cursedWolfAura=false
    s.meta.loverId=null
    s.meta.rivalId=null
    s.meta.rkLink=null
    delete s.meta.appleBuff
  })
  save(); draw(); rebuildOrder()
}

function doBearPing(){
  if (!state._allowBearPing) return;
  state._allowBearPing = false;

  const bear = state.seats.find(s => s.role === "Nachtwächter" && !s.flags.dead);
  if (!bear) return;

  const n = state.seats.length;
  const i = bear.id - 1;

  const alive = s => s && !s.flags.dead;
  const nextAlive = (start, dir) => {
    let j = start;
    for (let step = 1; step < n; step++) {
      j = (j + dir + n) % n;
      const seat = state.seats[j];
      if (alive(seat)) return seat;
    }
    return null;
  };

  const L = nextAlive(i, -1), R = nextAlive(i, +1);
  const isWolfLocal = s => s && !s.flags.dead && (s.flags.werewolf || /wolf/i.test(s.role) || (s.meta && s.meta.cursedWolfAura === true));
  if (isWolfLocal(L) || isWolfLocal(R)) queueSfxKey("sfxBear");
}

function initNightOrderStars(){
  document.querySelectorAll('#order .slot').forEach(function(slot){
    slot.classList.remove("night-used");
  });
}

function resetNightStars(){
  try{
    state.once = state.once || {};
    state.once.NightUsedRoles = [];
  }catch(e){}
  document.querySelectorAll('#order .slot').forEach(function(slot){
    slot.classList.remove("night-used");
  });
}

function markStarUsed(role){
  try{
    state.once = state.once || {};
    state.once.NightUsedRoles = state.once.NightUsedRoles || [];
    if(!state.once.NightUsedRoles.includes(role)) state.once.NightUsedRoles.push(role);
    const order = document.getElementById('order');
    if(!order) return;
    const slot = order.querySelector(`.slot[data-role="${role}"]`);
    if(slot) slot.classList.add("night-used");
  }catch(e){}
}
// === SL-ASSISTENT ===
;(function(){
  var assistOn = false;
  var assistPaused = false;
  var assistIndex = 0;

  function getSlots(){
    return Array.from(document.querySelectorAll('#order .slot'));
  }

  function updateToggleBtn(){
    var btn = document.getElementById('assistToggle');
    if(!btn) return;
    if(assistOn && !assistPaused){
      btn.textContent = window.t ? window.t("slAssistantOn") : "🟢 SL-Assistent: An";
      btn.dataset.on = 'true';
    } else if(assistOn && assistPaused){
      btn.textContent = window.t ? window.t("slAssistantPause") : "🟡 SL-Assistent: Pause";
      btn.dataset.on = 'true';
    } else {
      btn.textContent = window.t ? window.t("slAssistantOff") : "🔴 SL-Assistent: Aus";
      btn.dataset.on = 'false';
    }
  }

  function clearHighlights(){
    getSlots().forEach(function(s){ s.classList.remove('assist-active','assist-done'); });
  }

  function highlightCurrent(){
    var slots = getSlots();
    clearHighlights();
    slots.forEach(function(s,i){
      if(i < assistIndex) s.classList.add('assist-done');
      else if(i === assistIndex) s.classList.add('assist-active');
    });
    if(slots[assistIndex]){
      slots[assistIndex].scrollIntoView({behavior:'smooth', block:'nearest'});
    }
  }

  function start(){
    assistOn = true;
    assistPaused = false;
    assistIndex = 0;
    var bar = document.getElementById('assistBar');
    if(bar) bar.style.display = 'flex';
    updatePauseBtn();
    updateToggleBtn();
    highlightCurrent();
  }

  function stop(){
    assistOn = false;
    assistPaused = false;
    assistIndex = 0;
    var bar = document.getElementById('assistBar');
    if(bar) bar.style.display = 'none';
    clearHighlights();
    updateToggleBtn();
  }

  function updatePauseBtn(){
    var btn = document.getElementById('assistPause');
    if(!btn) return;
    btn.textContent = assistPaused ? (window.t ? window.t("continue") : "▶ Weiter") : (window.t ? window.t("pause") : "⏸ Pause");
    btn.className = assistPaused ? 'btn sm good' : 'btn sm warn';
  }

  document.addEventListener('click', function(e){
    if(e.target.id === 'assistToggle'){
      if(assistOn){ stop(); } else { start(); }
    }
  });

  document.addEventListener('click', function(e){
    if(e.target.id !== 'assistWeiter') return;
    if(!assistOn || assistPaused) return;
    var slots = getSlots();
    if(slots[assistIndex]){
      var role = slots[assistIndex].dataset.role;
      if(role && typeof onOrderClick === 'function'){
        onOrderClick(role);
      }
    }
    assistIndex++;
    if(assistIndex >= slots.length){
      stop();
      if(typeof center === 'function') center(window.t ? window.t("lastCharacterNight") : "Das ist der letzte Charakter diese Nacht!", false);
      return;
    }
    highlightCurrent();
  });

  document.addEventListener('click', function(e){
    if(e.target.id !== 'assistPause') return;
    if(!assistOn) return;
    assistPaused = !assistPaused;
    updatePauseBtn();
    updateToggleBtn();
    if(!assistPaused) highlightCurrent();
  });

  document.addEventListener('click', function(e){
    if(e.target.id !== 'assistManual') return;
    stop();
  });

  var _origRebuild = window.rebuildOrder;
  if(typeof _origRebuild === 'function' && !_origRebuild.__assistWrapped){
    window.rebuildOrder = function(){
      var r = _origRebuild.apply(this, arguments);
      if(assistOn && !assistPaused){
        assistIndex = 0;
        highlightCurrent();
      }
      return r;
    };
    window.rebuildOrder.__assistWrapped = true;
  }

  var _origNight = window.onNightStart;
  if(typeof _origNight === 'function' && !_origNight.__assistWrapped){
    window.onNightStart = function(){
      var r = _origNight.apply(this, arguments);
      if(assistOn){ assistIndex = 0; setTimeout(highlightCurrent, 100); }
      return r;
    };
    window.onNightStart.__assistWrapped = true;
  }

})();
