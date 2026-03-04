from pathlib import Path

Path("site").mkdir(parents=True, exist_ok=True)
Path("site/scripts").mkdir(parents=True, exist_ok=True)

index_html = """<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>ספר דיגיטלי</title>
  <meta name="theme-color" content="#0c3482" />
  <link rel="stylesheet" href="./styles.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.js"></script>
</head>
<body>
  <header class="topbar">
    <div class="brand">📘 ספר דיגיטלי</div>
    <div class="actions">
      <button id="btnHome" class="btn">בית</button>
      <button id="btnBack" class="btn">חזרה</button>
      <button id="btnToc" class="btn">תוכן עניינים</button>
      <button id="btnPrevChapter" class="btn">פרק קודם</button>
      <button id="btnNextChapter" class="btn">פרק הבא</button>
      <button id="btnPrev" class="btn">עמוד קודם</button>
      <button id="btnNext" class="btn">עמוד הבא</button>
    </div>
  </header>

  <main class="layout">
    <aside id="sidebar" class="sidebar" aria-label="תוכן עניינים">
      <div class="sidebarHead">
        <div class="sidebarTitle">תוכן עניינים</div>
        <button id="btnCloseToc" class="btn small">סגור</button>
      </div>
      <div class="searchBox">
        <input id="search" type="search" placeholder="חיפוש לפי שם פרק…" />
      </div>
      <div id="pathbar" class="pathbar">בית</div>
      <ul id="tree" class="toc"></ul>
      <div class="hint">מוסיפים PDF רק לתיקייה <code>pdf/</code> לפי RULES.md ואז commit+push.</div>
    </aside>

    <section class="viewer">
      <div class="meta">
        <div id="chapterTitle" class="chapterTitle">בחר פרק מתוכן העניינים</div>
        <div id="pageInfo" class="pageInfo">—</div>
      </div>
      <div class="canvasWrap">
        <canvas id="pdfCanvas"></canvas>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div>עברית RTL בלבד</div>
    <div id="installHint"></div>
  </footer>

  <script src="./app.js"></script>
</body>
</html>
"""

styles_css = """*{box-sizing:border-box}
:root{--blue:#0c3482;--bg:#f6f7fb;--card:#fff;--muted:#64748b;--border:#e5e7eb}
html,body{height:100%}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Arial;background:var(--bg);color:#0f172a}
.topbar{position:sticky;top:0;z-index:10;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--blue);color:#fff}
.brand{font-weight:900}
.actions{display:flex;flex-wrap:wrap;gap:8px}
.btn{border:0;border-radius:12px;padding:8px 10px;background:rgba(255,255,255,.14);color:#fff;font-weight:800}
.btn:hover{background:rgba(255,255,255,.22)}
.btn.small{padding:6px 10px;border-radius:10px}
.layout{display:grid;grid-template-columns:340px 1fr;min-height:calc(100vh - 56px)}
.sidebar{background:var(--card);border-left:1px solid var(--border);padding:12px;overflow:auto}
.sidebar.hidden{display:none}
.sidebarHead{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.sidebarTitle{font-weight:900}
.searchBox input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:12px;outline:none}
.pathbar{margin:10px 0;color:var(--muted);font-size:13px}
.toc{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.node{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:14px;background:#fff;text-align:right}
.node .meta{color:var(--muted);font-size:12px}
.viewer{padding:14px;display:flex;flex-direction:column;gap:10px}
.meta{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.chapterTitle{font-size:18px;font-weight:900}
.pageInfo{color:var(--muted)}
.canvasWrap{background:#fff;border:1px solid var(--border);border-radius:18px;padding:10px;overflow:auto}
canvas{max-width:100%;height:auto}
.hint{margin-top:10px;color:var(--muted);font-size:12px}
.footer{padding:10px 14px;color:var(--muted);font-size:12px;text-align:center}
@media (max-width: 900px){
  .layout{grid-template-columns:1fr}
  .sidebar{position:fixed;inset:56px 0 0 0;z-index:20}
}
"""

# בלי `${}` בכלל
app_js = """/* global pdfjsLib */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js";

const els = {
  sidebar: document.getElementById("sidebar"),
  tree: document.getElementById("tree"),
  search: document.getElementById("search"),
  pathbar: document.getElementById("pathbar"),
  chapterTitle: document.getElementById("chapterTitle"),
  pageInfo: document.getElementById("pageInfo"),
  canvas: document.getElementById("pdfCanvas"),
  installHint: document.getElementById("installHint"),
  btnHome: document.getElementById("btnHome"),
  btnBack: document.getElementById("btnBack"),
  btnToc: document.getElementById("btnToc"),
  btnCloseToc: document.getElementById("btnCloseToc"),
  btnPrevChapter: document.getElementById("btnPrevChapter"),
  btnNextChapter: document.getElementById("btnNextChapter"),
  btnPrev: document.getElementById("btnPrev"),
  btnNext: document.getElementById("btnNext"),
};

let TOC = null;
let stack = [];
let flat = [];
let currentIdx = -1;

let pdfDoc = null;
let pageNum = 1;
let rendering = false;

function isPdf(n){ return n && n.type === "pdf"; }
function walk(n, cb){ cb(n); (n.children || []).forEach(ch => walk(ch, cb)); }

function rebuildFlat(){
  flat = [];
  if (!TOC) return;
  walk(TOC, (n)=>{ if (isPdf(n)) flat.push(n); });
}

function setPathbar(){
  const parts = stack.map(n => n.title).filter(Boolean);
  els.pathbar.textContent = parts.length ? parts.join(" › ") : "בית";
}

function renderTree(node){
  setPathbar();
  const q = (els.search.value || "").trim().toLowerCase();
  els.tree.innerHTML = "";
  const items = (node.children || []).filter(ch => !q || (ch.title||"").toLowerCase().includes(q));

  if (!items.length){
    const li = document.createElement("li");
    li.textContent = "אין תוצאות.";
    li.style.color = "#64748b";
    li.style.padding = "8px 12px";
    els.tree.appendChild(li);
    return;
  }

  for (const ch of items){
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "node";

    const left = document.createElement("div");
    left.textContent = ch.title || "";

    const right = document.createElement("div");
    right.className = "meta";
    right.textContent = ch.type === "folder" ? "תיקייה" : "PDF";

    btn.appendChild(left);
    btn.appendChild(right);

    btn.addEventListener("click", () => {
      if (ch.type === "folder"){
        stack.push(ch);
        els.search.value = "";
        renderTree(ch);
        return;
      }
      openChapter(ch);
    });

    li.appendChild(btn);
    els.tree.appendChild(li);
  }
}

function updateHash(path, page){
  const p = encodeURIComponent(path || "");
  location.hash = "#/read?path=" + p + "&page=" + (page || 1);
}

function parseHash(){
  const h = location.hash || "";
  if (!h.startsWith("#/read")) return null;
  const q = h.split("?")[1] || "";
  const params = new URLSearchParams(q);
  const path = decodeURIComponent(params.get("path") || "");
  const page = parseInt(params.get("page") || "1", 10);
  return { path, page: Number.isFinite(page) && page > 0 ? page : 1 };
}

async function loadPdf(url){
  try{
    const task = pdfjsLib.getDocument({ url });
    pdfDoc = await task.promise;
    await renderPage();
  } catch(e){
    pdfDoc = null;
    els.pageInfo.textContent = "שגיאה בטעינת PDF";
    console.error(e);
  }
}

async function renderPage(){
  if (!pdfDoc || rendering) return;
  rendering = true;
  try{
    const p = await pdfDoc.getPage(pageNum);
    const viewport = p.getViewport({ scale: 1.5 });
    const ctx = els.canvas.getContext("2d");
    els.canvas.width = viewport.width;
    els.canvas.height = viewport.height;
    await p.render({ canvasContext: ctx, viewport: viewport }).promise;
    els.pageInfo.textContent = "עמוד " + pageNum + " מתוך " + pdfDoc.numPages;
  } finally {
    rendering = false;
  }
}

function nextPage(){
  if (!pdfDoc) return;
  if (pageNum < pdfDoc.numPages){
    pageNum++;
    renderPage();
    const cur = flat[currentIdx];
    if (cur) updateHash(cur.path, pageNum);
  }
}
function prevPage(){
  if (!pdfDoc) return;
  if (pageNum > 1){
    pageNum--;
    renderPage();
    const cur = flat[currentIdx];
    if (cur) updateHash(cur.path, pageNum);
  }
}
function nextChapter(){ if (currentIdx >= 0 && currentIdx + 1 < flat.length) openChapter(flat[currentIdx + 1]); }
function prevChapter(){ if (currentIdx > 0) openChapter(flat[currentIdx - 1]); }

async function openChapter(ch){
  currentIdx = flat.findIndex(x => x.path === ch.path);
  els.chapterTitle.textContent = ch.title || "";
  pageNum = 1;
  await loadPdf(ch.url);
  updateHash(ch.path, pageNum);
}

function home(){ stack = [TOC]; els.search.value = ""; renderTree(TOC); }
function back(){
  if (stack.length > 1){
    stack.pop();
    els.search.value = "";
    renderTree(stack[stack.length - 1]);
  } else home();
}
function toggleToc(show){ els.sidebar.classList.toggle("hidden", !show); }

async function loadToc(){
  const res = await fetch("./generated/toc.json", { cache: "no-store" });
  TOC = await res.json();
  stack = [TOC];
  rebuildFlat();
  renderTree(TOC);

  const route = parseHash();
  if (route && route.path){
    const found = flat.find(n => n.path === route.path);
    if (found){
      await openChapter(found);
      pageNum = route.page || 1;
      await renderPage();
    }
  }
}

els.search.addEventListener("input", () => renderTree(stack[stack.length - 1]));
els.btnHome.addEventListener("click", () => { toggleToc(true); home(); });
els.btnBack.addEventListener("click", () => back());
els.btnToc.addEventListener("click", () => toggleToc(els.sidebar.classList.contains("hidden")));
els.btnCloseToc.addEventListener("click", () => toggleToc(false));
els.btnNext.addEventListener("click", () => nextPage());
els.btnPrev.addEventListener("click", () => prevPage());
els.btnNextChapter.addEventListener("click", () => nextChapter());
els.btnPrevChapter.addEventListener("click", () => prevChapter());

window.addEventListener("hashchange", async () => {
  const route = parseHash();
  if (!route) return;
  const found = flat.find(n => n.path === route.path);
  if (found){
    if (flat[currentIdx] && flat[currentIdx].path !== found.path) await openChapter(found);
    pageNum = route.page || 1;
    await renderPage();
  }
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  els.installHint.textContent = "אפשר להתקין כאפליקציה: בתפריט הדפדפן › התקנה.";
});

loadToc().catch(err => {
  console.error(err);
  els.pageInfo.textContent = "שגיאה בטעינת תוכן העניינים";
});
"""

gen_mjs = """import fs from "fs";
import path from "path";

const root = process.cwd();
const pdfRoot = path.join(root, "pdf");
const outDir = path.join(root, "site", "generated");
const outFile = path.join(outDir, "toc.json");

fs.mkdirSync(outDir, { recursive: true });

function niceTitle(name){
  return (name || "").replace(/\\.pdf$/i,"").replace(/[_-]+/g," ").replace(/\\s+/g," ").trim() || name;
}

function folderTitle(seg){
  const map = {
    "elementary":"בית ספר יסודי",
    "middle":"חטיבת ביניים",
    "bagrut":"בגרות",
    "z":"כיתה ז",
    "h":"כיתה ח",
    "t":"כיתה ט",
    "algebra":"אלגברה",
    "geometry":"גיאומטריה",
    "exams":"מבחנים",
    "works":"עבודות",
    "summaries":"עבודות סיכום",
    "3u":"3 יחידות",
    "4u":"4 יחידות",
    "5u":"5 יחידות",
    "172":"שאלון 172",
    "371":"שאלון 371",
    "372":"שאלון 372",
    "471":"שאלון 471",
    "472":"שאלון 472",
    "571":"שאלון 571",
    "572":"שאלון 572"
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

    if (e.isDirectory()){
      node.children.push(readTree(abs, rel));
    } else if (e.isFile() && e.name.toLowerCase().endsWith(".pdf")){
      const pubUrl = "../pdf/" + encodeURIComponent(rel).replace(/%2F/g,"/");
      node.children.push({
        type:"pdf",
        title: niceTitle(e.name),
        filename: e.name,
        path: rel.replace(/\\\\/g,"/"),
        url: pubUrl
      });
    }
  }

  node.children = node.children.filter(ch => ch.type==="pdf" || (ch.children && ch.children.length));
  return node;
}

const toc = readTree(pdfRoot, "");
toc.generatedAt = new Date().toISOString();
fs.writeFileSync(outFile, JSON.stringify(toc, null, 2), "utf8");
console.log("TOC generated:", outFile);
"""

Path("site/index.html").write_text(index_html, encoding="utf-8")
Path("site/styles.css").write_text(styles_css, encoding="utf-8")
Path("site/app.js").write_text(app_js, encoding="utf-8")
Path("site/scripts/generate-toc.mjs").write_text(gen_mjs, encoding="utf-8")

print("OK: site rebuilt cleanly (NO ${} anywhere)")
