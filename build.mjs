#!/usr/bin/env node
/**
 * BUILD DO SITE — sem dependências (só Node.js ≥ 18).
 *
 *   node build.mjs            gera o site em docs/
 *   node build.mjs --serve    gera e abre um servidor local (http://localhost:8080/...)
 *   node build.mjs --strict   falha se ainda houver [PLACEHOLDERS] por preencher (usar antes de lançar)
 *
 * Lê site.config.js, valida tudo, e escreve em docs/ as páginas PT e EN,
 * sitemap.xml, robots.txt, site.webmanifest, 404.html, CNAME e os assets.
 * A pasta docs/ é REGENERADA a cada build: não edite ficheiros lá dentro.
 */
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { PAGE_PATHS, SECTION_IDS, UI } from './src/i18n/ui.mjs';
import { validate } from './src/build/validate.mjs';
import { runtimeHours } from './src/build/hours.mjs';
import { fill, tr } from './src/build/util.mjs';
import { homePage, menuPage, privacyPage, notFoundPage } from './src/templates/pages.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'docs');
const args = new Set(process.argv.slice(2));

const c = { red: (s) => `\x1b[31m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m` };
const fail = (title, lines = []) => {
  console.error(`\n${c.red(c.bold(`✖ ${title}`))}`);
  lines.forEach((l) => console.error(c.red(`  • ${l}`)));
  console.error(c.dim('\n  Corrija site.config.js e volte a correr: node build.mjs\n'));
  process.exit(1);
};

/* ------------------------------------------------------- 1. CONFIGURAÇÃO -- */
let cfg;
try {
  cfg = (await import(pathToFileURL(join(ROOT, 'site.config.js')).href)).default;
} catch (e) {
  fail('Não foi possível ler site.config.js (erro de sintaxe?)', [
    e.message,
    'Dicas: falta uma vírgula no fim de uma linha? Aspas ou chavetas por fechar? Um apóstrofo dentro de texto com plicas (use aspas "..." ou ’)?',
  ]);
}
if (!cfg || typeof cfg !== 'object') fail('site.config.js tem de exportar um objeto: export default { ... }');

const { errors, warnings } = validate(cfg, SRC);
if (errors.length) fail(`A configuração tem ${errors.length} erro(s):`, errors);

/* ------------------------------------------------------------- 2. TEMA -- */
// Cores de fundo de cada tema (manter em sincronia com src/css/themes.css)
const THEMES = {
  tradicional: { hero: 'image', bg: '#FBF6EE', themeColor: '#2B1D14', fonts: ['lora-latin-wght-normal.woff2', 'inter-latin-wght-normal.woff2'] },
  moderno: { hero: 'split', bg: '#FFFFFF', themeColor: '#FFFFFF', fonts: ['inter-latin-wght-normal.woff2'] },
  elegante: { hero: 'image', bg: '#141112', themeColor: '#141112', fonts: ['playfair-display-latin-wght-normal.woff2', 'inter-latin-wght-normal.woff2'] },
};
const theme = THEMES[cfg.theme.name];
const heroLayout = cfg.theme.heroLayout || theme.hero;

// Verificação de contraste (WCAG AA) das cores sobrepostas
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const col = cfg.theme.colors || {};
let overrides = '';
if (col.accent || col.accentContrast || col.accentText) {
  const vars = [];
  if (col.accent) vars.push(`--accent:${col.accent}`);
  if (col.accentContrast) vars.push(`--accent-contrast:${col.accentContrast}`);
  if (col.accentText) vars.push(`--accent-text:${col.accentText}`);
  overrides = `\n/* Cores sobrepostas em site.config.js */\n:root[data-theme="${cfg.theme.name}"]{${vars.join(';')}}\n`;
  if (col.accent && col.accentContrast) {
    const r = contrast(col.accent, col.accentContrast);
    if (r < 4.5) warnings.push(`theme.colors: contraste entre accent e accentContrast é ${r.toFixed(2)}:1 (mínimo AA: 4.5:1).`);
  } else if (col.accent) warnings.push('theme.colors: definiu accent sem accentContrast; confirme que o texto dos botões tem contraste suficiente.');
  if (col.accentText) {
    const r = contrast(col.accentText, theme.bg);
    if (r < 4.5) warnings.push(`theme.colors.accentText: contraste com o fundo do tema é ${r.toFixed(2)}:1 (mínimo AA: 4.5:1).`);
  }
}

/* ----------------------------------------------------------- 3. ASSETS -- */
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const cssMin = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n').replace(/\n{2,}/g, '\n').trim();

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const dir of ['fonts', 'img', 'vendor', 'pdf']) {
  const from = join(SRC, 'assets', dir);
  if (existsSync(from)) cpSync(from, join(OUT, 'assets', dir), { recursive: true });
}

const cssParts = ['fonts.css', 'themes.css', 'base.css', 'components.css', 'sections.css'].map((f) => cssMin(readFileSync(join(SRC, 'css', f), 'utf8')));
const css = `${readFileSync(join(SRC, 'assets/vendor/bootstrap/bootstrap.min.css'), 'utf8').replace(/\/\*# sourceMappingURL=.*?\*\//, '')}\n${cssParts.join('\n')}${overrides}`;
mkdirSync(join(OUT, 'assets/css'), { recursive: true });
writeFileSync(join(OUT, 'assets/css/site.css'), css);

const js = readFileSync(join(SRC, 'js/main.js'), 'utf8');
mkdirSync(join(OUT, 'assets/js'), { recursive: true });
writeFileSync(join(OUT, 'assets/js/main.js'), js);
// Remove o sourcemap do Bootstrap (evita um pedido 404 nas ferramentas do browser)
const bsJs = join(OUT, 'assets/vendor/bootstrap/bootstrap.bundle.min.js');
writeFileSync(bsJs, readFileSync(bsJs, 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, ''));

// Ícones (SVG → <symbol>), incluídos em cada página só se forem usados
const ICONS = {};
for (const f of readdirSync(join(SRC, 'assets/icons'))) {
  if (!f.endsWith('.svg')) continue;
  const raw = readFileSync(join(SRC, 'assets/icons', f), 'utf8').replace(/^﻿/, '');
  const open = raw.match(/<svg([^>]*)>/)[1];
  const attr = (n) => (open.match(new RegExp(`\\s${n}="([^"]*)"`)) || [])[1];
  const keep = ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].map((n) => (attr(n) ? ` ${n}="${attr(n)}"` : '')).join('');
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  ICONS[f.replace('.svg', '')] = `<symbol id="i-${f.replace('.svg', '')}" viewBox="${attr('viewBox') || '0 0 16 16'}"><g${keep || ' fill="currentColor"'}>${inner}</g></symbol>`;
}

/* -------------------------------------------- 4. SCRIPT INLINE + CSP -- */
const inlineScript = cfg.site.demo
  ? "!function(d){d.classList.add('js');try{var s=localStorage,t=s.getItem('rt-theme'),h=s.getItem('rt-hero');if(t&&/^(tradicional|moderno|elegante)$/.test(t)){d.setAttribute('data-theme',t);t==='elegante'?d.setAttribute('data-bs-theme','dark'):d.removeAttribute('data-bs-theme')}if(h&&/^(image|split)$/.test(h))d.setAttribute('data-hero',h)}catch(e){}}(document.documentElement);"
  : "document.documentElement.classList.add('js');";
const scriptHash = createHash('sha256').update(inlineScript).digest('base64');
const mapOn = cfg.sections.location && cfg.location?.map?.enabled;
const csp = [
  "default-src 'self'",
  `script-src 'self' 'sha256-${scriptHash}'`,
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${cfg.form?.enabled ? ' https://api.emailjs.com' : ''}`,
  `frame-src ${mapOn ? 'https://www.google.com' : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
].join('; ');

const build = {
  theme: cfg.theme.name,
  hero: heroLayout,
  themeColor: theme.themeColor,
  fontPreloads: theme.fonts.map((f) => `assets/fonts/${f}`),
  cssFile: `assets/css/site.css?v=${hash(css)}`,
  jsFile: `assets/js/main.js?v=${hash(js)}`,
  inlineScript,
  csp,
};

/* ---------------------------------------------------------- 5. CONTEXTO -- */
const siteUrl = cfg.site.url;
const basePath = new URL(siteUrl).pathname; // ex.: /restaurante-demo/
const { lat, lng } = cfg.business.geo;
const directions = {
  google: cfg.location?.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
  apple: `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(cfg.business.name)}`,
};

function makeCtx(lang, pageKey) {
  const alt = lang === 'pt' ? 'en' : 'pt';
  const paths = PAGE_PATHS[lang];
  const pathKey = paths[pageKey] !== undefined ? pageKey : 'home';
  const root = pageKey === '404' ? '' : '../'.repeat((paths[pathKey].match(/\//g) || []).length);
  const ids = SECTION_IDS[lang];
  const usedIcons = new Set();
  let altCounter = 0;

  const ctx = {
    cfg, lang, build, ids, root, directions,
    page: pageKey,
    ui: UI[lang],
    uiAlt: UI[alt],
    base: pageKey === '404' ? basePath : '',
    fill,
    t: (v) => tr(v, lang),
    asset: (p) => `${root}${p}`,
    abs: (k, l = lang) => `${siteUrl}${PAGE_PATHS[l][k] ?? PAGE_PATHS[l].home}`,
    absAsset: (p) => `${siteUrl}${p}`,
    href(target, sectionKey) {
      const hashPart = sectionKey ? `#${ids[sectionKey]}` : '';
      if (target === pageKey && hashPart) return hashPart;
      return `${root}${paths[target]}` === '' ? `./${hashPart}` : `${root}${paths[target]}${hashPart}`;
    },
    sectionHref(k) {
      if (k === 'menu' && cfg.menu?.ownPage) return ctx.href('menu');
      return ctx.href('home', k);
    },
    langHref(l) {
      const target = `${root}${PAGE_PATHS[l][pathKey]}`;
      return target === '' ? './' : target;
    },
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    mapEmbed: `https://www.google.com/maps?q=${lat},${lng}&z=${cfg.location?.map?.zoom || 16}&hl=${lang === 'pt' ? 'pt-PT' : 'en'}&output=embed`,
    nextAlt: () => (altCounter++ % 2 ? 'section--alt' : ''),
    icon(name, cls = '') {
      if (!ICONS[name]) throw new Error(`Ícone desconhecido "${name}". Adicione src/assets/icons/${name}.svg (Bootstrap Icons).`);
      usedIcons.add(name);
      return `<svg class="icon${cls ? ` ${cls}` : ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
    },
    sprite: () => `<svg class="svg-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${[...usedIcons].map((n) => ICONS[n]).join('')}</svg>`,
    pageData() {
      const u = UI[lang];
      const sectionMap = {};
      for (const k of Object.keys(ids)) sectionMap[ids[k]] = SECTION_IDS[alt][k];
      return {
        lang,
        locale: u.locale,
        hours: runtimeHours(cfg.hours),
        sectionMap,
        demo: !!cfg.site.demo,
        langSuggestion: !!cfg.features?.langSuggestion,
        animations: cfg.features?.animations !== false,
        maxPeople: cfg.form?.maxPeople || 20,
        t: {
          open: u.statusOpen, closingSoon: u.statusClosingSoon, closed: u.statusClosed,
          closesAt: u.statusClosesAt, opensToday: u.statusOpensToday, opensTomorrow: u.statusOpensTomorrow,
          opensOn: u.statusOpensOn, opensDate: u.statusOpensDate, today: u.today, daysOn: u.daysOn,
          filterCount: u.filterCount, filterCountOne: u.filterCountOne, galleryCounter: u.galleryCounter,
          form: u.form,
        },
      };
    },
  };
  return ctx;
}

/* ----------------------------------------------------------- 6. PÁGINAS -- */
const write = (rel, content) => {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};
const pagesOut = [];
const menuPageOn = cfg.sections.menu && cfg.menu.ownPage;

try {
  for (const lang of ['pt', 'en']) {
    const P = PAGE_PATHS[lang];
    write(`${P.home}index.html`, homePage(makeCtx(lang, 'home')));
    if (menuPageOn) write(`${P.menu}index.html`, menuPage(makeCtx(lang, 'menu')));
    write(`${P.privacy}index.html`, privacyPage(makeCtx(lang, 'privacy')));
  }
  write('404.html', notFoundPage(makeCtx('pt', '404'), makeCtx('en', '404')));
} catch (e) {
  fail('Erro ao gerar as páginas', [e.message]);
}
pagesOut.push('home', ...(menuPageOn ? ['menu'] : []), 'privacy');

/* ------------------------------------------- 7. SITEMAP, ROBOTS, ETC. -- */
const today = new Date().toISOString().slice(0, 10);
const url = (k, l) => `${siteUrl}${PAGE_PATHS[l][k]}`;
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pagesOut.flatMap((k) => ['pt', 'en'].map((l) => `  <url>
    <loc>${url(k, l)}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt-PT" href="${url(k, 'pt')}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${url(k, 'en')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(k, 'pt')}"/>
  </url>`)).join('\n')}
</urlset>
`);

write('robots.txt', `# robots.txt — gerado por build.mjs
# Nota: os motores de busca só leem robots.txt na RAIZ do domínio.
# Num site em utilizador.github.io/repositorio/ este ficheiro não é lido; com domínio próprio, é.
User-agent: *
Allow: /

Sitemap: ${siteUrl}sitemap.xml
`);

write('site.webmanifest', JSON.stringify({
  name: cfg.business.name,
  short_name: cfg.business.shortName || cfg.business.name,
  description: tr(cfg.business.slogan, 'pt'),
  lang: 'pt-PT',
  start_url: './',
  scope: './',
  display: 'minimal-ui',
  background_color: theme.bg,
  theme_color: theme.themeColor,
  icons: [
    { src: 'assets/img/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/img/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'assets/img/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));

write('.nojekyll', ''); // o GitHub Pages serve os ficheiros tal como estão (sem Jekyll)
if (cfg.site.customDomain) write('CNAME', `${cfg.site.customDomain}\n`);
// favicon.ico na raiz: os browsers pedem-no automaticamente
cpSync(join(SRC, 'assets/img/icons/favicon.ico'), join(OUT, 'favicon.ico'));

/* -------------------------------------------- 8. PLACEHOLDERS + RESUMO -- */
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const placeholders = new Map();
for (const file of walk(OUT).filter((f) => f.endsWith('.html'))) {
  const text = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of text.matchAll(/\[([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ0-9 _./,:()ºª-]{2,80}(?:,\s*e\.g\.[^\]]*|,\s*ex\.:[^\]]*)?)\]/g)) {
    const key = `[${m[1]}]`;
    placeholders.set(key, (placeholders.get(key) || new Set()).add(relative(OUT, file).split(sep).join('/')));
  }
}

const files = walk(OUT).length;
console.log(`\n${c.green(c.bold('✔ Site gerado em docs/'))} ${c.dim(`(${files} ficheiros · tema "${cfg.theme.name}" · hero "${heroLayout}")`)}`);
const active = Object.entries(cfg.sections).filter(([, v]) => v).map(([k]) => k);
const off = Object.entries(cfg.sections).filter(([, v]) => !v).map(([k]) => k);
console.log(c.dim(`  Secções ligadas: ${active.join(', ') || '—'}`));
if (off.length) console.log(c.dim(`  Secções desligadas: ${off.join(', ')}`));
if (cfg.site.demo) console.log(c.yellow('  ⚠ Modo demo ativo (site.demo: true): faixa "site de demonstração" e seletor de temas visíveis.'));
if (cfg.site.noindex) console.log(c.yellow('  ⚠ site.noindex: true — os motores de busca NÃO vão indexar o site.'));

if (warnings.length) {
  console.log(c.yellow(`\n  Avisos (${warnings.length}):`));
  warnings.forEach((w) => console.log(c.yellow(`  • ${w}`)));
}
if (placeholders.size) {
  console.log(c.yellow(`\n  Campos por preencher encontrados no site (${placeholders.size}):`));
  for (const [k, where] of placeholders) console.log(c.yellow(`  • ${k}`) + c.dim(`  → ${[...where].slice(0, 3).join(', ')}${where.size > 3 ? '…' : ''}`));
  if (args.has('--strict')) fail('Modo --strict: preencha todos os [PLACEHOLDERS] antes de publicar.');
}
console.log('');

/* ------------------------------------------------------------- 9. SERVE -- */
if (args.has('--serve')) {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf', '.json': 'application/json' };
  const port = Number(process.env.PORT) || 8080;
  createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!path.startsWith(basePath)) { res.writeHead(302, { Location: basePath }); return res.end(); }
    path = path.slice(basePath.length);
    let file = join(OUT, path);
    if (!file.startsWith(OUT)) { res.writeHead(403); return res.end(); }
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!path.endsWith('/') && path !== '') { res.writeHead(301, { Location: `${basePath}${path}/` }); return res.end(); }
      file = join(file, 'index.html');
    }
    const found = existsSync(file);
    const target = found ? file : join(OUT, '404.html');
    res.writeHead(found ? 200 : 404, { 'Content-Type': TYPES[extname(target)] || 'application/octet-stream' });
    res.end(readFileSync(target));
  }).listen(port, () => console.log(c.green(`  ▶ Pré-visualização: http://localhost:${port}${basePath}`) + c.dim('   (Ctrl+C para parar)\n')));
}
