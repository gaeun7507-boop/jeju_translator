/* ==========================================================================
   한글 음절 분해·조합
   --------------------------------------------------------------------------
   왜 필요한가:
     제주어 어미는 앞말의 받침에 따라 모양이 갈린다.
       가다  → 갑서   (받침 없음 → 어간에 ㅂ 을 받침으로 붙인다)
       먹다  → 먹읍서 (받침 있음 → 매개모음 '으' 를 끼운다)
     그런데 "갑"은 ㄱ+ㅏ+ㅂ 이 한 글자로 합쳐진 음절이라
     문자열 "갑니다" 안에 "ㅂ니다" 라는 부분문자열은 들어있지 않다.
     그래서 /ㅂ니다$/ 같은 정규식은 영원히 걸리지 않는다.
     받침을 다루려면 음절을 유니코드 수식으로 분해했다가 다시 합쳐야 한다.

   유니코드 한글 음절 = 0xAC00 + (초성*21 + 중성)*28 + 종성
   ========================================================================== */

(function () {
  const BASE = 0xac00;
  const LAST = 0xd7a3;

  // 종성 표. 인덱스 0 은 받침 없음.
  const JONG = [
    "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ",
    "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ",
    "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
  ];

  function isSyllable(ch) {
    if (!ch) return false;
    const c = ch.charCodeAt(0);
    return c >= BASE && c <= LAST;
  }

  /* 음절 하나를 {cho, jung, jong} 인덱스로 분해. 한글이 아니면 null */
  function parse(ch) {
    if (!isSyllable(ch)) return null;
    const n = ch.charCodeAt(0) - BASE;
    return { cho: Math.floor(n / 588), jung: Math.floor((n % 588) / 28), jong: n % 28 };
  }

  function build(cho, jung, jong) {
    return String.fromCharCode(BASE + (cho * 21 + jung) * 28 + jong);
  }

  /* 마지막 글자의 받침 이름("ㄹ" 등). 받침이 없거나 한글이 아니면 "" */
  function jongOf(s) {
    const p = parse(s.slice(-1));
    return p ? JONG[p.jong] : "";
  }

  /* 마지막 글자에 받침이 있는가. 한글이 아니면 있는 것으로 친다
     (한자·영문 뒤에는 매개모음을 넣는 쪽이 덜 어색하다) */
  function hasJong(s) {
    const p = parse(s.slice(-1));
    return p ? p.jong !== 0 : true;
  }

  /* 마지막 글자에 받침을 얹는다. 이미 받침이 있으면 그대로 둔다.
       가 + ㅂ → 갑 ,  오 + ㅂ → 옵 */
  function addJong(s, jong) {
    const p = parse(s.slice(-1));
    const i = JONG.indexOf(jong);
    if (!p || p.jong !== 0 || i < 1) return s;
    return s.slice(0, -1) + build(p.cho, p.jung, i);
  }

  /* 마지막 글자의 받침을 떼어낸다.  살 → 사 */
  function stripJong(s) {
    const p = parse(s.slice(-1));
    if (!p || p.jong === 0) return s;
    return s.slice(0, -1) + build(p.cho, p.jung, 0);
  }

  /* 마지막 글자의 모음이 양성( ㅏ ㅗ )인가 — '아/어' 를 고를 때 쓴다 */
  function isBright(s) {
    const p = parse(s.slice(-1));
    if (!p) return false;
    return p.jung === 0 || p.jung === 8; // ㅏ , ㅗ
  }

  window.JejuHangul = {
    isSyllable, parse, build, jongOf, hasJong, addJong, stripJong, isBright,
  };
})();
