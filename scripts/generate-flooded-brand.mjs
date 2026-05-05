/**
 * Regenerate app/web icons from FloodedMark geometry (three rounded bars).
 * Run: node scripts/generate-flooded-brand.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../assets/images');

/** Matches components/FloodedMark.tsx proportions (unit = size/10). */
function floodedMarkSvg(opts) {
  const {
    canvas,
    background,
    barColor,
    transparentBg,
  } = opts;
  const W = canvas;
  const unit = W / 14;
  const barH = 1.5 * unit;
  const gap = 1.5 * unit;
  const rx = 0.5 * unit;
  const contentW = 10 * unit;
  const contentH = 7.5 * unit;
  const ox = (W - contentW) / 2;
  const oy = (W - contentH) / 2;

  const bars = [
    { x: ox, y: oy, w: 10 * unit },
    { x: ox, y: oy + barH + gap, w: 7 * unit },
    { x: ox, y: oy + 2 * (barH + gap), w: 4.5 * unit },
  ];

  const bg =
    transparentBg
      ? ''
      : `<rect width="${W}" height="${W}" fill="${background}"/>`;

  const rects = bars
    .map(
      (b) =>
        `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${barH}" rx="${rx}" fill="${barColor}"/>`,
    )
    .join('');

  return `<svg width="${W}" height="${W}" xmlns="http://www.w3.org/2000/svg">${bg}${rects}</svg>`;
}

async function toPng(svg, file, resize) {
  let pipeline = sharp(Buffer.from(svg)).png();
  if (resize) {
    pipeline = pipeline.resize(resize, resize);
  }
  const buf = await pipeline.toBuffer();
  writeFileSync(file, buf);
  console.log('wrote', file);
}

const ACCENT = '#1A3C5C';

await toPng(
  floodedMarkSvg({
    canvas: 1024,
    background: '#FFFFFF',
    barColor: ACCENT,
    transparentBg: false,
  }),
  join(OUT, 'icon.png'),
);

await toPng(
  floodedMarkSvg({
    canvas: 1024,
    background: '#00000000',
    barColor: ACCENT,
    transparentBg: true,
  }),
  join(OUT, 'adaptive-icon.png'),
);

await toPng(
  floodedMarkSvg({
    canvas: 1024,
    background: '#00000000',
    barColor: '#FFFFFF',
    transparentBg: true,
  }),
  join(OUT, 'splash-icon.png'),
);

await toPng(
  floodedMarkSvg({
    canvas: 512,
    background: '#FFFFFF',
    barColor: ACCENT,
    transparentBg: false,
  }),
  join(OUT, 'favicon.png'),
  48,
);

console.log('Done.');
