async function main() {
  const date = new URLSearchParams(location.search).get("d");
  const titleEl = document.getElementById("day-title");
  const photoEl = document.getElementById("day-photo");
  const contentEl = document.getElementById("day-content");

  if (!date) {
    titleEl.textContent = "未指定日期";
    photoEl.remove();
    return;
  }

  titleEl.textContent = date;
  document.title = `${date} · 自拍`;

  let day = null;
  try {
    const manifest = await (await fetch("manifest.json", { cache: "no-cache" })).json();
    day = (manifest.days || []).find((d) => d.date === date);
  } catch { /* fall back to convention below */ }

  if (day && day.photo) {
    photoEl.src = day.photo;
    photoEl.alt = date;
  } else {
    photoEl.remove();
  }

  const entry = (day && day.entry) || `entries/${date}.md`;
  try {
    const res = await fetch(entry, { cache: "no-cache" });
    if (!res.ok) throw new Error();
    contentEl.innerHTML = marked.parse(await res.text());
  } catch {
    contentEl.innerHTML = '<p class="empty">这一天还没有文字记录。</p>';
  }
}

main();
