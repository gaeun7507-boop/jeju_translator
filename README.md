# 🍊 제주 사투리 번역기 · 돌하르방과 해녀

표준어 ↔ 제주 방언을 채팅형으로 번역하는 웹앱입니다.
웹에 들어가면 **돌하르방**이 `안녕하수꽈, 무신 거 궁금하우꽈?`라고 먼저 물어보고,
버튼(또는 돌하르방)을 누르면 번역 대화창으로 들어갑니다. 사용자는 **해녀** 프로필로 대화합니다.

노을 지는 하늘, 한라산, 감귤나무, 현무암 돌담으로 배경을 꾸몄습니다.

## ✨ 기능
- **양방향 번역**: `표준어 → 제주말` / `제주말 → 표준어` 모드 전환
- **채팅 UI**: 해녀(사용자) ↔ 돌하르방(번역가), 원문 뜻풀이 함께 표시
- **구글 스프레드시트 연동**
  - 단어장을 시트에서 불러오기 (코드 수정 없이 어휘 추가)
  - 번역 기록을 시트에 자동 저장
- 인터넷/설치 없이도 내장 사전으로 동작 (시트 미설정 시)

> ⚠️ 규칙 기반 근사 번역이라 완벽한 문법 번역은 아닙니다. 뜻풀이는 참고용이에요.

## 📁 파일 구조
```
index.html            메인 페이지 (랜딩 + 대화 화면 전환)
css/style.css         전체 스타일
js/config.js          구글 시트 주소 설정 (여기만 채우면 됨)
js/dictionary.js      제주어 사전 (단어·구·어미 규칙)
js/translator.js      양방향 번역 엔진
js/sheets.js          구글 시트 불러오기 / 기록 저장
js/scene.js           배경·캐릭터 그리기
js/sky.js             시간대·날씨 반영 (Open-Meteo + 비·눈 파티클)
js/app.js             화면 전환·모드·채팅 로직
apps-script/Code.gs   기록 저장용 Google Apps Script
```

## 🌤 시간대와 날씨
제주 현지의 **일출/일몰 시각과 실시간 날씨**에 따라 배경이 바뀝니다.
[Open-Meteo](https://open-meteo.com) 한 번 호출로 둘 다 받아오며 API 키는 필요 없습니다.

- 시간대 4종 — 일출 · 아침(낮) · 노을 · 밤
- 날씨 4종 — 맑음 · 흐림 · 비 · 눈 (시간대 **위에 얹히는** 레이어)

색은 전부 `style.css`의 `body[data-time]` / `body[data-weather]` 변수로 정의돼 있고,
`scene.js`의 SVG(구름·한라산·돌담)가 그 변수를 참조합니다. **색을 바꾸려면 CSS만 고치면 됩니다.**

확인해 보려면:
```
index.html?time=night&weather=snow      # time: sunrise|day|sunset|night
                                        # weather: clear|cloudy|rain|snow
```
콘솔에서 `JejuSky.set({ time:"day", weather:"rain" })` · 자동으로 되돌리려면 `JejuSky.auto()`.
네트워크가 안 되면 날씨는 맑음으로 두고 시간대만 로컬 시계로 맞춥니다.

## 🚀 GitHub Pages 배포
1. 새 저장소를 만들고 이 폴더 전체를 올립니다.
   ```bash
   git init
   git add .
   git commit -m "제주 사투리 번역기"
   git branch -M main
   git remote add origin https://github.com/<사용자명>/<저장소명>.git
   git push -u origin main
   ```
2. GitHub 저장소 → **Settings → Pages** → Source를 `main` 브랜치 `/ (root)`로 지정 후 저장.
3. 잠시 뒤 `https://<사용자명>.github.io/<저장소명>/` 주소로 접속됩니다.

## 📊 구글 스프레드시트 연동 (선택)

### ① 단어장 불러오기
1. 구글 시트에 아래처럼 입력합니다(첫 줄은 헤더).

   | 표준어 | 제주말 | 유형 |
   |--------|--------|------|
   | 고맙습니다 | 고맙수다 | 구 |
   | 강아지 | 강생이 | 단어 |

   - `유형`은 `단어`/`구` 중 하나(비워두면 띄어쓰기로 자동 판별).
2. **파일 → 공유 → 웹에 게시** → 해당 시트 선택 → 형식 **CSV** → 게시.
3. 나온 주소(`...output=csv`)를 `js/config.js`의 `SHEET_CSV_URL`에 붙여넣습니다.

### ② 번역 기록 저장
1. 기록을 남길 구글 시트에서 **확장 프로그램 → Apps Script**.
2. `apps-script/Code.gs` 내용을 붙여넣고 저장.
3. **배포 → 새 배포 → 웹 앱**
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자**
4. 배포 후 나온 `/exec` 주소를 `js/config.js`의 `APPS_SCRIPT_URL`에 붙여넣습니다.
   - 번역할 때마다 `기록` 시트에 `시각·모드·입력·출력`이 쌓입니다.

> `js/config.js`의 두 주소를 비워두면 연동 없이 내장 사전만으로 동작합니다.

## 🖥 로컬에서 실행
`file://`로 직접 열면 브라우저 보안 정책으로 시트 연동이 막힐 수 있어,
간단한 로컬 서버 사용을 권장합니다.
```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## 📝 단어 추가하기
- 코드로 추가: `js/dictionary.js`의 `words` / `phrases`에 `["표준어","제주말"]` 추가.
- 시트로 추가: 위 "① 단어장 불러오기" 시트에 행 추가(코드 수정 불필요).
