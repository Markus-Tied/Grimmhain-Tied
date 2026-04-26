const fs = require("fs");
const vm = require("vm");
const path = require("path");

const i18nPath = path.join(__dirname, "..", "js", "core", "i18n.js");
const code = fs.readFileSync(i18nPath, "utf8");

const ctx = {
  window: {},
  localStorage: { getItem: () => "de", setItem: () => {} },
  applyTranslations: () => {},
  draw: () => {},
  console,
};

vm.createContext(ctx);
vm.runInContext(code, ctx);

const I = ctx.window.I18N || {};
const de = new Set(Object.keys(I.de || {}));
const en = new Set(Object.keys(I.en || {}));

const missingInDe = [...en].filter((k) => !de.has(k)).sort();
const missingInEn = [...de].filter((k) => !en.has(k)).sort();

process.stdout.write(`missing_in_de ${missingInDe.length}\n`);
process.stdout.write(missingInDe.join("\n") + "\n");
process.stdout.write("---\n");
process.stdout.write(`missing_in_en ${missingInEn.length}\n`);
process.stdout.write(missingInEn.join("\n") + "\n");

