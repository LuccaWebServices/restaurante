/**
 * Validação de site.config.js. Devolve { errors, warnings } com mensagens claras,
 * indicando sempre o CAMINHO do campo (ex.: business.address.city).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ALLERGENS, DIETS, PAYMENTS, DAY_KEYS } from '../i18n/ui.mjs';
import { SHIFT_RE } from './hours.mjs';

const THEMES = ['tradicional', 'moderno', 'elegante'];
const SECTIONS = ['dailySpecial', 'menu', 'about', 'team', 'gallery', 'events', 'testimonials', 'reservations', 'delivery', 'hours', 'location', 'faq', 'contact'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const HEX_RE = /^#[0-9a-f]{6}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export { SECTIONS, THEMES };

export function validate(cfg, srcDir) {
  const errors = [];
  const warnings = [];
  const err = (path, msg) => errors.push(`${path}: ${msg}`);
  const warn = (path, msg) => warnings.push(`${path}: ${msg}`);

  const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), cfg);
  const required = (path, type = 'string') => {
    const v = get(path);
    if (v == null || (type === 'string' && String(v).trim() === '')) { err(path, 'campo obrigatório em falta.'); return false; }
    if (type === 'number' && typeof v !== 'number') { err(path, `deve ser um número (recebido: ${JSON.stringify(v)}).`); return false; }
    if (type === 'array' && !Array.isArray(v)) { err(path, 'deve ser uma lista [ ... ].'); return false; }
    if (type === 'object' && (typeof v !== 'object' || Array.isArray(v))) { err(path, 'deve ser um objeto { ... }.'); return false; }
    return true;
  };
  const i18n = (path, value = get(path)) => {
    if (value == null) return err(path, 'texto em falta. Use { pt: "...", en: "..." }.');
    if (typeof value === 'string') return err(path, 'precisa de versão PT e EN: { pt: "...", en: "..." }.');
    for (const l of ['pt', 'en']) {
      const v = value[l];
      if (v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length)) err(`${path}.${l}`, 'tradução em falta.');
    }
  };
  const image = (path, value = get(path), { needAlt = true } = {}) => {
    if (!value) return err(path, 'imagem em falta. Use { src, width, height, alt: { pt, en } }.');
    if (!value.src) return err(`${path}.src`, 'caminho da imagem em falta.');
    if (!existsSync(join(srcDir, value.src))) err(`${path}.src`, `o ficheiro "src/${value.src}" não existe.`);
    if (!(value.width > 0) || !(value.height > 0)) err(path, 'indique width e height (em píxeis) para evitar saltos de layout.');
    if (needAlt) i18n(`${path}.alt`, value.alt);
  };
  const url = (path, value = get(path), { optional = true } = {}) => {
    if (!value) { if (!optional) err(path, 'link em falta.'); return; }
    if (!/^https?:\/\//.test(value)) err(path, `link inválido "${value}" (deve começar por https://).`);
  };

  // --- site
  if (required('site.url') && !/^https?:\/\/.+\/$/.test(cfg.site.url)) err('site.url', 'deve começar por https:// e terminar com "/" (ex.: https://www.restaurante.pt/).');
  if (cfg.site?.customDomain && /[/:]/.test(cfg.site.customDomain)) err('site.customDomain', 'indique só o domínio, sem https:// nem barras (ex.: www.restaurante.pt).');

  // --- tema
  if (!THEMES.includes(cfg.theme?.name)) err('theme.name', `tema desconhecido "${cfg.theme?.name}". Opções: ${THEMES.join(', ')}.`);
  if (cfg.theme?.heroLayout && !['image', 'split'].includes(cfg.theme.heroLayout)) err('theme.heroLayout', 'use null, "image" ou "split".');
  for (const [k, v] of Object.entries(cfg.theme?.colors || {})) if (v && !HEX_RE.test(v)) err(`theme.colors.${k}`, `cor inválida "${v}". Use o formato #RRGGBB.`);

  // --- secções
  if (required('sections', 'object')) {
    for (const [k, v] of Object.entries(cfg.sections)) {
      if (!SECTIONS.includes(k)) err(`sections.${k}`, `secção desconhecida. Opções: ${SECTIONS.join(', ')}.`);
      if (typeof v !== 'boolean') err(`sections.${k}`, 'use true ou false.');
    }
  }
  for (const k of cfg.navigation || []) if (!SECTIONS.includes(k)) err('navigation', `"${k}" não é uma secção válida.`);
  const on = (k) => cfg.sections?.[k] === true;

  // --- negócio
  for (const p of ['business.name', 'business.address.street', 'business.address.postalCode', 'business.address.city', 'business.address.country', 'business.phone', 'business.email', 'business.priceRange']) required(p);
  ['business.slogan', 'business.cuisine', 'business.pricePerPerson'].forEach((p) => i18n(p));
  required('business.geo.lat', 'number'); required('business.geo.lng', 'number');
  if (cfg.business?.email && !EMAIL_RE.test(cfg.business.email)) err('business.email', `email inválido "${cfg.business.email}".`);
  if (cfg.business?.address?.postalCode && !/^\d{4}-\d{3}$/.test(cfg.business.address.postalCode)) warn('business.address.postalCode', 'o código postal português tem o formato 0000-000.');
  for (const p of cfg.business?.payments || []) if (!PAYMENTS[p]) err('business.payments', `"${p}" desconhecido. Opções: ${Object.keys(PAYMENTS).join(', ')}.`);
  for (const [k, v] of Object.entries(cfg.business?.social || {})) url(`business.social.${k}`, v);
  if (cfg.business?.logo?.image) image('business.logo.image', cfg.business.logo.image, { needAlt: false });
  image('business.ogImage');

  // --- horário
  const shifts = (path, list) => {
    if (!Array.isArray(list)) return err(path, 'deve ser uma lista de turnos, ex.: ["12:00-15:00", "19:00-22:30"] ou [] para encerrado.');
    list.forEach((s, i) => { if (!SHIFT_RE.test(String(s).trim())) err(`${path}[${i}]`, `turno inválido "${s}". Formato: "HH:MM-HH:MM".`); });
  };
  if (required('hours.weekly', 'object')) for (const d of DAY_KEYS) shifts(`hours.weekly.${d}`, cfg.hours.weekly[d]);
  (cfg.hours?.special || []).forEach((sp, i) => {
    if (!DATE_RE.test(sp.date || '')) err(`hours.special[${i}].date`, 'data inválida. Formato: "AAAA-MM-DD".');
    shifts(`hours.special[${i}].shifts`, sp.shifts);
    i18n(`hours.special[${i}].label`, sp.label);
  });
  (cfg.hours?.closures || []).forEach((c, i) => {
    if (!DATE_RE.test(c.from || '') || !DATE_RE.test(c.to || '')) err(`hours.closures[${i}]`, 'use from e to no formato "AAAA-MM-DD".');
    else if (c.from > c.to) err(`hours.closures[${i}]`, '"from" é depois de "to".');
    i18n(`hours.closures[${i}].label`, c.label);
  });

  // --- SEO
  for (const page of ['home', 'menu', 'privacy']) {
    i18n(`seo.${page}.title`); i18n(`seo.${page}.description`);
    for (const l of ['pt', 'en']) {
      const t = cfg.seo?.[page]?.title?.[l] || '', d = cfg.seo?.[page]?.description?.[l] || '';
      if (t.length > 65) warn(`seo.${page}.title.${l}`, `${t.length} caracteres; o Google costuma cortar acima de ~60.`);
      if (d.length > 165) warn(`seo.${page}.description.${l}`, `${d.length} caracteres; ideal até ~155.`);
    }
  }

  // --- hero
  image('hero.image'); i18n('hero.lead');

  // --- secções ligadas
  const section = (k, fn) => {
    if (!on(k)) return;
    if (!cfg[k]) return err(k, `a secção está ligada em "sections" mas falta o bloco "${k}: { ... }".`);
    i18n(`${k}.title`);
    if (cfg[k].navLabel !== undefined) i18n(`${k}.navLabel`);
    fn?.(cfg[k]);
  };

  section('dailySpecial', (d) => {
    required('dailySpecial.price', 'number'); i18n('dailySpecial.includes'); i18n('dailySpecial.when');
    for (const [day, v] of Object.entries(d.week || {})) {
      if (!DAY_KEYS.includes(day)) err(`dailySpecial.week.${day}`, `dia inválido. Use: ${DAY_KEYS.join(', ')}.`);
      i18n(`dailySpecial.week.${day}`, v);
    }
    if (d.image) image('dailySpecial.image');
  });

  if (on('menu')) section('menu', (m) => {
    i18n('menu.allergyNotice');
    if (!Array.isArray(m.categories) || !m.categories.length) return err('menu.categories', 'a ementa precisa de pelo menos uma categoria.');
    const ids = new Set();
    m.categories.forEach((c, ci) => {
      const cp = `menu.categories[${ci}]`;
      if (!c.id || !/^[a-z0-9-]+$/.test(c.id)) err(`${cp}.id`, 'use um identificador simples, só minúsculas, números e hífens (ex.: "sobremesas").');
      if (ids.has(c.id)) err(`${cp}.id`, `identificador repetido "${c.id}".`);
      ids.add(c.id);
      i18n(`${cp}.name`, c.name);
      (c.items || []).forEach((it, ii) => {
        const ip = `${cp}.items[${ii}]`;
        i18n(`${ip}.name`, it.name);
        if (it.description) i18n(`${ip}.description`, it.description);
        if (typeof it.price !== 'number') err(`${ip}.price`, `preço em falta ou inválido (use número, ex.: 12.5) — prato "${it.name?.pt ?? '?'}".`);
        if (!Array.isArray(it.allergens)) err(`${ip}.allergens`, `indique os alergénios do prato "${it.name?.pt ?? '?'}" (use [] se não tiver nenhum).`);
        for (const a of it.allergens || []) if (!ALLERGENS.some((x) => x.code === a)) err(`${ip}.allergens`, `alergénio desconhecido "${a}". Opções: ${ALLERGENS.map((x) => x.code).join(', ')}.`);
        for (const d of it.diet || []) if (!DIETS[d]) err(`${ip}.diet`, `dieta desconhecida "${d}". Opções: ${Object.keys(DIETS).join(', ')}.`);
        if ((it.diet || []).includes('glutenFree') && (it.allergens || []).includes('gluten')) err(ip, `"${it.name?.pt}" está marcado como sem glúten mas tem o alergénio glúten.`);
        if ((it.diet || []).includes('vegan') && (it.allergens || []).some((a) => ['milk', 'eggs', 'fish', 'crustaceans', 'molluscs'].includes(a))) err(ip, `"${it.name?.pt}" está marcado como vegano mas tem alergénios de origem animal.`);
        if (it.image) image(`${ip}.image`, it.image);
      });
    });
    if (m.pdf) for (const l of ['pt', 'en']) if (m.pdf[l] && !existsSync(join(srcDir, m.pdf[l]))) err(`menu.pdf.${l}`, `o ficheiro "src/${m.pdf[l]}" não existe.`);
  });

  section('about', (a) => { i18n('about.paragraphs'); if (a.image) image('about.image'); });
  section('team', (t) => {
    (t.members || []).forEach((m, i) => {
      if (!m.name) err(`team.members[${i}].name`, 'nome em falta.');
      i18n(`team.members[${i}].role`, m.role);
      if (m.photo) image(`team.members[${i}].photo`, m.photo, { needAlt: false });
    });
  });
  section('gallery', (g) => {
    if (!g.images?.length) warn('gallery.images', 'a galeria está ligada mas não tem imagens (não será mostrada).');
    (g.images || []).forEach((im, i) => {
      image(`gallery.images[${i}]`, im);
      if (im.category && !g.categories?.[im.category]) err(`gallery.images[${i}].category`, `categoria "${im.category}" não existe em gallery.categories.`);
    });
  });
  section('events', (e) => {
    i18n('events.intro'); i18n('events.ctaLabel');
    if (!['email', 'whatsapp', 'phone'].includes(e.contactMethod)) err('events.contactMethod', 'use "email", "whatsapp" ou "phone".');
    if (e.contactMethod === 'whatsapp' && !cfg.business.whatsapp) err('events.contactMethod', 'escolheu WhatsApp mas business.whatsapp está vazio.');
  });
  section('reservations', (r) => {
    const methods = ['external', 'phone', 'whatsapp', 'form'];
    if (!methods.includes(r.method)) return err('reservations.method', `método inválido "${r.method}". Opções: ${methods.join(', ')}.`);
    if (r.method === 'external') { required('reservations.external.name'); url('reservations.external.url', r.external?.url, { optional: false }); }
    if (r.method === 'whatsapp' && !cfg.business.whatsapp) err('reservations.method', 'escolheu WhatsApp mas business.whatsapp está vazio.');
    if (r.method === 'form' && !cfg.form?.enabled) err('reservations.method', 'escolheu "form" mas o formulário está desligado (form.enabled: false).');
  });
  section('delivery', (d) => {
    (d.platforms || []).forEach((p, i) => { if (!p.name) err(`delivery.platforms[${i}].name`, 'nome em falta.'); url(`delivery.platforms[${i}].url`, p.url); });
    if (d.takeaway?.enabled) i18n('delivery.takeaway.text');
  });
  section('testimonials', (t) => {
    (t.items || []).forEach((it, i) => {
      if (!it.author) err(`testimonials.items[${i}].author`, 'autor em falta.');
      i18n(`testimonials.items[${i}].text`, it.text);
      if (!(it.rating >= 1 && it.rating <= 5)) err(`testimonials.items[${i}].rating`, 'use um número de 1 a 5.');
    });
    if (t.isDemo && !cfg.site.demo) warn('testimonials.isDemo', 'as avaliações estão marcadas como fictícias mas site.demo é false. Substitua por avaliações reais.');
    url('testimonials.googleReviewsUrl', t.googleReviewsUrl); url('testimonials.writeReviewUrl', t.writeReviewUrl);
  });
  section('hours');
  section('location', (l) => {
    if (l.map?.enabled) image('location.map.placeholder', l.map.placeholder, { needAlt: false });
    url('location.googleMapsUrl', l.googleMapsUrl);
  });
  section('faq', (f) => {
    if (!f.items?.length) warn('faq.items', 'a secção FAQ está ligada mas não tem perguntas (não será mostrada).');
    (f.items || []).forEach((it, i) => { i18n(`faq.items[${i}].q`, it.q); i18n(`faq.items[${i}].a`, it.a); });
  });
  section('contact');

  // --- formulário
  if (cfg.form?.enabled) {
    for (const k of ['publicKey', 'serviceId', 'templateId']) {
      const v = cfg.form.emailjs?.[k] || '';
      if (!v || /^\[.*\]$/.test(v)) err(`form.emailjs.${k}`, 'o formulário está ligado mas falta esta chave do EmailJS (ver CONFIGURACAO.md).');
    }
    i18n('form.retention');
  }

  // --- legal
  required('legal.complaintsBook.url');
  if (cfg.legal?.complaintsBook?.logo) image('legal.complaintsBook.logo', cfg.legal.complaintsBook.logo, { needAlt: false });
  for (const p of ['legal.legalName', 'legal.nif', 'legal.privacyEmail', 'legal.privacyUpdated']) required(p);

  return { errors, warnings };
}
