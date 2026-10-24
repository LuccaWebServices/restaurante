/** Páginas do site: inicial, ementa, privacidade e 404. */
import { esc, tr } from '../build/util.mjs';
import { restaurantLD, websiteLD, faqLD, breadcrumbLD, menuLD } from '../build/jsonld.mjs';
import { head, page, reserveAction, actionLink } from './layout.mjs';
import { hero, fullMenu, lightbox, SECTION_RENDERERS } from './sections.mjs';
import { privacyContent } from './privacy.mjs';

function pageHead(ctx, { title, intro = '', crumbs }) {
  const { ui } = ctx;
  return `<div class="page-head">
  <div class="container">
    <nav aria-label="${esc(ui.breadcrumb)}">
      <ol class="breadcrumb">
        ${crumbs.map((c, i) => (i === crumbs.length - 1
          ? `<li class="breadcrumb-item active" aria-current="page">${esc(c.name)}</li>`
          : `<li class="breadcrumb-item"><a href="${esc(c.href)}">${esc(c.name)}</a></li>`)).join('\n        ')}
      </ol>
    </nav>
    <h1 class="page-head__title">${esc(title)}</h1>
    ${intro ? `<p class="page-head__intro">${esc(intro)}</p>` : ''}
  </div>
</div>`;
}

export function homePage(ctx) {
  const { cfg, lang } = ctx;
  const sections = Object.keys(cfg.sections)
    .filter((k) => cfg.sections[k] && SECTION_RENDERERS[k])
    .map((k) => SECTION_RENDERERS[k](ctx))
    .filter(Boolean);
  const jsonld = [restaurantLD(ctx), websiteLD(ctx)];
  if (cfg.sections.faq && cfg.faq.items?.length) jsonld.push(faqLD(ctx));
  if (cfg.sections.menu && !cfg.menu.ownPage) jsonld.push(menuLD(ctx));
  const headHtml = head(ctx, { title: tr(cfg.seo.home.title, lang), description: tr(cfg.seo.home.description, lang), jsonld });
  const main = `${hero(ctx)}\n${sections.join('\n')}`;
  return page(ctx, { headHtml, main, extraBody: cfg.sections.gallery && cfg.gallery.images?.length ? lightbox(ctx) : '' });
}

export function menuPage(ctx) {
  const { cfg, ui, lang } = ctx;
  const title = tr(cfg.seo.menu.title, lang);
  const h1 = tr(cfg.menu.title, lang);
  const crumbs = [
    { name: ui.home, href: ctx.href('home'), url: ctx.abs('home') },
    { name: tr(cfg.menu.navLabel || cfg.menu.title, lang), href: ctx.href('menu'), url: ctx.abs('menu') },
  ];
  const jsonld = [restaurantLD(ctx), menuLD(ctx), breadcrumbLD(ctx, crumbs)];
  const headHtml = head(ctx, { title, description: tr(cfg.seo.menu.description, lang), jsonld });
  const reserve = reserveAction(ctx);
  const main = `${pageHead(ctx, { title: h1, intro: tr(cfg.menu.intro, lang), crumbs })}
<section class="section section--menu-page" aria-label="${esc(h1)}" data-section="menu">
  <div class="container container-menu">
    ${fullMenu(ctx, 2)}
    ${reserve ? `<p class="text-center mt-5">${actionLink(ctx, { ...reserve, label: ui.reserveTable }, 'btn btn-accent btn-lg')}</p>` : ''}
  </div>
</section>`;
  return page(ctx, { headHtml, main });
}

export function privacyPage(ctx) {
  const { cfg, ui, lang } = ctx;
  const crumbs = [
    { name: ui.home, href: ctx.href('home'), url: ctx.abs('home') },
    { name: ui.privacy, href: ctx.href('privacy'), url: ctx.abs('privacy') },
  ];
  const headHtml = head(ctx, { title: tr(cfg.seo.privacy.title, lang), description: tr(cfg.seo.privacy.description, lang), jsonld: [breadcrumbLD(ctx, crumbs)] });
  const main = `${pageHead(ctx, { title: ui.privacy, crumbs })}
<section class="section section--legal" aria-label="${esc(ui.privacy)}">
  <div class="container"><article class="prose prose--legal">
${privacyContent(ctx)}
  </article></div>
</section>`;
  return page(ctx, { headHtml, main });
}

/** 404 bilingue. Usa <base href> para os caminhos funcionarem em qualquer URL inexistente. */
export function notFoundPage(ctx, ctxEn) {
  const { cfg, ui } = ctx;
  const headHtml = head(ctx, { title: `${ui.notFoundTitle} · ${ctxEn.ui.notFoundTitle} — ${cfg.business.name}`, description: ui.notFoundText, noindex: true, alternates: false });
  const main = `<section class="section not-found" aria-labelledby="nf-title">
  <div class="container text-center">
    <p class="not-found__code" aria-hidden="true">404</p>
    <h1 id="nf-title" class="section__title">${esc(ui.notFoundTitle)} <span lang="en" class="d-block not-found__en">${esc(ctxEn.ui.notFoundTitle)}</span></h1>
    <p>${esc(ui.notFoundText)}</p>
    <p lang="en">${esc(ctxEn.ui.notFoundText)}</p>
    <p class="d-flex flex-wrap gap-2 justify-content-center mt-4">
      <a class="btn btn-accent" href="./">${esc(ui.notFoundCta)}</a>
      <a class="btn btn-outline-accent" href="en/" lang="en">${esc(ctxEn.ui.notFoundCta)}</a>
    </p>
  </div>
</section>`;
  return page(ctx, { headHtml, main });
}
