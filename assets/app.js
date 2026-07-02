async function loadJSON(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

async function main() {
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  const count = document.getElementById("count");

  try {
    const config = await loadJSON("config.json");
    if (config.title) {
      document.getElementById("site-title").textContent = config.title;
      document.title = config.title;
    }
    if (config.subtitle) {
      document.getElementById("site-subtitle").textContent = config.subtitle;
    }
  } catch { /* config optional */ }

  let days = [];
  try {
    days = (await loadJSON("manifest.json")).days || [];
  } catch { /* manifest may not exist yet */ }

  count.textContent = `共 ${days.length} 天`;
  if (!days.length) {
    empty.hidden = false;
    return;
  }

  for (const day of days) {
    const card = document.createElement(day.entry ? "a" : "div");
    card.className = "card";
    if (day.entry) card.href = `day.html?d=${encodeURIComponent(day.date)}`;

    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = day.photo;
    img.alt = day.date;

    const cap = document.createElement("span");
    cap.className = "date";
    cap.textContent = day.date;

    card.append(img, cap);
    grid.append(card);
  }
}

main();
