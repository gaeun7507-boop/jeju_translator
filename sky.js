/* ==========================================================================
   하늘: 시간대 & 날씨 반영
   - Open-Meteo(무료·API 키 없음) 한 번 호출로 제주의 일출/일몰 시각과
     현재 날씨를 함께 받아 body[data-time] / body[data-weather]를 세팅한다.
   - 색·명암은 전부 style.css의 테마 변수가 담당하고, 여기서는 '지금 어느 칸인지'만 정한다.
   - 비·눈만 캔버스에 그린다(파티클 라이브러리 없이).

   수동 확인:
     URL에 ?time=night&weather=snow
     콘솔에서 JejuSky.set({ time:"day", weather:"rain" }) · JejuSky.auto()
   ========================================================================== */

(function () {
  const JEJU = { lat: 33.4996, lon: 126.5312 };      // 제주시
  const API =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${JEJU.lat}&longitude=${JEJU.lon}` +
    "&current=weather_code&daily=sunrise,sunset&timezone=Asia%2FSeoul&forecast_days=1";

  const REFRESH_MS = 10 * 60 * 1000;   // 10분마다 재확인
  const TIMES = ["sunrise", "day", "sunset", "night"];
  const WEATHERS = ["clear", "cloudy", "rain", "snow"];
  const MIN = 60 * 1000;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = { time: null, weather: null };
  let manual = false;   // 수동 지정이면 자동 갱신이 덮어쓰지 않는다
  let timer = null;

  /* ---------- 시간대 판정 ----------
     일출/일몰 '순간'만 쓰면 노을이 1초만에 지나간다. 앞뒤로 폭을 준다. */
  function bandFromSun(now, sunrise, sunset) {
    if (now >= sunrise - 30 * MIN && now <= sunrise + 50 * MIN) return "sunrise";
    if (now >= sunset - 70 * MIN && now <= sunset + 30 * MIN) return "sunset";
    if (now > sunrise + 50 * MIN && now < sunset - 70 * MIN) return "day";
    return "night";
  }

  /* 네트워크가 안 될 때: 그냥 시계로 대충 나눈다 */
  function bandFromClock(d) {
    const h = d.getHours() + d.getMinutes() / 60;
    if (h >= 5 && h < 7) return "sunrise";
    if (h >= 7 && h < 17.5) return "day";
    if (h >= 17.5 && h < 19.5) return "sunset";
    return "night";
  }

  /* ---------- WMO 날씨 코드 → 네 가지 ----------
     https://open-meteo.com/en/docs (weather_code) */
  function weatherFromCode(c) {
    if (c === 0 || c === 1) return "clear";                    // 맑음·대체로 맑음
    if (c === 2 || c === 3 || c === 45 || c === 48) return "cloudy"; // 구름많음·흐림·안개
    if (c >= 71 && c <= 77) return "snow";                     // 눈
    if (c === 85 || c === 86) return "snow";                   // 소낙눈
    if (c >= 51 && c <= 67) return "rain";                     // 이슬비·비·어는비
    if (c >= 80 && c <= 82) return "rain";                     // 소나기
    if (c >= 95 && c <= 99) return "rain";                     // 뇌우
    return "clear";
  }

  /* ---------- 적용 ---------- */
  function apply(time, weather) {
    if (time && time !== current.time) {
      document.body.dataset.time = time;
      current.time = time;
    }
    if (weather && weather !== current.weather) {
      document.body.dataset.weather = weather;
      current.weather = weather;
      particles.set(weather);
    }
  }

  /* ---------- 비·눈 파티클 ---------- */
  const particles = (function () {
    let canvas, ctx, raf = null, kind = null, drops = [], w = 0, h = 0, dpr = 1;

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      const n = kind === "rain" ? Math.round(w / 6) : Math.round(w / 14);
      drops = [];
      for (let i = 0; i < n; i++) drops.push(make(true));
    }

    function make(anywhere) {
      if (kind === "rain") {
        return {
          x: Math.random() * (w + 120) - 60,
          y: anywhere ? Math.random() * h : -20,
          len: 9 + Math.random() * 16,
          vy: 620 + Math.random() * 420,      // px/초
          a: 0.18 + Math.random() * 0.34,
        };
      }
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -10,
        r: 1.2 + Math.random() * 2.6,
        vy: 26 + Math.random() * 46,
        sway: 8 + Math.random() * 22,          // 좌우로 흔들리는 폭
        phase: Math.random() * Math.PI * 2,
        a: 0.45 + Math.random() * 0.5,
      };
    }

    let last = 0;
    function frame(t) {
      const dt = Math.min((t - last) / 1000, 0.05) || 0.016;  // 탭 복귀 시 튀지 않게
      last = t;
      ctx.clearRect(0, 0, w, h);

      if (kind === "rain") {
        ctx.lineCap = "round";
        ctx.lineWidth = 1.1;
        for (const d of drops) {
          d.y += d.vy * dt;
          d.x += d.vy * dt * 0.16;            // 바람에 살짝 기울어짐
          if (d.y > h + 20) Object.assign(d, make(false));
          ctx.strokeStyle = `rgba(206,226,244,${d.a})`;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.len * 0.16, d.y - d.len);
          ctx.stroke();
        }
      } else if (kind === "snow") {
        for (const s of drops) {
          s.y += s.vy * dt;
          s.phase += dt * 1.1;
          const x = s.x + Math.sin(s.phase) * s.sway;
          if (s.y > h + 12) Object.assign(s, make(false));
          ctx.fillStyle = `rgba(255,255,255,${s.a})`;
          ctx.beginPath();
          ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      if (ctx) ctx.clearRect(0, 0, w, h);
    }

    function set(weather) {
      if (!canvas) {
        canvas = document.querySelector(".wx");
        if (!canvas) return;
        ctx = canvas.getContext("2d");
        window.addEventListener("resize", () => { resize(); if (kind) seed(); });
      }
      const next = weather === "rain" || weather === "snow" ? weather : null;
      if (next === kind) return;
      kind = next;
      stop();
      if (!kind || reduceMotion) return;       // 모션 최소화 설정이면 파티클은 생략
      resize();
      seed();
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    // 탭이 가려지면 굳이 그리지 않는다
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (kind && !reduceMotion && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    });

    return { set };
  })();

  /* ---------- 자동 ---------- */
  async function refresh() {
    if (manual) return;
    const now = new Date();
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const j = await res.json();
      // Open-Meteo는 timezone=Asia/Seoul이면 오프셋 없는 현지시각 문자열을 준다.
      // 그대로 Date에 넣으면 브라우저 로컬 시간대로 해석되므로, 제주 기준 오프셋을 붙여준다.
      const off = j.utc_offset_seconds ?? 32400;
      const toMs = (s) => new Date(s + offsetSuffix(off)).getTime();
      const sunrise = toMs(j.daily.sunrise[0]);
      const sunset = toMs(j.daily.sunset[0]);
      const time = bandFromSun(now.getTime(), sunrise, sunset);
      const weather = weatherFromCode(j.current.weather_code);
      apply(time, weather);
      console.info(`[sky] ${time} · ${weather} (일출 ${j.daily.sunrise[0].slice(11)} · 일몰 ${j.daily.sunset[0].slice(11)})`);
    } catch (e) {
      // 날씨는 알 수 없으니 맑음으로 두고, 시간대만 로컬 시계로 맞춘다
      apply(bandFromClock(now), current.weather || "clear");
      console.info("[sky] 날씨 API 실패 — 로컬 시계로 시간대만 반영", e.message);
    }
  }

  function offsetSuffix(sec) {
    const sign = sec < 0 ? "-" : "+";
    const a = Math.abs(sec);
    const hh = String(Math.floor(a / 3600)).padStart(2, "0");
    const mm = String(Math.floor((a % 3600) / 60)).padStart(2, "0");
    return `${sign}${hh}:${mm}`;
  }

  function auto() {
    manual = false;
    clearInterval(timer);
    refresh();
    timer = setInterval(refresh, REFRESH_MS);
  }

  /* ---------- 시작 ---------- */
  // 첫 화면이 흰 하늘로 깜빡이지 않도록, API를 기다리기 전에 시계로 먼저 칠한다
  apply(bandFromClock(new Date()), "clear");

  const q = new URLSearchParams(location.search);
  const qt = q.get("time"), qw = q.get("weather");
  if (TIMES.includes(qt) || WEATHERS.includes(qw)) {
    manual = true;
    apply(TIMES.includes(qt) ? qt : current.time, WEATHERS.includes(qw) ? qw : "clear");
    console.info("[sky] URL 지정 —", current.time, "·", current.weather);
  } else {
    auto();
  }

  window.JejuSky = {
    set({ time, weather } = {}) {
      manual = true;
      clearInterval(timer);
      apply(time, weather);
      return current;
    },
    auto,
    get state() { return { ...current }; },
    TIMES, WEATHERS,
  };
})();
