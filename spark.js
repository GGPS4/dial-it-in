// Spark 1 (Spark 40) gear catalog.
// Models available on an original Spark 40 running current firmware + app
// (the July 2021 gear drop added ODS 50, Blues Boy, Insane 6508, Clone Drive, Guitar EQ, Bass EQ).
// Spark LIVE / EDGE-only preamps and vocal effects are deliberately left out,
// and so is the retired Hendrix pack.

export const AMPS = {
  // name: { cat, real, voice: notes the engine and the UI use }
  'Silver 120':         { cat: 'Clean',     real: 'Roland JC-120',             bright: 1.0, breakup: 0.0, note: 'Solid-state clean. It never breaks up, so all dirt has to come from a pedal in front of it.' },
  'Black Duo':          { cat: 'Clean',     real: 'Fender Twin Reverb',        bright: 0.8, breakup: 0.2, note: 'Huge headroom. Past gain 6 it starts to fold over. Scooped by nature, so keep Mid above 5 on the Spark.' },
  'AD Clean':           { cat: 'Clean',     real: 'Orange AD30 (clean ch.)',   bright: 0.3, breakup: 0.3, note: 'Thick, warm clean. Good pedal platform for humbuckers.' },
  'Match DC':           { cat: 'Clean',     real: 'Matchless DC30',            bright: 0.6, breakup: 0.5, note: 'Chimey EL84 class-A. Breaks up sweetly around gain 5.' },
  'ODS 50':             { cat: 'Clean',     real: 'Dumble ODS 50 HRM',         bright: 0.4, breakup: 0.5, note: 'Smooth, vocal mids. Lead tones live here with a Tube Drive in front.' },
  'Tweed Bass':         { cat: 'Glassy',    real: 'Fender Bassman',            bright: 0.5, breakup: 0.6, note: 'Breaks up early and gets loose in the low end. Keep Bass at or below 5 on the small speakers.' },
  'AC Boost':           { cat: 'Glassy',    real: 'Vox AC30 Top Boost',        bright: 0.9, breakup: 0.6, note: 'Very bright on the Spark tweeters. Treble 4 to 5 is usually right, not the 7 or 8 you would use on a real AC30.' },
  'Checkmate':          { cat: 'Glassy',    real: 'Teisco Checkmate 20',       bright: 0.6, breakup: 0.7, note: 'Lo-fi, garagey and raw.' },
  'Two Stone SP50':     { cat: 'Glassy',    real: 'Two-Rock Studio Pro 50',    bright: 0.6, breakup: 0.4, note: 'Modern boutique clean with a 3D quality.' },
  'American Deluxe':    { cat: 'Crunch',    real: "Fender '57 Custom Deluxe",  bright: 0.5, breakup: 0.8, note: 'Tweed grind. The gain knob has a wide range, so gain 4 here already crunches.' },
  'Plexiglas':          { cat: 'Crunch',    real: 'Marshall Super Lead 100',   bright: 0.8, breakup: 0.7, note: 'Classic-rock center. Needs Mid up and Treble trimmed on the Spark.' },
  'JM45':               { cat: 'Crunch',    real: 'Marshall JTM45',            bright: 0.5, breakup: 0.7, note: 'Darker and rounder than the Plexiglas. Great for blues-rock.' },
  'Lux Verb':           { cat: 'Crunch',    real: 'Fender Deluxe Reverb',      bright: 0.7, breakup: 0.6, note: 'Edge-of-breakup sparkle that cleans up when you roll the guitar volume back.' },
  'Blues Boy':          { cat: 'Crunch',    real: 'Fender Blues Junior',       bright: 0.6, breakup: 0.7, note: 'Compressed, mid-forward EL84 grit.' },
  'RB 101':             { cat: 'High Gain', real: 'Bogner Ecstasy 101',        bright: 0.6, breakup: 0.9, note: 'Rich, singing high gain. Flexible for 80s and 90s rock.' },
  'British 30':         { cat: 'High Gain', real: 'Orange AD30 (dirty ch.)',   bright: 0.4, breakup: 0.9, note: 'Thick, gnarly mids. Stoner and alt-rock fuzz-like grind.' },
  'American High Gain': { cat: 'High Gain', real: 'Mesa Boogie JP-2C',         bright: 0.6, breakup: 1.0, note: 'Tight, focused, liquid leads.' },
  'SLO 100':            { cat: 'High Gain', real: 'Soldano SLO-100',           bright: 0.7, breakup: 1.0, note: 'Aggressive 80s and 90s high gain. Very gain-sensitive past 6.' },
  'YJM100':             { cat: 'High Gain', real: 'Marshall YJM100',           bright: 0.8, breakup: 0.9, note: 'Hot-rodded Plexi. Use a Booster or Tube Drive in front for neoclassical leads.' },
  'Treadplate':         { cat: 'Metal',     real: 'Mesa Triple Rectifier',     bright: 0.5, breakup: 1.0, note: 'Huge, saggy low end. On a 2x4 that turns to mush, so keep Bass at or below 4.' },
  'Insane':             { cat: 'Metal',     real: 'EVH 5150 III',              bright: 0.7, breakup: 1.0, note: 'Saturates fast. Gain 5 here is already more than most real records.' },
  'Insane 6508':        { cat: 'Metal',     real: 'Peavey 6505',               bright: 0.8, breakup: 1.0, note: 'Fizzy if pushed. Tighten with a Tube Drive at drive 0 and level up.' },
  'SwitchAxe':          { cat: 'Metal',     real: 'H&K Switchblade',           bright: 0.6, breakup: 1.0, note: 'Modern and compressed with polished leads.' },
  'Rocker V':           { cat: 'Metal',     real: 'Orange Rockerverb 50',      bright: 0.4, breakup: 1.0, note: 'Dark and thick. Doom, sludge and stoner.' },
  'BE 101':             { cat: 'Metal',     real: 'Friedman BE-100',           bright: 0.7, breakup: 0.95, note: 'Modern hot-rod Marshall. Tight crunch to high gain.' },
  'Pure Acoustic':      { cat: 'Acoustic',  real: 'PG original',               bright: 0.5, breakup: 0, note: 'Natural acoustic voicing.' },
  'Fishboy':            { cat: 'Acoustic',  real: 'Fishman acoustic amp',      bright: 0.5, breakup: 0, note: 'Piezo-friendly acoustic amp.' },
  'Jumbo':              { cat: 'Acoustic',  real: 'PG original',               bright: 0.3, breakup: 0, note: 'Big-bodied dreadnought / jumbo flavor.' },
  'Flat Acoustic':      { cat: 'Acoustic',  real: 'PG original',               bright: 0.6, breakup: 0, note: 'Flat-response acoustic. Good with a piezo.' },
  'RB-800':             { cat: 'Bass',      real: 'Gallien-Krueger 800RB',     bright: 0.6, breakup: 0.2, note: 'Bass amp.' },
  'Sunny 3000':         { cat: 'Bass',      real: 'Sunn 300T',                 bright: 0.3, breakup: 0.5, note: 'Bass amp. It also makes a great dirty fuzz platform for guitar.' },
  'W600':               { cat: 'Bass',      real: 'Eden WTP600',               bright: 0.5, breakup: 0.1, note: 'Bass amp.' },
  'Hammer 500':         { cat: 'Bass',      real: 'Aguilar Tone Hammer 500',   bright: 0.5, breakup: 0.2, note: 'Bass amp.' },
};

// Effect parameter order matters: the compact tone strings in the data files
// are positional. All values are on the Spark app's 0-10 scale.
// For 'Guitar EQ', 5 = flat (0 dB).
export const FX = {
  gate: {
    'Noise Gate': { real: 'Noise gate', p: ['Threshold', 'Decay'], d: [3, 5] },
  },
  comp: {
    'LA Comp':      { real: 'Teletronix LA-2A', p: ['Gain', 'Peak Reduction'], d: [5, 4] },
    'Sustain Comp': { real: 'Keeley-style comp', p: ['Level', 'Tone', 'Attack', 'Sustain'], d: [5, 5, 5, 5] },
    'Red Comp':     { real: 'MXR Dyna Comp', p: ['Output', 'Sensitivity'], d: [5, 4] },
    'Bass Comp':    { real: 'MXR Bass Comp', p: ['Comp', 'Gain'], d: [4, 5] },
    'Optical Comp': { real: 'Optical compressor', p: ['Volume', 'Comp'], d: [5, 4] },
    'Auto Wah':     { real: 'Envelope filter', p: ['Sensitivity', 'Range', 'Resonance'], d: [5, 5, 5] },
  },
  drive: {
    'Booster':     { real: 'Clean boost', p: ['Gain'], d: [5] },
    'Tube Drive':  { real: 'Ibanez Tube Screamer', p: ['Overdrive', 'Tone', 'Level'], d: [3, 5, 7] },
    'Over Drive':  { real: 'Boss SD-1', p: ['Drive', 'Tone', 'Level'], d: [4, 5, 6] },
    'Fuzz Face':   { real: 'Dunlop Fuzz Face', p: ['Fuzz', 'Volume'], d: [7, 5] },
    'Black Op':    { real: 'ProCo RAT', p: ['Distortion', 'Filter', 'Volume'], d: [5, 4, 5] },
    'Bass Muff':   { real: 'EHX Bass Big Muff', p: ['Sustain', 'Tone', 'Volume'], d: [6, 5, 5] },
    'Guitar Muff': { real: 'EHX Big Muff', p: ['Sustain', 'Tone', 'Volume'], d: [7, 5, 5] },
    'Bassmaster':  { real: 'Maestro Brassmaster', p: ['Brass', 'Sensitivity', 'Base'], d: [5, 5, 5] },
    'SAB Driver':  { real: 'Mesa Grid Slammer style', p: ['Drive', 'Tone', 'Volume'], d: [4, 5, 6] },
    'Clone Drive': { real: 'Klon Centaur', p: ['Gain', 'Treble', 'Output'], d: [3, 5, 6] },
  },
  mod: {
    'Tremolo':        { real: 'Optical tremolo', p: ['Speed', 'Depth', 'Level'], d: [5, 5, 5] },
    'Chorus':         { real: 'Analog chorus', p: ['Rate', 'Depth', 'Tone', 'Level'], d: [3, 5, 5, 5] },
    'Flanger':        { real: 'MXR Flanger', p: ['Rate', 'Depth', 'Feedback', 'Mix'], d: [3, 5, 5, 5] },
    'Phaser':         { real: 'MXR Phase 90', p: ['Speed', 'Intensity'], d: [3, 5] },
    'Vibrato':        { real: 'Vibrato', p: ['Speed', 'Depth'], d: [4, 4] },
    'UniVibe':        { real: 'Shin-ei Uni-Vibe', p: ['Speed', 'Intensity', 'Volume'], d: [3, 6, 5] },
    'Cloner Chorus':  { real: 'EHX Clone Theory', p: ['Rate', 'Depth'], d: [3, 5] },
    'Classic Vibe':   { real: 'Classic vibe', p: ['Speed', 'Intensity'], d: [4, 5] },
    'Tremolator':     { real: 'Harmonic tremolo', p: ['Speed', 'Depth'], d: [5, 5] },
    'Tremolo Square': { real: 'Square-wave tremolo', p: ['Speed', 'Depth'], d: [5, 6] },
    'Guitar EQ':      { real: 'Boss GE-style graphic EQ', p: ['Level', '100', '200', '400', '800', '1.6k', '3.2k'], d: [5, 5, 5, 5, 5, 5, 5], eq: true },
  },
  delay: {
    'Digital Delay':  { real: 'Digital delay', p: ['Level', 'Time', 'Feedback'], d: [3, 4, 3], ms: true },
    'Echo Filt':      { real: 'Filtered echo', p: ['Level', 'Time', 'Feedback', 'Tone'], d: [3, 4, 3, 5], ms: true },
    'Vintage Delay':  { real: 'Analog BBD delay', p: ['Level', 'Time', 'Feedback'], d: [3, 4, 3], ms: true },
    'Reverse Delay':  { real: 'Reverse delay', p: ['Mix', 'Time', 'Decay'], d: [4, 5, 4], ms: true },
    'Multi Head':     { real: 'Multi-head tape echo', p: ['Echo Volume', 'Repeat Rate', 'Intensity'], d: [3, 5, 4], ms: true },
    'Echo Tape':      { real: 'Roland RE-201 Space Echo', p: ['Level', 'Time', 'Intensity'], d: [3, 4, 4], ms: true },
  },
  reverb: Object.fromEntries([
    ['Room Studio A', 'Small studio room'], ['Room Studio B', 'Larger live room'],
    ['Chamber', 'Echo chamber'], ['Hall Natural', 'Concert hall'], ['Hall Medium', 'Medium hall'],
    ['Hall Ambient', 'Ambient wash'], ['Plate Short', 'Short plate'], ['Plate Rich', 'Rich plate'],
    ['Plate Long', 'Long plate'],
  ].map(([n, r]) => [n, { real: r, p: ['Level', 'Time', 'Damping', 'Dwell', 'Low Cut', 'High Cut'], d: [3, 4, 5, 5, 3, 6] }])),
};

export const SLOT_ORDER = ['gate', 'comp', 'drive', 'amp', 'mod', 'delay', 'reverb'];
export const SLOT_LABEL = { gate: 'Gate', comp: 'Comp / Wah', drive: 'Drive', amp: 'Amp', mod: 'Mod / EQ', delay: 'Delay', reverb: 'Reverb' };

// Short aliases accepted in the compact tone strings.
const KIND = { gate: 'gate', cmp: 'comp', comp: 'comp', drv: 'drive', drive: 'drive', mod: 'mod', eq: 'mod', dly: 'delay', delay: 'delay', rev: 'reverb', reverb: 'reverb' };

// Parse a compact tone string:
//   "Plexiglas 6.5 5 6 5.5 7; drv Tube Drive 2 5 8; dly Digital Delay 2.5 380ms 2; rev Plate Short 2.5"
// amp numbers = Gain Bass Mid Treble Master. Missing effect numbers fall back to defaults.
export function parseTone(str) {
  const tone = { amp: null, gate: null, comp: null, drive: null, mod: null, delay: null, reverb: null };
  str.split(';').map(s => s.trim()).filter(Boolean).forEach((seg, i) => {
    const first = seg.split(/\s+/)[0].toLowerCase();
    let kind = KIND[first];
    let rest = seg;
    if (kind) rest = seg.slice(first.length).trim();
    else if (i === 0) kind = 'amp';
    else return;
    // Longest known model name the segment starts with (names can contain digits)
    const names = Object.keys(kind === 'amp' ? AMPS : FX[kind]).sort((a, b) => b.length - a.length);
    let name = names.find(n => rest.toLowerCase().startsWith(n.toLowerCase()));
    if (!name && kind === 'gate') name = 'Noise Gate';
    if (!name) { console.warn('Unknown model', kind, rest); return; }
    if (rest.toLowerCase().startsWith(name.toLowerCase())) rest = rest.slice(name.length);
    const nums = [];
    let ms = null;
    for (const w of rest.trim().split(/\s+/).filter(Boolean)) {
      if (/^-?\d+(\.\d+)?ms$/i.test(w)) ms = parseFloat(w);
      else if (/^-?\d+(\.\d+)?$/.test(w)) nums.push(parseFloat(w));
    }
    if (kind === 'amp') {
      const [g = 5, b = 5, m = 5, t = 5, v = 6] = nums;
      tone.amp = { model: name, Gain: g, Bass: b, Mid: m, Treble: t, Master: v };
      return;
    }
    const def = FX[kind][name];
    const params = {};
    let ni = 0;
    def.p.forEach((p, j) => {
      if (def.ms && (p === 'Time' || p === 'Repeat Rate') && ms != null) { params[p] = msToKnob(name, ms); return; }
      params[p] = ni < nums.length ? nums[ni++] : def.d[j];
    });
    for (const k in params) params[k] = Math.max(0, Math.min(10, params[k]));
    tone[kind] = { model: name, params, ms: ms ?? (def.ms ? knobToMs(name, params.Time ?? params['Repeat Rate'] ?? 4) : null) };
  });
  return tone;
}

// Approximate time ranges for the Spark delay knobs. These are close enough to
// land in the right zone; tap tempo on the amp's TAP button fine-tunes it.
const DELAY_MAX = { 'Digital Delay': 1000, 'Echo Filt': 1000, 'Vintage Delay': 600, 'Reverse Delay': 1000, 'Multi Head': 700, 'Echo Tape': 700 };
export function msToKnob(model, ms) { return Math.max(0, Math.min(10, +(ms / (DELAY_MAX[model] || 1000) * 10).toFixed(1))); }
export function knobToMs(model, k) { return Math.round(k / 10 * (DELAY_MAX[model] || 1000)); }

export function cloneTone(t) { return JSON.parse(JSON.stringify(t)); }

export function catalogForPrompt() {
  const lines = ['AMPS (knobs: Gain, Bass, Mid, Treble, Master):'];
  for (const [n, a] of Object.entries(AMPS)) if (a.cat !== 'Bass') lines.push(`- ${n} [${a.cat}] ≈ ${a.real}`);
  for (const [slot, list] of Object.entries(FX)) {
    lines.push(`${slot.toUpperCase()} (one at a time):`);
    for (const [n, d] of Object.entries(list)) lines.push(`- ${n} ≈ ${d.real}; knobs: ${d.p.join(', ')}`);
  }
  return lines.join('\n');
}
