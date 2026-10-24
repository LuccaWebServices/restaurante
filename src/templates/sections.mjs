/** Secções da página. Cada função recebe o contexto (ctx) e devolve HTML. */
import { esc, join, tr, ext, telHref, waHref, img, price, dateLabel, todayLisbon } from '../build/util.mjs';
import { shiftsText } from '../build/hours.mjs';
import { ALLERGENS, DIETS, PAYMENTS, DAY_KEYS } from '../i18n/ui.mjs';
import { reserveAction, actionLink, socialLinks } from './layout.mjs';

const ext_ = (ctx) => `<span class="visually-hidden"> ${esc(ctx.ui.newTab)}</span>`;

/** Envolve o conteúdo numa <section> com título H2 e introdução. */
function section(ctx, key, inner, { intro, cls = '', title } = {}) {
  const { cfg, lang } = ctx;
  const id = ctx.ids[key];
  const introText = intro ?? tr(cfg[key]?.intro, lang);
  return `<section id="${id}" class="section section--${key} ${ctx.nextAlt()} ${cls}" aria-labelledby="${id}-title" data-section="${key}">
  <div class="container">
    <header class="section__head reveal">
      <h2 id="${id}-title" class="section__title">${esc(title ?? tr(cfg[key].title, lang))}</h2>
      ${introText ? `<p class="section__intro">${esc(introText)}</p>` : ''}
    </header>
    ${inner}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ HERO -- */
export function hero(ctx) {
  const { cfg, ui, lang } = ctx;
  const b = cfg.business;
  const reserve = reserveAction(ctx);
  const menuLink = cfg.sections.menu ? { href: ctx.sectionHref('menu'), label: ui.viewMenu, icon: 'arrow-right' } : null;
  const where = lang === 'pt' ? `em ${b.address.city}` : `in ${b.address.city}`;
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">
    ${img(ctx, cfg.hero.image, { priority: true, cls: 'hero__img', sizes: '(min-width: 992px) 50vw, 100vw' })}
  </div>
  <div class="container hero__inner">
    <div class="hero__content">
      ${cfg.hero.eyebrow ? `<p class="hero__eyebrow">${esc(tr(cfg.hero.eyebrow, lang))}</p>` : ''}
      <h1 id="hero-title" class="hero__title">
        <span class="hero__name">${esc(b.name)}</span>
        <span class="hero__cuisine">${esc(tr(b.cuisine, lang))} ${esc(where)}</span>
      </h1>
      <p class="hero__lead">${esc(tr(cfg.hero.lead, lang))}</p>
      ${cfg.sections.hours ? `<p class="open-status" data-open-status><a href="${esc(ctx.sectionHref('hours'))}">${ctx.icon('clock')}<span>${esc(ui.statusFallback)}</span></a></p>` : '<p class="open-status" data-open-status></p>'}
      <div class="hero__actions">
        ${reserve ? actionLink(ctx, { ...reserve, label: ui.reserveTable }, 'btn btn-accent btn-lg') : ''}
        ${menuLink ? actionLink(ctx, menuLink, 'btn btn-outline-accent btn-lg') : ''}
      </div>
      <ul class="hero__facts">
        <li>${ctx.icon('geo-alt')}<span>${esc(b.address.street)}, ${esc(b.address.city)}</span></li>
        <li>${ctx.icon('cash-coin')}<span>${esc(tr(b.pricePerPerson, lang))}</span></li>
      </ul>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------- PRATO DO DIA -- */
export function dailySpecial(ctx) {
  const { cfg, ui, lang } = ctx;
  const d = cfg.dailySpecial;
  const week = DAY_KEYS.filter((k) => d.week?.[k]);
  const inner = `<div class="row g-4 g-lg-5 align-items-center">
    ${d.image ? `<div class="col-lg-6 reveal"><figure class="media-frame">${img(ctx, d.image, { sizes: '(min-width: 992px) 50vw, 100vw' })}</figure></div>` : ''}
    <div class="${d.image ? 'col-lg-6' : 'col-lg-8 mx-auto'} reveal">
      <div class="card-panel special">
        <p class="special__price"><span class="special__amount">${price(d.price, ui.locale)}</span> <span class="special__per">${esc(ui.perPerson)}</span></p>
        <p class="special__when">${ctx.icon('clock')}<span>${esc(tr(d.when, lang))}</span></p>
        <h3 class="special__subtitle">${esc(ui.includes)}</h3>
        <ul class="checklist">${tr(d.includes, lang).map((i) => `<li>${ctx.icon('check-circle')}<span>${esc(i)}</span></li>`).join('')}</ul>
        ${week.length ? `<h3 class="special__subtitle">${esc(ui.weekMenu)}</h3>
        <ul class="week-list" data-week-list>
          ${week.map((k) => `<li class="week-list__item" data-day="${k}"><span class="week-list__day">${esc(ui.days[k])}</span><span class="week-list__dish">${esc(tr(d.week[k], lang))}</span></li>`).join('\n          ')}
        </ul>` : ''}
      </div>
    </div>
  </div>`;
  return section(ctx, 'dailySpecial', inner);
}

/* ---------------------------------------------------------------- EMENTA -- */
function dietTags(ctx, diet = []) {
  if (!diet.length) return '';
  return `<ul class="dish__tags">${diet.map((d) => `<li class="tag tag--${d}">${ctx.icon(DIETS[d].icon)}<span>${esc(DIETS[d][ctx.lang])}</span></li>`).join('')}</ul>`;
}

function allergenText(ctx, list = []) {
  const { ui, lang } = ctx;
  if (!list.length) return `<p class="dish__allergens dish__allergens--none">${esc(ui.allergensNone)}</p>`;
  const names = ALLERGENS.filter((a) => list.includes(a.code)).map((a) => a[lang]);
  return `<p class="dish__allergens"><span class="dish__allergens-label">${esc(ui.allergensLabel)}:</span> ${esc(names.join(', '))}</p>`;
}

function dish(ctx, it, level) {
  const { ui, lang } = ctx;
  return `<li class="dish" data-diet="${(it.diet || []).join(' ')}" data-allergens="${(it.allergens || []).join(' ')}">
  <div class="dish__head">
    <h${level} class="dish__name">${esc(tr(it.name, lang))}</h${level}>
    <p class="dish__price"><data value="${it.price.toFixed(2)}">${price(it.price, ui.locale)}</data>${it.priceNote ? ` <small>${esc(tr(it.priceNote, lang))}</small>` : ''}</p>
  </div>
  ${it.description ? `<p class="dish__desc">${esc(tr(it.description, lang))}</p>` : ''}
  ${dietTags(ctx, it.diet)}
  ${allergenText(ctx, it.allergens)}
</li>`;
}

function allergyNotice(ctx) {
  return `<div class="allergy-notice" role="note">${ctx.icon('exclamation-triangle', 'icon-lg')}<p>${esc(tr(ctx.cfg.menu.allergyNotice, ctx.lang))}</p></div>`;
}

function menuFilter(ctx) {
  const { ui, lang } = ctx;
  const check = (group, value, label, icon = '') => `<label class="filter-chip"><input type="checkbox" name="${group}" value="${value}"><span>${icon}${esc(label)}</span></label>`;
  return `<details class="menu-filter js-only">
  <summary>${ctx.icon('funnel')}<span>${esc(ui.filterTitle)}</span></summary>
  <form class="menu-filter__form" data-menu-filter>
    <fieldset>
      <legend>${esc(ui.filterDiet)}</legend>
      <div class="filter-chips">${['vegetarian', 'vegan', 'glutenFree'].map((d) => check('diet', d, DIETS[d][lang], ctx.icon(DIETS[d].icon))).join('')}</div>
    </fieldset>
    <fieldset>
      <legend>${esc(ui.filterAllergens)}</legend>
      <div class="filter-chips">${ALLERGENS.map((a) => check('allergen', a.code, a[lang])).join('')}</div>
    </fieldset>
    <p class="menu-filter__disclaimer">${ctx.icon('info-circle')}<span>${esc(ui.filterDisclaimer)}</span></p>
    <button type="reset" class="btn btn-outline-accent btn-sm">${esc(ui.filterReset)}</button>
  </form>
</details>
<p class="menu-count js-only" data-menu-count aria-live="polite"></p>`;
}

function allergenLegend(ctx) {
  const { ui, lang } = ctx;
  return `<details class="allergen-legend">
  <summary>${esc(ui.allergenLegend)}</summary>
  <ol>${ALLERGENS.map((a) => `<li>${esc(a[`${lang}Long`])}</li>`).join('')}</ol>
</details>`;
}

/** Ementa completa. `level` = nível do título das categorias (2 na página própria, 3 na página inicial). */
export function fullMenu(ctx, level = 3) {
  const { cfg, ui, lang } = ctx;
  const m = cfg.menu;
  const cats = m.categories.filter((c) => c.items?.length);
  const pdf = m.pdf?.[lang];
  return `${allergyNotice(ctx)}
<nav class="menu-nav" aria-label="${esc(ui.menuCategories)}" data-menu-nav>
  <ul>${cats.map((c) => `<li><a href="#cat-${c.id}">${esc(tr(c.name, lang))}</a></li>`).join('')}</ul>
</nav>
${menuFilter(ctx)}
<div class="menu-cats">
  ${cats.map((c) => `<section class="menu-cat" id="cat-${c.id}" aria-labelledby="cat-${c.id}-title" data-menu-cat>
    <h${level} class="menu-cat__title" id="cat-${c.id}-title">${esc(tr(c.name, lang))}</h${level}>
    ${c.description ? `<p class="menu-cat__desc">${esc(tr(c.description, lang))}</p>` : ''}
    <ul class="dish-list">
      ${c.items.map((it) => dish(ctx, it, level + 1)).join('\n      ')}
    </ul>
    <p class="menu-cat__empty" hidden>${esc(ui.filterEmpty)}</p>
  </section>`).join('\n  ')}
</div>
<div class="menu-foot">
  <p class="menu-foot__vat">${esc(ui.pricesInclude)}</p>
  ${pdf ? `<a class="btn btn-outline-accent" href="${esc(ctx.asset(pdf))}" download>${ctx.icon('file-earmark-pdf')}<span>${esc(ui.downloadPdf)}</span></a>` : ''}
  ${allergenLegend(ctx)}
</div>`;
}

/** Na página inicial: ementa completa OU destaques + link para a página da ementa. */
export function menu(ctx) {
  const { cfg, ui, lang } = ctx;
  const m = cfg.menu;
  if (!m.ownPage) return section(ctx, 'menu', fullMenu(ctx, 3));
  const featured = m.categories.flatMap((c) => c.items.filter((i) => i.featured));
  const inner = `${featured.length ? `<ul class="row g-4 list-unstyled featured-dishes">
    ${featured.map((it) => `<li class="col-md-6 col-lg-4 reveal">
      <article class="dish-card">
        ${it.image ? img(ctx, it.image, { cls: 'dish-card__img', sizes: '(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw' }) : ''}
        <div class="dish-card__body">
          <div class="dish__head"><h3 class="dish__name">${esc(tr(it.name, lang))}</h3><p class="dish__price">${price(it.price, ui.locale)}</p></div>
          ${it.description ? `<p class="dish__desc">${esc(tr(it.description, lang))}</p>` : ''}
          ${dietTags(ctx, it.diet)}
          ${allergenText(ctx, it.allergens)}
        </div>
      </article>
    </li>`).join('\n    ')}
  </ul>` : ''}
  <nav class="menu-nav menu-nav--static" aria-label="${esc(ui.menuCategories)}">
    <ul>${m.categories.map((c) => `<li><a href="${esc(ctx.href('menu'))}#cat-${c.id}">${esc(tr(c.name, lang))}</a></li>`).join('')}</ul>
  </nav>
  <p class="text-center mt-4"><a class="btn btn-accent btn-lg" href="${esc(ctx.href('menu'))}">${esc(ui.viewFullMenu)}${ctx.icon('arrow-right')}</a></p>
  ${allergyNotice(ctx)}`;
  return section(ctx, 'menu', inner);
}

/* ----------------------------------------------------------------- SOBRE -- */
export function about(ctx) {
  const { cfg, lang } = ctx;
  const a = cfg.about;
  const inner = `<div class="row g-4 g-lg-5 align-items-center">
    <div class="${a.image ? 'col-lg-6' : 'col-lg-8 mx-auto'} reveal">
      <div class="prose">${tr(a.paragraphs, lang).map((p) => `<p>${esc(p)}</p>`).join('\n')}</div>
      ${a.highlights?.length ? `<ul class="highlights">${a.highlights.map((h) => `<li>${ctx.icon(h.icon || 'check-circle', 'icon-lg')}<span>${esc(tr(h.text, lang))}</span></li>`).join('')}</ul>` : ''}
    </div>
    ${a.image ? `<div class="col-lg-6 reveal"><figure class="media-frame media-frame--tall">${img(ctx, a.image, { sizes: '(min-width: 992px) 50vw, 100vw' })}</figure></div>` : ''}
  </div>`;
  return section(ctx, 'about', inner, { intro: '' });
}

/* ---------------------------------------------------------------- EQUIPA -- */
export function team(ctx) {
  const { cfg, lang } = ctx;
  const members = cfg.team.members || [];
  if (!members.length) return '';
  const inner = `<ul class="row g-4 list-unstyled justify-content-center">
    ${members.map((m) => `<li class="col-6 col-md-4 col-lg-3 reveal">
      <article class="person">
        ${m.photo ? img(ctx, { ...m.photo }, { alt: `${m.name}, ${tr(m.role, lang)}`, cls: 'person__photo', sizes: '(min-width: 992px) 25vw, 50vw' }) : ''}
        <h3 class="person__name">${esc(m.name)}</h3>
        <p class="person__role">${esc(tr(m.role, lang))}</p>
      </article>
    </li>`).join('\n    ')}
  </ul>`;
  return section(ctx, 'team', inner);
}

/* --------------------------------------------------------------- GALERIA -- */
export function gallery(ctx) {
  const { cfg, ui, lang } = ctx;
  const g = cfg.gallery;
  if (!g.images?.length) return '';
  const usedCats = [...new Set(g.images.map((i) => i.category).filter(Boolean))];
  const filters = usedCats.length > 1
    ? `<div class="gallery-filter js-only" role="group" aria-label="${esc(ui.gallery)}" data-gallery-filter>
    <button type="button" class="chip" aria-pressed="true" data-filter="">${esc(ui.galleryAll)}</button>
    ${usedCats.map((c) => `<button type="button" class="chip" aria-pressed="false" data-filter="${c}">${esc(tr(g.categories[c], lang))}</button>`).join('\n    ')}
  </div>` : '';
  const inner = `${filters}
  <ul class="gallery-grid list-unstyled" data-gallery>
    ${g.images.map((im, i) => {
      const alt = tr(im.alt, lang);
      return `<li class="gallery-grid__item reveal" data-category="${im.category || ''}">
      <a href="${esc(ctx.asset(im.src))}" class="gallery-link" data-gallery-index="${i}" data-alt="${esc(alt)}" aria-label="${esc(ctx.fill(ui.galleryOpen, { alt }))}">
        ${img(ctx, im, { sizes: '(min-width: 992px) 25vw, 50vw' })}
      </a>
    </li>`;
    }).join('\n    ')}
  </ul>`;
  return section(ctx, 'gallery', inner);
}

/** Lightbox acessível (modal Bootstrap: prende o foco, fecha com Esc, devolve o foco). */
export function lightbox(ctx) {
  const { ui } = ctx;
  return `<div class="modal fade lightbox" id="lightbox" tabindex="-1" aria-labelledby="lightbox-caption" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content">
      <button type="button" class="btn-close btn-close-white lightbox__close" data-bs-dismiss="modal" aria-label="${esc(ui.galleryClose)}"></button>
      <figure class="lightbox__figure">
        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" class="lightbox__img" data-lightbox-img>
        <figcaption id="lightbox-caption" class="lightbox__caption"><span data-lightbox-caption></span> <span class="lightbox__counter" data-lightbox-counter></span></figcaption>
      </figure>
      <button type="button" class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="${esc(ui.galleryPrev)}">${ctx.icon('chevron-left', 'icon-xl')}</button>
      <button type="button" class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="${esc(ui.galleryNext)}">${ctx.icon('chevron-right', 'icon-xl')}</button>
    </div>
  </div>
</div>`;
}

/* --------------------------------------------------------------- EVENTOS -- */
export function events(ctx) {
  const { cfg, ui, lang } = ctx;
  const e = cfg.events;
  const b = cfg.business;
  const cta = e.contactMethod === 'whatsapp'
    ? { href: waHref(b.whatsapp, tr(e.emailSubject, lang)), external: true, icon: 'whatsapp' }
    : e.contactMethod === 'phone'
      ? { href: telHref(b.phone), icon: 'telephone' }
      : { href: `mailto:${b.email}?subject=${encodeURIComponent(tr(e.emailSubject, lang))}`, icon: 'envelope' };
  const inner = `<ul class="row g-4 list-unstyled">
    ${(e.types || []).map((t) => `<li class="col-sm-6 col-lg-3 reveal">
      <article class="feature">
        <span class="feature__icon">${ctx.icon(t.icon || 'people', 'icon-xl')}</span>
        <h3 class="feature__title">${esc(tr(t.title, lang))}</h3>
        <p>${esc(tr(t.text, lang))}</p>
      </article>
    </li>`).join('\n    ')}
  </ul>
  <p class="text-center mt-4">${actionLink(ctx, { ...cta, label: tr(e.ctaLabel, lang) }, 'btn btn-accent btn-lg')}</p>`;
  return section(ctx, 'events', inner);
}

/* ------------------------------------------------------------ AVALIAÇÕES -- */
function stars(ctx, r) {
  const full = Math.floor(r), half = r - full >= 0.5;
  const icons = [...Array(5)].map((_, i) => ctx.icon(i < full ? 'star-fill' : i === full && half ? 'star-half' : 'star')).join('');
  return `<p class="stars" role="img" aria-label="${esc(ctx.fill(ctx.ui.ratingLabel, { r }))}">${icons}</p>`;
}

export function testimonials(ctx) {
  const { cfg, ui, lang } = ctx;
  const t = cfg.testimonials;
  if (!t.items?.length) return ''; // secção oculta enquanto não houver avaliações
  const inner = `${t.isDemo ? `<p class="demo-note">${ctx.icon('info-circle')}<span>${esc(ui.reviewsDemo)}</span></p>` : ''}
  <ul class="row g-4 list-unstyled">
    ${t.items.map((it) => `<li class="col-md-6 col-lg-4 reveal">
      <figure class="review">
        ${stars(ctx, it.rating)}
        <blockquote class="review__text"><p>${esc(tr(it.text, lang))}</p></blockquote>
        <figcaption class="review__author">— ${esc(it.author)}${it.source ? `, <span>${esc(it.source)}</span>` : ''}${it.date ? ` · <time datetime="${it.date}">${esc(dateLabel(it.date, ui.locale, { month: 'long', year: 'numeric' }))}</time>` : ''}</figcaption>
      </figure>
    </li>`).join('\n    ')}
  </ul>
  ${t.googleReviewsUrl || t.writeReviewUrl ? `<p class="text-center mt-4 d-flex flex-wrap gap-2 justify-content-center">
    ${t.googleReviewsUrl ? `<a class="btn btn-outline-accent" href="${esc(t.googleReviewsUrl)}" ${ext}>${esc(ui.seeGoogleReviews)}${ext_(ctx)}</a>` : ''}
    ${t.writeReviewUrl ? `<a class="btn btn-accent" href="${esc(t.writeReviewUrl)}" ${ext}>${esc(ui.leaveReview)}${ext_(ctx)}</a>` : ''}
  </p>` : ''}`;
  return section(ctx, 'testimonials', inner);
}

/* --------------------------------------------------------------- RESERVAS -- */
export function form(ctx) {
  const { cfg, ui } = ctx;
  const f = ui.form;
  const req = `<span class="req" aria-hidden="true">*</span>`;
  const field = (name, label, input, { required = true, col = 'col-md-6' } = {}) => `<div class="${col}">
      <label class="form-label" for="f-${name}">${esc(label)}${required ? req : ''}</label>
      ${input}
      <p class="invalid-feedback" id="f-${name}-error"></p>
    </div>`;
  const consent = esc(f.consent).replace('{link}', `<a href="${esc(ctx.href('privacy'))}">${esc(f.consentLink)}</a>`);
  return `<!-- ===== FORMULÁRIO (EmailJS) — ativo porque form.enabled: true ===== -->
<form class="booking-form card-panel" data-booking-form novalidate
  data-emailjs-public="${esc(cfg.form.emailjs.publicKey)}" data-emailjs-service="${esc(cfg.form.emailjs.serviceId)}" data-emailjs-template="${esc(cfg.form.emailjs.templateId)}">
  <h3 class="booking-form__title">${esc(f.title)}</h3>
  <p class="small">${req} ${esc(f.required)}</p>
  <div class="row g-3">
    ${field('name', f.name, `<input class="form-control" id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="f-name-error">`)}
    ${field('email', f.email, `<input class="form-control" id="f-email" name="email" type="email" autocomplete="email" required maxlength="120" aria-describedby="f-email-error">`)}
    ${field('phone', f.phone, `<input class="form-control" id="f-phone" name="phone" type="tel" autocomplete="tel" required maxlength="20" aria-describedby="f-phone-error">`)}
    ${field('people', f.people, `<input class="form-control" id="f-people" name="people" type="number" inputmode="numeric" min="1" max="${cfg.form.maxPeople || 20}" required aria-describedby="f-people-error">`)}
    ${field('date', f.date, `<input class="form-control" id="f-date" name="date" type="date" required aria-describedby="f-date-error">`)}
    ${field('time', f.time, `<input class="form-control" id="f-time" name="time" type="time" step="900" required aria-describedby="f-time-error">`)}
    ${field('notes', f.notes, `<textarea class="form-control" id="f-notes" name="notes" rows="3" maxlength="1000"></textarea>`, { required: false, col: 'col-12' })}
    <div class="col-12 hp-field" aria-hidden="true">
      <label for="f-website">${esc(f.honeypot)}</label>
      <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>
    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="f-consent" name="consent" required aria-describedby="f-consent-error">
        <label class="form-check-label" for="f-consent">${consent}${req}</label>
        <p class="invalid-feedback" id="f-consent-error"></p>
      </div>
    </div>
  </div>
  <p class="form-status" data-form-status role="status" aria-live="polite"></p>
  <button class="btn btn-accent btn-lg" type="submit">${esc(f.submit)}</button>
</form>
<!-- ===== /FORMULÁRIO ===== -->`;
}

export function reservations(ctx) {
  const { cfg, ui, lang } = ctx;
  const r = cfg.reservations;
  const b = cfg.business;
  const methodText = ctx.fill(ui.reservationsMethod[r.method], { name: r.external?.name || '' });
  let primary = '';
  if (r.method === 'external') primary = actionLink(ctx, { href: r.external.url, external: true, label: ctx.fill(ui.reserveOn, { name: r.external.name }), icon: 'calendar-check' }, 'btn btn-accent btn-lg');
  if (r.method === 'phone') primary = actionLink(ctx, { href: telHref(b.phone), label: ctx.fill(ui.callUs, { phone: b.phone }), icon: 'telephone' }, 'btn btn-accent btn-lg');
  if (r.method === 'whatsapp') primary = actionLink(ctx, { href: waHref(b.whatsapp, tr(r.whatsappMessage, lang)), external: true, label: ui.whatsappUs, icon: 'whatsapp' }, 'btn btn-accent btn-lg');
  const alternatives = [
    r.method !== 'phone' && actionLink(ctx, { href: telHref(b.phone), label: ctx.fill(ui.callUs, { phone: b.phone }), icon: 'telephone' }, 'btn btn-outline-accent'),
    r.method !== 'whatsapp' && b.whatsapp && actionLink(ctx, { href: waHref(b.whatsapp, tr(r.whatsappMessage, lang)), external: true, label: ui.whatsapp, icon: 'whatsapp' }, 'btn btn-outline-accent'),
  ];
  const inner = `<div class="row justify-content-center"><div class="col-lg-8 reveal">
    <div class="card-panel text-center reservation" data-reservation-method="${r.method}">
      <p class="reservation__method">${ctx.icon('calendar-check', 'icon-lg')}<span>${esc(methodText)}</span></p>
      ${primary ? `<p>${primary}</p>` : ''}
      <p class="reservation__alt d-flex flex-wrap gap-2 justify-content-center">${join(alternatives)}</p>
      <p class="call-cost small">${esc(b.phoneType === 'mobile' ? ui.callCostMobile : ui.callCost)}</p>
      ${r.note ? `<p class="reservation__note">${esc(tr(r.note, lang))}</p>` : ''}
    </div>
    ${r.method === 'form' ? form(ctx) : ''}
  </div></div>`;
  return section(ctx, 'reservations', inner);
}

/* ------------------------------------------------------- ENTREGA/TAKEAWAY -- */
export function delivery(ctx) {
  const { cfg, ui, lang } = ctx;
  const d = cfg.delivery;
  const platforms = (d.platforms || []).filter((p) => p.url);
  if (!d.takeaway?.enabled && !platforms.length) return '';
  const inner = `<div class="row g-4 justify-content-center">
    ${d.takeaway?.enabled ? `<div class="col-md-6 reveal"><div class="card-panel h-100">
      <h3 class="card-panel__title">${ctx.icon('bag', 'icon-lg')}<span>${esc(ui.takeaway)}</span></h3>
      <p>${esc(tr(d.takeaway.text, lang))}</p>
      <p>${actionLink(ctx, { href: telHref(cfg.business.phone), label: ctx.fill(ui.callUs, { phone: cfg.business.phone }), icon: 'telephone' }, 'btn btn-accent')}</p>
    </div></div>` : ''}
    ${platforms.length ? `<div class="col-md-6 reveal"><div class="card-panel h-100">
      <h3 class="card-panel__title">${ctx.icon('bicycle', 'icon-lg')}<span>${esc(ui.deliveryPlatforms)}</span></h3>
      <ul class="list-unstyled d-grid gap-2">
        ${platforms.map((p) => `<li>${actionLink(ctx, { href: p.url, external: true, label: ctx.fill(ui.orderOn, { name: p.name }), icon: 'box-arrow-up-right' }, 'btn btn-outline-accent w-100')}</li>`).join('\n        ')}
      </ul>
    </div></div>` : ''}
  </div>`;
  return section(ctx, 'delivery', inner);
}

/* ---------------------------------------------------------------- HORÁRIO -- */
export function hours(ctx) {
  const { cfg, ui, lang } = ctx;
  const h = cfg.hours;
  const today = todayLisbon(h.timezone);
  const exceptions = [
    ...(h.special || []).filter((s) => s.date >= today).map((s) => ({ end: s.date, start: s.date, label: tr(s.label, lang), text: shiftsText(s.shifts, ui) })),
    ...(h.closures || []).filter((c) => c.to >= today).map((c) => ({ end: c.to, start: c.from, label: tr(c.label, lang), text: ui.closed })),
  ].sort((a, b) => a.start.localeCompare(b.start));
  const dateRange = (e) => e.start === e.end
    ? dateLabel(e.start, ui.locale)
    : `${dateLabel(e.start, ui.locale, { day: 'numeric', month: 'long' })} ${ui.until} ${dateLabel(e.end, ui.locale)}`;
  const payments = cfg.business.payments || [];

  const inner = `<p class="open-status open-status--block" data-open-status></p>
  <div class="row g-4 g-lg-5">
    <div class="col-lg-7 reveal">
      <table class="hours-table">
        <caption class="visually-hidden">${esc(ui.hoursCaption)}</caption>
        <thead class="visually-hidden"><tr><th scope="col">${esc(ui.dayCol)}</th><th scope="col">${esc(ui.hoursCol)}</th></tr></thead>
        <tbody>
          ${DAY_KEYS.map((d) => {
            const s = h.weekly[d] || [];
            return `<tr data-day="${d}"${s.length ? '' : ' class="is-closed"'}><th scope="row">${esc(ui.days[d])}</th><td>${s.length ? s.map((x) => `<span class="shift">${esc(x.replace('-', '–'))}</span>`).join(' ') : esc(ui.closed)}</td></tr>`;
          }).join('\n          ')}
        </tbody>
      </table>
      ${h.note ? `<p class="hours-note">${ctx.icon('info-circle')}<span>${esc(tr(h.note, lang))}</span></p>` : ''}
    </div>
    <div class="col-lg-5 reveal">
      ${exceptions.length ? `<div class="card-panel mb-4">
        <h3 class="card-panel__title">${ctx.icon('calendar-check', 'icon-lg')}<span>${esc(ui.closuresTitle)}</span></h3>
        <ul class="exceptions">
          ${exceptions.map((e) => `<li data-until="${e.end}"><strong>${esc(e.label)}</strong><span>${esc(dateRange(e))}: ${esc(e.text)}</span></li>`).join('\n          ')}
        </ul>
      </div>` : ''}
      ${payments.length ? `<div class="card-panel">
        <h3 class="card-panel__title">${ctx.icon('credit-card', 'icon-lg')}<span>${lang === 'pt' ? 'Pagamentos' : 'Payment'}</span></h3>
        <ul class="icon-list">${payments.map((p) => `<li>${ctx.icon(PAYMENTS[p].icon)}<span>${esc(PAYMENTS[p][lang])}</span></li>`).join('')}</ul>
      </div>` : ''}
    </div>
  </div>`;
  return section(ctx, 'hours', inner);
}

/* ------------------------------------------------------------ LOCALIZAÇÃO -- */
export function location(ctx) {
  const { cfg, ui, lang } = ctx;
  const l = cfg.location;
  const b = cfg.business;
  const list = (title, icon, items) => (items?.length ? `<div class="info-block">
        <h3 class="info-block__title">${ctx.icon(icon, 'icon-lg')}<span>${esc(title)}</span></h3>
        <ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>` : '');
  const dir = ctx.directions;
  const map = l.map?.enabled ? `<!-- ===== MAPA (Google Maps) — só carrega após clique/consentimento ===== -->
      <div class="map-consent" data-map data-map-src="${esc(ctx.mapEmbed)}" data-map-title="${esc(ui.mapTitle)}">
        ${img(ctx, l.map.placeholder, { alt: '', cls: 'map-consent__img' })}
        <div class="map-consent__box">
          <p>${ctx.icon('map', 'icon-lg')}<span>${esc(ui.mapConsentText)}</span></p>
          <button type="button" class="btn btn-accent js-only" data-map-load>${esc(ui.mapLoad)}</button>
          <label class="form-check js-only"><input class="form-check-input" type="checkbox" data-map-remember> <span class="form-check-label">${esc(ui.mapRemember)}</span></label>
          <p class="small mb-0"><a href="${esc(dir.google)}" ${ext}>${esc(ctx.fill(ui.openIn, { app: 'Google Maps' }))}${ext_(ctx)}</a> · <a href="${esc(ctx.href('privacy'))}#mapa">${esc(ui.mapPrivacy)}</a></p>
        </div>
      </div>
      <!-- ===== /MAPA ===== -->` : `<figure class="media-frame">${img(ctx, l.map?.placeholder || cfg.hero.image, { alt: '' })}</figure>`;

  const inner = `<div class="row g-4 g-lg-5">
    <div class="col-lg-5 reveal">
      <address class="address-block">
        <strong>${esc(b.name)}</strong><br>
        ${esc(b.address.street)}<br>
        ${esc(b.address.postalCode)} ${esc(b.address.city)}
        ${b.address.locatedIn ? `<br><span class="text-muted-theme">${esc(tr(b.address.locatedIn, lang))}</span>` : ''}
      </address>
      <p class="directions">
        <a class="btn btn-accent" href="${esc(dir.google)}" ${ext}>${ctx.icon('signpost-2')}<span>${esc(ui.directions)}</span>${ext_(ctx)}</a>
        <a class="btn btn-outline-accent btn-sm" href="${esc(dir.waze)}" ${ext}>Waze${ext_(ctx)}</a>
        <a class="btn btn-outline-accent btn-sm" href="${esc(dir.apple)}" ${ext}>Apple Maps${ext_(ctx)}</a>
      </p>
      ${list(ui.parking, 'p-square', tr(l.parking, lang))}
      ${list(ui.transport, 'bus-front', tr(l.transport, lang))}
      ${list(ui.accessibility, 'universal-access', tr(l.accessibility, lang))}
    </div>
    <div class="col-lg-7 reveal">
      ${map}
    </div>
  </div>`;
  return section(ctx, 'location', inner, { intro: '' });
}

/* -------------------------------------------------------------------- FAQ -- */
export function faq(ctx) {
  const { cfg, lang } = ctx;
  const items = cfg.faq.items || [];
  if (!items.length) return '';
  const inner = `<div class="accordion faq reveal" id="faq-accordion">
    ${items.map((it, i) => `<div class="accordion-item">
      <h3 class="accordion-header" id="faq-h-${i}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-${i}" aria-expanded="false" aria-controls="faq-${i}">${esc(tr(it.q, lang))}</button>
      </h3>
      <div id="faq-${i}" class="accordion-collapse collapse" aria-labelledby="faq-h-${i}" data-bs-parent="#faq-accordion">
        <div class="accordion-body">${esc(tr(it.a, lang))}</div>
      </div>
    </div>`).join('\n    ')}
  </div>`;
  return section(ctx, 'faq', inner, { intro: '' });
}

/* -------------------------------------------------------------- CONTACTOS -- */
export function contact(ctx) {
  const { cfg, ui } = ctx;
  const b = cfg.business;
  const showForm = cfg.form?.enabled && !(cfg.sections.reservations && cfg.reservations.method === 'form');
  const card = (icon, title, body) => `<li class="col-sm-6 col-lg-3 reveal"><div class="contact-card">
      <span class="feature__icon">${ctx.icon(icon, 'icon-xl')}</span>
      <h3 class="contact-card__title">${esc(title)}</h3>
      ${body}
    </div></li>`;
  const social = socialLinks(ctx, 'social-links social-links--center');
  const inner = `<ul class="row g-4 list-unstyled justify-content-center">
    ${card('telephone', ui.contactPhone, `<p><a href="${telHref(b.phone)}">${esc(b.phone)}</a></p><p class="call-cost small">${esc(b.phoneType === 'mobile' ? ui.callCostMobile : ui.callCost)}</p>`)}
    ${b.whatsapp ? card('whatsapp', 'WhatsApp', `<p><a href="${esc(waHref(b.whatsapp))}" ${ext}>${esc(b.whatsapp)}${ext_(ctx)}</a></p>`) : ''}
    ${card('envelope', ui.contactEmail, `<p><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></p>`)}
    ${social ? card('chat-dots', ui.contactSocial, social) : ''}
  </ul>
  ${showForm ? `<div class="row justify-content-center mt-4"><div class="col-lg-8">${form(ctx)}</div></div>` : ''}`;
  return section(ctx, 'contact', inner);
}

export const SECTION_RENDERERS = { dailySpecial, menu, about, team, gallery, events, testimonials, reservations, delivery, hours, location, faq, contact };
