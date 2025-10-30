// final script.js — dynamic countries + PNG flag fallback + TikTok webhook handling

/* ---------- Config / initial 20 countries (keeps your current look) ---------- */
const initialCountries = [
  { name: "Germany", slug: "germany", coins: 0 },
  { name: "Spain", slug: "spain", coins: 0 },
  { name: "Serbia", slug: "serbia", coins: 0 },
  { name: "Greece", slug: "greece", coins: 0 },
  { name: "United Kingdom", slug: "united-kingdom", coins: 0 },
  { name: "France", slug: "france", coins: 0 },
  { name: "Italy", slug: "italy", coins: 0 },
  { name: "USA", slug: "usa", coins: 0 },
  { name: "Brazil", slug: "brazil", coins: 0 },
  { name: "Mexico", slug: "mexico", coins: 0 },
  { name: "Japan", slug: "japan", coins: 0 },
  { name: "South Korea", slug: "south-korea", coins: 0 },
  { name: "Netherlands", slug: "netherlands", coins: 0 },
  { name: "Poland", slug: "poland", coins: 0 },
  { name: "Sweden", slug: "sweden", coins: 0 },
  { name: "Turkey", slug: "turkey", coins: 0 },
  { name: "Egypt", slug: "egypt", coins: 0 },
  { name: "India", slug: "india", coins: 0 },
  { name: "China", slug: "china", coins: 0 },
  { name: "Canada", slug: "canada", coins: 0 }
];

/* ---------- Helper: slugify country name for file names ---------- */
function slugifyCountry(name) {
  // simple slug: lowercase, replace spaces with -, remove accents & non-alphanum except hyphen
  // remove diacritics:
  const from = "ÁÀÄÂÃÅÆáàäâãåæČčĆćÇçĐđÉÈËÊéèëêÍÌÏÎíìïîŁłŃńÓÒÖÔÕØóòöôõøŒœŘřŠšŚśŸÿÝýŽžŽž";
  const to   = "AAAAAAAaaaaaaaCcCcDdEEEEeeeeIIIIiiiiLlNnOOOOOOooooooOerRssSsyyYyZzZz";
  let s = name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
  s = s.replace(/[^\w\s-]/g, ""); // remove non word/space/hyphen
  s = s.trim().toLowerCase().replace(/\s+/g, "-");
  return s;
}

/* ---------- Countries data structure: start with initial 20, keep a map for quick find ---------- */
const countries = [];
const countryMap = {}; // name -> object

initialCountries.forEach(c => {
  const obj = {
    name: c.name,
    slug: c.slug || slugifyCountry(c.name),
    flagHtml: `<img src="flags/${c.slug || slugifyCountry(c.name)}.png" alt="${c.name}" style="width:20px;height:14px;vertical-align:middle;margin-right:6px;">`,
    coins: c.coins || 0
  };
  countries.push(obj);
  countryMap[c.name.toLowerCase()] = obj;
});

/* ---------- Trackers for animations / deltas ---------- */
let prevTop20 = [];
const prevCoins = {};
countries.forEach(c => prevCoins[c.name.toLowerCase()] = c.coins);

/* ---------- Gift value mapping (approx) ---------- */
const giftValues = {
  rose: 1, panda: 5, perfume: 20, iloveyou: 49, confetti: 100, sunglasses: 199,
  moneyrain: 500, discoball: 1000, mermaid: 2988, airplane: 6000, planet: 15000,
  lion: 29999, universe: 44999
};

/* ---------- Render logic: show top 20 only (keeps your current UI) ---------- */
function updateLeaderboardRender() {
  const sorted = [...countries].sort((a,b) => b.coins - a.coins);
  const top20 = sorted.slice(0,20);

  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  top20.forEach((c, idx) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-name", c.name);

    // rank
    const tdRank = document.createElement("td");
    tdRank.textContent = idx + 1;

    // country + flag
    const tdCountry = document.createElement("td");
    tdCountry.innerHTML = `${c.flagHtml} <span class="country-name">${c.name}</span>`;

    // gifts (coins bar)
    const tdGifts = document.createElement("td");
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    let maxCoins = Math.max(1000, ...countries.map(x => x.coins));
    const percent = Math.min((c.coins / maxCoins) * 100, 100);
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = percent + "%";
    bar.appendChild(fill);
    tdGifts.appendChild(bar);

    tr.appendChild(tdRank);
    tr.appendChild(tdCountry);
    tr.appendChild(tdGifts);

    // highlight if increased
    const prev = prevCoins[c.name.toLowerCase()] || 0;
    if (c.coins > prev) {
      tr.classList.add("gift-highlight");
      // small popup delta
      const popup = document.createElement("div");
      popup.className = "gift-popup";
      popup.textContent = `+${c.coins - prev}`;
      tr.appendChild(popup);
      setTimeout(() => popup.remove(), 1100);
      setTimeout(() => tr.classList.remove("gift-highlight"), 1400);
    }

    prevCoins[c.name.toLowerCase()] = c.coins;

    // top classes (keep your styling)
    if (idx === 0) tr.classList.add("top1");
    if (idx === 1) tr.classList.add("top2");
    if (idx === 2) tr.classList.add("top3");

    tbody.appendChild(tr);
  });

  const newTopNames = top20.map(x => x.name);
  // flash newly-entered top20 items
  newTopNames.forEach((nm, i) => {
    if (!prevTop20.includes(nm)) {
      const row = tbody.querySelector(`tr[data-name="${nm}"]`);
      if (row) {
        row.style.animation = "flashTop 1.2s";
        setTimeout(() => row.style.animation = "", 1300);
      }
    }
  });
  prevTop20 = newTopNames;
}

/* ---------- Apply gift: finds or creates country entry, adds coins ---------- */
function ensureCountry(name) {
  if (!name) name = "Unknown";
  const key = name.toLowerCase();
  if (countryMap[key]) return countryMap[key];

  const slug = slugifyCountry(name);
  const obj = {
    name,
    slug,
    flagHtml: `<img src="flags/${slug}.png" alt="${name}" style="width:20px;height:14px;vertical-align:middle;margin-right:6px;">`,
    coins: 0
  };
  countries.push(obj);
  countryMap[key] = obj;
  return obj;
}

function applyGift(countryName, amount) {
  const c = ensureCountry(countryName);
  c.coins += Number(amount || 1);
  updateLeaderboardRender();
}

/* ---------- Reset button (keeps your existing handler) ---------- */
const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    countries.forEach(c => c.coins = 0);
    Object.keys(prevCoins).forEach(k => prevCoins[k] = 0);
    updateLeaderboardRender();
  });
}

/* ---------- Initial render (shows initial 20) ---------- */
updateLeaderboardRender();

/* ---------- TikTok/Webhook integration (WebSocket + Socket.IO fallback) ---------- */
/* NOTE:
   - main websocket endpoint you used previously: wss://tiktok-live-lbb.netlify.app/.netlify/functions/socket
   - Socket.IO fallback endpoint: https://tiktok-live-lbb.in.rs (if you set up global socket there)
*/

try {
  // WebSocket (your existing socket function)
  const ws = new WebSocket("wss://tiktok-live-lbb.netlify.app/.netlify/functions/socket");

  ws.onopen = () => console.log("✅ WebSocket connected to Netlify socket function");
  ws.onmessage = (ev) => {
    try {
      const payload = JSON.parse(ev.data);
      // expect payload shape: { country: "Country Name", value: <number>, user: "name", giftName: "..." }
      const country = payload.country || payload.data?.country || payload.user?.country || payload.countryName;
      const value = payload.value || payload.data?.value || payload.data?.giftValue || 1;
      if (country) applyGift(country, value);
      else console.log("⚠️ WebSocket event with no country:", payload);
    } catch (err) {
      console.warn("⚠️ ws parse error:", err);
    }
  };

  ws.onclose = () => console.log("⚠️ WebSocket closed");
  ws.onerror = (e) => console.warn("⚠️ WebSocket error", e);
} catch (err) {
  console.warn("⚠️ Could not open native WebSocket:", err);
}

// Socket.IO fallback (if webhook emits via io on tiktok-live-lbb.in.rs)
try {
  if (typeof io !== "undefined") {
    const ioSocket = io("https://tiktok-live-lbb.in.rs", { transports: ["websocket"] });
    ioSocket.on("connect", () => console.log("✅ Socket.IO connected to TikTok webhook"));
    ioSocket.on("tiktok_event", (data) => {
      // handle different shapes from TikTok
      const country = data?.country || data?.data?.country || data?.payload?.country || data?.user?.country;
      const value = data?.value || data?.data?.value || data?.data?.giftValue || 1;
      applyGift(country || "Unknown", value);
    });
    ioSocket.on("disconnect", () => console.log("⚠️ io disconnected"));
  }
} catch (e) {
  console.warn("ℹ️ Socket.IO client not available or failed:", e.message);
}

/* ---------- Optional: simulate random gifts (disabled by default) ----------
   If you want to test locally without real webhook - uncomment call to startSimulation()
*/
// startSimulation();

function startSimulation(intervalMs = 2500) {
  const sampleCountries = ["Madagascar","Iceland","Serbia","Germany","Brazil","Canada","Japan","Madagascar"];
  setInterval(() => {
    const name = sampleCountries[Math.floor(Math.random()*sampleCountries.length)];
    const giftKey = Object.keys(giftValues)[Math.floor(Math.random()*Object.keys(giftValues).length)];
    const val = giftValues[giftKey] || 1;
    applyGift(name, val);
  }, intervalMs);
}
