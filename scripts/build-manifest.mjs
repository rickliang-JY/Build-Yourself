// Scans photos/ and entries/ and regenerates manifest.json.
// A "day" is any image in photos/ named YYYY-MM-DD.<ext>.
// If entries/<date>.md exists, the card links to the detail page.
import { readdirSync, existsSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";

const root = process.cwd();
const PHOTO_DIR = "photos";
const ENTRY_DIR = "entries";
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"]);

function list(dir) {
  try {
    return readdirSync(join(root, dir));
  } catch {
    return [];
  }
}

const days = list(PHOTO_DIR)
  .filter((f) => IMG_EXT.has(extname(f).toLowerCase()))
  .map((file) => {
    const date = basename(file, extname(file));
    const entry = `${ENTRY_DIR}/${date}.md`;
    return {
      date,
      photo: `${PHOTO_DIR}/${file}`,
      entry: existsSync(join(root, entry)) ? entry : null,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

writeFileSync(join(root, "manifest.json"), JSON.stringify({ days }, null, 2) + "\n");
console.log(`Wrote manifest.json with ${days.length} day(s).`);
