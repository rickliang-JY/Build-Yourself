// Compresses photos in place: downsizes to a max long edge and re-encodes as JPEG.
// Drop a full-res photo into photos/ then run this before committing.
// Already-small JPEGs are skipped so re-runs don't degrade quality.
import { readdirSync, statSync, readFileSync, writeFileSync, unlinkSync, existsSync, chmodSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const PHOTO_DIR = "photos";
const MAX_EDGE = 1600;        // px, long side
const QUALITY = 82;
const SKIP_UNDER_BYTES = 800 * 1024; // skip .jpg already under this size and within MAX_EDGE
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".tif", ".tiff", ".bmp"]);

const root = process.cwd();
const dir = join(root, PHOTO_DIR);

let files;
try {
  files = readdirSync(dir);
} catch {
  console.log("No photos/ folder — nothing to compress.");
  process.exit(0);
}

let changed = 0;
for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!IMG_EXT.has(ext)) continue;

  const srcPath = join(dir, file);
  const date = basename(file, extname(file));
  const outPath = join(dir, `${date}.jpg`);

  const meta = await sharp(srcPath).metadata();
  const longEdge = Math.max(meta.width || 0, meta.height || 0);
  const size = statSync(srcPath).size;

  const alreadySmall =
    ext === ".jpg" && longEdge <= MAX_EDGE && size <= SKIP_UNDER_BYTES;
  if (alreadySmall) continue;

  const input = readFileSync(srcPath); // buffer first so we can overwrite same path
  const output = await sharp(input)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();

  if (existsSync(outPath)) {
    try { chmodSync(outPath, 0o644); } catch { /* best effort: clear read-only */ }
  }
  writeFileSync(outPath, output);
  if (srcPath !== outPath) unlinkSync(srcPath); // drop the non-jpg original

  const before = (size / 1024).toFixed(0);
  const after = (output.length / 1024).toFixed(0);
  console.log(`${file} -> ${date}.jpg  ${before}KB -> ${after}KB`);
  changed++;
}

console.log(changed ? `Compressed ${changed} photo(s).` : "Nothing to compress.");
