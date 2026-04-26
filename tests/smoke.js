/**
 * Minimale Smoke-Checks ohne Browser-DOM.
 * Liest relevante Dateien und prüft erwartete Invarianten.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

let failed = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  }
}

const core = read("js/ui/core.js");
ok(core.includes("function escapeHtml"), "core.js: escapeHtml vorhanden");
ok(!core.includes("function isImmuneToKill"), "core.js: isImmuneToKill entfernt");
ok(core.includes("wolfPower >= villagers.length) triggerWin"), "core.js: Wolf-Sieg ohne tautologisches villagers >= 0");

const state = read("js/core/state.js");
ok(state.includes("st.seats=st.seats.map(ensureSeatDefaults)"), "state.js: createState nutzt ensureSeatDefaults");

const roles = read("js/core/roles.js");
ok(roles.includes("new WeakSet"), "roles.js: Tooltip WeakSet");

const i18n = read("js/core/i18n.js");
ok(i18n.includes("beforeunload"), "i18n.js: Observer-Cleanup");

const gameHtml = read("game.html");
ok(gameHtml.includes("abilities-helpers.js"), "game.html: lädt abilities-helpers.js");
ok(gameHtml.includes("abilities-roles-chunk.js"), "game.html: lädt abilities-roles-chunk.js");

if (failed) {
  process.exit(1);
}
console.log("smoke: OK (" + path.basename(__filename) + ")");
