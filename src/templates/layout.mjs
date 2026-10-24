/** Estrutura comum das páginas: <head>, cabeçalho, rodapé e barra móvel. */
import { esc, join, tr, ext, telHref, waHref, img } from '../build/util.mjs';
import { weeklySummary } from '../build/hours.mjs';
import { ldScript } from '../build/jsonld.mjs';

/* ------------------------------------------------------------------ HEAD -- */
export function head(ctx, { title, description, jsonld = [], noindex = false, alternates = true }) {
  const { cfg, lang, ui, build } = ctx;
  const b = cfg.business;
  const og = b.ogImage;
  const canonical = ctx.abs(ctx.page);
  const robots = noindex || cfg.site.noindex ? '<meta name="robots" content="noindex, follow">' : '';

  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${esc(build.csp)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
${ctx.base ? `<base href="${esc(ctx.base)}">` : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${robots}
${alternates ? `<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="pt-PT" href="${esc(ctx.abs(ctx.page, 'pt'))}">
<link rel="alternate" hreflang="en" href="${esc(ctx.abs(ctx.page, 'en'))}">
<link rel="alternate" hreflang="x-default" href="${esc(ctx.abs(ctx.page, 'pt'))}">` : ''}
<meta name="theme-color" content="${build.themeColor}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(b.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ctx.absAsset(og.src))}">
<meta property="og:image:width" content="${og.width}">
<meta property="og:image:height" content="${og.height}">
<meta property="og:image:alt" content="${esc(tr(og.alt, lang))}">
<meta property="og:locale" content="${ui.ogLocale}">
<meta property="og:locale:alternate" content="${ctx.uiAlt.ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ctx.absAsset(og.src))}">
<meta name="twitter:image:alt" content="${esc(tr(og.alt, lang))}">
<link rel="icon" href="${ctx.asset('assets/img/icons/favicon.ico')}" sizes="32x32">
<link rel="icon" href="${ctx.asset('assets/img/icons/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${ctx.asset('assets/img/icons/apple-touch-icon.png')}">
<link rel="manifest" href="${ctx.asset('site.webmanifest')}">
${build.fontPreloads.map((f) => `<link rel="preload" href="${ctx.asset(f)}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="stylesheet" href="${ctx.asset(build.cssFile)}">
<script>${build.inlineScript}</script>
<script src="${ctx.asset('assets/vendor/bootstrap/bootstrap.bundle.min.js')}" defer></script>
<script src="${ctx.asset(build.jsFile)}" defer></script>
${jsonld.map(ldScript).join('\n')}
<!--
  BANNER DE CONSENTIMENTO (futuro): este site não usa analytics nem cookies não essenciais,
  por isso não precisa de banner. Se um dia adicionar analytics (ex.: Google Analytics),
  o banner de consentimento entra AQUI, e o script de analytics só pode ser carregado
  DEPOIS de o visitante aceitar. Atualize também a CSP (meta acima) e a Política de Privacidade.
-->
</head>`;
}

/* ------------------------------------------------------------- HELPERS -- */
export function langLinks(ctx, cls = '') {
  const { lang, ui } = ctx;
  const link = (l) => {
    const isCur = l === lang;
    const label = l === 'pt' ? 'PT' : 'EN';
    const name = l === 'pt' ? 'Português' : 'English';
    return `<a href="${esc(ctx.langHref(l))}" lang="${l === 'pt' ? 'pt-PT' : 'en'}" hreflang="${l === 'pt' ? 'pt-PT' : 'en'}"${isCur ? ' aria-current="true"' : ' data-lang-switch'} data-lang="${l}"><span class="visually-hidden">${name}</span><span aria-hidden="true">${label}</span></a>`;
  };
  return `<div class="lang-switch ${cls}" role="group" aria-label="${esc(ui.langSwitch)}">${link('pt')}<span class="lang-switch__sep" aria-hidden="true">|</span>${link('en')}</div>`;
}

function brand(ctx) {
  const { cfg } = ctx;
  const logo = cfg.business.logo || {};
  const inner = logo.image
    ? img(ctx, logo.image, { alt: cfg.business.name, lazy: false, cls: 'brand__logo' })
    : `${logo.mark ? `<img src="${ctx.asset(logo.mark)}" width="32" height="32" alt="" class="brand__mark">` : ''}<span class="brand__name">${esc(cfg.business.name)}</span>`;
  return `<a class="navbar-brand brand" href="${esc(ctx.href('home'))}"${ctx.page === 'home' ? ' aria-current="page"' : ''}>${inner}</a>`;
}

/** Ação principal de reserva conforme o método configurado. */
export function reserveAction(ctx, { direct = false } = {}) {
  const { cfg, ui, lang } = ctx;
  if (!cfg.sections.reservations) return null;
  const r = cfg.reservations;
  const b = cfg.business;
  if (r.method === 'external') return { href: r.external.url, external: true, label: ui.reserve, icon: 'calendar-check' };
  if (!direct) return { href: ctx.sectionHref('reservations'), label: ui.reserve, icon: 'calendar-check' };
  if (r.method === 'whatsapp') return { href: waHref(b.whatsapp, tr(r.whatsappMessage, lang)), external: true, label: ui.reserve, icon: 'whatsapp' };
  if (r.method === 'phone') return { href: telHref(b.phone), label: ui.reserve, icon: 'telephone' };
  return { href: ctx.sectionHref('reservations'), label: ui.reserve, icon: 'calendar-check' };
}

export function actionLink(ctx, a, cls) {
  if (!a) return '';
  return `<a class="${cls}" href="${esc(a.href)}"${a.external ? ` ${ext}` : ''}>${ctx.icon(a.icon)}<span>${esc(a.label)}</span>${a.external ? `<span class="visually-hidden"> ${esc(ctx.ui.newTab)}</span>` : ''}</a>`;
}

/* ---------------------------------------------------------------- HEADER -- */
export function header(ctx) {
  const { cfg, ui, lang } = ctx;
  const items = (cfg.navigation || []).filter((k) => cfg.sections[k] && cfg[k]);
  const navItems = items.map((k) => {
    const isCurrent = k === 'menu' && ctx.page === 'menu';
    return `<li class="nav-item"><a class="nav-link" href="${esc(ctx.sectionHref(k))}"${isCurrent ? ' aria-current="page"' : ''}>${esc(tr(cfg[k].navLabel || cfg[k].title, lang))}</a></li>`;
  });
  const reserve = reserveAction(ctx);

  return `<header class="site-header fixed-top" id="top">
${cfg.site.demo ? `<div class="demo-banner"><p>${esc(ui.demoBanner)}</p>${demoSwitcher(ctx)}</div>` : ''}
<nav class="navbar navbar-expand-lg" aria-label="${esc(ui.mainNav)}">
  <div class="container">
    ${brand(ctx)}
    <div class="header-actions order-lg-last">
      ${langLinks(ctx, 'd-none d-sm-flex')}
      ${reserve ? actionLink(ctx, reserve, 'btn btn-accent btn-sm header-cta') : ''}
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-main" aria-controls="nav-main" aria-expanded="false" aria-label="${esc(ui.toggleNav)}">${ctx.icon('list', 'icon-lg')}</button>
    </div>
    <div class="collapse navbar-collapse" id="nav-main">
      <ul class="navbar-nav ms-lg-auto me-lg-3">
        ${navItems.join('\n        ')}
      </ul>
      ${langLinks(ctx, 'd-flex d-sm-none mt-2 mb-3')}
    </div>
  </div>
</nav>
</header>`;
}

/* ------------------------------------------------------- LANG SUGGESTION -- */
export function langSuggest(ctx) {
  const { cfg, ui } = ctx;
  if (!cfg.features?.langSuggestion) return '';
  const alt = ctx.lang === 'pt' ? 'en' : 'pt';
  return `<div class="lang-suggest" hidden data-lang-suggest lang="${alt === 'pt' ? 'pt-PT' : 'en'}">
  <p class="lang-suggest__text">${esc(ui.langSuggest)}</p>
  <a class="btn btn-accent btn-sm" href="${esc(ctx.langHref(alt))}" data-lang-switch data-lang="${alt}">${esc(ui.langSuggestCta)}</a>
  <button type="button" class="btn-close" data-lang-dismiss aria-label="${esc(ui.langSuggestDismiss)}"></button>
</div>`;
}

/* ---------------------------------------------------------------- FOOTER -- */
export function socialLinks(ctx, cls = 'social-links') {
  const s = ctx.cfg.business.social || {};
  const known = { facebook: ['Facebook', 'facebook'], instagram: ['Instagram', 'instagram'], tiktok: ['TikTok', 'tiktok'], tripadvisor: ['Tripadvisor', 'globe2'], thefork: ['TheFork', 'globe2'] };
  const links = Object.entries(s).filter(([, url]) => url).map(([k, url]) => {
    const [name, icon] = known[k] || [k, 'globe2'];
    return `<li><a href="${esc(url)}" ${ext} aria-label="${esc(ctx.fill(ctx.ui.followOn, { name }))} ${esc(ctx.ui.newTab)}">${ctx.icon(icon, 'icon-lg')}</a></li>`;
  });
  return links.length ? `<ul class="${cls}">${links.join('')}</ul>` : '';
}

export function footer(ctx) {
  const { cfg, ui, lang } = ctx;
  const b = cfg.business;
  const L = cfg.legal;
  const year = new Date().getFullYear();
  const summary = weeklySummary(cfg.hours.weekly, ui);
  const cb = L.complaintsBook;
  const legalRows = [
    L.legalName && `<li>${esc(ui.legalName)}: ${esc(L.legalName)}</li>`,
    L.nif && `<li>${esc(ui.nif)}: ${esc(L.nif)}</li>`,
    L.license && `<li>${esc(ui.license)}: ${esc(L.license)}</li>`,
  ];
  const creditText = tr(cfg.site.credit?.text, lang);
  const credit = creditText
    ? cfg.site.credit.url
      ? `<a href="${esc(cfg.site.credit.url)}" ${ext}>${esc(creditText)}</a>`
      : esc(creditText)
    : '';

  return `<footer class="site-footer">
  <div class="container">
    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-3">
        <p class="site-footer__brand">${esc(b.name)}</p>
        <p class="site-footer__slogan">${esc(tr(b.slogan, lang))}</p>
        <address class="site-footer__address">${esc(b.address.street)}<br>${esc(b.address.postalCode)} ${esc(b.address.city)}</address>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <h2 class="site-footer__title">${esc(ui.footerHours)}</h2>
        <dl class="footer-hours">
          ${summary.map((g) => `<div><dt>${esc(g.label)}</dt><dd>${g.text.split(` ${ui.and} `).map((s) => `<span class="text-nowrap">${esc(s)}</span>`).join('<br>')}</dd></div>`).join('\n          ')}
        </dl>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <h2 class="site-footer__title">${esc(ui.footerContacts)}</h2>
        <ul class="list-unstyled footer-contacts">
          <li><a href="${telHref(b.phone)}">${ctx.icon('telephone')}<span>${esc(b.phone)}</span></a><small class="d-block call-cost">${esc(b.phoneType === 'mobile' ? ui.callCostMobile : ui.callCost)}</small></li>
          ${b.whatsapp ? `<li><a href="${esc(waHref(b.whatsapp))}" ${ext}>${ctx.icon('whatsapp')}<span>WhatsApp</span><span class="visually-hidden"> ${esc(ui.newTab)}</span></a></li>` : ''}
          <li><a href="mailto:${esc(b.email)}">${ctx.icon('envelope')}<span>${esc(b.email)}</span></a></li>
        </ul>
        ${socialLinks(ctx)}
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <h2 class="site-footer__title">${esc(ui.footerLegal)}</h2>
        <ul class="list-unstyled footer-legal">
          <li><a href="${esc(ctx.href('privacy'))}"${ctx.page === 'privacy' ? ' aria-current="page"' : ''}>${esc(ui.privacy)}</a></li>
          ${join(legalRows, '\n          ')}
        </ul>
        <a class="complaints-book" href="${esc(cb.url)}" ${ext}>
          ${cb.logo ? img(ctx, cb.logo, { alt: '', cls: 'complaints-book__logo' }) : ''}
          <span>${esc(ui.complaintsBook)}</span><span class="visually-hidden"> ${esc(ui.newTab)}</span>
        </a>
      </div>
    </div>
    <div class="site-footer__bottom">
      <p>© ${year} ${esc(L.legalName && !/^\[/.test(L.legalName) ? L.legalName : b.name)}. ${esc(ui.allRights)}</p>
      ${langLinks(ctx)}
      ${credit ? `<p>${credit}</p>` : ''}
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------ MOBILE ACTION BAR -- */
export function mobileBar(ctx) {
  const { cfg, ui } = ctx;
  if (!cfg.features?.mobileBar) return '';
  const b = cfg.business;
  const reserve = reserveAction(ctx, { direct: true })
    || (b.whatsapp ? { href: waHref(b.whatsapp), external: true, label: 'WhatsApp', icon: 'whatsapp' } : null);
  const items = [
    { href: telHref(b.phone), label: ui.call, icon: 'telephone' },
    reserve,
    { href: ctx.directions.google, external: true, label: ui.directions, icon: 'signpost-2' },
  ].filter(Boolean);
  return `<nav class="mobile-bar d-md-none" aria-label="${esc(ui.mobileBar)}">
  ${items.map((a) => actionLink(ctx, a, 'mobile-bar__item')).join('\n  ')}
</nav>`;
}

export function backToTop(ctx) {
  if (!ctx.cfg.features?.backToTop) return '';
  return `<a href="#top" class="back-to-top" data-back-to-top aria-label="${esc(ctx.ui.backToTop)}">${ctx.icon('chevron-up', 'icon-lg')}</a>`;
}

/* ------------------------------------------------------- DEMO SWITCHER -- */
export function demoSwitcher(ctx) {
  const { cfg, ui } = ctx;
  if (!cfg.site.demo) return '';
  const opt = (obj, cur) => Object.entries(obj).map(([v, label]) => `<option value="${v}"${v === cur ? ' selected' : ''}>${esc(label)}</option>`).join('');
  return `<form class="demo-switcher js-only" data-demo-switcher aria-label="${esc(ui.themeSwitcher)}">
  <label><span>${esc(ui.themeSwitcher)}</span><select name="theme">${opt(ui.themeNames, ctx.build.theme)}</select></label>
  <label><span>${esc(ui.heroSwitcher)}</span><select name="hero">${opt(ui.heroNames, ctx.build.hero)}</select></label>
</form>`;
}

/* ---------------------------------------------------------------- PAGE -- */
export function page(ctx, { headHtml, main, extraBody = '' }) {
  const { lang, build } = ctx;
  const body = `${header(ctx)}
${langSuggest(ctx)}
<main id="conteudo" tabindex="-1">
${main}
</main>
${footer(ctx)}
${mobileBar(ctx)}
${backToTop(ctx)}
${extraBody}
<script type="application/json" id="page-data">${JSON.stringify(ctx.pageData()).replace(/</g, '\\u003c')}</script>`;
  // O sprite é gerado no fim, só com os ícones efetivamente usados nesta página
  return `<!doctype html>
<html lang="${lang === 'pt' ? 'pt-PT' : 'en'}" data-theme="${build.theme}" data-hero="${build.hero}"${build.theme === 'elegante' ? ' data-bs-theme="dark"' : ''}${ctx.cfg.site.demo ? ' class="has-demo"' : ''}>
${headHtml}
<body>
<a class="skip-link" href="#conteudo">${esc(ctx.ui.skipLink)}</a>
${ctx.sprite()}
${body}
</body>
</html>
`;
}
