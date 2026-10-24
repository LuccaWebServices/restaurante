/**
 * Gera as imagens PLACEHOLDER da demo (SVG ilustrativos + PNG para ícones e Open Graph).
 * Sem dependências: os PNG são desenhados e codificados aqui com node:zlib.
 *
 * Uso:  node tools/gerar-placeholders.mjs          (não substitui ficheiros existentes)
 *       node tools/gerar-placeholders.mjs --force  (substitui tudo)
 *
 * Todas as imagens geradas são originais deste projeto (sem direitos de terceiros).
 * Substitua-as por fotografias reais do cliente — ver CONFIGURACAO.md.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');
const FORCE = process.argv.includes('--force');

function save(rel, data) {
  const file = join(IMG, rel);
  if (existsSync(file) && !FORCE) return console.log(`  = ${rel} (já existe)`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log(`  + ${rel}`);
}

// PRNG determinístico, para as imagens serem sempre iguais
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// ---------------------------------------------------------------- SVG ------
const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${title}</title>${body}</svg>\n`;

const grad = (id, a, b, vertical = true) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

function woodTable(w, h, r, base = ['#6b4528', '#4a2e1a']) {
  let lines = '';
  for (let y = 0; y < h; y += 18 + r() * 30) {
    lines += `<path d="M0 ${y.toFixed(0)} Q ${w / 2} ${(y + (r() - 0.5) * 30).toFixed(0)} ${w} ${y.toFixed(0)}" stroke="#000" stroke-opacity="${(0.05 + r() * 0.08).toFixed(2)}" stroke-width="${(1 + r() * 3).toFixed(1)}" fill="none"/>`;
  }
  return `<defs>${grad('wood', base[0], base[1])}<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#wood)"/>${lines}`;
}

function plate(cx, cy, rad) {
  return `<ellipse cx="${cx}" cy="${cy + rad * 0.06}" rx="${rad * 1.02}" ry="${rad * 1.02}" fill="#000" opacity=".28"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#f4efe6"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${rad * 0.78}" fill="#fbf8f2" stroke="#e3dccf" stroke-width="${rad * 0.02}"/>`;
}

const FOOD = {
  picanha: (cx, cy, s, r) => {
    let o = '';
    for (let i = 0; i < 5; i++) o += `<rect x="${cx - s * 0.55 + i * s * 0.2}" y="${cy - s * 0.45}" width="${s * 0.17}" height="${s * 0.55}" rx="${s * 0.04}" fill="${i % 2 ? '#7a3b25' : '#8c4a2f'}" transform="rotate(${-12 + r() * 6} ${cx} ${cy})"/><rect x="${cx - s * 0.55 + i * s * 0.2}" y="${cy - s * 0.45}" width="${s * 0.17}" height="${s * 0.06}" fill="#efe1c6" transform="rotate(${-12} ${cx} ${cy})"/>`;
    o += `<ellipse cx="${cx + s * 0.25}" cy="${cy + s * 0.35}" rx="${s * 0.3}" ry="${s * 0.16}" fill="#f6f1e4"/>`;
    o += `<ellipse cx="${cx - s * 0.25}" cy="${cy + s * 0.38}" rx="${s * 0.26}" ry="${s * 0.14}" fill="#2a1a17"/>`;
    for (let i = 0; i < 9; i++) o += `<rect x="${cx + s * (0.1 + r() * 0.4)}" y="${cy - s * (0.1 + r() * 0.3)}" width="${s * 0.05}" height="${s * 0.22}" rx="3" fill="#e9b949" transform="rotate(${r() * 90} ${cx + s * 0.3} ${cy - s * 0.2})"/>`;
    return o;
  },
  polvo: (cx, cy, s, r) => {
    let o = '';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = cx + Math.cos(a) * s * 0.28, y = cy + Math.sin(a) * s * 0.28;
      o += `<path d="M${cx} ${cy} Q ${x + s * 0.2} ${y - s * 0.1} ${x + Math.cos(a) * s * 0.25} ${y + Math.sin(a) * s * 0.25}" stroke="#9b3b3b" stroke-width="${s * 0.11}" stroke-linecap="round" fill="none"/>`;
    }
    for (let i = 0; i < 7; i++) o += `<circle cx="${cx + (r() - 0.5) * s * 0.9}" cy="${cy + (r() - 0.5) * s * 0.9}" r="${s * 0.09}" fill="#e8c77d"/>`;
    for (let i = 0; i < 14; i++) o += `<circle cx="${cx + (r() - 0.5) * s}" cy="${cy + (r() - 0.5) * s}" r="${s * 0.02}" fill="#5d7a2b"/>`;
    return o;
  },
  ameijoas: (cx, cy, s, r) => {
    let o = '';
    for (let i = 0; i < 16; i++) {
      const x = cx + (r() - 0.5) * s * 1.1, y = cy + (r() - 0.5) * s * 1.1;
      o += `<ellipse cx="${x}" cy="${y}" rx="${s * 0.12}" ry="${s * 0.09}" fill="#d9c7a8" stroke="#8d7a5c" stroke-width="2" transform="rotate(${r() * 180} ${x} ${y})"/>`;
    }
    for (let i = 0; i < 20; i++) o += `<circle cx="${cx + (r() - 0.5) * s}" cy="${cy + (r() - 0.5) * s}" r="${s * 0.025}" fill="#4f7a2a"/>`;
    o += `<circle cx="${cx + s * 0.45}" cy="${cy - s * 0.4}" r="${s * 0.12}" fill="#f2e14b" stroke="#d7c12f" stroke-width="3"/>`;
    return o;
  },
  dia: (cx, cy, s, r) => {
    let o = `<path d="M${cx - s * 0.5} ${cy} q ${s * 0.25} ${-s * 0.5} ${s * 0.7} ${-s * 0.15} q ${s * 0.1} ${s * 0.4} ${-s * 0.2} ${s * 0.45} z" fill="#d79a4a"/>`;
    for (let i = 0; i < 12; i++) o += `<rect x="${cx + (r() - 0.2) * s * 0.6}" y="${cy + (r() - 0.3) * s * 0.6}" width="${s * 0.06}" height="${s * 0.24}" rx="4" fill="#efc35a" transform="rotate(${r() * 180} ${cx} ${cy})"/>`;
    o += `<ellipse cx="${cx - s * 0.15}" cy="${cy + s * 0.38}" rx="${s * 0.28}" ry="${s * 0.13}" fill="#7da846"/>`;
    o += `<circle cx="${cx - s * 0.25}" cy="${cy + s * 0.35}" r="${s * 0.06}" fill="#c9412f"/>`;
    return o;
  },
  natas: (cx, cy, s, r) => {
    let o = '';
    const pos = [[-0.3, -0.25], [0.3, -0.25], [0, 0.05], [-0.3, 0.35], [0.3, 0.35]];
    for (const [dx, dy] of pos) {
      const x = cx + dx * s, y = cy + dy * s;
      o += `<circle cx="${x}" cy="${y}" r="${s * 0.22}" fill="#c98c3e"/><circle cx="${x}" cy="${y}" r="${s * 0.17}" fill="#f2c14e"/>`;
      for (let i = 0; i < 4; i++) o += `<circle cx="${x + (r() - 0.5) * s * 0.2}" cy="${y + (r() - 0.5) * s * 0.2}" r="${s * 0.035}" fill="#6b3a17" opacity=".75"/>`;
    }
    return o;
  },
};

function dishSVG(w, h, kind, seed, title, base) {
  const r = rng(seed);
  const s = Math.min(w, h) * 0.36;
  let body = woodTable(w, h, r, base);
  body += plate(w / 2, h / 2, s * 1.25);
  body += FOOD[kind](w / 2, h / 2, s, r);
  body += `<rect x="${w / 2 + s * 1.45}" y="${h / 2 - s}" width="${s * 0.09}" height="${s * 2}" rx="${s * 0.04}" fill="#c9c4bb"/>`;
  body += `<rect x="${w / 2 - s * 1.55}" y="${h / 2 - s}" width="${s * 0.09}" height="${s * 2}" rx="${s * 0.04}" fill="#c9c4bb"/>`;
  body += `<rect width="${w}" height="${h}" fill="url(#vig)"/>`;
  return svg(w, h, body, title);
}

function heroSVG(w, h) {
  const r = rng(7);
  let body = woodTable(w, h, r, ['#5a3a22', '#2f1d12']);
  body += plate(w * 0.32, h * 0.55, 230) + FOOD.picanha(w * 0.32, h * 0.55, 180, r);
  body += plate(w * 0.68, h * 0.42, 210) + FOOD.polvo(w * 0.68, h * 0.42, 165, r);
  body += plate(w * 0.86, h * 0.86, 120) + FOOD.ameijoas(w * 0.86, h * 0.86, 90, r);
  // copo de vinho visto de cima
  body += `<circle cx="${w * 0.12}" cy="${h * 0.2}" r="78" fill="#5a0f1e" opacity=".9"/><circle cx="${w * 0.12}" cy="${h * 0.2}" r="78" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="6"/>`;
  body += `<circle cx="${w * 0.5}" cy="${h * 0.12}" r="40" fill="#f0e6d2"/><circle cx="${w * 0.5}" cy="${h * 0.12}" r="28" fill="#3b2316"/>`;
  for (let i = 0; i < 24; i++) body += `<circle cx="${r() * w}" cy="${r() * h}" r="${2 + r() * 3}" fill="#f6efe2" opacity=".5"/>`;
  body += `<rect width="${w}" height="${h}" fill="url(#vig)"/>`;
  return svg(w, h, body, 'Ilustração: mesa com pratos de grelhados');
}

function spaceSVG(w, h, seed, title, variant = 'sala') {
  const r = rng(seed);
  const wall = variant === 'esplanada' ? ['#9fc3d9', '#e9dcc4'] : variant === 'garrafeira' ? ['#3b2a22', '#1f1612'] : ['#c58b5c', '#7d4a2b'];
  let body = `<defs>${grad('wall', wall[0], wall[1])}</defs><rect width="${w}" height="${h}" fill="url(#wall)"/>`;
  if (variant === 'garrafeira') {
    for (let y = h * 0.1; y < h * 0.9; y += 70) for (let x = w * 0.08; x < w * 0.92; x += 46)
      body += `<circle cx="${x}" cy="${y}" r="17" fill="${['#4a0f18', '#2d3b1c', '#5c1220', '#c9b37a'][Math.floor(r() * 4)]}" stroke="#120b08" stroke-width="5"/>`;
    return svg(w, h, body, title);
  }
  if (variant === 'esplanada') {
    body += `<rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="#b98d5c"/>`;
    for (let i = 0; i < 4; i++) {
      const x = w * (0.15 + i * 0.24);
      body += `<path d="M${x - 120} ${h * 0.32} Q ${x} ${h * 0.12} ${x + 120} ${h * 0.32} Z" fill="#f4efe6"/><rect x="${x - 3}" y="${h * 0.32}" width="6" height="${h * 0.36}" fill="#5b4636"/>`;
      body += `<ellipse cx="${x}" cy="${h * 0.7}" rx="70" ry="16" fill="#6e4b2f"/>`;
    }
    return svg(w, h, body, title);
  }
  body += `<rect y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="#3a2416"/>`;
  for (let i = 0; i < 3; i++) body += `<rect x="${w * (0.1 + i * 0.3)}" y="${h * 0.14}" width="${w * 0.18}" height="${h * 0.3}" rx="${w * 0.09}" fill="#f6e3b8" opacity=".55"/>`;
  for (let i = 0; i < 4; i++) {
    const x = w * (0.14 + i * 0.24);
    body += `<line x1="${x}" y1="0" x2="${x}" y2="${h * 0.22}" stroke="#2a1a10" stroke-width="3"/><path d="M${x - 34} ${h * 0.26} L${x - 14} ${h * 0.2} L${x + 14} ${h * 0.2} L${x + 34} ${h * 0.26} Z" fill="#2a1a10"/><circle cx="${x}" cy="${h * 0.27}" r="10" fill="#ffe7a8"/>`;
    body += `<rect x="${x - 80}" y="${h * 0.6}" width="160" height="16" rx="4" fill="#8a5a36"/><rect x="${x - 70}" y="${h * 0.62}" width="10" height="${h * 0.18}" fill="#5a3a22"/><rect x="${x + 60}" y="${h * 0.62}" width="10" height="${h * 0.18}" fill="#5a3a22"/>`;
  }
  return svg(w, h, body, title);
}

function personSVG(w, h, seed, title, colors) {
  const [bg, shirt, skin, hair] = colors;
  const body = `<rect width="${w}" height="${h}" fill="${bg}"/>` +
    `<circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.17}" fill="${skin}"/>` +
    `<path d="M${w / 2 - w * 0.18} ${h * 0.36} a ${w * 0.18} ${w * 0.18} 0 0 1 ${w * 0.36} 0 q ${-w * 0.18} ${-w * 0.08} ${-w * 0.36} 0z" fill="${hair}"/>` +
    `<path d="M${w * 0.18} ${h} q 0 ${-h * 0.32} ${w * 0.32} ${-h * 0.32} q ${w * 0.32} 0 ${w * 0.32} ${h * 0.32} z" fill="${shirt}"/>` +
    `<path d="M${w * 0.4} ${h * 0.7} h ${w * 0.2} v ${h * 0.3} h ${-w * 0.2} z" fill="#f4efe6" opacity=".9"/>`;
  return svg(w, h, body, title);
}

function mapSVG(w, h) {
  const r = rng(42);
  let body = `<rect width="${w}" height="${h}" fill="#ece6da"/>`;
  body += `<path d="M0 ${h * 0.82} Q ${w * 0.4} ${h * 0.7} ${w} ${h * 0.86} L ${w} ${h} L 0 ${h} Z" fill="#a9c8d8"/>`;
  body += `<rect x="${w * 0.62}" y="${h * 0.12}" width="${w * 0.22}" height="${h * 0.3}" rx="20" fill="#c9dcb4"/>`;
  for (let i = 0; i < 9; i++) body += `<line x1="${r() * w}" y1="0" x2="${r() * w}" y2="${h}" stroke="#fff" stroke-width="${8 + r() * 10}"/>`;
  for (let i = 0; i < 7; i++) body += `<line x1="0" y1="${r() * h * 0.8}" x2="${w}" y2="${r() * h * 0.8}" stroke="#fff" stroke-width="${8 + r() * 10}"/>`;
  body += `<path d="M0 ${h * 0.5} C ${w * 0.3} ${h * 0.45} ${w * 0.6} ${h * 0.62} ${w} ${h * 0.55}" stroke="#f4d58d" stroke-width="18" fill="none"/>`;
  body += `<path d="M${w / 2} ${h / 2 - 70} c -30 0 -48 22 -48 46 c 0 34 48 76 48 76 s 48 -42 48 -76 c 0 -24 -18 -46 -48 -46z" fill="#b3261e"/><circle cx="${w / 2}" cy="${h / 2 - 24}" r="16" fill="#fff"/>`;
  return svg(w, h, body, 'Mapa ilustrativo (o mapa real só carrega com o seu consentimento)');
}

const FLAME = 'M16 3.5c1.6 4.6 7.5 7 7.5 13.6a7.5 7.5 0 0 1-15 0c0-3.4 1.8-5.6 3.3-7.6.1 2.6 1.1 4 2.4 4.3-.7-4.2.2-7.6 1.8-10.3z';

function logoMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="15.5" fill="#A63D1F"/><path d="${FLAME}" fill="#FBF6EE" transform="translate(0 1.5) scale(1) "/></svg>\n`;
}

function faviconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#A63D1F"/><path d="${FLAME}" fill="#FBF6EE" transform="translate(0 1.5)"/></svg>\n`;
}

function complaintsSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="66" viewBox="0 0 160 66" role="img"><title>Livro de Reclamações</title><rect x="1" y="1" width="158" height="64" rx="8" fill="#ffffff" stroke="#c8102e" stroke-width="2"/><rect x="12" y="15" width="26" height="36" rx="3" fill="#c8102e"/><path d="M18 24h14M18 30h14M18 36h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><text x="48" y="30" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#1a1a1a">Livro de</text><text x="48" y="47" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#1a1a1a">Reclamações</text></svg>\n`;
}

// ---------------------------------------------------------------- PNG ------
const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
class Canvas {
  constructor(w, h) { this.w = w; this.h = h; this.px = new Float32Array(w * h * 4); }
  blend(x, y, [r, g, b], a) {
    if (a <= 0 || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4, p = this.px;
    const oa = p[i + 3], na = a + oa * (1 - a);
    p[i] = (r * a + p[i] * oa * (1 - a)) / na; p[i + 1] = (g * a + p[i + 1] * oa * (1 - a)) / na;
    p[i + 2] = (b * a + p[i + 2] * oa * (1 - a)) / na; p[i + 3] = na;
  }
  // Desenha uma forma definida por uma função de distância (negativa = dentro), com antialiasing
  sdf(fn, color, box = [0, 0, this.w, this.h], alpha = 1) {
    for (let y = Math.max(0, box[1] | 0); y < Math.min(this.h, box[3]); y++)
      for (let x = Math.max(0, box[0] | 0); x < Math.min(this.w, box[2]); x++) {
        const d = fn(x + 0.5, y + 0.5);
        this.blend(x, y, color, Math.min(1, Math.max(0, 0.5 - d)) * alpha);
      }
  }
  gradient(c1, c2) {
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      const t = (x / this.w) * 0.6 + (y / this.h) * 0.4;
      this.blend(x, y, c1.map((v, k) => v + (c2[k] - v) * t), 1);
    }
  }
  png() {
    const raw = Buffer.alloc((this.w * 4 + 1) * this.h);
    for (let y = 0; y < this.h; y++) {
      raw[y * (this.w * 4 + 1)] = 0;
      for (let x = 0; x < this.w; x++) for (let k = 0; k < 4; k++) {
        const v = this.px[(y * this.w + x) * 4 + k];
        raw[y * (this.w * 4 + 1) + 1 + x * 4 + k] = Math.round(Math.min(1, Math.max(0, k === 3 ? v : v / 255)) * 255);
      }
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.w, 0); ihdr.writeUInt32BE(this.h, 4); ihdr[8] = 8; ihdr[9] = 6;
    return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
  }
}
const circle = (cx, cy, r) => (x, y) => Math.hypot(x - cx, y - cy) - r;
const ring = (cx, cy, r, t) => (x, y) => Math.abs(Math.hypot(x - cx, y - cy) - r) - t / 2;
const roundRect = (x0, y0, x1, y1, rad) => (x, y) => {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hw = (x1 - x0) / 2 - rad, hh = (y1 - y0) / 2 - rad;
  const dx = Math.abs(x - cx) - hw, dy = Math.abs(y - cy) - hh;
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) - rad;
};
// Chama estilizada (gota com ponta) em coordenadas normalizadas
const flame = (cx, cy, s) => (x, y) => {
  const u = (x - cx) / s, v = (y - cy) / s;
  const base = Math.hypot(u, v - 0.2) - 0.42;
  let top;
  if (v < -0.75) top = Math.hypot(u, v + 0.75);
  else if (v <= 0.2) top = (Math.abs(u) - 0.42 * Math.pow((v + 0.75) / 0.95, 1.4)) * 0.8;
  else top = 1;
  return Math.min(base, top) * s;
};

const ACCENT = [166, 61, 31], CREAM = [251, 246, 238];

function iconPNG(size, maskable = false) {
  const c = new Canvas(size, size);
  const pad = maskable ? 0 : size * 0.04;
  c.sdf(maskable ? () => -1 : roundRect(pad, pad, size - pad, size - pad, size * 0.2), ACCENT);
  const s = size * (maskable ? 0.36 : 0.5);
  c.sdf(flame(size / 2, size / 2, s), CREAM);
  return c.png();
}

function ogPNG() {
  const w = 1200, h = 630, c = new Canvas(w, h);
  c.gradient([58, 30, 18], [20, 12, 9]);
  const r = rng(3);
  for (let i = 0; i < 70; i++) {
    const x = r() * w, y = h * 0.55 + r() * h * 0.45, rad = 1 + r() * 4;
    c.sdf(circle(x, y, rad), [255, 140 + r() * 80, 40], [x - 6, y - 6, x + 6, y + 6], 0.4 + r() * 0.5);
  }
  c.sdf(circle(820, 315, 230), [0, 0, 0], [560, 60, 1080, 580], 0.35);
  c.sdf(circle(810, 300, 225), [244, 239, 230], [560, 60, 1060, 560]);
  c.sdf(ring(810, 300, 175, 4), [222, 214, 200], [600, 100, 1020, 500]);
  c.sdf(flame(810, 300, 210), ACCENT, [650, 110, 980, 520]);
  c.sdf(roundRect(1080, 90, 1098, 510, 9), [200, 196, 188], [1070, 80, 1110, 520]);
  c.sdf(roundRect(520, 90, 538, 510, 9), [200, 196, 188], [510, 80, 550, 520]);
  c.sdf(roundRect(70, 250, 430, 262, 6), ACCENT, [60, 240, 440, 272]);
  c.sdf(roundRect(70, 290, 360, 302, 6), [244, 239, 230], [60, 280, 370, 312], 0.7);
  c.sdf(roundRect(70, 330, 300, 342, 6), [244, 239, 230], [60, 320, 310, 352], 0.45);
  return c.png();
}

// ICO com PNG embebido (suportado por todos os browsers atuais)
function icoFromPNG(png, size) {
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  head[6] = size; head[7] = size; head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
  head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
  return Buffer.concat([head, png]);
}

// ---------------------------------------------------------------- run ------
console.log('A gerar placeholders em src/assets/img/ ...');
save('hero/hero.svg', heroSVG(1600, 1000));
save('pratos/prato-do-dia.svg', dishSVG(800, 600, 'dia', 11, 'Ilustração: prato do dia'));
save('pratos/picanha.svg', dishSVG(800, 600, 'picanha', 12, 'Ilustração: picanha na brasa'));
save('pratos/polvo.svg', dishSVG(800, 600, 'polvo', 13, 'Ilustração: polvo à lagareiro'));
save('pratos/ameijoas.svg', dishSVG(800, 600, 'ameijoas', 14, 'Ilustração: amêijoas à Bulhão Pato'));
save('sobre/sala.svg', spaceSVG(1000, 1200, 21, 'Ilustração: sala do restaurante'));
save('equipa/chef.svg', personSVG(600, 600, 31, 'Ilustração: retrato do chef', ['#e6d3b8', '#2b2b2b', '#d9a77f', '#3b2a20']));
save('equipa/sala.svg', personSVG(600, 600, 32, 'Ilustração: retrato da responsável de sala', ['#d8c6c0', '#7a2e1d', '#e0b48f', '#5a3a22']));
save('equipa/pastelaria.svg', personSVG(600, 600, 33, 'Ilustração: retrato do pasteleiro', ['#cfd8cf', '#f4efe6', '#c99572', '#1f1a17']));
save('galeria/galeria-01.svg', dishSVG(1200, 900, 'picanha', 41, 'Ilustração: picanha na grelha', ['#3a2a20', '#1a120d']));
save('galeria/galeria-02.svg', spaceSVG(1200, 900, 42, 'Ilustração: sala principal'));
save('galeria/galeria-03.svg', dishSVG(1200, 900, 'polvo', 43, 'Ilustração: polvo à lagareiro'));
save('galeria/galeria-04.svg', spaceSVG(1200, 900, 44, 'Ilustração: esplanada', 'esplanada'));
save('galeria/galeria-05.svg', personSVG(1200, 900, 45, 'Ilustração: chef na grelha', ['#5a3a22', '#2b2b2b', '#d9a77f', '#3b2a20']));
save('galeria/galeria-06.svg', dishSVG(1200, 900, 'natas', 46, 'Ilustração: pastéis de nata'));
save('galeria/galeria-07.svg', spaceSVG(1200, 900, 47, 'Ilustração: garrafeira', 'garrafeira'));
save('galeria/galeria-08.svg', dishSVG(1200, 900, 'ameijoas', 48, 'Ilustração: amêijoas'));
save('mapa/mapa-placeholder.svg', mapSVG(1200, 700));
save('logo/logo-mark.svg', logoMarkSVG());
save('legal/livro-reclamacoes.svg', complaintsSVG());
save('icons/favicon.svg', faviconSVG());
save('og/og-image.png', ogPNG());
const png32 = iconPNG(32);
save('icons/favicon.ico', icoFromPNG(png32, 32));
save('icons/apple-touch-icon.png', iconPNG(180, true));
save('icons/icon-192.png', iconPNG(192));
save('icons/icon-512.png', iconPNG(512));
save('icons/icon-maskable-512.png', iconPNG(512, true));
console.log('Concluído.');
