// abilities-helpers.js — Totenkarten, esc(), Sensenträger-Jäger-UI, SOLO_WIN_ROLES (wird vor abilities-roles-chunk.js / abilities.js geladen)
function esc(s){
  return typeof window.escapeHtml === "function" ? window.escapeHtml(s) : String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function assignTotenkarten(){
  if(!state||!state.seats) return;
  state.once=state.once||{};
  state.once.totenkarten={};
  state.once.KartenschluckerStapel=state.once.KartenschluckerStapel||0;
  state.seats.forEach(seat=>{
    if(!seat||!seat.id) return;
    if(isWolf(seat)) return;
    const karte=zieheZufallsKarte(seat);
    state.once.totenkarten[seat.id]={
      karteId:karte.id,
      gespielt:false,
      shown:false
    };
  });
}

// Fallback, z.B. nach load() oder Migration
function ensureTotenkarten(){
  if(!state) return;
  state.once=state.once||{};
  if(!state.once.totenkarten){
    assignTotenkarten();
  }else{
    Object.keys(state.once.totenkarten).forEach(id=>{
      const e=state.once.totenkarten[id];
      const seat=state.seats.find(s=>s.id==id||String(s.id)===String(id));
      if(!e) state.once.totenkarten[id]={karteId:zieheZufallsKarte(seat).id,gespielt:false,shown:false};
      else{
        if(typeof e.gespielt!=="boolean") e.gespielt=false;
        if(typeof e.shown!=="boolean") e.shown=false;
        const valid=!!(e.karteId&&typeof ALLE_KARTEN!=="undefined"&&ALLE_KARTEN.some(k=>k.id===e.karteId));
        if(!valid){
          e.karteId=zieheZufallsKarte(seat).id;
          e.gespielt=false;
          e.shown=false;
        }
      }
    });
  }
  if(typeof state.once.KartenschluckerStapel!=="number") state.once.KartenschluckerStapel=0;
}

function triggerHunterOnce(h){
  try{
    if(!h) return false;
    const role = (h.role||"").trim();
    if(!/^Sensenträger$/i.test(role)) return false;
    h.meta = h.meta || {};
    if(h.meta.hunterShot) return false;
    h.meta.hunterShot = true;
    const ov = document.getElementById("overlay");
    document.getElementById("mt").textContent = (window.getRoleName&&window.getRoleName("Sensenträger"))||"Sensenträger";
    document.getElementById("mb").className = "big";
    document.getElementById("mb").textContent = (window.t&&window.t("hunterCurseAsk"))||"Tödlichen Fluch aussprechen?";
    document.getElementById("mbtns").innerHTML = "";
    const skip=document.createElement("button"); skip.className="btn"; skip.textContent=(window.t&&window.t("skipButton"))||"Überspringen";
    skip.onclick=()=>{ ov.style.display="none"; };
    const shoot=document.createElement("button"); shoot.className="btn bad"; shoot.textContent=(window.t&&window.t("curseButton"))||"Verfluchen";
    shoot.onclick=()=>{
      startPick(((window.getRoleName&&window.getRoleName("Sensenträger"))||"Sensenträger")+" — wähle 1", t=>{ applyKill(t,"HUNTER_SHOT"); save(); draw(); postDeathHooks(); }, x=>!x.flags.dead && x!==h);
      ov.style.display="none";
    };
    document.getElementById("mbtns").append(skip,shoot);
    ov.style.display="flex";
    return true;
  }catch(e){ return false; }
}

function isWendeAktiv(){ if(!state||!state.seats) return false; const alive=state.seats.filter(s=>!s.flags.dead); const wolves=alive.filter(s=>isWolf(s)); const villagers=alive.length-wolves.length; return (wolves.length===4&&villagers===1)||(wolves.length===1&&villagers===4); }
function isKartenschluckerAktiv(){ return state&&state.seats&&state.seats.some(s=>s.role==='Kartenschlucker'&&!s.flags.dead); }

function getNextSeatWithTotenkarten(){
  try{
    if(!state||!state.seats||!state.once||!state.once.totenkarten) return null;
    for(const seat of state.seats){
      if(!seat||!seat.id||!seat.flags||!seat.flags.dead) continue;
      const data=state.once.totenkarten[seat.id];
      if(!data) continue;
      if(data.gespielt) continue;
      if(data.shown) continue;
      return seat;
    }
    return null;
  }catch(e){
    return null;
  }
}
function maybeShowTodenkarten(){
  // Karten werden nicht mehr automatisch gezeigt.
  // Der Spieler klickt selbst auf den Totenkarte-Button am Sitz.
  try{ draw(); }catch(e){}
}
function showTodesscreen(seat){
  try{
    if(!state||!state.once||!state.once.totenkarten||!seat||!seat.id) return;
    const kartenData=state.once.totenkarten[seat.id];
    if(!kartenData) return;
    if(kartenData.gespielt) return;
    kartenData.shown=true;

    const karte=ALLE_KARTEN.find(k=>k.id===kartenData.karteId);
    if(!karte) return;

    const dcState=getDeathCardRequirementState(karte,state.seats);
    const showInactive=!!dcState.showRestricted;
    const showKernregel=!dcState.showRestricted&&(dcState.requiresTags&&dcState.requiresTags.length);

    const kartenText=getKartenText(karte,seat);
    const farbe=getKategorieColor(karte.kategorie);
    const emoji=getKategorieEmoji(karte.kategorie);
    const fraktionLabel=deathCardFactionLabel(seat,karte);
    const kartenschluckerAktiv=isKartenschluckerAktiv();

    const ov=document.getElementById("overlay");
    if(!ov) return;
    const mt=document.getElementById("mt");
    const mb=document.getElementById("mb");
    const btns=document.getElementById("mbtns");
    if(!mt||!mb||!btns) return;

    mt.textContent="💀 "+(seat.name||("Sitz "+seat.id))+" ist gestorben";
    mb.className="big death-card-content";
    let cardStyle = "background:#0d1228;border:2px solid "+farbe+";border-radius:12px;padding:20px;margin:12px 0;text-align:left;";
    if(showInactive) cardStyle += "opacity:0.65;filter:grayscale(0.4);";
    let reviveHint = "";
    if(showInactive) reviveHint = '<div style="color:#e66;font-size:0.9em;margin-top:12px;">⚠ Nur aktiv wenn Dr. Victor Frankenstein, Kutscher, Lehrling oder Wolfskind im Spiel ist</div>';
    if(showKernregel) reviveHint = '<div style="color:#C9A84C;font-size:0.95em;font-weight:bold;margin-top:12px;">⚠ Kernregel aktiv: Tote halten die Augen geschlossen die gesamte Nacht</div>';
    mb.innerHTML=
      '<div style="'+cardStyle+'">'
      +'<div style="color:'+farbe+';font-size:1.1em;font-weight:bold;margin-bottom:8px;">'
      +esc(emoji+" "+karte.kategorie+" — "+karte.name)
      +"</div>"
      +'<div style="color:#8b9fd4;font-size:0.85em;margin-bottom:12px;">'
      +esc(fraktionLabel)
      +"</div>"
      +'<div style="color:#e8ecff;font-size:0.95em;line-height:1.5;">'
      +esc(kartenText)
      +"</div>"
      +(karte.kategorie==="WENDE" && !isWendeAktiv()
        ?'<div style="color:#5a6490;font-size:0.8em;margin-top:10px;font-style:italic;">⚠️ Wende nicht aktiv  — kein 4:1 Verhältnis. Karte verfällt.</div>'
        :"")
      +reviveHint
      +"</div>";

    btns.innerHTML="";

    const btnAus=document.createElement("button");
    btnAus.className="btn good";
    btnAus.textContent="Karte ausspielen";
    btnAus.onclick=function(){
      try{
        const data=state.once.totenkarten[seat.id];
        if(data){data.gespielt=true;data.shown=true;}
        save();
        ov.style.display="none";
        draw();
        setTimeout(maybeShowTodenkarten,0);
      }catch(e){}
    };
    btns.appendChild(btnAus);

    if(kartenschluckerAktiv){
      const btnNeu=document.createElement("button");
      btnNeu.className="btn bad";
      btnNeu.textContent="Neue Karte verlangen";
      btnNeu.onclick=function(){
        try{
          // Stapel nur bei Kartenaustausch (+1), nicht wenn Karte nur direkt ausgespielt wird
          state.once.KartenschluckerStapel=(state.once.KartenschluckerStapel||0)+1;
          const neueKarte=zieheZufallsKarte(seat);
          state.once.totenkarten[seat.id]={karteId:neueKarte.id,gespielt:false,shown:false};
          save();
          if(typeof checkKartenschluckerWin==="function") checkKartenschluckerWin();
          showNeueKarte(seat,neueKarte);
        }catch(e){}
      };
      btns.appendChild(btnNeu);

      const hinweis=document.createElement("div");
      hinweis.style.cssText="color:#ffb020;font-size:0.8em;margin-top:8px;text-align:center;";
      hinweis.textContent="⚠️ Kartenschlucker ist im Spiel  — neue Karte muss sofort ausgespielt werden";
      btns.appendChild(hinweis);
    }

    ov.style.display="flex";
    ov.style.background=`radial-gradient(ellipse at center, ${farbe}18 0%, #0a0f22dd 60%)`;
  }catch(e){}
}
function showNeueKarte(seat,karte){
  try{
    if(!state||!state.once||!state.once.totenkarten||!seat||!karte) return;
    const dcState=getDeathCardRequirementState(karte,state.seats);
    const showInactive=!!dcState.showRestricted;
    const showKernregel=!dcState.showRestricted&&(dcState.requiresTags&&dcState.requiresTags.length);

    const farbe=getKategorieColor(karte.kategorie);
    const emoji=getKategorieEmoji(karte.kategorie);
    const text=getKartenText(karte,seat);
    const fraktionLabel=deathCardFactionLabel(seat,karte);

    const ov=document.getElementById("overlay");
    const mt=document.getElementById("mt");
    const mb=document.getElementById("mb");
    const btns=document.getElementById("mbtns");
    if(!ov||!mt||!mb||!btns) return;

    let cardStyle = "background:#0d1228;border:2px solid "+farbe+";border-radius:12px;padding:20px;margin:12px 0;text-align:left;";
    if(showInactive) cardStyle += "opacity:0.65;filter:grayscale(0.4);";
    let reviveHint = "";
    if(showInactive) reviveHint = '<div style="color:#e66;font-size:0.9em;margin-top:12px;">⚠ Nur aktiv wenn Dr. Victor Frankenstein, Kutscher, Lehrling oder Wolfskind im Spiel ist</div>';
    if(showKernregel) reviveHint = '<div style="color:#C9A84C;font-size:0.95em;font-weight:bold;margin-top:12px;">⚠ Kernregel aktiv: Tote halten die Augen geschlossen die gesamte Nacht</div>';

    mt.textContent="🎴 Neue Karte  — muss sofort gespielt werden";
    mb.className="big death-card-content";
    mb.innerHTML=
      '<div style="'+cardStyle+'">'
      +'<div style="color:'+farbe+';font-size:1.1em;font-weight:bold;margin-bottom:8px;">'
      +esc(emoji+" "+karte.kategorie+" — "+karte.name)
      +"</div>"
      +'<div style="color:#8b9fd4;font-size:0.85em;margin-bottom:12px;">'
      +esc(fraktionLabel)
      +"</div>"
      +'<div style="color:#e8ecff;font-size:0.95em;line-height:1.5;">'
      +esc(text)
      +"</div>"
      +reviveHint
      +"</div>";

    btns.innerHTML="";
    const btnOk=document.createElement("button");
    btnOk.className="btn good";
    btnOk.textContent="Verstanden  — Karte wird ausgespielt";
    btnOk.onclick=function(){
      try{
        const data=state.once.totenkarten[seat.id];
        if(data){data.gespielt=true;data.shown=true;}
        save();
        ov.style.background="";
        ov.style.display="none";
        draw();
        checkKartenschluckerWin();
        setTimeout(maybeShowTodenkarten,0);
      }catch(e){}
    };
    btns.appendChild(btnOk);

    const data=state.once.totenkarten[seat.id];
    if(data) data.shown=true;
    ov.style.display="flex";
    ov.style.background=`radial-gradient(ellipse at center, ${farbe}18 0%, #0a0f22dd 60%)`;
  }catch(e){}
}

function hexeAskDeath(pick){
  const ov=document.getElementById("overlay");document.getElementById("mt").textContent=(window.getRoleName&&window.getRoleName("Waldhexe"))||"Waldhexe";document.getElementById("mb").className="big";document.getElementById("mb").textContent=(window.t&&window.t("hexPoisonAsk"))||"Todestrank einsetzen?";document.getElementById("mbtns").innerHTML=""
  const no=document.createElement("button");no.className="btn";no.textContent=(window.t&&window.t("witchNoDeadlyFate"))||"Skip Deadly Fate";no.onclick=()=>{ov.style.display="none";}
  const yes=document.createElement("button");yes.className="btn bad";yes.textContent=(window.t&&window.t("witchChooseTarget"))||"Choose target";yes.onclick=()=>{ov.style.display="none";pick(((window.getRoleName&&window.getRoleName("Waldhexe"))||"Waldhexe")+"  — "+((window.t&&window.t("witchPickVictim"))||"choose victim"),s=>{if(s.role==="Voodoo-Priester" && !(state.once.VoodooCooldown>0)){ const puppet=state.seats.find(p=>p.flags.puppet && !p.flags.dead); if(puppet){ applyKill(puppet,"VOODOO_PUPPET"); state.once.VoodooCooldown=2; save(); draw(); if(typeof postDeathHooks==="function") postDeathHooks(); return; } }if(s.role==="Cerberus" && (s.meta?.cerbHeads||0)>=3){ s.meta.cerbHeads=0; save(); draw(); return; }if(s.flags.puppet){ state.once.VoodooCooldown=2; } applyKill(s,"WITCH_POISON");try{if(window.gameLog&&typeof gameLog.add==="function"){const name=s.name||("#"+s.id);gameLog.add("💀",((window.getRoleName&&window.getRoleName("Waldhexe"))||"Waldhexe")+": "+((window.t&&window.t("witchDeadlyFate"))||"Deadly Fate")+" "+((window.tf&&window.tf("witchLogDeadlyOnName",{name}))||("on "+name)));}}catch(e){} if(!(state.ui&&state.ui.ghostCasting) && state.context!=="ghost") state.once.WaldhexeD=true;save();draw();if(typeof postDeathHooks==="function") postDeathHooks();},x=>!x.flags.dead)}
  yes.disabled=!!state.once.WaldhexeD && !(state.ui&&state.ui.ghostCasting)
  document.getElementById("mbtns").append(no,yes);ov.style.display="flex"
}
const SOLO_WIN_ROLES = window.SOLO_WIN_ROLES; // authoritative definition in roles.js

function abilityTeamOfSeat(s){
  const r=(s&&(s.role||"")).trim();
  if(!r) return "dorf";
  if(typeof getFaction==="function"){
    const f=getFaction(r);
    if(f==="wolf") return "wolf";
    if(f==="solo") return "solo";
    return "dorf";
  }
  if(isWolf(s)) return "wolf";
  if(SOLO_WIN_ROLES.has(r)) return "solo";
  return "dorf";
}

function deathCardFactionLabel(seat,karte){
  if(isWolf(seat)) return (window.t&&window.t("wolfEffect"))||"🐺 Werwolf-Effekt";
  if(karte.neutral) return (window.t&&window.t("allPlayersEffect"))||"⚫ Alle Spieler";
  if(SOLO_WIN_ROLES.has(seat.role)) return (window.t&&window.t("soloEffect"))||"🎭 Solo-Effekt";
  return (window.t&&window.t("villageEffect"))||"🏘️ Dorf-Effekt";
}
