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
    info: "M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
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

  /* ---------- 제주말 안내 (정보창 내용) ---------- */
  const ABOUT_EX = [
    { std: "어서 오세요", jeju: "혼저 옵서" },
    { std: "매우 수고하셨습니다", jeju: "폭삭 속았수다" },
  ];
  const ABOUT_WHY = [
    {
      title: "지리적 고립",
      body: "섬이라는 특성상 본토와의 교류가 적어 육지와는 전혀 다른 독자적인 언어 체계를 구축하고 유지할 수 있었습니다.",
    },
    {
      title: "조선시대 유배지 역할",
      body: "제주도는 조선시대 정치범, 문인, 학자들의 주요 유배지였습니다. 이때 외부와의 접촉은 제한되었지만, 유배 온 양반들의 말과 문화가 현지 제주 사람들의 말과 기묘하게 섞이면서 고유한 특성을 띠게 되었습니다.",
    },
    {
      title: "몽골의 통치와 언어 유입",
      body: "13세기 고려시대 원나라(몽골)가 제주도를 통치하면서 몽골어 어휘가 스며들었습니다. (예: 바다 ➔ 바당, 할아버지 ➔ 하루방 등이 몽골어에서 유래한 것으로 설명합니다.)",
    },
  ];

  /* ---------- 제주마 ----------
     돌담(.wall)에 가려야 하므로 body 가 아니라 #scene 안, 담보다 뒤(z-index:1)에 둔다.
     담이 발굽을 덮어줘서 담 너머에 서 있는 것처럼 보인다.

     비율은 다 자란 말 — 기갑 높이만큼 몸이 길고, 그중 절반이 다리다.
     가슴이 깊고 엉덩이가 크며, 목은 활처럼 휘어 올라간다.

     화법은 한라산(scene.js)과 같다 — 윤곽선을 치지 않고
       ① 실루엣 색면을 그늘색/본색/빛색 3단으로 뚝뚝 끊어 깔고
       ② 그 위에 결 방향대로 붓자국을 흩뿌려 색면 이음매를 덮고
       ③ broken color(황토빛)를 사이사이 섞은 뒤
       ④ feTurbulence 로 윤곽을 밀어 붓끝처럼 너덜하게 만든다.
     빛은 배경의 해와 같은 방향(오른쪽 위)에서 온다. */

  function rng(seed) {
    let s = seed;
    return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  }

  // 노이즈로 윤곽을 밀어 붓끝처럼 만드는 필터 (scene.js 와 같은 방식, viewBox 가 작아 scale 도 작다)
  function brush(id, scale, freq, seed) {
    return `<filter id="${id}" x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}"
        xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
  }

  function pony() {
    const r = rng(19);

    /* 실루엣 — 기갑(100,46)에서 등이 곧게 뻗어 엉덩이(190,48)에서 둥글게 떨어진다.
       가슴은 y=110 까지 깊고, 앞다리 팔꿈치는 몸통 배선 위에 붙는다. */
    const BODY = `M100,46 C130,38 162,38 184,46 C202,52 208,70 202,90
      C197,106 188,112 176,112 C158,120 126,120 106,110
      C95,105 90,92 90,76 C90,60 93,50 100,46 Z`;
    // 목·머리 (왼쪽을 본다) — 흔들 때 통째로 도니까 한 덩어리로 묶는다.
    // 등쪽 갈기선은 활처럼 휘고, 목 아래(목구멍선)는 오목하게 들어간다.
    const NECK = `M104,42 C88,22 66,10 46,6 C39,13 35,25 34,36
      C58,50 80,68 94,88 C104,82 107,60 104,42 Z`;
    /* 머리 — 콧등은 곧고 주둥이로 갈수록 좁아진다.
       머리 길이는 몸통의 0.4 남짓이어야 한다. 이보다 크면 당나귀가 된다. */
    const HEAD = `M49,4 C39,2 28,11 21,25 C15,35 14,45 20,49
      C28,53 36,45 42,33 C50,21 57,12 49,4 Z`;

    /* 결 방향(ang°)대로 붓자국 한 무더기 — 사각 구간 안에 흩뿌린다 */
    function daub(n, x0, y0, x1, y1, ang, col, opLo, opHi, wLo, wHi, lenLo, lenHi) {
      let s = "";
      for (let i = 0; i < n; i++) {
        const x = x0 + r() * (x1 - x0);
        const y = y0 + r() * (y1 - y0);
        const a = (ang * Math.PI) / 180 + (r() - 0.5) * 0.55;
        const len = lenLo + r() * (lenHi - lenLo);
        const dx = Math.cos(a) * len;
        const dy = Math.sin(a) * len;
        s += `<path d="M${x.toFixed(1)},${y.toFixed(1)}
          q${(dx * 0.5 + (r() - 0.5) * 2.5).toFixed(1)},${(dy * 0.5).toFixed(1)}
          ${dx.toFixed(1)},${dy.toFixed(1)}"
          stroke="${col}" stroke-width="${(wLo + r() * (wHi - wLo)).toFixed(1)}"
          stroke-linecap="round" fill="none"
          opacity="${(opLo + r() * (opHi - opLo)).toFixed(2)}"/>`;
      }
      return s;
    }

    /* 갈기·꼬리 — 한 획으로 그으면 고무호스가 된다. 길이·각도가 다른 털뭉치를 겹친다 */
    function hair(n, x0, y0, x1, y1, ang, lenLo, lenHi, wLo, wHi) {
      let s = "";
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const x = x0 + (x1 - x0) * t + (r() - 0.5) * 4;
        const y = y0 + (y1 - y0) * t + (r() - 0.5) * 4;
        const a = (ang * Math.PI) / 180 + (r() - 0.5) * 0.7;
        const len = lenLo + r() * (lenHi - lenLo);
        // 검정 한 가지로만 그으면 애벌레가 된다 — 어두운 털·본색·빛받은 털을 섞는다
        const c = r();
        const col = c > 0.58 ? "var(--pony-lit)" : c > 0.26 ? "var(--pony)" : "var(--pony-mane)";
        s += `<path d="M${x.toFixed(1)},${y.toFixed(1)}
          q${(Math.cos(a) * len * 0.4 - 3).toFixed(1)},${(Math.sin(a) * len * 0.5).toFixed(1)}
          ${(Math.cos(a) * len).toFixed(1)},${(Math.sin(a) * len).toFixed(1)}"
          stroke="${col}" stroke-width="${(wLo + r() * (wHi - wLo)).toFixed(1)}"
          stroke-linecap="round" fill="none" opacity="${(0.22 + r() * 0.34).toFixed(2)}"/>`;
      }
      return s;
    }

    /* 다리 — 통짜 막대로 그으면 장난감이 된다.
       앞다리는 전완(굵다)–무릎–관골(가늘다)–구절–발굽,
       뒷다리는 넓적다리(가장 굵다)–비절–관골–발굽으로 마디를 나눠 굵기를 바꾼다.
       s 는 원근 축소(반대편 다리는 조금 작다). 지면은 y=176. */
    function foreleg(x, col, s) {
      return `<path d="M${x},74 C${x + 3},94 ${x + 2},112 ${x},126"
          stroke="${col}" stroke-width="${15 * s}" stroke-linecap="round" fill="none"/>
        <path d="M${x},124 C${x - 2},140 ${x - 2},150 ${x - 1},158"
          stroke="${col}" stroke-width="${7 * s}" stroke-linecap="round" fill="none"/>
        <path d="M${x - 1},156 C${x - 1},162 ${x},165 ${x + 1},167"
          stroke="${col}" stroke-width="${7.5 * s}" stroke-linecap="round" fill="none"/>
        <path d="M${x + 1},166 l0,8" stroke="var(--hoof)" stroke-width="${9 * s}"
          stroke-linecap="butt" fill="none"/>`;
    }
    function hindleg(x, col, s) {
      return `<path d="M${x + 2},70 C${x - 6},92 ${x - 8},106 ${x - 4},120"
          stroke="${col}" stroke-width="${20 * s}" stroke-linecap="round" fill="none"/>
        <path d="M${x - 4},116 C${x + 1},128 ${x + 3},134 ${x + 3},140"
          stroke="${col}" stroke-width="${11 * s}" stroke-linecap="round" fill="none"/>
        <path d="M${x + 3},138 C${x + 2},150 ${x + 1},156 ${x + 1},162"
          stroke="${col}" stroke-width="${6.5 * s}" stroke-linecap="round" fill="none"/>
        <path d="M${x + 1},160 C${x + 1},165 ${x + 2},167 ${x + 3},168"
          stroke="${col}" stroke-width="${7.5 * s}" stroke-linecap="round" fill="none"/>
        <path d="M${x + 3},167 l0,8" stroke="var(--hoof)" stroke-width="${9 * s}"
          stroke-linecap="butt" fill="none"/>`;
    }

    return `<svg viewBox="0 0 230 185" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        ${brush("pnB", 2.6, "0.05 0.09", 13)}
        ${brush("pnBs", 1.6, "0.09 0.16", 27)}
        <clipPath id="pnBody"><path d="${BODY}"/></clipPath>
        <clipPath id="pnNeck"><path d="${NECK}"/></clipPath>
        <clipPath id="pnHead"><path d="${HEAD}"/></clipPath>
      </defs>

      <!-- 반대편 다리 — 그늘색으로 물러나 있고 원근으로 조금 작다 -->
      <g filter="url(#pnBs)" opacity=".8">
        ${foreleg(114, "var(--pony-shade)", 0.88)}
        ${hindleg(178, "var(--pony-shade)", 0.88)}
      </g>

      <!-- 꼬리 — 엉덩이에서 무겁게 흘러내린다 -->
      <g class="pony-tail" filter="url(#pnBs)">
        <!-- 꼬리대(엉덩이에 붙는 뿌리)는 굵고, 아래로 갈수록 털이 퍼진다.
             한 다발로 그으면 땋은 머리가 된다 — 폭이 다른 다발 셋을 겹친다 -->
        <path d="M195,50 C214,72 218,108 208,148" stroke="var(--pony-shade)" stroke-width="14"
          stroke-linecap="round" fill="none" opacity=".5"/>
        <path d="M196,52 C212,74 215,110 205,146" stroke="var(--pony-mane)" stroke-width="6"
          stroke-linecap="round" fill="none" opacity=".5"/>
        ${hair(44, 199, 54, 213, 142, 84, 12, 30, 1.2, 2.8)}
        ${hair(38, 193, 50, 203, 150, 80, 10, 24, 1, 2.2)}
        ${hair(20, 197, 62, 216, 128, 88, 8, 18, 1, 2)}
      </g>

      <!-- 몸통 -->
      <g filter="url(#pnB)"><path d="${BODY}" fill="var(--pony-shade)"/></g>
      <g clip-path="url(#pnBody)">
        <!-- 색면 2단 — 등·엉덩이는 빛을 받고, 배는 그늘 -->
        <g filter="url(#pnBs)">
          <path d="${BODY}" fill="var(--pony)"/>
          <path d="M88,78 C118,104 168,116 208,98 L208,128 L84,128 Z" fill="var(--pony-shade)" opacity=".9"/>
          <path d="M96,54 C130,40 176,44 204,66 L206,32 L94,30 Z" fill="var(--pony-lit)" opacity=".5"/>
        </g>
        <!-- 결 붓질 — 갈비는 비스듬히, 어깨와 엉덩이는 근육 결을 따라 방향을 달리한다 -->
        <g filter="url(#pnBs)">
          ${daub(40, 100, 40, 190, 64, 62, "var(--pony-lit)", 0.08, 0.24, 1, 3, 4, 11)}
          ${daub(28, 118, 36, 196, 52, 72, "var(--pony-lit)", 0.1, 0.3, 1, 2.4, 3, 8)}
          ${daub(36, 90, 80, 188, 114, 66, "var(--pony-shade)", 0.1, 0.3, 1.5, 4, 5, 13)}
          <!-- 어깨 근육 — 기갑에서 팔꿈치로 비스듬히 내려온다 -->
          ${daub(20, 90, 48, 118, 104, 100, "var(--pony-shade)", 0.1, 0.28, 1.5, 3.5, 5, 13)}
          ${daub(12, 96, 50, 116, 92, 100, "var(--pony-lit)", 0.08, 0.22, 1, 2.4, 4, 9)}
          <!-- 엉덩이 근육 — 둥근 결을 따라 세로에 가깝게 -->
          ${daub(24, 172, 44, 206, 106, 96, "var(--pony-lit)", 0.08, 0.24, 1, 2.8, 4, 11)}
          ${daub(16, 178, 62, 208, 112, 96, "var(--pony-shade)", 0.1, 0.28, 1.5, 3.5, 4, 11)}
          <!-- broken color — 갈색만으로는 탁하다. 황토빛을 사이에 섞는다 -->
          ${daub(26, 104, 46, 194, 96, 64, "var(--pony-warm)", 0.07, 0.2, 1, 3, 4, 10)}
          ${daub(14, 92, 64, 140, 106, 70, "var(--pony-mane)", 0.06, 0.16, 1.5, 3.5, 4, 9)}
        </g>
      </g>

      <!-- 이쪽 다리 -->
      <g filter="url(#pnBs)">
        ${foreleg(100, "var(--pony)", 1)}
        ${hindleg(190, "var(--pony)", 1)}
        <!-- 다리 뒤쪽 모서리에 그늘, 앞쪽에 빛 — 원통으로 보이게 -->
        ${daub(12, 104, 80, 110, 130, 92, "var(--pony-shade)", 0.18, 0.44, 2, 4, 6, 15)}
        ${daub(12, 186, 76, 194, 124, 92, "var(--pony-shade)", 0.18, 0.44, 2, 4.5, 6, 16)}
        ${daub(9, 95, 78, 100, 126, 92, "var(--pony-lit)", 0.1, 0.28, 1.5, 3, 5, 12)}
        ${daub(9, 178, 74, 184, 120, 92, "var(--pony-lit)", 0.1, 0.28, 1.5, 3, 5, 12)}
      </g>

      <!-- 목·머리 — 통째로 숙였다 올렸다 돌린다 (transform-origin 은 CSS) -->
      <g class="pony-head">
        <g filter="url(#pnB)">
          <path d="${NECK}" fill="var(--pony-shade)"/>
          <path d="${HEAD}" fill="var(--pony-shade)"/>
        </g>

        <g clip-path="url(#pnNeck)">
          <g filter="url(#pnBs)">
            <path d="${NECK}" fill="var(--pony)"/>
            <!-- 목구멍쪽(왼쪽 아래)은 그늘, 갈기 밑 능선은 빛 -->
            <path d="M34,36 C58,50 80,68 94,88 L56,96 L16,44 Z" fill="var(--pony-shade)" opacity=".85"/>
            <path d="M50,10 C70,18 90,32 102,50 L108,24 L54,0 Z" fill="var(--pony-lit)" opacity=".35"/>
          </g>
          <g filter="url(#pnBs)">
            ${daub(30, 44, 14, 102, 72, 118, "var(--pony-lit)", 0.08, 0.24, 1, 2.6, 4, 10)}
            ${daub(20, 32, 34, 80, 86, 118, "var(--pony-shade)", 0.1, 0.3, 1.2, 3.2, 4, 11)}
            ${daub(14, 46, 24, 98, 66, 118, "var(--pony-warm)", 0.06, 0.18, 1, 2.4, 3, 8)}
          </g>
        </g>

        <!-- 귀 — 다 자란 말은 귀가 길고 끝이 뾰족하다 -->
        <g filter="url(#pnBs)">
          <path d="M45,12 C41,-2 42,-14 48,-19 C54,-13 56,1 54,15 Z" fill="var(--pony)"/>
          <path d="M47,9 C45,-2 46,-10 49,-14 C51,-7 52,2 51,12 Z" fill="var(--pony-mane)" opacity=".55"/>
          <path d="M57,14 C55,2 58,-8 63,-11 C67,-5 66,7 64,18 Z" fill="var(--pony-shade)" opacity=".9"/>
        </g>

        <g clip-path="url(#pnHead)">
          <g filter="url(#pnBs)">
            <path d="${HEAD}" fill="var(--pony)"/>
            <!-- 아래턱·주둥이 밑은 그늘, 콧등 능선과 이마는 빛 -->
            <path d="M20,49 C28,53 36,45 42,33 L28,62 L6,52 Z" fill="var(--pony-shade)" opacity=".9"/>
            <path d="M45,7 C34,7 24,15 18,27 L40,22 L52,9 Z" fill="var(--pony-lit)" opacity=".32"/>
          </g>
          <g filter="url(#pnBs)">
            ${daub(20, 16, 10, 48, 44, 140, "var(--pony-lit)", 0.08, 0.22, 1, 2.4, 3, 8)}
            ${daub(14, 13, 26, 38, 50, 140, "var(--pony-shade)", 0.1, 0.3, 1.2, 2.6, 3, 8)}
            ${daub(8, 20, 12, 46, 34, 140, "var(--pony-warm)", 0.06, 0.16, 1, 2, 2, 5)}
          </g>
        </g>

        <!-- 눈 — 동그라미를 그리면 만화가 된다. 눈두덩 그늘 한 점 + 빛 한 점 -->
        <g filter="url(#pnBs)">
          <path d="M31,20 C36,18 40,21 39,25 C37,29 32,29 29,26 Z" fill="var(--pony-mane)"/>
          <circle cx="34" cy="22" r="1.1" fill="var(--snow-cap, #fff)" opacity=".7"/>
          <!-- 콧구멍·입 — 짧은 붓자국 -->
          <path d="M17,36 q3,1 3,4" stroke="var(--pony-mane)" stroke-width="2.4"
            stroke-linecap="round" fill="none" opacity=".8"/>
          <path d="M15,44 q5,2 8,1" stroke="var(--pony-mane)" stroke-width="1.8"
            stroke-linecap="round" fill="none" opacity=".5"/>
        </g>

        <!-- 갈기 — 귀 뒤에서 기갑까지, 목 옆으로 두껍게 흘러내린다 -->
        <g filter="url(#pnBs)">
          ${hair(64, 48, 2, 104, 46, 128, 10, 26, 1, 2.4)}
          ${hair(34, 52, 6, 100, 42, 136, 6, 16, 0.8, 1.8)}
          <!-- 앞머리(이마 갈기) -->
          ${hair(12, 44, 2, 28, 18, 166, 5, 13, 0.8, 1.8)}
        </g>
      </g>
    </svg>`;
  }

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
    </div>
    <button class="pony-cta" data-panel="about" aria-label="제주 더 알아보기">
      <span class="pony-bubble">제주 더 알아보기<span class="pony-tail-tip"></span></span>
    </button>`;
  while (chrome.firstElementChild) document.body.appendChild(chrome.firstElementChild);

  /* 조랑말은 돌담(#scene 안)에 가려야 하므로 body 가 아니라 #scene 에 넣는다.
     app.js 가 renderScene() 으로 #scene 을 채운 뒤에 features.js 가 실행되므로 덮어써지지 않는다. */
  const scene = document.getElementById("scene");
  if (scene) {
    const lane = document.createElement("div");
    lane.className = "pony-lane";
    lane.innerHTML = `<div class="pony">${pony()}</div>`;
    scene.appendChild(lane);
  }

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
    about: `${svg("info")}<span>제주말, 무사 어렵수과?</span>`,
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

  // 제주말 안내 — 읽기 전용이라 currentItems 를 쓰지 않는다
  function renderAbout() {
    currentItems = [];
    const ex = ABOUT_EX.map((e) => `
      <div class="ex-row">
        <span class="ex-from">${esc(e.std)}</span>
        <span class="ex-arrow">➔</span>
        <span class="ex-to">${esc(e.jeju)}</span>
      </div>`).join("");
    const why = ABOUT_WHY.map((w, i) => `
      <div class="why">
        <div class="why-no">${i + 1}</div>
        <div class="why-main">
          <div class="why-title">${esc(w.title)}</div>
          <div class="why-body">${esc(w.body)}</div>
        </div>
      </div>`).join("");
    modalBody.innerHTML = `
      <div class="about-sec">
        <h3 class="about-h">표준어와의 확연한 차이</h3>
        ${ex}
      </div>
      <div class="about-sec">
        <h3 class="about-h">제주어가 어려워진 3가지 원인</h3>
        ${why}
      </div>
      <div class="about-note">
        제주어는 단순한 사투리가 아니라 제주의 땅, 사람들의 삶, 그리고 몽골과 조선시대의
        역사까지 고스란히 담겨 있는 사라져가는 소중한 문화유산입니다.
      </div>`;
  }

  const RENDER = {
    dict: renderDict,
    history: renderHistory,
    favs: renderFavs,
    phrases: renderPhrases,
    about: renderAbout,
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

  document.querySelectorAll(".chrome-btn, .rail-btn, .pony-cta").forEach((btn) =>
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
