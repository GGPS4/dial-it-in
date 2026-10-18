import { AMPS, FX, SLOT_ORDER, SLOT_LABEL, parseTone } from './spark.js';
import { ARTISTS } from './artists.js';
import { SONGS } from './songs.js';
import {
  PICKUPS, LAYOUTS, ROOMS, DEFAULT_GUITARS, searchLibrary, suggestions, findArtist, splitQuery,
  resultFromSong, resultFromArtist, resultFromGenre, genreFromTags, musicBrainzLookup, musicBrainzGenres,
  askClaude, listClaudeModels, finalizePart,
} from './engine.js';

// ── tiny helpers ────────────────────────────────────────────────────
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = v => (Math.round(v * 10) / 10).toString();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const keyOf = q => q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const store = {
  get(k, d) { try { const v = localStorage.getItem('sr.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('sr.' + k, JSON.stringify(v)); } catch { /* storage unavailable: keep in memory */ } },
  del(k) { try { localStorage.removeItem('sr.' + k); } catch { } },
};

const state = {
  guitars: store.get('guitars', DEFAULT_GUITARS),
  active: store.get('activeGuitar', 'g1'),
  room: store.get('room', 'practice'),
  claude: { key: store.get('ck', ''), model: store.get('cm', ''), auto: store.get('ca', true) },
  cache: store.get('claudeCache', {}),
  result: null,
  partIndex: 0,
  query: '',
};
const guitar = () => state.guitars.find(g => g.id === state.active) || state.guitars[0];

// ── Panel (the hero) ────────────────────────────────────────────────
const KNOBS = [
  { id: 'Gain', x: 205, label: 'GAIN' }, { id: 'Bass', x: 290, label: 'BASS' }, { id: 'Mid', x: 375, label: 'MIDDLE' },
  { id: 'Treble', x: 460, label: 'TREBLE' }, { id: 'Master', x: 545, label: 'MASTER' },
  { id: 'mod', x: 660, label: 'MOD' }, { id: 'delay', x: 745, label: 'DELAY' }, { id: 'reverb', x: 830, label: 'REVERB' },
  { id: 'Output', x: 935, label: 'OUTPUT' },
];
const angle = v => -135 + (Math.max(0, Math.min(10, v)) / 10) * 270;

function ticks(cx, cy, r1, r2, n = 11) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (angle(i) - 90) * Math.PI / 180;
    s += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}"/>`;
  }
  return s;
}

function buildPanel() {
  const svg = $('#panel');
  let knobs = '';
  for (const k of KNOBS) {
    knobs += `<g class="pk" data-k="${k.id}">
      <text x="${k.x}" y="44" class="silk">${k.label}</text>
      <g class="tick">${ticks(k.x, 105, 40, 46)}</g>
      <circle cx="${k.x}" cy="105" r="34" class="knurl"/>
      <circle cx="${k.x}" cy="105" r="30" class="knurl-in"/>
      <g class="rot" style="transform-origin:${k.x}px 105px">
        <circle cx="${k.x}" cy="105" r="22" class="cap"/>
        <rect x="${k.x - 2}" y="74" width="4" height="22" rx="2" class="ptr"/>
      </g>
      <text x="${k.x}" y="172" class="val" data-val="${k.id}">–</text>
      <text x="${k.x}" y="192" class="sub" data-sub="${k.id}"></text>
    </g>`;
  }
  svg.innerHTML = `
    <defs>
      <filter id="tolex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 .14  0 0 0 0 .13  0 0 0 0 .12  0 0 0 .55 0" result="g"/>
        <feComposite in="g" in2="SourceGraphic" operator="in"/>
        <feBlend in2="SourceGraphic" mode="multiply"/>
      </filter>
      <radialGradient id="capG" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#ECD08A"/><stop offset=".55" stop-color="#C8A050"/><stop offset="1" stop-color="#8F6C2A"/></radialGradient>
      <radialGradient id="knurlG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3a3835"/><stop offset="1" stop-color="#121110"/></radialGradient>
    </defs>
    <rect x="0" y="0" width="1000" height="210" rx="14" class="plate" filter="url(#tolex)"/>
    <rect x="8" y="8" width="984" height="194" rx="10" class="trim"/>
    <g class="power"><circle cx="30" cy="30" r="9" class="led-glow"/><circle cx="30" cy="30" r="4.5" class="led"/></g>
    <g class="amp-sel">
      <text x="88" y="44" class="silk">AMP</text>
      <g class="tick">${ticks(88, 105, 40, 46, 5)}</g>
      <circle cx="88" cy="105" r="34" class="knurl"/>
      <circle cx="88" cy="105" r="30" class="knurl-in"/>
      <g class="rot" id="ampRot" style="transform-origin:88px 105px"><circle cx="88" cy="105" r="22" class="cap"/><rect x="86" y="74" width="4" height="22" rx="2" class="ptr"/></g>
      <g class="ampTape" transform="translate(88 172)"><rect x="-70" y="-14" width="140" height="26" rx="2" class="tapebg" transform="rotate(-2)"/><text x="0" y="5" class="tapetxt" id="ampName" transform="rotate(-2)">pick a song</text></g>
    </g>
    <line x1="160" y1="30" x2="160" y2="186" class="sep"/>
    <line x1="602" y1="30" x2="602" y2="186" class="sep"/>
    <line x1="885" y1="30" x2="885" y2="186" class="sep"/>
    ${knobs}`;
  setPanel(null);
}

const LEVEL_KEYS = ['Level', 'Mix', 'Echo Volume', 'Depth', 'Intensity', 'Volume'];
function slotLevel(tone, slot) {
  const fx = tone?.[slot];
  if (!fx) return null;
  for (const k of LEVEL_KEYS) if (fx.params[k] != null) return fx.params[k];
  return Object.values(fx.params)[0];
}

function setPanel(tone, animate = true) {
  const svg = $('#panel');
  svg.classList.toggle('idle', !tone);
  svg.classList.toggle('instant', !animate || reduceMotion);
  const cats = ['Clean', 'Glassy', 'Crunch', 'High Gain', 'Metal'];
  const amp = tone?.amp;
  const catIdx = amp ? Math.max(0, cats.indexOf(AMPS[amp.model].cat)) : 0;
  $('#ampRot').style.transform = `rotate(${amp ? -135 + catIdx * 67.5 : -135}deg)`;
  $('#ampName').textContent = amp ? amp.model : 'pick a song';
  for (const k of KNOBS) {
    let v = null, sub = '';
    if (k.id === 'Output') { v = 5; sub = 'to taste'; }
    else if (['mod', 'delay', 'reverb'].includes(k.id)) {
      v = slotLevel(tone, k.id);
      sub = tone ? (tone[k.id] ? tone[k.id].model : 'off') : '';
      if (v == null) v = 0;
    } else v = amp ? amp[k.id] : 0;
    const g = svg.querySelector(`[data-k="${k.id}"]`);
    g.querySelector('.rot').style.transform = `rotate(${tone ? angle(v) : -135}deg)`;
    g.classList.toggle('off', !!tone && sub === 'off');
    g.querySelector('.val').textContent = tone ? fmt(v) : '–';
    g.querySelector('.sub').textContent = sub;
  }
  if (tone) {
    $('#panelCaption').textContent = 'Turn your amp\'s knobs to match these positions after loading the preset. Mod, Delay and Reverb set each effect\'s level. Leave Output wherever is comfortable.';
  }
}

// ── Mini knob for pedals ────────────────────────────────────────────
function miniKnob(v, changed, from) {
  const a = angle(v);
  return `<svg viewBox="0 0 48 48" class="mk${changed ? ' changed' : ''}" aria-hidden="true">
    <circle cx="24" cy="24" r="17" class="mk-body"/>
    <g style="transform:rotate(${a}deg);transform-origin:24px 24px"><line x1="24" y1="24" x2="24" y2="9" class="mk-ptr"/></g>
    ${changed && from != null ? `<g style="transform:rotate(${angle(from)}deg);transform-origin:24px 24px"><line x1="24" y1="12" x2="24" y2="5" class="mk-ghost"/></g>` : ''}
  </svg>`;
}

const PEDAL_COLOR = {
  'Noise Gate': '#4A4F55', 'LA Comp': '#9C9A90', 'Sustain Comp': '#D7C9A3', 'Red Comp': '#B23A33', 'Bass Comp': '#4C5A4A', 'Optical Comp': '#8D9AA6', 'Auto Wah': '#C2913C',
  'Booster': '#CFCFC6', 'Tube Drive': '#5E8C4A', 'Over Drive': '#D9B23A', 'Fuzz Face': '#3E6FA8', 'Black Op': '#2E2E2E', 'Bass Muff': '#3D3D45', 'Guitar Muff': '#B9BDC2', 'Bassmaster': '#8B5A2B', 'SAB Driver': '#6A7D8C', 'Clone Drive': '#C9A15B',
  'Tremolo': '#2E7D74', 'Chorus': '#6AA4C8', 'Flanger': '#8A6BB0', 'Phaser': '#E07A2F', 'Vibrato': '#4D7FA0', 'UniVibe': '#6E4A7E', 'Cloner Chorus': '#7FB3A5', 'Classic Vibe': '#A8584A', 'Tremolator': '#B08B3E', 'Tremolo Square': '#555A5E', 'Guitar EQ': '#E9E6DC',
  'Digital Delay': '#EEEEE8', 'Echo Filt': '#A8B3A0', 'Vintage Delay': '#7C8C93', 'Reverse Delay': '#2E3F5C', 'Multi Head': '#6D5A3F', 'Echo Tape': '#5B6B52',
};
const isLight = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150; };

function changedMap(ledger) {
  const m = new Map();
  ledger.forEach(l => l.changes.forEach(c => { const k = c.slot + '|' + c.param; if (!m.has(k)) m.set(k, { from: c.from, to: c.to }); else m.get(k).to = c.to; }));
  return m;
}

function renderChain(p) {
  const ch = changedMap(p.ledger);
  const out = SLOT_ORDER.map(slot => {
    if (slot === 'amp') {
      const a = p.final.amp;
      const knobs = ['Gain', 'Bass', 'Mid', 'Treble', 'Master'].map(k => {
        const c = ch.get('amp|' + k);
        return `<div class="kn"><div class="kn-dial">${miniKnob(a[k], !!c, c?.from)}</div><span class="kn-v">${fmt(a[k])}${c ? `<s>${fmt(c.from)}</s>` : ''}</span><span class="kn-l">${k}</span></div>`;
      }).join('');
      return `<li class="slot amp-slot"><div class="slot-name">Amp</div><div class="amp-head"><div class="amp-model">${esc(a.model)}</div><div class="amp-real">based on ${esc(AMPS[a.model].real)}</div><div class="kn-row">${knobs}</div></div></li>`;
    }
    const fx = p.final[slot];
    const added = ch.has(slot + '|' + fx?.model);
    if (!fx) return `<li class="slot off"><div class="slot-name">${SLOT_LABEL[slot]}</div><div class="pedal ghost"><span>Off</span></div></li>`;
    const def = FX[slot][fx.model];
    const col = slot === 'reverb' ? '#3C4E63' : (PEDAL_COLOR[fx.model] || '#666');
    const knobs = def.p.map(k => {
      const v = fx.params[k];
      const c = ch.get(slot + '|' + k);
      return `<div class="kn"><div class="kn-dial">${miniKnob(v, !!c, c?.from)}</div><span class="kn-v">${fmt(v)}${c ? `<s>${fmt(c.from)}</s>` : ''}</span><span class="kn-l">${esc(k)}</span></div>`;
    }).join('');
    const ms = fx.ms ? `<div class="pedal-ms">${fx.ms} ms</div>` : '';
    return `<li class="slot"><div class="slot-name">${SLOT_LABEL[slot]}</div>
      <div class="pedal ${isLight(col) ? 'light' : 'dark'}${added ? ' added' : ''}${def.eq ? ' eq' : ''}" style="--c:${col}">
        ${added ? '<span class="added-tag">added for your guitar</span>' : ''}
        <div class="kn-row">${knobs}</div>
        <div class="pedal-name">${esc(fx.model)}</div>${ms}
        <div class="pedal-real">${esc(def.real)}</div>
        <div class="foot-sw" aria-hidden="true"></div>
      </div></li>`;
  }).join('');
  return `<ol class="chain" aria-label="Signal chain, left to right">${out}</ol>`;
}

// ── Pickup selector visual ──────────────────────────────────────────
function pickupDiagram(g, yourPos) {
  const L = g.layout;
  const slots = { SSS: ['S', 'S', 'S'], HSS: ['S', 'S', 'H'], HSH: ['H', 'S', 'H'], SS: ['S', null, 'T'], HH: ['H', null, 'H'], HHhot: ['H', null, 'H'], AA: ['H', null, 'H'], PP: ['P', null, 'P'], FF: ['H', null, 'H'], JM: ['S', null, 'S'], AC: [] }[L] || ['S', 'S', 'S'];
  if (L === 'AC') return `<svg viewBox="0 0 260 90" class="pu-fig" aria-hidden="true"><circle cx="130" cy="45" r="32" class="pu-hole"/><rect x="40" y="70" width="180" height="6" rx="3" class="pu-on"/></svg>`;
  const y = yourPos.toLowerCase();
  const on = [false, false, false]; // neck, middle, bridge
  if (/position 4/.test(y)) { on[1] = on[2] = true; }
  else if (/position 2/.test(y)) { on[0] = on[1] = true; }
  else if (/both/.test(y)) { on[0] = on[2] = true; if (slots[1]) on[1] = false; }
  else if (/neck/.test(y)) on[0] = true;
  else if (/middle pickup/.test(y)) on[1] = true;
  else on[2] = true;
  const xs = [70, 130, 195];
  let s = '<svg viewBox="0 0 260 90" class="pu-fig" aria-hidden="true"><path d="M20 20 H240 Q250 45 240 70 H20 Q10 45 20 20Z" class="pu-guard"/>';
  slots.forEach((t, i) => {
    if (!t) return;
    const x = xs[i], c = on[i] ? 'pu-on' : 'pu-off';
    if (t === 'H') s += `<rect x="${x - 17}" y="27" width="34" height="36" rx="5" class="${c}"/><line x1="${x}" y1="30" x2="${x}" y2="60" class="pu-seam"/>`;
    else if (t === 'P') s += `<rect x="${x - 14}" y="27" width="28" height="36" rx="5" class="${c}"/>`;
    else s += `<rect x="${x - 8}" y="25" width="16" height="40" rx="8" class="${c}"/>`;
  });
  s += `<text x="70" y="84" class="pu-t">neck</text><text x="195" y="84" class="pu-t">bridge</text></svg>`;
  return s;
}

// ── EQ response ─────────────────────────────────────────────────────
function response(tone, pu) {
  const P = PICKUPS[pu] || PICKUPS.H;
  const pts = [];
  const a = tone.amp;
  const eq = tone.mod?.model === 'Guitar EQ' ? tone.mod.params : null;
  const bell = (f, f0, g, q = 1) => g / (1 + Math.pow(Math.log2(f / f0) * q * 1.6, 2));
  const shelf = (f, f0, g, hi) => g / (1 + Math.pow(hi ? f0 / f : f / f0, 1.6));
  for (let i = 0; i <= 80; i++) {
    const f = 60 * Math.pow(8000 / 60, i / 80);
    let db = 0;
    db += shelf(f, 140, (a.Bass - 5) * 1.6, false);
    db += bell(f, 650, (a.Mid - 5) * 1.8, 0.9);
    db += shelf(f, 2800, (a.Treble - 5) * 1.6, true);
    db += shelf(f, 2500, P.bright * 2.2, true) + shelf(f, 150, P.bass * 2.2, false) + bell(f, 900, P.mid * 2.2);
    if (eq) [['100', 100], ['200', 200], ['400', 400], ['800', 800], ['1.6k', 1600], ['3.2k', 3200]].forEach(([k, f0]) => { db += bell(f, f0, (eq[k] - 5) * 2.4, 1.2); });
    pts.push([f, Math.max(-14, Math.min(14, db))]);
  }
  return pts;
}

function eqChart(p) {
  const W = 640, H = 220, L = 34, R = 10, T = 14, B = 30;
  const x = f => L + (Math.log(f / 60) / Math.log(8000 / 60)) * (W - L - R);
  const y = d => T + (1 - (d + 14) / 28) * (H - T - B);
  const path = pts => pts.map((q, i) => `${i ? 'L' : 'M'}${x(q[0]).toFixed(1)} ${y(q[1]).toFixed(1)}`).join(' ');
  const base = response(p.base, p.refPu), fin = response(p.final, p.userPu);
  const grid = [100, 250, 500, 1000, 2000, 4000, 8000].map(f => `<line x1="${x(f)}" y1="${T}" x2="${x(f)}" y2="${H - B}" class="g"/><text x="${x(f)}" y="${H - 10}" class="gt">${f >= 1000 ? f / 1000 + 'k' : f}</text>`).join('');
  const hz = [-12, -6, 0, 6, 12].map(d => `<line x1="${L}" y1="${y(d)}" x2="${W - R}" y2="${y(d)}" class="g${d === 0 ? ' z' : ''}"/><text x="${L - 6}" y="${y(d) + 4}" class="gt r">${d > 0 ? '+' + d : d}</text>`).join('');
  const bands = `<rect x="${x(60)}" y="${T}" width="${x(250) - x(60)}" height="${H - T - B}" class="band"/><rect x="${x(2500)}" y="${T}" width="${x(8000) - x(2500)}" height="${H - T - B}" class="band"/>
    <text x="${(x(60) + x(250)) / 2}" y="${T + 14}" class="bt">thump</text><text x="${(x(400) + x(1600)) / 2}" y="${T + 14}" class="bt">body &amp; bite</text><text x="${(x(2500) + x(8000)) / 2}" y="${T + 14}" class="bt">sparkle / fizz</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="eq" role="img" aria-label="Approximate frequency response of the recorded tone compared with your version">
    ${bands}${grid}${hz}
    <path d="${path(base)}" class="eq-base"/>
    <path d="${path(fin)}" class="eq-fin"/>
  </svg>
  <div class="legend"><span class="lg base">Original guitar and settings</span><span class="lg fin">Your guitar with these settings</span></div>`;
}

// ── Tone map ────────────────────────────────────────────────────────
function coords(tone, pu) {
  const a = tone.amp; const A = AMPS[a.model]; const P = PICKUPS[pu] || PICKUPS.H;
  let drive = a.Gain * (0.25 + A.breakup * 0.75) + P.out * 0.8;
  if (tone.drive) { const v = Object.values(tone.drive.params)[0]; drive += { 'Booster': 0.6, 'Tube Drive': 1.2, 'Clone Drive': 1.2, 'Over Drive': 1.5, 'Black Op': 2.6, 'Fuzz Face': 2.8, 'Guitar Muff': 3, 'Bass Muff': 3, 'SAB Driver': 1.6 }[tone.drive.model] * (0.4 + v / 10); }
  const bright = a.Treble * 0.7 + (a.Mid - 5) * 0.2 - (a.Bass - 5) * 0.3 + A.bright * 2 + P.bright * 1.2;
  return { x: Math.max(0, Math.min(10, (bright - 2) * 1.15)), y: Math.max(0, Math.min(10, drive * 0.85)) };
}
let LIB_DOTS = null;
function libDots() {
  if (LIB_DOTS) return LIB_DOTS;
  LIB_DOTS = [];
  SONGS.forEach(s => s.parts.forEach(p => { const t = parseTone(p.tone); if (t.amp && AMPS[t.amp.model].cat !== 'Acoustic') LIB_DOTS.push(coords(t, s.pu)); }));
  return LIB_DOTS;
}
function toneMap(parts, current) {
  const S = 300, pad = 24;
  const X = v => pad + v / 10 * (S - pad * 2), Y = v => S - pad - v / 10 * (S - pad * 2);
  const dots = libDots().map(d => `<circle cx="${X(d.x)}" cy="${Y(d.y)}" r="3" class="lib"/>`).join('');
  const mine = parts.map((p, i) => {
    if (AMPS[p.final.amp.model].cat === 'Acoustic') return '';
    const c = coords(p.final, p.userPu);
    return `<g class="pt${i === current ? ' cur' : ''}"><circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${i === current ? 9 : 6}"/><text x="${X(c.x) + 13}" y="${Y(c.y) + 4}">${esc(p.name)}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 ${S} ${S}" class="map" role="img" aria-label="Where each part sits from clean to saturated and dark to bright">
    <rect x="${pad}" y="${pad}" width="${S - pad * 2}" height="${S - pad * 2}" class="map-bg"/>
    <line x1="${S / 2}" y1="${pad}" x2="${S / 2}" y2="${S - pad}" class="g"/><line x1="${pad}" y1="${S / 2}" x2="${S - pad}" y2="${S / 2}" class="g"/>
    <text x="${pad + 6}" y="${pad + 16}" class="q">saturated, dark</text><text x="${S - pad - 6}" y="${pad + 16}" class="q r">saturated, bright</text>
    <text x="${pad + 6}" y="${S - pad - 8}" class="q">clean, dark</text><text x="${S - pad - 6}" y="${S - pad - 8}" class="q r">clean, bright</text>
    ${dots}${mine}
  </svg>`;
}

// ── Ledger ──────────────────────────────────────────────────────────
function ledger(p) {
  const rows = [];
  p.ledger.forEach(l => l.changes.forEach(c => rows.push({ ...c, layer: l.label })));
  if (!rows.length) return `<p class="ledger-none">No changes needed. Your ${esc(PICKUPS[p.userPu].label.toLowerCase())} matches the original pickup closely enough.</p>`;
  return `<ul class="ledger">${rows.map(c => {
    const name = c.from == null ? `Add ${c.param}` : `${c.slot === 'amp' ? '' : SLOT_LABEL[c.slot] + ' '}${c.param}`;
    const bar = c.from == null ? '' : `<span class="lbar"><i style="left:${c.from * 10}%" class="lf"></i><i style="left:${c.to * 10}%" class="lt"></i><b style="left:${Math.min(c.from, c.to) * 10}%;width:${Math.abs(c.to - c.from) * 10}%"></b></span>`;
    return `<li><span class="lname">${esc(name)}</span>${bar}<span class="lnum">${c.from == null ? '' : `${fmt(c.from)} to `}<strong>${fmt(c.to)}</strong></span><span class="lwhy">${esc(c.why)}</span></li>`;
  }).join('')}</ul>`;
}

// ── Result ──────────────────────────────────────────────────────────
const STAMP = {
  library: ['From the setlist', 'Dialed in by hand for this exact song.'],
  artist: ['Artist rig', 'Built from this artist\'s known rig. Expect it to be close, but individual songs can differ.'],
  genre: ['Genre estimate', 'No rig profile for this artist, so this is an educated guess from the genre and year.'],
  claude: ['Asked Claude', 'Designed by Claude for this specific song, then retuned here for your guitar.'],
};

function renderResult(animate = true) {
  const R = state.result;
  const box = $('#result');
  if (!R) { box.hidden = true; $('#empty').hidden = false; return; }
  $('#empty').hidden = true; box.hidden = false;
  const g = guitar();
  const parts = R.parts.map(p => finalizePart(p, R, g, state.room));
  const i = Math.min(state.partIndex, parts.length - 1);
  const p = parts[i];
  setPanel(p.final, animate);

  const tabs = parts.map((x, j) => `<button role="tab" aria-selected="${j === i}" class="tab" data-part="${j}" type="button">${esc(x.name)}</button>`).join('');
  const [stampT, stampD] = STAMP[R.source];
  const canAsk = R.source !== 'claude' && R.source !== 'library';
  const claudeBtn = canAsk ? `<button type="button" class="btn small" id="askClaude">${state.claude.key ? 'Ask Claude for this exact song' : 'Add a Claude key for an exact match'}</button>` : '';
  const alt = state.alternatives?.length > 1 ? `<div class="alts"><span>Not the right song?</span>${state.alternatives.slice(1, 5).map(a => `<button type="button" class="chip" data-q="${esc(a.title + ' - ' + a.artist)}">${esc(a.title)} <em>${esc(a.artist)}</em></button>`).join('')}</div>` : '';
  const notes = [p.tip, ...(p.notes || []), R.note].filter(Boolean);

  box.innerHTML = `
    <header class="r-head">
      <div class="r-title">
        <h1 class="hand">${esc(R.title)}</h1>
        <p class="r-meta">${esc(R.artist)}${R.year ? `, ${R.year}` : ''}${R.guitarist ? `. ${esc(R.guitarist)} on guitar` : ''}</p>
      </div>
      <div class="stamp s-${R.source}" title="${esc(stampD)}"><span>${stampT}</span></div>
    </header>
    <p class="r-source">${esc(stampD)} ${claudeBtn}</p>
    ${alt}
    <div class="r-rig"><div><span class="k">On the record</span> ${esc(R.guitar || '')}${R.rig ? `, through ${esc(R.rig)}` : ''}</div></div>

    <div class="tabs" role="tablist" aria-label="Song parts">${tabs}</div>
    <div class="part" role="tabpanel">
      <p class="part-when">${esc(p.when || '')}</p>

      <div class="grid-a">
        <section class="card pick">
          <h2>Pickup</h2>
          ${pickupDiagram(g, p.yourPos)}
          <p class="pick-main hand">${esc(p.yourPos)}</p>
          <p class="fine">On ${esc(g.name)}. On the record: ${esc(p.pos || 'bridge')}, ${esc(PICKUPS[p.refPu]?.label || '')}.</p>
        </section>
        <section class="card changes">
          <h2>What changed for your setup</h2>
          ${ledger(p)}
          <p class="fine">Room: ${esc(ROOMS[state.room].label)}. <button class="linkish" data-open-rig type="button">Change guitar or room</button></p>
        </section>
      </div>

      <section class="card chain-card">
        <h2>Signal chain in the Spark app</h2>
        <p class="fine">Left to right, the same order as the app. Red pointers are values changed for your guitar, and the faint mark shows the original.</p>
        ${renderChain(p)}
      </section>

      <div class="grid-b">
        <section class="card">
          <h2>How it should sound</h2>
          ${eqChart(p)}
          <p class="fine">An approximate shape of the tone after amp EQ and pickup character. If your line sits close to the original, you're in the right place.</p>
        </section>
        <section class="card">
          <h2>Where the parts sit</h2>
          ${toneMap(parts, i)}
          <p class="fine">Faint dots are every other part in the setlist, for context.</p>
        </section>
      </div>

      ${notes.length ? `<section class="card tips"><h2>Notes</h2><ul>${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}

      <section class="card save">
        <h2>Put it on the amp</h2>
        <ol class="steps">
          <li>Open the Spark app with your amp connected and start from any preset.</li>
          <li>Swap each slot to the model shown above and set the knobs. Turn off slots marked Off.</li>
          <li>Save it as a new preset, then use Save to Hardware to put it on one of the four buttons. One button per part works well.</li>
          <li>Set the top-panel knobs to match the panel at the top of this page, or don't touch them. Moving one makes its value jump.</li>
        </ol>
        <div class="row"><button type="button" class="btn" id="copyBtn">Copy settings as text</button><button type="button" class="btn ghost" id="shareBtn">Copy link to this song</button></div>
      </section>
    </div>`;

  box.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { state.partIndex = +t.dataset.part; renderResult(); }));
  box.querySelectorAll('.chip[data-q]').forEach(c => c.addEventListener('click', () => run(c.dataset.q)));
  box.querySelectorAll('[data-open-rig]').forEach(b => b.addEventListener('click', openRig));
  $('#askClaude')?.addEventListener('click', () => state.claude.key ? run(state.query, { forceClaude: true }) : openRig('claude'));
  $('#copyBtn').addEventListener('click', () => copy(asText(R, parts), $('#copyBtn'), 'Copied'));
  $('#shareBtn').addEventListener('click', () => copy(location.href, $('#shareBtn'), 'Link copied'));
  tabKeys(box.querySelector('.tabs'));
}

function tabKeys(list) {
  list.addEventListener('keydown', e => {
    const tabs = [...list.querySelectorAll('.tab')];
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (n != null) { e.preventDefault(); tabs[n].click(); $('.tabs').querySelectorAll('.tab')[n].focus(); }
  });
}

function asText(R, parts) {
  const lines = [`${R.title} - ${R.artist} (Spark 1, ${guitar().name})`, ''];
  parts.forEach(p => {
    lines.push(`${p.name}: ${p.yourPos}`);
    SLOT_ORDER.forEach(s => {
      if (s === 'amp') { const a = p.final.amp; lines.push(`  Amp ${a.model}: Gain ${a.Gain}, Bass ${a.Bass}, Mid ${a.Mid}, Treble ${a.Treble}, Master ${a.Master}`); return; }
      const fx = p.final[s];
      if (fx) lines.push(`  ${SLOT_LABEL[s]} ${fx.model}: ${Object.entries(fx.params).map(([k, v]) => `${k} ${v}`).join(', ')}${fx.ms ? ` (~${fx.ms} ms)` : ''}`);
    });
    lines.push('');
  });
  return lines.join('\n');
}

async function copy(text, btn, done) {
  try { await navigator.clipboard.writeText(text); const t = btn.textContent; btn.textContent = done; setTimeout(() => (btn.textContent = t), 1600); }
  catch { btn.textContent = 'Copy failed. Select and copy manually'; }
}

// ── Search flow ─────────────────────────────────────────────────────
function status(msg, kind = '') {
  const box = $('#result');
  $('#empty').hidden = true; box.hidden = false;
  box.innerHTML = `<div class="status ${kind}"><span class="spin" aria-hidden="true"></span><p class="hand">${esc(msg)}</p></div>`;
}

async function run(q, opts = {}) {
  q = (q || '').trim();
  if (!q) return;
  state.query = q; state.partIndex = 0; state.alternatives = null;
  $('#q').value = q;
  const url = new URL(location.href); url.searchParams.set('song', q); history.replaceState(null, '', url);
  document.getElementById('sheet').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  const ck = keyOf(q);
  if (!opts.forceClaude) {
    const hit = searchLibrary(q)[0];
    if (hit) { state.result = resultFromSong(hit); return renderResult(); }
    if (state.cache[ck]) { state.result = state.cache[ck]; return renderResult(); }
  }

  let meta = null, list = [];
  if (!opts.skipMB) {
    status('Looking the song up on MusicBrainz…');
    try { list = await musicBrainzLookup(q); meta = list[0] || null; } catch (e) { console.warn(e); }
  }
  state.alternatives = list;
  if (meta && !opts.forceClaude) {
    const libHit = searchLibrary(`${meta.title} - ${meta.artist}`)[0];
    if (libHit) { state.result = resultFromSong(libHit); return renderResult(); }
  }

  const { artist: typedArtist } = splitQuery(q);
  const profile = findArtist(meta?.artist) || findArtist(typedArtist) || (!meta && findArtist(q));

  if (opts.forceClaude || (!profile && state.claude.key && state.claude.auto)) {
    if (!state.claude.key || !state.claude.model) return openRig('claude');
    status(`Asking Claude about ${meta ? `“${meta.title}” by ${meta.artist}` : `“${q}”`}…`);
    try {
      const r = await askClaude({ key: state.claude.key, model: state.claude.model, query: q, meta });
      state.cache[ck] = r; store.set('claudeCache', state.cache);
      state.result = r; return renderResult();
    } catch (e) {
      console.warn(e);
      if (opts.forceClaude) return status(`Claude couldn't answer: ${e.message}. Check your key and model under My rig.`, 'err');
    }
  }

  if (profile) {
    const isArtistOnly = !meta && findArtist(q);
    state.result = resultFromArtist(profile, isArtistOnly ? null : (meta?.title || splitQuery(q).title), meta?.year);
    return renderResult();
  }

  if (meta) {
    status('No rig profile for this artist. Reading its genre…');
    let tags = meta.tags || [];
    try { tags = [...(await musicBrainzGenres(meta.artistId)), ...tags]; } catch { }
    state.result = resultFromGenre(genreFromTags(tags), meta);
    return renderResult();
  }

  const box = $('#result');
  box.innerHTML = `<div class="status err"><p class="hand">Couldn't find “${esc(q)}”.</p><p>Try writing it as <strong>Song - Artist</strong>, check the spelling, or ${state.claude.key ? '<button class="linkish" id="tryClaude" type="button">ask Claude anyway</button>' : '<button class="linkish" data-open-rig type="button">add a Claude key</button> so the site can ask about anything'}.</p></div>`;
  $('#tryClaude')?.addEventListener('click', () => run(q, { forceClaude: true, skipMB: true }));
  box.querySelector('[data-open-rig]')?.addEventListener('click', () => openRig('claude'));
}

// ── Autocomplete ────────────────────────────────────────────────────
function wireSearch() {
  const input = $('#q'), list = $('#suggest');
  let items = [], idx = -1;
  const close = () => { list.hidden = true; idx = -1; input.setAttribute('aria-expanded', 'false'); };
  input.setAttribute('role', 'combobox'); input.setAttribute('aria-controls', 'suggest'); input.setAttribute('aria-expanded', 'false');
  input.addEventListener('input', () => {
    items = suggestions(input.value);
    if (!items.length) return close();
    list.innerHTML = items.map((s, i) => `<li role="option" id="sg${i}" data-i="${i}"><span>${esc(s.label)}</span><em>${esc(s.sub)}</em></li>`).join('');
    list.hidden = false; input.setAttribute('aria-expanded', 'true');
  });
  input.addEventListener('keydown', e => {
    if (list.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      list.querySelectorAll('li').forEach((li, i) => li.classList.toggle('on', i === idx));
      input.setAttribute('aria-activedescendant', 'sg' + idx);
    } else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); input.value = items[idx].value; close(); run(input.value); }
    else if (e.key === 'Escape') close();
  });
  list.addEventListener('mousedown', e => { const li = e.target.closest('li'); if (!li) return; e.preventDefault(); input.value = items[+li.dataset.i].value; close(); run(input.value); });
  input.addEventListener('blur', () => setTimeout(close, 120));
  $('#searchForm').addEventListener('submit', e => { e.preventDefault(); close(); run(input.value); });
}

// ── Setlist ─────────────────────────────────────────────────────────
function renderSetlist(filter = '') {
  const f = filter.toLowerCase();
  const rows = SONGS.filter(s => !f || (s.title + ' ' + s.artist).toLowerCase().includes(f))
    .sort((a, b) => a.artist.localeCompare(b.artist) || a.year - b.year);
  $('#setlistList').innerHTML = rows.map(s => `<li><button type="button" data-q="${esc(s.title + ' - ' + s.artist)}"><span class="sl-t">${esc(s.title)}</span><span class="sl-a">${esc(s.artist)}</span><span class="sl-p">${s.parts.map(p => esc(p.name)).join(', ')}</span></button></li>`).join('') || '<li class="none">Nothing on the setlist matches. Search for it above instead.</li>';
  $('#setlistList').querySelectorAll('button[data-q]').forEach(b => b.addEventListener('click', () => run(b.dataset.q)));
}

// ── Rig dialog ──────────────────────────────────────────────────────
function openRig(focus) {
  renderRig();
  const d = $('#rig');
  if (!d.open) d.showModal();
  if (focus === 'claude') setTimeout(() => $('#cKey').focus(), 50);
}

function renderRig() {
  $('#guitarList').innerHTML = state.guitars.map(g => `
    <label class="guitar ${g.id === state.active ? 'on' : ''}">
      <input type="radio" name="guitar" value="${g.id}" ${g.id === state.active ? 'checked' : ''}>
      <span class="g-name">${esc(g.name)}</span>
      <span class="g-lay">${esc(LAYOUTS[g.layout]?.label || g.layout)}${g.split ? ', coil split' : ''}</span>
      ${state.guitars.length > 1 ? `<button type="button" class="g-del" data-del="${g.id}" aria-label="Remove ${esc(g.name)}">Remove</button>` : ''}
    </label>`).join('');
  $('#guitarList').querySelectorAll('input[name=guitar]').forEach(r => r.addEventListener('change', () => { state.active = r.value; store.set('activeGuitar', r.value); renderRig(); if (state.result) renderResult(); }));
  $('#guitarList').querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    state.guitars = state.guitars.filter(g => g.id !== b.dataset.del);
    if (!state.guitars.find(g => g.id === state.active)) state.active = state.guitars[0].id;
    store.set('guitars', state.guitars); store.set('activeGuitar', state.active); renderRig(); if (state.result) renderResult();
  }));
  $('#roomList').innerHTML = Object.entries(ROOMS).map(([k, r]) => `<label class="room ${k === state.room ? 'on' : ''}"><input type="radio" name="room" value="${k}" ${k === state.room ? 'checked' : ''}><span class="g-name">${esc(r.label)}</span><span class="g-lay">${esc(r.note)}</span></label>`).join('');
  $('#roomList').querySelectorAll('input').forEach(r => r.addEventListener('change', () => { state.room = r.value; store.set('room', r.value); renderRig(); if (state.result) renderResult(); }));
  $('#cKey').value = state.claude.key;
  $('#cAuto').checked = state.claude.auto;
  if (state.claude.model && !$('#cModel').querySelector(`option[value="${CSS.escape(state.claude.model)}"]`)) {
    $('#cModel').innerHTML = `<option value="${esc(state.claude.model)}">${esc(state.claude.model)}</option>`;
  }
  $('#cModel').value = state.claude.model;
}

function wireRig() {
  $('#gLayout').innerHTML = Object.entries(LAYOUTS).map(([k, l]) => `<option value="${k}">${esc(l.label)}</option>`).join('');
  $('#gAdd').addEventListener('click', () => {
    const name = $('#gName').value.trim() || LAYOUTS[$('#gLayout').value].label.split(':')[0];
    const g = { id: 'g' + Date.now(), name, layout: $('#gLayout').value, split: $('#gSplit').checked };
    state.guitars.push(g); state.active = g.id;
    store.set('guitars', state.guitars); store.set('activeGuitar', g.id);
    $('#gName').value = ''; $('#gSplit').checked = false; $('#addGuitar').open = false;
    renderRig(); if (state.result) renderResult();
  });
  $('#cCheck').addEventListener('click', async () => {
    const key = $('#cKey').value.trim();
    const st = $('#cStatus');
    if (!key) { st.textContent = 'Paste your key first.'; return; }
    st.textContent = 'Checking…';
    try {
      const models = await listClaudeModels(key);
      state.claude.key = key; store.set('ck', key);
      $('#cModel').innerHTML = models.map(m => `<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
      const pick = models.find(m => m.id === state.claude.model) || models.find(m => /sonnet/i.test(m.id)) || models[0];
      if (pick) { $('#cModel').value = pick.id; state.claude.model = pick.id; store.set('cm', pick.id); }
      st.textContent = `Key works. ${models.length} models available.`;
    } catch (e) { st.textContent = `That key didn't work (${e.message}).`; }
  });
  $('#cModel').addEventListener('change', e => { state.claude.model = e.target.value; store.set('cm', e.target.value); });
  $('#cAuto').addEventListener('change', e => { state.claude.auto = e.target.checked; store.set('ca', e.target.checked); });
  $('#cForget').addEventListener('click', () => { state.claude.key = ''; state.claude.model = ''; store.del('ck'); store.del('cm'); $('#cKey').value = ''; $('#cModel').innerHTML = '<option value="">Check key to load models</option>'; $('#cStatus').textContent = 'Key removed from this browser.'; });
  $('#openRig').addEventListener('click', () => openRig());
  document.querySelectorAll('[data-open-rig]').forEach(b => b.addEventListener('click', () => openRig()));
  $('#rig').addEventListener('click', e => { if (e.target === $('#rig')) $('#rig').close(); });
}

// ── boot ────────────────────────────────────────────────────────────
buildPanel();
wireSearch();
wireRig();
renderSetlist();
$('#setFilter').addEventListener('input', e => renderSetlist(e.target.value));
$('#artistCount').textContent = `${SONGS.length} songs on the setlist, plus rig profiles for ${ARTISTS.length} guitarists and bands that any song by them can use.`;
const initial = new URL(location.href).searchParams.get('song');
powerOn().then(() => { if (initial) run(initial); });

// First-open moment: the amp powers up, every knob sweeps to 10 and back,
// the way a tech checks the pots, then settles at noon waiting for a song.
function powerOn() {
  const svg = $('#panel');
  document.body.classList.add('booting');
  if (reduceMotion) { document.body.classList.remove('booting'); document.body.classList.add('booted'); return Promise.resolve(); }
  const all = v => {
    svg.querySelectorAll('.pk .rot').forEach(r => { r.style.transform = `rotate(${angle(v)}deg)`; });
    $('#ampRot').style.transform = `rotate(${angle(v)}deg)`;
  };
  const count = (from, to, ms) => new Promise(res => {
    const t0 = performance.now();
    const vals = svg.querySelectorAll('.val');
    let done = false;
    const finish = () => { if (done) return; done = true; vals.forEach(v => (v.textContent = fmt(to))); res(); };
    const step = now => {
      if (done) return;
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      vals.forEach(v => (v.textContent = fmt(Math.round((from + (to - from) * e) * 2) / 2)));
      k < 1 ? requestAnimationFrame(step) : finish();
    };
    requestAnimationFrame(step);
    setTimeout(finish, ms + 80); // background tabs pause rAF; never stall the boot
  });
  const wait = ms => new Promise(r => setTimeout(r, ms));
  return (async () => {
    await wait(250);
    svg.classList.add('powered');            // LED + caps warm up
    await wait(350);
    all(10); await count(0, 10, 1000);
    await wait(150);
    all(5); await count(10, 5, 900);
    await wait(250);
    svg.querySelectorAll('.val').forEach(v => (v.textContent = '–'));
    document.body.classList.remove('booting'); document.body.classList.add('booted');
  })();
}
