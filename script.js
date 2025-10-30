// ✅ FINAL SCRIPT.JS — Full version with ISO flag ZIP (w2560.zip)

/* ---------- ISO → country slug map ---------- */
const isoToSlug = {
  AF: "afghanistan", AL: "albania", DZ: "algeria", AD: "andorra", AO: "angola",
  AG: "antigua-and-barbuda", AR: "argentina", AM: "armenia", AU: "australia",
  AT: "austria", AZ: "azerbaijan", BS: "bahamas", BH: "bahrain", BD: "bangladesh",
  BB: "barbados", BY: "belarus", BE: "belgium", BZ: "belize", BJ: "benin",
  BT: "bhutan", BO: "bolivia", BA: "bosnia-and-herzegovina", BW: "botswana",
  BR: "brazil", BN: "brunei", BG: "bulgaria", BF: "burkina-faso", BI: "burundi",
  KH: "cambodia", CM: "cameroon", CA: "canada", CV: "cape-verde",
  CF: "central-african-republic", TD: "chad", CL: "chile", CN: "china",
  CO: "colombia", KM: "comoros", CG: "congo", CR: "costa-rica", HR: "croatia",
  CU: "cuba", CY: "cyprus", CZ: "czech-republic", DK: "denmark", DJ: "djibouti",
  DM: "dominica", DO: "dominican-republic", EC: "ecuador", EG: "egypt",
  SV: "el-salvador", GQ: "equatorial-guinea", ER: "eritrea", EE: "estonia",
  SZ: "eswatini", ET: "ethiopia", FJ: "fiji", FI: "finland", FR: "france",
  GA: "gabon", GM: "gambia", GE: "georgia", DE: "germany", GH: "ghana",
  GR: "greece", GD: "grenada", GT: "guatemala", GN: "guinea", GW: "guinea-bissau",
  GY: "guyana", HT: "haiti", HN: "honduras", HU: "hungary", IS: "iceland",
  IN: "india", ID: "indonesia", IR: "iran", IQ: "iraq", IE: "ireland",
  IL: "israel", IT: "italy", JM: "jamaica", JP: "japan", JO: "jordan",
  KZ: "kazakhstan", KE: "kenya", KI: "kiribati", KR: "south-korea",
  KW: "kuwait", KG: "kyrgyzstan", LA: "laos", LV: "latvia", LB: "lebanon",
  LS: "lesotho", LR: "liberia", LY: "libya", LI: "liechtenstein", LT: "lithuania",
  LU: "luxembourg", MG: "madagascar", MW: "malawi", MY: "malaysia",
  MV: "maldives", ML: "mali", MT: "malta", MH: "marshall-islands",
  MR: "mauritania", MU: "mauritius", MX: "mexico", FM: "micronesia",
  MD: "moldova", MC: "monaco", MN: "mongolia", ME: "montenegro", MA: "morocco",
  MZ: "mozambique", MM: "myanmar", NA: "namibia", NR: "nauru", NP: "nepal",
  NL: "netherlands", NZ: "new-zealand", NI: "nicaragua", NE: "niger",
  NG: "nigeria", MK: "north-macedonia", NO: "norway", OM: "oman", PK: "pakistan",
  PW: "palau", PA: "panama", PG: "papua-new-guinea", PY: "paraguay", PE: "peru",
  PH: "philippines", PL: "poland", PT: "portugal", QA: "qatar", RO: "romania",
  RU: "russia", RW: "rwanda", KN: "saint-kitts-and-nevis", LC: "saint-lucia",
  VC: "saint-vincent-and-the-grenadines", WS: "samoa", SM: "san-marino",
  ST: "sao-tome-and-principe", SA: "saudi-arabia", SN: "senegal", RS: "serbia",
  SC: "seychelles", SL: "sierra-leone", SG: "singapore", SK: "slovakia",
  SI: "slovenia", SB: "solomon-islands", SO: "somalia", ZA: "south-africa",
  SS: "south-sudan", ES: "spain", LK: "sri-lanka", SD: "sudan", SR: "suriname",
  SE: "sweden", CH: "switzerland", SY: "syria", TW: "taiwan", TJ: "tajikistan",
  TZ: "tanzania", TH: "thailand", TG: "togo", TO: "tonga", TT: "trinidad-and-tobago",
  TN: "tunisia", TR: "turkey", TM: "turkmenistan", TV: "tuvalu", UG: "uganda",
  UA: "ukraine", AE: "united-arab-emirates", GB: "united-kingdom", US: "united-states",
  UY: "uruguay", UZ: "uzbekistan", VU: "vanuatu", VE: "venezuela", VN: "vietnam",
  YE: "yemen", ZM: "zambia", ZW: "zimbabwe"
};

/* ---------- Helper: get flag path by country name ---------- */
function getFlagByCountry(name) {
  const key = name.trim().toLowerCase();
  for (const [iso, slug] of Object.entries(isoToSlug)) {
    if (slug === key) return `flags/${iso.toLowerCase()}.png`;
  }
  return "flags/unknown.png"; // fallback
}

/* ---------- Config / initial 20 countries ---------- */
const initialCountries = [
  { name: "Germany", slug: "germany", coins: 0 },
  { name: "Spain", slug: "spain", coins: 0 },
  { name: "Serbia", slug: "serbia", coins: 0 },
  { name: "Greece", slug: "greece", coins: 0 },
  { name: "United Kingdom", slug: "united-kingdom", coins: 0 },
  { name: "France", slug: "france", coins: 0 },
  { name: "Italy", slug: "italy", coins: 0 },
  { name: "USA", slug: "united-states", coins: 0 },
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

/* ---------- Build leaderboard data ---------- */
const countries = [];
const countryMap = {};
initialCountries.forEach(c => {
  const obj = {
    name: c.name,
    slug: c.slug,
    flagHtml: `<img src="${getFlagByCountry(c.slug)}" alt="${c.name}" style="width:20px;height:14px;vertical-align:middle;margin-right:6px;">`,
    coins: c.coins || 0
  };
  countries.push(obj);
  countryMap[c.name.toLowerCase()] = obj;
});

let prevTop20 = [];
const prevCoins = {};
countries.forEach(c => prevCoins[c.name.toLowerCase()] = c.coins);

const giftValues = {
  rose: 1, panda: 5, perfume: 20, iloveyou: 49, confetti: 100, sunglasses: 199,
  moneyrain: 500, discoball: 1000, mermaid: 2988, airplane: 6000, planet: 15000,
  lion: 29999, universe: 44999
};

/* ---------- Render leaderboard ---------- */
function updateLeaderboardRender() {
  const sorted = [...countries].sort((a,b) => b.coins - a.coins);
  const top20 = sorted.slice(0,20);

  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  top20.forEach((c, idx) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-name", c.name);

    const tdRank = document.createElement("td");
    tdRank.textContent = idx + 1;

    const tdCountry = document.createElement("td");
    tdCountry.innerHTML = `${c.flagHtml} <span class="country-name">${c.name}</span>`;

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

    const prev = prevCoins[c.name.toLowerCase()] || 0;
    if (c.coins > prev) {
      tr.classList.add("gift-highlight");
      const popup = document.createElement("div");
      popup.className = "gift-popup";
      popup.textContent = `+${c.coins - prev}`;
      tr.appendChild(popup);
      setTimeout(() => popup.remove(), 1100);
      setTimeout(() => tr.classList.remove("gift-highlight"), 1400);
    }

    prevCoins[c.name.toLowerCase()] = c.coins;
    if (idx === 0) tr.classList.add("top1");
    if (idx === 1) tr.classList.add("top2");
    if (idx === 2) tr.classList.add("top3");
    tbody.appendChild(tr);
  });

  const newTopNames = top20.map(x => x.name);
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

/* ---------- Apply gifts ---------- */
function ensureCountry(name) {
  if (!name) name = "Unknown";
  const key = name.toLowerCase();
  if (countryMap[key]) return countryMap[key];

  const obj = {
    name,
    slug: name,
    flagHtml: `<img src="${getFlagByCountry(name)}" alt="${name}" style="width:20px;height:14px;vertical-align:middle;margin-right:6px;">`,
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

/* ---------- Reset button ---------- */
const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    countries.forEach(c => c.coins = 0);
    Object.keys(prevCoins).forEach(k => prevCoins[k] = 0);
    updateLeaderboardRender();
  });
}

/* ---------- Initial render ---------- */
updateLeaderboardRender();

/* ---------- TikTok / WebSocket integration ---------- */
try {
  const ws = new WebSocket("wss://tiktok-live-lbb.netlify.app/.netlify/functions/socket");
  ws.onopen = () => console.log("✅ WebSocket connected");
  ws.onmessage = (ev) => {
    try {
      const payload = JSON.parse(ev.data);
      const country = payload.country || payload.data?.country || payload.user?.country || payload.countryName;
      const value = payload.value || payload.data?.value || payload.data?.giftValue || 1;
      if (country) applyGift(country, value);
      else console.log("⚠️ WebSocket event with no country:", payload);
    } catch (err) { console.warn("⚠️ ws parse error:", err); }
  };
  ws.onclose = () => console.log("⚠️ WebSocket closed");
  ws.onerror = (e) => console.warn("⚠️ WebSocket error", e);
} catch (err) {
  console.warn("⚠️ Could not open native WebSocket:", err);
}

try {
  if (typeof io !== "undefined") {
    const ioSocket = io("https://tiktok-live-lbb.in.rs", { transports: ["websocket"] });
    ioSocket.on("connect", () => console.log("✅ Socket.IO connected"));
    ioSocket.on("tiktok_event", (data) => {
      const country = data?.country || data?.data?.country || data?.payload?.country || data?.user?.country;
      const value = data?.value || data?.data?.value || data?.data?.giftValue || 1;
      applyGift(country || "Unknown", value);
    });
    ioSocket.on("disconnect", () => console.log("⚠️ io disconnected"));
  }
} catch (e) {
  console.warn("ℹ️ Socket.IO client not available:", e.message);
}
