/* ==========================================================================
   부가 기능 UI
   - 왼쪽 위 : 사전 (표준어 ↔ 제주말 검색)
   - 오른쪽  : 번역기록 · 즐겨찾기 · 자주찾는 표현
   아이콘은 모두 heroicons(MIT) 아웃라인 SVG.
   ========================================================================== */

(function () {
  const Store = window.JejuStore;
  const App = () => window.JejuApp; // app.js 로드 후 접근

  /* ---------- heroicons 경로 ---------- */
  const ICON = {
    book: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
    clock: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    star: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
    chat: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
    x: "M6 18 18 6M6 6l12 12",
    search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
    copy: "M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184",
    trash: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
    play: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z",
    inbox: "M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z",
  };
  function svg(name, opt) {
    opt = opt || {};
    const fill = opt.solid ? "currentColor" : "none";
    const stroke = opt.solid ? "none" : "currentColor";
    return `<svg viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON[name]}"/></svg>`;
  }

  /* ---------- 자주찾는 표현 (대표 제주 방언) ---------- */
  const EXPRESSIONS = [
    { jeju: "혼저 옵서", std: "어서 오세요" },
    { jeju: "안녕하수꽈?", std: "안녕하세요?" },
    { jeju: "폭싹 속았수다", std: "정말 수고하셨습니다" },
    { jeju: "기?", std: "그래? / 진짜?" },
    { jeju: "기여", std: "그래 / 맞아" },
    { jeju: "무사 겅허맨?", std: "왜 그렇게 해?" },
    { jeju: "무사 마씸?", std: "왜 그러세요?" },
    { jeju: "게메 마씸", std: "그러게 말이에요" },
    { jeju: "고맙수다", std: "감사합니다" },
    { jeju: "어드레 감수과?", std: "어디 가세요?" },
    { jeju: "무신 거 햄수과?", std: "뭐 하고 계세요?" },
    { jeju: "밥 먹언?", std: "밥 먹었어?" },
    { jeju: "속솜허라", std: "조용히 해" },
    { jeju: "조들지 말라", std: "걱정하지 마" },
    { jeju: "놀멍 놀멍 헙서", std: "천천히 하세요" },
    { jeju: "잘도 좋다", std: "정말 좋다" },
    { jeju: "맛좋수다", std: "맛있어요" },
    { jeju: "하영 먹읍서", std: "많이 드세요" },
    { jeju: "지꺼졈수다", std: "기분 좋아요 / 신나요" },
    { jeju: "곱들락허다", std: "예쁘다 / 귀엽다" },
    { jeju: "어떵 지냄수과?", std: "어떻게 지내세요?" },
    { jeju: "재기재기 옵서", std: "빨리빨리 오세요" },
    { jeju: "놀레 가게", std: "놀러 가자" },
    { jeju: "펜안히 갑서", std: "안녕히 가세요" },
  ];

  /* ---------- 유틸 ---------- */
  function esc(t) {
    const d = document.createElement("div");
    d.textContent = t == null ? "" : t;
    return d.innerHTML;
  }
  function fmtTime(ts) {
    const d = new Date(ts);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  let toastTimer = null;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  }
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(() => toast("복사햇수다 📋"), () => toast("복사 실패"));
    } else {
      const ta = document.createElement("textarea");
      ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("복사햇수다 📋"); } catch (e) { toast("복사 실패"); }
      ta.remove();
    }
  }

  /* ---------- DOM 주입 ---------- */
  const chrome = document.createElement("div");
  chrome.innerHTML = `
    <div class="app-chrome">
      <button class="chrome-btn" data-panel="dict" aria-label="사전 열기">
        ${svg("book")}<span>사전</span>
      </button>
    </div>
    <div class="app-rail" role="toolbar" aria-label="부가 기능">
      <button class="rail-btn" data-panel="history">${svg("clock")}<span>번역기록</span></button>
      <button class="rail-btn" data-panel="favs">${svg("star")}<span>즐겨찾기</span></button>
      <button class="rail-btn" data-panel="phrases">${svg("chat")}<span>자주찾는<br>표현</span></button>
    </div>
    <div class="modal-overlay hidden" id="modalOverlay">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <header class="modal-head">
          <h2 class="modal-title" id="modalTitle"></h2>
          <button class="modal-close" id="modalClose" aria-label="닫기">${svg("x")}</button>
        </header>
        <div class="modal-body" id="modalBody"></div>
      </div>
    </div>`;
  while (chrome.firstElementChild) document.body.appendChild(chrome.firstElementChild);

  const overlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  let currentPanel = null;
  let currentItems = []; // 리스트 액션이 참조하는 데이터

  /* ---------- 패널 렌더러 ---------- */
  const TITLE = {
    dict: `${svg("book")}<span>제주말 사전</span>`,
    history: `${svg("clock")}<span>번역기록</span>`,
    favs: `${svg("star")}<span>즐겨찾기</span>`,
    phrases: `${svg("chat")}<span>자주찾는 표현</span>`,
  };

  function favBtn(a, b) {
    const on = Store.isFav(a, b);
    return `<button class="icon-btn ${on ? "fav-on" : ""}" data-act="fav" title="즐겨찾기">${svg("star", { solid: on })}</button>`;
  }
  function copyBtn() {
    return `<button class="icon-btn" data-act="copy" title="복사">${svg("copy")}</button>`;
  }
  function emptyState(text) {
    return `<div class="empty">${svg("inbox")}<div>${esc(text)}</div></div>`;
  }

  // 사전
  // ⚠ 입력창은 한 번만 만들고, 타이핑할 땐 목록(#dictList)만 갱신한다.
  //    (매 글자마다 input 을 다시 그리면 한글 조합이 깨져 "무ㅜ사ㅏ" 처럼 됨)
  function dictRows(term) {
    const D = window.JEJU_DICT || { phrases: [], words: [] };
    const all = [...D.phrases, ...D.words]; // [표준어, 제주말]
    const t = (term || "").trim();
    const list = t ? all.filter((p) => p[0].includes(t) || p[1].includes(t)) : all;
    currentItems = list.map((p) => ({ a: p[1], b: p[0] })); // a=제주말, b=표준어

    const countEl = document.getElementById("dictCount");
    const listEl = document.getElementById("dictList");
    if (countEl) countEl.textContent = list.length + "개";
    if (!listEl) return;
    listEl.innerHTML = list.length
      ? list.map((p, i) => `
        <div class="li">
          <div class="li-main">
            <div class="li-primary">${esc(p[1])}</div>
            <div class="li-sub">${esc(p[0])}</div>
          </div>
          <div class="li-acts" data-idx="${i}">
            ${favBtn(p[1], p[0])}${copyBtn()}
          </div>
        </div>`).join("")
      : emptyState("찾는 말이 읏수다. 다른 말로 검색해봅서.");
  }
  function renderDict() {
    modalBody.innerHTML = `
      <div class="dict-search">
        ${svg("search")}
        <input id="dictSearch" type="text" placeholder="표준어·제주말 검색…" autocomplete="off">
      </div>
      <div class="dict-count" id="dictCount"></div>
      <div id="dictList"></div>`;
    const box = document.getElementById("dictSearch");
    box.addEventListener("input", () => dictRows(box.value));
    dictRows("");
    box.focus();
  }

  // 번역기록
  function renderHistory() {
    const list = Store.getHistory();
    currentItems = list.map((h) => ({ a: h.output, b: h.input, ts: h.ts }));
    if (!list.length) { modalBody.innerHTML = emptyState("아직 번역한 기록이 읏수다."); return; }
    const rows = list.map((h, i) => `
      <div class="li">
        <div class="li-main">
          <span class="li-badge">${h.mode === "j2s" ? "제주 → 표준" : "표준 → 제주"}</span>
          <div class="li-primary">${esc(h.output)}</div>
          <div class="li-sub">${esc(h.input)}</div>
          <div class="li-time">${fmtTime(h.ts)}</div>
        </div>
        <div class="li-acts" data-idx="${i}">
          ${favBtn(h.output, h.input)}${copyBtn()}
          <button class="icon-btn" data-act="del" title="삭제">${svg("trash")}</button>
        </div>
      </div>`).join("");
    modalBody.innerHTML = rows + `<div class="modal-foot"><button class="text-btn" data-act="clear">전체 삭제</button></div>`;
  }

  // 즐겨찾기
  function renderFavs() {
    const list = Store.getFavs();
    currentItems = list.map((f) => ({ a: f.a, b: f.b }));
    if (!list.length) { modalBody.innerHTML = emptyState("즐겨찾기가 비엇수다. ⭐를 눌러 담아봅서."); return; }
    const rows = list.map((f, i) => `
      <div class="li">
        <div class="li-main">
          <div class="li-primary">${esc(f.a)}</div>
          <div class="li-sub">${esc(f.b)}</div>
        </div>
        <div class="li-acts" data-idx="${i}">
          <button class="icon-btn fav-on" data-act="fav" title="즐겨찾기 해제">${svg("star", { solid: true })}</button>
          ${copyBtn()}
        </div>
      </div>`).join("");
    modalBody.innerHTML = rows;
  }

  // 자주찾는 표현
  function renderPhrases() {
    currentItems = EXPRESSIONS.map((e) => ({ a: e.jeju, b: e.std }));
    const rows = EXPRESSIONS.map((e, i) => `
      <div class="li">
        <div class="li-main">
          <div class="li-primary">${esc(e.jeju)}</div>
          <div class="li-sub">${esc(e.std)}</div>
        </div>
        <div class="li-acts" data-idx="${i}">
          ${favBtn(e.jeju, e.std)}${copyBtn()}
        </div>
      </div>`).join("");
    modalBody.innerHTML = rows;
  }

  const RENDER = {
    dict: renderDict,
    history: renderHistory,
    favs: renderFavs,
    phrases: renderPhrases,
  };

  /* ---------- 모달 열고 닫기 ---------- */
  function openPanel(name) {
    currentPanel = name;
    modalTitle.innerHTML = TITLE[name] || "";
    RENDER[name]();
    overlay.classList.remove("hidden");
  }
  function closePanel() {
    overlay.classList.add("hidden");
    currentPanel = null;
  }

  document.querySelectorAll(".chrome-btn, .rail-btn").forEach((btn) =>
    btn.addEventListener("click", () => openPanel(btn.dataset.panel))
  );
  document.getElementById("modalClose").addEventListener("click", closePanel);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closePanel(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) closePanel();
  });

  /* ---------- 리스트 액션 (이벤트 위임) ---------- */
  modalBody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.dataset.act;

    if (act === "clear") {
      if (confirm("번역기록을 전부 지우쿠과?")) { Store.clearHistory(); }
      return;
    }

    const acts = btn.closest(".li-acts");
    const idx = acts ? Number(acts.dataset.idx) : -1;
    const item = currentItems[idx];
    if (!item && act !== "clear") return;

    if (act === "copy") { copyText(item.a); return; }
    if (act === "fav") {
      const added = Store.toggleFav(item.a, item.b);
      toast(added ? "즐겨찾기 담앗수다 ⭐" : "즐겨찾기 뺏수다");
      return; // onChange 가 재렌더
    }
    if (act === "del") { Store.removeHistory(item.ts); return; }
    if (act === "use") {
      closePanel();
      const app = App();
      if (app && app.translateText) app.translateText(item.a, "j2s");
      return;
    }
  });

  /* 저장소가 바뀌면 열려 있는 패널만 다시 그림 (검색어 유지 위해 사전은 제외) */
  Store.onChange(() => {
    if (!currentPanel || overlay.classList.contains("hidden")) return;
    if (currentPanel === "dict") {
      // 사전은 목록만 갱신 (입력창을 건드리면 한글 조합이 깨짐)
      const box = document.getElementById("dictSearch");
      dictRows(box ? box.value : "");
    } else {
      RENDER[currentPanel]();
    }
  });
})();
