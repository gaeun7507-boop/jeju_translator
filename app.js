/* ==========================================================================
   앱 로직: 랜딩 ↔ 대화 화면 전환, 모드 토글, 채팅
   ========================================================================== */

(function () {
  const { DOL, HAENYEO, ME, renderScene } = window.JejuScene;
  const T = window.JejuTranslator;
  const Sheets = window.JejuSheets;
  const Store = window.JejuStore;

  let mode = "s2j"; // 's2j' 표준어→제주말 · 'j2s' 제주말→표준어
  let greeted = false;

  /* 방향마다 번역해주는 사람이 다르다.
       표준어 → 제주말 은 하르방이, 제주말 → 표준어 는 해녀가 맡는다.
     묻는 쪽은 언제나 사용자('나')다.
     avatar 가 함수인 이유: DOL()은 부를 때마다 고유 id를 가진 새 SVG를 만든다
     (같은 id가 여러 번 들어가면 SVG 필터가 서로를 덮어쓴다). */
  const MODE_TEXT = {
    s2j: {
      label: "표준어 → 제주말",
      who: "돌하르방",
      avatar: () => DOL(),
      placeholder: "표준어를 입력하민 제주말로 바꽈드리쿠다…",
      greet: "안녕하수꽈, 무신 거 궁금하우꽈?",
      intro: "표준어 골아줍서. 제주말로 바꽈드리쿠다 마씀!",
      origLabel: "표준어",
    },
    j2s: {
      label: "제주말 → 표준어",
      who: "해녀",
      avatar: () => HAENYEO,
      placeholder: "제주말을 입력하면 표준어로 바꿔드립니다…",
      greet: "안녕하세요, 무엇이 궁금하세요?",
      intro: "제주말로 골아줍서. 표준어로 바꿔드릴게요!",
      origLabel: "제주말",
    },
  };

  /* ---------- DOM ---------- */
  const viewLanding = document.getElementById("view-landing");
  const viewChat = document.getElementById("view-chat");
  const picker = document.getElementById("picker");
  const backBtn = document.getElementById("backBtn");
  const headAvatar = document.getElementById("headAvatar");
  const headTitle = document.getElementById("headTitle");
  const modeToggle = document.getElementById("modeToggle");
  const modeLabel = document.getElementById("modeLabel");
  const chatLog = document.getElementById("chatLog");
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");

  /* ---------- 초기화 ---------- */
  renderScene();
  document.getElementById("pickDol").innerHTML = DOL();
  document.getElementById("pickHae").innerHTML = HAENYEO;
  setMode(mode); // 머리말 아바타·제목·안내문을 기본 방향에 맞춰 한 번 그린다

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
      addBot(MODE_TEXT[mode].greet);
      setTimeout(() => addBot(MODE_TEXT[mode].intro), 500);
    }
    setTimeout(() => input.focus(), 300);
  }
  function goLanding() {
    viewChat.classList.add("hidden");
    viewLanding.classList.remove("hidden");
    document.body.classList.remove("chat-open");
  }

  // 랜딩에서 누른 사람이 곧 번역 방향이다
  picker.addEventListener("click", (e) => {
    const btn = e.target.closest(".pick");
    if (!btn) return;
    setMode(btn.dataset.mode);
    goChat();
  });
  backBtn.addEventListener("click", goLanding);

  /* ---------- 모드 토글 ---------- */
  /* 방향을 바꾸면 답해주는 사람도 같이 바뀐다.
     같은 방향을 다시 골라도 그냥 흘려보내지 않는다 — 랜딩에서 하르방을
     눌렀을 때(이미 s2j) 머리말 아바타가 갱신되지 않으면 안 되기 때문. */
  function setMode(m) {
    mode = m;
    modeToggle.querySelectorAll(".mode-btn").forEach((b) =>
      b.classList.toggle("active", b.dataset.mode === mode)
    );
    modeLabel.textContent = MODE_TEXT[mode].label;
    input.placeholder = MODE_TEXT[mode].placeholder;
    headAvatar.innerHTML = MODE_TEXT[mode].avatar();
    headTitle.textContent = MODE_TEXT[mode].who + " 사투리 번역기";
  }
  modeToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");
    if (!btn || btn.dataset.mode === mode) return;
    setMode(btn.dataset.mode);
    // 답하는 사람이 바뀌었으니 새로 인사한다
    addBot(MODE_TEXT[mode].intro);
  });

  /* ---------- 채팅 렌더링 ---------- */
  function escapeHtml(t) {
    const d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  }
  function scroll() { chatLog.scrollTop = chatLog.scrollHeight; }

  // 답하는 쪽 — 방향에 따라 하르방이거나 해녀다
  function addBot(text, orig, m) {
    const M = MODE_TEXT[m || mode];
    const row = document.createElement("div");
    row.className = "row bot";
    row.innerHTML = `<div class="avatar">${M.avatar()}</div>
      <div class="bubble"><span class="label">${M.who}</span>${escapeHtml(text)}${
      orig ? `<span class="orig">${M.origLabel}: ${escapeHtml(orig)}</span>` : ""
    }</div>`;
    chatLog.appendChild(row);
    scroll();
  }
  // 묻는 쪽 — 언제나 사용자 자신이다
  function addUser(text) {
    const row = document.createElement("div");
    row.className = "row user";
    row.innerHTML = `<div class="avatar">${ME}</div>
      <div class="bubble"><span class="label">나</span>${escapeHtml(text)}</div>`;
    chatLog.appendChild(row);
    scroll();
  }
  function addTyping() {
    const row = document.createElement("div");
    row.className = "row bot";
    row.innerHTML = `<div class="avatar">${MODE_TEXT[mode].avatar()}</div>
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
      // 번역을 기다리는 동안 방향이 바뀌었을 수도 있다 — 보낼 때의 사람으로 답한다
      addBot(out, val, currentMode);
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
