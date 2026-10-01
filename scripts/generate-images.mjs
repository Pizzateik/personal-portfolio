import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const images = [
  { source: 'eik', directory: 'photos', widths: [200, 400, 600], fallback: 400 },
  { source: 'arya', directory: 'photos', widths: [160, 320, 480], fallback: 320 },
  { source: 'Sometime_BG', directory: 'projects/sometime', widths: [640, 960, 1280, 1640, 2460], fallback: 1280 },
];

for (const image of images) {
  for (const width of image.widths) {
    const name = width === image.fallback ? image.source : `${image.source}-${width}`;
    const destination = resolve(root, 'public', image.directory, `${name}.webp`);
    await mkdir(dirname(destination), { recursive: true });
    const result = await sharp(resolve(root, 'assets/source', `${image.source}.webp`))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(destination);
    console.log(`${image.directory}/${name}.webp: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
}
