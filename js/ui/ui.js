// UI helpers (rely on global: $, state, stage, save, computeGeometry, svg, txt, tcenter, trunc, fit, openPop, pickMode, etc.)

function applyBg(isDay){
  var el = document.body;
  var bgUrl = isDay ? "url('assets/Tag.png')" : "url('assets/Nacht.png')";
  el.style.backgroundImage = bgUrl;
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = "center";
  el.style.backgroundRepeat = "no-repeat";
  el.style.minHeight = "100vh";
  var effects = document.getElementById("bg-effects");
  if (effects) {
    if (isDay) effects.classList.remove("night");
    else effects.classList.add("night");
  }
}

function voteWeight(seat){try{let w=1;if(seat&&seat.role==="Blutwolf"){const n=state.seats.length;const i=(seat.id||1)-1;const L=state.seats[(i-1+n)%n];const R=state.seats[(i+1)%n];w+= (L&&L.flags.dead?1:0) + (R&&R.flags.dead?1:0);}if(seat&&seat.role==="Hades"&&state.once&&state.once.HadesVoteBonus)w=3;return w}catch(e){return 1}}
function fitTextToBox(el, maxSize = 140, minSize = 14) {
  if (!el) return;
  const parent = el.parentElement || document.body;
  const availH = parent.clientHeight ? parent.clientHeight * 0.90 : window.innerHeight * 0.90;
  const availW = parent.clientWidth ? parent.clientWidth * 0.95 : window.innerWidth * 0.95;

  let size = maxSize;
  el.style.fontSize = size + "px";
  el.style.lineHeight = "1.15";

  while (size > minSize && (
    el.scrollHeight > availH ||
    el.scrollWidth > availW
  )) {
    size -= 1;
    el.style.fontSize = size + "px";
  }
}

// Rückwärtskompatibel für existierende Aufrufe
function fitTextToModal(el){
  fitTextToBox(el);
}

function center(txt,ok){
  const ov=$("overlay");
  if(window.translateRuntimeText) txt = window.translateRuntimeText(txt);
  $("mt").textContent=ok?(window.tUi?window.tUi("Okay"):"Okay"):(window.tUi?window.tUi("Info"):"Info");
  $("mb").className="xxl";
  $("mb").textContent=txt;
  $("mbtns").innerHTML='<button class="btn good" id="okx">'+(window.tUi?window.tUi("OK"):"OK")+'</button>';
  $("okx").onclick=()=>ov.style.display="none";
  ov.style.display="flex";
  requestAnimationFrame(()=>{fitModalText();requestAnimationFrame(fitModalText)});
}

function showWinBanner(txt){
  try{
    if(window.translateRuntimeText) txt=window.translateRuntimeText(txt);
    let banner=document.getElementById("winBanner");
    if(!banner){
      banner=document.createElement("div");
      banner.id="winBanner";
      document.body.appendChild(banner);
    }
    var stageEl=document.querySelector("main.stage");
    var rect=stageEl?stageEl.getBoundingClientRect():{left:0,top:0,width:window.innerWidth,height:window.innerHeight};
    var stageW=Math.max(200,rect.width);
    var stageH=Math.max(150,rect.height);
    banner.style.left=rect.left+"px";
    banner.style.top=(rect.top+stageH*0.12)+"px";
    banner.style.width=stageW+"px";
    banner.style.padding="0 "+(stageW*0.03)+"px";
    var fontSizePx=Math.max(20,Math.min(72,stageW*0.045));
    banner.style.fontSize=fontSizePx+"px";
    var R=Math.min(stageH*0.12,stageW*0.10);
    banner.innerHTML="";
    const letters=txt.split("");
    const n=letters.length;
    letters.forEach((ch,idx)=>{
      const span=document.createElement("span");
      span.textContent=ch;
      span.style.setProperty("--i",idx);
      const angle=(n>1?(idx/(n-1))-0.5:0)*Math.PI;
      const offsetY=-R*Math.cos(angle);
      span.style.transform=`translateY(${offsetY}px)`;
      banner.appendChild(span);
    });
    banner.style.opacity="1";
    banner.style.transition="opacity 0.5s ease";
    setTimeout(()=>{ banner.style.opacity="0"; },5000);
  }catch(e){}
}

function markerList(s){const a=[];if(s.flags.dead)a.push("☠");if(s.flags.dead&&!s.flags.deadVoteStripped)a.push((window.t&&window.t("chipDeadHasVote"))||"🗳");if(s.flags.dead&&s.flags.deadVoteStripped)a.push((window.t&&window.t("chipDeadNoVote"))||"🚫");if(s.flags.protected)a.push("🛡");if(s.flags.targeted)a.push("🎯");if(s.flags.inlove)a.push("❤");if(s.flags.rival)a.push("💔");if(s.flags.werewolf)a.push("🐺");if(s.flags.vorbild)a.push("🧿");if(s.flags.nominated)a.push("⚖");if(s.flags.charmed)a.push("✨");if(s.flags.poisoned)a.push("☣");if(s.flags.burned)a.push("🔥");if(s.flags.puppet)a.push("🧸");if(s.flags.hmark)a.push("🪓");if(s.role==="Cerberus"&&s.meta.cerbHeads>0)a.push("×"+s.meta.cerbHeads);if(s.meta&&s.meta.unholy)a.push("☄");if(s.role==="Blutwolf"){const vw=voteWeight(s); if(vw>1)a.push("V"+vw)}if(s.role==="Totenrat-Führer"&&state.once&&state.once.TotenratFuehrerRevealed)a.push((window.t&&window.t("revealed"))||"OFFENBART"); return a}

function draw(){
  stage.innerHTML=""
  const defs=svg("defs");
  defs.innerHTML =
    '<radialGradient id="seatGradWolf" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1a0a0a"></stop><stop offset="100%" stop-color="#0a0005"></stop></radialGradient>' +
    '<radialGradient id="seatGradVillage" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#132d66"></stop><stop offset="100%" stop-color="#040d29"></stop></radialGradient>' +
    '<radialGradient id="seatGradLone" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#2e1457"></stop><stop offset="100%" stop-color="#150a2f"></stop></radialGradient>';
  stage.appendChild(defs);
  const R=stage.getBoundingClientRect()
  const W=R.width,H=R.height,n=Math.max(4,state.seats.length)
  const g=computeGeometry(W,H,n,state.layout)
  try{
    const lynchBtn=document.getElementById("lynchBtn");
    const lynchWrap=document.getElementById("lynchPhaseWrap");
    const host=stage.parentElement;
    if(lynchWrap && host){
      const svgRect=stage.getBoundingClientRect();
      const hostRect=host.getBoundingClientRect();
      const offsetX=svgRect.left-hostRect.left;
      const offsetY=svgRect.top-hostRect.top;
      const centerR=Math.max(40,g.seatR*1.2);
      lynchWrap.style.left=(offsetX+g.cx)+"px";
      lynchWrap.style.top=(offsetY+g.cy)+"px";
      lynchWrap.style.transform="translate(-50%, -50%)";
    }
    if(lynchBtn && host){
      const centerR=Math.max(40,g.seatR*1.2);
      const lynchSize=centerR*4*0.7;
      lynchBtn.style.width=lynchSize+"px";
      lynchBtn.style.height=lynchSize+"px";
      lynchBtn.style.fontSize=Math.max(16,centerR*0.4)+"px";
    }
  }catch(e){}
  const startA=-Math.PI/2
  const cen=svg("ellipse",{cx:g.cx,cy:g.cy,rx:Math.max(40,g.seatR*1.2),ry:Math.max(40,g.seatR*1.2),fill:"#141731","fill-opacity":".18",stroke:"#5f67a8","stroke-opacity":".18"})
  stage.appendChild(cen)
  const WOLF_ROLES = (typeof WOLF_ROLES_SET !== "undefined") ? WOLF_ROLES_SET : new Set(["Werwolf","Rachsüchtiger Wolf","König Lykaon","Siegreicher Wolf","Seuchenwolf","Schicksalswolf","Schattenwanderer","Giftwolf","Rudelvater","Schwarze Witwe","Spiegelwolf","Dämonischer Wolf","Trugbilderwolf","Schattenhund","Besessener Wolf","Fenrir","Blutwolf","Albtraumwolf","Cerberus"]);
  const SOLO_ROLES = (typeof SOLO_ROLES_SET !== "undefined") ? SOLO_ROLES_SET : new Set(["Rattenfänger","Pestbringerin","Hades","Selbstmörder","Prophet des Untergangs","Feuerteufel","Voodoo-Priester","Kartenschlucker","Totenrat-Führer"]);
  state.seats.forEach((s,i)=>{
    const ang=startA+i*(2*Math.PI/n)
    const x=g.cx+Math.cos(ang)*g.rx, y=g.cy+Math.sin(ang)*g.ry
    const isWolfRole = WOLF_ROLES.has(s.role) || s.flags.werewolf || (s.meta && s.meta.cursedWolfAura);
    const isSoloRole = SOLO_ROLES.has(s.role);
    const seatExtra = s.flags.dead ? "dead" : (isWolfRole ? "wolf" : isSoloRole ? "solo" : "");
    const group=svg("g",{"class":`seat ${seatExtra} ${window._pulseMap&&window._pulseMap.has(s.id)?"pulse":""}`,transform:`translate(${x},${y})`})
    group.dataset.i=i
    group.onclick=ev=>{if(pickMode){if(!pickMode.allow||pickMode.allow(s)){pickMode.onSeat(s)}return}openPop(i,x,y,g.seatR)}
    const plate=svg("circle",{"class":"plate",r:g.seatR})
    const ring = svg("circle", {"class":"ring", r:g.seatR+4, "stroke-width":4});
    const hasRole = !!(s.role && s.role.trim());

    if (!s.flags.dead && hasRole) {
      if (isWolfRole) {
        plate.style.fill = "url(#seatGradWolf)";
        ring.style.color = "#ff4a4a";
      } else if (isSoloRole) {
        plate.style.fill = "url(#seatGradLone)";
        ring.style.color = "#b14cff";
      } else {
        plate.style.fill = "url(#seatGradVillage)";
        ring.style.color = "#4fb4ff";
      }
      ring.style.stroke = "currentColor";
      ring.style.strokeOpacity = "1";
      ring.style.strokeWidth = "4";
      ring.style.filter = "drop-shadow(0 0 10px currentColor) drop-shadow(0 0 25px currentColor) drop-shadow(0 0 50px currentColor)";
    }
    group.appendChild(plate);group.appendChild(ring)
    group.appendChild(txt("#"+s.id,-g.seatR*.95,-g.seatR*.92,"num",Math.max(10,g.seatR*.16)))
    const seatName = s.name || (window.t ? window.t("freeSeat") : "— frei —");
    const shownRole = s.role ? (window.getRoleName ? window.getRoleName(s.role) : s.role) : (window.t ? window.t("noRole") : "keine Rolle");
    const maxTextW=g.seatR*1.42
    const nameSize=fit(seatName,"name",maxTextW,g.seatR*.52,g.seatR*.22)
    const roleSize=fit(shownRole,"role",maxTextW,Math.max(11,nameSize*.62),Math.max(9,g.seatR*.15))
    group.appendChild(tcenter(trunc(seatName,"name",maxTextW,nameSize),-g.seatR*.1,"name",nameSize))
    group.appendChild(tcenter(trunc(shownRole,"role",maxTextW,roleSize),g.seatR*.22,"role",roleSize))
    const mk=markerList(s)
    if(mk.length){
      const row=svg("g",{"class":"mks"})
      mk.forEach((m,k)=>{row.appendChild(txt(m, g.seatR*0.95-k*g.seatR*0.75, -g.seatR*1.09,"mk",Math.max(18,g.seatR*0.60)) )})
      group.appendChild(row)
    }
    try{
      if(state && state.once && state.once.totenkarten && s.flags.dead){
        const data=state.once.totenkarten[s.id];
        if(data){
          const card=ALLE_KARTEN.find(k=>k.id===data.karteId);
          const farbe=getKategorieColor(card?card.kategorie:"");
          const gespielt=!!data.gespielt;

          const dcx=g.cx-x, dcy=g.cy-y, dcDist=Math.sqrt(dcx*dcx+dcy*dcy)||1;
          const nx=dcx/dcDist, ny=dcy/dcDist;
          const cardDist=g.seatR*2.5;

          const cardBtn=svg("g",{
            "class":"totenkarte-btn",
            transform:`translate(${nx*cardDist},${ny*cardDist})`,
            opacity: gespielt ? "0.35" : "1"
          });
          if(!gespielt) cardBtn.style.cursor="pointer";

          // Hintergrund-Fläche (komplett solide)
          const btnBg=svg("rect",{
            x:-g.seatR*0.90, y:-g.seatR*0.24,
            width:g.seatR*1.80, height:g.seatR*0.48,
            rx:g.seatR*0.08,
            fill:"#0d0820"
          });

          // Farbiger Rahmen
          const btnBorder=svg("rect",{
            x:-g.seatR*0.90, y:-g.seatR*0.24,
            width:g.seatR*1.80, height:g.seatR*0.48,
            rx:g.seatR*0.08,
            fill:"none",
            stroke:farbe||"#d4af37",
            "stroke-width":"3"
          });

          const btnTxt=svg("text",{
            x:0, y:g.seatR*0.09,
            "text-anchor":"middle",
            fill:farbe||"#d4af37",
            "font-size":Math.max(11,g.seatR*0.19),
            "font-weight":"bold"
          });
          btnTxt.textContent = "🎴 " + (window.t ? window.t("deathCard") : "Totenkarte");

          cardBtn.appendChild(btnBg);
          cardBtn.appendChild(btnBorder);
          cardBtn.appendChild(btnTxt);

          if(!gespielt){
            cardBtn.onclick=function(ev){
              ev.stopPropagation();
              if(typeof showTodesscreen==="function") showTodesscreen(s);
            };
          }

          group.appendChild(cardBtn);
        }
      }
    }catch(e){}
    stage.appendChild(group)
  })
  try{ prophetProgressCheck && prophetProgressCheck(); }catch(e){}
  try{ checkTeamWin && checkTeamWin(); }catch(e){}
  try{
    const trBtn=document.getElementById("totenratRevealBtn");
    const twBtn=document.getElementById("totenratNameWolfBtn");
    if(state){
      const tf=state.seats.find(s=>s.role==="Totenrat-Führer"&&!s.flags.dead);
      const showDay=!state.dark&&!!tf;
      if(trBtn) trBtn.style.display=showDay&&!state.once.TotenratFuehrerRevealed?"inline-block":"none";
      if(twBtn) twBtn.style.display=showDay?"inline-block":"none";
    }
  }catch(e){}
}

function showPickBar(text,hint,onCancel){
  const b=$("pickbar");
  if(window.translateRuntimeText){ text = window.translateRuntimeText(text); hint = window.translateRuntimeText(hint||""); }
  $("picktxt").textContent=text;
  const len=(text||"").length;
  let fs=20;
  if(len>60)fs=16;
  if(len>100)fs=14;
  const t=document.querySelector(".pickbar .t");
  if(t) t.style.fontSize=fs+"px";
  $("pickhint").textContent=hint||"";
  b.style.display="flex";
  $("pickcancel").onclick=()=>{endPick();b.style.display="none";onCancel&&onCancel()};
}
function hidePickBar(){$("pickbar").style.display="none"}
function withActorPrompt(prompt){
  const actor = window.__activeActorName;
  if(!actor) return prompt;
  const p = String(prompt||"");
  if(p.indexOf(actor+" — ")===0) return p;
  return actor + " — " + p;
}
function startPick(prompt,onSeat,allow){endPick();showPickBar(withActorPrompt(prompt),window.t?window.t("tapSeatCircle"):"Tippe einen Sitz im Kreis");pickMode={onSeat:(s)=>{if(allow&& !allow(s))return;hidePickBar();endPick();onSeat(s)},allow}}
function startConfirm(question,onAnswer){
  const ov=document.getElementById("overlay");if(!ov)return;
  document.getElementById("mt").textContent=window.tUi?window.tUi(question||"Ja oder Nein?"):(question||"Ja oder Nein?");
  document.getElementById("mb").className="big";
  document.getElementById("mb").textContent="";
  document.getElementById("mbtns").innerHTML="";
  const yes=document.createElement("button");yes.className="btn good";yes.textContent=window.t?window.t("yes"):"Ja";
  const no=document.createElement("button");no.className="btn";no.textContent=window.t?window.t("no"):"Nein";
  yes.onclick=()=>{ov.style.display="none";onAnswer(true)};
  no.onclick=()=>{ov.style.display="none";onAnswer(false)};
  document.getElementById("mbtns").append(yes,no);
  ov.style.display="flex";
}
function pick(prompt,onSeat,allow){return startPick(prompt,onSeat,allow)}
function startMulti(prompt,max,allow,done){endPick();const chosen=[];showPickBar(withActorPrompt(prompt),`${window.t?window.t("remaining"):"noch"} ${max}`);pickMode={onSeat:(s)=>{if(allow&& !allow(s))return;if(!chosen.includes(s)){chosen.push(s);$("pickhint").textContent=`${window.t?window.t("remaining"):"noch"} ${Math.max(0,max-chosen.length)}`;if(chosen.length>=max){hidePickBar();endPick();done(chosen)}}},allow}}
function endPick(){pickMode=null; if(state.ui){state.ui.currentRole=null; state.ui.currentSeatId=null; state.ui.ghostCasting=false} draw()}

function fitModalText(){
  const modal=document.querySelector("#overlay .modal"); if(!modal) return;
  const body=$("mb"); if(!body) return;
  const head=$("mt"); const btns=$("mbtns");
  const pad=32;
  const availH = Math.max(120, window.innerHeight*0.90 - (head?.offsetHeight||0) - (btns?.offsetHeight||0) - pad);
  const availW = Math.max(300, Math.min(modal.clientWidth||window.innerWidth*0.9, window.innerWidth*0.96) - 32);
  body.style.maxHeight = availH + "px";
  body.style.overflow = "auto";
  // Start mit sehr großer Schrift und nur bei Bedarf verkleinern (25% reduziert)
  let fs = 216;
  body.style.fontSize = fs+"px";
  body.style.lineHeight = "1.05";
  let guard=60;
  while(guard--){
    if(body.scrollHeight<=availH && body.scrollWidth<=availW) break;
    fs = Math.max(42, fs-2);
    body.style.fontSize = fs+"px";
  }
}

function resizeSeats(n){
  const old=state.seats
  state.seats=Array.from({length:n},(_,i)=>{const s=old[i]||{};const flags=Object.assign({dead:false,protected:false,targeted:false,inlove:false,rival:false,werewolf:false,vorbild:false,nominated:false,charmed:false,poisoned:false,burned:false,puppet:false,hmark:false,deadVoteStripped:false},s.flags||{});const meta=Object.assign({cerbHeads:0,killedTonight:false,cursedWolfAura:false,rivalId:null,loverId:null,rkLink:null,unholy:false,blockedTonight:false},s.meta||{});if(meta.appleBuff) delete meta.appleBuff;return{id:i+1,name:s.name||"",role:s.role||"",flags,meta}})
}

function autoFit(){
  const R=stage.getBoundingClientRect()
  const W=R.width, H=R.height, n=Math.max(4,state.seats.length)
  let bestRatio=state.layout.ratio, bestScale=state.layout.scale, found=false
  for(let ratio=170; ratio>=90 && !found; ratio-=5){
    state.layout.ratio=ratio
    for(let scale=130; scale>=80; scale-=2){
      state.layout.scale=scale
      state.layout.offx=0; state.layout.offy=0
      const g=computeGeometry(W,H,n,state.layout)
      const fits=g.seatR>=16&&(g.cx-g.rx-g.seatR)>8&&(g.cx+g.rx+g.seatR)<W-8&&(g.cy-g.ry-g.seatR)>8&&(g.cy+g.ry+g.seatR)<H-8
      if(fits){ bestRatio=ratio; bestScale=scale; found=true; break }
    }
  }
  state.layout.ratio=bestRatio
  state.layout.scale=bestScale
  $("ratio").value=state.layout.ratio; $("ratioVal").textContent=state.layout.ratio+"%"
  $("scale").value=state.layout.scale; $("scaleVal").textContent=state.layout.scale+"%"
  $("offx").value=state.layout.offx; $("offxVal").textContent=Math.round(state.layout.offx)+"px"
  $("offy").value=state.layout.offy; $("offyVal").textContent=Math.round(state.layout.offy)+"px"
  save(); draw()
}

// Tooltip (shared: window.attachRoleHoverTooltip in roles.js)
function attachTo(el){
  if (window.attachRoleHoverTooltip) window.attachRoleHoverTooltip(el);
}
function attachAll(){
  if (window.hideRoleTooltip) window.hideRoleTooltip();
  document.querySelectorAll('#order .slot').forEach(function(s){ attachTo(s); });
}

const DEATH_CAUSE_LABELS={
  "NIGHT_KILL":"🐺 Werwolf","PACKFATHER_KILL":"🐺 Rudelvater",
  "LYNCH":"⚖️ Lynch","BUSDRIVER_LYNCH":"🃏 Wahnsinniger Kutscher",
  "HANGMAN_EXECUTION":"🪓 Henker","BLACK_WIDOW":"🕷️ Schwarze Witwe",
  "GIFTWOLF_DELAY":"☣️ Giftwolf","BURN_SPREAD":"🔥 Feuerteufel",
  "BURN_LYNCH_SPREAD":"🔥 Feuerteufel","MARTYR_SACRIFICE":"✝️ Märtyrerin",
  "VOODOO_PUPPET":"🧸 Voodoo-Priester","SCHMIED_WEAPON":"⚔️ Dorfschmied",
  "HADES_KILL":"💀 Hades","WITCH_POISON":"🧙 Waldhexe",
  "MANIPULATOR_NOMINATED":"🎭 Manipulator","RITTER_RETALIATION":"⚔️ Ritter",
  "LOVER_HEARTBREAK":"💔 Loki","RED_RIDING_HOOD_LINK":"💔 Rotkäppchen",
  "BESESSENER_WOLF":"🐺 Besessener Wolf","PARASITE_HOST":"🪱 Parasit",
  "WARRIOR_WRONG":"⚔️ Kriegerin des Lichts","AMALIA_SACRIFICE":"🙏 Amalia",
  "BLOODPRIEST_SACRIFICE":"🩸 Blutpriester","VERDAMMNISWAECHTER":"⚖️ Verdammniswächter",
  "PROPHET_KILL":"🔮 Prophet des Untergangs","KARTENSCHLUCKER_KILL":"🃏 Kartenschlucker",
  "SHADOW_SWAP":"🌑 Schattenwanderer","SENSENTRAEGER_KILL":"⚰️ Sensenträger",
};
window.DEATH_CAUSE_LABELS=DEATH_CAUSE_LABELS;

function _deathLabel(s){
  var c=(s&&s.meta&&s.meta.lastKillCause)||"";
  return DEATH_CAUSE_LABELS[c]||("💀 "+(c||"Unbekannt"));
}

function _renderDeathGroups(mb, seats){
  mb.style.cssText+="overflow-y:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(18px,3vh,40px);padding:24px 32px;";
  (seats||[]).forEach(function(s){
    var block=document.createElement("div");
    block.style.cssText="display:flex;flex-direction:column;align-items:center;gap:0.15em;line-height:1.1;";
    var cause=document.createElement("div");
    cause.style.cssText="font-size:clamp(28px,3.5vw,52px);font-weight:600;color:#8899cc;letter-spacing:0.06em;";
    cause.textContent=_deathLabel(s);
    var name=document.createElement("div");
    name.style.cssText="font-size:clamp(64px,8vw,140px);font-weight:700;color:#ffffff;letter-spacing:0.03em;";
    name.textContent=s.name||("Sitz "+s.id);
    block.appendChild(cause);
    block.appendChild(name);
    mb.appendChild(block);
  });
}

function _openDeathOverlay(title, seats, noDeadText, onClose){
  var ov=document.getElementById("overlay");
  var mt=document.getElementById("mt");
  var mb=document.getElementById("mb");
  var mbtns=document.getElementById("mbtns");
  if(!ov||!mt||!mb||!mbtns) return;
  mt.textContent=title;
  mb.className="big";
  mb.style.fontSize=""; mb.style.maxHeight="";
  while(mb.firstChild) mb.removeChild(mb.firstChild);
  while(mbtns.firstChild) mbtns.removeChild(mbtns.firstChild);
  if(!(seats&&seats.length)){
    var row=document.createElement("div");
    row.style.cssText="padding:10px 0;color:#888;font-style:italic;font-size:20px;";
    row.textContent=noDeadText||(window.t&&window.t("noDead"))||"Niemand gestorben.";
    mb.appendChild(row);
  } else {
    _renderDeathGroups(mb, seats);
  }
  var ok=document.createElement("button");
  ok.className="btn good"; ok.textContent="OK";
  ok.onclick=function(){
    ov.style.display="none";
    if(typeof onClose==="function") try{ onClose(); }catch(e){}
  };
  mbtns.appendChild(ok);
  ov.style.display="flex";
}

function showNightDeathSummary(newlyDead, nightNum){
  _openDeathOverlay(
    "☀️ Nacht "+nightNum+" — Morgengrauen",
    newlyDead,
    (window.t&&window.t("noDead"))||"Niemand starb diese Nacht.",
    function(){ try{ if(typeof window.__processHunterQueue==="function") window.__processHunterQueue(); }catch(e){} }
  );
}

function showDeathPopup(newlyDead){
  if(!(newlyDead&&newlyDead.length)) return;
  _openDeathOverlay("💀 Tod", newlyDead, "");
}
window.showDeathPopup=showDeathPopup;
