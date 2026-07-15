/* ==========================================================================
   구글 스프레드시트 연동
   ① loadDictionary(): CSV로 게시된 시트를 읽어 단어장에 합침
   ② logTranslation(): 번역 기록을 Apps Script 웹앱으로 전송(저장)
   두 기능 모두 config.js 에 주소가 없으면 조용히 건너뜁니다(앱은 정상 동작).
   ========================================================================== */

(function () {
  const CFG = window.JEJU_CONFIG || {};

  /* ---- 간단한 CSV 파서 (따옴표·줄바꿈 처리) ---- */
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (c === "\r") { /* skip */ }
        else field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  /* ---- ① 구글 시트 → 단어장 ----
     시트 열 구성: 표준어 | 제주말 | 유형(단어/구, 생략 가능) */
  async function loadDictionary() {
    const url = CFG.SHEET_CSV_URL;
    if (!url) return { loaded: 0 };
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (!rows.length) return { loaded: 0 };

      // 헤더 판별
      let start = 0;
      const head = rows[0].map((c) => (c || "").trim());
      if (head.some((c) => /표준어|standard|jeju|제주/.test(c))) start = 1;

      let added = 0;
      for (let r = start; r < rows.length; r++) {
        const std = (rows[r][0] || "").trim();
        const jeju = (rows[r][1] || "").trim();
        const type = (rows[r][2] || "").trim();
        if (!std || !jeju) continue;
        const isPhrase = /구|phrase/.test(type) || /\s/.test(std) || /\s/.test(jeju);
        (isPhrase ? window.JEJU_DICT.phrases : window.JEJU_DICT.words).unshift([std, jeju]);
        added++;
      }
      return { loaded: added };
    } catch (e) {
      console.warn("[sheets] 단어장 불러오기 실패:", e.message);
      return { loaded: 0, error: e.message };
    }
  }

  /* ---- ② 번역 기록 전송 ----
     no-cors + text/plain 으로 보내 preflight 없이 Apps Script 에 저장 */
  function logTranslation(data) {
    const url = CFG.APPS_SCRIPT_URL;
    if (!url || CFG.ENABLE_LOGGING === false) return;
    try {
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          mode: data.mode || "",
          input: data.input || "",
          output: data.output || "",
          ts: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch (e) {
      /* 기록 실패는 무시 (번역 자체엔 영향 없음) */
    }
  }

  window.JejuSheets = { loadDictionary, logTranslation };
})();
