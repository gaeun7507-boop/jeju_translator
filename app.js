/* ==========================================================================
   앱 로직: 랜딩 ↔ 대화 화면 전환, 모드 토글, 채팅
   ========================================================================== */

(function () {
  const { DOL, HAENYEO, renderScene } = window.JejuScene;
  const T = window.JejuTranslator;
  const Sheets = window.JejuSheets;
  const Store = window.JejuStore;

  let mode = "s2j"; // 's2j' 표준어→제주말 · 'j2s' 제주말→표준어
  let greeted = false;

  const MODE_TEXT = {
    s2j: {
      label: "표준어 → 제주말",
      placeholder: "표준어를 입력하민 제주말로 바꽈드리쿠다…",
      intro: "표준어 골아줍서. 제주말로 바꽈드리쿠다 마씀!",
      origLabel: "표준어",
    },
    j2s: {
      label: "제주말 → 표준어",
      placeholder: "제주말을 입력하면 표준어로 바꿔드립니다…",
      intro: "제주말 골아줍서. 표준어로 바꽈드리쿠다 마씀!",
      origLabel: "제주말",
    },
  };

  /* ---------- DOM ---------- */
  const viewLanding = document.getElementById("view-landing");
  const viewChat = document.getElementById("view-chat");
  const heroDol = document.getElementById("heroDol");
  const startBtn = document.getElementById("startBtn");
  const backBtn = document.getElementById("backBtn");
  const headAvatar = document.getElementById("headAvatar");
  const modeToggle = document.getElementById("modeToggle");
  const modeLabel = document.getElementById("modeLabel");
  const chatLog = document.getElementById("chatLog");
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");

  /* ---------- 초기화 ---------- */
  renderScene();
  heroDol.innerHTML = DOL();
  headAvatar.innerHTML = DOL();

  // 구글 시트 단어장 불러오기 (있으면)
  Sheets.loadDictionary().then((res) => {
    if (res.loaded) console.info(`[sheets] 시트에서 단어 ${res.loaded}개 불러옴`);
  });

  /* ---------- 화면 전환 ---------- */
  function goChat() {
    viewLanding.classList.add("hidden");
    viewChat.classList.remove("hidden");
    document.body.classList.add("chat-open"); // 부가 기능 크롬 숨김
    if (!greeted) {
      greeted = true;
      addBot("안녕하수꽈, 무신 거 궁금하우꽈?");
      setTimeout(() => addBot(MODE_TEXT[mode].intro), 500);
    }
    setTimeout(() => input.focus(), 300);
  }
  function goLanding() {
    viewChat.classList.add("hidden");
    viewLanding.classList.remove("hidden");
    document.body.classList.remove("chat-open");
  }

  startBtn.addEventListener("click", goChat);
  heroDol.addEventListener("click", goChat);
  heroDol.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goChat(); }
  });
  backBtn.addEventListener("click", goLanding);

  /* ---------- 모드 토글 ---------- */
  function setMode(m) {
    if (m === mode) return;
    mode = m;
    modeToggle.querySelectorAll(".mode-btn").forEach((b) =>
      b.classList.toggle("active", b.dataset.mode === mode)
    );
    modeLabel.textContent = MODE_TEXT[mode].label;
    input.placeholder = MODE_TEXT[mode].placeholder;
  }
  modeToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");
    if (!btn || btn.dataset.mode === mode) return;
    setMode(btn.dataset.mode);
    addBot("모드 바꽈수다 — " + MODE_TEXT[mode].intro);
  });

  /* ---------- 채팅 렌더링 ---------- */
  function escapeHtml(t) {
    const d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  }
  function scroll() { chatLog.scrollTop = chatLog.scrollHeight; }

  function addBot(text, orig) {
    const row = document.createElement("div");
    row.className = "row bot";
    row.innerHTML = `<div class="avatar">${DOL()}</div>
      <div class="bubble"><span class="label">돌하르방</span>${escapeHtml(text)}${
      orig ? `<span class="orig">${MODE_TEXT[mode].origLabel}: ${escapeHtml(orig)}</span>` : ""
    }</div>`;
    chatLog.appendChild(row);
    scroll();
  }
  function addUser(text) {
    const row = document.createElement("div");
    row.className = "row user";
    row.innerHTML = `<div class="avatar">${HAENYEO}</div>
      <div class="bubble"><span class="label">해녀</span>${escapeHtml(text)}</div>`;
    chatLog.appendChild(row);
    scroll();
  }
  function addTyping() {
    const row = document.createElement("div");
    row.className = "row bot";
    row.innerHTML = `<div class="avatar">${DOL()}</div>
      <div class="bubble typing"><span></span><span></span><span></span></div>`;
    chatLog.appendChild(row);
    scroll();
    return row;
  }

  /* ---------- 전송 ---------- */
  function send() {
    const val = input.value.trim();
    if (!val) return;
    addUser(val);
    input.value = "";
    input.style.height = "auto";

    const currentMode = mode;
    const t = addTyping();
    setTimeout(() => {
      t.remove();
      const out = T.translate(val, currentMode);
      addBot(out, val);
      Sheets.logTranslation({ mode: currentMode, input: val, output: out });
      if (Store) Store.addHistory({ mode: currentMode, input: val, output: out }); // 로컬 번역기록
    }, 500 + Math.random() * 350);
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    // 한글 입력(IME) 조합 중 Enter는 무시 — 마지막 글자가 중복 전송되는 버그 방지
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 110) + "px";
  });

  /* ---------- 외부(features.js)에서 쓰는 API ---------- */
  window.JejuApp = {
    start() { goChat(); },
    // 표현을 번역기에서 바로 보여주기: 대화창으로 가서 자동 번역
    translateText(text, m) {
      goChat();
      if (m) setMode(m);
      input.value = text;
      input.dispatchEvent(new Event("input"));
      setTimeout(send, 650); // 인사말 뒤에 자연스럽게 이어지도록
    },
  };
})();
