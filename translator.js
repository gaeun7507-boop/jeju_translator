/* ==========================================================================
   번역 엔진 (양방향)
   direction: 's2j' = 표준어→제주말 , 'j2s' = 제주말→표준어
   ========================================================================== */

(function () {
  const D = window.JEJU_DICT;

  // 방향에 맞게 [출발어, 도착어] 쌍을 만들고, 출발어 길이순(긴 것 먼저)으로 정렬.
  // 길이순 정렬 덕분에 '감귤'이 '귤'보다 먼저 매칭됩니다.
  //
  // 쌍의 3번째 값으로 방향을 제한할 수 있습니다(예: ["저렇게", "정", "s2j"]).
  // '정·막·낭'처럼 짧은 제주말은 표준어 단어 속에 그대로 들어있어서
  // (정말→'저렇게'말, 마지막→마지'너무') 반대 방향에서 오작동합니다.
  function orient(pairs, direction) {
    const src = direction === "s2j" ? 0 : 1;
    const dst = direction === "s2j" ? 1 : 0;
    return pairs
      .filter((p) => !p[2] || p[2] === direction)
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
    //
    //    규칙은 [정규식, 치환] 또는 [정규식, 치환, 서법] 형식.
    //      치환 — 문자열이거나, String.replace 에 그대로 넘기는 함수
    //      서법 — 아래 글자들을 이어 붙인 문자열. 없으면 아무 때나.
    //        "q" 물음표가 붙은 어절에만   · "d" 붙지 않은 어절에만
    //        "f" 문장의 마지막 어절에만
    //    q/d 가 필요한 이유: 물음표는 core 에서 떼어내므로 정규식으로는 볼 수 없는데,
    //    제주어는 평서(먹었수다)와 의문(먹었수과?)의 어미가 아예 다르다.
    //    f 가 필요한 이유: 종결어미는 문장 끝에만 온다. 이 구분이 없으면
    //    감탄사 '와'가 '오라'(오+라)로, 명사 '무신 거'의 '거'가 어미로 오해받는다.
    const toks = s.split(/(\s+)/);
    let lastIdx = -1;
    for (let i = toks.length - 1; i >= 0; i--) {
      if (!/^\s*$/.test(toks[i])) { lastIdx = i; break; }
    }
    s = toks
      .map((tok, i) => {
        if (/^\s+$/.test(tok)) return tok;
        const m = tok.match(/^(.*?)([.,!?…~]*)$/s);
        let core = m[1];
        const punc = m[2];
        const q = /[?？]/.test(punc);
        const last = i === lastIdx;
        for (const [re, rep, mood] of endings) {
          if (mood) {
            if (mood.includes("q") && !q) continue;
            if (mood.includes("d") && q) continue;
            if (mood.includes("f") && !last) continue;
          }
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
