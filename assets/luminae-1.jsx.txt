import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ============================================================
   LUMINAE — A Sacred Spiritual Sanctuary
   Built for Olivia & DeAndre Hyde · June 2026
   ============================================================ */

/* ---------------- Design tokens ---------------- */
const T = {
  bg: "#0d0d1a",
  card: "#181830",
  card2: "#141428",
  gold: "#c9a84c",
  goldHi: "#e8c97a",
  rose: "#c07b8a",
  moon: "#b8c4d8",
  teal: "#7fd4e0",
  violet: "#b898e8",
  sage: "#8ec9a0",
  ink: "#e9e6f2",
  dim: "rgba(233,230,242,0.62)",
  faint: "rgba(233,230,242,0.38)",
};

/* ---------------- Tarot data ---------------- */
const MAJORS = [
  ["The Fool", "🌅", "new beginnings, innocence, a leap of faith"],
  ["The Magician", "✨", "manifestation, willpower, resourcefulness"],
  ["The High Priestess", "🌙", "intuition, inner knowing, the unseen"],
  ["The Empress", "🌹", "abundance, nurture, creation"],
  ["The Emperor", "🏛️", "structure, stability, protection"],
  ["The Hierophant", "🕯️", "tradition, spiritual guidance, learning"],
  ["The Lovers", "💞", "union, alignment, choices of the heart"],
  ["The Chariot", "🌠", "determination, victory, forward motion"],
  ["Strength", "🦁", "gentle courage, compassion, inner power"],
  ["The Hermit", "🏮", "solitude, soul-searching, inner light"],
  ["Wheel of Fortune", "🎡", "cycles, destiny, turning points"],
  ["Justice", "⚖️", "truth, fairness, cause and effect"],
  ["The Hanged Man", "🌀", "surrender, new perspective, pause"],
  ["Death", "🦋", "transformation, endings that free you"],
  ["Temperance", "🕊️", "balance, patience, divine timing"],
  ["The Devil", "⛓️", "attachment, shadow work, reclaiming power"],
  ["The Tower", "⚡", "sudden change, awakening, release"],
  ["The Star", "⭐", "hope, healing, renewal of faith"],
  ["The Moon", "🌕", "dreams, intuition, the subconscious"],
  ["The Sun", "☀️", "joy, vitality, success"],
  ["Judgement", "📯", "rebirth, calling, absolution"],
  ["The World", "🌍", "completion, wholeness, arrival"],
];
const SUITS = {
  Cups: { glyph: "💧", realm: "emotion, love, intuition" },
  Wands: { glyph: "🔥", realm: "passion, creativity, action" },
  Swords: { glyph: "🗡️", realm: "mind, truth, clarity" },
  Pentacles: { glyph: "🪙", realm: "body, work, abundance" },
};
const RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const FULL_DECK = (() => {
  const cards = MAJORS.map(([name, glyph, keys], i) => ({ name, glyph, keys, arcana: "Major", n: i }));
  Object.entries(SUITS).forEach(([suit, s]) =>
    RANKS.forEach((r) => cards.push({ name: `${r} of ${suit}`, glyph: s.glyph, keys: s.realm, arcana: suit }))
  );
  return cards;
})();

const DECKS = [
  { id: "classic", name: "The Classic", free: true, desc: "Rider-Waite inspired · deep midnight tones", g1: "#1a1a3e", g2: "#0d0d1a", frame: T.gold },
  { id: "fairy", name: "Fairy Realm", free: true, desc: "Luminous watercolour fairies · enchanted forests", g1: "#1d3326", g2: "#101d24", frame: T.sage },
  { id: "ocean", name: "Ocean Oracle", free: false, desc: "Dolphins & sea creatures · flowing blue hues", g1: "#0d2740", g2: "#081826", frame: T.teal },
  { id: "botanical", name: "Botanical", free: false, desc: "Lush florals & sacred plants", g1: "#23301c", g2: "#131c10", frame: T.sage },
  { id: "celestial", name: "Celestial", free: false, desc: "Nebulae, planets & starfields", g1: "#1d1438", g2: "#0d0a20", frame: T.violet },
  { id: "wings", name: "Spirit Wings", free: false, desc: "Angels & ethereal beings in golden light", g1: "#33291a", g2: "#1a1410", frame: T.goldHi },
  { id: "dark", name: "Dark Mystic", free: false, desc: "Gothic ravens, moons & ancient symbols", g1: "#1c1022", g2: "#0c0810", frame: T.rose },
  { id: "earth", name: "Sacred Earth", free: false, desc: "Art honouring the natural world", g1: "#33231a", g2: "#1a120d", frame: "#d39a6a" },
];

const SPREADS = [
  { id: "daily", name: "Daily Single Card", cards: 1, free: true, pos: ["Today's Energy"], note: "One card each morning for the day's energy." },
  { id: "angel", name: "Angel Message Card", cards: 1, free: true, pos: ["A Message From Your Guides"], note: "A single card as a message from your guides." },
  { id: "ppf", name: "Three Card Spread", cards: 3, free: false, pos: ["Past", "Present", "Future"], note: "The classic journey through time." },
  { id: "yesno", name: "Yes / No Spread", cards: 3, free: false, pos: ["Situation", "Guidance", "Outcome"], note: "Clarity on a question held in your heart." },
  { id: "mbs", name: "Mind · Body · Spirit", cards: 3, free: false, pos: ["Mind", "Body", "Spirit"], note: "A holistic check-in with your whole being." },
  { id: "rel", name: "Relationship Spread", cards: 5, free: false, pos: ["You", "Them", "The Connection", "What Supports It", "Where It Is Flowing"], note: "Exploring the energy of a connection." },
  { id: "month", name: "Month Ahead", cards: 4, free: false, pos: ["Week One", "Week Two", "Week Three", "Week Four"], note: "One card for each week of the month." },
  { id: "celtic", name: "Celtic Cross", cards: 10, free: false, pos: ["The Heart of the Matter", "What Crosses You", "The Root", "The Recent Past", "The Crown", "The Near Future", "Your Inner Self", "Your Environment", "Hopes & Fears", "The Outcome"], note: "This is a powerful spread — save it for important moments.", deep: true },
];

/* ---------------- Angel numbers ---------------- */
const ANGEL_NUMBERS = {
  "111": "A portal of manifestation is open. Your thoughts are seeds — choose them with love.",
  "222": "Trust the process, beloved. Balance and divine partnership are forming around you.",
  "333": "The Ascended Masters are near. You are supported in your growth and creative expression.",
  "444": "You are surrounded by angels. Protection and stability are being woven around you now.",
  "555": "Great change is arriving. Release the old with grace — the new is already on its way.",
  "666": "A gentle call to realign. Bring your focus back from worry to spirit and trust.",
  "777": "You are exactly where you are meant to be. Divine luck and deeper wisdom are unfolding.",
  "888": "Abundance flows toward you. An infinite loop of giving and receiving is opening.",
  "999": "A cycle is completing. Honour what was, and step lightly into your next chapter.",
  "1111": "New beginnings, alignment, a manifestation portal. The universe is mirroring your awakening — make a wish, then act as if it is already so.",
  "1212": "Stay in your highest vibration. Your faith is building the bridge to what you desire.",
  "1234": "You are on an ascending path. Simple, steady steps — each one is being blessed.",
};

/* ---------------- Archangels ---------------- */
const ARCHANGELS = [
  { name: "Archangel Michael", domain: "Protection & Courage", colour: "Cobalt Blue", hex: "#3b6fd4", crystal: "Black Tourmaline", invocation: "Archangel Michael, surround me in your blue flame of protection. Cut away all that is not of the light, and fill me with courage and strength." },
  { name: "Archangel Raphael", domain: "Healing & Health", colour: "Emerald Green", hex: "#3da06b", crystal: "Malachite", invocation: "Archangel Raphael, pour your emerald healing light through every cell of my being. Restore me to wholeness in body, heart, and spirit." },
  { name: "Archangel Gabriel", domain: "Communication & Creativity", colour: "White & Copper", hex: "#d8c8b8", crystal: "Selenite", invocation: "Archangel Gabriel, open my voice and my creative channel. Help me express my truth with clarity and grace." },
  { name: "Archangel Uriel", domain: "Wisdom & Clarity", colour: "Gold", hex: "#d4b04c", crystal: "Amber", invocation: "Archangel Uriel, illuminate my mind with your golden light. Show me the wisdom hidden within this moment." },
  { name: "Archangel Chamuel", domain: "Love & Relationships", colour: "Pink", hex: "#d489a0", crystal: "Rose Quartz", invocation: "Archangel Chamuel, open my heart to give and receive love freely. Help me see myself and others through the eyes of compassion." },
];

/* ---------------- Crystals ---------------- */
const CRYSTALS = [
  { name: "Amethyst", chakra: "Third Eye & Crown", use: "Calms the mind, deepens intuition, supports restful sleep.", pair: "963 Hz" },
  { name: "Rose Quartz", chakra: "Heart", use: "Unconditional love, self-compassion, softening grief.", pair: "639 Hz" },
  { name: "Black Tourmaline", chakra: "Root", use: "Powerful protection, grounding, transmuting dense energy.", pair: "396 Hz" },
  { name: "Clear Quartz", chakra: "All", use: "The master healer — amplifies intention and clears the field.", pair: "528 Hz" },
  { name: "Citrine", chakra: "Solar Plexus", use: "Joy, confidence, abundance — carries the energy of the sun.", pair: "528 Hz" },
  { name: "Selenite", chakra: "Crown", use: "Liquid light. Cleanses other crystals and the aura.", pair: "963 Hz" },
  { name: "Labradorite", chakra: "Third Eye", use: "Awakens magic and psychic senses, shields the aura.", pair: "852 Hz" },
  { name: "Moonstone", chakra: "Sacral & Crown", use: "Divine feminine, new beginnings, flowing with cycles.", pair: "417 Hz" },
  { name: "Black Obsidian", chakra: "Root", use: "Deep shadow work and transformation — a mirror of truth.", pair: "396 Hz" },
  { name: "Green Aventurine", chakra: "Heart", use: "Gentle luck, heart healing, optimism and renewal.", pair: "639 Hz" },
  { name: "Lapis Lazuli", chakra: "Throat & Third Eye", use: "Royal truth-telling, wisdom, speaking your soul's voice.", pair: "741 Hz" },
  { name: "Carnelian", chakra: "Sacral", use: "Creative fire, courage, vitality and motivation.", pair: "417 Hz" },
];

/* ---------------- Sound Sanctuary ---------------- */
const SOLFEGGIO = [
  { hz: 174, label: "Pain Relief & Security" },
  { hz: 285, label: "Tissue Healing" },
  { hz: 396, label: "Liberation from Fear · Root" },
  { hz: 417, label: "Facilitating Change · Sacral" },
  { hz: 528, label: "Transformation · The Love Frequency" },
  { hz: 639, label: "Connecting Relationships · Heart" },
  { hz: 741, label: "Awakening Intuition · Throat" },
  { hz: 852, label: "Spiritual Order · Third Eye" },
  { hz: 963, label: "Oneness & Divine Connection · Crown" },
];
const SOUNDSCAPES = [
  { id: "ocean", name: "Ocean Waves", desc: "Rolling swells — each wave builds, crests and retreats", type: "ocean", free: true },
  { id: "rain", name: "Gentle Rain", desc: "Soft patter of individual droplets", type: "rain", free: true },
  { id: "storm", name: "Thunderstorm", desc: "Distant thunder, gentle rain", type: "storm", free: false },
  { id: "stream", name: "Mountain Stream", desc: "Clear burbling water", type: "stream", free: false },
];
const INSTRUMENTS = [
  { id: "harp", name: "Angelic Harp", desc: "Flowing harp over a whisper of choir light", type: "harp", free: false },
  { id: "flute", name: "Native Flute", desc: "Earth-medicine melodies — breathy, grounding", type: "flute", free: false },
  { id: "tibetan", name: "Tibetan Singing Bowls", desc: "Deep resonant tones for grounding", type: "tibetan", free: false },
  { id: "crystalbowls", name: "Crystal Singing Bowls", desc: "Chakra-tuned bowls in gentle sequence", type: "crystal", free: false },
];
const LAYERS = [
  { id: "rainflute", name: "Rain & Native Flute", desc: "The classic sleep companion", parts: ["rain", "flute"] },
  { id: "harp528", name: "528 Hz + Angelic Harp", desc: "The Love Frequency, sung in strings", parts: [528, "harp"] },
  { id: "rain528", name: "Rain + 528 Hz", desc: "Healing in nature", parts: ["rain", 528] },
  { id: "ocean963", name: "Ocean + 963 Hz", desc: "Divine surrender", parts: ["ocean", 963] },
  { id: "bowlsrain", name: "Tibetan Bowls + Rain", desc: "Deep meditation", parts: ["rain", "tibetan"] },
];

const MEDITATIONS = [
  { name: "Deep Sleep Journey", mins: 20, note: "Gentle voice, layers into sleep", free: true },
  { name: "Violet Flame Transmutation", mins: 15, note: "Saint Germain's flame transmutes dense energy" },
  { name: "Chakra Balancing", mins: 15, note: "All 7 chakras, each with its solfeggio frequency" },
  { name: "Gold Light Protection", mins: 10, note: "Pure golden light surrounding the body" },
  { name: "Manifestation", mins: 10, note: "Visualise desires as already real" },
  { name: "Calm the Storm", mins: 8, note: "For anxiety & overwhelm — breathwork + grounding" },
  { name: "Morning Intention", mins: 7, note: "Energising, sets the day" },
  { name: "Archangel Michael Protection", mins: 10, note: "Calling in Michael's blue flame shield" },
  { name: "Cord Cutting", mins: 12, note: "Releasing energetic ties with love" },
  { name: "Violet Flame for Soul Clearing", mins: 20, note: "Deep transmutation practice" },
];

/* ---------------- Soul types ---------------- */
const SOUL_TYPES = {
  blueray: { name: "Blue Ray", colour: "#5a8fd4", essence: "Sensitive, empathic souls who came to transmute energy — often felt different and misunderstood." },
  indigo: { name: "Indigo", colour: "#6a5ad4", essence: "Warriors of light here to break old systems. Strong-willed truth-seekers." },
  rainbow: { name: "Rainbow Child", colour: "#d48aa0", essence: "Pure love energy with no karma to clear — here simply to give." },
  crystal: { name: "Crystal Child", colour: "#9ad4d0", essence: "Gentle, telepathic, deeply sensitive — often labelled 'different'." },
  starseed: { name: "Starseed", colour: "#b898e8", essence: "A soul from other star systems — Pleiades, Sirius, Arcturus, Lyra — who feels Earth was never quite home." },
  earthangel: { name: "Earth Angel", colour: "#c9a84c", essence: "Here specifically to heal, serve, and hold light for others." },
};
// Rather than forced either/or questions (where several answers can be true
// at once), the seeker rates how deeply each statement resonates. Every type
// is scored independently, and the result is a blended profile — a primary
// ray with secondary currents — because souls rarely carry only one light.
const SOUL_STATEMENTS = [
  ["I absorb other people's emotions as if they were my own", "blueray"],
  ["I instinctively question authority and systems that feel broken", "indigo"],
  ["Joy and love seem to flow out of me without effort", "rainbow"],
  ["I'm deeply sensitive to noise, crowds and harsh energy", "crystal"],
  ["I look at the night sky and feel a strange homesickness", "starseed"],
  ["I feel my purpose is to heal and hold space for others", "earthangel"],
  ["I've spent much of my life feeling different and misunderstood", "blueray"],
  ["I feel called to tear down what no longer serves humanity", "indigo"],
  ["I don't seem to carry old wounds the way others do", "rainbow"],
  ["People say I have a calming, almost telepathic presence", "crystal"],
  ["Earth has never quite felt like my true home", "starseed"],
  ["Strangers open up to me and ask for my help", "earthangel"],
];
const RESONANCE = [["Deeply true", 2], ["Somewhat", 1], ["Not really me", 0]];

/* ---------------- Zodiac & moon ---------------- */
const ZODIAC = [
  ["Capricorn", 1, 19, "♑"], ["Aquarius", 2, 18, "♒"], ["Pisces", 3, 20, "♓"], ["Aries", 4, 19, "♈"],
  ["Taurus", 5, 20, "♉"], ["Gemini", 6, 20, "♊"], ["Cancer", 7, 22, "♋"], ["Leo", 8, 22, "♌"],
  ["Virgo", 9, 22, "♍"], ["Libra", 10, 22, "♎"], ["Scorpio", 11, 21, "♏"], ["Sagittarius", 12, 21, "♐"],
];
function sunSign(month, day) {
  for (const [name, m, lastDay, glyph] of ZODIAC) {
    if (month === m && day <= lastDay) return { name, glyph };
  }
  const idx = ZODIAC.findIndex(([, m]) => m === month);
  const next = ZODIAC[(idx + 1) % 12];
  return { name: next[0], glyph: next[3] };
}
function moonPhase(date = new Date()) {
  const synodic = 29.53058867;
  const known = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - known) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic;
  const f = phase / synodic;
  if (f < 0.03 || f > 0.97) return { name: "New Moon", icon: "🌑" };
  if (f < 0.22) return { name: "Waxing Crescent", icon: "🌒" };
  if (f < 0.28) return { name: "First Quarter", icon: "🌓" };
  if (f < 0.47) return { name: "Waxing Gibbous", icon: "🌔" };
  if (f < 0.53) return { name: "Full Moon", icon: "🌕" };
  if (f < 0.72) return { name: "Waning Gibbous", icon: "🌖" };
  if (f < 0.78) return { name: "Last Quarter", icon: "🌗" };
  return { name: "Waning Crescent", icon: "🌘" };
}

/* ---------------- Numerology ---------------- */
const LETTER_VAL = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };
const VOWELS = new Set(["a","e","i","o","u"]);
function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  }
  return n;
}
function sumName(name, filter) {
  return reduceNum(name.toLowerCase().replace(/[^a-z]/g, "").split("")
    .filter((c) => (filter === "v" ? VOWELS.has(c) : filter === "c" ? !VOWELS.has(c) : true))
    .reduce((s, c) => s + (LETTER_VAL[c] || 0), 0));
}
function lifePath(y, m, d) { return reduceNum(reduceNum(y) + reduceNum(m) + reduceNum(d)); }
function personalYear(m, d) { return reduceNum(reduceNum(new Date().getFullYear()) + reduceNum(m) + reduceNum(d)); }

/* ---------------- Claude API ---------------- */
const LUMINAE_VOICE = `You are the voice of Luminae, a sacred spiritual sanctuary app. You write as a wise, loving presence — warm, reverent, never clinical. Use words like sacred, beloved, seeker, illuminate, journey, pure. Never use words like scan, detect, analyze, process. Never make medical claims or definitive predictions; use possibility language ("this energy suggests...", "the cards invite you to consider..."). Every reading opens from a place of pure intent, golden light, and the highest good of all. Keep responses focused and beautiful — around 250-400 words unless asked otherwise. You may use short paragraphs and the occasional gentle heading, but never bullet-point lists of keywords.`;

async function askLuminae(userPrompt, extraSystem = "", history = []) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: LUMINAE_VOICE + (extraSystem ? "\n\n" + extraSystem : ""),
      messages: [...history, { role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) throw new Error("The channel is quiet right now");
  const data = await res.json();
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

/* ---------------- Web Audio engine ---------------- */
function createAudioEngine() {
  let ctx = null;
  let nodes = [];
  let timers = [];
  let timerId = null;
  let bus = null, verbIn = null;
  let cachedWhite = null, cachedBrown = null, cachedIR = null;

  const rnd = (a, b) => a + Math.random() * (b - a);
  const reg = (...ns) => ns.forEach((n) => nodes.push(n));
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const every = (fn, ms) => timers.push(setInterval(fn, ms));

  const ensure = () => {
    if (!ctx || ctx.state === "closed") { ctx = new (window.AudioContext || window.webkitAudioContext)(); cachedWhite = null; cachedBrown = null; cachedIR = null; }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  /* --- tiny builders --- */
  const osc = (type, freq) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; reg(o); return o; };
  const gn = (v) => { const g = ctx.createGain(); g.gain.value = v; reg(g); return g; };
  const filt = (type, freq, q = 1) => { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; reg(f); return f; };
  const epan = (v) => { const p = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain(); if (p.pan) p.pan.value = v; return p; };
  const chain = (...ns) => { for (let i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]); };

  const whiteBuf = () => {
    if (cachedWhite) return cachedWhite;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 14, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return (cachedWhite = buf);
  };
  const brownBuf = () => {
    if (cachedBrown) return cachedBrown;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 14, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    const fade = Math.floor(ctx.sampleRate * 0.05);
    for (let i = 0; i < fade; i++) { const t = i / fade; d[i] = d[i] * t + d[d.length - fade + i] * (1 - t); }
    return (cachedBrown = buf);
  };
  const src = (buf) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; reg(s); return s; };
  const drift = (param, base, depth, minS = 6, maxS = 14) => {
    const tick = () => { try { param.setTargetAtTime(base + (Math.random() * 2 - 1) * depth, ctx.currentTime, (minS + Math.random() * (maxS - minS)) / 3); } catch (e) {} };
    tick(); every(tick, (minS + maxS) * 500);
  };

  /* --- THE HALL: a generated 4-second reverb. This is the secret of the
         "angelic" sound — notes don't end, they wash into each other and
         hang in the air. Instruments are sent here heavily, nature lightly. --- */
  const irBuf = () => {
    if (cachedIR) return cachedIR;
    const len = Math.floor(ctx.sampleRate * 4.0);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return (cachedIR = ir);
  };
  const makeBus = () => {
    const c = ensure();
    const dry = gn(1);
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -22; comp.ratio.value = 6; comp.knee.value = 18; reg(comp);
    dry.connect(comp); comp.connect(c.destination);
    verbIn = gn(1);
    const conv = c.createConvolver(); conv.buffer = irBuf(); reg(conv);
    const damp = filt("lowpass", 4200, 0.7);
    const wet = gn(0.7);
    chain(verbIn, conv, damp, wet); wet.connect(comp);
    return dry;
  };
  const space = (amt) => { const g = gn(1); g.connect(bus); const s = gn(amt); g.connect(s); s.connect(verbIn); return g; };

  /* --- pure frequency tone (gentle, breathing) --- */
  const startTone = (out, hz, vol = 0.06) => {
    const master = gn(0.0001);
    master.gain.linearRampToValueAtTime(vol, ctx.currentTime + 3);
    master.connect(out);
    const o1 = osc("sine", hz), o2 = osc("sine", hz * 1.002);
    const g2 = gn(0.4);
    o1.connect(master); chain(o2, g2, master);
    const lfo = osc("sine", 0.08), lfoG = gn(vol * 0.3);
    lfo.connect(lfoG); lfoG.connect(master.gain);
    o1.start(); o2.start(); lfo.start();
  };

  /* --- OCEAN: discrete rolling waves over a faint distant-sea bed --- */
  const startOcean = (out) => {
    const bed = src(brownBuf()), bedF = filt("lowpass", 220, 0.5), bedG = gn(0.09);
    chain(bed, bedF, bedG, out); bed.start(0, rnd(0, 12));
    const wave = () => {
      const t = ctx.currentTime;
      const dur = rnd(7, 11), rise = rnd(2.2, 3.8), peak = rnd(0.22, 0.62);
      const s = ctx.createBufferSource(); s.buffer = brownBuf(); s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 0.6;
      const g = ctx.createGain();
      const p = epan(rnd(-0.6, 0.6));
      chain(s, f, g, p, out);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + rise);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      f.frequency.setValueAtTime(rnd(350, 500), t);
      f.frequency.linearRampToValueAtTime(rnd(1400, 2400), t + rise);
      f.frequency.exponentialRampToValueAtTime(280, t + dur);
      s.start(0, rnd(0, 12)); s.stop(t + dur + 0.5);
      later(() => [s, f, g, p].forEach((n) => { try { n.disconnect(); } catch (e) {} }), (dur + 1) * 1000);
    };
    wave();
    const sched = () => { wave(); later(sched, rnd(4200, 9000)); };
    later(sched, rnd(2500, 5000));
  };

  /* --- RAIN: dark wash + droplet patter. THUNDER is now rolling low-passed
         noise with multiple rumble peaks — audible on any speaker, not a
         sub-bass sine that small drivers can't reproduce. --- */
  const thunder = (out) => {
    const t = ctx.currentTime;
    const dur = rnd(5, 9);
    const s = ctx.createBufferSource(); s.buffer = brownBuf(); s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = "lowpass";
    f.frequency.setValueAtTime(rnd(200, 340), t);
    f.frequency.exponentialRampToValueAtTime(95, t + dur);
    const g = ctx.createGain();
    const p = epan(rnd(-0.7, 0.7));
    g.gain.setValueAtTime(0.0001, t);
    let tt = t + rnd(0.05, 0.6);
    let peak = rnd(0.55, 0.95);
    const nPeaks = 2 + Math.floor(rnd(0, 3));
    for (let i = 0; i < nPeaks; i++) {
      tt += i === 0 ? rnd(0.12, 0.5) : rnd(0.6, 1.2);
      g.gain.exponentialRampToValueAtTime(peak, tt);
      tt += rnd(0.8, 1.6);
      g.gain.exponentialRampToValueAtTime(peak * rnd(0.18, 0.38), tt);
      peak *= rnd(0.5, 0.75);
    }
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    chain(s, f, g, p, out);
    s.start(0, rnd(0, 12)); s.stop(t + dur + 0.3);
    later(() => [s, f, g, p].forEach((n) => { try { n.disconnect(); } catch (e) {} }), (dur + 1) * 1000);
  };
  const startRain = (out, storm) => {
    const wash = src(whiteBuf()), washF = filt("lowpass", 1000, 0.4), washG = gn(storm ? 0.07 : 0.055);
    chain(wash, washF, washG, out); wash.start(0, rnd(0, 12));
    drift(washF.frequency, 1000, 260); drift(washG.gain, storm ? 0.07 : 0.055, 0.018, 9, 18);
    const sheen = src(whiteBuf()), sheenF = filt("bandpass", 5200, 0.9), sheenG = gn(0.008);
    chain(sheen, sheenF, sheenG, out); sheen.start(0, rnd(0, 12));
    const drop = () => {
      const t = ctx.currentTime;
      const s = ctx.createBufferSource(); s.buffer = whiteBuf();
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = rnd(900, 5400); f.Q.value = 6;
      const g = ctx.createGain(); const p = epan(rnd(-0.85, 0.85));
      g.gain.setValueAtTime(rnd(0.008, 0.05), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + rnd(0.03, 0.11));
      chain(s, f, g, p, out);
      s.start(0, rnd(0, 13), 0.13);
    };
    every(() => { const n = storm ? 3 : 2; for (let i = 0; i < n; i++) if (Math.random() < 0.8) setTimeout(drop, Math.random() * 90); }, 100);
    if (storm) {
      later(() => thunder(out), rnd(1500, 4000)); // make weather known early
      every(() => { if (Math.random() < 0.55) thunder(out); }, 9000);
    }
  };

  /* --- STREAM --- */
  const startStream = (out) => {
    [[850, 0.8, 0.11, 0.37], [1650, 0.7, 0.08, 0.51]].forEach(([freq, q, vol, rate]) => {
      const s = src(whiteBuf()), f = filt("bandpass", freq, q), g = gn(vol);
      const lfo = osc("sine", rate), lfoG = gn(freq * 0.3);
      lfo.connect(lfoG); lfoG.connect(f.frequency);
      chain(s, f, g, out); s.start(0, rnd(0, 12)); lfo.start();
      drift(g.gain, vol, vol * 0.25, 5, 11);
    });
    every(() => {
      if (Math.random() < 0.5) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(rnd(300, 700), t);
      o.frequency.exponentialRampToValueAtTime(rnd(700, 1300), t + 0.06);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.012, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      const p = epan(rnd(-0.5, 0.5));
      chain(o, g, p, out); o.start(t); o.stop(t + 0.1);
    }, 180);
  };

  /* --- BOWLS ---
     Crystal bowls are SUNG, not struck — the rim is rubbed, so each bowl
     swells in slowly, sustains with a shimmering beat (two partials a few
     cents apart), wavers like a breath, and hands over to the next chakra
     bowl while still ringing. Tibetan bowls stay struck, with beating
     partials for that thick bronze warble. --- */
  const startBowls = (out, kind) => {
    const master = gn(0.5); master.connect(out);
    if (kind === "crystal") {
      const chakraHz = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];
      let i = 0;
      const sing = () => {
        const base = chakraHz[i % 7]; i++;
        const t = ctx.currentTime;
        const dur = 15, swell = 4.5;
        const wob = ctx.createGain(); wob.gain.value = 1;
        const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = rnd(0.45, 0.8);
        const lfoG = ctx.createGain(); lfoG.gain.value = 0.16;
        lfo.connect(lfoG); lfoG.connect(wob.gain);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, t);
        env.gain.linearRampToValueAtTime(1, t + swell);
        env.gain.setValueAtTime(1, t + dur - 4.5);
        env.gain.linearRampToValueAtTime(0.0001, t + dur);
        env.connect(wob); wob.connect(master);
        const parts = [env, wob, lfo, lfoG];
        [[1, 0.095], [2.0, 0.03], [3.0, 0.01]].forEach(([mult, vol]) =>
          [-1.8, 1.8].forEach((cents) => {   // the beating pair = the shimmer
            const o = ctx.createOscillator(); o.type = "sine";
            o.frequency.value = base * mult * Math.pow(2, cents / 1200);
            const g = ctx.createGain(); g.gain.value = vol;
            o.connect(g); g.connect(env);
            o.start(t); o.stop(t + dur + 0.3); parts.push(o, g);
          }));
        lfo.start(t); lfo.stop(t + dur + 0.3);
        later(() => parts.forEach((n) => { try { n.disconnect(); } catch (e) {} }), (dur + 1) * 1000);
      };
      sing();
      every(sing, 10500); // each bowl rises while the last still rings
    } else {
      const strike = () => {
        const base = 110 + Math.random() * 50;
        const t = ctx.currentTime;
        [[1, 0.2], [2.756, 0.07], [5.4, 0.025]].forEach(([mult, peak]) =>
          [-2.2, 2.2].forEach((cents) => {
            const o = ctx.createOscillator(); o.type = "sine";
            o.frequency.value = base * mult * Math.pow(2, cents / 1200);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(peak / 2, t + 0.04);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 11);
            o.connect(g); g.connect(master);
            o.start(t); o.stop(t + 11.2);
          }));
      };
      strike();
      every(strike, 11000);
    }
  };

  /* --- KARPLUS-STRONG PLUCK: a real string model --- */
  const ksPluck = (out, freq, when, vel, panV = 0) => {
    const t = ctx.currentTime + when;
    const ring = 5.5;
    vel = vel * Math.min(1, Math.pow(600 / freq, 0.8)); // high strings stay soft
    const burst = ctx.createBufferSource(); burst.buffer = whiteBuf();
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(vel * 1.8, t);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 2 / freq);
    const delay = ctx.createDelay(0.1); delay.delayTime.value = 1 / freq;
    const damp = ctx.createBiquadFilter(); damp.type = "lowpass"; damp.frequency.value = Math.min(freq * 5, 3800); // warm, never shrill
    const fb = ctx.createGain();
    fb.gain.setValueAtTime(0.989, t);
    fb.gain.setValueAtTime(0.989, t + ring - 1);
    fb.gain.linearRampToValueAtTime(0.15, t + ring);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.9, t);
    og.gain.setValueAtTime(0.9, t + ring - 1);
    og.gain.linearRampToValueAtTime(0.0001, t + ring);
    const p = epan(panV);
    burst.connect(bg); bg.connect(delay);
    delay.connect(damp); damp.connect(fb); fb.connect(delay);
    damp.connect(og); og.connect(p); p.connect(out);
    burst.start(t, rnd(0, 10), 0.08);
    later(() => { [burst, bg, delay, damp, fb, og, p].forEach((n) => { try { n.disconnect(); } catch (e) {} }); }, (when + ring + 0.6) * 1000);
  };

  /* --- soft "ahh" choir voice --- */
  const choirVoice = (out, freq, dur) => {
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = freq;
    const wob = ctx.createOscillator(); wob.type = "sine"; wob.frequency.value = rnd(0.1, 0.22);
    const wobG = ctx.createGain(); wobG.gain.value = freq * 0.0035;
    wob.connect(wobG); wobG.connect(o.frequency);
    const f1 = ctx.createBiquadFilter(); f1.type = "bandpass"; f1.frequency.value = 640; f1.Q.value = 4;
    const f2 = ctx.createBiquadFilter(); f2.type = "bandpass"; f2.frequency.value = 1060; f2.Q.value = 5;
    const g1 = ctx.createGain(); g1.gain.value = 0.55;
    const g2 = ctx.createGain(); g2.gain.value = 0.3;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2300;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(0.009, t + 2.6);
    env.gain.setValueAtTime(0.009, t + dur - 2.5);
    env.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(f1); o.connect(f2); f1.connect(g1); f2.connect(g2);
    g1.connect(lp); g2.connect(lp); lp.connect(env); env.connect(out);
    o.start(t); o.stop(t + dur + 0.2); wob.start(t); wob.stop(t + dur + 0.2);
    later(() => { [o, wob, wobG, f1, f2, g1, g2, lp, env].forEach((n) => { try { n.disconnect(); } catch (e) {} }); }, (dur + 0.8) * 1000);
  };

  /* --- flowing lead voice: a sustained tone that swells in and GLIDES
         legato from one chord tone to the next mid-bar — the connective
         tissue that makes the notes flow together instead of standing
         apart. With the hall reverb, this is the "angelic" thread. --- */
  const leadVoice = (out, fA, fB, dur) => {
    const t = ctx.currentTime;
    fA = fA / 2; fB = fB / 2; // an octave down — a warm hum, never a whistle
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = fA;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = fA * 1.004;
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 950;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(0.011, t + 2.4);
    env.gain.setValueAtTime(0.011, t + dur - 2.2);
    env.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.frequency.setTargetAtTime(fB, t + dur * 0.42, 0.9);
    o2.frequency.setTargetAtTime(fB * 1.004, t + dur * 0.42, 0.9);
    o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(env); env.connect(out);
    o.start(t); o.stop(t + dur + 0.3); o2.start(t); o2.stop(t + dur + 0.3);
    later(() => { [o, o2, g2, lp, env].forEach((n) => { try { n.disconnect(); } catch (e) {} }); }, (dur + 0.8) * 1000);
  };

  /* --- ANGELIC HARP: chord progression (C · Am7 · F · G), flowing
         arpeggios, choir light beneath, and a gliding lead voice that
         binds the notes together — all hanging in the hall reverb. --- */
  const HARP_PROG = [
    { bass: 130.81, notes: [261.63, 329.63, 392.0, 523.25, 659.25] },
    { bass: 110.0, notes: [220.0, 261.63, 329.63, 392.0, 523.25] },
    { bass: 174.61, notes: [349.23, 440.0, 523.25, 659.25, 698.46] },
    { bass: 196.0, notes: [392.0, 493.88, 587.33, 659.25, 698.46] },
  ];
  const HARP_PATTERNS = [
    [[-1, 0, 0.5], [0, 0.55, 0.42], [1, 1.1, 0.4], [2, 1.65, 0.42], [3, 2.2, 0.45], [4, 2.9, 0.5], [3, 4.4, 0.35], [2, 5.2, 0.3]],
    [[-1, 0, 0.5], [1, 0.5, 0.4], [3, 1.0, 0.42], [2, 1.6, 0.38], [4, 2.3, 0.48], [3, 3.6, 0.34], [1, 4.6, 0.3], [2, 5.6, 0.32]],
    [[-1, 0, 0.48], [0, 0.4, 0.4], [2, 0.85, 0.4], [4, 1.35, 0.46], [4, 3.0, 0.4], [3, 3.5, 0.34], [2, 4.05, 0.3], [0, 5.3, 0.3]],
  ];
  const startHarp = (out) => {
    let chordI = 0, patI = 0;
    const bar = () => {
      const chord = HARP_PROG[chordI % HARP_PROG.length]; chordI++;
      if (Math.random() < 0.3) patI = Math.floor(rnd(0, HARP_PATTERNS.length));
      HARP_PATTERNS[patI].forEach(([idx, off, vel]) => {
        const f = idx < 0 ? chord.bass : chord.notes[idx];
        ksPluck(out, f, off + rnd(-0.02, 0.035), vel * 0.2, rnd(-0.55, 0.55));
      });
      [0, 1, 2].forEach((i) => choirVoice(out, chord.notes[i] / 2, 7.8));
      const li = 2 + Math.floor(rnd(0, 2));
      leadVoice(out, chord.notes[li], chord.notes[li + (Math.random() < 0.5 ? 1 : -1)], 7.8);
      later(bar, 7000);
    };
    bar();
  };

  /* --- NATIVE FLUTE: real melodic arcs — calls that climb to a held high
         note, then answers that descend home and settle low. Composed
         phrases in the traditional minor-pentatonic voice, with the chiff,
         the late vibrato, and the falling-away at phrase ends. --- */
  const FNOTE = { E4: 329.63, G4: 392.0, A4: 440.0, B4: 493.88, D5: 587.33, E5: 659.25, G5: 783.99 };
  const FSTEP = ["E4", "G4", "A4", "B4", "D5", "E5", "G5"];
  const FLUTE_CALLS = [
    [["A4", 1.1, 0], ["B4", 0.9, 0], ["D5", 1.1, 0], ["E5", 3.0, 1]],
    [["E5", 1.0, 0], ["G5", 3.2, 1]],
    [["G4", 1.0, 0], ["A4", 0.9, 0], ["B4", 1.6, 0], ["E5", 2.7, 1]],
    [["B4", 0.9, 0], ["D5", 0.9, 0], ["E5", 1.5, 0], ["G5", 2.9, 1]],
  ];
  const FLUTE_ANSWERS = [
    [["D5", 1.2, 0], ["B4", 1.0, 0], ["A4", 1.3, 0], ["G4", 1.0, 0], ["E4", 3.5, 1]],
    [["E5", 1.1, 0], ["D5", 1.0, 0], ["B4", 1.2, 0], ["A4", 3.0, 1]],
    [["G5", 1.2, 0], ["E5", 1.0, 0], ["D5", 1.2, 0], ["B4", 1.0, 0], ["G4", 3.1, 1]],
    [["B4", 1.2, 0], ["A4", 1.0, 0], ["G4", 1.3, 0], ["E4", 3.3, 1]],
  ];
  const fluteNote = (out, freq, when, dur, fall, slideFrom) => {
    const t = ctx.currentTime + when;
    const cleanup = [];
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1900;
    const env = ctx.createGain(); cleanup.push(lp, env);
    lp.connect(env); env.connect(out);
    const mk = (type, f, vol) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = vol;
      o.connect(g); g.connect(lp);
      o.start(t); o.stop(t + dur + 0.4);
      cleanup.push(o, g);
      return o;
    };
    const o1 = mk("sine", freq, 1);
    const o2 = mk("sine", freq * 2, 0.15);
    mk("triangle", freq, 0.08);
    [o1, o2].forEach((o, i) => {
      const target = i === 0 ? freq : freq * 2;
      o.frequency.setValueAtTime(slideFrom ? slideFrom * (i + 1) : target * 0.985, t);
      o.frequency.setTargetAtTime(target, t, slideFrom ? 0.09 : 0.045);
    });
    const vib = ctx.createOscillator(); vib.type = "sine"; vib.frequency.value = rnd(4.5, 5.3);
    const vibG = ctx.createGain();
    vibG.gain.setValueAtTime(0, t);
    vibG.gain.setValueAtTime(0, t + Math.min(0.8, dur * 0.4));
    vibG.gain.linearRampToValueAtTime(freq * 0.005, t + Math.min(1.4, dur * 0.7));
    vib.connect(vibG); vibG.connect(o1.frequency);
    vib.start(t); vib.stop(t + dur + 0.4); cleanup.push(vib, vibG);
    if (fall) {
      o1.frequency.setTargetAtTime(freq * 0.84, t + dur - 0.4, 0.18);
      o2.frequency.setTargetAtTime(freq * 1.68, t + dur - 0.4, 0.18);
    }
    const peakV = 0.075 * Math.min(1.05, Math.pow(440 / freq, 0.4)); // high notes stay sweet
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(peakV, t + 0.3);
    env.gain.setValueAtTime(peakV, t + Math.max(0.35, dur - (fall ? 0.9 : 0.5)));
    env.gain.linearRampToValueAtTime(0.0001, t + dur);
    const b = ctx.createBufferSource(); b.buffer = whiteBuf();
    const bf = ctx.createBiquadFilter(); bf.type = "bandpass"; bf.frequency.value = freq * 2.2; bf.Q.value = 2;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.018, t);
    bg.gain.exponentialRampToValueAtTime(0.005, t + 0.12);
    bg.gain.linearRampToValueAtTime(0.0001, t + dur);
    b.connect(bf); bf.connect(bg); bg.connect(out);
    b.start(t, rnd(0, 10)); b.stop(t + dur + 0.2);
    cleanup.push(b, bf, bg);
    later(() => cleanup.forEach((n) => { try { n.disconnect(); } catch (e) {} }), (when + dur + 0.8) * 1000);
  };
  const startFlute = (out) => {
    let isCall = true, lastCall = -1, lastAns = -1;
    const playPhrase = () => {
      const pool = isCall ? FLUTE_CALLS : FLUTE_ANSWERS;
      const avoid = isCall ? lastCall : lastAns;
      let idx;
      do { idx = Math.floor(rnd(0, pool.length)); } while (idx === avoid && pool.length > 1);
      if (isCall) lastCall = idx; else lastAns = idx;
      const phrase = pool[idx];
      let when = 0, prevF = null;
      phrase.forEach(([name, dur, fall], k) => {
        const f = FNOTE[name];
        if (k > 0 && Math.random() < 0.25) {
          const gi = Math.min(FSTEP.indexOf(name) + 1, FSTEP.length - 1);
          fluteNote(out, FNOTE[FSTEP[gi]], when, 0.12, false, null);
          when += 0.1;
        }
        fluteNote(out, f, when, dur, !!fall, k > 0 && Math.random() < 0.45 ? prevF : null);
        prevF = f; when += dur + rnd(0.04, 0.3);
      });
      const rest = isCall ? rnd(1.6, 3) : rnd(4, 7.5); // breathe after the answer
      isCall = !isCall;
      later(playPhrase, (when + rest) * 1000);
    };
    playPhrase();
  };

  /* --- TUNED AMBIENT PAD: gentle evolving chords rooted in the chosen
         frequency itself — the bed of music IS the tuning --- */
  const startPad = (out, hz) => {
    let root = hz || 264;
    while (root > 240) root /= 2;
    while (root < 110) root *= 2;
    const CHORDS = [[1, 1.5, 2, 2.5], [1, 1.25, 1.5, 2], [1, 1.333, 2, 2.667], [1, 1.5, 1.875, 2.25]];
    const padOut = gn(1); padOut.connect(out);
    let current = null;
    const playChord = () => {
      const ratios = CHORDS[Math.floor(Math.random() * CHORDS.length)];
      const t = ctx.currentTime;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(1, t + 6);
      g.connect(padOut); reg(g);
      const oscs = [];
      ratios.forEach((r) => [-2.5, 2.5].forEach((cents) => {
        const o = ctx.createOscillator(); o.type = "sine";
        o.frequency.value = root * r * Math.pow(2, cents / 1200);
        const og = ctx.createGain(); og.gain.value = 0.016;
        const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1300;
        chain(o, og, f, g); o.start(); oscs.push(o);
      }));
      if (current) {
        current.g.gain.setValueAtTime(1, t);
        current.g.gain.linearRampToValueAtTime(0.0001, t + 7);
        current.oscs.forEach((o) => { try { o.stop(t + 8); } catch (e) {} });
      }
      current = { g, oscs };
    };
    playChord();
    every(playChord, 18000 + Math.random() * 8000);
  };

  /* --- routing: each generator gets its own reverb send level --- */
  const SPACE_AMT = { ocean: 0.12, rain: 0.05, storm: 0.08, stream: 0.1, tibetan: 0.65, crystal: 0.7, harp: 1.0, flute: 0.8, pad: 0.55, tone: 0.2 };
  const go = (part, hz, vol) => {
    const out = space(typeof part === "number" ? SPACE_AMT.tone : (SPACE_AMT[part] ?? 0.2));
    if (typeof part === "number") return startTone(out, part, vol ?? 0.028);
    if (part === "ocean") return startOcean(out);
    if (part === "rain") return startRain(out, false);
    if (part === "storm") return startRain(out, true);
    if (part === "stream") return startStream(out);
    if (part === "tibetan" || part === "crystal") return startBowls(out, part);
    if (part === "harp") return startHarp(out);
    if (part === "flute") return startFlute(out);
    if (part === "pad") return startPad(out, hz);
  };

  return {
    play(track, opts = {}) {
      this.stop(false);
      ensure();
      bus = makeBus();
      if (track.type === "tone") {
        go(track.hz, null, opts.music ? 0.02 : 0.06); // tucked under the music
        if (opts.music) go("pad", track.hz);
      } else if (track.type === "layer") {
        const hz = track.parts.find((x) => typeof x === "number");
        track.parts.forEach((p) => go(p, hz));
      } else {
        go(track.type);
        // the hidden frequency: barely detectable beneath the music —
        // present in the field without ever being "heard"
        if (opts.music && (track.type === "harp" || track.type === "flute"))
          go(track.hiddenHz || 528, null, 0.012);
      }
    },
    /* Seamless looping for the seeker's own tracks: each pass overlaps the
       next with an equal crossfade, so there is no audible loop point. */
    playBuffer(audioBuffer, opts = {}) {
      this.stop(false);
      ensure();
      bus = makeBus();
      const out = space(0.12);
      const dur = audioBuffer.duration;
      const xf = Math.min(2, Math.max(0.5, dur / 10));
      const cycle = () => {
        const t = ctx.currentTime;
        const s = ctx.createBufferSource(); s.buffer = audioBuffer;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.9, t + xf);
        g.gain.setValueAtTime(0.9, t + dur - xf);
        g.gain.linearRampToValueAtTime(0.0001, t + dur);
        s.connect(g); g.connect(out);
        s.start(t);
        later(() => { try { s.disconnect(); g.disconnect(); } catch (e) {} }, (dur + 0.5) * 1000);
        later(cycle, (dur - xf) * 1000);
      };
      cycle();
      if (opts.music) go(opts.hiddenHz || 528, null, 0.012); // hidden frequency beneath
    },
    decode(arrayBuffer) {
      ensure();
      return ctx.decodeAudioData(arrayBuffer);
    },
    stop(closeCtx = true) {
      timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = [];
      nodes.forEach((n) => { try { n.stop && n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} });
      nodes = []; bus = null; verbIn = null;
      if (timerId) { clearTimeout(timerId); timerId = null; }
      if (closeCtx && ctx) { try { ctx.close(); } catch (e) {} ctx = null; cachedWhite = null; cachedBrown = null; cachedIR = null; }
    },
    setSleepTimer(mins, onEnd) {
      if (timerId) clearTimeout(timerId);
      if (!mins) return;
      timerId = setTimeout(() => { this.stop(); onEnd && onEnd(); }, mins * 60000);
    },
  };
}

/* ============================================================
   UI ATOMS
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { margin: 0; }
    .lum-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    .lum-sans { font-family: 'DM Sans', -apple-system, sans-serif; }
    .gold-shimmer {
      background: linear-gradient(110deg, #c9a84c 20%, #f5e3a8 38%, #e8c97a 50%, #f5e3a8 62%, #c9a84c 80%);
      background-size: 250% 100%;
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; color: transparent;
      animation: shimmer 5s ease-in-out infinite;
    }
    @keyframes shimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    @keyframes orbBreath {
      0%,100% { transform: scale(1); box-shadow: 0 0 60px 18px rgba(201,168,76,0.28), 0 0 130px 50px rgba(184,152,232,0.12), inset 0 0 50px rgba(245,227,168,0.5); }
      50% { transform: scale(1.06); box-shadow: 0 0 90px 30px rgba(201,168,76,0.42), 0 0 170px 70px rgba(184,152,232,0.18), inset 0 0 70px rgba(245,227,168,0.7); }
    }
    @keyframes cardIn { from { opacity: 0; transform: translateY(18px) rotateY(85deg); } to { opacity: 1; transform: translateY(0) rotateY(0); } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes twinkle { 0%,100% { opacity: .25; } 50% { opacity: .9; } }
    @keyframes pulseRing { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(1.7); opacity: 0; } }
    @keyframes orbRays { to { transform: rotate(360deg); } }
    @keyframes orbRaysRev { to { transform: rotate(-360deg); } }
    @keyframes orbRing { 0% { transform: scale(1); opacity: .4; } 100% { transform: scale(2.15); opacity: 0; } }
    @keyframes glisten { 0%, 100% { transform: translateX(-65%) rotate(8deg); } 50% { transform: translateX(65%) rotate(8deg); } }
    @keyframes sparkleDrift { 0% { transform: translate(0, 0) scale(.3); opacity: 0; } 22% { opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; } }
    .fade-up { animation: fadeUp .6s ease both; }
    .lum-card-hover { transition: transform .25s ease, box-shadow .25s ease; }
    .lum-card-hover:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,.5), 0 0 24px rgba(201,168,76,.12); }
    button:focus-visible, [role="button"]:focus-visible { outline: 2px solid #e8c97a; outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) {
      .gold-shimmer, .fade-up { animation: none !important; }
      * { animation-duration: .01s !important; transition-duration: .01s !important; }
    }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 3px; }
  `}</style>
);

const Stars = () => {
  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    left: Math.random() * 100, top: Math.random() * 100,
    size: Math.random() * 1.8 + 0.6, delay: Math.random() * 6, dur: 3 + Math.random() * 5,
  })), []);
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: i % 7 === 0 ? T.goldHi : "#cfd6ea",
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
};

const Btn = ({ children, onClick, kind = "gold", style, disabled, small }) => {
  const base = {
    fontFamily: "'DM Sans', sans-serif", cursor: disabled ? "default" : "pointer",
    border: "none", borderRadius: 30, fontSize: small ? 13 : 15,
    padding: small ? "8px 18px" : "13px 30px", letterSpacing: ".04em",
    transition: "transform .15s ease, opacity .15s ease", opacity: disabled ? 0.5 : 1,
  };
  const kinds = {
    gold: { background: `linear-gradient(120deg, ${T.gold}, ${T.goldHi})`, color: "#1a1408", fontWeight: 500, boxShadow: "0 4px 18px rgba(201,168,76,.3)" },
    ghost: { background: "rgba(233,230,242,0.06)", color: T.ink, border: "1px solid rgba(233,230,242,0.16)" },
    violet: { background: "rgba(184,152,232,0.14)", color: T.violet, border: `1px solid ${T.violet}55` },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...kinds[kind], ...style }}>{children}</button>;
};

const Panel = ({ children, style, onClick, hover }) => (
  <div onClick={onClick} className={hover ? "lum-card-hover" : ""} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    style={{
      background: `linear-gradient(160deg, ${T.card}, ${T.card2})`, borderRadius: 18,
      border: "1px solid rgba(201,168,76,0.14)", padding: 20, cursor: onClick ? "pointer" : "default", ...style,
    }}>{children}</div>
);

const Eyebrow = ({ children, colour = T.gold }) => (
  <div className="lum-sans" style={{ fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: colour, marginBottom: 8 }}>{children}</div>
);

const H = ({ children, size = 30, style }) => (
  <h2 className="lum-serif" style={{ fontSize: size, fontWeight: 500, margin: "0 0 6px", color: T.ink, lineHeight: 1.15, ...style }}>{children}</h2>
);

const LockTag = () => (
  <span className="lum-sans" style={{ fontSize: 10, letterSpacing: ".14em", color: T.goldHi, border: `1px solid ${T.gold}66`, borderRadius: 12, padding: "3px 9px", textTransform: "uppercase" }}>🔒 Illuminate</span>
);

const Back = ({ onClick, label = "Back" }) => (
  <button onClick={onClick} className="lum-sans" style={{ background: "none", border: "none", color: T.dim, fontSize: 13, cursor: "pointer", padding: "6px 0", letterSpacing: ".06em", marginBottom: 6 }}>← {label}</button>
);

const Channeling = ({ text = "Channeling your reading…" }) => (
  <div style={{ textAlign: "center", padding: "44px 20px" }}>
    <div style={{
      width: 54, height: 54, borderRadius: "50%", margin: "0 auto 18px",
      background: `radial-gradient(circle at 35% 30%, ${T.goldHi}, ${T.gold} 55%, #7a6128)`,
      animation: "orbBreath 2.6s ease-in-out infinite",
    }} />
    <div className="lum-serif" style={{ color: T.goldHi, fontSize: 20, fontStyle: "italic" }}>{text}</div>
    <div className="lum-sans" style={{ color: T.faint, fontSize: 12, marginTop: 8 }}>Held in golden light, for the highest good of all</div>
  </div>
);

const ReadingText = ({ text }) => (
  <div className="lum-sans fade-up" style={{ color: T.ink, fontSize: 15, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
    {text.split(/\n{2,}/).map((p, i) => <p key={i} style={{ margin: "0 0 16px" }}>{p.replace(/^#+\s*/gm, "")}</p>)}
  </div>
);

/* ---------------- Tarot card visual ---------------- */
const TarotCard = ({ card, deck, label, delay = 0, w = 108 }) => (
  <div style={{ textAlign: "center", animation: `cardIn .8s ease ${delay}s both`, perspective: 600 }}>
    <div style={{
      width: w, height: w * 1.62, margin: "0 auto", borderRadius: 12,
      background: `linear-gradient(165deg, ${deck.g1}, ${deck.g2})`,
      border: `1.5px solid ${deck.frame}99`, boxShadow: `0 10px 28px rgba(0,0,0,.55), 0 0 18px ${deck.frame}22`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      padding: "12px 8px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 5, borderRadius: 8, border: `1px solid ${deck.frame}40` }} />
      <div className="lum-serif" style={{ fontSize: 11, color: deck.frame, letterSpacing: ".1em" }}>✧</div>
      <div style={{ fontSize: w * 0.34, filter: "drop-shadow(0 0 12px rgba(245,227,168,.35))" }}>{card.glyph}</div>
      <div className="lum-serif" style={{ fontSize: Math.max(11, w * 0.105), color: T.ink, lineHeight: 1.2, padding: "0 2px" }}>{card.name}</div>
    </div>
    {label && <div className="lum-sans" style={{ fontSize: 11, color: T.gold, marginTop: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</div>}
  </div>
);

/* ============================================================
   SACRED SPACE RITUAL
   ============================================================ */
const PROTECTION_PRAYER = "Archangel Michael, surround this space in pure golden light. May only messages of love, truth, and highest good come through. This reading is held in pure intent, for the highest good of all.";

/* --- gentle spoken voice (device voices in preview; a recorded soft
       human voice replaces this at launch).
       Long texts are spoken in small pieces, chained one after another with
       breathing pauses — this sidesteps the browser bug where speech
       silently dies on long passages, and gives a slower, softer cadence. --- */
const pickVoice = () => {
  try {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find((v) => /karen|samantha|victoria|moira|tessa|zira|aria|jenny|libby|sonia|natasha|female/i.test(v.name) && v.lang.startsWith("en"))
      || voices.find((v) => v.lang.startsWith("en")) || null;
  } catch (e) { return null; }
};
let _speakCtl = null;
const stopSpeaking = () => {
  if (_speakCtl) { _speakCtl.cancel(); _speakCtl = null; }
  try { window.speechSynthesis.cancel(); } catch (e) {}
};
const speakLong = (text, { rate = 0.82, gap = 380 } = {}, onDone) => {
  const synth = window.speechSynthesis;
  if (!synth) return null;
  stopSpeaking();
  const clean = text.replace(/[#*_]/g, "").replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?\u2026]+[.!?\u2026]*/g) || [clean];
  const pieces = []; let cur = "";
  sentences.forEach((s) => {
    if ((cur + s).length > 170 && cur) { pieces.push(cur.trim()); cur = s; }
    else cur += s;
  });
  if (cur.trim()) pieces.push(cur.trim());
  let i = 0, cancelled = false;
  const v = pickVoice();
  const keep = setInterval(() => { try { if (synth.speaking && !synth.paused) { synth.pause(); synth.resume(); } } catch (e) {} }, 9000);
  const finish = () => { clearInterval(keep); if (!cancelled && onDone) onDone(); };
  const next = () => {
    if (cancelled) return;
    if (i >= pieces.length) return finish();
    const u = new SpeechSynthesisUtterance(pieces[i++]);
    if (v) u.voice = v;
    u.rate = rate; u.pitch = 1.02; u.volume = 1;
    u.onend = () => setTimeout(next, gap);
    u.onerror = () => setTimeout(next, 120);
    try { synth.speak(u); } catch (e) { finish(); }
  };
  next();
  const ctl = { cancel: () => { cancelled = true; clearInterval(keep); try { synth.cancel(); } catch (e) {} } };
  _speakCtl = ctl;
  return ctl;
};
if (typeof window !== "undefined" && window.speechSynthesis) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { try { window.speechSynthesis.getVoices(); } catch (e) {} };
  } catch (e) {}
}

const SpeakBtn = ({ text, colour = T.goldHi, slow, label = "🕊 Hear it spoken softly", onStart, onStop }) => {
  const [on, setOn] = useState(false);
  const ctl = useRef(null);
  useEffect(() => () => { ctl.current && ctl.current.cancel(); }, []);
  const toggle = () => {
    if (on) { ctl.current && ctl.current.cancel(); setOn(false); onStop && onStop(); return; }
    const c = speakLong(text, slow ? { rate: 0.74, gap: 950 } : {}, () => { setOn(false); onStop && onStop(); });
    if (c) { ctl.current = c; setOn(true); onStart && onStart(); }
  };
  return (
    <button onClick={toggle} className="lum-sans" style={{ background: "none", border: `1px solid ${colour}55`, color: colour, borderRadius: 18, padding: "7px 16px", fontSize: 12, cursor: "pointer", letterSpacing: ".05em" }}>
      {on ? "◼ Rest the voice" : label}
    </button>
  );
};

/* --- THE ORACLE ORB: pure golden light, visibly radiating — slowly
       turning rays, expanding rings, a glistening sweep across the
       surface, and sparks of light drifting outward. Soft, but alive. --- */
const OracleOrb = ({ size = 150, tint = "#e8c97a", onClick, label }) => {
  const sparks = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + Math.random() * 0.5;
    const d = size * (0.75 + Math.random() * 0.55);
    return { tx: Math.cos(a) * d, ty: Math.sin(a) * d, delay: Math.random() * 6, dur: 4 + Math.random() * 4, s: 2 + Math.random() * 2.5 };
  }), [size]);
  const wrap = size * 2.3;
  const mask = "radial-gradient(circle, transparent 28%, black 40%, transparent 74%)";
  const body = (
    <div style={{ position: "relative", width: wrap, height: wrap, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, rgba(232,201,122,0.16) 0deg 5deg, transparent 5deg 21deg)", WebkitMaskImage: mask, maskImage: mask, animation: "orbRays 55s linear infinite" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "repeating-conic-gradient(from 9deg, rgba(245,227,168,0.09) 0deg 3deg, transparent 3deg 29deg)", WebkitMaskImage: mask, maskImage: mask, animation: "orbRaysRev 80s linear infinite" }} />
      {[0, 1, 2].map((i) => (
        <div key={i} aria-hidden style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(232,201,122,0.35)", animation: `orbRing 6.5s ease-out ${i * 2.2}s infinite` }} />
      ))}
      {sparks.map((s, i) => (
        <div key={i} aria-hidden style={{
          position: "absolute", width: s.s, height: s.s, borderRadius: "50%", background: "#f5e3a8",
          boxShadow: "0 0 6px 1px rgba(245,227,168,.8)",
          "--tx": `${s.tx}px`, "--ty": `${s.ty}px`,
          animation: `sparkleDrift ${s.dur}s ease-out ${s.delay}s infinite`,
        }} />
      ))}
      <div style={{
        width: size, height: size, borderRadius: "50%", position: "relative", overflow: "hidden",
        background: `radial-gradient(circle at 35% 30%, #fdf3cf, ${tint} 42%, ${T.gold} 72%, #5e4a1d)`,
        animation: "orbBreath 5s ease-in-out infinite",
      }}>
        <div aria-hidden style={{ position: "absolute", inset: -size * 0.2, background: "linear-gradient(115deg, transparent 42%, rgba(255,250,228,.55) 50%, transparent 58%)", animation: "glisten 7s ease-in-out infinite" }} />
      </div>
    </div>
  );
  if (!onClick) return body;
  return (
    <button onClick={onClick} aria-label={label} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      {body}
      {label && <div className="lum-sans" style={{ color: T.faint, fontSize: 11.5, letterSpacing: ".18em", marginTop: 4, textTransform: "uppercase" }}>{label}</div>}
    </button>
  );
};

/* --- a luminous angel figure, tinted to each Archangel's colour
       (placeholder line-art; painted artwork ships at launch) --- */
const AngelFigure = ({ colour, size = 46 }) => {
  const id = "ag" + colour.replace("#", "");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ flexShrink: 0, transition: "width .3s, height .3s" }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={colour} stopOpacity="0.5" />
          <stop offset="100%" stopColor={colour} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="48" r="40" fill={`url(#${id})`} />
      <path d="M47 58 C36 36, 17 31, 7 46 C19 45, 31 51, 44 66 Z" fill={colour} opacity="0.4" stroke={colour} strokeOpacity="0.8" strokeWidth="1" />
      <path d="M53 58 C64 36, 83 31, 93 46 C81 45, 69 51, 56 66 Z" fill={colour} opacity="0.4" stroke={colour} strokeOpacity="0.8" strokeWidth="1" />
      <ellipse cx="50" cy="19" rx="11" ry="3.4" fill="none" stroke="#e8c97a" strokeWidth="1.6" opacity="0.9" />
      <circle cx="50" cy="31" r="7.5" fill="#f2ecdf" opacity="0.92" />
      <path d="M50 40 C58 50 61 64 57 82 C52 88 48 88 43 82 C39 64 42 50 50 40 Z" fill="#f2ecdf" opacity="0.55" stroke={colour} strokeOpacity="0.7" strokeWidth="1" />
    </svg>
  );
};

const SacredGate = ({ onReady, first }) => (
  <div className="fade-up" style={{
    position: "fixed", inset: 0, zIndex: 90, background: "rgba(8,8,18,0.96)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflowY: "auto",
  }}>
    <div style={{ maxWidth: 440, textAlign: "center" }}>
      <OracleOrb size={104} />
      <Eyebrow>Sacred Space</Eyebrow>
      <H size={32}>Before we begin</H>
      <p className="lum-serif" style={{ color: T.ink, fontSize: 19, lineHeight: 1.7, fontStyle: "italic", margin: "16px 0 18px" }}>
        “{PROTECTION_PRAYER}”
      </p>
      <div style={{ marginBottom: 22 }}><SpeakBtn text={PROTECTION_PRAYER} /></div>
      <Btn onClick={() => { stopSpeaking(); onReady(); }}>I am ready</Btn>
      {first && <div className="lum-sans" style={{ color: T.faint, fontSize: 12, marginTop: 18 }}>Luminae is a sacred space. Every reading opens in protection.</div>}
    </div>
  </div>
);

/* ============================================================
   TAROT
   ============================================================ */
const TarotScreen = ({ paid, deckId, setDeckId, requestRitual, askUpgrade, onAfterReading }) => {
  const [stage, setStage] = useState("spreads"); // spreads | decks | intention | reading
  const [spread, setSpread] = useState(null);
  const [intention, setIntention] = useState("");
  const [drawn, setDrawn] = useState([]);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const deck = DECKS.find((d) => d.id === deckId);

  const begin = (sp) => {
    if (!sp.free && !paid) return askUpgrade("Unlock every spread — from Yes/No to the full Celtic Cross.");
    setSpread(sp); setIntention(""); setStage("intention");
  };

  const draw = () => {
    requestRitual(async () => {
      const shuffled = [...FULL_DECK].sort(() => Math.random() - 0.5);
      const cards = shuffled.slice(0, spread.cards);
      setDrawn(cards); setReading(""); setErr(""); setStage("reading"); setLoading(true);
      try {
        const desc = cards.map((c, i) => `${spread.pos[i]}: ${c.name} (themes: ${c.keys})`).join("\n");
        const text = await askLuminae(
          `Give a tarot reading for the "${spread.name}" spread.\nSeeker's intention: "${intention || "an open heart, no specific question"}"\nCards drawn:\n${desc}\n\nWeave the cards together into one flowing reading that speaks to each position and closes with a gentle blessing or invitation.`
        );
        setReading(text);
      } catch (e) {
        setErr("The channel is quiet right now, beloved. Sit with the cards above — their themes are shown beneath each one — and try again in a moment.");
      }
      setLoading(false);
      onAfterReading();
    });
  };

  if (stage === "decks") return (
    <div className="fade-up">
      <Back onClick={() => setStage("spreads")} />
      <Eyebrow>Your Deck</Eyebrow>
      <H>Choose your companion</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14, marginBottom: 20 }}>All artwork is original to Luminae. Switch any time.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {DECKS.map((d) => {
          const locked = !d.free && !paid;
          const active = d.id === deckId;
          return (
            <Panel key={d.id} hover onClick={() => locked ? askUpgrade(`The ${d.name} deck awaits in Illuminate.`) : setDeckId(d.id)}
              style={{ padding: 14, border: active ? `1.5px solid ${T.goldHi}` : `1px solid ${d.frame}33`, opacity: locked ? 0.78 : 1 }}>
              <div style={{ height: 86, borderRadius: 10, background: `linear-gradient(150deg, ${d.g1}, ${d.g2})`, border: `1px solid ${d.frame}66`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <span className="lum-serif" style={{ color: d.frame, fontSize: 26 }}>✧ ✦ ✧</span>
              </div>
              <div className="lum-serif" style={{ fontSize: 18, color: T.ink }}>{d.name} {active && <span style={{ color: T.goldHi, fontSize: 13 }}>· chosen</span>}</div>
              <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, margin: "4px 0 8px", lineHeight: 1.45 }}>{d.desc}</div>
              {locked ? <LockTag /> : <span className="lum-sans" style={{ fontSize: 10, color: T.sage, letterSpacing: ".12em" }}>FREE</span>}
            </Panel>
          );
        })}
      </div>
    </div>
  );

  if (stage === "intention") return (
    <div className="fade-up" style={{ maxWidth: 460 }}>
      <Back onClick={() => setStage("spreads")} />
      <Eyebrow>{spread.name}</Eyebrow>
      <H>Set your intention</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14, lineHeight: 1.7 }}>{spread.note} Hold your question gently in your heart, or simply remain open.</p>
      {spread.deep && <p className="lum-serif" style={{ color: T.rose, fontStyle: "italic", fontSize: 16 }}>This is a powerful spread — save it for important moments.</p>}
      <textarea value={intention} onChange={(e) => setIntention(e.target.value)} rows={3} placeholder="What is on your heart? (optional)"
        className="lum-sans" style={{ width: "100%", background: T.card2, border: "1px solid rgba(201,168,76,.25)", borderRadius: 12, color: T.ink, padding: 14, fontSize: 14, resize: "vertical", marginTop: 14 }} />
      <div style={{ marginTop: 18 }}><Btn onClick={draw}>Enter the reading ✧</Btn></div>
    </div>
  );

  if (stage === "reading") return (
    <div className="fade-up">
      <Back onClick={() => setStage("spreads")} label="New reading" />
      <Eyebrow>{spread.name}</Eyebrow>
      {intention && <p className="lum-serif" style={{ color: T.moon, fontStyle: "italic", fontSize: 16, margin: "0 0 18px" }}>“{intention}”</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", margin: "10px 0 26px" }}>
        {drawn.map((c, i) => <TarotCard key={i} card={c} deck={deck} label={spread.pos[i]} delay={i * 0.25} w={drawn.length > 5 ? 84 : 104} />)}
      </div>
      {loading ? <Channeling /> : err ? (
        <Panel style={{ borderColor: T.rose + "55" }}>
          <p className="lum-sans" style={{ color: T.ink, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{err}</p>
          <div style={{ marginTop: 12 }}>{drawn.map((c, i) => <div key={i} className="lum-sans" style={{ color: T.dim, fontSize: 13, margin: "4px 0" }}><b style={{ color: T.gold }}>{spread.pos[i]}</b> · {c.name} — {c.keys}</div>)}</div>
        </Panel>
      ) : <Panel style={{ padding: 26 }}><ReadingText text={reading} /></Panel>}
    </div>
  );

  return (
    <div className="fade-up">
      <Eyebrow>Tarot</Eyebrow>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
        <H>The cards await</H>
        <Btn kind="ghost" small onClick={() => setStage("decks")}>Deck: {deck.name} ✧</Btn>
      </div>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14, marginBottom: 20 }}>Choose a spread, beloved seeker.</p>
      <div style={{ display: "grid", gap: 12 }}>
        {SPREADS.map((sp) => (
          <Panel key={sp.id} hover onClick={() => begin(sp)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <div>
              <div className="lum-serif" style={{ fontSize: 20, color: T.ink }}>{sp.name}</div>
              <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, marginTop: 3 }}>{sp.cards} card{sp.cards > 1 ? "s" : ""} · {sp.note}</div>
            </div>
            {!sp.free && !paid ? <LockTag /> : <span style={{ color: T.gold, fontSize: 18 }}>→</span>}
          </Panel>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   ASTROLOGY
   ============================================================ */
const AstrologyScreen = ({ paid, askUpgrade, birth, setBirth }) => {
  const [tab, setTab] = useState("weekly");
  const [out, setOut] = useState(""); const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const sign = birth.dob ? sunSign(Number(birth.dob.slice(5, 7)), Number(birth.dob.slice(8, 10))) : null;

  const run = async (prompt, sys = "") => {
    setOut(""); setErr(""); setLoading(true);
    try { setOut(await askLuminae(prompt, sys)); } catch (e) { setErr("The stars are quiet for a moment, beloved. Please try again."); }
    setLoading(false);
  };

  const weekly = () => {
    if (!sign) return;
    run(`Write this week's horoscope for ${sign.name}. Current moon phase: ${moonPhase().name}. Include the week's energy theme, a gentle area of focus, and one intention suggestion. Today is ${new Date().toDateString()}.`);
  };
  const natal = () => {
    if (!paid) return askUpgrade("Your full natal chart reading lives in Illuminate.");
    run(`Create a personalised natal energy portrait for a seeker born ${birth.dob} at ${birth.time || "an unknown time"} in ${birth.place || "an unknown place"}. Sun sign: ${sign.name}. Speak to their core essence, emotional nature, gifts, and soul lessons. Include this week's energy theme, favourable days, days to move gently, a weekly intention, and one recommended sound frequency or meditation. Note gently that exact planetary placements deepen with a precise birth time.`);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Eyebrow colour={T.violet}>Astrology</Eyebrow>
      <H>Written in the stars</H>
      <Panel style={{ margin: "16px 0", padding: 18 }}>
        <div className="lum-sans" style={{ fontSize: 12, color: T.dim, marginBottom: 10, letterSpacing: ".08em" }}>YOUR BIRTH DETAILS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input type="date" value={birth.dob} onChange={(e) => setBirth({ ...birth, dob: e.target.value })} className="lum-sans" style={inp} aria-label="Date of birth" />
          <input type="time" value={birth.time} onChange={(e) => setBirth({ ...birth, time: e.target.value })} className="lum-sans" style={inp} aria-label="Time of birth" />
          <input placeholder="Place of birth" value={birth.place} onChange={(e) => setBirth({ ...birth, place: e.target.value })} className="lum-sans" style={{ ...inp, gridColumn: "1 / -1" }} />
        </div>
        {sign && <div className="lum-serif" style={{ color: T.goldHi, fontSize: 20, marginTop: 12 }}>{sign.glyph} {sign.name} Sun · {moonPhase().icon} {moonPhase().name} now</div>}
      </Panel>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <Btn small kind={tab === "weekly" ? "gold" : "ghost"} onClick={() => { setTab("weekly"); setOut(""); }}>Weekly Horoscope · Free</Btn>
        <Btn small kind={tab === "natal" ? "gold" : "ghost"} onClick={() => { setTab("natal"); setOut(""); }}>Natal Chart Reading {!paid && "🔒"}</Btn>
      </div>
      {!sign ? <p className="lum-sans" style={{ color: T.faint, fontSize: 14 }}>Enter your date of birth to begin, beloved.</p> :
        !out && !loading && !err && <Btn onClick={tab === "weekly" ? weekly : natal}>{tab === "weekly" ? "Reveal my week ✧" : "Open my chart ✧"}</Btn>}
      {loading && <Channeling text="Reading the heavens…" />}
      {err && <p className="lum-sans" style={{ color: T.rose, fontSize: 14 }}>{err}</p>}
      {out && <Panel style={{ padding: 26, marginTop: 8 }}><ReadingText text={out} /></Panel>}
      {tab === "natal" && paid && <p className="lum-sans" style={{ color: T.faint, fontSize: 11.5, marginTop: 14 }}>Production note: precise planetary placements will use ephemeris data (AstrologyAPI) at launch.</p>}
    </div>
  );
};
const inp = { background: "#141428", border: "1px solid rgba(201,168,76,.25)", borderRadius: 10, color: "#e9e6f2", padding: "11px 13px", fontSize: 14, width: "100%", colorScheme: "dark" };

/* ============================================================
   NUMEROLOGY
   ============================================================ */
const NumerologyScreen = ({ paid, askUpgrade, birth, setBirth }) => {
  const [name, setName] = useState("");
  const [nums, setNums] = useState(null);
  const [out, setOut] = useState(""); const [loading, setLoading] = useState(false);

  const calc = async () => {
    if (!paid) return askUpgrade("Your full numerology profile lives in Illuminate.");
    if (!birth.dob || !name.trim()) return;
    const [y, m, d] = birth.dob.split("-").map(Number);
    const profile = {
      "Life Path": lifePath(y, m, d), "Destiny": sumName(name), "Soul Urge": sumName(name, "v"),
      "Personality": sumName(name, "c"), "Expression": sumName(name), "Personal Year": personalYear(m, d),
    };
    setNums(profile); setOut(""); setLoading(true);
    try {
      setOut(await askLuminae(`Write a personalised numerology reading for a seeker named ${name}, born ${birth.dob}. Their numbers: ${Object.entries(profile).map(([k, v]) => `${k} ${v}`).join(", ")}. Explain each number in plain, warm language (no assumed prior knowledge), beginning with the Life Path as the most important. Weave them into one portrait of who they are becoming.`));
    } catch (e) { setOut("The numbers are shown above, beloved — the written reading will return in a moment. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Eyebrow colour={T.teal}>Numerology</Eyebrow>
      <H>The language of numbers</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14 }}>Your full birth name and birthdate hold a sacred blueprint.</p>
      <Panel style={{ margin: "16px 0", padding: 18, display: "grid", gap: 10 }}>
        <input placeholder="Full birth name" value={name} onChange={(e) => setName(e.target.value)} className="lum-sans" style={inp} />
        <input type="date" value={birth.dob} onChange={(e) => setBirth({ ...birth, dob: e.target.value })} className="lum-sans" style={inp} aria-label="Date of birth" />
        <Btn onClick={calc} disabled={!name.trim() || !birth.dob}>Reveal my numbers ✧ {!paid && "🔒"}</Btn>
      </Panel>
      {nums && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
          {Object.entries(nums).map(([k, v]) => (
            <Panel key={k} style={{ textAlign: "center", padding: 14 }}>
              <div className="lum-serif gold-shimmer" style={{ fontSize: 34, fontWeight: 600 }}>{v}</div>
              <div className="lum-sans" style={{ fontSize: 10.5, color: T.dim, letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>{k}</div>
            </Panel>
          ))}
        </div>
      )}
      {loading && <Channeling text="Reading your blueprint…" />}
      {out && <Panel style={{ padding: 26 }}><ReadingText text={out} /></Panel>}
    </div>
  );
};

/* ============================================================
   ANGEL REALM
   ============================================================ */
const AngelScreen = ({ paid, askUpgrade }) => {
  const [num, setNum] = useState("");
  const [lookup, setLookup] = useState(null);
  const [personal, setPersonal] = useState(""); const [loadingP, setLoadingP] = useState(false);
  const [angel, setAngel] = useState(null);
  const [msg, setMsg] = useState(""); const [loadingA, setLoadingA] = useState(false);
  const [michael, setMichael] = useState(false);

  const find = () => {
    const clean = num.replace(/\D/g, "");
    setPersonal("");
    setLookup({ n: clean, meaning: ANGEL_NUMBERS[clean] || null });
  };
  const personalise = async () => {
    if (!paid) return askUpgrade("Personalised angel number readings live in Illuminate.");
    setLoadingP(true);
    try {
      setPersonal(await askLuminae(`A seeker keeps seeing the angel number ${lookup.n}. General meaning: ${lookup.meaning || "an uncommon sequence — interpret it through numerology"}. Write a short (150-200 word) personal message from their angels about why this number is appearing for them right now, and one gentle action to take.`));
    } catch (e) { setPersonal("The angels are near even when the words pause. Please try again in a moment."); }
    setLoadingP(false);
  };
  const dailyMessage = async (a) => {
    setAngel(a); setMsg("");
    if (!paid) return askUpgrade("Daily channelled Archangel messages live in Illuminate.");
    setLoadingA(true);
    try {
      setMsg(await askLuminae(`Channel today's short message (120-160 words) from ${a.name}, the archangel of ${a.domain}. Today is ${new Date().toDateString()}. End with their invocation feeling woven in naturally.`));
    } catch (e) { setMsg(a.invocation); }
    setLoadingA(false);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 600 }}>
      <Eyebrow>Angel Realm</Eyebrow>
      <H>You are never alone</H>

      <Panel style={{ margin: "16px 0", padding: 18, borderColor: "#3b6fd455", background: "linear-gradient(160deg, #16203a, #10101f)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div className="lum-serif" style={{ fontSize: 20, color: "#9cb8ee" }}>🛡️ Call on Michael</div>
            <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim }}>For moments of fear or overwhelm — protection is one breath away.</div>
          </div>
          <Btn small kind="ghost" onClick={() => setMichael(!michael)} style={{ borderColor: "#3b6fd488", color: "#9cb8ee" }}>{michael ? "Amen ✧" : "Call now"}</Btn>
        </div>
        {michael && (
          <div className="fade-up" style={{ marginTop: 14 }}>
            <p className="lum-serif" style={{ color: T.ink, fontSize: 17, fontStyle: "italic", lineHeight: 1.7, margin: "0 0 12px" }}>“{ARCHANGELS[0].invocation}” Breathe. You are wrapped in blue flame. Nothing unloving may remain.</p>
            <SpeakBtn text={ARCHANGELS[0].invocation + " Breathe. You are wrapped in blue flame. Nothing unloving may remain."} colour="#9cb8ee" />
          </div>
        )}
      </Panel>

      <Panel style={{ marginBottom: 18, padding: 18 }}>
        <div className="lum-sans" style={{ fontSize: 12, color: T.gold, letterSpacing: ".14em", marginBottom: 10 }}>ANGEL NUMBER LOOKUP · FREE</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="e.g. 1111" inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value)} onKeyDown={(e) => e.key === "Enter" && find()} className="lum-sans" style={{ ...inp, flex: 1 }} />
          <Btn small onClick={find}>Reveal</Btn>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {["111", "444", "555", "777", "1111", "1212"].map((q) => (
            <button key={q} onClick={() => { setNum(q); setLookup({ n: q, meaning: ANGEL_NUMBERS[q] }); setPersonal(""); }} className="lum-sans" style={{ background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", color: T.goldHi, borderRadius: 16, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>{q}</button>
          ))}
        </div>
        {lookup && (
          <div className="fade-up" style={{ marginTop: 16 }}>
            <div className="lum-serif gold-shimmer" style={{ fontSize: 40, fontWeight: 600 }}>{lookup.n}</div>
            <p className="lum-serif" style={{ color: T.ink, fontSize: 17, fontStyle: "italic", lineHeight: 1.65, margin: "6px 0 12px" }}>
              {lookup.meaning || "An uncommon sequence — your angels speak to you in a language all your own. Ask for a personal reading below."}
            </p>
            {!personal && !loadingP && <Btn small kind="violet" onClick={personalise}>Why am I seeing this? {!paid && "🔒"}</Btn>}
            {loadingP && <div className="lum-serif" style={{ color: T.violet, fontStyle: "italic" }}>Listening to your angels…</div>}
            {personal && <Panel style={{ marginTop: 10, borderColor: T.violet + "44" }}><ReadingText text={personal} /></Panel>}
          </div>
        )}
      </Panel>

      <Eyebrow>The Archangels</Eyebrow>
      <div style={{ display: "grid", gap: 10 }}>
        {ARCHANGELS.map((a) => {
          const open = angel?.name === a.name;
          return (
            <Panel key={a.name} hover onClick={() => !open && dailyMessage(a)} style={{ padding: "14px 18px", borderColor: a.hex + "44" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <AngelFigure colour={a.hex} size={open ? 84 : 48} />
                <div style={{ flex: 1 }}>
                  <span className="lum-serif" style={{ fontSize: 18, color: T.ink }}>{a.name}</span>
                  <div className="lum-sans" style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{a.domain} · {a.colour} · {a.crystal}</div>
                </div>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: a.hex, boxShadow: `0 0 12px ${a.hex}`, flexShrink: 0 }} />
              </div>
              {open && (loadingA
                ? <div className="lum-serif" style={{ color: a.hex, fontStyle: "italic", marginTop: 10 }}>Channelling today's message…</div>
                : msg && (
                  <div className="fade-up" style={{ marginTop: 12 }}>
                    <p className="lum-serif" style={{ color: T.ink, fontSize: 15.5, fontStyle: "italic", lineHeight: 1.7, margin: "0 0 12px" }}>{msg}</p>
                    <SpeakBtn text={msg} colour={a.hex} />
                  </div>
                ))}
            </Panel>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   CRYSTAL GUIDE
   ============================================================ */
const CrystalScreen = ({ paid, askUpgrade }) => {
  const [mood, setMood] = useState(null);
  const [rec, setRec] = useState(""); const [loading, setLoading] = useState(false);
  const daily = CRYSTALS[new Date().getDate() % CRYSTALS.length];
  const MOODS = ["Anxious or unsettled", "Heavy-hearted", "Seeking clarity", "Calling in abundance", "Opening to love", "Needing protection"];

  const recommend = async (m) => {
    setMood(m); setRec("");
    if (!paid) return askUpgrade("Personalised crystal guidance lives in Illuminate.");
    setLoading(true);
    try {
      setRec(await askLuminae(`A seeker feels: "${m}". From this library — ${CRYSTALS.map((c) => c.name).join(", ")} — choose the one crystal they most need today. In 120-170 words, name it, why it is calling them, how to work with it today, and which solfeggio frequency pairs with it.`));
    } catch (e) { setRec("The stones are patient, beloved. Please ask again in a moment."); }
    setLoading(false);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 600 }}>
      <Eyebrow colour={T.sage}>Crystal Guide</Eyebrow>
      <H>Allies of the Earth</H>
      <Panel style={{ margin: "16px 0", padding: 20, borderColor: T.sage + "44" }}>
        <div className="lum-sans" style={{ fontSize: 11, color: T.sage, letterSpacing: ".18em", marginBottom: 6 }}>TODAY'S CRYSTAL</div>
        <div className="lum-serif" style={{ fontSize: 26, color: T.ink }}>💎 {daily.name}</div>
        <div className="lum-sans" style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.65, marginTop: 6 }}>{daily.use}</div>
        <div className="lum-sans" style={{ fontSize: 12, color: T.gold, marginTop: 8 }}>{daily.chakra} chakra · pairs beautifully with {daily.pair}</div>
      </Panel>
      <Panel style={{ marginBottom: 18, padding: 18 }}>
        <div className="lum-serif" style={{ fontSize: 19, color: T.ink, marginBottom: 10 }}>What crystal do I need today?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {MOODS.map((m) => (
            <button key={m} onClick={() => recommend(m)} className="lum-sans" style={{
              background: mood === m ? "rgba(142,201,160,.18)" : "rgba(233,230,242,.05)",
              border: `1px solid ${mood === m ? T.sage : "rgba(233,230,242,.15)"}`,
              color: mood === m ? T.sage : T.dim, borderRadius: 18, padding: "8px 15px", fontSize: 13, cursor: "pointer",
            }}>{m} {!paid && "🔒"}</button>
          ))}
        </div>
        {loading && <div className="lum-serif" style={{ color: T.sage, fontStyle: "italic", marginTop: 14 }}>Asking the stones…</div>}
        {rec && <div style={{ marginTop: 14 }}><ReadingText text={rec} /></div>}
      </Panel>
      <Eyebrow colour={T.sage}>The Library</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {CRYSTALS.map((c) => (
          <Panel key={c.name} style={{ padding: 14 }}>
            <div className="lum-serif" style={{ fontSize: 17, color: T.ink }}>{c.name}</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.55, margin: "4px 0" }}>{c.use}</div>
            <div className="lum-sans" style={{ fontSize: 10.5, color: T.gold }}>{c.chakra} · {c.pair}</div>
          </Panel>
        ))}
      </div>
      <p className="lum-sans" style={{ color: T.faint, fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>To cleanse: moonlight, selenite, sound, or smoke. To charge: sunlight (briefly), intention, or the full moon. {moonPhase().name === "Full Moon" ? "✨ The moon is full tonight — a perfect time to charge your stones." : ""}</p>
    </div>
  );
};

/* ============================================================
   SOUND SANCTUARY
   ============================================================ */
const SoundScreen = ({ paid, askUpgrade, engine }) => {
  const [playing, setPlaying] = useState(null);
  const [timer, setTimer] = useState(0);
  const [freePlays, setFreePlays] = useState(0);
  const [withMusic, setWithMusic] = useState(true);
  const [myTracks, setMyTracks] = useState([]);
  const [uploadErr, setUploadErr] = useState("");
  const [ownHarp, setOwnHarp] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [plPlaying, setPlPlaying] = useState(-1);
  const plRef = useRef([]); plRef.current = playlist;
  const plTimer = useRef(null);

  const resolve = (track) => (track.id === "harp" && ownHarp)
    ? { ...ownHarp, id: "harp", name: "Angelic Harp" }
    : track;
  const trigger = (track, music) => {
    const t = resolve(track);
    if (t.type === "buffer") engine.playBuffer(t.buffer, { music });
    else engine.play(t, { music });
  };
  const stopPlaylist = () => {
    clearTimeout(plTimer.current);
    setPlPlaying(-1); setPlaying(null); engine.stop();
  };
  const playPlaylistAt = (i) => {
    const list = plRef.current;
    if (i >= list.length) { stopPlaylist(); return; }
    const item = list[i];
    trigger(item, withMusic);
    setPlaying(item); setPlPlaying(i);
    clearTimeout(plTimer.current);
    plTimer.current = setTimeout(() => playPlaylistAt(i + 1), item.mins * 60000);
  };
  const addToPlaylist = (track) => {
    if (!paid) return askUpgrade("Playlists live in Illuminate — queue a whole bedtime journey.");
    setPlaylist((p) => [...p, { ...resolve(track), key: track.id + Date.now(), name: track.name, mins: 15 }]);
  };
  const cycleMins = (key) => setPlaylist((p) => p.map((it) => {
    if (it.key !== key) return it;
    const opts = [5, 10, 15, 30, 60];
    return { ...it, mins: opts[(opts.indexOf(it.mins) + 1) % opts.length] };
  }));
  useEffect(() => () => clearTimeout(plTimer.current), []);
  const play = (track, locked) => {
    if (locked) return askUpgrade("Unlock the full Sound Sanctuary — unlimited, ad-free, forever.");
    if (!paid && freePlays >= 3 && playing?.id !== track.id) return askUpgrade("You've enjoyed your 3 free tracks today. Illuminate is unlimited — everything you love, without the interruptions.");
    if (playing?.id === track.id) { engine.stop(); setPlaying(null); return; }
    trigger(track, withMusic);
    setPlaying(track);
    if (!paid) setFreePlays((n) => n + 1);
    if (timer) engine.setSleepTimer(timer, () => setPlaying(null));
  };
  const toggleMusic = () => {
    const next = !withMusic;
    setWithMusic(next);
    if (playing) trigger(playing, next); // re-weave live
  };
  const onUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadErr("");
    try {
      const buf = await file.arrayBuffer();
      const audio = await engine.decode(buf);
      setMyTracks((ts) => [...ts, {
        id: "own" + Date.now(), type: "buffer", buffer: audio,
        name: file.name.replace(/\.[^.]+$/, ""),
        desc: `${Math.max(1, Math.round(audio.duration / 60))} min · loops seamlessly, no audible seam`,
      }]);
    } catch (err) { setUploadErr("That file couldn't be read, beloved — MP3, WAV or OGG work best."); }
    e.target.value = "";
  };
  const chooseTimer = (mins) => {
    setTimer(mins);
    if (playing) engine.setSleepTimer(mins, () => setPlaying(null));
  };
  useEffect(() => () => { clearTimeout(plTimer.current); engine.stop(); }, [engine]);

  const Row = ({ track, locked, accent = T.gold }) => {
    const active = playing?.id === track.id;
    return (
      <Panel hover onClick={() => play(track, locked)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderColor: active ? accent : undefined, background: active ? `linear-gradient(160deg, ${T.card}, #1c1c38)` : undefined }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="lum-serif" style={{ fontSize: 17.5, color: active ? T.goldHi : T.ink }}>{track.name}</div>
          <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 2 }}>{track.desc}</div>
        </div>
        {locked ? <LockTag /> : (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={(e) => { e.stopPropagation(); addToPlaylist(track); }} aria-label={`Add ${track.name} to playlist`} className="lum-sans" style={{ background: "none", border: "1px solid rgba(233,230,242,.18)", color: T.dim, width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 15, lineHeight: 1 }}>＋</button>
            <div style={{ position: "relative", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {active && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid ${accent}`, animation: "pulseRing 1.8s ease-out infinite" }} />}
              <span style={{ color: accent, fontSize: 16 }}>{active ? "■" : "▶"}</span>
            </div>
          </div>
        )}
      </Panel>
    );
  };

  return (
    <div className="fade-up" style={{ maxWidth: 600 }}>
      <Eyebrow colour={T.teal}>Sound Sanctuary</Eyebrow>
      <H>Let the frequencies hold you</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14 }}>
        Live, pure tones generated in sacred ratios — no recordings, no ads, no interruptions.
        {!paid && <span style={{ color: T.gold }}> Free tier: 3 tracks per day ({3 - Math.min(freePlays, 3)} remaining).</span>}
      </p>
      {playlist.length > 0 && (
        <Panel style={{ margin: "14px 0", padding: 16, borderColor: T.goldHi + "55" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div className="lum-serif" style={{ fontSize: 19, color: T.goldHi }}>✧ Your Journey</div>
            <div style={{ display: "flex", gap: 6 }}>
              {plPlaying < 0
                ? <Btn small onClick={() => playPlaylistAt(0)}>▶ Begin</Btn>
                : <>
                    <Btn small kind="ghost" onClick={() => playPlaylistAt(plPlaying + 1)}>⏭ Next</Btn>
                    <Btn small kind="ghost" onClick={stopPlaylist}>◼ End</Btn>
                  </>}
            </div>
          </div>
          {playlist.map((it, i) => (
            <div key={it.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: i ? "1px solid rgba(233,230,242,.07)" : "none" }}>
              <span className="lum-sans" style={{ fontSize: 13.5, color: plPlaying === i ? T.goldHi : T.ink, flex: 1 }}>{plPlaying === i ? "✧ " : ""}{it.name}</span>
              <button onClick={() => cycleMins(it.key)} className="lum-sans" style={{ background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", color: T.goldHi, borderRadius: 13, padding: "3px 10px", fontSize: 11.5, cursor: "pointer" }}>{it.mins} min</button>
              <button onClick={() => setPlaylist((p) => p.filter((x) => x.key !== it.key))} aria-label="Remove" className="lum-sans" style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
          ))}
          <div className="lum-sans" style={{ fontSize: 11, color: T.faint, marginTop: 8 }}>Each step flows for its set minutes, then the next begins — tap ＋ on any track to add it.</div>
        </Panel>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "14px 0 22px", flexWrap: "wrap" }}>
        <span className="lum-sans" style={{ fontSize: 12, color: T.faint, letterSpacing: ".1em" }}>SLEEP TIMER</span>
        {[0, 30, 60, 480].map((m) => (
          <button key={m} onClick={() => chooseTimer(m)} className="lum-sans" style={{
            background: timer === m ? "rgba(127,212,224,.16)" : "rgba(233,230,242,.05)",
            border: `1px solid ${timer === m ? T.teal : "rgba(233,230,242,.14)"}`,
            color: timer === m ? T.teal : T.dim, borderRadius: 16, padding: "5px 13px", fontSize: 12, cursor: "pointer",
          }}>{m === 0 ? "Off" : m === 480 ? "All night" : `${m} min`}</button>
        ))}
      </div>
      <Eyebrow colour={T.teal}>Solfeggio Frequencies</Eyebrow>
      <Panel style={{ padding: "12px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: T.teal + "44" }}>
        <div>
          <div className="lum-sans" style={{ fontSize: 13.5, color: T.ink }}>Weave frequencies & music</div>
          <div className="lum-sans" style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>Tuned chords beneath frequencies · a hidden, barely-there frequency beneath music & your own tracks</div>
        </div>
        <button onClick={toggleMusic} role="switch" aria-checked={withMusic} style={{ width: 46, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: withMusic ? T.teal : "rgba(233,230,242,.15)", position: "relative", transition: "background .2s", flexShrink: 0, marginLeft: 12 }}>
          <span style={{ position: "absolute", top: 3, left: withMusic ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
        </button>
      </Panel>
      <div style={{ display: "grid", gap: 9, marginBottom: 24 }}>
        {SOLFEGGIO.map((s, i) => (
          <Row key={s.hz} accent={T.teal} locked={!paid && i > 2 && s.hz !== 528}
            track={{ id: `hz${s.hz}`, type: "tone", hz: s.hz, name: `${s.hz} Hz${s.hz === 528 ? " · The Love Frequency" : ""}`, desc: s.label }} />
        ))}
      </div>
      <Eyebrow colour={T.moon}>Nature</Eyebrow>
      <div style={{ display: "grid", gap: 9, marginBottom: 24 }}>
        {SOUNDSCAPES.map((s) => <Row key={s.id} accent={T.moon} track={s} locked={!s.free && !paid} />)}
      </div>
      <Eyebrow colour={T.gold}>Sacred Instruments</Eyebrow>
      <div style={{ display: "grid", gap: 9, marginBottom: 24 }}>
        {INSTRUMENTS.map((s) => {
          const t = s.id === "harp" && ownHarp ? { ...s, desc: `Your own recording · "${ownHarp.name}" ✦` } : s;
          return <Row key={s.id} accent={T.gold} track={t} locked={!s.free && !paid} />;
        })}
      </div>
      <Eyebrow colour={T.violet}>Layered Combinations</Eyebrow>
      <div style={{ display: "grid", gap: 9, marginBottom: 24 }}>
        {LAYERS.map((l) => <Row key={l.id} accent={T.violet} track={{ ...l, type: "layer" }} locked={!paid} />)}
      </div>
      <Eyebrow colour={T.rose}>Your Own Tracks</Eyebrow>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 13, lineHeight: 1.65, margin: "0 0 12px" }}>
        Made a tune in another app, or licensed one you love? Bring it in. It will loop with a gentle crossfade — no audible seam — and the weave toggle above carries a hidden 528 Hz beneath it.
      </p>
      <div style={{ display: "grid", gap: 9, marginBottom: 12 }}>
        {myTracks.map((t) => (
          <div key={t.id}>
            <Row accent={T.rose} track={t} locked={false} />
            <button onClick={() => setOwnHarp(ownHarp?.id === t.id ? null : t)} className="lum-sans" style={{ background: "none", border: "none", color: ownHarp?.id === t.id ? T.goldHi : T.faint, fontSize: 11.5, cursor: "pointer", padding: "5px 4px 0", letterSpacing: ".04em" }}>
              {ownHarp?.id === t.id ? "★ This is your Angelic Harp — tap to restore the built-in" : "☆ Use this as the app's Angelic Harp"}
            </button>
          </div>
        ))}
      </div>
      <label style={{ cursor: "pointer" }}>
        <input type="file" accept="audio/*" onChange={onUpload} style={{ display: "none" }} />
        <span className="lum-sans" style={{ background: "rgba(192,123,138,.14)", border: `1px solid ${T.rose}66`, color: T.rose, borderRadius: 20, padding: "10px 22px", fontSize: 13, display: "inline-block" }}>＋ Add a track</span>
      </label>
      {uploadErr && <p className="lum-sans" style={{ color: T.rose, fontSize: 12.5, marginTop: 10 }}>{uploadErr}</p>}
      <p className="lum-sans" style={{ color: T.faint, fontSize: 11, marginTop: 10 }}>Preview note: tracks live for this session only — at launch they upload to your library and stay.</p>
      <p className="lum-sans" style={{ color: T.faint, fontSize: 11.5, marginTop: 16 }}>Production note: cedar flute, shamanic drum & full recordings ship as hosted audio at launch. These live-generated tones are real and yours to enjoy now — headphones recommended, volume low and gentle.</p>
    </div>
  );
};

/* ============================================================
   MEDITATION
   ============================================================ */
const MeditationScreen = ({ paid, askUpgrade, engine }) => {
  const [open, setOpen] = useState(null);
  const [script, setScript] = useState(""); const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState(true);
  useEffect(() => () => { stopSpeaking(); engine.stop(); }, [engine]);

  const begin = async (m) => {
    if (!m.free && !paid) return askUpgrade("The full meditation library lives in Illuminate.");
    setOpen(m); setScript(""); setLoading(true);
    try {
      setScript(await askLuminae(`Write the opening 5 minutes of the guided meditation "${m.name}" (${m.note}). Write it as it would be spoken — slow, spacious, line breaks between phrases, ellipses for pauses. ${m.name.includes("Violet Flame") ? "Honour Saint Germain's violet flame with reverence — it transmutes dense, heavy energy into light." : ""}`));
    } catch (e) { setScript("Close your eyes, beloved…\n\nBreathe in golden light…\n\nAnd breathe out everything that is not yours to carry.\n\n(The full guided voice will return in a moment — please try again.)"); }
    setLoading(false);
  };

  if (open) return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Back onClick={() => { stopSpeaking(); engine.stop(); setOpen(null); }} label="Library" />
      <Eyebrow colour={T.violet}>{open.mins} minute practice</Eyebrow>
      <H>{open.name}</H>
      {loading ? <Channeling text="Preparing your practice…" /> : (
        <>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "10px 0 16px" }}>
            <SpeakBtn slow text={script} colour={T.violet} label="🕊 Begin spoken practice"
              onStart={() => { if (bg) engine.play({ id: "medbg", type: "layer", parts: ["pad"] }); }}
              onStop={() => engine.stop()} />
            <button onClick={() => setBg(!bg)} className="lum-sans" style={{ background: bg ? "rgba(184,152,232,.14)" : "rgba(233,230,242,.05)", border: `1px solid ${bg ? T.violet : "rgba(233,230,242,.15)"}`, color: bg ? T.violet : T.dim, borderRadius: 18, padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>
              {bg ? "♫ gentle music behind the voice" : "♫ voice alone"}
            </button>
          </div>
          <Panel style={{ padding: 28, borderColor: T.violet + "44" }}>
            <div className="lum-serif" style={{ color: T.ink, fontSize: 19, lineHeight: 2.1, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{script}</div>
          </Panel>
        </>
      )}
      <p className="lum-sans" style={{ color: T.faint, fontSize: 11.5, marginTop: 14 }}>The spoken voice is your device's in this preview — full-length recordings in a soft human voice ship at launch.</p>
    </div>
  );

  return (
    <div className="fade-up" style={{ maxWidth: 600 }}>
      <Eyebrow colour={T.violet}>Guided Meditation</Eyebrow>
      <H>Come home to yourself</H>
      <Panel style={{ margin: "16px 0", padding: 18, borderColor: T.violet + "55", background: "linear-gradient(160deg, #1d1438, #121022)" }}>
        <div className="lum-serif" style={{ fontSize: 19, color: T.violet }}>🔥 The Violet Flame</div>
        <p className="lum-sans" style={{ fontSize: 13, color: T.dim, lineHeight: 1.7, margin: "6px 0 0" }}>Saint Germain's sacred transmutation flame transforms dense, heavy energy into light. Powerful for soul clearing, karma release, and energetic renewal.</p>
      </Panel>
      <div style={{ display: "grid", gap: 10 }}>
        {MEDITATIONS.map((m) => (
          <Panel key={m.name} hover onClick={() => begin(m)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
            <div>
              <div className="lum-serif" style={{ fontSize: 18, color: T.ink }}>{m.name}</div>
              <div className="lum-sans" style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{m.mins} min · {m.note}</div>
            </div>
            {!m.free && !paid ? <LockTag /> : <span style={{ color: T.violet }}>→</span>}
          </Panel>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   DREAM JOURNAL (conversational)
   ============================================================ */
const DreamScreen = ({ paid, askUpgrade, journal, setJournal }) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs, loading]);

  const send = async () => {
    if (!paid) return askUpgrade("The Dream Journal lives in Illuminate.");
    const text = input.trim(); if (!text || loading) return;
    const next = [...msgs, { role: "user", content: text }];
    setMsgs(next); setInput(""); setLoading(true);
    try {
      const reply = await askLuminae(text,
        `You are Luminae's dream guide. The same symbol means different things to different people — a snake is fear to one seeker, wisdom to another. So FIRST ask 1-2 gentle clarifying questions about feelings and context (e.g. "You mentioned water — was it calm or turbulent?", "Did you feel afraid, or at peace?"). Only once the seeker has answered, give a personalised interpretation rooted in their emotional context. When you give a full interpretation, end with one suggested meditation or crystal for the dream's theme. Tonight's moon phase: ${moonPhase().name}. Keep each message under 180 words.`,
        msgs);
      setMsgs([...next, { role: "assistant", content: reply }]);
      if (reply.length > 400) setJournal([{ date: new Date().toLocaleDateString(), moon: moonPhase(), dream: msgs[0]?.content || text, note: reply.slice(0, 160) + "…" }, ...journal]);
    } catch (e) {
      setMsgs([...next, { role: "assistant", content: "The veil is thick for a moment, beloved. Please share that once more." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Eyebrow colour={T.moon}>Dream Journal</Eyebrow>
      <H>What did the night bring you?</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 13.5 }}>Describe your dream in your own words. Your guide will ask before interpreting — your feelings shape the meaning. {moonPhase().icon} {moonPhase().name} tonight.</p>
      <Panel style={{ margin: "14px 0", padding: 16, minHeight: 200, maxHeight: 380, overflowY: "auto" }}>
        {msgs.length === 0 && <p className="lum-serif" style={{ color: T.faint, fontStyle: "italic", fontSize: 16 }}>“I dreamed I was standing in dark water, and a white bird circled above me…”</p>}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div className={m.role === "user" ? "lum-sans" : "lum-serif"} style={{
              maxWidth: "85%", padding: "10px 15px", borderRadius: 14, fontSize: m.role === "user" ? 14 : 15.5, lineHeight: 1.65,
              background: m.role === "user" ? "rgba(201,168,76,.13)" : "rgba(184,196,216,.07)",
              border: `1px solid ${m.role === "user" ? "rgba(201,168,76,.3)" : "rgba(184,196,216,.16)"}`,
              color: T.ink, fontStyle: m.role === "user" ? "normal" : "italic", whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}
        {loading && <div className="lum-serif" style={{ color: T.moon, fontStyle: "italic" }}>Your guide is listening…</div>}
        <div ref={endRef} />
      </Panel>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Tell me about your dream…" className="lum-sans" style={{ ...inp, flex: 1 }} />
        <Btn small onClick={send}>Share {!paid && "🔒"}</Btn>
      </div>
      {journal.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <Eyebrow colour={T.moon}>Your Journal</Eyebrow>
          {journal.map((j, i) => (
            <Panel key={i} style={{ padding: 14, marginBottom: 8 }}>
              <div className="lum-sans" style={{ fontSize: 11, color: T.gold }}>{j.date} · {j.moon.icon} {j.moon.name}</div>
              <div className="lum-serif" style={{ fontSize: 15, color: T.ink, fontStyle: "italic", margin: "4px 0" }}>“{j.dream.slice(0, 110)}{j.dream.length > 110 ? "…" : ""}”</div>
              <div className="lum-sans" style={{ fontSize: 12, color: T.dim, lineHeight: 1.5 }}>{j.note}</div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   SOUL TYPE
   ============================================================ */
const SoulScreen = ({ paid, askUpgrade }) => {
  const [step, setStep] = useState(-1);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null); // { primary, secondary, pct }
  const [reading, setReading] = useState(""); const [loading, setLoading] = useState(false);

  const start = () => { if (!paid) return askUpgrade("Your Soul Type reading lives in Illuminate."); setScores({}); setResult(null); setReading(""); setStep(0); };

  const rate = async (val) => {
    const type = SOUL_STATEMENTS[step][1];
    const s = { ...scores, [type]: (scores[type] || 0) + val };
    setScores(s);
    if (step + 1 < SOUL_STATEMENTS.length) return setStep(step + 1);
    // blended profile: every type scored out of 4, shown as resonance
    const maxPer = 4;
    const pct = Object.keys(SOUL_TYPES).map((k) => ({ key: k, ...SOUL_TYPES[k], pct: Math.round(((s[k] || 0) / maxPer) * 100) }))
      .sort((a, b) => b.pct - a.pct);
    const res = { primary: pct[0], secondary: pct[1].pct >= 50 ? pct[1] : null, pct };
    setResult(res); setStep(SOUL_STATEMENTS.length); setLoading(true);
    try {
      setReading(await askLuminae(
        `A seeker rated how deeply twelve soul statements resonate. Their resonance with each soul type: ${pct.map((p) => `${p.name} ${p.pct}%`).join(", ")}.\n` +
        `Their strongest current is ${res.primary.name} (${res.primary.essence})${res.secondary ? `, with a clear secondary current of ${res.secondary.name} (${res.secondary.essence})` : ""}.\n` +
        `Write their soul reading as a BLENDED portrait — souls carry more than one ray, and a questionnaire is a mirror, not a verdict. Speak to how their leading currents weave together: their gifts and strengths, challenges and sensitivities, soul mission on Earth, and how to protect and restore their energy. Gently remind them that their own inner knowing is the final authority on what their soul is.`
      ));
    } catch (e) { setReading(res.primary.essence + "\n\nYour fuller reading will arrive in a moment — please try again."); }
    setLoading(false);
  };

  if (result) return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Back onClick={() => { setStep(-1); setResult(null); }} label="Soul types" />
      <Eyebrow colour={result.primary.colour}>Your Leading Current</Eyebrow>
      <H size={36} style={{ color: result.primary.colour }}>
        {result.primary.name}{result.secondary && <span className="lum-serif" style={{ fontSize: 20, color: result.secondary.colour }}> · with {result.secondary.name} light</span>}
      </H>
      <p className="lum-serif" style={{ color: T.ink, fontSize: 17, fontStyle: "italic", lineHeight: 1.6 }}>{result.primary.essence}</p>
      <Panel style={{ padding: 18, margin: "14px 0" }}>
        <div className="lum-sans" style={{ fontSize: 11, color: T.dim, letterSpacing: ".16em", marginBottom: 12 }}>HOW EACH RAY RESONATES IN YOU</div>
        {result.pct.map((p) => (
          <div key={p.key} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="lum-sans" style={{ fontSize: 12.5, color: p.pct >= 50 ? p.colour : T.dim }}>{p.name}</span>
              <span className="lum-sans" style={{ fontSize: 12, color: T.faint }}>{p.pct}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "rgba(233,230,242,.07)" }}>
              <div style={{ height: "100%", width: `${p.pct}%`, borderRadius: 3, background: p.colour, opacity: 0.85, transition: "width 1s ease" }} />
            </div>
          </div>
        ))}
      </Panel>
      {loading ? <Channeling text="Reading your soul's signature…" /> : <Panel style={{ padding: 26, borderColor: result.primary.colour + "55" }}><ReadingText text={reading} /></Panel>}
      <p className="lum-serif" style={{ color: T.faint, fontSize: 13.5, fontStyle: "italic", marginTop: 14, lineHeight: 1.7 }}>A questionnaire is a mirror, not a verdict. Your own inner knowing is the final authority on what your soul is.</p>
    </div>
  );

  if (step >= 0) {
    const [statement] = SOUL_STATEMENTS[step];
    return (
      <div className="fade-up" key={step} style={{ maxWidth: 500 }}>
        <Eyebrow colour={T.violet}>{step + 1} of {SOUL_STATEMENTS.length}</Eyebrow>
        <div style={{ display: "flex", gap: 4, margin: "0 0 22px" }}>
          {SOUL_STATEMENTS.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? T.violet : "rgba(233,230,242,.1)" }} />)}
        </div>
        <H size={26} style={{ fontStyle: "italic" }}>“{statement}”</H>
        <div className="lum-sans" style={{ color: T.dim, fontSize: 13, margin: "8px 0 18px" }}>How deeply does this resonate?</div>
        <div style={{ display: "grid", gap: 10 }}>
          {RESONANCE.map(([label, val]) => (
            <Panel key={label} hover onClick={() => rate(val)} style={{ padding: "15px 18px" }}>
              <span className="lum-sans" style={{ fontSize: 14.5, color: T.ink }}>{label}</span>
            </Panel>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ maxWidth: 600 }}>
      <Eyebrow colour={T.violet}>Soul Type Profile</Eyebrow>
      <H>Which light do you carry?</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14, lineHeight: 1.7 }}>Souls rarely carry only one ray. Rather than forcing you to choose between truths, you'll rate how deeply twelve statements resonate — and receive a blended portrait of the currents moving through you, with your leading light named first.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "18px 0" }}>
        {Object.values(SOUL_TYPES).map((s) => (
          <Panel key={s.name} style={{ padding: 14, borderColor: s.colour + "44" }}>
            <div className="lum-serif" style={{ fontSize: 17, color: s.colour }}>{s.name}</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.55, marginTop: 4 }}>{s.essence}</div>
          </Panel>
        ))}
      </div>
      <Btn onClick={start}>Begin the reflection ✧ {!paid && "🔒"}</Btn>
    </div>
  );
};

/* ============================================================
   IRIDOLOGY & PALM (vision)
   ============================================================ */
const VisionScreen = ({ kind, paid, askUpgrade }) => {
  const [img, setImg] = useState(null);
  const [out, setOut] = useState(""); const [loading, setLoading] = useState(false);
  const isIris = kind === "iris";

  const upload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!paid) return askUpgrade(`${isIris ? "Iris" : "Palm"} readings live in Illuminate.`);
    const reader = new FileReader();
    reader.onload = () => setImg({ data: reader.result.split(",")[1], media: file.type, url: reader.result });
    reader.readAsDataURL(file);
  };
  const read = async () => {
    setLoading(true); setOut("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: LUMINAE_VOICE + ` You are giving a ${isIris ? "traditional iridology reflection, gently describing what the iris zones are traditionally said to reflect" : "palmistry reading of the heart line, head line, life line, fate line, mounts and hand shape where visible"}. This is for holistic wellness reflection and spiritual insight only — it is never medical advice, and you must say so warmly at the end. If the image is unclear, lovingly ask for a clearer photo instead of guessing.`,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: img.media, data: img.data } },
            { type: "text", text: isIris ? "Please offer my iris reading, zone by zone." : "Please read my palm." },
          ] }],
        }),
      });
      const data = await res.json();
      setOut(data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "The image is shy — please try a clearer photo.");
    } catch (e) { setOut("The channel paused, beloved. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Eyebrow colour={T.rose}>{isIris ? "Iridology" : "Palm Reading"}</Eyebrow>
      <H>{isIris ? "The window of the iris" : "The map in your hands"}</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14, lineHeight: 1.7 }}>
        {isIris ? "Upload a close-up of your eye — good lighting, close to the camera, no flash." : "Photograph your dominant hand — flat, well lit, lines clearly visible."} An occasional deep-dive, not a daily practice.
      </p>
      <Panel style={{ margin: "16px 0", padding: 20, textAlign: "center", borderStyle: "dashed", borderColor: T.rose + "55" }}>
        {img ? <img src={img.url} alt="Your upload" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 12 }} /> : <div style={{ fontSize: 40, margin: "10px 0" }}>{isIris ? "👁️" : "🖐️"}</div>}
        <div style={{ marginTop: 12 }}>
          <label style={{ cursor: "pointer" }}>
            <input type="file" accept="image/*" onChange={upload} style={{ display: "none" }} />
            <span className="lum-sans" style={{ background: "rgba(192,123,138,.14)", border: `1px solid ${T.rose}66`, color: T.rose, borderRadius: 20, padding: "9px 20px", fontSize: 13 }}>Choose photo {!paid && "🔒"}</span>
          </label>
          {img && <span style={{ marginLeft: 10 }}><Btn small onClick={read}>Begin reading ✧</Btn></span>}
        </div>
      </Panel>
      {loading && <Channeling text={isIris ? "Gazing into the iris…" : "Tracing your lines…"} />}
      {out && <Panel style={{ padding: 26 }}><ReadingText text={out} /></Panel>}
      <p className="lum-sans" style={{ color: T.faint, fontSize: 11.5, marginTop: 12, fontStyle: "italic" }}>This reading is for holistic wellness reflection and spiritual insight. It is not medical advice.</p>
    </div>
  );
};

/* ============================================================
   TIERS, ADS & SHELL
   ============================================================ */
const UpgradeModal = ({ reason, onClose, onChoose }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 95, background: "rgba(8,8,18,.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div className="fade-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, width: "100%", background: `linear-gradient(165deg, ${T.card}, ${T.card2})`, border: `1px solid ${T.gold}55`, borderRadius: 22, padding: 28, textAlign: "center" }}>
      <div className="lum-serif gold-shimmer" style={{ fontSize: 30, fontWeight: 600 }}>Illuminate your path</div>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 14, lineHeight: 1.7, margin: "10px 0 22px" }}>{reason}</p>
      <Panel hover onClick={() => onChoose("illuminate")} style={{ marginBottom: 12, borderColor: T.gold + "77", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="lum-serif" style={{ fontSize: 20, color: T.goldHi }}>Illuminate</span>
          <span className="lum-sans" style={{ color: T.ink, fontSize: 15 }}>$12<span style={{ color: T.faint, fontSize: 12 }}>/month</span></span>
        </div>
        <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, marginTop: 4 }}>Completely ad-free · every reading, deck, sound & meditation</div>
      </Panel>
      <Panel hover onClick={() => onChoose("oracle")} style={{ borderColor: T.violet + "77", textAlign: "left", background: "linear-gradient(160deg, #1d1438, #141228)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="lum-serif" style={{ fontSize: 20, color: T.violet }}>Oracle · Lifetime</span>
          <span className="lum-sans" style={{ color: T.ink, fontSize: 15 }}>$88 <span style={{ color: T.faint, fontSize: 12 }}>once</span></span>
        </div>
        <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, marginTop: 4 }}>Everything, forever · all future decks & features · early access</div>
      </Panel>
      <button onClick={onClose} className="lum-sans" style={{ background: "none", border: "none", color: T.faint, fontSize: 13, marginTop: 16, cursor: "pointer" }}>Continue as a Seeker</button>
      <div className="lum-sans" style={{ color: T.faint, fontSize: 10.5, marginTop: 8 }}>Preview build — payments connect to Stripe at launch.</div>
    </div>
  </div>
);

const AdBanner = ({ onUpgrade }) => (
  <div className="lum-sans" style={{ position: "fixed", bottom: 64, left: 0, right: 0, zIndex: 40, background: "#1f1f33", borderTop: "1px solid rgba(233,230,242,.1)", padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: 11.5, color: T.faint }}>Ad · Sponsored content appears here on the free tier</span>
    <button onClick={onUpgrade} style={{ background: "none", border: "none", color: T.goldHi, fontSize: 11.5, cursor: "pointer", textDecoration: "underline" }}>Remove ads from $12/month</button>
  </div>
);

const Interstitial = ({ onDone }) => {
  const [s, setS] = useState(5);
  useEffect(() => { const t = setInterval(() => setS((x) => Math.max(0, x - 1)), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 96, background: "rgba(8,8,18,.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div className="lum-sans" style={{ color: T.faint, fontSize: 11, letterSpacing: ".2em", marginBottom: 14 }}>ADVERTISEMENT</div>
        <Panel style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <span className="lum-sans" style={{ color: T.faint, fontSize: 13 }}>Sponsored content plays here between sessions</span>
        </Panel>
        {s > 0
          ? <div className="lum-sans" style={{ color: T.dim, fontSize: 13 }}>Skip in {s}…</div>
          : <Btn small kind="ghost" onClick={onDone}>Skip ad →</Btn>}
        <div style={{ marginTop: 16 }}><button className="lum-sans" onClick={onDone} style={{ background: "none", border: "none", color: T.goldHi, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Remove ads from $12/month</button></div>
      </div>
    </div>
  );
};

/* ============================================================
   HOME
   ============================================================ */
const HomeScreen = ({ tier, go, requestRitual, deckId, onAfterReading }) => {
  const [daily, setDaily] = useState(null);
  const [dailyText, setDailyText] = useState(""); const [loading, setLoading] = useState(false);
  const moon = moonPhase();
  const hour = new Date().getHours();
  const orbTint = hour < 6 ? T.violet : hour < 12 ? T.goldHi : hour < 18 ? T.gold : T.moon;
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const deck = DECKS.find((d) => d.id === deckId);
  const crystal = CRYSTALS[new Date().getDate() % CRYSTALS.length];

  const drawDaily = () => requestRitual(async () => {
    const card = FULL_DECK[Math.floor(Math.random() * FULL_DECK.length)];
    setDaily(card); setDailyText(""); setLoading(true);
    try {
      setDailyText(await askLuminae(`Today's single daily card is ${card.name} (themes: ${card.keys}). In 110-150 words, offer today's message for the seeker, closing with one gentle invitation for the day. Moon: ${moon.name}.`));
    } catch (e) { setDailyText(`${card.name} carries the energy of ${card.keys}. Carry it gently with you today, beloved.`); }
    setLoading(false);
    onAfterReading();
  });

  return (
    <div className="fade-up" style={{ textAlign: "center" }}>
      <div className="lum-sans" style={{ color: T.dim, fontSize: 13, letterSpacing: ".08em" }}>{greeting}, beloved seeker · {moon.icon} {moon.name}</div>
      <div className="lum-serif gold-shimmer" style={{ fontSize: 46, fontWeight: 600, margin: "6px 0 2px" }}>Luminae</div>
      <div className="lum-serif" style={{ color: T.moon, fontSize: 17, fontStyle: "italic", marginBottom: 30 }}>The wisdom you've been seeking</div>

      <OracleOrb size={148} tint={orbTint} onClick={() => go("tarot")} label="Touch the orb to begin a reading" />

      <div style={{ maxWidth: 540, margin: "36px auto 0", textAlign: "left" }}>
        <Panel style={{ marginBottom: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Eyebrow>Daily Single Card · Free</Eyebrow>
              <div className="lum-serif" style={{ fontSize: 21, color: T.ink }}>One card for today's energy</div>
            </div>
            {!daily && <Btn small onClick={drawDaily}>Draw ✧</Btn>}
          </div>
          {daily && (
            <div style={{ display: "flex", gap: 18, marginTop: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <TarotCard card={daily} deck={deck} w={92} />
              <div style={{ flex: 1, minWidth: 220 }}>
                {loading ? <div className="lum-serif" style={{ color: T.goldHi, fontStyle: "italic" }}>Channeling today's message…</div> : <ReadingText text={dailyText} />}
              </div>
            </div>
          )}
        </Panel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Panel hover onClick={() => go("crystals")} style={{ padding: 16 }}>
            <Eyebrow colour={T.sage}>Today's Crystal</Eyebrow>
            <div className="lum-serif" style={{ fontSize: 19, color: T.ink }}>💎 {crystal.name}</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 4 }}>{crystal.chakra}</div>
          </Panel>
          <Panel hover onClick={() => go("angels")} style={{ padding: 16, borderColor: "#3b6fd444" }}>
            <Eyebrow colour="#9cb8ee">Protection</Eyebrow>
            <div className="lum-serif" style={{ fontSize: 19, color: T.ink }}>🛡️ Call on Michael</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 4 }}>One breath away</div>
          </Panel>
          <Panel hover onClick={() => go("sounds")} style={{ padding: 16, borderColor: T.teal + "33" }}>
            <Eyebrow colour={T.teal}>Sound Sanctuary</Eyebrow>
            <div className="lum-serif" style={{ fontSize: 19, color: T.ink }}>🎵 528 Hz</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 4 }}>The Love Frequency</div>
          </Panel>
          <Panel hover onClick={() => go("soul")} style={{ padding: 16, borderColor: T.violet + "33" }}>
            <Eyebrow colour={T.violet}>Soul Type</Eyebrow>
            <div className="lum-serif" style={{ fontSize: 19, color: T.ink }}>✨ Which light?</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 4 }}>Blue Ray · Indigo · Starseed…</div>
          </Panel>
        </div>
        <p className="lum-serif" style={{ color: T.faint, fontSize: 14, fontStyle: "italic", textAlign: "center", marginTop: 26, lineHeight: 1.7 }}>
          Every reading in Luminae is opened in pure intent, surrounded in golden light, and held in the protection of Archangel Michael.
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   APP
   ============================================================ */
const NAV = [
  { id: "home", icon: "✧", label: "Home" },
  { id: "tarot", icon: "🂠", label: "Tarot" },
  { id: "sounds", icon: "♫", label: "Sounds" },
  { id: "angels", icon: "🕊", label: "Angels" },
  { id: "more", icon: "☰", label: "More" },
];
const MORE = [
  { id: "astrology", name: "Astrology", icon: "♒", note: "Weekly horoscope & natal chart" },
  { id: "numerology", name: "Numerology", icon: "7", note: "Life Path, Destiny, Soul Urge…" },
  { id: "soul", name: "Soul Type Profile", icon: "✨", note: "Blue Ray · Indigo · Starseed…" },
  { id: "dreams", name: "Dream Journal", icon: "🌙", note: "Conversational interpretation" },
  { id: "meditate", name: "Guided Meditation", icon: "🧘", note: "Violet Flame, Gold Light & more" },
  { id: "crystals", name: "Crystal Guide", icon: "💎", note: "Daily crystal & full library" },
  { id: "iris", name: "Iris Reading", icon: "👁", note: "Iridology wellness portrait" },
  { id: "palm", name: "Palm Reading", icon: "🖐", note: "Heart, head, life & fate lines" },
];

export default function Luminae() {
  const [screen, setScreen] = useState("home");
  const [tier, setTier] = useState("seeker");
  const [firstOpen, setFirstOpen] = useState(true);
  const [ritual, setRitual] = useState(null); // pending callback
  const [upgrade, setUpgrade] = useState(null);
  const [interstitial, setInterstitial] = useState(false);
  const [deckId, setDeckId] = useState("classic");
  const [birth, setBirth] = useState({ dob: "", time: "", place: "" });
  const [journal, setJournal] = useState([]);
  const engine = useMemo(() => createAudioEngine(), []);
  const paid = tier !== "seeker";

  const requestRitual = useCallback((cb) => setRitual(() => cb), []);
  const askUpgrade = useCallback((reason) => setUpgrade(reason), []);
  const onAfterReading = useCallback(() => { if (tier === "seeker") setTimeout(() => setInterstitial(true), 1200); }, [tier]);
  const go = (id) => setScreen(id);

  const screenEl = {
    home: <HomeScreen tier={tier} go={go} requestRitual={requestRitual} deckId={deckId} onAfterReading={onAfterReading} />,
    tarot: <TarotScreen paid={paid} deckId={deckId} setDeckId={setDeckId} requestRitual={requestRitual} askUpgrade={askUpgrade} onAfterReading={onAfterReading} />,
    sounds: <SoundScreen paid={paid} askUpgrade={askUpgrade} engine={engine} />,
    angels: <AngelScreen paid={paid} askUpgrade={askUpgrade} />,
    astrology: <AstrologyScreen paid={paid} askUpgrade={askUpgrade} birth={birth} setBirth={setBirth} />,
    numerology: <NumerologyScreen paid={paid} askUpgrade={askUpgrade} birth={birth} setBirth={setBirth} />,
    soul: <SoulScreen paid={paid} askUpgrade={askUpgrade} />,
    dreams: <DreamScreen paid={paid} askUpgrade={askUpgrade} journal={journal} setJournal={setJournal} />,
    meditate: <MeditationScreen paid={paid} askUpgrade={askUpgrade} engine={engine} />,
    crystals: <CrystalScreen paid={paid} askUpgrade={askUpgrade} />,
    iris: <VisionScreen kind="iris" paid={paid} askUpgrade={askUpgrade} />,
    palm: <VisionScreen kind="palm" paid={paid} askUpgrade={askUpgrade} />,
    more: (
      <div className="fade-up" style={{ maxWidth: 560 }}>
        <Eyebrow>Sanctuary</Eyebrow>
        <H>Every path, one sacred space</H>
        <div style={{ display: "grid", gap: 10, margin: "18px 0" }}>
          {MORE.map((m) => (
            <Panel key={m.id} hover onClick={() => go(m.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span className="lum-serif" style={{ fontSize: 22, color: T.gold, width: 26, textAlign: "center" }}>{m.icon}</span>
                <div>
                  <div className="lum-serif" style={{ fontSize: 18, color: T.ink }}>{m.name}</div>
                  <div className="lum-sans" style={{ fontSize: 12, color: T.dim }}>{m.note}</div>
                </div>
              </div>
              <span style={{ color: T.gold }}>→</span>
            </Panel>
          ))}
        </div>
        <Panel style={{ padding: 18, textAlign: "center" }}>
          <div className="lum-sans" style={{ fontSize: 12, color: T.dim }}>Current tier</div>
          <div className="lum-serif gold-shimmer" style={{ fontSize: 24, fontWeight: 600, textTransform: "capitalize" }}>{tier === "seeker" ? "Seeker · Free" : tier === "oracle" ? "Oracle · Lifetime" : "Illuminate"}</div>
          {!paid && <div style={{ marginTop: 12 }}><Btn small onClick={() => askUpgrade("Everything you love — readings, sound healing, meditation, angel guidance — in one sacred, ad-free space.")}>Illuminate from $12/mo</Btn></div>}
          {paid && <Btn small kind="ghost" onClick={() => setTier("seeker")} style={{ marginTop: 12 }}>Preview free tier</Btn>}
        </Panel>
        <p className="lum-serif" style={{ color: T.faint, fontSize: 13, fontStyle: "italic", lineHeight: 1.8, marginTop: 20, textAlign: "center" }}>
          Luminae is built with deep respect for the spiritual traditions it draws from. All readings are for educational, reflective, and spiritual purposes — not medical advice, psychological diagnosis, or definitive prediction. Hold every insight with an open heart and your own discernment.
        </p>
        <p className="lum-sans" style={{ color: T.faint, fontSize: 11, textAlign: "center", marginTop: 8 }}>Built by Olivia & DeAndre Hyde · June 2026</p>
      </div>
    ),
  }[screen];

  return (
    <div className="lum-sans" style={{ minHeight: "100vh", background: T.bg, color: T.ink, position: "relative" }}>
      <GlobalStyle />
      <Stars />
      {firstOpen && <SacredGate first onReady={() => setFirstOpen(false)} />}
      {ritual && !firstOpen && <SacredGate onReady={() => { const cb = ritual; setRitual(null); cb(); }} />}
      {upgrade && <UpgradeModal reason={upgrade} onClose={() => setUpgrade(null)} onChoose={(t) => { setTier(t); setUpgrade(null); setInterstitial(false); }} />}
      {interstitial && tier === "seeker" && <Interstitial onDone={() => setInterstitial(false)} />}

      <main style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: `28px 20px ${tier === "seeker" ? 150 : 110}px` }}>
        {screenEl}
      </main>

      {tier === "seeker" && <AdBanner onUpgrade={() => askUpgrade("Remove every ad and unlock the full sanctuary.")} />}
      <nav aria-label="Main" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(13,13,26,.94)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(201,168,76,.18)", display: "flex", justifyContent: "space-around", padding: "9px 6px 12px" }}>
        {NAV.map((n) => {
          const active = screen === n.id || (n.id === "more" && !NAV.some((x) => x.id === screen));
          return (
            <button key={n.id} onClick={() => go(n.id)} className="lum-sans" style={{ background: "none", border: "none", cursor: "pointer", color: active ? T.goldHi : T.faint, textAlign: "center", minWidth: 58 }}>
              <div style={{ fontSize: 19, lineHeight: 1.1 }}>{n.icon}</div>
              <div style={{ fontSize: 10, letterSpacing: ".08em", marginTop: 3 }}>{n.label}</div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
