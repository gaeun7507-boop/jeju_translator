/* ==========================================================================
   로컬 저장소 — 번역기록 · 즐겨찾기 (localStorage)
   서버 없이 브라우저에 저장됩니다. 시크릿 창/캐시 삭제 시 사라질 수 있어요.
   ========================================================================== */

(function () {
  const HK = "jeju_history_v1";
  const FK = "jeju_favs_v1";

  function read(k) {
    try { return JSON.parse(localStorage.getItem(k)) || []; }
    catch (e) { return []; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 용량 초과 등 무시 */ }
  }

  /* ---------- 번역기록 ---------- */
  function getHistory() { return read(HK); }
  function addHistory(item) {
    const list = read(HK);
    list.unshift({
      mode: item.mode || "",
      input: item.input || "",
      output: item.output || "",
      ts: Date.now(),
    });
    if (list.length > 200) list.length = 200; // 너무 커지지 않게
    write(HK, list);
    emit();
  }
  function removeHistory(ts) { write(HK, read(HK).filter((x) => x.ts !== ts)); emit(); }
  function clearHistory() { write(HK, []); emit(); }

  /* ---------- 즐겨찾기 ---------- */
  // 즐겨찾기 항목: { a: 대표(제주말), b: 뜻(표준어), ts }
  function favKey(f) { return (f.a || "") + "" + (f.b || ""); }
  function getFavs() { return read(FK); }
  function isFav(a, b) {
    const k = (a || "") + "" + (b || "");
    return read(FK).some((f) => favKey(f) === k);
  }
  function toggleFav(a, b) {
    const list = read(FK);
    const k = (a || "") + "" + (b || "");
    const i = list.findIndex((f) => favKey(f) === k);
    let added;
    if (i >= 0) { list.splice(i, 1); added = false; }
    else { list.unshift({ a: a || "", b: b || "", ts: Date.now() }); added = true; }
    write(FK, list);
    emit();
    return added;
  }
  function removeFav(a, b) {
    const k = (a || "") + "" + (b || "");
    write(FK, read(FK).filter((f) => favKey(f) !== k));
    emit();
  }

  /* ---------- 변경 알림 ---------- */
  const listeners = [];
  function emit() { listeners.forEach((fn) => { try { fn(); } catch (e) {} }); }
  function onChange(fn) { listeners.push(fn); }

  window.JejuStore = {
    getHistory, addHistory, removeHistory, clearHistory,
    getFavs, isFav, toggleFav, removeFav, onChange,
  };
})();
