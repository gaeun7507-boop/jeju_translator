/* ==========================================================================
   번역 엔진 (양방향)
   direction: 's2j' = 표준어→제주말 , 'j2s' = 제주말→표준어
   ========================================================================== */

(function () {
  const D = window.JEJU_DICT;

  // 방향에 맞게 [출발어, 도착어] 쌍을 만들고, 출발어 길이순(긴 것 먼저)으로 정렬.
  // 길이순 정렬 덕분에 '감귤'이 '귤'보다 먼저 매칭됩니다.
  function orient(pairs, direction) {
    const src = direction === "s2j" ? 0 : 1;
    const dst = direction === "s2j" ? 1 : 0;
    return pairs
      .map((p) => [p[src], p[dst]])
      .filter((p) => p[0] && p[1])
      .sort((a, b) => b[0].length - a[0].length);
  }

  function translate(text, direction) {
    let s = (text || "").trim();
    if (!s) return "";

    const phrases = orient(D.phrases, direction);
    const words = orient(D.words, direction);
    const endings = direction === "s2j" ? D.endingsS2J : D.endingsJ2S;

    // 1) 구 치환
    for (const [a, b] of phrases) s = s.split(a).join(b);
    // 2) 단어 치환
    for (const [a, b] of words) s = s.split(a).join(b);
    // 3) 어절별 어미 규칙 (문장부호 분리 후 적용)
    s = s
      .split(/(\s+)/)
      .map((tok) => {
        if (/^\s+$/.test(tok)) return tok;
        const m = tok.match(/^(.*?)([.,!?…~]*)$/s);
        let core = m[1];
        const punc = m[2];
        for (const [re, rep] of endings) {
          if (re.test(core)) {
            core = core.replace(re, rep);
            break;
          }
        }
        return core + punc;
      })
      .join("");

    return s;
  }

  window.JejuTranslator = { translate };
})();
