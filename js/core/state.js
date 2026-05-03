const LS_KEY="uw_custom_v16"

function ensureSeatDefaults(s){
  s.flags = Object.assign({dead:false,protected:false,protectedCount:0,targeted:false,inlove:false,rival:false,werewolf:false,vorbild:false,nominated:false,charmed:false,poisoned:false,burned:false,puppet:false,hmark:false,deadVoteStripped:false}, s.flags||{});
  s.meta = Object.assign({deathProcessed:false,hunterQueued:false,hunterShot:false,cerbHeads:0,killedTonight:false,cursedWolfAura:false,rivalId:null,loverId:null,unholy:false,blockedTonight:false}, s.meta||{});
  return s;
}

function createState(n){
  const st={seats:Array.from({length:n},(_,i)=>({id:i+1,name:"",role:"",flags:{dead:false,protected:false,targeted:false,inlove:false,rival:false,werewolf:false,vorbild:false,nominated:false,charmed:false,poisoned:false,burned:false,puppet:false,hmark:false},meta:{cerbHeads:0,killedTonight:false,cursedWolfAura:false,rivalId:null,unholy:false,blockedTonight:false}})),once:{LynchCount:0,KutscherUsed:false,Used:{},ghost:{copiedRole:null,active:false},WaldhexeL:false,WaldhexeD:false,MaertyUsed:false,PestTotal:0,PestUsedTonight:false,ProphetTargets:null,ProphetUnlocked:false,VoodooCooldown:0,MogliVorbildId:null,LehrlingMentorId:null,OldDebuff:0,BlockedRolesTonight:[],totenkarten:{},KartenschluckerStapel:0,KartenschluckerKilledTonight:false,KartenschluckerShield:false,KartenschluckerNightCount:0,TotenratFuehrerSilenced:[],TotenratFuehrerRevealed:false,TotenratFuehrerUsedDeflect:false,HadesLichter:0,HadesBarriere:false,HadesVoteBonus:false,HadesKilledTonight:false,HadesWon:false},dark:false,fenrirStage:0,fenrirSaved:false,files:{night:null,nightPos:0,alarm:null},font:"fell",pending:{judgeAsk:false},ui:{judgeAsk:false,ghostCasting:false},layout:{scale:100,ratio:120,offx:0,offy:0}};
  st.once._nightIncremented=false;
  st.seats=st.seats.map(ensureSeatDefaults);
  return st;
}

function migrateLegacyRoleIds(st){
  if(!st) return;
  var map={Amor:"Loki",Hexe:"Waldhexe",Jäger:"Sensenträger",Seherin:"Das Orakel","Flötenspieler":"Rattenfänger","Weißer Werwolf":"Rachsüchtiger Wolf","Der Alte":"Der Weise",Engel:"Schutzengel","Blinzelmädchen":"Dorfbewohner",Bärenführer:"Nachtwächter",Fuchs:"Spürhund",Urwolf:"König Lykaon","Totenrat-Führer":"Nekromant"};
  (st.seats||[]).forEach(function(s){ if(s.role&&map[s.role]) s.role=map[s.role]; });
  var o=st.once;
  if(o){
    delete o.FuchsRetired;
    delete o.UrwolfUsed;
    if(o.HexeL!==undefined&&o.WaldhexeL===undefined) o.WaldhexeL=o.HexeL;
    if(o.HexeD!==undefined&&o.WaldhexeD===undefined) o.WaldhexeD=o.HexeD;
    delete o.HexeL; delete o.HexeD;
    if(o.DerAlteFirstAttackUsed!==undefined&&o.DerWeiseFirstAttackUsed===undefined) o.DerWeiseFirstAttackUsed=o.DerAlteFirstAttackUsed;
    delete o.DerAlteFirstAttackUsed;
    if(o.Used&&typeof o.Used==="object"){
      Object.keys(map).forEach(function(old){
        var uk="role_"+String(old).replace(/\s+/g,"_");
        var nw=map[old];
        var nuk="role_"+String(nw).replace(/\s+/g,"_");
        if(o.Used[uk]&&!o.Used[nuk]) o.Used[nuk]=o.Used[uk];
        delete o.Used[uk];
      });
    }
    if(Array.isArray(o.BlockedRolesTonight)) o.BlockedRolesTonight=o.BlockedRolesTonight.map(function(r){ return map[r]||r; });
    if(typeof o.TeamWinner==="string"){
      var tw=o.TeamWinner;
      Object.keys(map).forEach(function(old){ tw=tw.split(old).join(map[old]); });
      o.TeamWinner=tw;
    }
  }
}

function migrateState(st){
  if(!st) return createState(12);
  st.seats = (st.seats||[]).map(ensureSeatDefaults);
  migrateLegacyRoleIds(st);
  st.once = Object.assign({
    LynchCount:0,WaldhexeL:false,WaldhexeD:false,KutscherUsed:false,OldDebuff:0,
    Used:{},ghost:{copiedRole:null,active:false},MaertyUsed:false,PestTotal:0,PestUsedTonight:false,
    ProphetTargets:null,ProphetUnlocked:false,VoodooCooldown:0,MogliVorbildId:null,LehrlingMentorId:null,
    BlockedRolesTonight:[],totenkarten:{},KartenschluckerStapel:0,KartenschluckerKilledTonight:false,
    KartenschluckerShield:false,KartenschluckerNightCount:0,TotenratFuehrerSilenced:[],TotenratFuehrerRevealed:false,
    TotenratFuehrerUsedDeflect:false,HadesLichter:0,HadesBarriere:false,HadesVoteBonus:false,HadesKilledTonight:false,HadesWon:false
  }, st.once||{});
  st.ui = Object.assign({judgeAsk:false,ghostCasting:false}, st.ui||{});
  st.pending = Object.assign({judgeAsk:false}, st.pending||{});
  return st;
}

function save(){
  try{
    ensureHunterQueue();
    if(state && state.seats){
      state.seats.forEach(function(s){
        try{
          s.flags = s.flags || {};
          s.meta = s.meta || {};
          if(s.flags.dead && !s.meta.deathProcessed){
            s.meta.deathProcessed = true;

            if(typeof window.__queueHunterOnDeath === "function") window.__queueHunterOnDeath(s);
          }
        }catch(e){}
      });
    }
  }catch(e){}
    try{
    const once = state && state.once ? state.once : null;
    if(once && Array.isArray(once.ProphetTargets)){
      const seats = state && state.seats ? state.seats : [];
      const deadCnt = once.ProphetTargets.filter(id => (seats.find(s=>s.id===id)||{}).flags?.dead).length;
      const prev = typeof once.ProphetDeadCount==="number" ? once.ProphetDeadCount : 0;
      if(deadCnt > prev){
        once.ProphetDeadCount = deadCnt;
        try{ if(typeof queueSfxKey==='function') queueSfxKey("sfxProphet1"); }catch(e){}
      }
      if(deadCnt === 3 && !once.ProphetUnlocked){
        once.ProphetUnlocked = true;
        try{ if(typeof queueSfxKey==='function') queueSfxKey("sfxProphet2"); }catch(e){}
        try{ rebuildOrder(); }catch(e){}
      }
    }
  }catch(e){}
  localStorage.setItem(LS_KEY, JSON.stringify(state));

  try{ prophetProgressCheck && prophetProgressCheck(); }catch(e){}
}

function load(){try{return JSON.parse(localStorage.getItem(LS_KEY))}catch(e){return null}}

// snapshot for undo
let lastSnapshot=null;
function snapshot(){ try{ lastSnapshot = JSON.stringify(state) }catch(e){ lastSnapshot=null } }
function undoOnce(){ if(!lastSnapshot) return; state = JSON.parse(lastSnapshot); save(); draw(); rebuildOrder() }

let deathHooks=[];
function pushDeathHook(fn){ deathHooks.push(fn) }
function runDeathHooks(){ for(const fn of deathHooks){ try{ fn() }catch(e){} } }
