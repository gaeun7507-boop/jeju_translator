/* ==========================================================================
   제주 사투리 번역기 · 설정 파일
   --------------------------------------------------------------------------
   구글 스프레드시트를 연동하려면 아래 두 주소를 채워 넣으세요.
   비워두면(""), 코드에 내장된 기본 사전만 사용하며 앱은 정상 동작합니다.
   자세한 설정 방법은 README.md 참고.
   ========================================================================== */

window.JEJU_CONFIG = {

  // ① 단어장으로 쓸 구글 시트를 'CSV로 웹에 게시'한 주소.
  //    (파일 → 공유 → 웹에 게시 → 특정 시트 · CSV → 게시)
  //    예: "https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv"
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu-xjqvUdtQJUDzvSG0ZWKdoyMTEK1w6jQQ-eD8wjsAkiUPWPJPNOO5Mdry-yT4vM6HDD3YwWqRPwt/pub?gid=0&single=true&output=csv"
  // ② 번역 기록을 저장할 구글 Apps Script 웹앱 배포 주소.
  //    (apps-script/Code.gs 를 배포한 뒤 나오는 /exec 주소)
  //    예: "https://script.google.com/macros/s/XXXX/exec"
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycby8neid5V5RVo8_G_4Mw02aMEhigLfEy10AhHvPAH7pq_DIyypUx23VaDhxmKb_Mf0C/exec",

  // 번역 기록 저장 기능 켜기/끄기 (APPS_SCRIPT_URL 이 있어야 동작)
  ENABLE_LOGGING: true,
};
