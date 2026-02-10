import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'img');

const input = path.join(IMG_DIR, 'price.png');

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

if (!(await exists(input))) {
  console.error(`Missing input: ${input}`);
  process.exit(1);
}

const image = sharp(input, { failOn: 'none' });
const meta = await image.metadata();

// Keep quality high; reduce bytes via modern codecs and sensible sizes.
const widths = [640, 960, 1280];

const out = (name) => path.join(IMG_DIR, name);

const tasks = [];

for (const w of widths) {
  tasks.push(
    sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 55, effort: 6 })
      .toFile(out(`price-${w}.avif`))
  );

  tasks.push(
    sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(out(`price-${w}.webp`))
  );
}

// PNG fallback (smaller than the original giant source)
tasks.push(
  sharp(input)
    .resize({ width: 1280, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(out('price-1280.png'))
);

// Social sharing image (recommended 1200x630)
tasks.push(
  sharp(input)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out('price-og.jpg'))
);

await Promise.all(tasks);

console.log('Asset optimization complete.');
console.log(`Input: price.png (${meta.width}x${meta.height})`);
console.log('Generated:');
for (const f of [
  'price-640.avif',
  'price-960.avif',
  'price-1280.avif',
  'price-640.webp',
  'price-960.webp',
  'price-1280.webp',
  'price-1280.png',
  'price-og.jpg'
]) {
  console.log(` - img/${f}`);
}
