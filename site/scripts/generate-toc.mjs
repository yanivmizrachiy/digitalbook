import fs from "fs";
import path from "path";

const root = process.cwd();
const pdfRoot = path.join(root, "pdf");
const outDir = path.join(root, "site", "generated");
const outFile = path.join(outDir, "toc.json");
const pubPdfRoot = path.join(root, "site", "pdf");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(pubPdfRoot, { recursive: true });

// copy pdf tree into site/pdf (for Pages publish)
function copyDir(src, dst){
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dst, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })){
    const s = path.join(src, ent.name);
    const d = path.join(dst, ent.name);
    if (ent.isDirectory()) copyDir(s, d);
    else if (ent.isFile() && ent.name.toLowerCase().endsWith(".pdf")) fs.copyFileSync(s, d);
  }
}
copyDir(pdfRoot, pubPdfRoot);

function niceTitle(name){
  return (name || "").replace(/\.pdf$/i,"").replace(/[_-]+/g," ").replace(/\s+/g," ").trim() || name;
}
function folderTitle(seg){
  const map = {
    "elementary":"בית ספר יסודי","middle":"חטיבת ביניים","bagrut":"בגרות",
    "z":"כיתה ז","h":"כיתה ח","t":"כיתה ט",
    "algebra":"אלגברה","geometry":"גיאומטריה","exams":"מבחנים","works":"עבודות","summaries":"עבודות סיכום",
    "3u":"3 יחידות","4u":"4 יחידות","5u":"5 יחידות",
    "172":"שאלון 172","371":"שאלון 371","372":"שאלון 372",
    "471":"שאלון 471","472":"שאלון 472",
    "571":"שאלון 571","572":"שאלון 572"
  };
  return map[seg] || seg;
}
function readTree(absDir, relDir){
  const title = relDir ? folderTitle(path.basename(relDir)) : "בית";
  const node = { type:"folder", title, path: relDir || "", children: [] };
  if (!fs.existsSync(absDir)) return node;

  const entries = fs.readdirSync(absDir, { withFileTypes: true })
    .filter(e => !e.name.startsWith("."))
    .sort((a,b)=>a.name.localeCompare(b.name,"he"));

  for (const e of entries){
    const abs = path.join(absDir, e.name);
    const rel = relDir ? path.join(relDir, e.name) : e.name;
    if (e.isDirectory()) node.children.push(readTree(abs, rel));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".pdf")){
      const pubUrl = "./pdf/" + encodeURIComponent(rel).replace(/%2F/g,"/");
      node.children.push({ type:"pdf", title: niceTitle(e.name), filename: e.name, path: rel.replace(/\\/g,"/"), url: pubUrl });
    }
  }
  node.children = node.children.filter(ch => ch.type==="pdf" || (ch.children && ch.children.length));
  return node;
}

const toc = readTree(pdfRoot, "");
toc.generatedAt = new Date().toISOString();
fs.writeFileSync(outFile, JSON.stringify(toc, null, 2), "utf8");
console.log("TOC generated:", toc.generatedAt);
