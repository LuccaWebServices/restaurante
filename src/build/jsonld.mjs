/** Dados estruturados (JSON-LD, schema.org) gerados a partir da configuração. */
import { DIETS, PAYMENTS } from '../i18n/ui.mjs';
import { tr } from './util.mjs';
import { schemaOpeningHours, schemaSpecialHours } from './hours.mjs';

/** Serializa JSON-LD de forma segura dentro de <script>. */
export const ldScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export function restaurantLD(ctx) {
  const { cfg, lang } = ctx;
  const b = cfg.business;
  const on = (k) => cfg.sections[k];
  const sameAs = [...Object.values(b.social || {}), b.googleBusinessUrl].filter(Boolean);
  const res = cfg.reservations;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${cfg.site.url}#restaurant`,
    name: b.name,
    description: tr(cfg.seo.home.description, lang),
    url: ctx.abs('home'),
    image: [ctx.absAsset(b.ogImage.src), ctx.absAsset(cfg.hero.image.src)],
    logo: ctx.absAsset(b.logo?.image?.src || 'assets/img/icons/icon-512.png'),
    telephone: b.phone,
    email: b.email,
    priceRange: b.priceRange,
    servesCuisine: b.servesCuisine,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      postalCode: b.address.postalCode,
      addressLocality: b.address.city,
      addressRegion: b.address.region,
      addressCountry: b.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng },
    hasMap: ctx.mapsUrl,
    openingHoursSpecification: schemaOpeningHours(cfg.hours.weekly),
    currenciesAccepted: 'EUR',
    paymentAccepted: (b.payments || []).map((p) => PAYMENTS[p].en).join(', '),
    inLanguage: lang === 'pt' ? 'pt-PT' : 'en',
  };
  const special = schemaSpecialHours(cfg.hours);
  if (special.length) data.specialOpeningHoursSpecification = special;
  if (sameAs.length) data.sameAs = sameAs;
  if (on('menu')) data.hasMenu = cfg.menu.ownPage ? ctx.abs('menu') : `${ctx.abs('home')}#${ctx.ids.menu}`;
  if (on('reservations')) data.acceptsReservations = res.method === 'external' ? res.external.url : true;
  else data.acceptsReservations = false;

  // Comodidades (acessibilidade, estacionamento) a partir das listas da localização
  if (on('location')) {
    const feats = [...(tr(cfg.location.accessibility, lang) || []), ...(tr(cfg.location.parking, lang) || [])];
    if (feats.length) data.amenityFeature = feats.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true }));
  }
  return data;
}

export function websiteLD(ctx) {
  const { cfg, lang } = ctx;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${cfg.site.url}#website`,
    name: cfg.business.name,
    url: ctx.abs('home'),
    inLanguage: lang === 'pt' ? 'pt-PT' : 'en',
    publisher: { '@id': `${cfg.site.url}#restaurant` },
  };
}

export function faqLD(ctx) {
  const { cfg, lang } = ctx;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faq.items.map((it) => ({
      '@type': 'Question',
      name: tr(it.q, lang),
      acceptedAnswer: { '@type': 'Answer', text: tr(it.a, lang) },
    })),
  };
}

export function breadcrumbLD(ctx, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

/** Ementa completa como schema.org/Menu (secções e pratos com preço). */
export function menuLD(ctx) {
  const { cfg, lang } = ctx;
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${ctx.abs('menu')}#menu`,
    name: tr(cfg.menu.title, lang),
    url: ctx.abs('menu'),
    inLanguage: lang === 'pt' ? 'pt-PT' : 'en',
    hasMenuSection: cfg.menu.categories.map((c) => ({
      '@type': 'MenuSection',
      name: tr(c.name, lang),
      hasMenuItem: c.items.map((it) => {
        const item = {
          '@type': 'MenuItem',
          name: tr(it.name, lang),
          offers: { '@type': 'Offer', price: it.price.toFixed(2), priceCurrency: 'EUR' },
        };
        if (it.description) item.description = tr(it.description, lang);
        const diets = (it.diet || []).map((d) => DIETS[d].schema).filter(Boolean);
        if (diets.length) item.suitableForDiet = diets.length === 1 ? diets[0] : diets;
        if (it.image) item.image = ctx.absAsset(it.image.src);
        return item;
      }),
    })),
  };
}
