/** Horários: leitura dos turnos, resumo legível e dados para o JSON-LD / JavaScript. */
import { DAY_KEYS } from '../i18n/ui.mjs';
import { todayLisbon } from './util.mjs';

export const SHIFT_RE = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]|24):([0-5]\d)$/;

/** '12:00-15:00' → { open: '12:00', close: '15:00', start: 720, end: 900 } */
export function parseShift(s) {
  const m = SHIFT_RE.exec(String(s).trim());
  if (!m) return null;
  const start = +m[1] * 60 + +m[2];
  let end = +m[3] * 60 + +m[4];
  if (end <= start) end += 24 * 60; // turno que passa da meia-noite
  return { open: `${m[1]}:${m[2]}`, close: `${m[3]}:${m[4]}`, start, end };
}

/** Texto de um dia: "12:00–15:00 e 19:00–22:30" ou "Encerrado". */
export function shiftsText(shifts, ui) {
  if (!shifts.length) return ui.closed;
  return shifts.map((s) => s.replace('-', '–')).join(` ${ui.and} `);
}

/**
 * Resumo agrupado de dias consecutivos com o mesmo horário:
 * [{ label: 'Ter–Qui', text: '12:00–15:00 e 19:00–22:30' }, ...]
 */
export function weeklySummary(weekly, ui) {
  const groups = [];
  for (const day of DAY_KEYS) {
    const text = shiftsText(weekly[day] || [], ui);
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.days.push(day);
    else groups.push({ days: [day], text });
  }
  return groups.map((g) => ({
    label: g.days.length === 1 ? ui.daysShort[g.days[0]] : `${ui.daysShort[g.days[0]]}–${ui.daysShort[g.days[g.days.length - 1]]}`,
    text: g.text,
  }));
}

const SCHEMA_DAY = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

/** openingHoursSpecification: um objeto por turno (agrupa dias com o mesmo turno). */
export function schemaOpeningHours(weekly) {
  const byShift = new Map();
  for (const day of DAY_KEYS) {
    for (const s of weekly[day] || []) {
      const p = parseShift(s);
      const key = `${p.open}-${p.close}`;
      if (!byShift.has(key)) byShift.set(key, { open: p.open, close: p.close, days: [] });
      byShift.get(key).days.push(SCHEMA_DAY[day]);
    }
  }
  return [...byShift.values()].map((g) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: g.days.length === 1 ? g.days[0] : g.days,
    opens: g.open,
    closes: g.close === '24:00' ? '23:59' : g.close,
  }));
}

/** specialOpeningHoursSpecification para feriados e encerramentos futuros. */
export function schemaSpecialHours(hours) {
  const today = todayLisbon(hours.timezone);
  const out = [];
  for (const sp of hours.special || []) {
    if (sp.date < today) continue;
    if (!sp.shifts.length) out.push({ '@type': 'OpeningHoursSpecification', validFrom: sp.date, validThrough: sp.date, opens: '00:00', closes: '00:00' });
    for (const s of sp.shifts) {
      const p = parseShift(s);
      out.push({ '@type': 'OpeningHoursSpecification', validFrom: sp.date, validThrough: sp.date, opens: p.open, closes: p.close });
    }
  }
  for (const c of hours.closures || []) {
    if (c.to < today) continue;
    out.push({ '@type': 'OpeningHoursSpecification', validFrom: c.from, validThrough: c.to, opens: '00:00', closes: '00:00' });
  }
  return out;
}

/** Dados compactos para o JavaScript calcular "Aberto agora". */
export function runtimeHours(hours) {
  const toPairs = (list) => list.map((s) => { const p = parseShift(s); return [p.start, p.end]; });
  const weekly = {};
  // Índices JS: 0 = domingo ... 6 = sábado
  ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].forEach((d, i) => { weekly[i] = toPairs(hours.weekly[d] || []); });
  const special = {};
  for (const sp of hours.special || []) special[sp.date] = toPairs(sp.shifts);
  const closures = (hours.closures || []).map((c) => [c.from, c.to]);
  return { tz: hours.timezone, weekly, special, closures };
}
