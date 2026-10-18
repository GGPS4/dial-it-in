import { AMPS, FX, parseTone, cloneTone, catalogForPrompt } from './spark.js';
import { ARTISTS } from './artists.js';
import { SONGS } from './songs.js';
import { GENRES, GENRE_DEFAULT, decadeNudge } from './genres.js';

// ── Pickups ──────────────────────────────────────────────────────────
// out: relative output into the Spark input. bright/bass/mid: voicing tilt.
export const PICKUPS = {
  S:  { label: 'Single coil (Strat-style)', out: 1.0, bright: 1.0, bass: -0.6, mid: -0.4 },
  T:  { label: 'Tele bridge single coil',   out: 1.1, bright: 1.2, bass: -0.4, mid: 0.1 },
  P:  { label: 'P-90',                       out: 1.4, bright: 0.5, bass: 0.0, mid: 0.4 },
  F:  { label: "Filter'Tron",                out: 1.2, bright: 0.8, bass: -0.3, mid: -0.1 },
  H:  { label: 'Vintage humbucker (PAF)',    out: 1.6, bright: 0.2, bass: 0.4, mid: 0.3 },
  HH: { label: 'Hot humbucker',              out: 2.0, bright: -0.1, bass: 0.6, mid: 0.6 },
  A:  { label: 'Active humbucker (EMG etc.)',out: 2.3, bright: 0.1, bass: 0.3, mid: 0.2 },
  AC: { label: 'Acoustic (piezo / mic)',     out: 1.0, bright: 0.6, bass: 0.3, mid: -0.3 },
};

// Guitar layouts the user can pick from. Each maps a position to a pickup code.
export const LAYOUTS = {
  SSS: { label: 'Strat style: S-S-S', pos: { bridge: 'S', middle: 'S', neck: 'S' } },
  HSS: { label: 'Fat Strat: H-S-S', pos: { bridge: 'H', middle: 'S', neck: 'S' } },
  HSH: { label: 'H-S-H', pos: { bridge: 'H', middle: 'S', neck: 'H' } },
  SS:  { label: 'Telecaster: S-S', pos: { bridge: 'T', middle: 'T', neck: 'S' } },
  HH:  { label: 'Two humbuckers (Les Paul, SG, 335)', pos: { bridge: 'H', middle: 'H', neck: 'H' } },
  HHhot: { label: 'Two hot humbuckers (superstrat, metal)', pos: { bridge: 'HH', middle: 'HH', neck: 'H' } },
  AA:  { label: 'Active humbuckers (EMG, Fishman)', pos: { bridge: 'A', middle: 'A', neck: 'A' } },
  PP:  { label: 'P-90s (Les Paul Jr, SG Special, Casino)', pos: { bridge: 'P', middle: 'P', neck: 'P' } },
  FF:  { label: "Filter'Trons (Gretsch)", pos: { bridge: 'F', middle: 'F', neck: 'F' } },
  JM:  { label: 'Offset (Jazzmaster / Jaguar)', pos: { bridge: 'S', middle: 'S', neck: 'S' } },
  AC:  { label: 'Acoustic-electric', pos: { bridge: 'AC', middle: 'AC', neck: 'AC' } },
};

export const DEFAULT_GUITARS = [
  { id: 'g1', name: 'My Strat', layout: 'SSS', split: false },
];

export const ROOMS = {
  bedroom: { label: 'Bedroom (quiet)', note: 'At low volume your ears lose lows and highs (Fletcher–Munson), so the Spark gets a slight smile added.' },
  practice: { label: 'Practice (medium)', note: 'The Spark at around half output is what these recalls are tuned for. No change.' },
  band: { label: 'With a band / drummer', note: 'In a mix, low end clouds the bass player and reverb disappears. Bass is cut, mids are pushed and effects pulled back.' },
  headphones: { label: 'Headphones / USB recording', note: 'Headphones exaggerate the top end that the 4" speakers roll off, so treble comes down a little.' },
};

function positionKey(pos) {
  const p = (pos || '').toLowerCase();
  if (/neck/.test(p) && !/bridge/.test(p)) return 'neck';
  if (/middle|position (2|3|4)|both|\+/.test(p) && !/bridge$/.test(p)) return 'middle';
  if (/neck/.test(p)) return 'neck';
  return 'bridge';
}

export function userPickupFor(guitar, refPos) {
  const L = LAYOUTS[guitar?.layout] || LAYOUTS.SSS;
  return L.pos[positionKey(refPos)] || L.pos.bridge;
}

// Which switch position to use on the player's guitar, written for humans.
export function suggestPosition(guitar, refPos, refPu) {
  const L = guitar?.layout || 'SSS';
  const key = positionKey(refPos);
  const p = (refPos || '').toLowerCase();
  if (L === 'AC') return 'Use your pickup or mic as normal';
  if (refPos === 'n/a') return 'Neck pickup, tone knob at 7 (stand-in for an acoustic)';
  const humbuckerGuitar = ['HH', 'HHhot', 'AA', 'PP', 'FF'].includes(L);
  if (humbuckerGuitar) {
    if (/position (2|4)/.test(p)) return guitar.split ? 'Middle position with coil split on' : 'Middle position (both pickups). Roll the tone to 8';
    if (key === 'neck') return refPu === 'S' && guitar.split ? 'Neck pickup, coil split' : 'Neck pickup';
    if (key === 'middle') return 'Middle position (both pickups)';
    return refPu === 'S' || refPu === 'T' ? (guitar.split ? 'Bridge pickup, coil split' : 'Bridge pickup') : 'Bridge pickup';
  }
  if (L === 'SS') {
    if (key === 'neck') return 'Neck pickup';
    if (key === 'middle' || /position (2|4)/.test(p)) return 'Middle position (both pickups)';
    return 'Bridge pickup';
  }
  // Strat-family
  if (/position 2/.test(p)) return 'Position 2 (middle + neck)';
  if (/position 4/.test(p)) return 'Position 4 (bridge + middle)';
  if (key === 'neck') return 'Neck pickup';
  if (key === 'middle') return 'Middle pickup';
  return L === 'HSS' || L === 'HSH' ? (refPu === 'S' || refPu === 'T' ? 'Position 4 (single coil). The humbucker would be too hot here' : 'Bridge humbucker') : 'Bridge pickup';
}

// ── Adjustment layers ───────────────────────────────────────────────
const AMP_KEYS = ['Gain', 'Bass', 'Mid', 'Treble', 'Master'];
const clamp = v => Math.max(0, Math.min(10, v));
const r05 = v => Math.round(v * 2) / 2;

function bump(tone, changes, slot, param, delta, why) {
  if (!delta || Math.abs(delta) < 0.25) return;
  const target = slot === 'amp' ? tone.amp : tone[slot]?.params;
  if (!target || target[param] == null) return;
  const from = target[param];
  const to = r05(clamp(from + delta));
  if (to === from) return;
  target[param] = to;
  changes.push({ slot, param, from, to, why });
}

export function adjustForGuitar(base, refPu, userPu) {
  const tone = cloneTone(base);
  const changes = [];
  const notes = [];
  const ref = PICKUPS[refPu] || PICKUPS.H, me = PICKUPS[userPu] || PICKUPS.S;
  if (!tone.amp) return { tone, changes, notes };
  const cat = AMPS[tone.amp.model]?.cat;
  if (cat === 'Acoustic') return { tone, changes, notes };
  if (userPu === 'AC' && refPu !== 'AC') notes.push('An acoustic into an electric amp model will feed back. Keep Gain under 3 and stay well away from the amp.');

  const outDiff = ref.out - me.out;          // +: original hotter than yours
  const gainScale = tone.amp.Gain > 6 ? 1.2 : 1.6;
  let gainDelta = outDiff * gainScale;
  // A big output gap on a weaker pickup is better made up with a boost pedal
  if (gainDelta > 1.5 && !tone.drive) {
    tone.drive = { model: 'Booster', params: { Gain: r05(clamp(3 + gainDelta * 1.5)) }, ms: null };
    changes.push({ slot: 'drive', param: 'Booster', from: null, to: tone.drive.params.Gain, why: `Your ${me.label.toLowerCase()} is quieter than the original ${ref.label.toLowerCase()}. A clean boost makes up the difference, which sounds more natural than maxing the amp gain.` });
    gainDelta = 0.5;
  }
  if (gainDelta > 1.5 && tone.drive && tone.drive.model !== 'Booster') {
    const k = FX.drive[tone.drive.model].p[0];
    bump(tone, changes, 'drive', k, (gainDelta - 1.5) * 1.2, 'Your pickup is quieter, so the pedal does part of the extra gain instead of the amp');
    gainDelta = 1.5;
  }
  bump(tone, changes, 'amp', 'Gain', gainDelta, outDiff > 0 ? 'Less output than the original pickup' : 'More output than the original pickup');
  bump(tone, changes, 'amp', 'Treble', (ref.bright - me.bright) * 1.0, ref.bright > me.bright ? 'Your pickup is darker' : 'Your pickup is brighter');
  bump(tone, changes, 'amp', 'Bass', (ref.bass - me.bass) * 0.9, ref.bass > me.bass ? 'Your pickup has less low end' : 'Your pickup has more low end');
  bump(tone, changes, 'amp', 'Mid', (ref.mid - me.mid) * 0.8, ref.mid > me.mid ? 'Your pickup is more scooped' : 'Your pickup is more mid-heavy');

  // Single coils at high gain hum. Add or raise the gate.
  if ((userPu === 'S' || userPu === 'T') && tone.amp.Gain >= 6 && (cat === 'High Gain' || cat === 'Metal' || tone.drive)) {
    if (!tone.gate) {
      tone.gate = { model: 'Noise Gate', params: { Threshold: 3.5, Decay: 4 }, ms: null };
      changes.push({ slot: 'gate', param: 'Noise Gate', from: null, to: 3.5, why: 'Single coils hum at this gain level' });
    } else bump(tone, changes, 'gate', 'Threshold', 0.8, 'Single coils hum at this gain level');
  }
  if (tone.drive && outDiff < -0.6 && tone.drive.model !== 'Booster') {
    const k = FX.drive[tone.drive.model].p[0];
    bump(tone, changes, 'drive', k, outDiff * 0.8, 'Hotter pickups push the pedal harder');
  }
  return { tone, changes, notes };
}

export function adjustForRoom(base, room) {
  const tone = cloneTone(base);
  const changes = [];
  if (!tone.amp) return { tone, changes };
  if (room === 'bedroom') {
    bump(tone, changes, 'amp', 'Bass', 0.5, 'Low-volume hearing compensation');
    bump(tone, changes, 'amp', 'Treble', 0.5, 'Low-volume hearing compensation');
  } else if (room === 'band') {
    bump(tone, changes, 'amp', 'Bass', -1, 'Leave room for the bass player');
    bump(tone, changes, 'amp', 'Mid', 0.75, 'Mids are what cut through a mix');
    if (tone.reverb) bump(tone, changes, 'reverb', 'Level', -0.75, 'Reverb washes out with drums');
    if (tone.delay) bump(tone, changes, 'delay', tone.delay.params.Level != null ? 'Level' : Object.keys(tone.delay.params)[0], -0.5, 'Delay washes out with drums');
  } else if (room === 'headphones') {
    bump(tone, changes, 'amp', 'Treble', -0.5, 'Headphones exaggerate highs the speakers roll off');
  }
  return { tone, changes };
}

// ── Lookup ──────────────────────────────────────────────────────────
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').replace(/&/g, 'and').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

export function splitQuery(q) {
  const m = q.match(/^(.*?)\s+(?:-|–|—|by)\s+(.*)$/i);
  return m ? { title: m[1].trim(), artist: m[2].trim() } : { title: q.trim(), artist: '' };
}

export function findArtist(name) {
  const n = norm(name);
  if (!n) return null;
  for (const a of ARTISTS) {
    if (norm(a.n) === n || a.alias.some(x => norm(x) === n)) return a;
  }
  // loose: "the jimi hendrix experience" contains "jimi hendrix"
  for (const a of ARTISTS) {
    if ([a.n, ...a.alias].some(x => { const k = norm(x); return k.length > 3 && (n.includes(k) || k.includes(n) && n.length > 5); })) return a;
  }
  return null;
}

export function searchLibrary(q) {
  const { title, artist } = splitQuery(q);
  const nq = norm(q), nt = norm(title), na = norm(artist);
  const scored = SONGS.map(s => {
    const st = norm(s.title), sa = norm(s.artist);
    let score = 0;
    if (st === nt) score += 10; else if (nt && (st.includes(nt) && nt.length > 3)) score += 6; else if (nq.includes(st) && st.length > 3) score += 7;
    if (na && (sa.includes(na) || na.includes(sa) || findArtist(artist)?.n === findArtist(s.artist)?.n && findArtist(s.artist))) score += 4;
    if (!na && nq.includes(sa)) score += 3;
    if (na && score > 0 && score < 10 && !(sa.includes(na) || na.includes(sa))) score -= 5;
    return { s, score };
  }).filter(x => x.score >= 6).sort((a, b) => b.score - a.score);
  return scored.map(x => x.s);
}

export function suggestions(q, limit = 6) {
  const n = norm(q);
  if (n.length < 2) return [];
  const out = [];
  for (const s of SONGS) {
    const hay = norm(s.title + ' ' + s.artist);
    if (n.split(' ').every(w => hay.includes(w))) out.push({ type: 'song', label: s.title, sub: s.artist, value: `${s.title} - ${s.artist}` });
  }
  for (const a of ARTISTS) {
    if ([a.n, ...a.alias].some(x => norm(x).startsWith(n) || (n.length > 3 && norm(x).includes(n)))) out.push({ type: 'artist', label: a.n, sub: 'Rig profile', value: a.n });
  }
  return out.slice(0, limit);
}

function partsFromProfile(p, extra = {}) {
  const parts = [];
  const r = parseTone(p.r), l = parseTone(p.l);
  parts.push({ name: 'Rhythm', when: 'Chords, riffs and verses', pos: p.pos?.split('/')[0]?.trim() || 'bridge', tone: r });
  parts.push({ name: 'Lead', when: 'Fills, melodies and hooks', pos: p.pos?.split('/').pop()?.trim() || 'bridge', tone: l });
  const s = cloneTone(l);
  if (s.amp) { s.amp.Gain = r05(clamp(s.amp.Gain + 0.5)); s.amp.Mid = r05(clamp(s.amp.Mid + 0.5)); s.amp.Master = r05(clamp(s.amp.Master + 0.5)); }
  if (s.delay) { const k = Object.keys(s.delay.params)[0]; s.delay.params[k] = r05(clamp(s.delay.params[k] + 0.5)); }
  else if (s.amp && AMPS[s.amp.model].cat !== 'Acoustic') s.delay = { model: 'Digital Delay', params: { Level: 2, Time: 4, Feedback: 2 }, ms: 400 };
  parts.push({ name: 'Solo', when: 'Solo sections. Lead with more push and level so it jumps out', pos: p.pos?.split('/').pop()?.trim() || 'neck', tone: s });
  if (p.c) parts.push({ name: 'Clean', when: 'Clean intros, verses and breakdowns', pos: 'neck', tone: parseTone(p.c) });
  return parts.map(x => ({ ...x, ...extra }));
}

export function resultFromSong(s) {
  const a = findArtist(s.artist);
  return {
    source: 'library', confidence: 'high',
    title: s.title, artist: s.artist, year: s.year,
    guitar: s.guitar, pu: s.pu, rig: a?.rig || '',
    note: a?.note || '',
    parts: s.parts.map(p => ({ name: p.name, when: p.when, pos: p.pos, tone: parseTone(p.tone), tip: p.tip })),
  };
}

export function resultFromArtist(a, title, year, shownArtist) {
  const parts = partsFromProfile(a);
  return {
    source: 'artist', confidence: 'medium',
    title: title || `${a.n}: signature tones`, artist: shownArtist || a.n, year,
    guitarist: shownArtist && shownArtist !== a.n ? `Rig: ${a.n}` : '',
    guitar: a.guitar, pu: a.pu, rig: a.rig, note: a.note || '',
    parts,
  };
}

export function genreFromTags(tags) {
  const t = tags.map(x => norm(x.name || x));
  let best = null, bestScore = 0;
  for (const g of GENRES) {
    let score = 0;
    g.tags.forEach((tag, i) => { const nt = norm(tag); t.forEach((x, j) => { if (x === nt) score += 10 - Math.min(j, 8) + (i === 0 ? 2 : 0); }); });
    if (score > bestScore) { best = g; bestScore = score; }
  }
  return best || GENRES.find(g => g.id === GENRE_DEFAULT);
}

export function resultFromGenre(g, meta) {
  const parts = partsFromProfile({ ...g, pos: 'bridge / neck' });
  const nudge = decadeNudge(meta.year);
  if (nudge) parts.forEach(p => {
    if (!p.tone.amp || AMPS[p.tone.amp.model].cat === 'Acoustic') return;
    p.tone.amp.Gain = r05(clamp(p.tone.amp.Gain + (nudge.gain || 0)));
    p.tone.amp.Bass = r05(clamp(p.tone.amp.Bass + (nudge.bass || 0)));
    if (p.tone.reverb) p.tone.reverb.params.Level = r05(clamp(p.tone.reverb.params.Level + (nudge.reverb || 0)));
  });
  return {
    source: 'genre', confidence: 'low',
    title: meta.title, artist: meta.artist, year: meta.year,
    guitar: `Typical ${g.label.toLowerCase()} guitar`, pu: g.pu, rig: `${g.label} template${nudge ? `. ${nudge.label}` : ''}`,
    genre: g.label, note: '',
    parts,
  };
}

// ── MusicBrainz (free, CORS-enabled, no key) ────────────────────────
const MB = 'https://musicbrainz.org/ws/2';
const withTimeout = (ms = 7000) => { const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal; };
const mbEsc = s => s.replace(/(["\\])/g, '\\$1');

export async function musicBrainzLookup(q) {
  const { title, artist } = splitQuery(q);
  const query = artist ? `recording:"${mbEsc(title)}" AND artist:"${mbEsc(artist)}"` : `recording:"${mbEsc(title)}"`;
  const res = await fetch(`${MB}/recording/?query=${encodeURIComponent(query)}&fmt=json&limit=50`, { headers: { Accept: 'application/json' }, signal: withTimeout() });
  if (!res.ok) throw new Error(`MusicBrainz answered ${res.status}`);
  const data = await res.json();
  const seen = new Map();
  for (const r of data.recordings || []) {
    const ac = r['artist-credit']?.[0];
    if (!ac) continue;
    const key = norm(r.title) + '|' + ac.artist.id;
    const year = parseInt((r['first-release-date'] || '').slice(0, 4)) || null;
    const prev = seen.get(key);
    if (!prev) seen.set(key, { title: r.title, artist: ac.name, artistId: ac.artist.id, year, score: r.score, tags: r.tags || [] });
    else if (year && (!prev.year || year < prev.year)) prev.year = year;
  }
  // Prefer artists we have a rig for, then MusicBrainz score
  const list = [...seen.values()].sort((a, b) => (b.score - a.score) || ((findArtist(b.artist) ? 1 : 0) - (findArtist(a.artist) ? 1 : 0)));
  // Recording dates are often reissues. Release groups (singles, albums) carry the original year.
  if (list[0]) {
    try {
      const top = list[0];
      const rq = `releasegroup:"${mbEsc(top.title)}" AND artist:"${mbEsc(top.artist)}"`;
      const rg = await fetch(`${MB}/release-group/?query=${encodeURIComponent(rq)}&fmt=json&limit=25`, { headers: { Accept: 'application/json' }, signal: withTimeout(5000) });
      if (rg.ok) {
        const years = ((await rg.json())['release-groups'] || []).filter(g => g.score >= 80).map(g => parseInt((g['first-release-date'] || '').slice(0, 4))).filter(Boolean);
        if (years.length) top.year = Math.min(top.year || 9999, ...years);
      }
    } catch { /* year stays as found */ }
  }
  return list.slice(0, 6);
}

export async function musicBrainzGenres(artistId) {
  const res = await fetch(`${MB}/artist/${artistId}?inc=genres+tags&fmt=json`, { headers: { Accept: 'application/json' }, signal: withTimeout(5000) });
  if (!res.ok) return [];
  const a = await res.json();
  const g = (a.genres || []).sort((x, y) => y.count - x.count);
  const t = (a.tags || []).sort((x, y) => y.count - x.count);
  return [...g, ...t];
}

// ── Claude (optional, user's own API key, called straight from the browser) ──
export async function listClaudeModels(key) {
  const res = await fetch('https://api.anthropic.com/v1/models?limit=50', {
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
  });
  if (!res.ok) throw new Error(await claudeError(res));
  const data = await res.json();
  return (data.data || []).map(m => ({ id: m.id, name: m.display_name || m.id }));
}

async function claudeError(res) {
  try { const j = await res.json(); return `${res.status}: ${j.error?.message || res.statusText}`; } catch { return `${res.status} ${res.statusText}`; }
}

export function claudePrompt(query, meta) {
  return `You are a session guitarist and tone engineer who knows the Positive Grid Spark 1 (Spark 40) amp intimately. Design Spark app settings that recreate the ORIGINAL RECORDED guitar tone of this song as closely as the Spark 1 allows.

Song request: "${query}"${meta ? `\nMusicBrainz says: "${meta.title}" by ${meta.artist}${meta.year ? ` (${meta.year})` : ''}.` : ''}

Spark 1 facts you must design around:
- Two 4" full-range speakers in a ported cabinet. Each amp model has a fixed cab sim. There is no cab or IR selection.
- Signal chain is fixed: Gate → Comp/Wah → Drive → Amp → Mod/EQ → Delay → Reverb. One model per slot.
- Spark amp models saturate earlier than the real amps. Recorded tones have less gain than people remember. Most classic rock rhythm sits at Gain 4–6.5, and modern metal at 5–6 on the Insane/Treadplate models.
- On the small speakers, extreme Bass (>6) gets boomy and extreme Treble (>7) gets harsh. Mid scoops below 4 sound thin and boxy. Keep Mid ≥ 5 unless the record is truly scooped.
- No expression-pedal wah, octave, pitch-shift, Whammy, Leslie or spring reverb models. Use the closest substitute and say so in the tip.
- All knobs are 0–10 in 0.5 steps. Guitar EQ bands: 5 = flat.

Available gear (use these exact names only):
${catalogForPrompt()}

Tone string format (one per part), slots separated by semicolons. The amp comes first with numbers Gain Bass Mid Treble Master, then each active effect as "<slot> <Model> <knob values in the listed order>". Slot keywords: gate, cmp, drv, mod, dly, rev. Delay time can be written in ms, e.g. "dly Digital Delay 2.5 380ms 3" (Level, Time, Feedback). Reverb: Level Time Damping Dwell LowCut HighCut (you may give only the first two).
Example: "Plexiglas 6 5 6.5 5 7; drv Tube Drive 1 5 7; dly Digital Delay 2 380ms 2; rev Room Studio B 2.5 3"

Give separate parts for the distinct guitar sounds in the song (e.g. Clean intro, Rhythm, Lead, Solo). Write the tones for the guitar and pickup actually used on the record. The site adjusts them for the player's own guitar.

Reply with ONLY a JSON object, no prose, no code fence:
{"title":"","artist":"","year":0,"guitarist":"","guitar":"guitar used on the recording","pu":"S|T|P|F|H|HH|A|AC","rig":"amp and pedals used on the record, short","confidence":"high|medium|low","note":"one sentence on what makes this tone, or a Spark limitation","parts":[{"name":"","when":"where in the song","pos":"bridge|middle|neck|position 2|position 4","tone":"tone string","tip":"playing or setup tip, one sentence"}]}`;
}

export async function askClaude({ key, model, query, meta }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model, max_tokens: 2000, messages: [{ role: 'user', content: claudePrompt(query, meta) }] }),
  });
  if (!res.ok) throw new Error(await claudeError(res));
  const data = await res.json();
  const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  return resultFromClaude(json);
}

export function resultFromClaude(j) {
  const parts = (j.parts || []).map(p => ({ name: p.name, when: p.when, pos: p.pos, tone: parseTone(p.tone), tip: p.tip, raw: p.tone })).filter(p => p.tone.amp);
  if (!parts.length) throw new Error('Claude returned settings the site could not read. Try again.');
  return {
    source: 'claude', confidence: j.confidence || 'medium',
    title: j.title, artist: j.artist, year: j.year || null,
    guitar: j.guitar, pu: PICKUPS[j.pu] ? j.pu : 'H', rig: j.rig || '', note: j.note || '',
    guitarist: j.guitarist || '', parts,
  };
}

// ── Full pipeline for one part ──────────────────────────────────────
export function finalizePart(part, result, guitar, room) {
  const userPu = userPickupFor(guitar, part.pos);
  const refPu = part.pu || result.pu;
  const g = adjustForGuitar(part.tone, refPu, userPu);
  const r = adjustForRoom(g.tone, room);
  return {
    ...part,
    base: part.tone,
    final: r.tone,
    userPu, refPu,
    yourPos: suggestPosition(guitar, part.pos, refPu),
    ledger: [
      { label: 'Your guitar', changes: g.changes },
      { label: 'Your room', changes: r.changes },
    ],
    notes: g.notes,
  };
}

export { AMPS, FX };
