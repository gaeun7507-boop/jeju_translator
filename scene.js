/* ==========================================================================
   배경 & 캐릭터 그리기
   - 노을 하늘 / 해 / 구름 / 한라산 / 감귤나무(디테일) / 현무암 돌담(사진 느낌)
   - 돌하르방·해녀 캐릭터 SVG
   ========================================================================== */

(function () {
  /* ---------- 캐릭터 ---------- */
  const DOL = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="dolStone" cx="45%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#a49e93"/><stop offset="70%" stop-color="#8f8a80"/>
      <stop offset="100%" stop-color="#726d64"/></radialGradient></defs>
    <rect width="100" height="100" fill="#efe7db"/>
    <path d="M22,40 C22,19 78,19 78,40 L83,45 C83,47 17,47 17,45 Z" fill="#615e57"/>
    <path d="M22,40 C22,22 78,22 78,40 C78,42 22,42 22,40 Z" fill="#6f6b63"/>
    <path d="M26,42 C26,79 74,79 74,42 C74,40 26,40 26,42 Z" fill="url(#dolStone)"/>
    <ellipse cx="40" cy="54" rx="8.5" ry="9.5" fill="#e9e4da"/><circle cx="40" cy="55" r="4" fill="#2b2b2b"/>
    <ellipse cx="60" cy="54" rx="8.5" ry="9.5" fill="#e9e4da"/><circle cx="60" cy="55" r="4" fill="#2b2b2b"/>
    <ellipse cx="50" cy="65" rx="7.5" ry="6.5" fill="#7c766c"/>
    <ellipse cx="48" cy="63" rx="2.5" ry="1.6" fill="#96908500"/>
    <path d="M39,73 Q50,80 61,73" stroke="#5c574e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="31" cy="49" r="1.5" fill="#7a746a"/><circle cx="69" cy="49" r="1.5" fill="#7a746a"/>
    <circle cx="46" cy="47" r="1.1" fill="#7a746a"/><circle cx="55" cy="70" r="1" fill="#6f6a60"/>
  </svg>`;

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

  /* ---------- 디테일 감귤 한 알 ---------- */
  function tangerine(cx, cy, r, id) {
    const dimplePos = [[-.3,-.12],[.12,-.34],[.36,.04],[-.16,.3],[.22,.34],[-.4,.16],[.05,.08],[.3,-.18]];
    const dimples = dimplePos
      .map(([dx, dy]) => `<circle cx="${(cx+dx*r).toFixed(1)}" cy="${(cy+dy*r).toFixed(1)}" r="${(r*0.05).toFixed(2)}" fill="#d9700a" opacity="0.45"/>`)
      .join("");
    return `
      <radialGradient id="tg${id}" cx="38%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#ffdd8f"/>
        <stop offset="40%" stop-color="#ffab33"/>
        <stop offset="82%" stop-color="#f4820e"/>
        <stop offset="100%" stop-color="#d5640a"/>
      </radialGradient>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#tg${id})" stroke="#c05c05" stroke-width="0.6"/>
      ${dimples}
      <ellipse cx="${(cx-r*0.32).toFixed(1)}" cy="${(cy-r*0.36).toFixed(1)}" rx="${(r*0.34).toFixed(1)}" ry="${(r*0.2).toFixed(1)}" fill="#fff3cf" opacity="0.6"/>
      <circle cx="${cx}" cy="${(cy+r*0.82).toFixed(1)}" r="${(r*0.1).toFixed(1)}" fill="#b9560a"/>
      <circle cx="${cx}" cy="${(cy+r*0.82).toFixed(1)}" r="${(r*0.05).toFixed(1)}" fill="#8a4106"/>
      <path d="M${cx} ${(cy-r).toFixed(1)} l0 ${(-r*0.16).toFixed(1)}" stroke="#6b4423" stroke-width="${(r*0.12).toFixed(1)}" stroke-linecap="round"/>
      <path d="M${cx} ${(cy-r*1.02).toFixed(1)} q ${(r*0.55).toFixed(1)} ${(-r*0.1).toFixed(1)} ${(r*0.75).toFixed(1)} ${(r*0.2).toFixed(1)} q ${(-r*0.5).toFixed(1)} ${(r*0.14).toFixed(1)} ${(-r*0.75).toFixed(1)} ${(-r*0.2).toFixed(1)} z" fill="#4a7c3f"/>`;
  }

  /* ---------- 감귤나무 ---------- */
  function tangerineTree(prefix) {
    const fruit = [
      [42, 46, 8], [74, 40, 8], [60, 66, 8.5], [30, 62, 8],
      [92, 62, 8], [50, 86, 7], [82, 84, 7], [66, 30, 7],
    ];
    let fruits = "";
    fruit.forEach((f, i) => (fruits += tangerine(f[0], f[1], f[2], prefix + i)));
    return `<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
      <rect x="53" y="86" width="14" height="66" rx="4" fill="#6b4423"/>
      <rect x="53" y="86" width="6" height="66" rx="3" fill="#7d5230"/>
      <circle cx="60" cy="56" r="52" fill="#3f6e36"/>
      <circle cx="30" cy="70" r="32" fill="#4a7c3f"/>
      <circle cx="90" cy="70" r="32" fill="#568a48"/>
      <circle cx="60" cy="40" r="30" fill="#57924a"/>
      ${fruits}
    </svg>`;
  }

  /* ---------- 현무암 돌담 (사진 느낌: 불규칙 검회색 돌 쌓기) ---------- */
  function basaltWall() {
    const W = 1600, H = 240, rows = 5;
    const grays = ["#5b5b62", "#4c4c54", "#66666f", "#43434b", "#57575f", "#6f6f77", "#3e3e46", "#605952"];
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
      for (let k = 0; k < 5; k++) {
        pores += `<circle cx="${(cx + (rnd() - 0.5) * w * 0.55).toFixed(1)}" cy="${(cy + (rnd() - 0.5) * h * 0.55).toFixed(1)}" r="${(0.8 + rnd() * 2.2).toFixed(1)}" fill="#1c1c20" opacity="0.22"/>`;
      }
      return `<path d="${d}" fill="${col}" stroke="#242429" stroke-width="1.6"/>
        <path d="${d}" fill="none" stroke="#ffffff" stroke-width="0.9" opacity="0.07" transform="translate(-1.2,-1.4)"/>${pores}`;
    }

    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${W}" height="${H}" fill="#26262b"/>`;
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
    s += `</svg>`;
    return s;
  }

  /* ---------- 전체 배경 ---------- */
  function renderScene() {
    const el = document.getElementById("scene");
    el.innerHTML = `
      <div class="sun"></div>
      <div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>

      <div class="hallasan">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,300 L0,205 C130,182 230,140 365,108 C435,92 462,60 500,46
            C538,60 565,92 635,108 C770,140 870,182 1000,205 L1000,300 Z"
            fill="#59668a" opacity="0.7"/>
          <path d="M0,300 L0,235 C160,212 265,175 385,142 C452,124 472,92 500,80
            C528,92 548,124 615,142 C735,175 840,212 1000,235 L1000,300 Z"
            fill="#3f4a6b" opacity="0.85"/>
          <path d="M438,106 C460,80 480,62 500,54 C520,62 540,80 562,106
            C540,98 520,96 500,96 C480,96 460,98 438,106 Z" fill="#ffffff" opacity="0.72"/>
        </svg>
      </div>

      <div class="tree left">${tangerineTree("L")}</div>
      <div class="tree right">${tangerineTree("R")}</div>

      <div class="wall">${basaltWall()}</div>
    `;
  }

  window.JejuScene = { renderScene, DOL, HAENYEO };
})();
