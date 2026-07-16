/* ==========================================================================
   배경 & 캐릭터 그리기
   - 노을 하늘 / 해 / 몽글몽글 구름 / 한라산 / 감귤나무 / 현무암 돌담
   - 돌하르방·해녀 캐릭터 SVG
   ========================================================================== */

(function () {
  /* ---------- 캐릭터 ---------- */
  /* 돌하르방 — 이가은님이 직접 디자인한 얼굴을 옮김
     (둥근 모자·큰 눈·넓은 코·발그레한 볼·따뜻한 미소)
     ⚠ 한 페이지에 여러 번 삽입되므로 그래디언트 id가 겹치면
        (특히 랜딩이 display:none 될 때) 채팅 아바타 얼굴색이 깨진다.
        → 삽입할 때마다 고유 id를 붙여 항상 동일하게 렌더되도록 함수로 생성 */
  let dolSeq = 0;
  function makeDol() {
    const u = "d" + (++dolSeq);
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="face_${u}" cx="45%" cy="42%" r="72%">
        <stop offset="0%" stop-color="#b9b4aa"/>
        <stop offset="68%" stop-color="#9d988e"/>
        <stop offset="100%" stop-color="#807b71"/>
      </radialGradient>
      <linearGradient id="hat_${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#948f85"/>
        <stop offset="100%" stop-color="#726d64"/>
      </linearGradient>
    </defs>
    <!-- 배경 (원형 프레임에 맞춘 은은한 하늘빛) -->
    <circle cx="50" cy="50" r="50" fill="#e9eef2"/>
    <!-- 귀 -->
    <ellipse cx="20" cy="61" rx="6.5" ry="10" fill="#918c82" stroke="#6f6a61" stroke-width="1"/>
    <ellipse cx="80" cy="61" rx="6.5" ry="10" fill="#918c82" stroke="#6f6a61" stroke-width="1"/>
    <!-- 얼굴 -->
    <path d="M24,52 C24,32 76,32 76,52 L76,63 C76,85 24,85 24,63 Z"
      fill="url(#face_${u})" stroke="#6f6a61" stroke-width="1.1"/>
    <!-- 모자 (둥근 돔) -->
    <path d="M19,45 C19,15 81,15 81,45 C81,51 68,53 50,53 C32,53 19,51 19,45 Z"
      fill="url(#hat_${u})" stroke="#5f5a52" stroke-width="1.1"/>
    <ellipse cx="50" cy="47" rx="30" ry="4.5" fill="#5f5a52" opacity="0.28"/>
    <!-- 눈 -->
    <circle cx="38" cy="59" r="9" fill="#fbf9f4" stroke="#7a746a" stroke-width="0.8"/>
    <circle cx="62" cy="59" r="9" fill="#fbf9f4" stroke="#7a746a" stroke-width="0.8"/>
    <circle cx="39" cy="60" r="4.4" fill="#2b2b2b"/>
    <circle cx="61" cy="60" r="4.4" fill="#2b2b2b"/>
    <circle cx="40.6" cy="58.4" r="1.4" fill="#ffffff"/>
    <circle cx="62.6" cy="58.4" r="1.4" fill="#ffffff"/>
    <!-- 발그레한 볼 -->
    <circle cx="29" cy="69" r="4.6" fill="#e79a83" opacity="0.55"/>
    <circle cx="71" cy="69" r="4.6" fill="#e79a83" opacity="0.55"/>
    <!-- 코 -->
    <ellipse cx="50" cy="69" rx="6" ry="7" fill="#8b867c" stroke="#736e65" stroke-width="0.8"/>
    <ellipse cx="48" cy="66.5" rx="2" ry="1.4" fill="#a49f95" opacity="0.5"/>
    <!-- 미소 -->
    <path d="M40,75 Q50,82 60,75" stroke="#5c574e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <!-- 현무암 기공 -->
    <circle cx="31" cy="51" r="1" fill="#7a746a" opacity="0.55"/>
    <circle cx="69" cy="51" r="1" fill="#7a746a" opacity="0.55"/>
    <circle cx="50" cy="79" r="0.9" fill="#7a746a" opacity="0.5"/>
  </svg>`;
  }

  const HAENYEO = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#bfe3ea"/>
    <path d="M20,40 C20,17 80,17 80,40 L80,53 C80,59 20,59 20,53 Z" fill="#1f4f63"/>
    <circle cx="50" cy="56" r="24" fill="#f0c9a0"/>
    <rect x="26" y="46" width="48" height="16" rx="8" fill="#2b6b82" opacity=".35"/>
    <circle cx="40" cy="54" r="7" fill="#bfe9f5" stroke="#1f4f63" stroke-width="2"/>
    <circle cx="60" cy="54" r="7" fill="#bfe9f5" stroke="#1f4f63" stroke-width="2"/>
    <line x1="47" y1="54" x2="53" y2="54" stroke="#1f4f63" stroke-width="2"/>
    <circle cx="40" cy="54" r="2.4" fill="#333"/><circle cx="60" cy="54" r="2.4" fill="#333"/>
    <circle cx="34" cy="64" r="4" fill="#f2a88f" opacity=".6"/>
    <circle cx="66" cy="64" r="4" fill="#f2a88f" opacity=".6"/>
    <path d="M43,68 Q50,73 57,68" stroke="#a86a4a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  </svg>`;

  /* ---------- 몽글몽글 구름 ----------
     여러 겹의 둥근 덩어리 + 가우시안 블러로 폭신한 느낌.
     노을빛을 받아 윗면은 희고 아랫면은 분홍빛이 돈다. */
  let cloudSeq = 0;
  function cloud() {
    const u = "c" + (++cloudSeq);
    return `<svg viewBox="0 0 260 116" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg_${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fffdfb"/>
          <stop offset="45%" stop-color="#ffeee7"/>
          <stop offset="78%" stop-color="#f8d2cd"/>
          <stop offset="100%" stop-color="#e8b0b6"/>
        </linearGradient>
        <filter id="cf_${u}" x="-25%" y="-40%" width="150%" height="195%">
          <feGaussianBlur stdDeviation="3.4"/>
        </filter>
      </defs>
      <g filter="url(#cf_${u})" fill="url(#cg_${u})">
        <ellipse cx="130" cy="80" rx="88" ry="19"/>
        <circle cx="70" cy="68" r="24"/>
        <circle cx="96" cy="74" r="28"/>
        <circle cx="104" cy="50" r="30"/>
        <circle cx="140" cy="42" r="26"/>
        <circle cx="132" cy="70" r="30"/>
        <circle cx="168" cy="60" r="26"/>
        <circle cx="188" cy="72" r="20"/>
        <circle cx="120" cy="34" r="19"/>
      </g>
    </svg>`;
  }

  /* ---------- 한라산 ----------
     겹겹의 능선 + 대기 원근(멀수록 옅고 푸르게) + 오른쪽 해 방향 사면에 노을빛 */
  function hallasan() {
    return `<svg viewBox="0 0 1000 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mtFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8a7aa8"/>
          <stop offset="100%" stop-color="#66608c"/>
        </linearGradient>
        <linearGradient id="mtNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#544e7c"/>
          <stop offset="60%" stop-color="#443f68"/>
          <stop offset="100%" stop-color="#332f52"/>
        </linearGradient>
        <linearGradient id="mtLit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ff9d6b" stop-opacity="0"/>
          <stop offset="58%" stop-color="#ff9d6b" stop-opacity="0"/>
          <stop offset="100%" stop-color="#ffab72" stop-opacity=".5"/>
        </linearGradient>
        <linearGradient id="mtHaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffc79a" stop-opacity="0"/>
          <stop offset="100%" stop-color="#ffd0a4" stop-opacity=".35"/>
        </linearGradient>
      </defs>

      <!-- 먼 능선 (옅게) -->
      <path d="M0,320 L0,214 C140,190 250,158 370,126 C445,106 470,74 520,62
        C572,76 598,110 690,136 C805,164 880,192 1000,212 L1000,320 Z"
        fill="url(#mtFar)" opacity=".45"/>

      <!-- 본체 -->
      <path d="M0,320 L0,250 C165,220 285,182 400,148 C468,126 494,90 520,78
        C548,90 570,126 640,150 C762,190 852,224 1000,248 L1000,320 Z"
        fill="url(#mtNear)"/>
      <!-- 해가 비치는 오른쪽 사면 -->
      <path d="M0,320 L0,250 C165,220 285,182 400,148 C468,126 494,90 520,78
        C548,90 570,126 640,150 C762,190 852,224 1000,248 L1000,320 Z"
        fill="url(#mtLit)"/>

      <!-- 백록담 언저리 잔설 -->
      <path d="M497,110 C506,95 515,84 520,79 C525,84 534,95 543,110
        C534,105 527,103 520,103 C513,103 506,105 497,110 Z"
        fill="#f6eef4" opacity=".55"/>
      <!-- 능선 하이라이트 -->
      <path d="M520,78 C548,90 570,126 640,150" stroke="#ffb98a" stroke-width="1.6"
        fill="none" opacity=".45"/>

      <!-- 산자락 대기 안개 -->
      <rect x="0" y="230" width="1000" height="90" fill="url(#mtHaze)"/>
    </svg>`;
  }

  /* ---------- 감귤 한 알 ---------- */
  function tangerine(cx, cy, r, id) {
    const dimplePos = [[-.3,-.12],[.12,-.34],[.36,.04],[-.16,.3],[.22,.34],[-.4,.16],[.05,.08],[.3,-.18]];
    const dimples = dimplePos
      .map(([dx, dy]) => `<circle cx="${(cx+dx*r).toFixed(1)}" cy="${(cy+dy*r).toFixed(1)}" r="${(r*0.045).toFixed(2)}" fill="#c9620a" opacity="0.32"/>`)
      .join("");
    return `
      <radialGradient id="tg${id}" cx="35%" cy="27%" r="80%">
        <stop offset="0%" stop-color="#ffe9a8"/>
        <stop offset="34%" stop-color="#ffb84e"/>
        <stop offset="72%" stop-color="#f5850f"/>
        <stop offset="100%" stop-color="#cd5a06"/>
      </radialGradient>
      <ellipse cx="${cx}" cy="${(cy+r*0.5).toFixed(1)}" rx="${(r*0.92).toFixed(1)}" ry="${(r*0.7).toFixed(1)}" fill="#7d3703" opacity="0.22"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#tg${id})"/>
      ${dimples}
      <ellipse cx="${(cx-r*0.34).toFixed(1)}" cy="${(cy-r*0.4).toFixed(1)}" rx="${(r*0.36).toFixed(1)}" ry="${(r*0.21).toFixed(1)}" fill="#fff8dd" opacity="0.6"/>
      <circle cx="${cx}" cy="${(cy+r*0.85).toFixed(1)}" r="${(r*0.085).toFixed(1)}" fill="#a04b05" opacity=".75"/>
      <path d="M${cx} ${(cy-r*0.98).toFixed(1)} q ${(r*0.5).toFixed(1)} ${(-r*0.14).toFixed(1)} ${(r*0.7).toFixed(1)} ${(r*0.14).toFixed(1)} q ${(-r*0.44).toFixed(1)} ${(r*0.18).toFixed(1)} ${(-r*0.7).toFixed(1)} ${(-r*0.14).toFixed(1)} z" fill="#3f7a33"/>`;
  }

  /* ---------- 감귤나무 ---------- */
  function tangerineTree(prefix) {
    const fruit = [
      [40, 52, 7.5], [76, 46, 7.5], [58, 72, 8], [28, 66, 7],
      [92, 66, 7.5], [50, 90, 6.5], [80, 88, 6.5], [64, 32, 6.5], [104, 52, 6],
    ];
    let fruits = "";
    fruit.forEach((f, i) => (fruits += tangerine(f[0], f[1], f[2], prefix + i)));
    return `<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lf${prefix}" cx="36%" cy="26%" r="82%">
          <stop offset="0%" stop-color="#84c163"/>
          <stop offset="50%" stop-color="#539442"/>
          <stop offset="100%" stop-color="#2e6829"/>
        </radialGradient>
        <linearGradient id="tk${prefix}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#9b6a3d"/>
          <stop offset="42%" stop-color="#6b4423"/>
          <stop offset="100%" stop-color="#492c14"/>
        </linearGradient>
      </defs>

      <!-- 줄기 · 가지 -->
      <path d="M55,153 L57,98 L63,98 L65,153 Z" fill="url(#tk${prefix})"/>
      <path d="M59,110 q-13,-7 -19,-16" stroke="#6b4423" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M61,104 q13,-7 20,-15" stroke="#6b4423" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <!-- 뒤쪽 짙은 잎 -->
      <circle cx="60" cy="58" r="50" fill="#2c6427"/>
      <!-- 잎 덩어리 -->
      <circle cx="32" cy="70" r="30" fill="url(#lf${prefix})"/>
      <circle cx="88" cy="68" r="30" fill="url(#lf${prefix})"/>
      <circle cx="60" cy="42" r="32" fill="url(#lf${prefix})"/>
      <circle cx="60" cy="74" r="30" fill="url(#lf${prefix})"/>
      <circle cx="38" cy="40" r="21" fill="url(#lf${prefix})"/>
      <circle cx="84" cy="38" r="21" fill="url(#lf${prefix})"/>
      <!-- 윗면 햇빛 -->
      <ellipse cx="58" cy="24" rx="26" ry="10" fill="#a8d47f" opacity=".28"/>
      ${fruits}
    </svg>`;
  }

  /* ---------- 현무암 돌담 ----------
     불규칙한 검회색 돌을 쌓고, 윗면엔 노을빛 림라이트 + 잡풀 */
  function basaltWall() {
    const W = 1600, H = 240, rows = 5;
    const grays = ["#4a4a52", "#3e3e46", "#55555e", "#33333a", "#4f4f58", "#5e5e68", "#2e2e35", "#514a44"];
    let seed = 20;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

    function stone(cx, cy, w, h, col) {
      const n = 8;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const rr = 0.5 * (0.8 + rnd() * 0.34);
        pts.push([(cx + Math.cos(a) * w * rr).toFixed(1), (cy + Math.sin(a) * h * rr).toFixed(1)]);
      }
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ") + " Z";
      let pores = "";
      for (let k = 0; k < 6; k++) {
        pores += `<circle cx="${(cx + (rnd() - 0.5) * w * 0.55).toFixed(1)}" cy="${(cy + (rnd() - 0.5) * h * 0.55).toFixed(1)}" r="${(0.7 + rnd() * 2).toFixed(1)}" fill="#16161a" opacity="0.28"/>`;
      }
      return `<path d="${d}" fill="${col}" stroke="#23232a" stroke-width="1.2"/>
        <path d="${d}" fill="none" stroke="#ffd0a0" stroke-width="1.1" opacity="0.13" transform="translate(-1,-1.6)"/>${pores}`;
    }

    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffb877" stop-opacity=".16"/>
          <stop offset="32%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity=".42"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${W}" height="${H}" fill="#232329"/>`;
    const rowH = H / rows;
    for (let r = 0; r < rows; r++) {
      const y0 = r * rowH + rowH / 2;
      let x = -20 + rnd() * 30;
      while (x < W + 20) {
        const w = 44 + rnd() * 60;
        const h = rowH * (1.0 + rnd() * 0.45);
        const col = grays[Math.floor(rnd() * grays.length)];
        s += stone(x + w / 2, y0 + (rnd() - 0.5) * rowH * 0.3, w, h, col);
        x += w * 0.9;
      }
    }
    // 돌담 위 잡풀
    for (let x = 0; x < W; x += 12 + rnd() * 24) {
      const gh = 5 + rnd() * 9;
      const lean = (rnd() - 0.5) * 9;
      s += `<path d="M${x.toFixed(1)},16 q${(lean / 2).toFixed(1)},${(-gh / 2).toFixed(1)} ${lean.toFixed(1)},${(-gh).toFixed(1)}"
        stroke="#46512f" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>`;
    }
    // 전체 명암 (윗면 노을빛 · 아래로 갈수록 어둡게)
    s += `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#wallShade)"/>`;
    s += `</svg>`;
    return s;
  }

  /* ---------- 전체 배경 ---------- */
  function renderScene() {
    const el = document.getElementById("scene");
    el.innerHTML = `
      <div class="sun"></div>
      <div class="cloud c1">${cloud()}</div>
      <div class="cloud c2">${cloud()}</div>
      <div class="cloud c3">${cloud()}</div>
      <div class="cloud c4">${cloud()}</div>

      <div class="hallasan">${hallasan()}</div>

      <div class="tree left">${tangerineTree("L")}</div>
      <div class="tree right">${tangerineTree("R")}</div>

      <div class="wall">${basaltWall()}</div>
    `;
  }

  // DOL은 호출할 때마다 고유 id를 가진 새 SVG를 반환하는 함수
  window.JejuScene = { renderScene, DOL: makeDol, HAENYEO };
})();
