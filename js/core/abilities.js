// abilities.js — Nacht-Reihenfolge, Suche, Zusatz-Einträge (Rotkäppchen, Hades)
// abilities-helpers.js + abilities-roles-chunk.js müssen vor diesem Script geladen werden.

const abilities = window.GRIMM_ABILITIES_ROLES;
delete window.GRIMM_ABILITIES_ROLES;

abilities["Rotkäppchen"]=({pick,startConfirm,save,draw,center})=>{
  const seat=state.seats.find(s=>!s.flags.dead&&s.role==="Rotkäppchen");
  if(!seat) return;
  const sc=typeof startConfirm==="function"?startConfirm:(q,cb)=>{ if(typeof center==="function")center((window.t&&window.t("startConfirmRequired"))||"startConfirm benötigt",false) };
  pick((window.t&&window.t("rotkppchenPickShelter"))||"Rotkäppchen — suche Zuflucht",target=>{
    sc((window.t&&window.t("rotkppchenConfirmShelter"))||"Gewährt Zuflucht?",accept=>{
      if(accept){
        const oldId=seat.meta&&seat.meta.rkLink;
        if(oldId){const old=state.seats.find(x=>x.id===oldId);if(old&&old.meta)delete old.meta.rkLink;}
        target.meta=target.meta||{};
        target.meta.appleBuff=true;
        target.meta.rkLink=seat.id;
        seat.meta=seat.meta||{};
        seat.meta.rkLink=target.id;
      }
      save(); draw();
    });
  },x=>!x.flags.dead&&x!==seat&&!isWolf(x));
};

abilities["Hades"]=({seats,pick,center,save,draw})=>{
  state.once=state.once||{};
  const lichter=state.once.HadesLichter||0;
  const ov=document.getElementById("overlay"); if(!ov) return;
  document.getElementById("mt").textContent="Hades  — "+lichter+" 🕯️";
  document.getElementById("mb").className="big";
  document.getElementById("mb").textContent=(window.t&&window.t("hadesWhatDo"))||"Was möchtest du tun?";
  document.getElementById("mbtns").innerHTML="";
  if(lichter>=2&&!state.once.HadesKilledTonight){
    const b=document.createElement("button"); b.className="btn bad"; b.textContent=(window.t&&window.t("hadesKillPlayer"))||"2🕯️ Töte einen Spieler";
    b.onclick=()=>{ ov.style.display="none"; pick((window.t&&window.t("hadesPickVictim"))||"Hades  — wähle Opfer",t=>{ state.once.HadesLichter-=2; state.once.HadesKilledTonight=true; applyKill(t,"HADES_KILL"); save(); draw(); if(typeof postDeathHooks==="function") postDeathHooks(); },x=>!x.flags.dead&&x.role!=="Hades"); };
    document.getElementById("mbtns").appendChild(b);
  }
  if(lichter>=3&&!state.once.HadesBarriere){
    const b=document.createElement("button"); b.className="btn warn"; b.textContent=(window.t&&window.t("hadesBarrier"))||"3🕯️ Barriere aktivieren";
    b.onclick=()=>{ state.once.HadesLichter-=3; state.once.HadesBarriere=true; save(); draw(); ov.style.display="none"; };
    document.getElementById("mbtns").appendChild(b);
  }
  if(lichter>=5&&!state.once.HadesVoteBonus){
    const b=document.createElement("button"); b.className="btn warn"; b.textContent=(window.t&&window.t("hadesVoteTriple"))||"5🕯️ Stimme × 3 aktivieren";
    b.onclick=()=>{ state.once.HadesLichter-=5; state.once.HadesVoteBonus=true; save(); draw(); ov.style.display="none"; };
    document.getElementById("mbtns").appendChild(b);
  }
  if(lichter>=10){
    const b=document.createElement("button"); b.className="btn bad"; b.textContent=(window.t&&window.t("hadesWinRedeem"))||"10🕯️ SIEG EINLÖSEN";
    b.onclick=()=>{ state.once.HadesLichter-=10; state.once.HadesWon=true; triggerWin("Hades",seats.find(s=>s.role==="Hades")); ov.style.display="none"; };
    document.getElementById("mbtns").appendChild(b);
  }
  const skip=document.createElement("button"); skip.className="btn"; skip.textContent=(window.t&&window.t("doNothing"))||"Nichts tun"; skip.onclick=()=>ov.style.display="none";
  document.getElementById("mbtns").appendChild(skip);
  ov.style.display="flex";
};

document.getElementById("searchBtn")&&(document.getElementById("searchBtn").onclick=()=>{
  const q=(document.getElementById("searchInput").value||"").trim().toLowerCase(); if(!q) return;
  const hit=state.seats.find(s=>(s.name||"").toLowerCase().includes(q)||(s.role||"").toLowerCase().includes(q));
  if(!hit){ center((window.t&&window.t("nothingFound"))||"Nichts gefunden.", true); return }
  // add temporary pulse
  if(!window._pulseMap) window._pulseMap=new Map();
  window._pulseMap.set(hit.id, Date.now());
  draw();
  setTimeout(()=>{ window._pulseMap.delete(hit.id); draw() }, 2000);
})
window.addEventListener("resize", ()=>{ const ov=document.getElementById("overlay"); if(ov&&ov.style.display==="flex") fitModalText() })
function onOrderClick(role){ snapshot(); window.__activeRole = role; markStarUsed(role);
  const actors=(state.seats||[]).filter(s=>!s.flags.dead && s.role===role);
  const allowNoLivingActor=!!(state.ui&&state.ui.ghostCasting)||(role==="Schutzgeist"&&state.once&&state.once.SchutzgeistAwaitingPick&&(state.seats||[]).some(s=>s.role==="Schutzgeist"&&s.flags.dead));
  if(!actors.length&&!allowNoLivingActor){ center((window.t&&window.t("noAbility"))||"Keine Fähigkeit",false); return; }
  try{
    if(role==="Werwolf" && actors.length>1){
      window.__activeActorName = window.t ? window.t("groupWerewolves") : "Werwölfe";
    }else if(actors.length===1){
      window.__activeActorName = actors[0].name || ("#"+actors[0].id);
    }else{
      window.__activeActorName = window.getRoleName ? window.getRoleName(role) : role;
    }
  }catch(e){ window.__activeActorName = null; }
  const wolfRoles=["Werwolf","Rachsüchtiger Wolf","König Lykaon","Siegreicher Wolf","Seuchenwolf","Schicksalswolf","Schattenwanderer","Giftwolf","Rudelvater","Schwarze Witwe","Schattenhund","Spiegelwolf","Dämonischer Wolf","Trugbilderwolf","Besessener Wolf","Fenrir","Blutwolf","Albtraumwolf","Cerberus"]
  const isWolfRole=wolfRoles.includes(role)
  if(state.once.SchattenhundBlocked && !isWolfRole){center((window.t&&window.t("shadowhoundBlocked"))||"Keine Fähigkeit (Schattenhund)",false);return}
  if(state.once.TimekeeperFreezeMorning && !isWolfRole){center((window.t&&window.t("timekeeperFrozenBlock"))||"Keine Fähigkeit (Zeitwächter — Nacht eingefroren)",false);return}
  if(state.once.OldDebuff>0 && !isWolfRole){center((window.tf&&window.tf("oldDebuff",{n:state.once.OldDebuff}))||("Keine Fähigkeit (Der Weise wurde gelyncht — noch "+state.once.OldDebuff+" Tag(e))."),false);return}
  if((state.once.BlockedRolesTonight||[]).includes(role)){center((window.t&&window.t("nightmareBlocked"))||"Keine Fähigkeit (Albtraum)",false);return}
  const blockedSeat=state.seats.find(s=>!s.flags.dead && s.role===role && s.meta.blockedTonight)
  if(blockedSeat){center((window.t&&window.t("nightmareBlocked"))||"Keine Fähigkeit (Albtraum)",false);return}
  const ab=abilities[role]||(()=>center((window.t&&window.t("noAbility"))||"Keine Fähigkeit",false))
  const actorSeat=actors.length===1?actors[0]:null;
  const hasAppleBuff=actorSeat&&actorSeat.meta&&actorSeat.meta.appleBuff;
  const runAb=()=>{
    const wrapPick=(p,onS,allow)=>{
      startPick(p,s=>{onS(s);if(actorSeat&&actorSeat.meta&&actorSeat.meta.appleBuff){delete actorSeat.meta.appleBuff;save();runAb()}},allow)
    };
    const wrapMulti=(p,max,allow,done)=>{
      startMulti(p,max,allow,chosen=>{done(chosen);if(actorSeat&&actorSeat.meta&&actorSeat.meta.appleBuff){delete actorSeat.meta.appleBuff;save();runAb()}})
    };
    const pickFn=hasAppleBuff&&actorSeat?.meta?.appleBuff?wrapPick:startPick;
    const multiFn=hasAppleBuff&&actorSeat?.meta?.appleBuff?wrapMulti:startMulti;
    ab({seats:state.seats,save,draw,pick:pickFn,startMulti:multiFn,flash,center,startConfirm:typeof startConfirm==="function"?startConfirm:null})
  };
  runAb();
}
