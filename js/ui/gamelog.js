// Spielprotokoll nur mit Recap-relevanten Einträgen (kein Spam, Recap später einfacher)
;(function(){
  function safeStateNight(){
    try{
      return (typeof state!=="undefined" && state && typeof state.nightCount==="number")
        ? state.nightCount
        : null;
    }catch(e){ return null; }
  }
  function safeStateDark(){
    try{
      return !!(typeof state!=="undefined" && state && state.dark);
    }catch(e){ return false; }
  }

  /** Nur Einträge die für ein Recap sinnvoll sind – Rest wird ignoriert (kein Spam). */
  function shouldLogRecap(icon, text){
    const i = String(icon || "");
    if (i === "🌙" || i === "☀️" || i === "⚖" || i === "☠" || i === "💀" || i === "💚") return true;
    const s = String(text || "").toLowerCase();
    if (s.indexOf("nacht") >= 0 && s.indexOf("beginnt") >= 0) return true;
    if (s.indexOf("tag beginnt") >= 0 || s.indexOf("day begins") >= 0) return true;
    if (s.indexOf("lynch") >= 0 || s.indexOf("gehängt") >= 0 || s.indexOf("lynched") >= 0) return true;
    if (s.indexOf("gestorben") >= 0 || s.indexOf("getötet") >= 0 || s.indexOf("gelyncht") >= 0 || s.indexOf("vergiftet") >= 0 || s.indexOf("erschossen") >= 0 || s.indexOf("verbrannt") >= 0 || s.indexOf("opferte") >= 0 || s.indexOf("mitgerissen") >= 0 || s.indexOf("starb") >= 0) return true;
    if (s.indexOf("died") >= 0 || s.indexOf("killed") >= 0 || s.indexOf("dead") >= 0) return true;
    if (i === "💀" && (s.indexOf("hexe") >= 0 || s.indexOf("waldhexe") >= 0) && s.indexOf("todestrank") >= 0) return true;
    if (i === "💚" && (s.indexOf("hexe") >= 0 || s.indexOf("waldhexe") >= 0) && s.indexOf("lebenstrank") >= 0) return true;
    return false;
  }

  function formatEntry(e){
    try{
      const d=new Date(e.t);
      const pad=n=>String(n).padStart(2,"0");
      const time=`${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const phase=e.dark?(window.t ? window.t("night") : "Nacht"):(window.t ? window.t("day") : "Tag");
      const night=typeof e.night==="number"?e.night:"-";
      const icon=e.icon?e.icon+" ":"";
      return `[${time}] [${phase} ${night}] ${icon}${e.text}`;
    }catch(_){ return e.text||""; }
  }

  const gameLog={
    entries:[],
    add(icon,text,color=""){
      try{
        if(!shouldLogRecap(icon, text)) return;
        const entry={
          t:Date.now(),
          icon,
          text:String(text||""),
          color:String(color||""),
          night:safeStateNight(),
          dark:safeStateDark()
        };
        this.entries.push(entry);
        if(this.entries.length>500) this.entries.shift();
        this.render();
      }catch(e){}
    },
    render(){
      try{
        const panel=document.getElementById("gameLogPanel");
        const body=document.getElementById("gameLogBody");
        if(!panel||!body) return;
        body.innerHTML="";
        const slice=this.entries.slice(-80);
        slice.forEach(e=>{
          const row=document.createElement("div");
          row.className="game-log-entry";
          if(e.color) row.style.color=e.color;
          const iconSpan=document.createElement("span");
          iconSpan.className="game-log-icon";
          iconSpan.textContent=e.icon||"";
          const textSpan=document.createElement("span");
          textSpan.className="game-log-text";
          textSpan.textContent=e.text;
          row.append(iconSpan,textSpan);
          body.appendChild(row);
        });
        const countEl=document.getElementById("gameLogCount");
        if(countEl) countEl.textContent=String(this.entries.length);
      }catch(e){}
    },
    copyAll(){
      try{
        const lines=this.entries.map(formatEntry);
        const txt=lines.join("\n");
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(txt).catch(()=>{});
        }else{
          const ta=document.createElement("textarea");
          ta.value=txt;
          ta.style.position="fixed";
          ta.style.opacity="0";
          document.body.appendChild(ta);
          ta.select();
          try{ document.execCommand("copy"); }catch(e){}
          document.body.removeChild(ta);
        }
      }catch(e){}
    },
    initDOM(){
      try{
        const panel=document.getElementById("gameLogPanel");
        const toggle=document.getElementById("gameLogToggle");
        const copy=document.getElementById("gameLogCopy");
        if(toggle && panel){
          toggle.addEventListener("click",()=>{
            panel.classList.toggle("game-log-collapsed");
          });
        }
        if(copy){
          copy.addEventListener("click",()=>this.copyAll());
        }
        this.render();
      }catch(e){}
    }
  };

  window.gameLog=gameLog;

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",()=>gameLog.initDOM());
  }else{
    gameLog.initDOM();
  }
})();

