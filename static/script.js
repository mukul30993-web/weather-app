document.addEventListener("DOMContentLoaded", () => {
  initTheme(); initClock(); initLocation(); initChart(); initRecentCities(); initSearchLoading(); initWeatherScene();
});
 
function initWeatherScene() {
  const body = document.body;
  const bg = document.querySelector(".background");
  if (!bg) return;
 
  const condition = [...body.classList].find(c =>
    ["clear","clouds","rain","drizzle","thunderstorm","snow","mist","haze","fog"].includes(c)
  );
  if (!condition) return;
 
  // Sun rays (clear)
  if (condition === "clear") {
    const sun = document.createElement("div");
    sun.className = "scene-sun";
    sun.style.display = "block";
    sun.innerHTML = '<span class="ray"></span>';
    bg.appendChild(sun);
  }
 
  // Clouds (clouds, rain, drizzle, thunderstorm, snow)
  if (["clouds","rain","drizzle","thunderstorm","snow"].includes(condition)) {
    const cloudCount = condition === "clouds" ? 4 : 2;
    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement("div");
      cloud.className = "scene-cloud";
      const width = 140 + Math.random() * 120;
      const height = width * 0.28;
      cloud.style.width = `${width}px`;
      cloud.style.height = `${height}px`;
      cloud.style.top = `${8 + Math.random() * 30}%`;
      cloud.style.animationDuration = `${45 + Math.random() * 40}s`;
      cloud.style.animationDelay = `-${Math.random() * 30}s`;
      bg.appendChild(cloud);
    }
  }
 
  // Rain (rain, drizzle, thunderstorm)
  if (["rain","drizzle","thunderstorm"].includes(condition)) {
    const rainLayer = document.createElement("div");
    rainLayer.className = "scene-rain";
    const dropCount = condition === "thunderstorm" ? 120 : condition === "drizzle" ? 50 : 90;
    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.animationDuration = `${0.35 + Math.random() * 0.45}s`;
      drop.style.animationDelay = `-${Math.random() * 2}s`;
      rainLayer.appendChild(drop);
    }
    bg.appendChild(rainLayer);
  }
 
  // Snow
  if (condition === "snow") {
    const snowLayer = document.createElement("div");
    snowLayer.className = "scene-rain"; // reuse full-bleed overlay container
    for (let i = 0; i < 70; i++) {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      const size = 2 + Math.random() * 4;
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.left = `${Math.random() * 100}vw`;
      flake.style.animationDuration = `${6 + Math.random() * 7}s`;
      flake.style.animationDelay = `-${Math.random() * 6}s`;
      snowLayer.appendChild(flake);
    }
    bg.appendChild(snowLayer);
  }
}
 
function initTheme() {
  const button = document.getElementById("themeToggle");
  const saved = localStorage.getItem("weather-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const light = saved ? saved === "light" : prefersLight;
  setTheme(light);
  button?.addEventListener("click", () => setTheme(!document.body.classList.contains("light-mode")));
  function setTheme(isLight) {
    document.body.classList.toggle("light-mode", isLight);
    if (button) { button.innerHTML = `<i class="fa-solid fa-${isLight ? "moon" : "sun"}"></i>`; button.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`); }
    localStorage.setItem("weather-theme", isLight ? "light" : "dark");
  }
}
 
function initClock() { const el = document.getElementById("liveClock"); if (!el) return; const offset = Number(el.dataset.timezone); const render = () => { const cityTime = Number.isFinite(offset) && el.dataset.timezone !== "" ? new Date(Date.now() + offset * 1000) : new Date(); const zone = el.dataset.timezone !== "" ? "UTC" : undefined; el.textContent = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", timeZone:zone }).format(cityTime); }; render(); setInterval(render, 30000); }
 
function initSearchLoading() { const form = document.querySelector(".search-form"); form?.addEventListener("submit", () => { const button = form.querySelector(".search-button"); form.classList.add("is-loading"); button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading'; }); }
 
function initRecentCities() { const form = document.querySelector(".search-form"); const holder = document.getElementById("recentSearches"); if (!form || !holder) return; const city = form.dataset.city.trim(); let cities = JSON.parse(localStorage.getItem("weather-recent-cities") || "[]"); if (city) { cities = [city, ...cities.filter(item => item.toLowerCase() !== city.toLowerCase())].slice(0, 5); localStorage.setItem("weather-recent-cities", JSON.stringify(cities)); } if (!cities.length) return; holder.hidden = false; holder.innerHTML = '<span class="recent-label">Recent:</span>'; cities.forEach(cityName => { const button = document.createElement("button"); button.type = "button"; button.className = "recent-city"; button.textContent = cityName; button.addEventListener("click", () => { form.querySelector("input[name=city]").value = cityName; form.requestSubmit(); }); holder.appendChild(button); }); }
 
function initLocation() { const btn = document.getElementById("locationBtn"); btn?.addEventListener("click", () => { if (!navigator.geolocation) return showLocationError("Location is not supported by this browser."); btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; navigator.geolocation.getCurrentPosition(({coords}) => window.location.assign(`/location?lat=${encodeURIComponent(coords.latitude)}&lon=${encodeURIComponent(coords.longitude)}`), () => { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-location-arrow"></i>'; showLocationError("We could not access your location. Please search for a city instead."); }, { enableHighAccuracy:false, timeout:10000, maximumAge:300000 }); }); }
 
function showLocationError(message) { const alert = document.createElement("div"); alert.className = "alert"; alert.setAttribute("role", "alert"); alert.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${message}`; document.querySelector(".search-panel")?.insertAdjacentElement("afterend", alert); setTimeout(() => alert.remove(), 5000); }
 
function initChart() { const canvas = document.getElementById("tempChart"); if (!canvas || typeof hourlyLabels === "undefined") return; const ctx = canvas.getContext("2d"); const gradient = ctx.createLinearGradient(0, 0, 0, 260); gradient.addColorStop(0, "rgba(255,189,89,.35)"); gradient.addColorStop(1, "rgba(255,189,89,0)"); new Chart(ctx, { type:"line", data:{ labels:hourlyLabels, datasets:[{ data:hourlyTemps, borderColor:"#ffbd59", backgroundColor:gradient, fill:true, borderWidth:3, tension:.42, pointRadius:3, pointHoverRadius:6, pointBackgroundColor:"#ffbd59", pointBorderColor:"#fff", pointBorderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ displayColors:false, backgroundColor:"#142039", padding:12, callbacks:{label:c => `${c.parsed.y}°C`} } }, scales:{ x:{grid:{display:false}, ticks:{color:"#aeb9cb", font:{size:11}}}, y:{grid:{color:"rgba(174,185,203,.14)"}, border:{display:false}, ticks:{color:"#aeb9cb", callback:v => `${v}°`, font:{size:11}}} } } }); }