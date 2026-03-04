/* global pdfjsLib */
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
