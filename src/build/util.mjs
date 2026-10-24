/** Funções auxiliares partilhadas pelos templates. */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa texto para HTML (conteúdo e atributos). */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** Junta pedaços de HTML ignorando vazios/false. */
export const join = (parts, sep = '') => parts.flat(Infinity).filter((p) => p !== false && p != null && p !== '').join(sep);

/** Escolhe a tradução de um texto { pt, en }; aceita também strings simples. */
export function tr(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value;
  return value[lang] ?? value.pt ?? '';
}

/** Substitui {chave} numa string. */
export const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));

/** Formata um preço em euros conforme o idioma (14,50 € / €14.50). */
export function price(value, locale) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(value);
}

/** Atributos de link externo seguro (abre em novo separador). */
export const ext = 'target="_blank" rel="noopener noreferrer"';

/** Remove espaços do telefone para usar em tel: / wa.me */
export const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;
export const waHref = (phone, text = '') =>
  `https://wa.me/${String(phone).replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/** Atributos width/height/alt para <img>. */
export function img(ctx, image, { alt = '', cls = '', lazy = true, priority = false, sizes = '' } = {}) {
  const a = alt || tr(image.alt, ctx.lang);
  return `<img src="${esc(ctx.asset(image.src))}" width="${image.width}" height="${image.height}" alt="${esc(a)}"${cls ? ` class="${cls}"` : ''}${lazy && !priority ? ' loading="lazy"' : ''} decoding="async"${priority ? ' fetchpriority="high"' : ''}${sizes ? ` sizes="${sizes}"` : ''}>`;
}

/** Data AAAA-MM-DD → texto legível no idioma. */
export function dateLabel(iso, locale, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d || 1)));
}

/** Data de hoje em Lisboa (AAAA-MM-DD). */
export function todayLisbon(tz = 'Europe/Lisbon') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
