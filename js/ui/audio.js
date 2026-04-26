// --- Audio & SFX ---
var SOUNDS_BASE = "assets/sounds/";
var SOUNDS_FILENAMES = {
  "sfxBear": "Alarm.mp3",
  "sfxJudge": "Richter.mp3",
  "sfxWahnsinniger": "WahnsinnigKutscher.mp3",
  "sfxRitter": "Ritter.mp3",
  "sfxSuicide": "Selbstmörder.mp3",
  "sfxMirror": "Spiegel.mp3",
  "sfxProphet1": "Prophet 1.mp3",
  "sfxProphet2": "Prophet 2.mp3",
  "sfxLovers": "Loki.mp3"
};
let nightAudio = new Audio();
nightAudio.loop = true;
nightAudio.preload = "auto";
let alarmAudio = new Audio();
let sfxQueue = [], sfxPlaying = false;

function queueSfxURL(u) {
  if (!u) return;
  if (!window._sfxQ) window._sfxQ = [];
  window._sfxQ.push(u);
  setTimeout(() => playNextSfx(), 0);
}

function playNextSfx() {
  if (!window._sfxQ) window._sfxQ = [];
  if (window._sfxPlaying) return;
  const next = window._sfxQ.shift();
  if (!next) {
    window._sfxPlaying = false;
    return;
  }
  window._sfxPlaying = true;
  const a = new Audio(next);
  a.volume = (typeof state !== "undefined" && state.audioVol != null) ? state.audioVol : 1;
  const done = () => {
    try {
      a.removeEventListener("ended", done);
      a.removeEventListener("error", done);
    } catch (e) {}
    window._sfxPlaying = false;
    playNextSfx();
  };
  a.addEventListener("ended", done);
  a.addEventListener("error", done);
  a.play().catch(done);
}

function queueSfxKey(key) {
  if (!key) return;
  var custom = (typeof state !== "undefined" && state.files && state.files[key]) ? state.files[key] : null;
  var filename = custom || (SOUNDS_FILENAMES[key] || (key + ".mp3"));
  var u = custom ? filename : (SOUNDS_BASE + filename);
  queueSfxURL(u);
}

// --- Timer ---
let timerInterval = null;
let remainingSeconds = 0;

function parseTime(str) {
  const parts = str.split(":").map(p => parseInt(p, 10) || 0);
  return parts[0] * 60 + (parts[1] || 0);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

function startTimer() {
  const input = document.getElementById("timerIn");
  if (!input) return;
  if (!remainingSeconds) remainingSeconds = parseTime(input.value || "00:00");
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 0;
      input.value = "00:00";
      try {
        var timerSound = (typeof state !== "undefined" && state.files && state.files.alarm) ? state.files.alarm : (SOUNDS_BASE + "Ruhe.mp3");
        var a = new Audio(timerSound);
        a.volume = (typeof state !== "undefined" && state.audioVol != null) ? state.audioVol : 1;
        a.play().catch(function(){});
      } catch (e) {}
    } else {
      input.value = formatTime(remainingSeconds);
    }
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  const input = document.getElementById("timerIn");
  if (input) {
    input.value = "00:00";
  }
  remainingSeconds = 0;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
