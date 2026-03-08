(async function(){
  const CATALOG_ID = "db-smart-catalog-v2";
  if (document.getElementById(CATALOG_ID)) return;

  function safeText(s){ return String(s ?? ""); }
  function escHtml(s){
    return safeText(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;");
  }

  function flattenChapters(data){
    const out = [];
    const seen = new Set();

    function guessTitleFromUrl(url){
      const raw = safeText(url).split("/").pop() || "ללא שם";
      return raw.replace(/\.pdf$/i, "").replaceAll("_", " ");
    }

    function walk(x, ctx = {}){
      if (Array.isArray(x)) {
        x.forEach(v => walk(v, ctx));
        return;
      }
      if (!x || typeof x !== "object") return;

      const nextCtx = {...ctx};
      for (const [k,v] of Object.entries(x)) {
        if (typeof v === "string" && !["url","title","thumbnail","thumb"].includes(k)) {
          if (!nextCtx[k]) nextCtx[k] = v;
        }
      }

      if (typeof x.url === "string") {
        const url = x.url.replace(/\\/g, "/");
        if (!seen.has(url)) {
          seen.add(url);
          out.push({
            title: safeText(x.title || guessTitleFromUrl(url)),
            url,
            thumb: safeText(x.thumbnail || x.thumb || ""),
            pages: Number(x.pages || x.page_count || 0) || 0,
            tags: Array.isArray(x.tags) ? x.tags.map(safeText) : [],
            category: safeText(x.category || x.level || x.group || ""),
            grade: safeText(x.grade || ""),
            subject: safeText(x.subject || ""),
            raw: x,
            ctx: nextCtx
          });
        }
      }

      for (const v of Object.values(x)) walk(v, nextCtx);
    }

    walk(data, {});
    return out;
  }

  async function loadData(){
    const r = await fetch("generated/chapters.json?_=" + Date.now(), {cache:"no-store"});
    if (!r.ok) throw new Error("chapters.json fetch failed: " + r.status);
    return flattenChapters(await r.json());
  }

  function getFavs(){
    try { return JSON.parse(localStorage.getItem("digitalbook:favs") || "[]"); }
    catch { return []; }
  }

  function setFavs(v){
    localStorage.setItem("digitalbook:favs", JSON.stringify(v));
  }

  function isFav(url){
    return getFavs().includes(url);
  }

  function toggleFav(url){
    const favs = getFavs();
    const i = favs.indexOf(url);
    if (i >= 0) favs.splice(i,1);
    else favs.push(url);
    setFavs(favs);
  }

  function normalizeForSearch(s){
    return safeText(s).toLowerCase().trim();
  }

  function makeCard(item){
    const fav = isFav(item.url);
    const thumbHtml = item.thumb
      ? `<div class="dbv2-thumb-wrap"><img class="dbv2-thumb" src="${escHtml(item.thumb)}" alt="${escHtml(item.title)}"></div>`
      : `<div class="dbv2-thumb-empty">📘</div>`;

    const meta = [
      item.grade,
      item.subject,
      item.category,
      item.pages ? `עמודים: ${item.pages}` : ""
    ].filter(Boolean).join(" • ");

    const tags = (item.tags || []).slice(0,6).map(t => `<span class="dbv2-tag">${escHtml(t)}</span>`).join("");

    return `
      <article class="dbv2-card" data-url="${escHtml(item.url)}">
        ${thumbHtml}
        <div class="dbv2-body">
          <h3 class="dbv2-title">${escHtml(item.title)}</h3>
          <div class="dbv2-meta">${escHtml(meta || "קובץ PDF")}</div>
          <div class="dbv2-tags">${tags}</div>
          <div class="dbv2-actions">
            <a class="dbv2-btn dbv2-btn-primary" href="reader.html?file=${encodeURIComponent(item.url)}">פתח</a>
            <a class="dbv2-btn" href="${escHtml(item.url)}" download>הורד</a>
            <button class="dbv2-btn dbv2-fav-btn" type="button" data-fav-url="${escHtml(item.url)}">${fav ? "★ מועדף" : "☆ מועדף"}</button>
          </div>
        </div>
      </article>
    `;
  }

  function ensureStyles(){
    if (document.getElementById("db-smart-catalog-v2-style")) return;
    const style = document.createElement("style");
    style.id = "db-smart-catalog-v2-style";
    style.textContent = `
      #${CATALOG_ID}{margin:24px 0 32px 0;padding:18px;border-radius:20px;background:rgba(255,255,255,.06);backdrop-filter:blur(8px)}
      #${CATALOG_ID} *{box-sizing:border-box}
      .dbv2-head{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:14px}
      .dbv2-title-main{font-size:1.25rem;font-weight:800}
      .dbv2-sub{opacity:.82;font-size:.95rem}
      .dbv2-controls{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
      .dbv2-input,.dbv2-select{padding:11px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:inherit;min-width:180px}
      .dbv2-stats{margin:8px 0 14px 0;opacity:.9;font-size:.95rem}
      .dbv2-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
      .dbv2-card{display:flex;flex-direction:column;border-radius:18px;overflow:hidden;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.09);box-shadow:0 10px 24px rgba(0,0,0,.16)}
      .dbv2-thumb-wrap{height:180px;background:#0f172a;display:flex;align-items:center;justify-content:center}
      .dbv2-thumb{width:100%;height:100%;object-fit:cover}
      .dbv2-thumb-empty{height:180px;display:flex;align-items:center;justify-content:center;font-size:48px;background:#0f172a}
      .dbv2-body{padding:14px}
      .dbv2-title{margin:0 0 8px 0;font-size:1.03rem;line-height:1.35}
      .dbv2-meta{font-size:.9rem;opacity:.8;margin-bottom:10px}
      .dbv2-tags{display:flex;gap:6px;flex-wrap:wrap;min-height:28px;margin-bottom:10px}
      .dbv2-tag{font-size:.75rem;padding:4px 8px;border-radius:999px;background:rgba(11,92,255,.14)}
      .dbv2-actions{display:flex;gap:8px;flex-wrap:wrap}
      .dbv2-btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 12px;border-radius:10px;text-decoration:none;border:none;cursor:pointer;background:rgba(255,255,255,.12);color:inherit}
      .dbv2-btn-primary{background:#0b5cff;color:#fff}
      .dbv2-empty{padding:20px;border-radius:14px;background:rgba(255,255,255,.05);text-align:center;opacity:.85}
      @media (max-width:700px){
        .dbv2-grid{grid-template-columns:1fr}
        .dbv2-thumb-wrap,.dbv2-thumb-empty{height:150px}
      }
    `;
    document.head.appendChild(style);
  }

  function mountRoot(){
    const host = document.getElementById("home");
    if (!host) return null;
    const root = document.createElement("section");
    root.id = CATALOG_ID;
    host.appendChild(root);
    return root;
  }

  function render(root, items, allItems){
    const favOnly = document.getElementById("dbv2-fav-only")?.checked;
    const q = normalizeForSearch(document.getElementById("dbv2-q")?.value || "");
    const tag = normalizeForSearch(document.getElementById("dbv2-tag")?.value || "");

    let list = items.filter(it => {
      const hay = normalizeForSearch([
        it.title, it.url, it.grade, it.subject, it.category,
        ...(it.tags || []),
        ...Object.values(it.ctx || {})
      ].join(" | "));
      if (q && !hay.includes(q)) return false;
      if (tag) {
        const tagHay = normalizeForSearch([it.grade, it.subject, it.category, ...(it.tags||[])].join(" | "));
        if (!tagHay.includes(tag)) return false;
      }
      if (favOnly && !isFav(it.url)) return false;
      return true;
    });

    const tagsSet = new Set();
    allItems.forEach(it => {
      [it.grade, it.subject, it.category, ...(it.tags || [])].filter(Boolean).forEach(v => tagsSet.add(v));
    });
    const tagOptions = ["<option value=''>כל התגיות/קטגוריות</option>"]
      .concat([...tagsSet].sort((a,b)=>String(a).localeCompare(String(b),'he')).map(v => `<option value="${escHtml(v)}"${normalizeForSearch(v)===tag?' selected':''}>${escHtml(v)}</option>`))
      .join("");

    root.innerHTML = `
      <div class="dbv2-head">
        <div>
          <div class="dbv2-title-main">קטלוג חכם V2</div>
          <div class="dbv2-sub">חיפוש, מועדפים, פתיחה והורדה מתוך המאגר האמיתי</div>
        </div>
      </div>

      <div class="dbv2-controls">
        <input id="dbv2-q" class="dbv2-input" type="search" placeholder="חיפוש לפי שם, תגית, נושא..." value="${escHtml(q)}">
        <select id="dbv2-tag" class="dbv2-select">${tagOptions}</select>
        <label class="dbv2-btn"><input id="dbv2-fav-only" type="checkbox" ${favOnly ? "checked" : ""} style="margin-left:8px">רק מועדפים</label>
      </div>

      <div class="dbv2-stats">מוצגים ${list.length} מתוך ${allItems.length} קבצים</div>

      <div class="dbv2-grid">
        ${list.length ? list.map(makeCard).join("") : `<div class="dbv2-empty">לא נמצאו תוצאות לחיפוש הנוכחי.</div>`}
      </div>
    `;

    root.querySelector("#dbv2-q")?.addEventListener("input", () => render(root, allItems, allItems));
    root.querySelector("#dbv2-tag")?.addEventListener("change", () => render(root, allItems, allItems));
    root.querySelector("#dbv2-fav-only")?.addEventListener("change", () => render(root, allItems, allItems));

    root.querySelectorAll(".dbv2-fav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-fav-url");
        toggleFav(url);
        render(root, allItems, allItems);
      });
    });
  }

  try {
    ensureStyles();
    const data = await loadData();
    const root = mountRoot();
    if (!root) return;
    render(root, data, data);
  } catch (err) {
    console.error(err);
  }
})();
