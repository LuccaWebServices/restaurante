/**
 * JavaScript do site (vanilla, sem dependências além do Bootstrap para modal/collapse).
 * Os dados vêm de <script type="application/json" id="page-data">, gerado pelo build.
 *
 * Armazenamento local usado (essencial, sem cookies):
 *   rt-lang  → idioma preferido      rt-map → mapa aceite ("lembrar escolha")
 *   rt-theme / rt-hero → só no modo demo (seletor de tema)
 */
(function () {
  'use strict';

  var dataEl = document.getElementById('page-data');
  if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var T = D.t;
  var html = document.documentElement;
  var DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } },
  };
  var fill = function (s, vars) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; }); };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* ---------------------------------------------------------- Cabeçalho -- */
  var header = $('.site-header');
  if (header) {
    var setHeaderH = function () { html.style.setProperty('--header-h', header.offsetHeight + 'px'); };
    setHeaderH();
    if ('ResizeObserver' in window) new ResizeObserver(setHeaderH).observe(header);
    else window.addEventListener('resize', setHeaderH);
  }

  // Fecha o menu móvel ao escolher um link
  var navCollapse = $('#nav-main');
  if (navCollapse) {
    navCollapse.addEventListener('click', function (e) {
      if (e.target.closest('a') && navCollapse.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  }

  // Página 404 (usa <base href>): links "#..." devem ficar na própria página
  if ($('base')) {
    $$('a[href^="#"]').forEach(function (a) { a.setAttribute('href', location.pathname + a.getAttribute('href')); });
  }

  /* ----------------------------------------- Scroll: topo + voltar ao topo -- */
  var backTop = $('[data-back-to-top]');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (backTop) backTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ------------------------------------------- Horário / "Aberto agora" -- */
  var H = D.hours;

  function nowInTz() {
    var parts = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: H.tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var y = +parts.year, m = +parts.month, d = +parts.day;
    return { y: y, m: m, d: d, iso: parts.year + '-' + parts.month + '-' + parts.day, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay(), min: (+parts.hour % 24) * 60 + +parts.minute };
  }
  function addDays(n, k) {
    var dt = new Date(Date.UTC(n.y, n.m - 1, n.d + k));
    return { iso: dt.toISOString().slice(0, 10), wd: dt.getUTCDay(), date: dt };
  }
  function shiftsFor(day) {
    for (var i = 0; i < H.closures.length; i++) if (day.iso >= H.closures[i][0] && day.iso <= H.closures[i][1]) return [];
    if (H.special[day.iso]) return H.special[day.iso];
    return H.weekly[day.wd] || [];
  }
  var hhmm = function (min) { min = ((min % 1440) + 1440) % 1440; return ('0' + Math.floor(min / 60)).slice(-2) + ':' + ('0' + (min % 60)).slice(-2); };

  function computeStatus() {
    var now = nowInTz();
    var today = { iso: now.iso, wd: now.wd };
    var yesterday = addDays(now, -1);
    var i, s;
    var todays = shiftsFor(today);
    for (i = 0; i < todays.length; i++) { s = todays[i]; if (now.min >= s[0] && now.min < s[1]) return { open: true, left: s[1] - now.min, close: s[1] }; }
    var yest = shiftsFor(yesterday);
    for (i = 0; i < yest.length; i++) { s = yest[i]; if (s[1] > 1440 && now.min < s[1] - 1440) return { open: true, left: s[1] - 1440 - now.min, close: s[1] }; }
    for (var k = 0; k <= 14; k++) {
      var day = k === 0 ? today : addDays(now, k);
      var starts = shiftsFor(day).map(function (x) { return x[0]; }).filter(function (st) { return k > 0 || st > now.min; }).sort(function (a, b) { return a - b; });
      if (starts.length) return { open: false, k: k, day: day, at: starts[0] };
    }
    return { open: false };
  }

  function statusText(st) {
    if (st.open) {
      var soon = st.left <= 30;
      return { cls: soon ? 'is-soon' : 'is-open', label: soon ? T.closingSoon : T.open, detail: fill(T.closesAt, { time: hhmm(st.close) }) };
    }
    if (st.k == null) return { cls: 'is-closed', label: T.closed, detail: '' };
    var time = hhmm(st.at);
    var detail;
    if (st.k === 0) detail = fill(T.opensToday, { time: time });
    else if (st.k === 1) detail = fill(T.opensTomorrow, { time: time });
    else if (st.k < 7) detail = fill(T.opensOn, { day: T.daysOn[DAY_KEYS[st.day.wd]], time: time });
    else detail = fill(T.opensDate, { date: new Intl.DateTimeFormat(D.locale, { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(st.day.date), time: time });
    return { cls: 'is-closed', label: T.closed, detail: detail };
  }

  function renderStatus() {
    var info = statusText(computeStatus());
    $$('[data-open-status]').forEach(function (box) {
      var link = box.querySelector('a');
      var target = link || box;
      while (target.firstChild) target.removeChild(target.firstChild);
      target.appendChild(el('span', 'open-status__dot'));
      var txt = el('span');
      txt.appendChild(el('strong', null, info.label));
      if (info.detail) txt.appendChild(document.createTextNode(' · ' + info.detail));
      target.appendChild(txt);
      box.classList.remove('is-open', 'is-soon', 'is-closed');
      box.classList.add(info.cls);
    });
  }

  function markToday() {
    var now = nowInTz();
    var key = DAY_KEYS[now.wd];
    $$('.hours-table tr[data-day="' + key + '"], .week-list__item[data-day="' + key + '"]').forEach(function (row) {
      if (row.classList.contains('is-today')) return;
      row.classList.add('is-today');
      var label = row.querySelector('th, .week-list__day');
      if (label) label.appendChild(el('span', 'today-badge', T.today));
    });
    // Esconde encerramentos/feriados que já passaram
    $$('[data-until]').forEach(function (li) { if (li.getAttribute('data-until') < now.iso) li.hidden = true; });
    $$('.exceptions').forEach(function (ul) {
      var panel = ul.closest('.card-panel');
      if (panel && !ul.querySelector('li:not([hidden])')) panel.hidden = true;
    });
  }

  if ($('[data-open-status]') || $('.hours-table') || $('[data-week-list]')) {
    try {
      renderStatus();
      markToday();
      setInterval(renderStatus, 60000);
    } catch (e) { /* fuso horário não suportado: fica o texto estático */ }
  }

  /* ------------------------------------------------------------ Idioma -- */
  function currentSectionId() {
    if (location.hash && D.sectionMap[location.hash.slice(1)]) return location.hash.slice(1);
    var line = window.innerHeight * 0.35;
    var found = null;
    $$('[data-section][id], [data-menu-cat]').forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > 0) found = s.id;
    });
    return found;
  }
  $$('[data-lang-switch]').forEach(function (a) {
    a.addEventListener('click', function () {
      store.set('rt-lang', a.getAttribute('data-lang'));
      var id = currentSectionId();
      if (!id) return;
      var mapped = D.sectionMap[id] || (id.indexOf('cat-') === 0 ? id : null);
      if (mapped) a.setAttribute('href', a.getAttribute('href').split('#')[0] + '#' + mapped);
    });
  });
  // Ao escolher explicitamente o idioma atual, também fica guardado
  $$('.lang-switch a[aria-current]').forEach(function (a) { a.addEventListener('click', function () { store.set('rt-lang', D.lang); }); });

  // Sugestão (sem redirecionar) do outro idioma
  var suggest = $('[data-lang-suggest]');
  if (suggest && D.langSuggestion && !$('base')) {
    var stored = store.get('rt-lang');
    var browser = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    var preferred = stored || (browser.indexOf('pt') === 0 ? 'pt' : 'en');
    if (preferred !== D.lang) {
      suggest.hidden = false;
      $('[data-lang-dismiss]', suggest).addEventListener('click', function () {
        store.set('rt-lang', D.lang);
        suggest.hidden = true;
      });
    }
  }

  /* ------------------------------------------------------------ Ementa -- */
  var menuNav = $('[data-menu-nav]');
  var cats = $$('[data-menu-cat]');
  if (menuNav && cats.length && 'IntersectionObserver' in window) {
    var links = $$('a', menuNav);
    var setActive = function (id) {
      links.forEach(function (l) {
        var on = l.getAttribute('href') === '#' + id;
        l.classList.toggle('is-active', on);
        if (on) {
          l.setAttribute('aria-current', 'true');
          var ul = menuNav.querySelector('ul');
          ul.scrollTo({ left: l.offsetLeft - 16, behavior: 'smooth' });
        } else l.removeAttribute('aria-current');
      });
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-30% 0px -65% 0px' });
    cats.forEach(function (c) { spy.observe(c); });
  }

  var filterForm = $('[data-menu-filter]');
  if (filterForm) {
    var countEl = $('[data-menu-count]');
    var applyFilter = function () {
      var fd = new FormData(filterForm);
      var diets = fd.getAll('diet');
      var allergens = fd.getAll('allergen');
      var active = diets.length || allergens.length;
      var visible = 0;
      cats.forEach(function (cat) {
        var catVisible = 0;
        $$('.dish', cat).forEach(function (dish) {
          var d = (dish.getAttribute('data-diet') || '').split(' ');
          var a = (dish.getAttribute('data-allergens') || '').split(' ');
          var show = diets.every(function (x) { return d.indexOf(x) > -1; }) && !allergens.some(function (x) { return a.indexOf(x) > -1; });
          dish.hidden = !show;
          if (show) catVisible++;
        });
        visible += catVisible;
        var empty = $('.menu-cat__empty', cat);
        if (empty) empty.hidden = catVisible > 0;
      });
      if (countEl) countEl.textContent = active ? (visible === 1 ? T.filterCountOne : fill(T.filterCount, { n: visible })) : '';
    };
    filterForm.addEventListener('change', applyFilter);
    filterForm.addEventListener('reset', function () { setTimeout(applyFilter, 0); });
  }

  /* ------------------------------------------------- Galeria + lightbox -- */
  var galleryFilter = $('[data-gallery-filter]');
  if (galleryFilter) {
    galleryFilter.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      $$('[data-filter]', galleryFilter).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      $$('.gallery-grid__item').forEach(function (it) { it.hidden = !!f && it.getAttribute('data-category') !== f; });
    });
  }

  var lightboxEl = $('#lightbox');
  if (lightboxEl && window.bootstrap) {
    var modal = window.bootstrap.Modal.getOrCreateInstance(lightboxEl);
    var lbImg = $('[data-lightbox-img]', lightboxEl);
    var lbCap = $('[data-lightbox-caption]', lightboxEl);
    var lbCount = $('[data-lightbox-counter]', lightboxEl);
    var items = [];
    var index = 0;
    var show = function (i) {
      index = (i + items.length) % items.length;
      var link = items[index];
      var thumb = link.querySelector('img');
      lbImg.src = link.getAttribute('href');
      lbImg.alt = link.getAttribute('data-alt') || '';
      if (thumb) { lbImg.width = thumb.width; lbImg.height = thumb.height; lbImg.setAttribute('width', thumb.getAttribute('width')); lbImg.setAttribute('height', thumb.getAttribute('height')); }
      lbCap.textContent = link.getAttribute('data-alt') || '';
      lbCount.textContent = fill(T.galleryCounter, { i: index + 1, n: items.length });
    };
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-gallery-index]');
      if (!link) return;
      e.preventDefault();
      items = $$('[data-gallery-index]').filter(function (a) { return !a.closest('[hidden]'); });
      show(items.indexOf(link));
      modal.show();
    });
    $('[data-lightbox-prev]', lightboxEl).addEventListener('click', function () { show(index - 1); });
    $('[data-lightbox-next]', lightboxEl).addEventListener('click', function () { show(index + 1); });
    lightboxEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* --------------------------------------- Mapa (só com consentimento) -- */
  var mapBox = $('[data-map]');
  if (mapBox) {
    var loadMap = function () {
      var iframe = document.createElement('iframe');
      iframe.src = mapBox.getAttribute('data-map-src');
      iframe.title = mapBox.getAttribute('data-map-title');
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      while (mapBox.firstChild) mapBox.removeChild(mapBox.firstChild);
      mapBox.appendChild(iframe);
      mapBox.classList.add('is-loaded');
    };
    var btn = $('[data-map-load]', mapBox);
    btn.addEventListener('click', function () {
      var remember = $('[data-map-remember]', mapBox);
      if (remember && remember.checked) store.set('rt-map', '1');
      loadMap();
    });
    if (store.get('rt-map') === '1') loadMap();
  }

  /* --------------------------------------------- Formulário (EmailJS) -- */
  var form = $('[data-booking-form]');
  if (form) {
    var F = T.form;
    var started = Date.now();
    var statusEl = $('[data-form-status]', form);
    var dateInput = form.elements.date;
    var todayIso = nowInTz().iso;
    if (dateInput) dateInput.min = todayIso;

    var setError = function (input, msg) {
      var err = document.getElementById(input.id + '-error');
      input.classList.toggle('is-invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg || '';
    };
    var validateForm = function () {
      var e = form.elements;
      var checks = [
        [e.name, !e.name.value.trim() && F.errRequired],
        [e.email, !e.email.value.trim() ? F.errRequired : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.email.value.trim()) && F.errEmail],
        [e.phone, !e.phone.value.trim() ? F.errRequired : !/^[+\d][\d\s()-]{7,}$/.test(e.phone.value.trim()) && F.errPhone],
        [e.people, !(+e.people.value >= 1 && +e.people.value <= D.maxPeople) && fill(F.errPeople, { max: D.maxPeople })],
        [e.date, !e.date.value ? F.errRequired : e.date.value < todayIso && F.errDate],
        [e.time, !e.time.value && F.errRequired],
        [e.consent, !e.consent.checked && F.errConsent],
      ];
      var first = null;
      checks.forEach(function (c) { setError(c[0], c[1] || ''); if (c[1] && !first) first = c[0]; });
      return first;
    };
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      statusEl.className = 'form-status';
      var firstInvalid = validateForm();
      if (firstInvalid) {
        statusEl.textContent = F.invalid;
        statusEl.classList.add('is-error');
        firstInvalid.focus();
        return;
      }
      var done = function (ok) {
        statusEl.textContent = ok ? F.success : F.error;
        statusEl.classList.add(ok ? 'is-success' : 'is-error');
        submitBtn.disabled = false;
        submitBtn.textContent = F.submit;
        if (ok) form.reset();
      };
      var submitBtn = form.querySelector('[type="submit"]');
      // Anti-spam: campo isco preenchido ou envio instantâneo → finge sucesso sem enviar
      if (form.elements.website.value || Date.now() - started < 2500) return done(true);
      submitBtn.disabled = true;
      submitBtn.textContent = F.sending;
      var e = form.elements;
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: form.getAttribute('data-emailjs-service'),
          template_id: form.getAttribute('data-emailjs-template'),
          user_id: form.getAttribute('data-emailjs-public'),
          template_params: {
            name: e.name.value.trim(), email: e.email.value.trim(), phone: e.phone.value.trim(),
            date: e.date.value, time: e.time.value, people: e.people.value, notes: e.notes.value.trim(),
            language: D.lang, page: location.href,
          },
        }),
      }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
    });
  }

  /* ------------------------------------------------- Seletor de tema (demo) -- */
  var switcher = $('[data-demo-switcher]');
  if (switcher) {
    switcher.elements.theme.value = html.getAttribute('data-theme');
    switcher.elements.hero.value = html.getAttribute('data-hero');
    switcher.addEventListener('change', function () {
      var t = switcher.elements.theme.value;
      var h = switcher.elements.hero.value;
      html.setAttribute('data-theme', t);
      html.setAttribute('data-hero', h);
      if (t === 'elegante') html.setAttribute('data-bs-theme', 'dark'); else html.removeAttribute('data-bs-theme');
      store.set('rt-theme', t);
      store.set('rt-hero', h);
    });
  }

  /* ---------------------------------------------- Animações ao aparecer -- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (D.animations && !reduce && 'IntersectionObserver' in window) {
    var reveals = $$('.reveal');
    var vh = window.innerHeight;
    reveals.forEach(function (r) { if (r.getBoundingClientRect().top < vh) r.classList.add('is-visible'); });
    html.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (r) { if (!r.classList.contains('is-visible')) io.observe(r); });
  }
})();
