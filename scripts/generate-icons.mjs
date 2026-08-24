#!/usr/bin/env node
// BEE-29: generates the PWA icons (public/icons/icon-{192,512}.png) with zero
// dependencies — a hand-rolled PNG encoder (zlib is built into Node) drawing a
// simple beer-mug glyph on the app's amber accent.
//
// Run once and commit the output:  node scripts/generate-icons.mjs

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");

// ---- minimal PNG encoder (8-bit RGBA) --------------------------------------

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // filter 0 on every scanline
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rgba.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- scene: beer mug on amber ----------------------------------------------
// Colors: bg amber-600 #d97706 (the app accent / manifest theme color),
// mug white, beer amber-800.

const BG = [217, 119, 6];
const WHITE = [255, 255, 255];
const BEER = [146, 64, 14];

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function inRoundedRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.max(x0 + r, Math.min(x, x1 - r));
  const cy = Math.max(y0 + r, Math.min(y, y1 - r));
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;

/**
 * Color at normalized point (x, y) in [0,1]². The glyph sits inside the center
 * ~62% so the same art works for maskable icons (safe zone is the inner 80%).
 */
function colorAt(x, y) {
  // Handle: ring on the right of the mug, clipped so it doesn't cross the body.
  const HCX = 0.655;
  const HCY = 0.545;
  if (x >= 0.6 && inCircle(x, y, HCX, HCY, 0.105) && !inCircle(x, y, HCX, HCY, 0.058)) {
    return WHITE;
  }

  // Mug body.
  const inBody = inRoundedRect(x, y, 0.3, 0.345, 0.615, 0.755, 0.035);
  if (inBody) {
    // Beer fill inside the glass with two glass "ridges" cut out of it.
    const inFill = inRoundedRect(x, y, 0.335, 0.415, 0.58, 0.72, 0.02);
    const ridge =
      (x >= 0.402 && x <= 0.43 && y >= 0.44 && y <= 0.695) ||
      (x >= 0.487 && x <= 0.515 && y >= 0.44 && y <= 0.695);
    if (inFill && !ridge) return BEER;
    return WHITE;
  }

  // Foam: bumps riding along the mug rim.
  if (
    inCircle(x, y, 0.345, 0.335, 0.062) ||
    inCircle(x, y, 0.43, 0.3, 0.075) ||
    inCircle(x, y, 0.525, 0.325, 0.068) ||
    inCircle(x, y, 0.59, 0.35, 0.05) ||
    inRoundedRect(x, y, 0.3, 0.32, 0.615, 0.375, 0.02)
  ) {
    return WHITE;
  }

  return BG;
}

function render(size) {
  const SS = 4; // supersampling factor for smooth edges
  const big = size * SS;
  const rgba = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = clamp01((px * SS + sx + 0.5) / big);
          const y = clamp01((py * SS + sy + 0.5) / big);
          const [cr, cg, cb] = colorAt(x, y);
          r += cr;
          g += cg;
          b += cb;
        }
      }
      const i = (py * size + px) * 4;
      const n = SS * SS;
      rgba[i] = Math.round(r / n);
      rgba[i + 1] = Math.round(g / n);
      rgba[i + 2] = Math.round(b / n);
      rgba[i + 3] = 255;
    }
  }
  return encodePng(size, size, rgba);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const size of [192, 512]) {
  const file = join(OUT_DIR, `icon-${size}.png`);
  writeFileSync(file, render(size));
  console.log(`wrote ${file}`);
}
