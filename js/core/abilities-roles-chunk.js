// abilities-roles-chunk.js — Rollen-Fähigkeiten (Stamm-Objekt; wird zu const abilities zusammengeführt)
window.GRIMM_ABILITIES_ROLES = {
  "Kopfgeldjäger": ({seats,center,save,draw}) => {
    if (!state.once.BountyHunterActive) {
      center((window.t&&window.t("bountyHunterInactive"))||"🕵️ Der Kopfgeldjäger ist derzeit inaktiv.", false);
      return;
    }
    const wolves = seats.filter(s => !s.flags.dead && isWolf(s));
    const others = seats.filter(s => !s.flags.dead && !isWolf(s));
    if (wolves.length === 0 || others.length < 2) {
      center((window.t&&window.t("notEnoughTargets"))||"Nicht genügend Ziele verfügbar.", false);
      state.once.BountyHunterActive = false;
      save(); draw();
      return;
    }
    const wolf = wolves[Math.floor(Math.random() * wolves.length)];
    const randomTwo = [];
    while (randomTwo.length < 2 && others.length > 0) {
      const idx = Math.floor(Math.random() * others.length);
      randomTwo.push(others.splice(idx, 1)[0]);
    }
    const shown = [wolf, ...randomTwo].sort(() => Math.random() - 0.5);
    const names = shown.map(s => s.name || ("Sitz " + s.id)).join("  • ");
    center((window.tf&&window.tf("bountyHunterSees",{names}))||("🎯 Der Kopfgeldjäger sieht: " + names + "\n(Einer davon ist ein Werwolf)"), true);
    state.once.BountyHunterActive = false;
    save(); draw();
  },

  
  
  "Dr. Victor Frankenstein": ({startMulti,save,draw,center,seats}) => { const fromGhost = !!(state.ui&&state.ui.ghostCasting) || state.context==="ghost"; if (state.once.FrankensteinUsed && !fromGhost) return;

    const deadPlayers = seats.filter(s => s.flags.dead);
    if (deadPlayers.length === 0) {
      return; // keine Toten -> Nacht übersprungen
    }

    const ov = document.getElementById("overlay");
    document.getElementById("mt").textContent = "Dr. Victor Frankenstein";
    document.getElementById("mb").className = "big";
    document.getElementById("mb").textContent = "Möchtest du jemanden wiederbeleben?";
    document.getElementById("mbtns").innerHTML = "";

    const noBtn = document.createElement("button");
    noBtn.className = "btn bad";
    noBtn.textContent = "Nein";
    noBtn.onclick = () => { ov.style.display = "none"; draw(); };

    const yesBtn = document.createElement("button");
    yesBtn.className = "btn good";
    yesBtn.textContent = "Ja";
    yesBtn.onclick = () => {
      ov.style.display = "none"; // Fenster schließen, um Klicks auf Spieler zu erlauben
      startMulti("Dr. Victor Frankenstein  — wähle einen Toten", 1, x => x.flags.dead, chs => {
        if (!chs || chs.length === 0) return;
        const ch = chs[0];
        ch.flags.dead = false;
        ch.meta = ch.meta || {};
        ch.meta.deathProcessed = false;
        ch.meta.killedTonight = false;
        ch.meta.hunterShot = false;
        ch.meta.hunterQueued = false;

        const availableRoles = ALL_ROLES.filter(r => !seats.some(s => s.role === r));
        if (availableRoles.length === 0) {
          center((window.t&&window.t("noRolesAvailable"))||"Keine verfügbaren Rollen!", false);
          return;
        }

        const sel = document.createElement("select");
        sel.className = "dropdown";
        availableRoles.forEach(r => {
          const opt = document.createElement("option");
          opt.value = r;
          opt.textContent = r;
          sel.appendChild(opt);
        });

        const confirm = document.createElement("button");
        confirm.className = "btn good";
        confirm.textContent = "Rolle vergeben";
        confirm.onclick = () => {
          const selected = sel.value;
          const wouldCreateWolf = typeof isWolf==="function" && isWolf({role:selected,flags:{},meta:{}});
          if(typeof applyRoleOrVillagerIfGatewardenWolf==="function") applyRoleOrVillagerIfGatewardenWolf(ch, selected, wouldCreateWolf);
          else { ch.role = selected; if (wouldCreateWolf) ch.flags.werewolf = true; }
          if (!fromGhost) state.once.FrankensteinUsed = true;
          save(); draw();
          const rn=(window.getRoleName&&window.getRoleName(ch.role))||ch.role;
          center((window.tf&&window.tf("frankensteinRevived",{name:ch.name||("Sitz "+ch.id),role:rn}))||("🧬 Frankenstein hat " + (ch.name || ("Sitz " + ch.id)) + " wiederbelebt als " + rn + "!"), true);
          ov.style.display = "none";
        };

        document.getElementById("mb").textContent = "Wähle eine neue Rolle für " + (ch.name || "den Spieler") + ":";
        document.getElementById("mbtns").innerHTML = "";
        document.getElementById("mbtns").append(sel, confirm);
        ov.style.display = "flex";
      });
    };

    document.getElementById("mbtns").append(noBtn, yesBtn);
    ov.style.display = "flex";
  },



  
  
  "König": ({seats,center,save,draw}) => {
    if (state.once.KoenigUsed) return;
    const alive = seats.filter(s => !s.flags.dead);
    const dead = seats.filter(s => s.flags.dead);
    if (dead.length <= alive.length) return;

    const kingSeat = seats.find(s => s.role === "König");
    const goodPlayers = alive.filter(s => 
      !isWolf(s) &&
      s !== kingSeat
    );

    if (goodPlayers.length === 0) return;

    const chosen = goodPlayers[Math.floor(Math.random() * goodPlayers.length)];
    state.once.KoenigUsed = true;
    save(); draw();
    center((window.tf&&window.tf("kingLearns",{name:chosen.name||("Sitz "+chosen.id),role:chosen.role||(window.t&&window.t("noRole"))||"keine Rolle"}))||("👑 Der König erfährt: " + (chosen.name || ("Sitz " + chosen.id)) + " — " + (chosen.role || "keine Rolle")), true);
  },



  Loki:({startMulti,save,draw,center})=>{
    if(isOnceUsed("Loki")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    const ov=document.getElementById("overlay");document.getElementById("mt").textContent=(window.getRoleName&&window.getRoleName("Loki"))||"Loki";document.getElementById("mb").className="big";document.getElementById("mb").textContent="Liebe ❤ oder Hass 💔 ?";document.getElementById("mbtns").innerHTML=""
    const love=document.createElement("button");love.className="btn good";love.textContent="Liebe"
    const hate=document.createElement("button");hate.className="btn bad";hate.textContent="Hass"
    let lokiChoiceLocked=false
    love.onclick=()=>{if(lokiChoiceLocked)return;lokiChoiceLocked=true;love.disabled=true;hate.disabled=true;ov.style.display="none";startMulti(((window.getRoleName&&window.getRoleName("Loki"))||"Loki")+"  — verliebe 2",2,x=>!x.flags.dead,chs=>{if(chs.length===2){chs[0].flags.inlove=true;chs[1].flags.inlove=true;chs[0].meta.loverId=chs[1].id;chs[1].meta.loverId=chs[0].id;markOnceUsed("Loki");save();draw()}})}
    hate.onclick=()=>{if(lokiChoiceLocked)return;lokiChoiceLocked=true;love.disabled=true;hate.disabled=true;ov.style.display="none";startMulti(((window.getRoleName&&window.getRoleName("Loki"))||"Loki")+"  — markiere 2 (💔)",2,x=>!x.flags.dead,chs=>{if(chs.length===2){chs[0].flags.rival=true;chs[1].flags.rival=true;chs[0].meta.rivalId=chs[1].id;chs[1].meta.rivalId=chs[0].id;markOnceUsed("Loki");save();draw()}})}
    document.getElementById("mbtns").append(love,hate);ov.style.display="flex"
  },

  "Die Gebundenen": ({seats, center}) => {
    state.once = state.once || {};
    const gebunden = seats.filter(
      s => !s.flags.dead && s.role === "Die Gebundenen"
    );
    if(!gebunden.length){
      center((window.t&&window.t("noLivingBound"))||"Keine lebenden Gebundenen gefunden.", false);
      return;
    }
    const names = gebunden.map(s => s.name || ("#" + s.id)).join("  •  ");
    const msg = (window.tf&&window.tf("gebundenFirstNight",{names}))||("🩸 Die Gebundenen — Erste Nacht\n\n"+names);
    center(msg, true);
    markOnceUsed("Die Gebundenen");
  },

  Schutzengel:({pick,save,draw})=>pick(
    ((window.getRoleName&&window.getRoleName("Schutzengel"))||"Schutzengel")+"  — wähle 1 (nicht dich selbst)",
    s=>{s.flags.protected=true;save();draw()},
    x=>!x.flags.dead && (x.role||"")!=="Schutzengel"
  ),
  Werwolf:({seats,pick,save,draw})=>pick(((localStorage.getItem("grimmhain_lang")||"de")==="en" ? "Werewolf  — Target (🎯/🛡)" : "Werwolf  — Ziel (🎯/🛡)"),s=>{const pierce=!!(state.once&&state.once.SeuchenwolfNextAttackPierces);if(!pierce&&(s.flags.protected||s.role==="Dorfwache")){s.flags.protected=false}else{seats.forEach(x=>x.flags.targeted=false);s.flags.targeted=true}save();draw()},x=>!x.flags.dead),
  "Nekromant":({center,save,draw,startMulti})=>{
    const deadAll=(state.seats||[]).filter(s=>s.flags&&s.flags.dead);
    if(deadAll.length<3){
      center((window.t&&window.t("totenratShieldNeedThreeDead"))||"Nekromant: Mindestens drei Tote nötig.", false);
      return;
    }
    const withVote=deadAll.filter(s=>!s.flags.deadVoteStripped);
    if(withVote.length<3){
      center((window.t&&window.t("totenratShieldNotEnoughVotes"))||"Nekromant: Nicht genug Tote mit Stimme.", false);
      return;
    }
    const ov=document.getElementById("overlay");
    const mt=document.getElementById("mt");
    const mb=document.getElementById("mb");
    const btns=document.getElementById("mbtns");
    if(!ov||!mt||!mb||!btns) return;

    mt.textContent=(window.getRoleName&&window.getRoleName("Nekromant"))||"Nekromant";
    mb.className="big";
    mb.textContent=(window.t&&window.t("totenratShieldRitualPrompt"))||"Schild gegen den nächsten Tod: Wähle drei Tote — ihnen wird die Stimme entzogen. Der Schild verfällt mit Beginn der nächsten Nacht, falls ungenutzt.";
    btns.innerHTML="";

    const ok=document.createElement("button");
    ok.className="btn good";
    ok.textContent=(window.t&&window.t("totenratShieldConfirmBtn"))||"Schild — 3 Tote auswählen";
    ok.onclick=()=>{
      ov.style.display="none";
      startMulti((window.t&&window.t("totenratSelect3Dead"))||"Nekromant — wähle 3 Tote (Stimmenentzug)",3,x=>x.flags&&x.flags.dead&&!x.flags.deadVoteStripped,chosen=>{
        if(!chosen||chosen.length<3) return;
        chosen.forEach(t=>{ t.flags.deadVoteStripped=true; });
        state.once = state.once || {};
        state.once.TotenratDeathImmunityPending=true;
        save(); draw();
        try{ center((window.t&&window.t("shieldTotenratActive"))||"Nekromant: Schild gegen den nächsten Tod aktiv. Totale Immunität gegen die nächste Tötung. Verfällt mit Beginn der nächsten Nacht, falls ungenutzt.", true); }catch(e){}
      });
    };

    const cancel=document.createElement("button");
    cancel.className="btn";
    cancel.textContent=(window.t&&window.t("cancel"))||"Abbrechen";
    cancel.onclick=()=>{ ov.style.display="none"; };

    btns.append(ok,cancel);
    ov.style.display="flex";
  },
  Waldhexe:({seats,pick,save,draw})=>{
    const v=seats.find(x=>x.flags.targeted&&!x.flags.dead)
    const ov=document.getElementById("overlay");document.getElementById("mbtns").innerHTML=""
    document.getElementById("mt").textContent=(window.getRoleName&&window.getRoleName("Waldhexe"))||"Waldhexe"
    document.getElementById("mb").className="big"
    document.getElementById("mb").textContent=v?(v.role||"keine Rolle"):"Kein Opfer gesetzt."
    const btnNo=document.createElement("button");btnNo.className="btn";btnNo.textContent="Nicht retten";btnNo.onclick=()=>{ov.style.display="none";hexeAskDeath(startPick)}
    const btnL=document.createElement("button");btnL.className="btn good";btnL.textContent=(window.t&&window.t("witchSaveFate"))||"Save Fate"
    btnL.disabled=((state.ui&&state.ui.ghostCasting)?false:!!state.once.WaldhexeL) || !v
    btnL.onclick=()=>{if(v){v.flags.targeted=false; if(!(state.ui&&state.ui.ghostCasting) && state.context!=="ghost") state.once.WaldhexeL=true;save();draw();try{if(window.gameLog&&typeof gameLog.add==="function"){const name=v.name||("#"+v.id);gameLog.add("💚",((window.getRoleName&&window.getRoleName("Waldhexe"))||"Waldhexe")+": "+((window.t&&window.t("witchSaveFate"))||"Save Fate")+" "+((window.tf&&window.tf("witchLogSaveForName",{name}))||("for "+name)));}}catch(e){}}document.getElementById("mb").textContent=(v?(v.name||("#"+v.id))+" — "+(v.role||""):"");document.getElementById("mbtns").innerHTML='<button class="btn" id="cont">'+((window.t&&window.t("btnWeiter"))||"Weiter")+'</button>';document.getElementById("cont").onclick=()=>{ov.style.display="none";hexeAskDeath(startPick)}}
    const btnD=document.createElement("button");btnD.className="btn bad";btnD.textContent=(window.t&&window.t("witchDeadlyFate"))||"Deadly Fate";btnD.disabled=((state.ui&&state.ui.ghostCasting)?false:!!state.once.WaldhexeD)
    btnD.onclick=()=>{ov.style.display="none";startPick(((window.getRoleName&&window.getRoleName("Waldhexe"))||"Waldhexe")+"  — "+((window.t&&window.t("witchPickVictim"))||"choose victim"),s=>{if(s.role==="Cerberus" && (s.meta?.cerbHeads||0)>=3){s.meta.cerbHeads=0; save(); draw(); return;} applyKill(s,"WITCH_POISON");if(!(state.ui&&state.ui.ghostCasting) && state.context!=="ghost") state.once.WaldhexeD=true;save();draw();if(typeof postDeathHooks==="function")postDeathHooks()},x=>!x.flags.dead)}
    document.getElementById("mbtns").append(btnNo,btnL,btnD);ov.style.display="flex"
  },
  Kartenschlucker:({seats,pick,center,save,draw})=>{
    state.once=state.once||{};
    if(!state.once._kartenschluckerNightProcessed){ state.once.KartenschluckerNightCount=(state.once.KartenschluckerNightCount||0)+1; state.once._kartenschluckerNightProcessed=true; }
    if(typeof checkKartenschluckerWin==="function") checkKartenschluckerWin();
    if((state.once.KartenschluckerStapel||0)>=2&&!state.once.KartenschluckerKilledTonight){
      pick("Kartenschlucker  — wähle Opfer",t=>{
        applyKill(t,"KARTENSCHLUCKER_KILL");
        state.once.KartenschluckerKilledTonight=true;
        save(); draw();
        if(typeof postDeathHooks==="function")postDeathHooks();
      },x=>!x.flags.dead);
    }
    if((state.once.KartenschluckerNightCount||0)%3===0) center((window.tf&&window.tf("kartenschluckerStacks",{n:state.once.KartenschluckerStapel||0}))||("📢 Das Dorf erfährt: Kartenschlucker hat "+(state.once.KartenschluckerStapel||0)+" Stapel."),true);
    if((state.once.KartenschluckerStapel||0)>=5) state.once.KartenschluckerShield=true;
    save(); draw();
  },
  "Das Orakel":({pick,center})=>pick(((window.getRoleName&&window.getRoleName("Das Orakel"))||"Das Orakel")+"  — wähle 1",s=>{
    let r=s.role||"keine Rolle"
    if(s.role==="Trugbilderwolf"){
      const pool = state.seats
        .filter(s => !s.flags.dead &&
          !isWolf(s) &&
          s.role !== "Trugbilderwolf" &&
          s.role !== "Das Orakel")
        .map(s => s.role)
        .filter(r => !!r);
      r=pool[Math.floor(Math.random()*pool.length)]||"Dorfbewohner"
    }
    if(isWolf(s)&&s.role!=="Trugbilderwolf"){ r="Werwolf"; }
    center((window.getRoleName&&window.getRoleName(r))||r,true)
  }),
  "Die Ewigen": ({pick, center}) => pick("Die Ewigen  — wähle 1", t => {
    const r = (t.role || "").trim();
    if(SOLO_WIN_ROLES.has(r)){
      center(((window.t&&window.t("eternalsYes"))||"✅ JA")+"\n"+((window.getRoleName&&window.getRoleName(r))||r), true);
    } else {
      center((window.t&&window.t("eternalsNo"))||"❌ Nein", true);
    }
  }),

  Spürhund: ({startMulti, save, draw, center}) => {
    const rn = (window.getRoleName && window.getRoleName("Spürhund")) || "Spürhund";
    startMulti(rn + "  — wähle 3 Spieler", 3, x => !x.flags.dead, chs => {
      if (!chs || chs.length < 3) return;
      const hasWolfOrSolo = chs.some(s => {
        if (s.meta && s.meta.fakeWolfSignal) return true;
        const faction = typeof getFaction==="function" ? getFaction(s.role) : "dorf";
        return faction === "wolf" || faction === "solo";
      });
      if (hasWolfOrSolo) {
        center((window.t && window.t("scentTrailFound")) || "✅ A trail leads to a wolf or something else...", true);
      } else {
        const alive = (state.seats||[]).filter(x=>!x.flags.dead);
        if (alive.length) {
          const fake = alive[Math.floor(Math.random()*alive.length)];
          if (fake) {
            fake.meta = fake.meta || {};
            fake.meta.fakeWolfSignal = true;
          }
        }
        center((window.t && window.t("scentTrailNone")) || "❌ No trail found...", true);
      }
      save();
      draw();
    });
  },
  "Albtraumwolf": ({pick,save,draw,center,seats}) => {
    pick("Albtraumwolf  — blockiere 1 Dorfbewohner",
      s => {
        s.meta = s.meta || {};
        s.meta.blockedTonight = true;
        state.once = state.once || {};
        state.once.BlockedRolesTonight = state.once.BlockedRolesTonight || [];
        if (s.role && !state.once.BlockedRolesTonight.includes(s.role)) {
          state.once.BlockedRolesTonight.push(s.role);
        }
        save();
        draw();
      },
      x => !x.flags.dead && !isWolf(x)
    );
  },
  "Voodoo-Priester":({pick,save,draw,center,seats})=>{
    if(state.once.VoodooCooldown>0){center((window.tf&&window.tf("voodooCrafting",{n:state.once.VoodooCooldown}))||("Voodoo-Priester bastelt noch "+state.once.VoodooCooldown+" Tag(e)."),false);return}
    const existing=seats.find(s=>s.flags.puppet&&!s.flags.dead)
    if(existing){center((window.t&&window.t("voodooPuppetAlready"))||"Es ist bereits eine Puppe im Spiel.",false);return}
    pick("Voodoo-Priester  — gib 1 Puppe",s=>{s.flags.puppet=true;s.flags.charmed=false;save();draw()},x=>!x.flags.dead&&!x.flags.puppet)
  },
  "Rachsüchtiger Wolf":({seats,pick,save,draw,center})=>{
    try{
      window.state = window.state || {};
      state.once = state.once || {};
      if(typeof state.once.WhiteWolfUsedTonight!=="boolean") state.once.WhiteWolfUsedTonight=false;
      if(typeof state.once.WhiteWolfCooldown!=="number") state.once.WhiteWolfCooldown=0;
      if(state.once.WhiteWolfCooldown>0){
        if(center) center((window.tf&&window.tf("whiteWolfWait",{n:state.once.WhiteWolfCooldown}))||("Rachsüchtiger Wolf: Noch "+state.once.WhiteWolfCooldown+" Nacht(e) warten."),false);
        return;
      }
      const wwAlive = (seats||[]).some(s=> !s.flags.dead && (s.role||"")==="Rachsüchtiger Wolf");
      if(!wwAlive){ if(center) center((window.t&&window.t("noWhiteWolfActive"))||"Kein Rachsüchtiger Wolf aktiv.", false); return; }
      if(state.once.WhiteWolfUsedTonight){ if(center) center((window.t&&window.t("whiteWolfUsedTonight"))||"Rachsüchtiger Wolf: Diese Nacht bereits verwendet.", false); return; }

      // Nur andere Werwölfe als Ziele zulassen (keine Dorfbewohner, kein Rachsüchtiger Wolf selbst)
      const wolfTargets = (seats||[]).filter(s=> !s.flags.dead && isWolf(s) && (s.role||"")!=="Rachsüchtiger Wolf" && (s.role||"")!=="Doppelspion");
      if(!wolfTargets.length){
        if(center) center((window.t&&window.t("whiteWolfNoTargets"))||"Rachsüchtiger Wolf: Keine anderen Werwölfe als Ziel verfügbar.", false);
        return;
      }

      const ov=document.getElementById("overlay");
      document.getElementById("mt").textContent=(window.getRoleName&&window.getRoleName("Rachsüchtiger Wolf"))||"Rachsüchtiger Wolf";
      document.getElementById("mb").className="big";
      document.getElementById("mb").textContent="Jetzt töten?";
      document.getElementById("mbtns").innerHTML="";
      const no=document.createElement("button");
      no.className="btn";
      no.textContent="Nein";
      no.onclick=()=>{ ov.style.display="none"; };
      const yes=document.createElement("button");
      yes.className="btn bad";
      yes.textContent="Ja  — Ziel wählen";
      yes.onclick=()=>{
        ov.style.display="none";
        pick(((window.getRoleName&&window.getRoleName("Rachsüchtiger Wolf"))||"Rachsüchtiger Wolf")+"  — wähle einen anderen Werwolf", s=>{
          try{
            state.seats.forEach(x=>{if(x.flags)x.flags.targeted=false});
            if(s.flags.protected || s.role==="Dorfwache"){
              s.flags.protected=false;
            } else {
              s.flags.targeted=true;
            }
            state.once.WhiteWolfCooldown = 3;
            state.once.WhiteWolfUsedTonight=true;
            save();
            draw();
          }catch(e){}
        }, x=> !x.flags.dead && isWolf(x) && (x.role||"")!=="Rachsüchtiger Wolf" && (x.role||"")!=="Doppelspion");
      };
      document.getElementById("mbtns").append(no,yes);
      ov.style.display="flex";
    }catch(e){}
  }, "König Lykaon":({pick,save,draw,center,seats})=>{
    const rn=(window.getRoleName&&window.getRoleName("König Lykaon"))||"König Lykaon";
    if(isOnceUsed("König Lykaon")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    const nc=typeof state.nightCount==="number"?state.nightCount:1;
    if(nc>1){
      markOnceUsed("König Lykaon");
      save();draw();
      try{rebuildOrder()}catch(e){}
      center((window.tf&&window.tf("koenigLykaonFirstNightOnly",{role:rn}))||(rn+": Nur in der ersten Nacht wirksam."),false);
      return;
    }
    const allies=(seats||[]).filter(s=>!s.flags.dead&&isWolf(s)&&s.role!=="König Lykaon");
    if(!allies.length){
      center((window.tf&&window.tf("koenigLykaonNoAlly",{role:rn}))||(rn+": Kein verbündeter Wolf wählbar."),false);
      return;
    }
    pick(rn+"  — wähle einen verbündeten Wolf",ally=>{
      if(!ally||!isWolf(ally)||ally.role==="König Lykaon")return;
      pick(rn+"  — wähle den Dorfbewohner (wird Trugbilderwolf)",v=>{
        if(!v||isWolf(v))return;
        if(typeof applyRoleOrVillagerIfGatewardenWolf==="function") applyRoleOrVillagerIfGatewardenWolf(v,"Trugbilderwolf",true);
        else { v.role="Trugbilderwolf"; v.flags.werewolf=true; }
        markOnceUsed("König Lykaon");
        save();draw();
        try{rebuildOrder()}catch(e){}
      },x=>!x.flags.dead&&!isWolf(x));
    },x=>!x.flags.dead&&isWolf(x)&&x.role!=="König Lykaon");
  },
  "Schicksalswolf":({startMulti,save,draw,center})=>{
    const rn=(window.getRoleName&&window.getRoleName("Schicksalswolf"))||"Schicksalswolf";
    const nc=state.nightCount||1;
    state.once=state.once||{};
    if(nc===1&&!(state.once.FateWolfMarked&&state.once.FateWolfMarked.length>=3)){
      startMulti(rn+"  — wähle 3 Spieler (Markierung)",3,x=>!x.flags.dead,chs=>{
        if(!chs||chs.length<3)return;
        state.once.FateWolfMarked=chs.map(s=>s.id);
        save();draw();center((window.t&&window.t("fateWolfThreeMarked"))||"Schicksalswolf: 3 Spieler markiert.",true);
      });
      return;
    }
    if(nc>=4&&!state.once.FateWolfNight4Used){
      const marks=state.once.FateWolfMarked||[];
      const f3=(state.once.FirstThreeDeadIds||[]).slice(0,3);
      const bonus=marks.filter(id=>f3.includes(id)).length;
      if(bonus<1){center((window.t&&window.t("fateWolfNoExtraNight4"))||"Schicksalswolf: Keine Extra-Reißer in Nacht 4.",false);return}
      startMulti(rn+"  — wähle "+bonus+" Extra-Opfer (Nacht 4)",bonus,x=>!x.flags.dead,chs=>{
        if(!chs||chs.length<bonus)return;
        state.once.FateWolfExtraIds=(state.once.FateWolfExtraIds||[]).concat(chs.map(s=>s.id));
        state.once.FateWolfNight4Used=true;
        save();draw();center((window.t&&window.t("fateWolfExtraTargetsSet"))||"Extra-Ziele für den Wolfsangriff gesetzt.",true);
      });
      return;
    }
    center((window.t&&window.t("fateWolfNoAction"))||"Schicksalswolf: Derzeit keine Aktion.",false);
  },
  "Schattenwanderer":({pick,save,draw,center})=>{
    if(isOnceUsed("Schattenwanderer")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    pick(((window.getRoleName&&window.getRoleName("Schattenwanderer"))||"Schattenwanderer")+"  — Partner für Todeskette",o=>{
      const me=state.seats.find(s=>s.role==="Schattenwanderer"&&!s.flags.dead);
      if(!me)return;
      me.meta=me.meta||{};
      o.meta=o.meta||{};
      me.meta.shadowSwapPartnerId=o.id;
      o.meta.shadowSwapPartnerId=me.id;
      markOnceUsed("Schattenwanderer");
      save();draw();
      center((window.t&&window.t("shadowWandererChainActive"))||"Schattenwanderer: Todeskette aktiv (Partner gewählt).",true);
    },x=>!x.flags.dead&&x.role!=="Schattenwanderer");
  },
  "Giftwolf":({pick,save,draw,center})=>{
    state.once.GiftwolfUses=(state.once.GiftwolfUses||0);
    if(state.once.GiftwolfUses>=2){center((window.t&&window.t("giftwolfNoCharges"))||"Giftwolf: Keine Ladungen mehr.",false);return}
    pick(((window.getRoleName&&window.getRoleName("Giftwolf"))||"Giftwolf")+"  — Giftpranken",t=>{
      t.meta=t.meta||{};
      const dieOn=(state.once.MorningCount||0)+2;
      t.meta.giftwolfDieOnMorning=dieOn;
      t.meta.giftwolfPoisoned=true;
      state.once.GiftwolfUses++;
      save();draw();
      center((window.tf&&window.tf("giftwolfInform",{name:t.name||("#"+t.id)}))||("Giftwolf: "+(t.name||("#"+t.id))+" wurde vergiftet — stirbt in 2 Tagen (SL informieren)."),true);
    },x=>!x.flags.dead);
  },
  "Schwarze Witwe":({pick,save,draw,center,seats})=>{
    if(!seats.some(s=>s.role==="Loki")){center((window.t&&window.t("blackWidowLokiRequired"))||"Schwarze Witwe: Loki muss im Spiel sein.",false);return}
    pick(((window.getRoleName&&window.getRoleName("Schwarze Witwe"))||"Schwarze Witwe")+"  — wähle 1",t=>{
      let pair=[];
      if((t.meta&&t.meta.loverId)||t.flags.inlove){const p=seats.find(s=>s.id===t.meta.loverId);if(p&&!p.flags.dead)pair=[t.id,p.id]}
      else if((t.meta&&t.meta.rivalId)||t.flags.rival){const p=seats.find(s=>s.id===t.meta.rivalId);if(p&&!p.flags.dead)pair=[t.id,p.id]}
      if(pair.length<2){center((window.t&&window.t("blackWidowNoPair"))||"Schwarze Witwe: Kein Liebes-/Hass-Paar gefunden.",false);return}
      state.once.WidowMorningKills=pair;
      save();draw();
      center((window.t&&window.t("blackWidowBothDie"))||"Schwarze Witwe: Beide Verbundenen sterben am nächsten Tag.",true);
    },x=>!x.flags.dead);
  },
  "Doktor":({startMulti,flash,save,center})=>{
    startMulti(((window.getRoleName&&window.getRoleName("Doktor"))||"Doktor")+"  — 2 Blutproben",2,x=>!x.flags.dead,chs=>{
      if(!chs||chs.length<2)return;
      const same=abilityTeamOfSeat(chs[0])===abilityTeamOfSeat(chs[1]);
      flash(same?"✅":"❌");
      center((same?(window.t&&window.t("doctorSameTeam")):(window.t&&window.t("doctorDifferentTeam")))||(same?"Gleiches Team":"Unterschiedliche Teams"),true);
    });
  },
  "Fährtenleser":({flash,save,center,seats})=>{
    if(isOnceUsed("Fährtenleser")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    const tr=state.seats.find(s=>s.role==="Fährtenleser"&&!s.flags.dead);
    if(!tr)return;
    const n=seats.length,ti=tr.id-1;
    let best=null,minD=999;
    seats.forEach(w=>{
      if(w.flags.dead||!isWolf(w))return;
      const wi=w.id-1;
      const cw=(wi-ti+n)%n;
      const ccw=(ti-wi+n)%n;
      if(cw===0)return;
      const useLeft=cw<=ccw;
      const d=Math.min(cw,ccw);
      if(d<minD){minD=d;best=useLeft?"links":"rechts"}
    });
    markOnceUsed("Fährtenleser");
    save();
    const dirStr=best==="links"?((window.t&&window.t("trackerDirLeft"))||"links"):((window.t&&window.t("trackerDirRight"))||"rechts");
    center(best?(window.tf&&window.tf("trackerNearestWolf",{dir:dirStr}))||("Nächster Wolf: "+best):(window.t&&window.t("trackerNoWolf"))||"Kein Wolf gefunden",true);
  },
  "Waldläufer":({center,seats})=>{
    const n=seats.filter(s=>!s.flags.dead&&isWolf(s)).length;
    center((window.tf&&window.tf("rangerWolves",{n}))||("Lebende Werwölfe (Zählung): "+n),true);
  },
  "Schutzgeist":({pick,save,draw,center,seats})=>{
    if(!state.once.SchutzgeistAwaitingPick){center((window.t&&window.t("schutzgeistNotActive"))||"Schutzgeist: Noch nicht aktiv.",false);return}
    pick(((window.getRoleName&&window.getRoleName("Schutzgeist"))||"Schutzgeist")+"  — Schutzschild vergeben",s=>{
      s.meta=s.meta||{};
      s.flags.protected=true;
      if(isWolf(s)){
        try{center((window.t&&window.t("schutzgeistWolf"))||"ÖFFENTLICH: Der Schutzgeist hat einen Werwolf gewählt!",true)}catch(e){}
      }
      state.once.SchutzgeistAwaitingPick=false;
      save();draw();
    },x=>!x.flags.dead);
  },
  "Dorfchronistin":({center,seats})=>{
    if(state.once.ChroniclerShown){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    let c=0;
    (seats||[]).forEach(s=>{
      if(!s.role)return;
      if(typeof getFaction==="function"&&getFaction(s.role)==="solo")c++;
      else if(SOLO_WIN_ROLES.has(s.role))c++;
    });
    state.once.ChroniclerShown=true;
    center((window.tf&&window.tf("chroniclerSolos",{n:c}))||("Solo-Rollen im Spiel: "+c),true);
  },
  "Zeitwächter":({center,save,draw})=>{
    if(isOnceUsed("Zeitwächter")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    state.once.TimekeeperFreezeMorning=true;
    markOnceUsed("Zeitwächter");
    save();draw();
    center((window.t&&window.t("timekeeperMorningFreeze"))||"Zeitwächter: Diese Nacht wird beim Tagesbeginn eingefroren (keine Auflösung, keine Nachtzählung).",true);
  },
  "Amalia":({center,save,draw,seats})=>{
    const w=seats.filter(s=>!s.flags.dead&&isWolf(s)).length;
    if(w<=2){center((window.t&&window.t("amaliaTooFewWolves"))||"Amalia: Zu wenige Werwölfe.",false);return}
    const me=seats.find(s=>s.role==="Amalia"&&!s.flags.dead);
    if(!me)return;
    const ov=document.getElementById("overlay");
    const mt=document.getElementById("mt");
    const mb=document.getElementById("mb");
    const mbtns=document.getElementById("mbtns");
    if(!ov||!mt||!mb||!mbtns)return;
    mt.textContent=(window.getRoleName&&window.getRoleName("Amalia"))||"Amalia";
    mb.className="big";
    mb.textContent=(window.t&&window.t("amaliaConfirmSacrifice"))||"Amalia opfern und öffentliche Ja/Nein-Frage stellen?";
    mbtns.innerHTML="";
    const btnCancel=document.createElement("button");
    btnCancel.className="btn";
    btnCancel.textContent=(window.t&&window.t("cancel"))||"Abbrechen";
    btnCancel.onclick=()=>{ov.style.display="none";};
    const btnOk=document.createElement("button");
    btnOk.className="btn good";
    btnOk.textContent=(window.t&&window.t("amaliaButtonConfirm"))||"Opfern";
    btnOk.onclick=()=>{
      applyKill(me,"AMALIA_SACRIFICE");
      ov.style.display="none";
      save();draw();postDeathHooks();
    };
    mbtns.append(btnCancel,btnOk);
    ov.style.display="flex";
    try{if(typeof fitModalText==="function")fitModalText();}catch(e){}
  },
  "Kriegerin des Lichts":({pick,save,draw,center})=>{
    if(isOnceUsed("Kriegerin des Lichts")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    pick(((window.getRoleName&&window.getRoleName("Kriegerin des Lichts"))||"Kriegerin des Lichts")+"  — Ziel",t=>{
      const ov=document.getElementById("overlay");
      document.getElementById("mt").textContent=(window.t&&window.t("warriorModerationTitle"))||"Spielleitung";
      document.getElementById("mb").className="big";
      document.getElementById("mb").textContent=(window.tf&&window.tf("warriorAskWolf",{name:t.name||("#"+t.id)}))||("Ist "+(t.name||("#"+t.id))+" ein Wolf?");
      document.getElementById("mbtns").innerHTML="";
      const y=document.createElement("button");y.className="btn good";y.textContent=(window.t&&window.t("warriorYesWolf"))||"Ja (Wolf)";
      const n=document.createElement("button");n.className="btn bad";n.textContent=(window.t&&window.t("no"))||"Nein";
      const me=state.seats.find(s=>s.role==="Kriegerin des Lichts"&&!s.flags.dead);
      y.onclick=()=>{ov.style.display="none";markOnceUsed("Kriegerin des Lichts");save();draw();center((window.t&&window.t("warriorTargetIsWolf"))||"Kriegerin: Ziel ist Wolf.",true);try{rebuildOrder()}catch(e){}};
      n.onclick=()=>{ov.style.display="none";if(me)applyKill(me,"WARRIOR_WRONG");markOnceUsed("Kriegerin des Lichts");save();draw();postDeathHooks()};
      document.getElementById("mbtns").append(y,n);
      ov.style.display="flex";
    },x=>!x.flags.dead);
  },
  "Dorfschmied":({pick,center,save,draw})=>{
    const n=state.once.SchmiedForgeNights||0;
    if(n<6){center((window.tf&&window.tf("schmiedForging",{n}))||("Dorfschmied: Schmiede läuft — Nacht "+n+" von 6."),false);return}
    if(state.once.SchmiedWeaponGiven){center((window.t&&window.t("schmiedWeaponAlreadyGiven"))||"Dorfschmied: Waffe bereits vergeben.",false);return}
    pick(((window.getRoleName&&window.getRoleName("Dorfschmied"))||"Dorfschmied")+"  — Waffe übergeben",s=>{
      s.meta=s.meta||{};
      s.meta.schmiedWeapon=true;
      state.once.SchmiedWeaponGiven=true;
      save();draw();
      center((window.t&&window.t("schmiedWeaponGranted"))||"Schmiede-Waffe vergeben — nächster Wolfsangriff wird abgewehrt (ein Wolf stirbt).",true);
    },x=>!x.flags.dead);
  },
  "Grabräuber":({pick,center,save,draw})=>{
    if(isOnceUsed("Grabräuber")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    pick(((window.getRoleName&&window.getRoleName("Grabräuber"))||"Grabräuber")+"  — tote Rolle wählen",t=>{
      markOnceUsed("Grabräuber");
      state.once.GrabrauberStolenRole=t.role;
      save();draw();
      center((window.tf&&window.tf("graverobberStolen",{role:(window.getRoleName&&window.getRoleName(t.role||""))||(t.role||"?")}))||("Grabräuber: Fähigkeit von "+(t.role||"?")+" gestohlen — SL setzt um."),true);
    },x=>x.flags.dead&&!!x.role);
  },
  "Parasit":({pick,save,draw,center})=>{
    pick(((window.getRoleName&&window.getRoleName("Parasit"))||"Parasit")+"  — Wirt heften",h=>{
      state.seats.filter(s=>s.role==="Parasit").forEach(s=>{s.meta=s.meta||{};s.meta.parasiteHostId=h.id});
      save();draw();
      center((window.t&&window.t("parasiteHostChosen"))||"Parasit: Wirt gewählt.",true);
    },x=>!x.flags.dead&&x.role!=="Parasit");
  },
  "Todesprediger":({center,save,draw})=>{
    if(state.once.TodespredigerPrediction){center((window.t&&window.t("deathProphetPredictionExists"))||"Todesprediger: Vorhersage steht.",false);return}
    const ov=document.getElementById("overlay");
    const mt=document.getElementById("mt");
    const mb=document.getElementById("mb");
    const mbtns=document.getElementById("mbtns");
    if(!ov||!mt||!mb||!mbtns)return;
    mt.textContent=(window.getRoleName&&window.getRoleName("Todesprediger"))||"Todesprediger";
    mb.className="big";
    mb.textContent="";
    const lbl=document.createElement("div");
    lbl.style.cssText="margin-bottom:8px;color:#e8ecff;";
    lbl.textContent=(window.t&&window.t("deathProphetPrompt"))||"Todesprediger: 'night N' oder 'day N' (z.B. night 3 / day 2)";
    const inp=document.createElement("input");
    inp.type="text";
    inp.style.cssText="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:1px solid #3d4a7a;background:#0d1228;color:#e8ecff;";
    inp.setAttribute("autocomplete","off");
    mb.appendChild(lbl);
    mb.appendChild(inp);
    mbtns.innerHTML="";
    const finish=()=>{
      const t=(inp.value||"").trim();
      const m=t.match(/(night|day|nacht|tag)\s*(\d+)/i);
      if(!m){
        center((window.t&&window.t("deathProphetInvalid"))||"Ungültige Eingabe.",false);
        return;
      }
      const kind=m[1].toLowerCase();
      const num=parseInt(m[2],10);
      state.once.TodespredigerPrediction={t:(kind==="night"||kind==="nacht")?"night":"day",n:num};
      save();
      ov.style.display="none";
      center((window.t&&window.t("deathProphetSaved"))||"Todesprediger: Vorhersage gespeichert.",true);
};
    const btnCancel=document.createElement("button");
    btnCancel.className="btn";
    btnCancel.textContent=(window.t&&window.t("cancel"))||"Abbrechen";
    btnCancel.onclick=()=>{ov.style.display="none";};
    const btnOk=document.createElement("button");
    btnOk.className="btn good";
    btnOk.textContent=(window.t&&window.t("yes"))||"OK";
    btnOk.onclick=()=>{finish();};
    mbtns.append(btnCancel,btnOk);
    ov.style.display="flex";
    try{setTimeout(function(){inp.focus();if(typeof fitModalText==="function")fitModalText();},0);}catch(e){}
  },
  "Rattenfänger": ({startMulti,save,draw,center}) => {
    const ov = document.getElementById("overlay");
    document.getElementById("mt").textContent = (window.getRoleName&&window.getRoleName("Rattenfänger"))||"Rattenfänger";
    document.getElementById("mb").className = "big";
    document.getElementById("mb").textContent = (window.t&&window.t("charmHowMany"))||"Wie viele willst du verzaubern?";
    document.getElementById("mbtns").innerHTML = "";

    const one = document.createElement("button");
    one.className = "btn good";
    one.textContent = (window.t&&window.t("charmTargets1"))||"1 Ziel";
    one.onclick = () => {
      ov.style.display = "none";
      startMulti(((window.getRoleName&&window.getRoleName("Rattenfänger"))||"Rattenfänger")+"  — verzaubere 1", 1, x => !x.flags.dead && !x.flags.charmed, chs => {
        chs.forEach(s => s.flags.charmed = true);
        save(); draw(); checkFluteWin();
      });
    };

    const two = document.createElement("button");
    two.className = "btn good";
    two.textContent = (window.t&&window.t("charmTargets2"))||"2 Ziele";
    two.onclick = () => {
      ov.style.display = "none";
      startMulti(((window.getRoleName&&window.getRoleName("Rattenfänger"))||"Rattenfänger")+"  — verzaubere 2", 2, x => !x.flags.dead && !x.flags.charmed, chs => {
        chs.forEach(s => s.flags.charmed = true);
        save(); draw(); checkFluteWin();
      });
    };

    document.getElementById("mbtns").append(one, two);
    ov.style.display = "flex";
  },

  "Pestbringerin":({pick,save,draw,center})=>{
    state.once = state.once || {};
    state.once.PestTotal = state.once.PestTotal || 0;
    if(state.once.PestTotal >= 2){
      center((window.t&&window.t("pestNoPotions"))||"Pestbringerin: Keine Tränke mehr.", false);
      return;
    }
    if(state.once.PestUsedTonight){
      center((window.t&&window.t("pestUsedTonight"))||"Pestbringerin: Diese Nacht schon genutzt.", false);
      return;
    }
    pick(
      "Pestbringerin  — vergifte 1 (☣)",
      s=>{
        if(!s.flags.dead && !s.flags.poisoned){
          s.flags.poisoned = true;
          state.once.PestUsedTonight = true;
          state.once.PestTotal++;
          save(); draw(); checkPestWin();
        }
      },
      x=>!x.flags.dead && !x.flags.poisoned
    );
  },
  "Feuerteufel":({pick,save,draw})=>pick("Feuerteufel  — zünde 1 an (🔥)",s=>{s.flags.burned=true;save();draw()},x=>!x.flags.dead),
  "Blutpriester":({pick,save,draw,seats,center})=>{if(isOnceUsed("Blutpriester")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}pick("Blutpriester  — opfere 1",s=>{if(!s.flags.dead){applyKill(s,"BLOODPRIEST_SACRIFICE");markOnceUsed("Blutpriester");save();draw();try{rebuildOrder()}catch(e){}if(typeof postDeathHooks==="function")postDeathHooks();}const ov=document.getElementById("overlay");document.getElementById("mt").textContent="Blutpriester";document.getElementById("mb").className="big";document.getElementById("mb").textContent="SL: Wieviele Wölfe aufdecken?";document.getElementById("mbtns").innerHTML="";const make=(n)=>{const b=document.createElement("button");b.className="btn";b.textContent=String(n);b.onclick=()=>{ov.style.display="none";const wolves=seats.filter(x=>!x.flags.dead&&isWolf(x));let pool=wolves.slice().sort(()=>Math.random()-0.5);const k=Math.min(n,pool.length);const shown=pool.slice(0,k);const names=shown.map(x=>x.name||("#"+x.id)).join("  • ");center((window.tf&&window.tf("logBloodpriestResult",{names:names||"—"}))||("Aufgedeckte Wölfe: "+(names||"—")),true);};return b};const b0=make(0),b1=make(1),b2=make(2),b3=make(3);document.getElementById("mbtns").append(b0,b1,b2,b3);ov.style.display="flex";},x=>!x.flags.dead)},
  Schattenhund:({save,draw,center})=>{
    if(isOnceUsed("Schattenhund")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    if((state.nightCount||1)===1){center("Schattenhund kann in Nacht 1 nicht eingesetzt werden — Wolfskind & Lehrling würden ihre einmaligen Fähigkeiten dauerhaft verlieren.",false);return}
    const ov=document.getElementById("overlay");document.getElementById("mt").textContent="Schattenhund";document.getElementById("mb").className="big";document.getElementById("mb").textContent="Dorf-Fähigkeiten 1 Nacht blockieren?";document.getElementById("mbtns").innerHTML=""
    const y=document.createElement("button");y.className="btn bad";y.textContent="Ja";y.onclick=()=>{state.once.SchattenhundBlocked=true;markOnceUsed("Schattenhund");save();draw();ov.style.display="none"}
    const n=document.createElement("button");n.className="btn";n.textContent="Nein";n.onclick=()=>ov.style.display="none"
    document.getElementById("mbtns").append(y,n);ov.style.display="flex"
  },
  Wolfskind:({pick,save,center})=>{
    if(isOnceUsed("Wolfskind")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    pick((window.t&&window.t("wolfskindPickRoleModel"))||"Wolfskind — wähle ein Vorbild",s=>{state.once.MogliVorbildId=s.id;s.flags.vorbild=true;markOnceUsed("Wolfskind");save()},x=>!x.flags.dead)
  },
  Lehrling:({pick,save,center})=>{
    if(isOnceUsed("Lehrling")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    pick("Lehrling  — wähle Mentor (Dorfbewohner)",s=>{if(isWolf(s))return;state.once.LehrlingMentorId=s.id;markOnceUsed("Lehrling");save()},x=>!x.flags.dead&&!isWolf(x))
  },
  "Korrupter Richter":({pick,save})=>{
    const ov=document.getElementById("overlay");document.getElementById("mt").textContent="Korrupter Richter";document.getElementById("mb").className="big";document.getElementById("mb").textContent="Heute markieren?";document.getElementById("mbtns").innerHTML=""
    const y=document.createElement("button");y.className="btn good";y.textContent="Ja";y.onclick=()=>{ov.style.display="none";pick("Richter  — markiere 1",s=>{s.flags.nominated=true;state.pending.judgeAsk=true;save()},x=>!x.flags.dead)}
    const n=document.createElement("button");n.className="btn";n.textContent="Nein";n.onclick=()=>{state.pending.judgeAsk=false;save();ov.style.display="none"}
    document.getElementById("mbtns").append(y,n);ov.style.display="flex"
  },
  "Verdammniswächter":({seats,save,draw,center})=>{
    const v=seats.find(x=>x.flags.targeted&&!x.flags.dead);if(!v){center((window.t&&window.t("noTargetSet"))||"Kein Opfer gesetzt.",false);return}
    let pool=seats.filter(s=>!s.flags.dead&&s!==v);if(!pool.length){center((window.t&&window.t("nobodyElseLives"))||"Niemand sonst lebt.",false);return}
    const rnd=pool[Math.floor(Math.random()*pool.length)]
    const ov=document.getElementById("overlay");document.getElementById("mt").textContent="Verdammniswächter";document.getElementById("mb").className="big";document.getElementById("mb").textContent=(window.tf&&window.tf("doomGuardianChoice",{vName:v.name||"#"+v.id,rndName:rnd.name||"#"+rnd.id}))||("Wer stirbt? Wähle 1 von 2: "+(v.name||"#"+v.id)+" (Nachtopfer) oder "+(rnd.name||"#"+rnd.id));document.getElementById("mbtns").innerHTML=""
    const b1=document.createElement("button"),b2=document.createElement("button");[b1,b2].forEach(b=>b.className="btn")
    b1.textContent=(window.tf&&window.tf("doomGuardianDies",{name:v.name||"#"+v.id}))||((v.name||"#"+v.id)+" stirbt");b2.textContent=(window.tf&&window.tf("doomGuardianDies",{name:rnd.name||"#"+rnd.id}))||((rnd.name||"#"+rnd.id)+" stirbt")
    b1.onclick=()=>{v.flags.targeted=false;applyKill(v,"VERDAMMNISWAECHTER");ov.style.display="none";save();draw();if(typeof postDeathHooks==="function")postDeathHooks()};
    b2.onclick=()=>{v.flags.targeted=false;applyKill(rnd,"VERDAMMNISWAECHTER");save();draw();ov.style.display="none";if(typeof postDeathHooks==="function")postDeathHooks()};
    document.getElementById("mbtns").append(b1,b2);ov.style.display="flex"
  },
  Seelentauscher:({seats,center,save,draw,startMulti})=>{
    if(isOnceUsed("Seelentauscher")){center((window.t&&window.t("alreadyUsed"))||"Schon genutzt.",false);return}
    const ov=document.getElementById("overlay");
    document.getElementById("mt").textContent=(window.getRoleName&&window.getRoleName("Seelentauscher"))||"Seelentauscher";
    document.getElementById("mb").className="big";
    document.getElementById("mb").textContent=(window.t&&window.t("soulShifterUseNow"))||"Seelentauscher: Fähigkeit jetzt nutzen?";
    document.getElementById("mbtns").innerHTML="";
    const no=document.createElement("button");
    no.className="btn";
    no.textContent=(window.t&&window.t("no"))||"No";
    no.onclick=()=>{ov.style.display="none";};
    const yes=document.createElement("button");
    yes.className="btn good";
    yes.textContent=(window.t&&window.t("yes"))||"Yes";
    yes.onclick=()=>{
      ov.style.display="none";
      const promptText=(window.t&&window.t("soulShifterMultiPrompt"))||"Seelentauscher  — tausche die Rollen von 2 Spielern";
      startMulti(promptText,2,x=>!!x.role,chs=>{
        if(!chs||chs.length!==2){
          center((window.t&&window.t("soulShifterNeedTwo"))||"Du musst genau 2 Spieler wählen.",false);
          return;
        }
        const a=chs[0],b=chs[1];
        const oldA=a.role, oldB=b.role;
        const aGetsWolf = !a.flags.dead && typeof isWolf==="function" && isWolf({role:oldB,flags:{werewolf:false},meta:a.meta||{}}) && !isWolf(a);
        const bGetsWolf = !b.flags.dead && typeof isWolf==="function" && isWolf({role:oldA,flags:{werewolf:false},meta:b.meta||{}}) && !isWolf(b);
        const gw = typeof gatewardenBlocksNewWolves==="function" && gatewardenBlocksNewWolves();
        if(aGetsWolf && bGetsWolf && gw){
          a.role="Dorfbewohner"; a.flags.werewolf=false; if(a.meta) a.meta.cursedWolfAura=false;
          b.role="Dorfbewohner"; b.flags.werewolf=false; if(b.meta) b.meta.cursedWolfAura=false;
        }else if(aGetsWolf && gw){
          a.role="Dorfbewohner";
          a.flags.werewolf=false;
          if(a.meta) a.meta.cursedWolfAura=false;
          b.role=oldA;
          b.flags.werewolf=!!(typeof isWolf==="function" && isWolf(b));
        }else if(bGetsWolf && gw){
          b.role="Dorfbewohner";
          b.flags.werewolf=false;
          if(b.meta) b.meta.cursedWolfAura=false;
          a.role=oldB;
          a.flags.werewolf=!!(typeof isWolf==="function" && isWolf(a));
        }else{
          a.role=oldB;
          b.role=oldA;
          a.flags.werewolf=!!(typeof isWolf==="function" && isWolf(a));
          b.flags.werewolf=!!(typeof isWolf==="function" && isWolf(b));
        }
        if(gw && (aGetsWolf || bGetsWolf)){
          try{ if(typeof center==="function") center((window.t&&window.t("gatewardenRedirectVillager"))||"Wächter am Tor: Neue Werwölfe sind blockiert. Der Spieler wird stattdessen zum Dorfbewohner.", false); }catch(e){}
        }
        resetOnceForInheritedRole(a.role)
        resetOnceForInheritedRole(b.role)
        markOnceUsed("Seelentauscher")
        save();draw();try{rebuildOrder()}catch(e){}
      })
    };
    document.getElementById("mbtns").append(no,yes);
    ov.style.display="flex";
  },  
"Prophet des Untergangs":({seats,startMulti,pick,save,draw,center})=>{
  var once = state.once || (state.once = {});
  var arr = (once.ProphetTargets && Array.isArray(once.ProphetTargets)) ? once.ProphetTargets : null;

  if(!arr){
    startMulti((window.t&&window.t("prophetMarkUnholy"))||"Prophet  — markiere 3 unheilig", 3, function(x){return !x.flags.dead;}, function(chs){
      chs.forEach(function(s){ s.meta = s.meta || {}; s.meta.unholy = true; });
      once.ProphetTargets = chs.map(function(s){return s.id;});
      once.ProphetUnlocked = false;
      save(); draw(); try{ rebuildOrder(); }catch(e){}
    });
    return;
  }

  var deadCnt = arr.filter(function(id){
    var found = seats.find(function(s){ return s.id===id; }) || {};
    var flags = found.flags || {};
    return !!flags.dead;
  }).length;
  if(deadCnt < 3){ center((window.tf&&window.tf("prophetUnholyRemaining",{n:3-deadCnt}))||("Noch "+(3-deadCnt)+" unheilig(e) am Leben."), false); return; }

  if(!once.ProphetUnlocked){ once.ProphetUnlocked = true; save(); }

  if(once.ProphetKillUsedTonight){ center((window.t&&window.t("usedThisNight"))||"Schon genutzt in dieser Nacht.", false); return; }
  pick((window.t&&window.t("prophetKillOne"))||"Prophet  — töte 1", function(s){
    if(!s.flags.dead){
      applyKill(s,"PROPHET_KILL");
      once.ProphetKillUsedTonight = true;
      save(); draw(); try{ rebuildOrder(); }catch(e){}
      if(typeof postDeathHooks==="function")postDeathHooks();
    }
  }, function(x){ return !x.flags.dead; });
},

  Traumdeuter:({seats,center})=>{const alive=seats.filter(s=>!s.flags.dead);const wolves=alive.filter(x=>isWolf(x));const nonwolves=alive.filter(x=>!isWolf(x));if(wolves.length===0||nonwolves.length<2){center((window.t&&window.t("notEnoughTargets"))||"Nicht genügend Ziele verfügbar.",false);return}const wolf=wolves[Math.floor(Math.random()*wolves.length)];let pool=nonwolves.slice();const two=[];while(two.length<2&&pool.length){const i=Math.floor(Math.random()*pool.length);two.push(pool.splice(i,1)[0])}const shown=[wolf,...two].sort(()=>Math.random()-0.5);const names=shown.map(x=>x.name||("#"+x.id)).join("  • ");center(names+"\n"+((window.t&&window.t("traumdeuterHint"))||"(Genau 1 ist Werwolf)"),true)},
  Henker:({save,draw,pick,center,seats})=>{if((state.once.LynchCount||0)<3){center((window.t&&window.t("henkerNotActive"))||"Noch nicht aktiv (3 Lynch-Tote nötig).",false);return}pick("Henker  — markiere 1",s=>{state.seats.forEach(t=>t.flags.hmark=false);s.flags.hmark=true;save();draw();},x=>!x.flags.dead)},
  Kutscher:({seats,center,save,draw})=>{
    const dead=seats.filter(s=>s.flags.dead)
    if(dead.length<10){center((window.t&&window.t("tooFewDead"))||"Zu wenige Tote.",false);return}
    const ov=document.getElementById("overlay");document.getElementById("mt").textContent=(window.t&&window.t("kutscherTitle"))||"Kutscher";document.getElementById("mb").className="big";document.getElementById("mb").textContent=(window.t&&window.t("kutscherNeighborHelp"))||"Nachbardorf um Hilfe bitten?";document.getElementById("mbtns").innerHTML=""
    const y=document.createElement("button");y.className="btn good";y.textContent=(window.t&&window.t("yes"))||"Ja"
    const n=document.createElement("button");n.className="btn";n.textContent=(window.t&&window.t("no"))||"Nein"
    y.onclick=()=>{ov.style.display="none";
      const pool=dead.slice()
      const chosen=[]
      while(chosen.length<3 && pool.length){const i=Math.floor(Math.random()*pool.length); chosen.push(pool.splice(i,1)[0])}
      if(chosen.length<3){center((window.t&&window.t("tooFewDead"))||"Zu wenige Tote.",false);return}
      const wolfIndex=Math.floor(Math.random()*3)
      const wolfNames=new Set(["Werwolf","Rachsüchtiger Wolf","König Lykaon","Siegreicher Wolf","Seuchenwolf","Schicksalswolf","Schattenwanderer","Giftwolf","Rudelvater","Schwarze Witwe","Schattenhund","Spiegelwolf","Dämonischer Wolf","Trugbilderwolf","Besessener Wolf","Fenrir","Blutwolf","Albtraumwolf","Cerberus"])
      const nonWolfPool=ALL_ROLES.filter(r=>!wolfNames.has(r))
      const gwK = typeof gatewardenBlocksNewWolves==="function" && gatewardenBlocksNewWolves();
      chosen.forEach((s,idx)=>{
        s.flags={dead:false,protected:false,targeted:false,inlove:false,rival:false,werewolf:false,vorbild:false,nominated:false,charmed:false,poisoned:false,burned:false,puppet:false,hmark:false,deadVoteStripped:false}
        s.meta={cerbHeads:0,killedTonight:false,cursedWolfAura:false,rivalId:null,loverId:null,unholy:false,blockedTonight:false}
        if(idx===wolfIndex){
          if(gwK){ s.role="Dorfbewohner"; try{ center((window.t&&window.t("gatewardenRedirectVillager"))||"Wächter am Tor: Neue Werwölfe sind blockiert. Der Spieler wird stattdessen zum Dorfbewohner.", false); }catch(e){} }
          else { s.role="Werwolf"; s.flags.werewolf=true }
        }else{const rr=nonWolfPool[Math.floor(Math.random()*nonWolfPool.length)]||"Das Orakel";s.role=rr; if(/wolf/i.test(rr))s.flags.werewolf=true}
      })
      state.once.KutscherUsed=true;save();draw();rebuildOrder();center((window.t&&window.t("kutscherRevived"))||"3 wieder im Spiel (1 davon Wolf).",true)
    }
    n.onclick=()=>{ov.style.display="none"}
    document.getElementById("mbtns").append(y,n);ov.style.display="flex"
  }
};
