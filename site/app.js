/* global pdfjsLib */
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js";

const els = {
  sidebar: document.getElementById("sidebar"),
  tree: document.getElementById("tree"),
  search: document.getElementById("search"),
  pathbar: document.getElementById("pathbar"),
  internalToc: document.getElementById("internalToc"),
  internalTocEmpty: document.getElementById("internalTocEmpty"),
  chapterSearch: document.getElementById("chapterSearch"),
  btnChapterSearch: document.getElementById("btnChapterSearch"),
  chapterSearchResults: document.getElementById("chapterSearchResults"),
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
  btnNext: document.getElementById("btnNext")
};

let TOC = null;
let stack = [];
let flat = [];
let currentIdx = -1;

let pdfDoc = null;
let pageNum = 1;
let rendering = false;
let internalTocFlat = [];
let activeChapterSearchToken = 0;

function isLeaf(n){ return n && n.type === "pdf"; }
function walk(n, cb){
  cb(n);
  (n.children || []).forEach(ch => walk(ch, cb));
}

function findFolderByPath(node, want){
  if (!node) return null;
  if (node.type === "folder" && (node.path||"") === (want||"")) return node;
  const kids = node.children || [];
  for (const k of kids){
    const r = findFolderByPath(k, want);
    if (r) return r;
  }
  return null;
}

function goToRootFolder(key){
  if (!TOC) return;
  const folder = findFolderByPath(TOC, key);
  if (folder){
    stack = [TOC, folder];
    els.search.value = "";
    renderTree(folder);
    renderCardsFromFolder(folder);
    toggleToc(true);
  } else {
    // folder not present in toc tree (no PDFs yet)
    stack = [TOC];
    renderTree(TOC);
  renderCardsFromFolder(TOC);
    renderCardsFromFolder(TOC);

  // Home cards
  const homeGrid = document.getElementById("homeGrid");
  if (homeGrid){
    homeGrid.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("button[data-go]") : null;
      if (!btn) return;
      const key = btn.getAttribute("data-go");
      if (key === "elementary") goToRootFolder("elementary");
      if (key === "middle") goToRootFolder("middle");
      if (key === "bagrut") goToRootFolder("bagrut");
    });
  }
  showHome();

    toggleToc(true);
  }
}

function showHome(){
  const home = document.getElementById("home");
  if (home) home.style.display = "block";
}

function getChildFolder(node, childPath){
  const kids = (node && node.children) ? node.children : [];
  for (const k of kids){
    if (k.type==="folder" && (k.path||"") === childPath) return k;
  }
  return null;
}

function renderCardsFromFolder(node){
  // Renders big cards for immediate child folders, and leaves PDFs to the list view
  const home = document.getElementById("home");
  const grid = document.getElementById("homeGrid");
  const title = home ? home.querySelector(".homeTitle") : null;
  const hint = home ? home.querySelector(".homeHint") : null;
  if (!home || !grid || !node) return;

  const kids = (node.children || []).filter(x => x.type === "folder");
  if (!kids.length){
    // no subfolders -> hide home and show list
    hideHome();
    return;
  }

  // show home cards
  showHome();
  if (title) title.textContent = node.title ? ("בחר בתוך: " + node.title) : "בחר";
  if (hint) hint.textContent = "בחר קטגוריה. פרקים יופיעו אחרי שתוסיף PDFs לתיקיה המתאימה.";

  grid.innerHTML = "";
  for (const k of kids){
    const b = document.createElement("button");
    b.className = "cardBtn";
    b.textContent = (k.title || "תיקיה");
    b.addEventListener("click", () => {
      stack.push(k);
      els.search.value = "";
      renderTree(k);
      // try render next level as cards too
      renderCardsFromFolder(k);
      toggleToc(true);
    });
    grid.appendChild(b);
  }
}

function hideHome(){
  const home = document.getElementById("home");
  if (home) home.style.display = "none";
}

function rebuildFlat(){
  flat = [];
  if (!TOC) return;
  walk(TOC, (n) => { if (isLeaf(n)) flat.push(n); });
}
function setPathbar(){
  const parts = stack.map(n => n.title).filter(Boolean);
  els.pathbar.textContent = parts.length ? parts.join(" › ") : "בית";
}
function renderTree(node){
  setPathbar();
  const q = (els.search.value || "").trim().toLowerCase();
  els.tree.innerHTML = "";

  const kids = (node.children || []).slice();
  const visible = kids.filter(ch => !q || (ch.title || "").toLowerCase().includes(q));

  if (!visible.length){
    const li = document.createElement("li");
    li.textContent = "אין תוצאות.";
    li.style.color = "#64748b";
    li.style.padding = "8px 12px";
    els.tree.appendChild(li);
    return;
  }

  for (const ch of visible){
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

function updateHash(pth, pg){
  const p = encodeURIComponent(pth || "");
  location.hash = "#/read?path=" + p + "&page=" + (pg || 1);
}
function parseHash(){
  const h = location.hash || "";
  if (!h.startsWith("#/read")) return null;
  const q = (h.split("?")[1] || "");
  const params = new URLSearchParams(q);
  const pth = decodeURIComponent(params.get("path") || "");
  const pg = parseInt(params.get("page") || "1", 10);
  return { path: pth, page: Number.isFinite(pg) && pg > 0 ? pg : 1 };
}

function clearChapterPanels(){
  activeChapterSearchToken++;
  internalTocFlat = [];
  els.internalToc.innerHTML = "";
  els.internalTocEmpty.textContent = "בחר פרק כדי לראות תוכן עניינים פנימי.";
  els.internalTocEmpty.style.display = "block";
  els.chapterSearchResults.textContent = "";
}

async function loadPdf(url){
  try{
    const task = pdfjsLib.getDocument({ url, useSystemFonts: true, isEvalSupported: false });
    pdfDoc = await task.promise;
    await buildInternalToc();
  }catch(e){
    pdfDoc = null;
    clearChapterPanels();
    els.pageInfo.textContent = "שגיאה בטעינת PDF";
    console.error(e);
  }
}

async function buildInternalToc(){
  els.internalToc.innerHTML = "";
  internalTocFlat = [];

  if (!pdfDoc){
    els.internalTocEmpty.textContent = "בחר פרק כדי לראות תוכן עניינים פנימי.";
    els.internalTocEmpty.style.display = "block";
    return;
  }

  els.internalTocEmpty.textContent = "טוען תוכן עניינים פנימי…";
  els.internalTocEmpty.style.display = "block";

  let outline;
  try{
    outline = await pdfDoc.getOutline();
  }catch{
    outline = null;
  }

  if (!outline || !outline.length){
    els.internalTocEmpty.textContent = "אין תוכן עניינים פנימי לפרק זה.";
    els.internalTocEmpty.style.display = "block";
    return;
  }

  async function resolveItem(item, level){
    const title = ((item && item.title) ? String(item.title) : "").trim() || "(ללא כותרת)";
    let pageNumber = null;

    try{
      const dest = item ? item.dest : null;
      if (dest){
        const explicitDest = Array.isArray(dest) ? dest : await pdfDoc.getDestination(dest);
        if (explicitDest && explicitDest[0]){
          const pageIndex = await pdfDoc.getPageIndex(explicitDest[0]);
          pageNumber = pageIndex + 1;
        }
      }
    }catch{
      pageNumber = null;
    }

    internalTocFlat.push({ title, level, pageNumber });

    const children = (item && item.items) ? item.items : [];
    for (const c of children){
      await resolveItem(c, level + 1);
    }
  }

  for (const it of outline){
    await resolveItem(it, 0);
  }

  renderInternalToc();
}

function renderInternalToc(){
  els.internalToc.innerHTML = "";

  if (!internalTocFlat.length){
    els.internalTocEmpty.textContent = "אין תוכן עניינים פנימי לפרק זה.";
    els.internalTocEmpty.style.display = "block";
    return;
  }

  els.internalTocEmpty.style.display = "none";

  for (const item of internalTocFlat){
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "node node--compact";
    btn.type = "button";

    const left = document.createElement("div");
    left.textContent = `${"\u00A0".repeat(Math.min(12, (item.level || 0) * 4))}${item.title}`;

    const right = document.createElement("div");
    right.className = "meta";
    right.textContent = item.pageNumber ? ("עמוד " + item.pageNumber) : "—";

    btn.appendChild(left);
    btn.appendChild(right);

    if (!item.pageNumber){
      btn.disabled = true;
    } else {
      btn.addEventListener("click", async () => {
        pageNum = item.pageNumber;
        await renderPage();
        const cur = flat[currentIdx];
        if (cur) updateHash(cur.path, pageNum);
      });
    }

    li.appendChild(btn);
    els.internalToc.appendChild(li);
  }
}

async function searchCurrentChapter(query){
  const q = (query || "").trim();
  if (!q){
    els.chapterSearchResults.textContent = "";
    return;
  }
  if (!pdfDoc){
    els.chapterSearchResults.textContent = "בחר פרק כדי לחפש בתוך התוכן.";
    return;
  }

  const token = ++activeChapterSearchToken;
  els.chapterSearchResults.textContent = "מחפש…";

  const needle = q.toLowerCase();
  const results = [];
  let hasExtractableText = false;
  const scanDetectionPages = Math.min(3, pdfDoc.numPages || 1);
  const limitResults = 50;

  for (let p = 1; p <= (pdfDoc.numPages || 0); p++){
    if (token !== activeChapterSearchToken) return;

    let text = "";
    try{
      const page = await pdfDoc.getPage(p);
      const content = await page.getTextContent();
      const raw = (content.items || []).map(i => i.str).join(" ");
      if (raw.trim()) hasExtractableText = true;
      text = raw.toLowerCase();
    }catch{
      text = "";
    }

    if (text && text.includes(needle)){
      results.push(p);
      if (results.length >= limitResults) break;
    }

    if (p === scanDetectionPages && !hasExtractableText && results.length === 0){
      els.chapterSearchResults.textContent = "נראה שהפרק סרוק/ללא טקסט — חיפוש בתוך התוכן אינו זמין.";
      return;
    }
  }

  if (token !== activeChapterSearchToken) return;

  if (!results.length){
    els.chapterSearchResults.textContent = "לא נמצאו תוצאות בפרק זה.";
    return;
  }

  els.chapterSearchResults.innerHTML = "";
  for (const p of results){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "node node--compact";
    btn.textContent = "מעבר לעמוד " + p;
    btn.addEventListener("click", async () => {
      pageNum = p;
      await renderPage();
      const cur = flat[currentIdx];
      if (cur) updateHash(cur.path, pageNum);
    });
    els.chapterSearchResults.appendChild(btn);
  }
}

async function renderPage(){
  if (!pdfDoc || rendering) return;
  rendering = true;
  try{
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const ctx = els.canvas.getContext("2d");
    els.canvas.width = viewport.width;
    els.canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
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
function nextChapter(){
  if (currentIdx >= 0 && currentIdx + 1 < flat.length) openChapter(flat[currentIdx + 1]);
}
function prevChapter(){
  if (currentIdx > 0) openChapter(flat[currentIdx - 1]);
}

async function openChapter(ch, options = {}){
  hideHome();
  currentIdx = flat.findIndex(x => x.path === ch.path);
  els.chapterTitle.textContent = ch.title || "";
  const targetPage = Number.isFinite(options.page) ? options.page : 1;
  pageNum = Math.max(1, Math.floor(targetPage));
  clearChapterPanels();
  await loadPdf(ch.url);
  if (pdfDoc){
    pageNum = Math.min(pageNum, pdfDoc.numPages || 1);
  }
  await renderPage();

  const shouldUpdateUrl = options.updateUrl !== false;
  if (shouldUpdateUrl) updateHash(ch.path, pageNum);
}

function home(){
  stack = [TOC];
  els.search.value = "";
  renderTree(TOC);
}
function back(){
  if (stack.length > 1){
    stack.pop();
    els.search.value = "";
    renderTree(stack[stack.length - 1]);
    renderCardsFromFolder(stack[stack.length - 1]);
  } else home();
}
function toggleToc(show){
  els.sidebar.classList.toggle("hidden", !show);
}

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
      await openChapter(found, { page: route.page || 1, updateUrl: false });
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
    if (!flat[currentIdx] || flat[currentIdx].path !== found.path){
      await openChapter(found, { page: route.page || 1, updateUrl: false });
      return;
    }

    pageNum = route.page || 1;
    if (pdfDoc){
      pageNum = Math.min(Math.max(1, pageNum), pdfDoc.numPages || 1);
    }
    await renderPage();
  }
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  els.installHint.textContent = "אפשר להתקין כאפליקציה: בתפריט הדפדפן › התקנה.";
});

els.btnChapterSearch.addEventListener("click", () => {
  searchCurrentChapter(els.chapterSearch.value);
});

els.chapterSearch.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  els.btnChapterSearch.click();
});

if ("serviceWorker" in navigator){
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

loadToc().catch(err => {
  console.error(err);
  els.pageInfo.textContent = "שגיאה בטעינת תוכן העניינים";
});
