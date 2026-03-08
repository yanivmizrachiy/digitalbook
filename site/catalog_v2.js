(async function(){
  const ROOT_ID = "db-smart-catalog-v2";
  const STORAGE = {
    favs: "digitalbook:favs",
    recent: "digitalbook:recent"
  };

  function t(v){ return String(v ?? ""); }
  function esc(s){
    return t(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  }
  function norm(s){ return t(s).toLowerCase().trim(); }

  function readJSON(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }
  function writeJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getFavs(){ return readJSON(STORAGE.favs, []); }
  function setFavs(v){ writeJSON(STORAGE.favs, v); }

  function getRecent(){ return readJSON(STORAGE.recent, []); }
  function pushRecent(url){
    const arr = getRecent().filter(x => x !== url);
    arr.unshift(url);
    writeJSON(STORAGE.recent, arr.slice(0, 8));
  }

  function isFav(url){ return getFavs().includes(url); }
  function toggleFav(url){
    const arr = getFavs();
    const i = arr.indexOf(url);
    if (i >= 0) arr.splice(i,1); else arr.push(url);
    setFavs(arr);
  }

  function guessTitle(url){
    return t(url).split("/").pop().replace(/\.pdf$/i,"").replaceAll("_"," ");
  }

  function flatten(data){
    const out = [];
    const seen = new Set();

    function walk(x, ctx = {}){
      if (Array.isArray(x)) return x.forEach(v => walk(v, ctx));
      if (!x || typeof x !== "object") return;

      const nextCtx = {...ctx};
      for (const [k,v] of Object.entries(x)) {
        if (typeof v === "string" && !["url","title","thumb","thumbnail"].includes(k) && !nextCtx[k]) {
          nextCtx[k] = v;
        }
      }

      if (typeof x.url === "string") {
        const url = x.url.replace(/\\/g,"/");
        if (!seen.has(url)) {
          seen.add(url);
          out.push({
            title: t(x.title || guessTitle(url)),
            url,
            thumb: t(x.thumbnail || x.thumb || ""),
            pages: Number(x.pages || x.page_count || 0) || 0,
            grade: t(x.grade || x.level || ""),
            subject: t(x.subject || ""),
            category: t(x.category || ""),
            tags: Array.isArray(x.tags) ? x.tags.map(t) : [],
            ctx: nextCtx
          });
        }
      }

      Object.values(x).forEach(v => walk(v, nextCtx));
    }

    walk(data);
    return out;
  }

  async function loadData(){
    const r = await fetch("generated/chapters.json?_=" + Date.now(), {cache:"no-store"});
    if (!r.ok) throw new Error("Failed to load chapters.json: " + r.status);
    return flatten(await r.json());
  }

  function itemMeta(it){
    return [it.grade, it.subject, it.category, it.pages ? `עמודים: ${it.pages}` : ""].filter(Boolean).join(" • ");
  }

  function tagsOf(it){
    return [it.grade, it.subject, it.category, ...(it.tags || [])].filter(Boolean);
  }

  function ensureStyle(){
    if (document.getElementById("dbv21-style")) return;
    const style = document.createElement("style");
    style.id = "dbv21-style";
    style.textContent = `
      #${ROOT_ID}{margin:26px 0 34px 0;padding:18px;border-radius:22px;background:rgba(255,255,255,.06);backdrop-filter:blur(8px)}
      #${ROOT_ID} *{box-sizing:border-box}
      .dbv-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap;margin-bottom:14px}
      .dbv-title{font-size:1.35rem;font-weight:900}
      .dbv-sub{opacity:.82;font-size:.95rem}
      .dbv-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:12px 0 18px}
      .dbv-stat{padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08)}
      .dbv-stat-num{font-size:1.2rem;font-weight:900}
      .dbv-stat-label{font-size:.86rem;opacity:.8}
      .dbv-controls{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
      .dbv-input,.dbv-select{padding:11px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:inherit;min-width:180px}
      .dbv-chipbar{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 18px}
      .dbv-chip{padding:8px 12px;border-radius:999px;border:none;cursor:pointer;background:rgba(255,255,255,.09);color:inherit}
      .dbv-chip.active{background:#0b5cff;color:#fff}
      .dbv-section{margin:16px 0 20px}
      .dbv-section-title{font-weight:900;margin-bottom:10px;font-size:1.02rem}
      .dbv-minirow{display:flex;gap:10px;overflow:auto;padding-bottom:4px}
      .dbv-mini{min-width:240px;padding:12px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08)}
      .dbv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
      .dbv-card{display:flex;flex-direction:column;border-radius:18px;overflow:hidden;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.09);box-shadow:0 10px 24px rgba(0,0,0,.16)}
      .dbv-thumb-wrap{height:180px;background:#0f172a;display:flex;align-items:center;justify-content:center}
      .dbv-thumb{width:100%;height:100%;object-fit:cover}
      .dbv-thumb-empty{height:180px;display:flex;align-items:center;justify-content:center;font-size:48px;background:#0f172a}
      .dbv-body{padding:14px}
      .dbv-card-title{margin:0 0 8px 0;font-size:1.03rem;line-height:1.35}
      .dbv-meta{font-size:.9rem;opacity:.8;margin-bottom:10px;min-height:22px}
      .dbv-tags{display:flex;gap:6px;flex-wrap:wrap;min-height:28px;margin-bottom:10px}
      .dbv-tag{font-size:.75rem;padding:4px 8px;border-radius:999px;background:rgba(11,92,255,.14)}
      .dbv-actions{display:flex;gap:8px;flex-wrap:wrap}
      .dbv-btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 12px;border-radius:10px;text-decoration:none;border:none;cursor:pointer;background:rgba(255,255,255,.12);color:inherit}
      .dbv-btn-primary{background:#0b5cff;color:#fff}
      .dbv-empty{padding:20px;border-radius:14px;background:rgba(255,255,255,.05);text-align:center;opacity:.85}
      @media (max-width:700px){
        .dbv-grid{grid-template-columns:1fr}
        .dbv-thumb-wrap,.dbv-thumb-empty{height:150px}
      }
    `;
    document.head.appendChild(style);
  }

  function mount(){
    const host = document.getElementById("home");
    if (!host) return null;
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("section");
      root.id = ROOT_ID;
      host.appendChild(root);
    }
    return root;
  }

  function makeMini(it){
    return `
      <div class="dbv-mini">
        <div style="font-weight:800;margin-bottom:6px">${esc(it.title)}</div>
        <div style="opacity:.8;font-size:.9rem;margin-bottom:8px">${esc(itemMeta(it) || "קובץ PDF")}</div>
        <div class="dbv-actions">
          <a class="dbv-btn dbv-btn-primary" href="reader.html?file=${encodeURIComponent(it.url)}" data-open-url="${esc(it.url)}">פתח</a>
          <a class="dbv-btn" href="${esc(it.url)}" download>הורד</a>
        </div>
      </div>
    `;
  }

  function makeCard(it){
    const thumbHtml = it.thumb
      ? `<div class="dbv-thumb-wrap"><img class="dbv-thumb" src="${esc(it.thumb)}" alt="${esc(it.title)}"></div>`
      : `<div class="dbv-thumb-empty">📘</div>`;

    return `
      <article class="dbv-card" data-url="${esc(it.url)}">
        ${thumbHtml}
        <div class="dbv-body">
          <h3 class="dbv-card-title">${esc(it.title)}</h3>
          <div class="dbv-meta">${esc(itemMeta(it) || "קובץ PDF")}</div>
          <div class="dbv-tags">${tagsOf(it).slice(0,6).map(v => `<span class="dbv-tag">${esc(v)}</span>`).join("")}</div>
          <div class="dbv-actions">
            <a class="dbv-btn dbv-btn-primary" href="reader.html?file=${encodeURIComponent(it.url)}" data-open-url="${esc(it.url)}">פתח</a>
            <a class="dbv-btn" href="${esc(it.url)}" download>הורד</a>
            <button class="dbv-btn dbv-fav" type="button" data-fav-url="${esc(it.url)}">${isFav(it.url) ? "★ מועדף" : "☆ מועדף"}</button>
          </div>
        </div>
      </article>
    `;
  }

  function attachOpenTracking(root){
    root.querySelectorAll("[data-open-url]").forEach(a => {
      a.addEventListener("click", () => pushRecent(a.getAttribute("data-open-url")));
    });
  }

  function attachFavButtons(root, allItems){
    root.querySelectorAll(".dbv-fav").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleFav(btn.getAttribute("data-fav-url"));
        render(root, allItems);
      });
    });
  }

  function render(root, allItems){
    const q = norm(document.getElementById("dbv-q")?.value || "");
    const selTag = norm(document.getElementById("dbv-tag")?.value || "");
    const sort = document.getElementById("dbv-sort")?.value || "title";
    const favOnly = !!document.getElementById("dbv-fav-only")?.checked;

    let items = allItems.filter(it => {
      const hay = norm([
        it.title, it.url, itemMeta(it),
        ...(it.tags || []),
        ...Object.values(it.ctx || {})
      ].join(" | "));
      if (q && !hay.includes(q)) return false;
      if (selTag) {
        const hay2 = norm(tagsOf(it).join(" | "));
        if (!hay2.includes(selTag)) return false;
      }
      if (favOnly && !isFav(it.url)) return false;
      return true;
    });

    items.sort((a,b) => {
      if (sort === "pages") return (b.pages||0) - (a.pages||0);
      if (sort === "fav") return Number(isFav(b.url)) - Number(isFav(a.url));
      return t(a.title).localeCompare(t(b.title), "he");
    });

    const tags = [...new Set(allItems.flatMap(tagsOf).filter(Boolean))].sort((a,b)=>t(a).localeCompare(t(b),"he"));
    const favItems = allItems.filter(it => isFav(it.url));
    const recentMap = new Map(allItems.map(it => [it.url, it]));
    const recentItems = getRecent().map(u => recentMap.get(u)).filter(Boolean);

    const chips = tags.slice(0, 12).map(tag => `<button class="dbv-chip ${norm(tag)===selTag ? "active" : ""}" type="button" data-chip="${esc(tag)}">${esc(tag)}</button>`).join("");

    root.innerHTML = `
      <div class="dbv-head">
        <div>
          <div class="dbv-title">קטלוג חכם V2.1</div>
          <div class="dbv-sub">חיפוש, סינון, מועדפים, נפתח לאחרונה ופתיחה מהירה מתוך המאגר האמיתי</div>
        </div>
      </div>

      <div class="dbv-stats">
        <div class="dbv-stat"><div class="dbv-stat-num">${allItems.length}</div><div class="dbv-stat-label">סה״כ קבצים</div></div>
        <div class="dbv-stat"><div class="dbv-stat-num">${favItems.length}</div><div class="dbv-stat-label">מועדפים</div></div>
        <div class="dbv-stat"><div class="dbv-stat-num">${recentItems.length}</div><div class="dbv-stat-label">נפתח לאחרונה</div></div>
        <div class="dbv-stat"><div class="dbv-stat-num">${items.length}</div><div class="dbv-stat-label">מוצגים כעת</div></div>
      </div>

      <div class="dbv-controls">
        <input id="dbv-q" class="dbv-input" type="search" placeholder="חיפוש לפי שם, תגיות, שכבה, נושא..." value="${esc(q)}">
        <select id="dbv-tag" class="dbv-select">
          <option value="">כל התגיות/קטגוריות</option>
          ${tags.map(v => `<option value="${esc(v)}"${norm(v)===selTag ? " selected" : ""}>${esc(v)}</option>`).join("")}
        </select>
        <select id="dbv-sort" class="dbv-select">
          <option value="title"${sort==="title" ? " selected" : ""}>מיון לפי שם</option>
          <option value="pages"${sort==="pages" ? " selected" : ""}>מיון לפי מספר עמודים</option>
          <option value="fav"${sort==="fav" ? " selected" : ""}>מיון לפי מועדפים</option>
        </select>
        <label class="dbv-btn"><input id="dbv-fav-only" type="checkbox" ${favOnly ? "checked" : ""} style="margin-left:8px">רק מועדפים</label>
      </div>

      <div class="dbv-chipbar">${chips}</div>

      ${favItems.length ? `
      <div class="dbv-section">
        <div class="dbv-section-title">מועדפים</div>
        <div class="dbv-minirow">${favItems.slice(0,8).map(makeMini).join("")}</div>
      </div>` : ""}

      ${recentItems.length ? `
      <div class="dbv-section">
        <div class="dbv-section-title">נפתח לאחרונה</div>
        <div class="dbv-minirow">${recentItems.slice(0,8).map(makeMini).join("")}</div>
      </div>` : ""}

      <div class="dbv-section">
        <div class="dbv-section-title">כל הקבצים</div>
        <div class="dbv-grid">
          ${items.length ? items.map(makeCard).join("") : `<div class="dbv-empty">לא נמצאו תוצאות לחיפוש הנוכחי.</div>`}
        </div>
      </div>
    `;

    root.querySelector("#dbv-q")?.addEventListener("input", () => render(root, allItems));
    root.querySelector("#dbv-tag")?.addEventListener("change", () => render(root, allItems));
    root.querySelector("#dbv-sort")?.addEventListener("change", () => render(root, allItems));
    root.querySelector("#dbv-fav-only")?.addEventListener("change", () => render(root, allItems));
    root.querySelectorAll("[data-chip]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sel = root.querySelector("#dbv-tag");
        if (sel) sel.value = btn.getAttribute("data-chip");
        render(root, allItems);
      });
    });

    attachOpenTracking(root);
    attachFavButtons(root, allItems);
  }

  try {
    ensureStyle();
    const data = await loadData();
    const root = mount();
    if (!root) return;
    render(root, data);
  } catch (e) {
    console.error("catalog_v2.js", e);
  }
})();
