(function () {
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");
  if (!file || !window.pdfjsLib) return;

  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js";

  const state = {
    pdf: null,
    mode: 1,
    startPage: 1,
    scale: 1.2,
    fitWidth: true,
    scrollMode: false
  };

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return [...root.querySelectorAll(sel)];
  }

  function ensureRoot() {
    let root = document.getElementById("readerMultiviewRoot");
    if (root) return root;

    root = document.createElement("section");
    root.id = "readerMultiviewRoot";
    root.className = "reader-multiview-root";
    root.innerHTML = `
      <div class="reader-multiview-toolbar">
        <div class="reader-multiview-group">
          <button type="button" class="reader-mv-btn" data-mode="1">עמוד 1</button>
          <button type="button" class="reader-mv-btn" data-mode="2">2 עמודים</button>
          <button type="button" class="reader-mv-btn" data-mode="3">3 עמודים</button>
        </div>
        <div class="reader-multiview-group">
          <button type="button" id="mvPrevBtn" class="reader-mv-btn">⬅ קודם</button>
          <button type="button" id="mvNextBtn" class="reader-mv-btn">הבא ➡</button>
          <button type="button" id="mvFitBtn" class="reader-mv-btn">התאמה לרוחב</button>
          <button type="button" id="mvScrollModeBtn" class="reader-mv-btn">גלילה רציפה</button>
          <button type="button" id="mvPrintBtn" class="reader-mv-btn">🖨 הדפסה</button>
        </div>
        <div class="reader-multiview-meta">
          <div id="mvTitle" class="reader-multiview-title"></div>
          <div id="mvInfo" class="reader-multiview-info"></div>
        </div>
      </div>
      <div id="readerMultiviewViewport" class="reader-multiview-viewport"></div>
    `;
    const main = document.querySelector("main");
    if (main) main.insertAdjacentElement("afterbegin", root);
    else document.body.insertAdjacentElement("afterbegin", root);
    return root;
  }

  function hideLegacySingleView() {
    qsa("canvas").forEach((c) => {
      if (!c.closest("#readerMultiviewViewport")) {
        const wrap = c.closest(".canvasWrap,.viewer,.page,.pdf-wrap,.pdf-viewer");
        if (wrap) wrap.classList.add("mv-hidden-legacy");
      }
    });
  }

  function updateToolbar() {
    qsa("[data-mode]").forEach((b) => {
      const active = Number(b.dataset.mode) === state.mode;
      b.classList.toggle("active", active);
    });
    const title = qs("#mvTitle");
    const info = qs("#mvInfo");
    if (title) {
      title.textContent = decodeURIComponent((file.split("/").pop() || "PDF").replace(/\+/g, " "));
    }
    if (info && state.pdf) {
      const end = Math.min(state.startPage + state.mode - 1, state.pdf.numPages);
      const modeLabel = state.scrollMode ? 'גלילה רציפה' : `תצוגת ${state.mode}`;
      info.textContent = `${modeLabel} | עמודים ${state.startPage}-${end} מתוך ${state.pdf.numPages}`;
    }
  }

  async function renderPageToCanvas(pageNum, viewportHost) {
    const page = await state.pdf.getPage(pageNum);
    let scale = state.scale;
    if (state.fitWidth) {
      const hostWidth = Math.max(260, viewportHost.clientWidth - 20);
      const raw = page.getViewport({ scale: 1 });
      scale = Math.min(2.0, hostWidth / raw.width);
    }
    const viewport = page.getViewport({ scale });
    const card = document.createElement("div");
    card.className = "reader-multiview-card";
    const label = document.createElement("div");
    label.className = "reader-multiview-page-label";
    label.textContent = `עמוד ${pageNum}`;
    const canvas = document.createElement("canvas");
    canvas.className = "reader-multiview-canvas";
    const ctx = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    card.appendChild(label);
    card.appendChild(canvas);
    viewportHost.appendChild(card);

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;
  }

  async function renderCurrentSpread() {
    const viewport = qs("#readerMultiviewViewport");
    if (!viewport || !state.pdf) return;

    viewport.innerHTML = "";

    if (state.scrollMode) {
      viewport.classList.add("mv-scroll-mode");
      viewport.style.gridTemplateColumns = "1fr";
      for (let p = 1; p <= state.pdf.numPages; p++) {
        await renderPageToCanvas(p, viewport);
      }
    } else {
      viewport.classList.remove("mv-scroll-mode");
      viewport.style.gridTemplateColumns = `repeat(${state.mode}, minmax(0, 1fr))`;
      const last = Math.min(state.startPage + state.mode - 1, state.pdf.numPages);
      for (let p = state.startPage; p <= last; p++) {
        await renderPageToCanvas(p, viewport);
      }
    }

    updateToolbar();
    hideLegacySingleView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindToolbar() {
    qsa("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        state.mode = Number(btn.dataset.mode);
        if (state.startPage > state.pdf.numPages) state.startPage = 1;
        await renderCurrentSpread();
      });
    });

    const prev = qs("#mvPrevBtn");
    const next = qs("#mvNextBtn");
    const fit = qs("#mvFitBtn");
    const scrollBtn = qs("#mvScrollModeBtn");
    const printBtn = qs("#mvPrintBtn");

    if (prev) {
      prev.addEventListener("click", async () => {
        state.startPage = Math.max(1, state.startPage - state.mode);
        await renderCurrentSpread();
      });
    }

    if (next) {
      next.addEventListener("click", async () => {
        if (!state.pdf) return;
        state.startPage = Math.min(state.pdf.numPages, state.startPage + state.mode);
        await renderCurrentSpread();
      });
    }

    if (fit) {
      fit.addEventListener("click", async () => {
        state.fitWidth = !state.fitWidth;
        fit.classList.toggle("active", state.fitWidth);
        await renderCurrentSpread();
      });
      fit.classList.toggle("active", state.fitWidth);
    }

    if (scrollBtn) {
      scrollBtn.addEventListener("click", async () => {
        state.scrollMode = !state.scrollMode;
        scrollBtn.classList.toggle("active", state.scrollMode);
        await renderCurrentSpread();
      });
      scrollBtn.classList.toggle("active", state.scrollMode);
    }

    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }
  }

  async function init() {
    ensureRoot();
    bindToolbar();
    const task = window.pdfjsLib.getDocument(file);
    state.pdf = await task.promise;
    await renderCurrentSpread();
  }

  init().catch((err) => {
    console.error("reader_multiview init failed", err);
    const info = document.getElementById("mvInfo");
    if (info) info.textContent = "שגיאה בטעינת מצב תצוגה מתקדם";
  });
})();
