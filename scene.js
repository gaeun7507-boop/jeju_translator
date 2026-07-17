/* ==========================================================================
   배경 & 캐릭터 그리기 — 유화 느낌
   - 노을 하늘만 그라데이션을 남기고, 한라산·나무·감귤·해·구름은
     매끈한 그라데이션 대신 '색면을 겹치고 붓질을 얹는' 방식으로 칠한다.
   - 유화처럼 보이게 하는 네 가지:
       1) 명암을 3~4단계 색면으로 뚝뚝 끊는다 (부드럽게 섞지 않음)
       2) 붓질이 형태를 따라 간다 (능선 사면은 세로로 내려긋기)
       3) 초록 안에 황토빛을 섞는다 (broken color)
       4) 윤곽을 feTurbulence로 흔들어 벡터 티를 없앤다
   - 색은 전부 style.css의 시간대 테마 변수를 따른다.
   ========================================================================== */

(function () {
  /* ---------- 시드 난수 ----------
     매번 같은 그림이 나오도록 (새로고침마다 산 모양이 바뀌면 곤란) */
  function rng(seed) {
    let s = seed;
    return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  }

  /* ---------- 붓 자국 필터 ----------
     노이즈로 도형 윤곽을 밀어서 붓끝처럼 너덜너덜하게 만든다.
     scale은 그 SVG의 viewBox 단위라 요소마다 값을 따로 준다. */
  function brushFilter(id, scale, freq, seed) {
    return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3"
        seed="${seed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}"
        xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
  }

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

  /* ---------- 해 ----------
     그라데이션 원 대신, 색면 두 겹을 붓 필터로 흔든 납작한 원.
     빛 번짐(bloom)은 CSS의 --sun-glow(box-shadow)가 맡는다. */
  function sunDisc() {
    // 원반이 div를 꽉 채워야 한다. 작게 그리면 div 테두리에서 시작하는
    // box-shadow 글로우와 원반 사이에 빈 고리가 생겨 회색 링처럼 보인다.
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>${brushFilter("sunB", 2.6, "0.11", 5)}</defs>
      <g filter="url(#sunB)">
        <circle cx="50" cy="50" r="47" fill="var(--sun-rim)"/>
        <circle cx="48.5" cy="48.5" r="41" fill="var(--sun-fill)"/>
      </g>
    </svg>`;
  }

  /* ---------- 구름 ----------
     둥근 덩어리를 4단계 색면(--cloud-1..4)으로 위→아래 쌓고
     붓 필터로 가장자리를 흔든다. 가우시안 블러는 아주 약하게만.
     (블러를 세게 주면 유화가 아니라 에어브러시가 된다) */
  let cloudSeq = 0;
  function cloud() {
    const u = "c" + (++cloudSeq);
    const r = rng(31 + cloudSeq * 17);
    // 층마다 덩어리를 조금씩 위로 올리며 밝은 색을 얹는다
    const layers = [
      { col: "var(--cloud-4)", dy: 10, s: 1.0 },
      { col: "var(--cloud-3)", dy: 2, s: 0.93 },
      { col: "var(--cloud-2)", dy: -6, s: 0.8 },
      { col: "var(--cloud-1)", dy: -13, s: 0.6 },
    ];
    const lumps = [
      [70, 68, 24], [96, 74, 28], [104, 50, 30], [140, 42, 26],
      [132, 70, 30], [168, 60, 26], [188, 72, 20], [120, 34, 19],
    ];
    let body = "";
    layers.forEach((L, li) => {
      let g = `<ellipse cx="130" cy="${(80 + L.dy).toFixed(0)}" rx="${(88 * L.s).toFixed(0)}" ry="${(19 * L.s).toFixed(0)}"/>`;
      lumps.forEach(([cx, cy, rad]) => {
        const jx = (r() - 0.5) * 5, jy = (r() - 0.5) * 4;
        g += `<circle cx="${(cx + jx).toFixed(1)}" cy="${(cy + L.dy + jy).toFixed(1)}" r="${(rad * L.s).toFixed(1)}"/>`;
      });
      body += `<g fill="${L.col}" filter="url(#cb_${u}_${li})">${g}</g>`;
    });
    return `<svg viewBox="0 0 260 116" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${layers.map((_, li) => brushFilter(`cb_${u}_${li}`, 7, "0.05 0.08", 3 + li * 4 + cloudSeq)).join("")}
      </defs>
      ${body}
    </svg>`;
  }

  /* ---------- 한라산 ----------
     ① 먼 능선: 대기 원근으로 옅게 (색면 2단)
     ② 본체: 그늘면(--mt-near-3) / 중간면(--mt-near-2) / 빛면(--mt-near-1) 3단 색면
     ③ 해가 닿는 오른쪽 사면에 --mt-lit 붓질을 사면 방향으로 내려긋기
     ④ 초록/보라 안에 황토빛(--mt-warm)을 군데군데 섞어 broken color
     ⑤ 백록담 잔설은 흰 물감을 툭툭 얹은 느낌 */
  function hallasan() {
    const r = rng(42);
    // 봉우리 x — 가운데 카드에 가리지 않도록 오른쪽(≈76%)에 둔다
    const PEAK = 760;
    const SIL = `M0,320 L0,272 C140,256 300,232 470,202 C600,178 690,120 760,88
      C800,108 826,140 868,164 C920,192 962,214 1000,228 L1000,320 Z`;
    const FAR = `M0,320 L0,248 C130,234 290,208 450,178 C580,154 672,96 740,72
      C784,92 812,124 856,146 C912,174 960,196 1000,208 L1000,320 Z`;

    /* 능선의 대략적인 높이 — 붓질 시작점을 능선에 붙이기 위한 근사 */
    function ridgeY(x) {
      return x < PEAK
        ? 88 + Math.pow((PEAK - x) / PEAK, 1.25) * 184
        : 88 + Math.pow((x - PEAK) / (1000 - PEAK), 1.1) * 140;
    }

    /* 사면을 따라 내려긋는 붓질 한 무더기 (x0~x1 구간)
       depth = 붓질 시작점이 능선에서 얼마나 아래까지 내려갈 수 있는지 (0~1).
       작게 주면 능선 근처에만 몰려서 사면 아래가 텅 빈 색면으로 남는다. */
    function slope(n, x0, x1, col, opLo, opHi, wLo, wHi, lenLo, lenHi, lean, depth) {
      let s = "";
      for (let i = 0; i < n; i++) {
        const x = x0 + r() * (x1 - x0);
        const ry = ridgeY(x);
        const top = ry + r() * (320 - ry) * (depth === undefined ? 0.12 : depth);
        const len = lenLo + r() * (lenHi - lenLo);
        const w = wLo + r() * (wHi - wLo);
        const lx = (x < PEAK ? -1 : 1) * (lean * (0.4 + r()));
        s += `<path d="M${x.toFixed(0)},${top.toFixed(0)} q${(lx * 0.4).toFixed(1)},${(len * 0.5).toFixed(0)} ${lx.toFixed(1)},${len.toFixed(0)}"
          stroke="${col}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" fill="none"
          opacity="${(opLo + r() * (opHi - opLo)).toFixed(2)}"/>`;
      }
      return s;
    }

    /* 산자락 안개 — 사각형으로 덮으면 창백한 판때기가 된다.
       화가가 안개를 칠하듯 가로로 길게 끊어친 붓자국을 흩뿌린다. */
    function mist() {
      let s = "";
      for (let i = 0; i < 26; i++) {
        const y = 240 + r() * 76;
        const x = -60 + r() * 1060;
        const len = 160 + r() * 460;
        const w = 14 + r() * 40;
        // 아래로 갈수록 짙게
        const op = (0.06 + ((y - 240) / 76) * 0.2) * (0.5 + r() * 0.5);
        s += `<path d="M${x.toFixed(0)},${y.toFixed(0)} h${len.toFixed(0)}"
          stroke="var(--haze)" stroke-width="${w.toFixed(1)}" stroke-linecap="round"
          opacity="${op.toFixed(2)}"/>`;
      }
      return s;
    }

    return `<svg viewBox="0 0 1000 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${brushFilter("mtB", 14, "0.014 0.035", 11)}
        ${brushFilter("mtBs", 9, "0.025 0.06", 23)}
        ${brushFilter("mtBh", 16, "0.03 0.06", 31)}
        <clipPath id="mtClip"><path d="${SIL}"/></clipPath>
        <clipPath id="mtClipFar"><path d="${FAR}"/></clipPath>
      </defs>

      <!-- ① 먼 능선 — 대기에 씻겨 옅게, 색면 2단 -->
      <g filter="url(#mtB)">
        <path d="${FAR}" fill="var(--mt-far-2)" opacity=".7"/>
      </g>
      <g clip-path="url(#mtClipFar)" filter="url(#mtBs)" opacity=".55">
        <path d="M740,72 L1000,208 L1000,136 L774,78 Z" fill="var(--mt-far-1)"/>
      </g>

      <!-- ② 본체 — 중간면 -->
      <g filter="url(#mtB)">
        <path d="${SIL}" fill="var(--mt-near-2)"/>
      </g>

      <g clip-path="url(#mtClip)">
        <!-- 왼쪽 그늘면 / 오른쪽 빛면 — 부드럽게 섞지 않고 색면으로 뚝 끊는다.
             단, 경계는 봉우리에서 앞으로 뻗어내린 능선을 따라 비스듬히 간다.
             수직으로 자르면 산에 칼자국이 난 것처럼 보인다. -->
        <g filter="url(#mtBs)">
          <path d="M0,320 L0,272 C140,256 300,232 470,202 C600,178 690,120 760,88
            C738,156 682,232 636,320 Z"
            fill="var(--mt-near-3)" opacity=".88"/>
          <path d="M760,88 C800,108 826,140 868,164 C920,192 962,214 1000,228
            L1000,320 L636,320 C682,232 738,156 760,88 Z"
            fill="var(--mt-near-1)" opacity=".72"/>
        </g>

        <!-- ③ 해 방향(오른쪽) 사면 붓질 — 굵게 한 겹, 가늘게 한 겹.
             그늘/빛 경계를 일부러 넘나들게 해서 색면 이음매를 붓질로 덮는다. -->
        <g filter="url(#mtBs)">
          <!-- 능선 바로 아래 (진하게, 굵게) -->
          ${slope(26, 700, 1000, "var(--mt-lit)", 0.24, 0.62, 20, 48, 30, 86, 14, 0.12)}
          ${slope(22, 740, 995, "var(--mt-lit)", 0.26, 0.66, 7, 18, 18, 48, 9, 0.1)}
          <!-- 사면 전체 — 아래쪽이 빈 색면으로 남지 않게 -->
          ${slope(34, 650, 1000, "var(--mt-lit)", 0.1, 0.34, 16, 52, 34, 100, 16, 0.75)}
          <!-- 봉우리 왼쪽에도 빛이 조금 걸친다 -->
          ${slope(16, 500, 756, "var(--mt-lit)", 0.1, 0.34, 14, 34, 20, 54, 11, 0.3)}
        </g>

        <!-- ④ broken color — 초록/보라 사이에 황토빛을 섞는다 -->
        <g filter="url(#mtBs)">
          ${slope(18, 640, 990, "var(--mt-warm)", 0.2, 0.48, 10, 28, 24, 64, 12, 0.2)}
          ${slope(14, 680, 995, "var(--mt-warm)", 0.1, 0.3, 14, 40, 28, 80, 15, 0.7)}
          ${slope(14, 80, 640, "var(--mt-warm)", 0.1, 0.26, 9, 22, 18, 48, 10, 0.45)}
        </g>

        <!-- 그늘 쪽에도 결을 넣어 평평해 보이지 않게 -->
        <g filter="url(#mtBs)">
          ${slope(28, 30, 740, "var(--mt-near-3)", 0.22, 0.54, 14, 40, 28, 84, 11, 0.7)}
          ${slope(20, 120, 720, "var(--mt-near-1)", 0.12, 0.3, 10, 30, 20, 58, 9, 0.6)}
          ${slope(16, 200, 680, "var(--mt-near-2)", 0.16, 0.38, 10, 32, 22, 62, 10, 0.8)}
        </g>
      </g>

      <!-- ⑤ 백록담 잔설 — 흰 물감을 툭툭 -->
      <g filter="url(#mtBs)">
        <path d="M739,118 C748,102 756,90 760,84 C765,90 773,102 781,119
          C773,113 767,111 760,111 C753,111 747,113 739,118 Z"
          fill="var(--snow-cap)" opacity=".72"/>
        <ellipse cx="752" cy="106" rx="7" ry="3" fill="var(--snow-cap)" opacity=".5"/>
        <ellipse cx="770" cy="113" rx="5" ry="2.4" fill="var(--snow-cap)" opacity=".42"/>
      </g>

      <!-- 능선 하이라이트 — 한 획 -->
      <path d="M760,88 C800,108 826,140 868,164" stroke="var(--mt-lit)" stroke-width="2.6"
        fill="none" opacity=".5" filter="url(#mtBs)" stroke-linecap="round"/>

      <!-- ⑥ 산자락 대기 안개 — 가로로 끊어친 붓자국 (everswap의 공기감) -->
      <g filter="url(#mtBh)" opacity="var(--haze-strength)">${mist()}</g>
    </svg>`;
  }

  /* ---------- 감귤 한 알 ----------
     그라데이션 대신: 그늘색 원 + 본색 원 + 빛 받는 쪽(오른쪽 위) 물감 한 점 */
  function tangerine(cx, cy, r0) {
    return `
      <circle cx="${(cx - r0 * 0.08).toFixed(1)}" cy="${(cy + r0 * 0.14).toFixed(1)}" r="${r0}"
        fill="var(--fruit-dark)"/>
      <circle cx="${cx}" cy="${cy}" r="${(r0 * 0.9).toFixed(1)}" fill="var(--fruit)"/>
      <path d="M${(cx - r0 * 0.1).toFixed(1)},${(cy - r0 * 0.62).toFixed(1)}
        q${(r0 * 0.62).toFixed(1)},${(-r0 * 0.1).toFixed(1)} ${(r0 * 0.74).toFixed(1)},${(r0 * 0.42).toFixed(1)}
        q${(-r0 * 0.5).toFixed(1)},${(-r0 * 0.16).toFixed(1)} ${(-r0 * 0.74).toFixed(1)},${(-r0 * 0.42).toFixed(1)} z"
        fill="var(--fruit-lit)" opacity=".9"/>`;
  }

  /* ---------- 감귤나무 ----------
     막대사탕처럼 보이지 않게:
       - 밑동이 벌어지고 위로 갈수록 가늘어지는 줄기 + 갈라지는 가지
       - 잎을 하나의 둥근 덩어리로 두지 않고 5~7개 덩어리로 나눠 실루엣을 깬다
       - 덩어리마다 아래는 어둡게 위는 밝게 (빛은 오른쪽 해에서)
       - 잎은 원이 아니라 짧고 굵은 붓자국으로 두드린다 */
  function tangerineTree(prefix) {
    const r = rng(prefix === "L" ? 77 : 91);

    /* 잎 붓자국 하나 — 짧고 굵은 획 */
    function dab(x, y, len, w, ang, col, op) {
      const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
      return `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${dx.toFixed(1)},${dy.toFixed(1)}"
        stroke="${col}" stroke-width="${w.toFixed(1)}" stroke-linecap="round"
        opacity="${op.toFixed(2)}"/>`;
    }

    /* 잎 덩어리 — 붓자국을 뭉텅뭉텅 */
    function clump(cx, cy, rad, n, col, opLo, opHi, wScale) {
      let s = "";
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * rad * 0.86;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d * 0.86;
        // 잎은 대체로 바깥·아래로 뻗는다
        const ang = Math.atan2(y - cy, x - cx) + (r() - 0.5) * 1.1;
        s += dab(x, y, rad * (0.16 + r() * 0.22), rad * wScale * (0.18 + r() * 0.16),
          ang, col, opLo + r() * (opHi - opLo));
      }
      return s;
    }

    // 잎 덩어리들 — 좌우 비대칭으로 흩어 실루엣을 깬다
    const canopy = prefix === "L"
      ? [[100, 96, 54], [56, 112, 36], [146, 104, 36], [74, 58, 32], [130, 54, 30],
         [102, 148, 32], [36, 84, 22], [166, 82, 22]]
      : [[100, 100, 50], [58, 108, 34], [144, 110, 32], [78, 62, 30], [134, 62, 28],
         [98, 146, 28], [40, 86, 20], [162, 90, 20]];

    // 붓자국만 뿌리면 잎이 숭숭 비쳐 앙상해진다.
    // 먼저 어두운 덩어리로 실루엣을 꽉 채우고, 그 위에 붓자국을 얹는다.
    let sil = "", dark = "", mid = "", lit = "", warm = "";
    canopy.forEach(([cx, cy, rad]) => {
      sil += `<ellipse cx="${cx}" cy="${cy}" rx="${rad}" ry="${(rad * 0.9).toFixed(1)}"
        fill="var(--leaf-dark)"/>`;
      dark += clump(cx, cy + rad * 0.2, rad, 20, "var(--leaf-dark)", 0.8, 1, 1.2);
      mid += clump(cx, cy - rad * 0.04, rad * 0.94, 24, "var(--leaf)", 0.7, 1, 1.15);
      // 빛은 오른쪽 위에서
      lit += clump(cx + rad * 0.24, cy - rad * 0.32, rad * 0.64, 16, "var(--leaf-lit)", 0.45, 0.9, 1);
    });
    // broken color — 잎 사이에 황토빛
    warm += clump(120, 46, 24, 6, "var(--mt-warm)", 0.16, 0.34, 0.8);
    warm += clump(150, 96, 18, 4, "var(--mt-warm)", 0.12, 0.26, 0.8);

    // 감귤 — 잎 덩어리 사이사이에 박히도록
    const fruit = prefix === "L"
      ? [[70, 92, 9], [128, 84, 9], [98, 122, 9.5], [48, 118, 8], [152, 118, 8.5],
         [86, 56, 8], [140, 138, 8], [110, 158, 7.5], [40, 88, 7], [166, 74, 7]]
      : [[74, 96, 8.5], [132, 92, 8.5], [100, 128, 9], [54, 122, 7.5], [148, 126, 8],
         [90, 62, 7.5], [122, 150, 7.5], [44, 92, 6.5]];
    let fruits = "";
    fruit.forEach((f) => (fruits += tangerine(f[0], f[1], f[2])));

    return `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${brushFilter("tb" + prefix, 3.4, "0.09", prefix === "L" ? 9 : 19)}
        ${brushFilter("tf" + prefix, 1.4, "0.16", prefix === "L" ? 29 : 39)}
        ${brushFilter("tk" + prefix, 2.2, "0.07", prefix === "L" ? 49 : 59)}
      </defs>

      <!-- 줄기 — 밑동이 벌어지고 위로 갈수록 가늘어진다 -->
      <g filter="url(#tk${prefix})">
        <path d="M78,258 C82,214 88,182 90,140 L112,140 C114,184 120,216 124,258 Z"
          fill="var(--trunk-dark)"/>
        <!-- 오른쪽(해 방향) 밝은 면 -->
        <path d="M104,258 C104,214 108,182 110,140 L112,140 C114,184 120,216 124,258 Z"
          fill="var(--trunk)"/>
        <!-- 갈라지는 가지 -->
        <path d="M96,150 C84,132 66,116 48,104" stroke="var(--trunk-dark)"
          stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M106,148 C118,128 138,112 158,100" stroke="var(--trunk-dark)"
          stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M100,146 C98,120 100,96 102,74" stroke="var(--trunk-dark)"
          stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M108,146 C120,124 132,110 142,96" stroke="var(--trunk)"
          stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
      </g>

      <!-- 잎: 덩어리로 실루엣을 채우고 → 어둡게 → 중간 → 빛, 세 번 두드린다 -->
      <g filter="url(#tb${prefix})">
        ${sil}${dark}${mid}${lit}${warm}
      </g>

      <!-- 감귤 -->
      <g filter="url(#tf${prefix})">${fruits}</g>
    </svg>`;
  }

 /* ---------- 현무암 돌담 ---------- */
  function basaltWall() {
    const W = 1600, H = 240;
    const rows = 4;  // 수정: 돌담 줄 수를 5에서 4로 한 줄 줄임
    const rowH = 48; // 수정: 돌의 크기가 커지지 않도록 고정 (기존 240/5 = 48)
    
    const rnd = rng(20);
    const tones = ["var(--stone-a)", "var(--stone-b)", "var(--stone-c)",
      "var(--stone-b)", "var(--stone-a)", "var(--stone-c)"];

    /* 현무암 윤곽 */
    function shape(cx, cy, w, h, rot) {
      const n = 7 + Math.floor(rnd() * 4);
      const pts = [];
      let a = rot;
      for (let i = 0; i < n; i++) {
        a += (Math.PI * 2 / n) * (0.55 + rnd() * 0.9);
        const rr = 0.5 * (0.62 + rnd() * 0.56);
        pts.push([cx + Math.cos(a) * w * rr, cy + Math.sin(a) * h * rr]);
      }
      return pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + " Z";
    }

    let seq = 0;
    function stone(cx, cy, w, h, tone) {
      const id = "sc" + (++seq);
      const d = shape(cx, cy, w, h, rnd() * Math.PI * 2);
      const bevel = Math.max(3.5, h * 0.32);
      let pores = "";
      for (let k = 0; k < 7; k++) {
        const px = cx + (rnd() - 0.5) * w * 0.5;
        const py = cy + (rnd() - 0.5) * h * 0.5;
        const pr = 0.8 + rnd() * 2.2;
        pores += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${pr.toFixed(1)}"
            fill="var(--stone-dark)" opacity=".75"/>
          <circle cx="${(px + pr * 0.28).toFixed(1)}" cy="${(py + pr * 0.6).toFixed(1)}"
            r="${(pr * 0.42).toFixed(1)}" fill="var(--stone-lit)" opacity=".3"/>`;
      }
      
      const core = `translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(.84) ` +
        `translate(${(-cx).toFixed(1)},${(-cy).toFixed(1)})`;
      const off = Math.max(2.5, bevel * 0.34);
      return `<clipPath id="${id}"><path d="${d}"/></clipPath>
        <path d="${d}" fill="var(--stone-gap)" opacity=".8" transform="translate(2.5,3.5)"
          stroke="var(--stone-gap)" stroke-width="3" stroke-linejoin="round"/>
        <g clip-path="url(#${id})">
          <path d="${d}" fill="var(--stone-lit)"/>
          <path d="${d}" fill="var(--stone-dark)"
            transform="translate(${(-off).toFixed(1)},${(off * 1.25).toFixed(1)})"/>
          <path d="${d}" fill="${tone}" transform="${core}"/>
          <ellipse cx="${(cx + w * 0.16).toFixed(1)}" cy="${(cy - h * 0.22).toFixed(1)}"
            rx="${(w * 0.13).toFixed(1)}" ry="${(h * 0.085).toFixed(1)}"
            fill="var(--stone-lit)" opacity=".3"/>
          ${pores}
        </g>
        <path d="${d}" fill="none" stroke="var(--stone-dark)" stroke-width="1.4" opacity=".65"
          stroke-linejoin="round"/>`;
    }

    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" overflow="visible" xmlns="http://www.w3.org/2000/svg">
      <defs>${brushFilter("wallB", 3, "0.06", 13)}</defs>
      
      <!-- 배경 사각형을 돌 한 줄 높이(48)만큼 더 아래로 내림 -->
      <rect x="0" y="93" width="${W}" height="${H}" fill="var(--stone-gap)"/>
      <g filter="url(#wallB)">`;
      
    for (let r = rows - 1; r >= 0; r--) {
      // 5줄에서 4줄로 줄어든 만큼, 시작 위치도 한 줄(48) 높이만큼 전체적으로 아래로 내림
      const y0 = r * rowH + rowH / 2 + 25 + 48;
      let x = -20 + rnd() * 30;
      while (x < W + 20) {
        const w = 34 + rnd() * 104;
        const h = rowH * (0.9 + rnd() * 0.72);
        s += stone(x + w / 2, y0 + (rnd() - 0.5) * rowH * 0.36, w, h,
          tones[Math.floor(rnd() * tones.length)]);
        x += w * 0.8;
      }
    }
    s += `</g>`;
    
    // 털처럼 올라온 가닥(잡풀) 코드는 삭제함
    
    s += `</svg>`;
    return s;
  }

  /* ---------- 별 ----------
     밤 테마에서만 보인다(.stars 는 기본 opacity:0).
     해가 있는 오른쪽 위는 비워두고 하늘 상단에만 흩뿌린다. */
  function stars() {
    const r = rng(7);
    let s = "";
    for (let i = 0; i < 90; i++) {
      const x = r() * 100, y = r() * 52;
      const rad = 0.7 + r() * 1.5;
      s += `<span style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;
        width:${rad.toFixed(1)}px;height:${rad.toFixed(1)}px;
        opacity:${(0.35 + r() * 0.65).toFixed(2)};
        animation-delay:${(r() * 4).toFixed(1)}s"></span>`;
    }
    return s;
  }

  /* ---------- 전체 배경 ---------- */
  function renderScene() {
    const el = document.getElementById("scene");
    el.innerHTML = `
      <div class="stars">${stars()}</div>
      <div class="sun">${sunDisc()}</div>
      <div class="cloud c1">${cloud()}</div>
      <div class="cloud c2">${cloud()}</div>
      <div class="cloud c3">${cloud()}</div>
      <div class="cloud c4">${cloud()}</div>
      <!-- 흐린 날에만 보이는 구름 — 맑을 땐 CSS가 opacity 0 으로 숨긴다 -->
      <div class="cloud c5 extra">${cloud()}</div>
      <div class="cloud c6 extra">${cloud()}</div>
      <div class="cloud c7 extra">${cloud()}</div>
      <div class="cloud c8 extra">${cloud()}</div>

      <div class="hallasan">${hallasan()}</div>

      <div class="wall">${basaltWall()}</div>

      <!-- 비·눈 파티클 (sky.js가 그린다) · 날씨 베일 · 캔버스 결 -->
      <canvas class="wx"></canvas>
      <div class="veil"></div>
      <div class="grain"></div>
    `;
  }

  /* ---------- '나' 프로필 (감귤) ----------
     대화창에서 묻는 쪽은 사용자 자신이다. 제주 하면 감귤이니 감귤을 얼굴로 쓴다.
     배경의 감귤나무와 달리 --fruit-* 테마 변수를 쓰지 않고 색을 박아둔다 —
     프로필 사진이 밤이 됐다고 같이 어두워지면 곤란하다. */
  const ME = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#fdf0d8"/>
    <circle cx="51" cy="56" r="33" fill="#b8600f"/>
    <circle cx="50" cy="54" r="30" fill="#e8912f"/>
    <path d="M36,36 q22,-6 30,12 q-18,-8 -30,-12 z" fill="#ffcf72" opacity=".9"/>
    <!-- 꼭지와 잎 -->
    <rect x="47" y="18" width="6" height="10" rx="3" fill="#4a3018"/>
    <path d="M53,22 C64,14 78,16 82,22 C74,32 60,32 53,24 Z" fill="#4f7c42"/>
    <path d="M55,23 C64,19 74,20 79,23" stroke="#93b757" stroke-width="2"
      fill="none" stroke-linecap="round"/>
    <!-- 눈·볼·입 -->
    <circle cx="40" cy="56" r="3.4" fill="#3d2410"/>
    <circle cx="61" cy="56" r="3.4" fill="#3d2410"/>
    <circle cx="33" cy="64" r="4" fill="#f2795a" opacity=".45"/>
    <circle cx="68" cy="64" r="4" fill="#f2795a" opacity=".45"/>
    <path d="M44,66 Q50,71 57,66" stroke="#7a3f12" stroke-width="2.4"
      fill="none" stroke-linecap="round"/>
  </svg>`;

  // DOL은 호출할 때마다 고유 id를 가진 새 SVG를 반환하는 함수
  window.JejuScene = { renderScene, DOL: makeDol, HAENYEO, ME };
})();
