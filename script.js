// script.js (final) - copy-paste into your Replit

/* COUNTRIES */
const countries = [
  { name: "Germany", flag: "🇩🇪", coins: 0 },
  { name: "Spain", flag: "🇪🇸", coins: 0 },
  { name: "Serbia", flag: "🇷🇸", coins: 0 },
  { name: "Greece", flag: "🇬🇷", coins: 0 },
  { name: "United Kingdom", flag: "🇬🇧", coins: 0 },
  { name: "France", flag: "🇫🇷", coins: 0 },
  { name: "Italy", flag: "🇮🇹", coins: 0 },
  { name: "USA", flag: "🇺🇸", coins: 0 },
  { name: "Brazil", flag: "🇧🇷", coins: 0 },
  { name: "Mexico", flag: "🇲🇽", coins: 0 },
  { name: "Japan", flag: "🇯🇵", coins: 0 },
  { name: "South Korea", flag: "🇰🇷", coins: 0 },
  { name: "Netherlands", flag: "🇳🇱", coins: 0 },
  { name: "Poland", flag: "🇵🇱", coins: 0 },
  { name: "Sweden", flag: "🇸🇪", coins: 0 },
  { name: "Turkey", flag: "🇹🇷", coins: 0 },
  { name: "Egypt", flag: "🇪🇬", coins: 0 },
  { name: "India", flag: "🇮🇳", coins: 0 },
  { name: "China", flag: "🇨🇳", coins: 0 },
  { name: "Canada", flag: "🇨🇦", coins: 0 },
];

countries.forEach((c) => {
  if (!/[\u{1F1E6}-\u{1F1FF}]/u.test(c.flag)) {
    c.flag = `<img src="flags/${c.name.toLowerCase()}.png" alt="${c.name}" style="width:20px;height:20px;vertical-align:middle;">`;
  }
});

/* trackers */
let prevTop3 = [];
let prevRanks = {};
let prevCoins = {};
countries.forEach(c => { prevRanks[c.name] = -1; prevCoins[c.name] = c.coins; });

/* Realistic-ish TikTok gift values (coins). Sources used for approximate mapping. */
const giftValues = {
  rose: 1,          // 1 coin
  panda: 5,         // 5 coins
  perfume: 20,      // 20 coins
  iloveyou: 49,     // 49 coins
  confetti: 100,    // 100 coins
  sunglasses: 199,  // 199 coins
  moneyrain: 500,   // 500 coins
  discoball: 1000,  // 1000 coins
  mermaid: 2988,    // ~2988 coins
  airplane: 6000,   // 6000 coins
  planet: 15000,    // 15000 coins
  lion: 29999,      // 29999 coins
  universe: 44999   // 44999 coins
};

/* helper: choose random gift from pool with weights (more small gifts) */
const giftPool = [
  { key: "rose", weight: 55 },
  { key: "panda", weight: 20 },
  { key: "perfume", weight: 8 },
  { key: "iloveyou", weight: 6 },
  { key: "confetti", weight: 4 },
  { key: "sunglasses", weight: 3 },
  { key: "moneyrain", weight: 2 },
  { key: "discoball", weight: 1.5 },
  { key: "mermaid", weight: 0.6 },
  { key: "airplane", weight: 0.3 },
  { key: "planet", weight: 0.15 },
  { key: "lion", weight: 0.05 },
  { key: "universe", weight: 0.02 }
];

function chooseGiftFromPool() {
  const total = giftPool.reduce((s,g) => s+g.weight, 0);
  let r = Math.random()*total;
  for (let g of giftPool) {
    if (r < g.weight) return g.key;
    r -= g.weight;
  }
  return giftPool[0].key;
}

/* render leaderboard (Rank | Country | Gifts) */
function updateLeaderboard() {
  const sorted = [...countries].sort((a,b) => b.coins - a.coins);
  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = "";

  sorted.forEach((c, index) => {
    const row = document.createElement("tr");
    row.style.opacity = "1";
    row.style.transition = "all 0.35s ease";
    row.setAttribute("data-name", c.name);

    // compact cells
    const tdRank = document.createElement("td");
    tdRank.textContent = index + 1;

    const tdCountry = document.createElement("td");
    tdCountry.innerHTML = `${c.flag} <span class="country-name">${c.name}</span>`;

    const tdGifts = document.createElement("td");
    // gifts bar
    const bar = document.createElement("div");
    bar.className = "progress-bar";

    // scale: choose maxRange depending on overall top coin (so bars grow realistically)
    let topCoins = Math.max(...countries.map(x => x.coins), 1000);
    let maxRange = topCoins <= 1000 ? 1000 : Math.max(topCoins, 5000);
    const percent = Math.min((c.coins / maxRange) * 100, 100);

    const fill = document.createElement("div");
    fill.className = "progress-fill " + (c.coins > 1000 ? "greenFill" : "goldFill");
    fill.style.width = `${percent}%`;

    const marker = document.createElement("div");
    marker.className = "progress-marker";

    bar.appendChild(fill);
    bar.appendChild(marker);
    tdGifts.appendChild(bar);

    // assemble
    row.appendChild(tdRank);
    row.appendChild(tdCountry);
    row.appendChild(tdGifts);

    // only TOP3 static borders
    if (index === 0) row.classList.add("top1");
    if (index === 1) row.classList.add("top2");
    if (index === 2) row.classList.add("top3");

    // rank improvement detection -> fade animation
    const prevRank = prevRanks[c.name];
    if (prevRank !== -1 && index < prevRank) {
      row.classList.add("rank-change");
      setTimeout(() => row.classList.remove("rank-change"), 1100);
    }

    // gift arrival detection -> highlight + popup
    if (c.coins > (prevCoins[c.name] || 0)) {
      // light-blue highlight:
      row.classList.add("gift-highlight");
      setTimeout(() => row.classList.remove("gift-highlight"), 1600);

      // popup showing delta
      const delta = c.coins - (prevCoins[c.name] || 0);
      const popup = document.createElement("div");
      popup.className = "gift-popup";
      popup.textContent = `+${delta}`;
      row.appendChild(popup);

      // remove popup after animation end
      setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
      }, 900);
    }

    // store current for next delta check
    prevRanks[c.name] = index;
    prevCoins[c.name] = c.coins;

    tbody.appendChild(row);
  });

  // track top3 entry flash (keeps logic but no global big ring)
  const currentTop3 = sorted.slice(0,3).map(c => c.name);
  const rows = document.querySelectorAll("#leaderboard-body tr");
  currentTop3.forEach((name, i) => {
    if (!prevTop3.includes(name)) {
      const r = rows[i];
      if (r) {
        r.style.animation = "flashTop 1.5s";
        setTimeout(() => r.style.animation = "", 1500);
      }
    }
  });
  prevTop3 = currentTop3;
}

/* apply gift points to country */
function applyGiftToCountry(countryName, amount) {
  const target = countries.find(c => c.name === countryName);
  if (!target) return;
  target.coins += amount;
  updateLeaderboard();
}

/* random simulator: pick random country and gift, apply points.
   Interval is randomized 2000-3000ms per your request.
*/
function simulateGift() {
  const idx = Math.floor(Math.random()*countries.length);
  const country = countries[idx];
  const giftKey = chooseGiftFromPool();
  const points = giftValues[giftKey] || 1;
  applyGiftToCountry(country.name, points);
}

/* reset function */
function resetScores() {
  countries.forEach(c => c.coins = 0);
  countries.forEach(c => { prevCoins[c.name] = 0; prevRanks[c.name] = -1; });
  prevTop3 = [];
  updateLeaderboard();
}

/* menu handling */
document.addEventListener("click", (e) => {
  const btn = document.getElementById("menuBtn");
  const dd = document.getElementById("menuDropdown");
  if (e.target === btn) {
    dd.style.display = dd.style.display === "block" ? "none" : "block";
  } else {
    if (!btn.contains(e.target)) dd.style.display = "none";
  }
});
document.getElementById("resetBtn").addEventListener("click", resetScores);

/* initial render */
updateLeaderboard();

/* start randomized simulation every 2-3 seconds */
(function startRandomInterval() {
  const t = 2000 + Math.random()*1000; // 2000-3000ms
  setTimeout(() => {
    simulateGift();
    startRandomInterval();
  }, t);
})();
