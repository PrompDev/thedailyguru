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
  { name: "Archangel Michael", domain: "Protection & Courage", colour: "Cobalt Blue", hex: "#3b6fd4", crystal: "Black Tourmaline", img: "/images/angels/archangel-michael.webp", invocation: "Archangel Michael, surround me in your blue flame of protection. Cut away all that is not of the light, and fill me with courage and strength." },
  { name: "Archangel Raphael", domain: "Healing & Health", colour: "Emerald Green", hex: "#3da06b", crystal: "Malachite", img: "/images/angels/archangel-raphael-2.webp", invocation: "Archangel Raphael, pour your emerald healing light through every cell of my being. Restore me to wholeness in body, heart, and spirit." },
  { name: "Archangel Gabriel", domain: "Communication & Creativity", colour: "White & Copper", hex: "#d8c8b8", crystal: "Selenite", img: "/images/angels/archangel-gabriel.webp", invocation: "Archangel Gabriel, open my voice and my creative channel. Help me express my truth with clarity and grace." },
  { name: "Archangel Uriel", domain: "Wisdom & Clarity", colour: "Gold", hex: "#d4b04c", crystal: "Amber", img: "/images/angels/archangel-uriel-3.webp", invocation: "Archangel Uriel, illuminate my mind with your golden light. Show me the wisdom hidden within this moment." },
  { name: "Archangel Chamuel", domain: "Love & Relationships", colour: "Pink", hex: "#d489a0", crystal: "Rose Quartz", img: "/images/angels/archangel-chamuel.webp", invocation: "Archangel Chamuel, open my heart to give and receive love freely. Help me see myself and others through the eyes of compassion." },
  { name: "Archangel Jophiel", domain: "Beauty & Joyful Thought", colour: "Sunshine Yellow", hex: "#eccb55", crystal: "Citrine", img: "/images/angels/archangel-jophiel.webp", invocation: "Archangel Jophiel, beautify my thoughts and brighten my inner world. Open my eyes to the beauty already all around me, and lift my heart into joy." },
  { name: "Archangel Zadkiel", domain: "Mercy & Forgiveness", colour: "Violet", hex: "#9a6fd8", crystal: "Amethyst", img: "/images/angels/archangel-zadkiel.webp", invocation: "Archangel Zadkiel, bathe me in the violet flame of transmutation. Help me forgive myself and others, releasing the past into light and freedom." },
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
/* A real harp recording (served from public/audio) that becomes the
   Angelic Harp in place of the live-synth version. Falls back to the
   synth if it can't be loaded, and a seeker's own upload still wins. */
const HARP_RECORDING = { src: "/audio/Moonlit Canopy Drift.mp3", title: "Moonlit Canopy Drift" };
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

/* ---------------- Daily Quotes ---------------- */
const QUOTES = [
  ["The universe is not outside of you. Look inside yourself; everything that you want, you already are.", "Rumi"],
  ["You are the sky. Everything else is just the weather.", "Pema Chödrön"],
  ["Nothing in the universe can stop you from letting go and being free.", "Mooji"],
  ["What lies behind us and what lies before us are tiny matters compared to what lies within us.", "Ralph Waldo Emerson"],
  ["The wound is the place where the Light enters you.", "Rumi"],
  ["Peace comes from within. Do not seek it without.", "Buddha"],
  ["Your sacred space is where you can find yourself again and again.", "Joseph Campbell"],
  ["The soul always knows what to do to heal itself. The challenge is to silence the mind.", "Caroline Myss"],
  ["Every heart sings a song, incomplete, until another heart whispers back.", "Plato"],
  ["Be soft. Do not let the world make you hard.", "Kurt Vonnegut"],
  ["You are not a drop in the ocean. You are the entire ocean in a drop.", "Rumi"],
  ["The privilege of a lifetime is to become who you truly are.", "Carl Jung"],
  ["When you do things from your soul, you feel a river moving in you, a joy.", "Rumi"],
  ["The quieter you become, the more you are able to hear.", "Rumi"],
  ["Trust the timing of your life. Every step is preparing you for the next.", "Unknown"],
  ["Healing takes courage, and we all have courage, even if we have to dig a little to find it.", "Tori Amos"],
  ["Surround yourself with those who see the greatness within you, even when you don't see it yourself.", "Unknown"],
  ["What we plant in the soil of contemplation, we shall reap in the harvest of action.", "Meister Eckhart"],
  ["You have been given this life because you are strong enough to live it.", "Unknown"],
  ["The most powerful relationship you will ever have is the relationship with yourself.", "Steve Maraboli"],
  ["Let yourself be silently drawn by the strange pull of what you really love.", "Rumi"],
  ["Gratitude turns what we have into enough.", "Unknown"],
  ["The soul that sees beauty may sometimes walk alone.", "Johann Wolfgang von Goethe"],
  ["Within you there is a stillness and a sanctuary to which you can retreat at any time.", "Hermann Hesse"],
  ["Everything that happens to you is your teacher. The secret is to learn to sit at the feet of your own life.", "Polly Berrien Berends"],
  ["You are the universe experiencing itself.", "Alan Watts"],
  ["May you trust that a small, quiet voice within you will guide you home.", "Unknown"],
  ["Wherever you are, be there totally.", "Eckhart Tolle"],
  ["Light tomorrow with today.", "Elizabeth Barrett Browning"],
  ["What you seek is seeking you.", "Rumi"],
  ["Beloved, you carry your own weather. Choose the golden light within.", "Luminae"],
];
function dailyQuote(date = new Date()) {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

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

/* ---------------- Deep lore: signs, moons, numbers, library ----------------
   Written in Luminae's inclusive voice — plain enough for a first-timer,
   layered enough for an old soul. No gatekeeping, no talking down. */
const ELEMENT_HUE = { Fire: "#e0885a", Earth: "#8ec9a0", Air: "#9cb8ee", Water: "#b898e8" };

const SIGN_LORE = {
  Aries: { glyph: "♈", dates: "Mar 21 – Apr 19", element: "Fire", modality: "Cardinal", ruler: "Mars", stone: "Carnelian",
    essence: "The zodiac's first spark — cardinal fire, ruled by Mars. You meet life head-first, and your courage quietly gives everyone around you permission to begin. The deeper work of an Aries life: learning which battles deserve your beautiful fire, and which are only noise.",
    light: "Instigator's courage, radical honesty, a heart that forgives fast and moves forward.",
    shadow: "Impatience that abandons ships mid-voyage; anger that speaks before the soul has voted.",
    love: "Falls fast and burns bright — needs a fellow flame, not fuel.",
    work: "Born to found, launch and lead the charge — wilts under micromanagement.",
    mantra: "I begin, and the path appears." },
  Taurus: { glyph: "♉", dates: "Apr 20 – May 20", element: "Earth", modality: "Fixed", ruler: "Venus", stone: "Rose Quartz",
    essence: "Fixed earth, ruled by Venus. You are the zodiac's garden — patient, sensual, loyal to what is real. Where others chase, you cultivate; your superpower is staying long enough for things to bloom.",
    light: "Steadfast devotion, an artist's senses, a calm that steadies whole rooms.",
    shadow: "Comfort that quietly becomes a cage; stubbornness dressed up as principle.",
    love: "Slow to open, endlessly loyal once rooted — love spoken in touch and tending.",
    work: "Builds beautiful, lasting things — craft, food, finance, land, the arts.",
    mantra: "What I tend, grows." },
  Gemini: { glyph: "♊", dates: "May 21 – Jun 20", element: "Air", modality: "Mutable", ruler: "Mercury", stone: "Agate",
    essence: "Mutable air, ruled by Mercury. You are the messenger — twin currents of curiosity that can hold two truths at once. Your mind moves like light on water; the art is choosing where to land.",
    light: "Wit, wordcraft, and the gift of making strangers feel like old friends.",
    shadow: "Scattered fire; speaking fluently around a feeling instead of through it.",
    love: "Needs conversation like oxygen — the mind is the first organ of romance.",
    work: "Writing, teaching, media, trade — anywhere ideas need wings.",
    mantra: "I am allowed to be more than one thing." },
  Cancer: { glyph: "♋", dates: "Jun 21 – Jul 22", element: "Water", modality: "Cardinal", ruler: "the Moon", stone: "Moonstone",
    essence: "Cardinal water, ruled by the Moon. You feel the room before you enter it. Home is not a place to you — it is a frequency, and you carry it with you, offering shelter wherever you go.",
    light: "Fierce nurture, long memory of kindness, intuition that arrives as simple knowing.",
    shadow: "The shell — retreating sideways instead of saying the tender thing out loud.",
    love: "Loves by feeding, keeping and remembering — needs safety before softness.",
    work: "Care, hospitality, history, home-making of every kind — building sanctuaries.",
    mantra: "My softness is a strength I choose." },
  Leo: { glyph: "♌", dates: "Jul 23 – Aug 22", element: "Fire", modality: "Fixed", ruler: "the Sun", stone: "Sunstone",
    essence: "Fixed fire, ruled by the Sun itself. You are not seeking the spotlight — you are one. The royal lesson: real gold warms others; it never needs to outshine them.",
    light: "Radiant generosity, creative fire, loyalty like a lion guards its pride.",
    shadow: "A heart that sometimes confuses applause with love.",
    love: "Whole-hearted and gloriously theatrical — adoration must flow both ways.",
    work: "Performance, leadership, teaching, anything where warmth is the craft.",
    mantra: "I shine so others remember they can." },
  Virgo: { glyph: "♍", dates: "Aug 23 – Sep 22", element: "Earth", modality: "Mutable", ruler: "Mercury", stone: "Peridot",
    essence: "Mutable earth, ruled by Mercury. You see the missing stitch in every fabric — devotion disguised as detail. Your love language is improvement; your medicine is learning that you, unedited, were never a draft.",
    light: "Precision, service, the healer's eye — competence that feels like kindness.",
    shadow: "The inner critic with a megaphone; perfection used as procrastination.",
    love: "Shows love in acts — remembers, mends, prepares. Be gentle with its worry.",
    work: "Health, analysis, editing, systems — the sacred maintenance of the world.",
    mantra: "Done with love is better than perfect." },
  Libra: { glyph: "♎", dates: "Sep 23 – Oct 22", element: "Air", modality: "Cardinal", ruler: "Venus", stone: "Lapis Lazuli",
    essence: "Cardinal air, ruled by Venus. You are the zodiac's diplomat — beauty and balance are not luxuries to you, they are justice. The scales' secret: harmony that costs your truth is only quiet, not peace.",
    light: "Grace, fairness, an eye for beauty, the gift of making peace feel possible.",
    shadow: "Deciding by committee; abandoning your own side of the scale.",
    love: "Partnership is home terrain — romantic, attentive, allergic to ugliness in conflict.",
    work: "Law, design, mediation, art — anywhere balance must be built, not assumed.",
    mantra: "My truth belongs on the scale too." },
  Scorpio: { glyph: "♏", dates: "Oct 23 – Nov 21", element: "Water", modality: "Fixed", ruler: "Pluto", stone: "Black Obsidian",
    essence: "Fixed water, ruled by Pluto. You live at the depths others only visit — intimacy, mystery, death-and-rebirth are your native waters. You don't do casual; you do transformation.",
    light: "X-ray honesty, devotion unto death, the power to begin again from ash.",
    shadow: "Control worn as armour; the sting saved for those who came closest.",
    love: "All or nothing — trust is the true intimacy, and betrayal is remembered in the bones.",
    work: "Research, psychology, healing, finance, the mysteries — the hidden rooms of the world.",
    mantra: "I can be deep without drowning." },
  Sagittarius: { glyph: "♐", dates: "Nov 22 – Dec 21", element: "Fire", modality: "Mutable", ruler: "Jupiter", stone: "Turquoise",
    essence: "Mutable fire, ruled by Jupiter. You are the arrow and the horizon both — faith, wander, laughter, meaning. Your compass points at truth; your lesson is staying present while you aim.",
    light: "Optimism that heals rooms, wild honesty, a philosopher's hunger for the real.",
    shadow: "The exit door always propped open; truth delivered without anaesthetic.",
    love: "Needs a co-adventurer — freedom isn't the opposite of devotion, it's the proof of it.",
    work: "Travel, publishing, teaching, spirit — anywhere meaning is made and shared.",
    mantra: "The journey is the destination wearing boots." },
  Capricorn: { glyph: "♑", dates: "Dec 22 – Jan 19", element: "Earth", modality: "Cardinal", ruler: "Saturn", stone: "Garnet",
    essence: "Cardinal earth, ruled by Saturn. You were born with a mountain in your eye and the patience to climb it. Time is your ally — and the summit teaches what the valley couldn't: you were worthy before the achievement.",
    light: "Endurance, mastery, dry humour, a spine strong enough for the whole family tree.",
    shadow: "Worth measured only in output; loneliness at altitude.",
    love: "Slow, deliberate, deeply loyal — devotion shown in structure and in showing up.",
    work: "Leadership, architecture of every kind, the long game — the elder of the zodiac.",
    mantra: "I am more than what I build." },
  Aquarius: { glyph: "♒", dates: "Jan 20 – Feb 18", element: "Air", modality: "Fixed", ruler: "Uranus", stone: "Amethyst",
    essence: "Fixed air, ruled by Uranus. You are the lightning that visits the village — future-sighted, communal, gloriously unbothered by 'how it's done'. Your paradox: a humanitarian who needs solitude to love humanity well.",
    light: "Vision, invention, loyalty to principles, friendship raised to an art form.",
    shadow: "A head so far in tomorrow the heart misses today; detachment as defence.",
    love: "Friendship first, always — needs space inside togetherness, not instead of it.",
    work: "Science, technology, activism, community — building the world that isn't here yet.",
    mantra: "I belong to the future and to the room I'm in." },
  Pisces: { glyph: "♓", dates: "Feb 19 – Mar 20", element: "Water", modality: "Mutable", ruler: "Neptune", stone: "Aquamarine",
    essence: "Mutable water, ruled by Neptune. The zodiac's last chapter — you carry a little of all eleven signs before you, which is why the world pours itself into you so easily. Boundaries aren't walls for you; they are the banks that let the river flow.",
    light: "Compassion without borders, artistry, mystic antennae, effortless forgiveness.",
    shadow: "Escaping into dream, fantasy or fog when the shore gets sharp.",
    love: "Loves like weather — total immersion. Needs anchors, not audiences.",
    work: "Art, music, healing, film, spirit — wherever the veil is thin.",
    mantra: "I can feel everything and still choose." },
};
const SIGN_ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const MOON_MEANINGS = {
  "New Moon": "Plant in the dark — name the intention no one else needs to hear yet.",
  "Waxing Crescent": "First light on the seed. Feed what you began with one small act.",
  "First Quarter": "The first resistance arrives. Adjust the sail, not the destination.",
  "Waxing Gibbous": "Almost — refine, edit, trust the swelling light.",
  "Full Moon": "Everything is visible, including you. Celebrate, release, forgive.",
  "Waning Gibbous": "Gratitude and harvest — share what the light taught you.",
  "Last Quarter": "Prune without apology. What you release funds what comes next.",
  "Waning Crescent": "Rest is ritual too. Empty gracefully before the next dark seed.",
};

const NUM_MEANINGS = {
  1: { title: "The Pioneer", essence: "The number of the first step — original fire, independence, the courage to exist unprecedented.", light: "Leadership, initiative, unshakeable self-trust.", bond: "Loves with fierce devotion, but must guard against making every duet a solo.", invitation: "Begin the thing. Your path opens by walking it." },
  2: { title: "The Peacemaker", essence: "The number of the bridge — sensitivity, partnership, the quiet genius of truly listening.", light: "Diplomacy, empathy, the craft of harmony.", bond: "A natural partner — attentive and attuned; must remember its own vote counts too.", invitation: "Your gentleness is a power, not an apology." },
  3: { title: "The Voice", essence: "Creative expression — the number of the artist and storyteller, joy practised as a discipline.", light: "Charisma, imagination, healing humour.", bond: "Brings play and poetry; needs a partner who applauds and anchors.", invitation: "Say it, sing it, make it — expression is your medicine." },
  4: { title: "The Builder", essence: "Foundation and form — the number of order, craft, and devotion to the long haul.", light: "Reliability, method, sacred stubbornness.", bond: "Loves in commitments kept; must let spontaneity in the door sometimes.", invitation: "Build slowly. What you make will outlast moods." },
  5: { title: "The Wanderer", essence: "Freedom in motion — the number of change, appetite, and the open road.", light: "Adaptability, magnetism, fearless curiosity.", bond: "Electric and alive; devotion must never feel like a cage, or it bolts.", invitation: "Choose your changes, or they will choose you." },
  6: { title: "The Guardian", essence: "The number of the hearth — love as responsibility, beauty as an act of care.", light: "Nurture, loyalty, an instinct for making broken things whole.", bond: "The most devoted heart in the blueprint; must serve without disappearing.", invitation: "Care for others from a full cup, not an emptying one." },
  7: { title: "The Mystic", essence: "The inward number — analysis wed to mystery, the hermit with a telescope.", light: "Depth, discernment, spiritual intelligence.", bond: "Loves in depth, not display; needs silence honoured as intimacy.", invitation: "Your solitude is a temple — visit it, don't move in." },
  8: { title: "The Sovereign", essence: "Power and harvest — the number of mastery in the material world.", light: "Ambition, sound judgment, the strength to steward much.", bond: "Loves generously and protects fiercely; must not keep a ledger of the heart.", invitation: "Own your power — softly held, it feeds many." },
  9: { title: "The Sage", essence: "Completion's number — compassion wide as a horizon, the old soul's ache to give back.", light: "Wisdom, artistry, humanitarian fire.", bond: "Loves the whole world through one person; must let endings actually end.", invitation: "Release gracefully. Open hands are the ones that receive." },
  11: { title: "The Illuminator", essence: "A master number — 2's sensitivity electrified into vision. A high-voltage life: inspiration travelling with stage fright.", light: "Prophetic instinct, magnetism, fine spiritual antennae.", bond: "Feels everything within a bond — needs grounding rituals made for two.", invitation: "The nerves are part of the wiring. Shine anyway." },
  22: { title: "The Master Builder", essence: "A master number — 4's craft raised to cathedral scale. Dreams drawn with a straightedge.", light: "Vision married to discipline; legacy-building.", bond: "Would build an empire for its beloved; must remember presence beats provision.", invitation: "Dream at full size — then pour the first footing today." },
  33: { title: "The Master Teacher", essence: "A master number — 6's care raised to the service of many. Compassion as a vocation.", light: "Healing presence, selfless wisdom.", bond: "Loves unconditionally; the lesson is learning to accept care in return.", invitation: "Teach by being — your life is the lesson." },
};

const PHONE_SPIN = {
  1: "calls that start things — opportunities, first moves, bold news travel down this line.",
  2: "heart-to-hearts — this line soothes; people call this number to feel heard.",
  3: "laughter and invitations — a social, creative, storytelling line.",
  4: "practical matters — plans firm up and promises are kept through this number.",
  5: "surprises and movement — travel plans, changes and spontaneity love this line.",
  6: "family and care — the number loved ones instinctively reach for first.",
  7: "quiet, meaningful talk — fewer calls arrive here, but deeper ones.",
  8: "opportunity and negotiation — a prosperous, professional hum runs through it.",
  9: "help and counsel — people bring this line their endings and their healings.",
  11: "inspired downloads — conversations on this line can feel strangely fated.",
  22: "big builds — partnerships and projects of real scale find their way here.",
  33: "guidance — this number quietly becomes a lighthouse for everyone who has it.",
};

const HOME_SPIN = {
  1: "A house of fresh starts and independence — brilliant for founders, first homes and new chapters. To balance it: share meals often, so autonomy never hardens into isolation.",
  2: "A peacemaker's home — gentle, coupled, sensitive to discord. To balance it: protect it from absorbing every guest's weather; clear the air often.",
  3: "A social, expressive home — art on the walls, music in the kitchen, friends at the door. To balance it: keep one corner of true quiet, or the energy scatters.",
  4: "A fortress of stability — routines take root deeply at this address. To balance it: invite spontaneity in regularly, so solid never sets into stuck.",
  5: "A crossroads home — guests, changes and adventures launch from here. To balance it: keep one unchanging ritual as the anchor everyone returns to.",
  6: "The archetypal family hearth — nurturing, beautiful, responsible. To balance it: make sure care flows in as generously as it flows out.",
  7: "A sanctuary of study and spirit — naturally quiet, faintly monastic. To balance it: schedule warmth on purpose; invite people in before the silence forgets how.",
  8: "A house of ambition and abundance — careers accelerate for those who live here. To balance it: leave the ledger outside the bedroom door.",
  9: "A wise, open-door home — people come here to heal and to complete chapters. To balance it: release what — and who — has genuinely finished.",
  11: "A lightning-rod home — intuition and inspiration run high under this roof. To balance it: ground it with plants, stone, texture and routine.",
  22: "A legacy address — something lasting wants to be built from this base. To balance it: remember rest is part of the architecture.",
  33: "A teaching hearth — others gather here to learn and to be held. To balance it: the keepers of this home must also let themselves be kept.",
};

const NUM_AFFINITY = {
  1: { flows: [3, 5, 9], balances: [2, 6, 7] },
  2: { flows: [4, 6, 8], balances: [1, 3, 9] },
  3: { flows: [1, 5, 7], balances: [2, 6, 9] },
  4: { flows: [2, 6, 8], balances: [7, 9] },
  5: { flows: [1, 3, 7], balances: [9] },
  6: { flows: [2, 4, 9], balances: [1, 3, 8] },
  7: { flows: [3, 5], balances: [1, 4, 9] },
  8: { flows: [2, 4, 6], balances: [1, 3] },
  9: { flows: [1, 3, 6], balances: [2, 4, 5, 7] },
};
const hardReduce = (n) => (n === 11 ? 2 : n === 22 ? 4 : n === 33 ? 6 : n);
function pairVerdict(a, b) {
  const ra = hardReduce(a), rb = hardReduce(b);
  const A = NUM_AFFINITY[ra], B = NUM_AFFINITY[rb];
  if (A.flows.includes(rb) || B.flows.includes(ra)) return { kind: "A Flowing Current", icon: "🌊",
    text: "Your numbers speak a shared dialect — energy moves between you with uncommon ease. The work here is not harmony but depth: easy love still needs deliberate roots." };
  if (A.balances.includes(rb) || B.balances.includes(ra)) return { kind: "A Balancing Dance", icon: "☯",
    text: "Each of you carries what the other is learning — a complementary bond where the difference itself is the medicine. Translate often, and assume good faith first." };
  return { kind: "A Forging Fire", icon: "⚒",
    text: "Iron meets iron: this pairing generates heat, growth, and the occasional spark off the anvil. Handled with respect, nothing forges strength faster. Name frictions early; laugh even earlier." };
}

/* ---------------- The Library: in-app deep dives ----------------
   (Learn-more articles; when the Luminae blog goes live these can
   also carry href links out to full posts.) */
const LEARN = [
  { id: "masters", cat: "Numerology", colour: "#7fd4e0", title: "Why 11, 22 and 33 refuse to be reduced", min: 3, body: [
    "Nearly every number in numerology gets 'reduced' — folded down digit by digit until a single figure remains. 29 becomes 2 + 9 = 11, and 11 would become 1 + 1 = 2… except it doesn't. It stops. Three numbers — 11, 22 and 33 — are left standing at full height, and numerologists call them master numbers.",
    "If you're new to this: reduction isn't mathematics for its own sake. It's a way of asking, 'what is the essence hiding inside this bigger pattern?' Most patterns simplify. A few refuse to — and that refusal is the message.",
    "## What the masters carry",
    "11 is 2's sensitivity turned up until it hums — the Illuminator, intuition so strong it can frighten its own carrier. 22 is 4's builder-craft at cathedral scale — the Master Builder, given blueprints too big for one lifetime and the stubbornness to try anyway. 33 is 6's care widened into vocation — the Master Teacher, whose classroom is simply the way they live.",
    "Carrying a master number is not a prize; it is a higher voltage running through ordinary wiring. Most who hold one spend years living its reduced form (the 2, the 4, the 6) before the full current switches on — usually in seasons of great pressure. If that is you, be patient with the flicker.",
    "And if your chart holds no master numbers at all, hear this clearly: the masters are not 'better'. A 7 who truly lives its depth out-shines an 11 who hides from its own light. The number is the instrument — the music is always yours.",
  ]},
  { id: "karmic", cat: "Numerology", colour: "#7fd4e0", title: "Karmic debt numbers: 13, 14, 16 and 19", min: 3, body: [
    "Sometimes, on the way to a reduced number, your birth date or name passes through one of four way-stations: 13, 14, 16 or 19. Traditional numerology calls these karmic debt numbers — old lessons asking to be finished this time around.",
    "Don't let the word 'debt' frighten you. This is not punishment; it is unfinished curriculum. A karmic number simply marks the place where the soul says: 'here — this one we practise until it's beautiful.'",
    "## The four lessons",
    "13 (living as 4) is the debt of work left undone — it asks for honest, patient labour and rewards it doubly. 14 (living as 5) is the debt of freedom once misused — it asks for moderation inside adventure. 16 (living as 7) is the debt of the toppled tower — pride in love and spirit, rebuilt on truer foundations. 19 (living as 1) is the debt of power once hoarded — it asks you to lead while letting yourself be helped.",
    "You find them by watching the totals *before* reduction. If your Life Path calculation passes through 16 on its way to 7, you are a 7 — and the 16 tells you which door your 7 walks in through.",
    "Seen kindly, a karmic number is the most hopeful thing in a chart: it means the lesson is ready to be completed. The debt only lingers while it is ignored.",
  ]},
  { id: "livednumbers", cat: "Numerology", colour: "#7fd4e0", title: "The numbers you live inside: homes and phones", min: 3, body: [
    "Your Life Path describes the road you walk — but numerology has always noticed that we also *live inside* numbers. The address on your door and the phone number in your pocket are frequencies you touch every single day.",
    "A house number is found by adding its digits (a flat like 12B adds the letter too — B carries the value 2). Number 47 becomes 4 + 7 = 11 — a master-number home, a lightning rod under a roof. This doesn't overwrite who lives there; it flavours the air. A 4 home steadies its people. A 5 home keeps the suitcase by the door. A 9 home quietly collects people who are finishing chapters of their lives.",
    "Phone numbers work the same way — add every digit, reduce, and you have the line's vibration: the kind of conversations it attracts. An 8 line hums with opportunity and negotiation; a 2 line becomes the one friends call at midnight to feel heard.",
    "## Choosing and balancing",
    "None of this is fate — it is furniture. If your home's number runs hot (1, 5, 8), balance it with grounding ritual: shared meals, plants, stone, routine. If it runs quiet (2, 4, 7), invite aliveness in on purpose. And if you're choosing between two flats or two SIM cards — now you have one more beautiful way to listen.",
    "The deeper principle, for those who've walked with numbers a long time: environment-numerology is the practice of *consent*. You are not ruled by the number on the door. You are in conversation with it.",
  ]},
  { id: "pairs", cat: "Numerology", colour: "#7fd4e0", title: "Numerology for two: how paths entwine", min: 4, body: [
    "Compare two Life Paths and you are really asking: what does each soul practise — and what happens when the practices share a kitchen?",
    "Pairings tend to fall into three weathers. Flowing bonds (like 3 with 5, or 2 with 6) share a dialect: energy moves easily, laughter comes cheap, and the danger is only shallowness — easy love still needs deliberate roots. Balancing bonds (like 1 with 2, or 4 with 9) pair a strength with its complement: one initiates while the other harmonises, one builds while the other blesses. These couples translate for each other, and the translation is the intimacy. Forging bonds (like 1 with 8, or 4 with 5) put iron against iron — heat, growth, the occasional spark off the anvil. Handled with respect, nothing makes stronger metal.",
    "## No doomed numbers",
    "Hear this before anything else: there are no doomed pairings in numerology. A 'difficult' combination between two conscious people outgrows an 'easy' one between two sleepwalkers every single time. The chart describes the dance floor, never the dancers' skill.",
    "Master numbers in a pairing (11, 22, 33) add voltage to whatever weather exists — more inspiration, more intensity, more need for grounding rituals made for two.",
    "Beyond Life Paths, adepts compare Soul Urge numbers (what each heart privately wants) and Personal Years (what season each partner is standing in — a 1-year partner is sprinting at dawn while a 9-year partner is lighting lamps at dusk; knowing this dissolves half of all timing arguments).",
    "Use the Partnership calculator here as a beginning, not a verdict. The numbers open the conversation — you two are the answer.",
  ]},
  { id: "bigthree", cat: "Astrology", colour: "#b898e8", title: "Sun, Moon and Rising: your three-fold self", min: 4, body: [
    "'What's your sign?' almost always means your Sun sign — where the Sun stood on your birthday. It is real and it matters: the Sun is your core voltage, the hero of your story, the thing you are learning to *be*. But a birth chart holds a whole sky, and two other placements share the throne.",
    "Your Moon sign is where the Moon sat at your birth — the tides underneath. It describes your emotional weather, what safety feels like, who you are at 2 a.m. when nobody is performing. Many people feel more like their Moon than their Sun, especially in private, especially in love.",
    "Your Rising sign (the Ascendant) is the sign that was dawning on the eastern horizon at the exact minute you arrived — which is why the birth *time* matters so much. It is the doorway self: first impressions, your instinctive way of meeting the new. People who 'don't seem like their sign' are usually being read by their Rising.",
    "## The three in one breath",
    "A gentle formula: the Rising is how you enter the room, the Sun is why you came, and the Moon is what you need before you can leave whole. A Leo Sun with a Cancer Moon and Virgo Rising might arrive quietly checking the details, radiate warmth once seen, and need real tenderness after the crowd goes home. No contradiction — three instruments, one music.",
    "If you know your birth time, Luminae's natal reading can begin weaving all three. If you don't, ask a parent, hunt for the birth certificate — or simply read your Moon possibilities and *feel* for the tide that recognises you. Your own resonance is evidence too.",
  ]},
  { id: "elements", cat: "Astrology", colour: "#b898e8", title: "Fire, Earth, Air, Water — the sky's four temperaments", min: 3, body: [
    "The twelve signs are not twelve strangers — they are four families, three siblings each. Fire (Aries, Leo, Sagittarius) runs on inspiration: it wants to act, to shine, to believe. Earth (Taurus, Virgo, Capricorn) runs on manifestation: it wants to build, to tend, to finish. Air (Gemini, Libra, Aquarius) runs on connection: it wants to think, to relate, to name. Water (Cancer, Scorpio, Pisces) runs on feeling: it wants to bond, to sense, to heal.",
    "Crossed with the elements are the three modalities — the *how* of each family. Cardinal signs (Aries, Cancer, Libra, Capricorn) start the season: initiators. Fixed signs (Taurus, Leo, Scorpio, Aquarius) hold its middle: sustainers. Mutable signs (Gemini, Virgo, Sagittarius, Pisces) close and hand it on: transformers. Twelve signs, four elements, three modes — a perfect weave with no repeats.",
    "## Using this today",
    "Element language explains chemistry faster than almost anything: fire delights air (wind feeds flame), earth banks water (banks let rivers flow) — while fire can scorch water into steam and air can erode earth's patience. None of these are verdicts; they are weather reports for relationships.",
    "And within yourself: when you feel flat, borrow the missing element. Too airy and anxious? Touch earth — cook, garden, walk. Too fiery and scorched? Visit water — bathe, weep, listen to rain. The elements are a first-aid kit as old as the sky.",
  ]},
  { id: "houses", cat: "Astrology", colour: "#b898e8", title: "The twelve houses: where the sky touches your life", min: 4, body: [
    "If signs are *how* an energy behaves, houses are *where* it lands. The birth chart is a wheel of twelve rooms, and every planet in your chart stands in one of them — colouring one province of your life.",
    "The wheel begins at your Rising sign and moves through the great human territories: the 1st house is the self and the body's arrival; the 2nd, worth and what you own; the 3rd, words, siblings, the neighbourhood mind; the 4th, home and roots and the parent who held you; the 5th, romance, art, play, children; the 6th, work, health, the sacred daily grind.",
    "Then the wheel crosses to others: the 7th house is partnership — every 'we' you formally make; the 8th, the deep exchanges — intimacy, shared money, transformation; the 9th, the far horizon — travel, philosophy, faith; the 10th, vocation and the public name you carve; the 11th, friends, community, the future you belong to; and the 12th, the hidden sea — dreams, solitude, the unconscious, the last room before the wheel begins again.",
    "## Reading with houses",
    "This is why two Leos can live such different lives: a Leo Sun in the 10th house performs its fire in public vocation; the same Sun in the 4th warms a home like a hearth and may never want a stage at all.",
    "Houses need your birth time — the wheel turns completely every 24 hours, so even an hour's difference re-rooms the planets. It is the single best reason to hunt down that birth certificate: it turns astrology from a horoscope into a map with an address.",
  ]},
  { id: "firstchart", cat: "Astrology", colour: "#b898e8", title: "How to read a birth chart without fear", min: 4, body: [
    "The first time you open a real birth chart it looks like the cockpit of a starship — glyphs, angles, a wheel sliced twelve ways. Breathe. Every working astrologer began exactly this lost, and the chart opens to a simple key: planet, sign, house. Who — how — where.",
    "Each planet is a character in your inner company: the Sun (purpose), the Moon (needs), Mercury (mind and voice), Venus (love and taste), Mars (drive and anger), Jupiter (growth and luck), Saturn (discipline and time), and the slow outer three — Uranus, Neptune, Pluto — who move so gradually they shape whole generations' weather.",
    "The sign a planet occupies is its costume and dialect: Mercury in Scorpio thinks like a detective; Mercury in Sagittarius thinks like an explorer. The house is its address — which room of your life that character mostly works in.",
    "## A gentle first reading",
    "Start with only three sentences. Find your Sun: 'my purpose behaves like ___ in the room of ___.' Find your Moon: 'my needs behave like ___ in the room of ___.' Find your Rising: 'I arrive like ___.' That is already a truer portrait than any newspaper column, and you built it yourself.",
    "Two kindnesses as you go deeper. First: there are no bad charts — a 'hard' aspect is torque, and torque is how engines move. Second: the chart describes weather, never worth. You remain the one who sails. Astrology's oldest secret is that it was never fortune-telling — it is self-remembering with a map of the sky.",
  ]},
];

/* ---------------- Claude API ---------------- */
const LUMINAE_VOICE = `You are the voice of Luminae, a sacred spiritual sanctuary app. You write as a wise, loving presence — warm, reverent, never clinical. Use words like sacred, beloved, seeker, illuminate, journey, pure. Never use words like scan, detect, analyze, process. Never make medical claims or definitive predictions; use possibility language ("this energy suggests...", "the cards invite you to consider..."). Every reading opens from a place of pure intent, golden light, and the highest good of all. Keep responses focused and beautiful — around 250-400 words unless asked otherwise. You may use short paragraphs and the occasional gentle heading, but never bullet-point lists of keywords.`;

/* The seeker's Anthropic API key, read from a Vite env var at build time.
   Create a `.env` (or `.env.local`) with:  VITE_ANTHROPIC_API_KEY=sk-ant-...
   Note: this ships the key into the browser bundle — fine for a personal,
   locally-run sanctuary, but for a public deployment route calls through a
   small server-side proxy instead so the key is never exposed. */
const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const apiKey = () => (import.meta.env && import.meta.env.VITE_ANTHROPIC_API_KEY) || "";
const anthropicHeaders = () => ({
  "Content-Type": "application/json",
  "x-api-key": apiKey(),
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
});

async function askLuminae(userPrompt, extraSystem = "", history = []) {
  /* Local dev with a VITE key calls Anthropic directly; otherwise we speak to
     the deployed Worker's /api/luminae proxy, which holds the key server-side
     (set with: npx wrangler secret put ANTHROPIC_API_KEY). */
  const direct = !!apiKey();
  const res = await fetch(direct ? "https://api.anthropic.com/v1/messages" : "/api/luminae", {
    method: "POST",
    headers: direct ? anthropicHeaders() : { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
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
    @keyframes inkIn { from { opacity: 0; filter: blur(6px); transform: translateY(4px); } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
    @keyframes bloomFull { from { transform: scale(.15); border-radius: 22px; opacity: .3; } to { transform: scale(1); border-radius: 0; opacity: 1; } }
    @keyframes haloPulse { 0%, 100% { transform: scale(1); opacity: .5; } 50% { transform: scale(1.16); opacity: .95; } }
    .ink-word { display: inline-block; animation: inkIn .6s ease both; margin-right: .3em; }
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

const VersionBadge = () => {
  const stamp = new Date(__BUILD_TIME__).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <div className="lum-sans" style={{
      position: "fixed", top: 10, right: 12, zIndex: 999, pointerEvents: "none",
      fontSize: 10.5, letterSpacing: ".03em", color: T.faint,
      background: "rgba(13,13,26,.55)", border: "1px solid rgba(201,168,76,.18)",
      borderRadius: 10, padding: "3px 9px",
    }}>v{__APP_VERSION__} · {stamp}</div>
  );
};

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
    const all = (window.speechSynthesis?.getVoices?.() || []).filter((v) => /^en(-|_|$)/i.test(v.lang));
    if (!all.length) return null;
    // Avoid the harsh, robotic engines (eSpeak/Festival/Pico are common on Linux
    // and sound "possessed"); reach first for natural/neural voices, ideally a
    // warm feminine one, before falling back to whatever clear voice exists.
    const robotic = /espeak|festival|robosoft|flite|pico|mbrola|david|mark|zira/i;
    const natural = /natural|neural|google|premium|enhanced|siri|wavenet/i;
    const warm = /samantha|karen|moira|tessa|fiona|serena|allison|ava|susan|kate|sonia|libby|jenny|natasha|aria|female|woman/i;
    const pool = all.filter((v) => !robotic.test(v.name)); const list = pool.length ? pool : all;
    return list.find((v) => natural.test(v.name) && warm.test(v.name))
      || list.find((v) => warm.test(v.name))
      || list.find((v) => natural.test(v.name))
      || list.find((v) => v.default) || list[0];
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
  // Gentle keep-alive: only nudge if the browser auto-paused. Never pause active
  // speech — pausing mid-utterance is what made the voice stutter & sound possessed.
  const keep = setInterval(() => { try { if (synth.paused) synth.resume(); } catch (e) {} }, 5000);
  const finish = () => { clearInterval(keep); if (!cancelled && onDone) onDone(); };
  const next = () => {
    if (cancelled) return;
    if (i >= pieces.length) return finish();
    const u = new SpeechSynthesisUtterance(pieces[i++]);
    if (v) u.voice = v;
    u.rate = rate; u.pitch = 1.06; u.volume = 1;
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
/* ---------------- The Library reader & learn-more buttons ---------------- */
const LearnBtn = ({ id, onOpen, children }) => (
  <button onClick={() => onOpen(id)} className="lum-sans" style={{ background: "rgba(232,201,122,.07)", border: "1px solid rgba(232,201,122,.35)", borderRadius: 20, color: T.goldHi, fontSize: 12, padding: "7px 14px", cursor: "pointer", letterSpacing: ".05em" }}>
    📜 {children || "Learn more"} ✧
  </button>
);

const ArticleOverlay = ({ id, onOpen, onClose }) => {
  const art = LEARN.find((a) => a.id === id);
  if (!art) return null;
  const related = LEARN.filter((a) => a.id !== id);
  return (
    <div className="fade-up" style={{ position: "fixed", inset: 0, zIndex: 96, background: "rgba(9,9,20,.985)", overflowY: "auto", padding: "24px 20px 70px" }}>
      <div style={{ maxWidth: 630, margin: "0 auto" }}>
        <button onClick={onClose} className="lum-sans" style={{ background: "none", border: "none", color: T.dim, fontSize: 13, cursor: "pointer", padding: "6px 0", letterSpacing: ".06em", marginBottom: 6 }}>← Return</button>
        <Eyebrow colour={art.colour}>{art.cat} · The Library · {art.min} min</Eyebrow>
        <H size={30}>{art.title}</H>
        <div style={{ marginTop: 16 }}>
          {art.body.map((p, i) => p.startsWith("## ")
            ? <div key={i} className="lum-serif" style={{ color: T.goldHi, fontSize: 21, margin: "24px 0 8px" }}>{p.slice(3)}</div>
            : <p key={i} className="lum-serif" style={{ color: T.ink, fontSize: 17.5, lineHeight: 1.85, margin: "0 0 15px" }}>{p}</p>)}
        </div>
        <div className="lum-sans" style={{ color: T.faint, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", margin: "26px 0 10px" }}>Keep reading</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {related.map((a) => (
            <button key={a.id} onClick={() => onOpen(a.id)} className="lum-sans" style={{ background: "rgba(233,230,242,.05)", border: `1px solid ${a.colour}44`, borderRadius: 14, color: T.ink, fontSize: 12.5, padding: "9px 14px", cursor: "pointer", textAlign: "left" }}>
              <span style={{ color: a.colour }}>{a.cat}</span> · {a.title}
            </button>
          ))}
        </div>
        <p className="lum-serif" style={{ fontStyle: "italic", color: T.faint, fontSize: 14, marginTop: 28 }}>From the Luminae Library — written for first steps and old souls alike. ✧</p>
        <Btn small onClick={onClose} style={{ marginTop: 4 }}>Return ✧</Btn>
      </div>
    </div>
  );
};

/* ---------------- Sign lore card ---------------- */
const Chip = ({ label, value, hue }) => (
  <div className="lum-sans" style={{ border: `1px solid ${hue}55`, background: `${hue}12`, borderRadius: 14, padding: "6px 12px", fontSize: 11.5, color: T.ink }}>
    <span style={{ color: hue, letterSpacing: ".1em", textTransform: "uppercase", fontSize: 9.5 }}>{label}</span> {value}
  </div>
);

const SignLoreCard = ({ name }) => {
  const L = SIGN_LORE[name];
  if (!L) return null;
  const hue = ELEMENT_HUE[L.element];
  const row = (icon, label, text) => (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 10 }}>
      <span style={{ fontSize: 15, flexShrink: 0, width: 22, textAlign: "center" }}>{icon}</span>
      <div>
        <span className="lum-sans" style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: hue }}>{label}</span>
        <div className="lum-sans" style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.6, marginTop: 1 }}>{text}</div>
      </div>
    </div>
  );
  return (
    <Panel style={{ padding: 20, borderColor: hue + "55", background: `radial-gradient(130% 160% at 12% 0%, ${hue}1e, transparent 55%), linear-gradient(165deg, #16152b, #0e0e1b)`, boxShadow: `0 0 30px ${hue}1a` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div aria-hidden style={{ position: "absolute", inset: -8, borderRadius: "50%", background: `radial-gradient(circle, ${hue}55, transparent 70%)`, animation: "haloPulse 3s ease-in-out infinite" }} />
          <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", border: `1.5px solid ${hue}88`, background: `radial-gradient(circle at 35% 30%, ${hue}44, #14121f 75%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: hue, textShadow: `0 0 16px ${hue}` }}>{L.glyph}</div>
        </div>
        <div>
          <div className="lum-serif" style={{ fontSize: 26, color: T.ink, textShadow: `0 0 22px ${hue}66` }}>{name}</div>
          <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, letterSpacing: ".08em" }}>{L.dates}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
        <Chip label="Element" value={L.element} hue={hue} />
        <Chip label="Mode" value={L.modality} hue={hue} />
        <Chip label="Ruler" value={L.ruler} hue={hue} />
        <Chip label="Stone" value={L.stone} hue={hue} />
      </div>
      <p className="lum-serif" style={{ color: T.ink, fontSize: 16.5, fontStyle: "italic", lineHeight: 1.75, margin: "14px 0 4px" }}>{L.essence}</p>
      {row("☀", "In their light", L.light)}
      {row("🌑", "Shadow work", L.shadow)}
      {row("💞", "In love", L.love)}
      {row("⚒", "In work", L.work)}
      <div className="lum-serif" style={{ marginTop: 14, fontSize: 15.5, fontStyle: "italic", color: hue, textAlign: "center" }}>“{L.mantra}”</div>
    </Panel>
  );
};

const AstrologyScreen = ({ paid, askUpgrade, birth, setBirth }) => {
  const [tab, setTab] = useState("mysign");
  const [browse, setBrowse] = useState("Aries");
  const [article, setArticle] = useState(null);
  const [out, setOut] = useState(""); const [loading, setLoading] = useState(false); const [note, setNote] = useState("");
  const sign = birth.dob ? sunSign(Number(birth.dob.slice(5, 7)), Number(birth.dob.slice(8, 10))) : null;
  const moon = moonPhase();

  const fallbackWeekly = () => {
    const L = SIGN_LORE[sign.name];
    return `The ${moon.name} sets this week's rhythm, ${sign.name}: ${MOON_MEANINGS[moon.name]}\n\nAs ${L.modality.toLowerCase()} ${L.element.toLowerCase()} ruled by ${L.ruler}, lean into what is most yours — ${L.light} And keep one kind eye on the familiar shadow: ${L.shadow}\n\nAn intention to carry: “${L.mantra}”`;
  };
  const weekly = async () => {
    if (!sign) return;
    setOut(""); setNote(""); setLoading(true);
    try {
      setOut(await askLuminae(`Write this week's horoscope for ${sign.name} (${SIGN_LORE[sign.name].modality} ${SIGN_LORE[sign.name].element}, ruled by ${SIGN_LORE[sign.name].ruler}). Current moon phase: ${moon.name}. Include the week's energy theme, a gentle area of focus, one loving warning drawn from the sign's shadow side, and one intention suggestion. Today is ${new Date().toDateString()}.`));
    } catch (e) { setOut(fallbackWeekly()); setNote("A moon-guided reflection, while the deeper channel rests."); }
    setLoading(false);
  };
  const natal = async () => {
    if (!paid) return askUpgrade("Your full natal chart reading lives in Illuminate.");
    setOut(""); setNote(""); setLoading(true);
    try {
      setOut(await askLuminae(`Create a personalised natal energy portrait for a seeker born ${birth.dob} at ${birth.time || "an unknown time"} in ${birth.place || "an unknown place"}. Sun sign: ${sign.name}. Speak to their core essence, emotional nature (Moon possibilities if time unknown), gifts, and soul lessons. Include this week's energy theme, favourable days, days to move gently, a weekly intention, and one recommended sound frequency or meditation. Note gently that exact planetary placements deepen with a precise birth time.`));
    } catch (e) { setOut("The stars are quiet for a moment, beloved. Please try again."); }
    setLoading(false);
  };
  const switchTab = (t) => { setTab(t); setOut(""); setNote(""); };

  return (
    <div className="fade-up" style={{ maxWidth: 580 }}>
      <Eyebrow colour={T.violet}>Astrology</Eyebrow>
      <H>Written in the stars</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 13.5, lineHeight: 1.6 }}>Whether this is your first sky-map or your thousandth — the heavens hold a seat for you.</p>

      <Panel style={{ margin: "16px 0", padding: 18, borderColor: T.violet + "44", background: "radial-gradient(130% 160% at 88% 0%, #b898e81c, transparent 55%), linear-gradient(165deg, #16152b, #0e0e1b)" }}>
        <div className="lum-sans" style={{ fontSize: 11, color: T.dim, marginBottom: 10, letterSpacing: ".16em" }}>YOUR BIRTH DETAILS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input type="date" value={birth.dob} onChange={(e) => setBirth({ ...birth, dob: e.target.value })} className="lum-sans" style={inp} aria-label="Date of birth" />
          <input type="time" value={birth.time} onChange={(e) => setBirth({ ...birth, time: e.target.value })} className="lum-sans" style={inp} aria-label="Time of birth" />
          <input placeholder="Place of birth" value={birth.place} onChange={(e) => setBirth({ ...birth, place: e.target.value })} className="lum-sans" style={{ ...inp, gridColumn: "1 / -1" }} />
        </div>
        {sign && <div className="lum-serif" style={{ color: T.goldHi, fontSize: 20, marginTop: 12 }}>{sign.glyph} {sign.name} Sun</div>}
        <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, marginTop: 6, lineHeight: 1.6 }}>{moon.icon} <span style={{ color: T.moon }}>{moon.name}</span> — {MOON_MEANINGS[moon.name]}</div>
        {!birth.time && <div className="lum-sans" style={{ fontSize: 11.5, color: T.faint, marginTop: 8 }}>Add a birth time when you find it — it unlocks your Rising sign and houses. No time? You're still fully welcome here.</div>}
      </Panel>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <Btn small kind={tab === "mysign" ? "gold" : "ghost"} onClick={() => switchTab("mysign")}>My Sign</Btn>
        <Btn small kind={tab === "twelve" ? "gold" : "ghost"} onClick={() => switchTab("twelve")}>The Twelve</Btn>
        <Btn small kind={tab === "weekly" ? "gold" : "ghost"} onClick={() => switchTab("weekly")}>Weekly ✧</Btn>
        <Btn small kind={tab === "natal" ? "gold" : "ghost"} onClick={() => switchTab("natal")}>Natal Chart {!paid && "🔒"}</Btn>
      </div>

      {tab === "mysign" && (sign ? (
        <div style={{ display: "grid", gap: 14 }}>
          <SignLoreCard name={sign.name} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <LearnBtn id="bigthree" onOpen={setArticle}>Sun, Moon & Rising</LearnBtn>
            <LearnBtn id="elements" onOpen={setArticle}>The four elements</LearnBtn>
          </div>
        </div>
      ) : <p className="lum-sans" style={{ color: T.faint, fontSize: 14 }}>Enter your date of birth above, beloved — your sun sign will step forward.</p>)}

      {tab === "twelve" && (
        <div style={{ display: "grid", gap: 14 }}>
          <p className="lum-sans" style={{ color: T.dim, fontSize: 13 }}>Every sign, no gate — read for the people you love.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {SIGN_ORDER.map((n) => {
              const hue = ELEMENT_HUE[SIGN_LORE[n].element]; const on = browse === n;
              return (
                <button key={n} onClick={() => setBrowse(n)} aria-label={n} className="lum-serif" style={{ background: on ? `${hue}22` : "rgba(233,230,242,.04)", border: `1px solid ${on ? hue + "aa" : "rgba(233,230,242,.12)"}`, borderRadius: 12, color: on ? hue : T.dim, fontSize: 22, padding: "10px 0", cursor: "pointer", textShadow: on ? `0 0 12px ${hue}` : "none", transition: "all .25s" }}>
                  {SIGN_LORE[n].glyph}
                </button>
              );
            })}
          </div>
          <SignLoreCard name={browse} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <LearnBtn id="houses" onOpen={setArticle}>The twelve houses</LearnBtn>
            <LearnBtn id="firstchart" onOpen={setArticle}>Reading your first chart</LearnBtn>
          </div>
        </div>
      )}

      {tab === "weekly" && (!sign
        ? <p className="lum-sans" style={{ color: T.faint, fontSize: 14 }}>Enter your date of birth above to reveal your week.</p>
        : <div>
            {!out && !loading && <Btn onClick={weekly}>Reveal my week ✧</Btn>}
            {loading && <Channeling text="Reading the heavens…" />}
            {out && <Panel style={{ padding: 26 }}><ReadingText text={out} />{note && <p className="lum-sans" style={{ color: T.faint, fontSize: 11.5, marginTop: 12 }}>🌙 {note}</p>}</Panel>}
          </div>)}

      {tab === "natal" && (!sign
        ? <p className="lum-sans" style={{ color: T.faint, fontSize: 14 }}>Enter your date of birth above to open your chart.</p>
        : <div>
            {!out && !loading && (
              <div style={{ display: "grid", gap: 12 }}>
                <Btn onClick={natal}>Open my chart ✧ {!paid && "🔒"}</Btn>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <LearnBtn id="bigthree" onOpen={setArticle}>What a natal chart holds</LearnBtn>
                  <LearnBtn id="houses" onOpen={setArticle}>The houses explained</LearnBtn>
                </div>
              </div>
            )}
            {loading && <Channeling text="Unrolling your sky-map…" />}
            {out && <Panel style={{ padding: 26 }}><ReadingText text={out} /></Panel>}
            {paid && <p className="lum-sans" style={{ color: T.faint, fontSize: 11.5, marginTop: 14 }}>Production note: precise planetary placements will use ephemeris data (AstrologyAPI) at launch.</p>}
          </div>)}

      {article && <ArticleOverlay id={article} onOpen={setArticle} onClose={() => setArticle(null)} />}
    </div>
  );
};
const inp = { background: "#141428", border: "1px solid rgba(201,168,76,.25)", borderRadius: 10, color: "#e9e6f2", padding: "11px 13px", fontSize: 14, width: "100%", colorScheme: "dark" };

/* ============================================================
   NUMEROLOGY
   ============================================================ */
const CORE_KEYS = {
  "Life Path": "the road your life keeps inviting you down — the most important number in the chart",
  "Destiny": "drawn from your full name — the work your life is quietly assembling",
  "Soul Urge": "the vowels of your name — what your heart privately wants",
  "Personality": "the consonants — the self you show at the door",
  "Expression": "how your gifts most naturally move into the world",
  "Personal Year": "the season you are standing in right now (it changes each year)",
};

const NumberMeaningCard = ({ n, context, spin }) => {
  const M = NUM_MEANINGS[n];
  if (!M) return null;
  const master = n === 11 || n === 22 || n === 33;
  return (
    <div className="fade-up">
    <Panel style={{ padding: 20, borderColor: T.teal + "55", background: "radial-gradient(130% 160% at 12% 0%, #7fd4e01a, transparent 55%), linear-gradient(165deg, #14182b, #0e0e1b)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div aria-hidden style={{ position: "absolute", inset: -8, borderRadius: "50%", background: "radial-gradient(circle, #7fd4e055, transparent 70%)", animation: "haloPulse 3s ease-in-out infinite" }} />
          <div className="lum-serif" style={{ position: "relative", width: 62, height: 62, borderRadius: "50%", border: "1.5px solid #7fd4e088", background: "radial-gradient(circle at 35% 30%, #7fd4e033, #14121f 75%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: T.teal, textShadow: "0 0 16px #7fd4e0" }}>{n}</div>
        </div>
        <div>
          <div className="lum-serif" style={{ fontSize: 23, color: T.ink, textShadow: "0 0 20px #7fd4e055" }}>{M.title}{master && <span className="lum-sans" style={{ fontSize: 10, letterSpacing: ".14em", color: T.goldHi, border: `1px solid ${T.gold}66`, borderRadius: 10, padding: "2px 8px", marginLeft: 10, verticalAlign: "middle", textTransform: "uppercase" }}>Master</span>}</div>
          {context && <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 2 }}>{context}</div>}
        </div>
      </div>
      <p className="lum-serif" style={{ color: T.ink, fontSize: 16, fontStyle: "italic", lineHeight: 1.7, margin: "13px 0 4px" }}>{M.essence}</p>
      {spin && <p className="lum-sans" style={{ color: T.dim, fontSize: 13.5, lineHeight: 1.65, margin: "8px 0 0" }}>{spin}</p>}
      <div className="lum-sans" style={{ color: T.dim, fontSize: 13, marginTop: 10 }}><span style={{ color: T.teal, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase" }}>In their light</span> {M.light}</div>
      <div className="lum-serif" style={{ marginTop: 12, fontSize: 15, fontStyle: "italic", color: T.teal, textAlign: "center" }}>“{M.invitation}”</div>
    </Panel>
    </div>
  );
};

const NumerologyScreen = ({ paid, askUpgrade, birth, setBirth }) => {
  const [tab, setTab] = useState("profile");
  const [article, setArticle] = useState(null);
  const [name, setName] = useState("");
  const [nums, setNums] = useState(null);
  const [sel, setSel] = useState("Life Path");
  const [out, setOut] = useState(""); const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [home, setHome] = useState("");
  const [dobB, setDobB] = useState("");

  const calc = () => {
    if (!birth.dob || !name.trim()) return;
    const [y, m, d] = birth.dob.split("-").map(Number);
    setNums({
      "Life Path": lifePath(y, m, d), "Destiny": sumName(name), "Soul Urge": sumName(name, "v"),
      "Personality": sumName(name, "c"), "Expression": sumName(name), "Personal Year": personalYear(m, d),
    });
    setSel("Life Path"); setOut("");
  };
  const portrait = async () => {
    if (!paid) return askUpgrade("The fully woven written portrait lives in Illuminate — your numbers and their meanings are always free.");
    setOut(""); setLoading(true);
    try {
      setOut(await askLuminae(`Write a personalised numerology reading for a seeker named ${name}, born ${birth.dob}. Their numbers: ${Object.entries(nums).map(([k, v]) => `${k} ${v}`).join(", ")}. Explain each number in plain, warm language (no assumed prior knowledge, but never condescending — some seekers are adepts), beginning with the Life Path as the most important. Weave them into one portrait of who they are becoming.`));
    } catch (e) { setOut("The written weaving will return in a moment, beloved — your numbers above hold true. Please try again."); }
    setLoading(false);
  };

  const sumDigits = (str) => { const ds = str.replace(/\D/g, ""); return ds ? reduceNum(ds.split("").reduce((s, c) => s + Number(c), 0)) : null; };
  const phoneNum = sumDigits(phone);
  const homeNum = (() => {
    const cleaned = home.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!cleaned) return null;
    const total = cleaned.split("").reduce((s, c) => s + (/[0-9]/.test(c) ? Number(c) : (LETTER_VAL[c] || 0)), 0);
    return total ? reduceNum(total) : null;
  })();
  const lpFrom = (dob) => { if (!dob) return null; const [y, m, d] = dob.split("-").map(Number); return lifePath(y, m, d); };
  const lpA = lpFrom(birth.dob), lpB = lpFrom(dobB);
  const verdict = lpA && lpB ? pairVerdict(lpA, lpB) : null;
  const switchTab = (t) => { setTab(t); setOut(""); };
  const numTile = (k, v, on, click) => (
    <Panel key={k} hover={!!click} onClick={click} style={{ textAlign: "center", padding: 13, borderColor: on ? T.teal + "88" : "rgba(201,168,76,0.14)", background: on ? "radial-gradient(120% 150% at 50% 0%, #7fd4e022, transparent 60%), linear-gradient(160deg, #14182b, #0e0e1b)" : undefined, boxShadow: on ? "0 0 18px #7fd4e022" : "none" }}>
      <div className="lum-serif gold-shimmer" style={{ fontSize: 32, fontWeight: 600 }}>{v}</div>
      <div className="lum-sans" style={{ fontSize: 10, color: on ? T.teal : T.dim, letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>{k}</div>
    </Panel>
  );

  return (
    <div className="fade-up" style={{ maxWidth: 580 }}>
      <Eyebrow colour={T.teal}>Numerology</Eyebrow>
      <H>The language of numbers</H>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 13.5, lineHeight: 1.6 }}>Names, birthdays, front doors, phone numbers — the whole world hums in number. Every meaning here is open to you, free; no experience required, none assumed.</p>

      <div style={{ display: "flex", gap: 8, margin: "16px 0", flexWrap: "wrap" }}>
        <Btn small kind={tab === "profile" ? "gold" : "ghost"} onClick={() => switchTab("profile")}>Soul Profile</Btn>
        <Btn small kind={tab === "phone" ? "gold" : "ghost"} onClick={() => switchTab("phone")}>Phone</Btn>
        <Btn small kind={tab === "home" ? "gold" : "ghost"} onClick={() => switchTab("home")}>Home</Btn>
        <Btn small kind={tab === "pair" ? "gold" : "ghost"} onClick={() => switchTab("pair")}>Partnership</Btn>
      </div>

      {tab === "profile" && (
        <div style={{ display: "grid", gap: 14 }}>
          <Panel style={{ padding: 18, display: "grid", gap: 10, borderColor: T.teal + "33" }}>
            <input placeholder="Full birth name (as first given)" value={name} onChange={(e) => setName(e.target.value)} className="lum-sans" style={inp} />
            <input type="date" value={birth.dob} onChange={(e) => setBirth({ ...birth, dob: e.target.value })} className="lum-sans" style={inp} aria-label="Date of birth" />
            <Btn onClick={calc} disabled={!name.trim() || !birth.dob}>Reveal my numbers ✧</Btn>
          </Panel>
          {nums && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {Object.entries(nums).map(([k, v]) => numTile(k, v, sel === k, () => setSel(k)))}
              </div>
              <div className="lum-sans" style={{ fontSize: 11.5, color: T.faint, marginTop: -6 }}>Tap any number to read its meaning — {CORE_KEYS[sel]}.</div>
              <NumberMeaningCard n={nums[sel]} context={`Your ${sel}`} />
              {!out && !loading && <Btn onClick={portrait}>Weave my full written portrait ✧ {!paid && "🔒"}</Btn>}
              {loading && <Channeling text="Reading your blueprint…" />}
              {out && <Panel style={{ padding: 26 }}><ReadingText text={out} /></Panel>}
            </>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <LearnBtn id="masters" onOpen={setArticle}>Master numbers</LearnBtn>
            <LearnBtn id="karmic" onOpen={setArticle}>Karmic debt numbers</LearnBtn>
          </div>
        </div>
      )}

      {tab === "phone" && (
        <div style={{ display: "grid", gap: 14 }}>
          <Panel style={{ padding: 18, display: "grid", gap: 10, borderColor: T.teal + "33" }}>
            <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6 }}>Your phone number is a frequency you answer every day. Enter it — spaces and dashes are fine.</div>
            <input placeholder="e.g. 0412 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} className="lum-sans" style={inp} inputMode="tel" />
          </Panel>
          {phoneNum && <NumberMeaningCard n={phoneNum} context="Your phone's vibration" spin={`Through this line flow ${PHONE_SPIN[phoneNum]}`} />}
          <div><LearnBtn id="livednumbers" onOpen={setArticle}>Homes, phones & lived numbers</LearnBtn></div>
        </div>
      )}

      {tab === "home" && (
        <div style={{ display: "grid", gap: 14 }}>
          <Panel style={{ padding: 18, display: "grid", gap: 10, borderColor: T.teal + "33" }}>
            <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6 }}>Enter your house or unit number — letters count too (12B adds B's value of 2).</div>
            <input placeholder="e.g. 47, or 12B" value={home} onChange={(e) => setHome(e.target.value)} className="lum-sans" style={inp} />
          </Panel>
          {homeNum && <NumberMeaningCard n={homeNum} context="Your home's vibration" spin={HOME_SPIN[homeNum]} />}
          <div><LearnBtn id="livednumbers" onOpen={setArticle}>Homes, phones & lived numbers</LearnBtn></div>
        </div>
      )}

      {tab === "pair" && (
        <div style={{ display: "grid", gap: 14 }}>
          <Panel style={{ padding: 18, display: "grid", gap: 10, borderColor: T.teal + "33" }}>
            <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6 }}>Two birthdays, two Life Paths, one dance. For lovers, friends, business partners — any two souls.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div className="lum-sans" style={{ fontSize: 10.5, color: T.faint, letterSpacing: ".1em", marginBottom: 4 }}>YOU</div>
                <input type="date" value={birth.dob} onChange={(e) => setBirth({ ...birth, dob: e.target.value })} className="lum-sans" style={inp} aria-label="Your date of birth" />
              </div>
              <div>
                <div className="lum-sans" style={{ fontSize: 10.5, color: T.faint, letterSpacing: ".1em", marginBottom: 4 }}>THEM</div>
                <input type="date" value={dobB} onChange={(e) => setDobB(e.target.value)} className="lum-sans" style={inp} aria-label="Their date of birth" />
              </div>
            </div>
          </Panel>
          {verdict && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center" }}>
                {numTile("Your path", lpA, false)}
                <div style={{ fontSize: 22, textAlign: "center" }}>{verdict.icon}</div>
                {numTile("Their path", lpB, false)}
              </div>
              <Panel style={{ padding: 20, borderColor: T.teal + "55", background: "radial-gradient(130% 160% at 50% 0%, #7fd4e01a, transparent 55%), linear-gradient(165deg, #14182b, #0e0e1b)" }}>
                <div className="lum-serif" style={{ fontSize: 22, color: T.ink, textAlign: "center", textShadow: "0 0 20px #7fd4e055" }}>{verdict.icon} {verdict.kind}</div>
                <p className="lum-serif" style={{ color: T.ink, fontSize: 15.5, fontStyle: "italic", lineHeight: 1.75, margin: "12px 0" }}>{verdict.text}</p>
                <div className="lum-sans" style={{ color: T.dim, fontSize: 13, lineHeight: 1.65 }}><span style={{ color: T.teal }}>The {NUM_MEANINGS[lpA].title} ({lpA})</span> — {NUM_MEANINGS[lpA].bond}</div>
                <div className="lum-sans" style={{ color: T.dim, fontSize: 13, lineHeight: 1.65, marginTop: 8 }}><span style={{ color: T.teal }}>The {NUM_MEANINGS[lpB].title} ({lpB})</span> — {NUM_MEANINGS[lpB].bond}</div>
                {(lpA > 9 || lpB > 9) && <div className="lum-sans" style={{ color: T.goldHi, fontSize: 12.5, marginTop: 12 }}>✧ A master number stands in this pairing — expect higher voltage in whichever weather you share, and build grounding rituals for two.</div>}
                <p className="lum-sans" style={{ color: T.faint, fontSize: 11.5, marginTop: 12 }}>No pairing is doomed and none is guaranteed — the numbers describe the dance floor, never the dancers' skill.</p>
              </Panel>
            </>
          )}
          <div><LearnBtn id="pairs" onOpen={setArticle}>Numerology for two</LearnBtn></div>
        </div>
      )}

      {article && <ArticleOverlay id={article} onOpen={setArticle} onClose={() => setArticle(null)} />}
    </div>
  );
};

/* ============================================================
   ANGEL REALM
   ============================================================ */

/* --- Daily Angel Card ritual: the seven step forward, veil their faces,
       shuffle in the heavens, gather into one pile — and one card rises,
       blooming to full screen, its message written as if by hand --- */
let pendingAngelDraw = false; // set by the Home tile so the ritual auto-begins on arrival

const angelOfTheDay = () => {
  const d = new Date();
  return ARCHANGELS[(d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate()) % ARCHANGELS.length];
};

const AngelCardRitual = ({ paid }) => {
  const N = ARCHANGELS.length;
  const [stage, setStage] = useState("idle"); // idle | fan | backs | shuffle | gather | reveal | zoom | done
  const [slots, setSlots] = useState([...Array(N).keys()]);
  const [message, setMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const chosen = useMemo(angelOfTheDay, []);
  const chosenIdx = ARCHANGELS.indexOf(chosen);
  const timers = useRef([]);
  const after = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  const tidy = useMemo(() => ARCHANGELS.map(() => ({ deg: Math.random() * 10 - 5, x: Math.random() * 8 - 4, y: Math.random() * 6 - 3 })), []);

  const compose = (a) =>
    `${a.name} steps forward for you today, beloved. ${a.invocation} Let ${a.domain.toLowerCase()} be your compass through the hours ahead — hold ${a.crystal.toLowerCase()} if it is near, and breathe in ${a.colour.toLowerCase()} light whenever you need to come home to yourself. Walk gently. You are so deeply loved.`;

  const begin = () => {
    setMessage(""); setWordCount(0); setSlots([...Array(N).keys()]);
    setStage("fan");
    after(2100, () => setStage("backs"));
    after(3100, () => setStage("shuffle"));
    [3200, 3850, 4500, 5150].forEach((t) => after(t, () => setSlots((s) => [...s].sort(() => Math.random() - 0.5))));
    after(5900, () => setStage("gather"));
    after(6000, async () => {
      let text = compose(chosen);
      if (paid) {
        try { text = await askLuminae(`Channel today's Daily Angel Card message (110-150 words) from ${chosen.name}, archangel of ${chosen.domain}. Today is ${new Date().toDateString()}. The seeker has just drawn ${chosen.name}'s card — speak to them directly and warmly. End with the invocation feeling woven in naturally.`); } catch (e) { /* fallback stands */ }
      }
      setMessage(text);
    });
    after(7100, () => setStage("reveal"));
    after(9100, () => setStage("zoom"));
  };

  useEffect(() => { if (pendingAngelDraw) { pendingAngelDraw = false; begin(); } }, []);

  const words = useMemo(() => (message ? message.split(/\s+/) : []), [message]);
  useEffect(() => {
    if (stage !== "zoom" || !words.length) return;
    const iv = setInterval(() => setWordCount((c) => (c >= words.length ? (clearInterval(iv), c) : c + 1)), 220);
    return () => clearInterval(iv);
  }, [stage, words.length]);

  const finish = () => { stopSpeaking(); setStage("done"); };
  const CARD_W = 66, CARD_H = 104, R = 112;
  const pos = (slot) => {
    const ang = (slot / N) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.round(Math.cos(ang) * R), y: Math.round(Math.sin(ang) * R), deg: Math.round((ang * 180) / Math.PI + 90) };
  };
  const inCircle = stage === "fan" || stage === "backs" || stage === "shuffle";
  const running = stage !== "idle" && stage !== "done";

  return (
    <Panel style={{ margin: "16px 0", padding: 18, borderColor: T.goldHi + "44", background: "radial-gradient(120% 150% at 50% -20%, #241f42 0%, #12101f 55%, #0d0d18 100%)", overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <Eyebrow colour={T.goldHi}>Daily Angel Card · Free</Eyebrow>
          <div className="lum-serif" style={{ fontSize: 20, color: T.ink }}>Which angel walks with you today?</div>
        </div>
        {!running && <Btn small onClick={begin}>{stage === "done" ? "Behold again ✧" : "Draw ✧"}</Btn>}
      </div>

      {stage === "done" && (
        <div className="fade-up" style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 14 }}>
          <img src={chosen.img} alt={chosen.name} style={{ width: 54, height: 86, objectFit: "cover", objectPosition: "50% 14%", borderRadius: 8, border: `1px solid ${chosen.hex}77`, boxShadow: `0 0 14px ${chosen.hex}44` }} />
          <div>
            <div className="lum-serif" style={{ fontSize: 17.5, color: T.ink }}>{chosen.name}</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 2 }}>{chosen.domain} — walking beside you until midnight ✧</div>
          </div>
        </div>
      )}

      {running && stage !== "zoom" && (
        <div style={{ position: "relative", height: 336, marginTop: 6 }}>
          {[...Array(18)].map((_, i) => (
            <span key={i} aria-hidden style={{ position: "absolute", left: `${(i * 53 + 7) % 100}%`, top: `${(i * 37 + 11) % 100}%`, width: 2, height: 2, borderRadius: "50%", background: T.goldHi, animation: `twinkle ${2 + (i % 5) * 0.7}s ease-in-out ${(i % 7) * 0.4}s infinite` }} />
          ))}
          {ARCHANGELS.map((a, i) => {
            const p = pos(slots[i]);
            const isChosen = i === chosenIdx;
            const faceUp = stage === "fan" || (isChosen && stage === "reveal");
            const gathered = stage === "gather" || stage === "reveal";
            const x = inCircle ? p.x : gathered ? tidy[i].x : 0;
            const y = inCircle ? p.y : gathered ? tidy[i].y : 0;
            const deg = inCircle ? p.deg : gathered ? tidy[i].deg : 0;
            const scale = stage === "reveal" && isChosen ? 1.5 : 1;
            return (
              <div key={a.name} style={{ position: "absolute", left: "50%", top: "50%", zIndex: isChosen ? 20 : 10, animation: stage === "fan" ? `cardIn .55s ease ${i * 0.08}s both` : "none", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${deg}deg) scale(${scale})`, transition: "transform .6s cubic-bezier(.35,.9,.35,1), filter .5s ease", filter: stage === "reveal" && !isChosen ? "brightness(.45)" : "none" }}>
                <div style={{ width: CARD_W, height: CARD_H, position: "relative", transformStyle: "preserve-3d", transition: "transform .65s", transform: faceUp ? "rotateY(0deg)" : "rotateY(180deg)" }}>
                  <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 9, overflow: "hidden", border: `1px solid ${a.hex}88`, boxShadow: stage === "reveal" && isChosen ? `0 0 28px ${a.hex}aa` : `0 0 10px ${a.hex}33` }}>
                    <img src={a.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 14%" }} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 3px 3px", background: "linear-gradient(transparent, rgba(6,6,14,.9))", textAlign: "center" }}>
                      <span className="lum-sans" style={{ fontSize: 7, letterSpacing: ".14em", textTransform: "uppercase", color: "#f2ecdf" }}>{a.name.replace("Archangel ", "")}</span>
                    </div>
                  </div>
                  <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 9, border: "1px solid #d4b04c66", background: "radial-gradient(circle at 50% 36%, #2b2547, #14121f 72%)", boxShadow: "0 5px 16px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #d4b04c55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: T.goldHi, fontSize: 15, textShadow: `0 0 12px ${T.goldHi}` }}>✧</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="lum-sans" style={{ position: "absolute", bottom: -2, left: 0, right: 0, textAlign: "center", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: T.faint }}>
            {stage === "fan" && "The seven step forward…"}
            {stage === "backs" && "They veil their faces…"}
            {stage === "shuffle" && "The heavens shuffle…"}
            {stage === "gather" && "One pile. One truth."}
            {stage === "reveal" && "Your card rises ✧"}
          </div>
        </div>
      )}

      {stage === "zoom" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 95, background: "rgba(8,8,18,.98)", overflow: "hidden" }}>
          <img src={chosen.img} alt={chosen.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 18%", animation: "bloomFull 1.15s cubic-bezier(.2,.75,.25,1) both" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(rgba(8,8,18,.15) 26%, rgba(8,8,18,.9) 74%), radial-gradient(120% 55% at 50% 0%, ${chosen.hex}30, transparent 55%)` }} />
          {[...Array(12)].map((_, i) => (
            <span key={i} aria-hidden style={{ position: "absolute", left: `${(i * 47 + 8) % 100}%`, bottom: `${(i * 29 + 5) % 60}%`, width: 3, height: 3, borderRadius: "50%", background: chosen.hex, opacity: .8, animation: `twinkle ${2.4 + (i % 4) * 0.8}s ease-in-out ${(i % 5) * 0.5}s infinite` }} />
          ))}
          <button onClick={finish} aria-label="Close" style={{ position: "absolute", top: 14, right: 18, zIndex: 3, background: "none", border: "none", color: "#f2ecdf", fontSize: 26, cursor: "pointer", textShadow: "0 0 10px #000" }}>✕</button>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2, padding: "0 22px 32px", textAlign: "center" }}>
            <div style={{ maxWidth: 580, margin: "0 auto" }}>
              <Eyebrow colour={chosen.hex}>Your angel today</Eyebrow>
              <div className="lum-serif gold-shimmer" style={{ fontSize: 31, fontWeight: 600, margin: "2px 0 3px" }}>{chosen.name}</div>
              <div className="lum-sans" style={{ fontSize: 12, color: T.dim, marginBottom: 14 }}>{chosen.domain} · {chosen.colour} · {chosen.crystal}</div>
              <p className="lum-serif" onClick={() => setWordCount(words.length)} style={{ color: T.ink, fontSize: 18.5, fontStyle: "italic", lineHeight: 1.8, minHeight: 90, margin: 0, cursor: wordCount < words.length ? "pointer" : "default" }}>
                {words.length === 0
                  ? <span style={{ color: chosen.hex, opacity: .9 }}>{chosen.name.replace("Archangel ", "")} draws close…</span>
                  : words.slice(0, wordCount).map((w, i) => <span key={i} className="ink-word">{w}</span>)}
              </p>
              {words.length > 0 && wordCount >= words.length && (
                <div className="fade-up" style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                  <SpeakBtn text={message} colour={chosen.hex} />
                  <Btn small onClick={finish}>Amen ✧</Btn>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
};

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

      <AngelCardRitual paid={paid} />

      <Panel style={{ margin: "16px 0", padding: 18, borderColor: "#3b6fd455", background: "linear-gradient(160deg, #16203a, #10101f)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <img src="/images/angels/archangel-michael.webp" alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", objectPosition: "50% 26%", border: "1.5px solid #3b6fd488", boxShadow: "0 0 16px #3b6fd466", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
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
            <Panel key={a.name} hover onClick={() => !open && dailyMessage(a)} style={{ padding: "16px 18px", borderColor: a.hex + (open ? "77" : "44"), background: `radial-gradient(130% 170% at 0% 0%, ${a.hex}1f, transparent 52%), linear-gradient(165deg, #16152b, #0e0e1b)`, boxShadow: open ? `0 0 28px ${a.hex}2e` : "none", transition: "box-shadow .45s ease, border-color .45s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div aria-hidden style={{ position: "absolute", inset: -9, borderRadius: "50%", background: `radial-gradient(circle, ${a.hex}66, transparent 70%)`, animation: open ? "haloPulse 2.6s ease-in-out infinite" : "none", opacity: open ? 1 : .5 }} />
                  {a.img ? (
                    <img src={a.img} alt={a.name} style={{ position: "relative", display: "block", width: open ? 92 : 54, height: open ? 92 : 54, borderRadius: "50%", objectFit: "cover", objectPosition: "50% 16%", border: `1.5px solid ${a.hex}aa`, boxShadow: `0 0 16px ${a.hex}66`, transition: "width .35s, height .35s" }} />
                  ) : (
                    <AngelFigure colour={a.hex} size={open ? 92 : 54} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <span className="lum-serif" style={{ fontSize: 19, color: T.ink, textShadow: open ? `0 0 20px ${a.hex}88` : "none" }}>{a.name}</span>
                  <div className="lum-sans" style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{a.domain} · {a.colour} · {a.crystal}</div>
                </div>
                <div style={{ width: 13, height: 13, borderRadius: "50%", background: a.hex, boxShadow: `0 0 14px ${a.hex}`, flexShrink: 0, animation: open ? "twinkle 2.4s ease-in-out infinite" : "none" }} />
              </div>
              {open && a.img && (
                <div className="fade-up" style={{ position: "relative", marginTop: 14, borderRadius: 16, overflow: "hidden", border: `1px solid ${a.hex}66`, boxShadow: `0 10px 32px rgba(0,0,0,.5), 0 0 34px ${a.hex}26` }}>
                  <img src={a.img} alt="" style={{ display: "block", width: "100%", maxHeight: 370, objectFit: "cover", objectPosition: "50% 12%" }} />
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(rgba(10,10,20,0) 52%, rgba(10,10,20,.78)), radial-gradient(100% 60% at 50% 0%, ${a.hex}24, transparent 58%)` }} />
                  <div className="lum-serif" style={{ position: "absolute", left: 14, right: 14, bottom: 10, textAlign: "center", fontStyle: "italic", fontSize: 15, color: "#f2ecdf", textShadow: "0 1px 10px rgba(0,0,0,.9)" }}>
                    {a.domain} · <span style={{ color: a.hex }}>{a.colour}</span>
                  </div>
                </div>
              )}
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
   DAILY QUOTES
   ============================================================ */
const QuotesScreen = () => {
  const [text, author] = dailyQuote();
  const past = [...Array(6)].map((_, i) => dailyQuote(new Date(Date.now() - (i + 1) * 86400000)));

  return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Eyebrow>Daily Quotes</Eyebrow>
      <H>A little light for today</H>
      <Panel style={{ margin: "16px 0", padding: 26, textAlign: "center" }}>
        <div className="lum-serif" style={{ fontSize: 21, color: T.ink, fontStyle: "italic", lineHeight: 1.6 }}>“{text}”</div>
        <div className="lum-sans" style={{ fontSize: 13, color: T.gold, marginTop: 14, letterSpacing: ".04em" }}>— {author}</div>
        <div style={{ marginTop: 18 }}><SpeakBtn text={`${text} — ${author}`} /></div>
      </Panel>
      <Eyebrow>Recent Days</Eyebrow>
      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {past.map(([t, a], i) => (
          <Panel key={i} style={{ padding: 16 }}>
            <div className="lum-serif" style={{ fontSize: 15, color: T.dim, fontStyle: "italic", lineHeight: 1.55 }}>“{t}”</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.faint, marginTop: 6 }}>— {a}</div>
          </Panel>
        ))}
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
  const [harpRec, setHarpRec] = useState(null); // hosted harp recording
  // Named, reorderable journeys (playlists), saved on the seeker's device.
  const [playlists, setPlaylists] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lum-playlists") || "[]"); } catch (e) { return []; }
  });
  const [activeId, setActiveId] = useState(null);
  const [newName, setNewName] = useState("");
  const [plPlaying, setPlPlaying] = useState(-1);       // index within the playing journey
  const [playingPlId, setPlayingPlId] = useState(null); // which journey is playing
  const plRef = useRef([]);
  const plTimer = useRef(null);
  const timerRef = useRef(0); timerRef.current = timer; // current sleep-timer choice
  const MINS = [5, 10, 15, 30, 60];
  const activePl = playlists.find((pl) => pl.id === activeId) || null;

  // Persist journeys. Uploaded audio buffers can't be serialised — flag them
  // so they show in the list but prompt a re-add after a refresh.
  useEffect(() => {
    try {
      const safe = playlists.map((pl) => ({ id: pl.id, name: pl.name, items: pl.items.map((it) => {
        const { buffer, ...rest } = it.track || {};
        return { key: it.key, mins: it.mins, track: buffer ? { ...rest, needsReupload: true } : rest };
      }) }));
      localStorage.setItem("lum-playlists", JSON.stringify(safe));
    } catch (e) {}
  }, [playlists]);

  // The Angelic Harp plays a real recording when one is available — a
  // seeker's own upload first, then the hosted Moonlit Canopy Drift —
  // and gently falls back to the live-synth harp otherwise.
  const resolve = (track) => {
    if (track.id !== "harp") return track;
    const rec = ownHarp || harpRec;
    return rec ? { ...rec, id: "harp", name: "Angelic Harp" } : track;
  };

  // Load + decode the hosted harp recording once, on mount.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(encodeURI(HARP_RECORDING.src));
        if (!res.ok) return;
        const audio = await engine.decode(await res.arrayBuffer());
        if (alive) setHarpRec({ type: "buffer", buffer: audio, name: HARP_RECORDING.title });
      } catch (e) { /* fall back to the live-synth harp */ }
    })();
    return () => { alive = false; };
  }, [engine]);
  const trigger = (track, music) => {
    const t = resolve(track);
    if (t.type === "buffer") engine.playBuffer(t.buffer, { music });
    else engine.play(t, { music });
  };
  const stopPlaylist = () => {
    clearTimeout(plTimer.current);
    setPlPlaying(-1); setPlayingPlId(null); setPlaying(null); engine.stop();
  };
  const playStep = (i) => {
    const items = plRef.current;
    if (i >= items.length) { stopPlaylist(); return; }
    const item = items[i];
    const last = i === items.length - 1;
    if (item.track?.needsReupload) { // can't play a refreshed-away upload — glide past it
      setPlPlaying(i); clearTimeout(plTimer.current);
      if (last) { stopPlaylist(); return; }
      plTimer.current = setTimeout(() => playStep(i + 1), 400); return;
    }
    trigger(item.track, withMusic);
    setPlaying(item.track); setPlPlaying(i);
    clearTimeout(plTimer.current);
    // On the final track with a sleep timer set (e.g. "All night"), let it keep
    // flowing — it loops seamlessly — until the timer ends the night.
    if (last && timerRef.current) return;
    plTimer.current = setTimeout(() => playStep(i + 1), item.mins * 60000);
  };
  const playPlaylist = (plId) => {
    if (!paid) return askUpgrade("Journeys live in Illuminate — flow a whole bedtime ritual.");
    const pl = playlists.find((p) => p.id === plId); if (!pl || !pl.items.length) return;
    plRef.current = pl.items; setPlayingPlId(plId);
    if (timer) engine.setSleepTimer(timer, () => stopPlaylist()); // the night's end
    playStep(0);
  };
  const createPlaylist = (name) => {
    if (!paid) return askUpgrade("Journeys live in Illuminate — craft your own bedtime or meditation ritual.");
    const id = "pl" + Date.now();
    setPlaylists((p) => [...p, { id, name: (name || "").trim() || "Untitled Journey", items: [] }]);
    setActiveId(id);
  };
  const renamePlaylist = (plId, name) => setPlaylists((p) => p.map((pl) => pl.id === plId ? { ...pl, name } : pl));
  const deletePlaylist = (plId) => {
    if (playingPlId === plId) stopPlaylist();
    setPlaylists((p) => p.filter((pl) => pl.id !== plId));
    setActiveId((cur) => cur === plId ? null : cur);
  };
  const addToPlaylist = (track) => {
    if (!paid) return askUpgrade("Journeys live in Illuminate — craft your own bedtime or meditation ritual.");
    let id = activeId;
    if (!id || !playlists.find((x) => x.id === id)) {
      id = "pl" + Date.now();
      setPlaylists((p) => [...p, { id, name: "My Journey", items: [] }]);
      setActiveId(id);
    }
    const entry = { key: track.id + "-" + Date.now(), mins: 15, track };
    setPlaylists((p) => p.map((pl) => pl.id === id ? { ...pl, items: [...pl.items, entry] } : pl));
  };
  const cycleMins = (plId, key) => setPlaylists((p) => p.map((pl) => pl.id !== plId ? pl : {
    ...pl, items: pl.items.map((it) => it.key !== key ? it : { ...it, mins: MINS[(MINS.indexOf(it.mins) + 1) % MINS.length] }),
  }));
  const moveItem = (plId, i, dir) => setPlaylists((p) => p.map((pl) => {
    if (pl.id !== plId) return pl;
    const j = i + dir; if (j < 0 || j >= pl.items.length) return pl;
    const items = pl.items.slice(); const t = items[i]; items[i] = items[j]; items[j] = t;
    return { ...pl, items };
  }));
  const removeItem = (plId, key) => setPlaylists((p) => p.map((pl) => pl.id !== plId ? pl : { ...pl, items: pl.items.filter((it) => it.key !== key) }));
  useEffect(() => () => clearTimeout(plTimer.current), []);
  const play = (track, locked) => {
    if (locked) return askUpgrade("Unlock the full Sound Sanctuary — unlimited, ad-free, forever.");
    if (!paid && freePlays >= 3 && playing?.id !== track.id) return askUpgrade("You've enjoyed your 3 free tracks today. Illuminate is unlimited — everything you love, without the interruptions.");
    if (playingPlId !== null) { clearTimeout(plTimer.current); setPlPlaying(-1); setPlayingPlId(null); }
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
    if (playingPlId !== null) {
      engine.setSleepTimer(mins, () => stopPlaylist());
      const pl = playlists.find((p) => p.id === playingPlId);
      if (mins && pl && plPlaying === pl.items.length - 1) clearTimeout(plTimer.current); // let the final track flow on
    } else if (playing) engine.setSleepTimer(mins, () => setPlaying(null));
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
      {/* ✧ Journeys — named, reorderable playlists, saved on the device */}
      <Panel style={{ margin: "14px 0", padding: 16, borderColor: T.goldHi + "55" }}>
        <div className="lum-serif" style={{ fontSize: 19, color: T.goldHi }}>✧ Your Journeys</div>
        <div className="lum-sans" style={{ fontSize: 11.5, color: T.faint, margin: "3px 0 12px" }}>Craft a bedtime or meditation journey — name it, add tracks, then set the order and how long each one flows.</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && newName.trim()) { createPlaylist(newName); setNewName(""); } }}
            placeholder="New journey name…  e.g. Bedtime" className="lum-sans" style={{ ...inp, flex: 1 }} />
          <Btn small onClick={() => { if (newName.trim()) { createPlaylist(newName); setNewName(""); } else { createPlaylist(""); } }}>＋ Create</Btn>
        </div>
        {playlists.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: activePl ? 14 : 0 }}>
            {playlists.map((pl) => (
              <button key={pl.id} onClick={() => setActiveId(pl.id)} className="lum-sans" style={{
                background: activeId === pl.id ? "rgba(201,168,76,.18)" : "rgba(233,230,242,.05)",
                border: `1px solid ${activeId === pl.id ? T.goldHi : "rgba(233,230,242,.14)"}`,
                color: activeId === pl.id ? T.goldHi : T.dim, borderRadius: 14, padding: "5px 12px", fontSize: 12, cursor: "pointer",
              }}>{playingPlId === pl.id ? "✧ " : ""}{pl.name} · {pl.items.length}</button>
            ))}
          </div>
        )}
        {activePl && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input value={activePl.name} onChange={(e) => renamePlaylist(activePl.id, e.target.value)} aria-label="Journey name"
                className="lum-serif" style={{ background: "none", border: "none", borderBottom: "1px solid rgba(233,230,242,.14)", color: T.ink, fontSize: 16, padding: "2px 0", flex: 1, minWidth: 0 }} />
              <div style={{ display: "flex", gap: 6 }}>
                {playingPlId === activePl.id && plPlaying >= 0
                  ? <><Btn small kind="ghost" onClick={() => playStep(plPlaying + 1)}>⏭ Next</Btn><Btn small kind="ghost" onClick={stopPlaylist}>◼ End</Btn></>
                  : <Btn small onClick={() => playPlaylist(activePl.id)}>▶ Begin</Btn>}
              </div>
            </div>
            {activePl.items.length === 0
              ? <div className="lum-sans" style={{ fontSize: 12, color: T.faint, padding: "8px 0" }}>Empty for now — tap ＋ on any track below to add it to “{activePl.name}”.</div>
              : activePl.items.map((it, i) => {
                const on = playingPlId === activePl.id && plPlaying === i;
                const last = i === activePl.items.length - 1;
                return (
                  <div key={it.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: i ? "1px solid rgba(233,230,242,.07)" : "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <button onClick={() => moveItem(activePl.id, i, -1)} disabled={i === 0} aria-label="Move up" className="lum-sans" style={{ background: "none", border: "none", color: i === 0 ? T.faint : T.dim, cursor: i === 0 ? "default" : "pointer", fontSize: 10, lineHeight: 1, padding: 0 }}>▲</button>
                      <button onClick={() => moveItem(activePl.id, i, 1)} disabled={last} aria-label="Move down" className="lum-sans" style={{ background: "none", border: "none", color: last ? T.faint : T.dim, cursor: last ? "default" : "pointer", fontSize: 10, lineHeight: 1, padding: 0 }}>▼</button>
                    </div>
                    <span className="lum-sans" style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: on ? T.goldHi : (it.track?.needsReupload ? T.faint : T.ink) }}>
                      {on ? "✧ " : `${i + 1}. `}{it.track?.name}{it.track?.needsReupload ? " · re-add upload" : ""}
                    </span>
                    <button onClick={() => cycleMins(activePl.id, it.key)} className="lum-sans" style={{ background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", color: T.goldHi, borderRadius: 13, padding: "3px 10px", fontSize: 11.5, cursor: "pointer" }}>{it.mins} min</button>
                    <button onClick={() => removeItem(activePl.id, it.key)} aria-label="Remove" className="lum-sans" style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                );
              })}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span className="lum-sans" style={{ fontSize: 11, color: T.faint }}>Each step flows for its minutes, then the next begins. With “All night,” the final track plays on until dawn.</span>
              <button onClick={() => deletePlaylist(activePl.id)} className="lum-sans" style={{ background: "none", border: "none", color: T.faint, fontSize: 11, cursor: "pointer" }}>Delete journey</button>
            </div>
          </div>
        )}
      </Panel>
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
          let t = s;
          if (s.id === "harp") {
            if (ownHarp) t = { ...s, desc: `Your own recording · "${ownHarp.name}" ✦` };
            else if (harpRec) t = { ...s, desc: `${harpRec.name} · a flowing harp recording ✦` };
          }
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
      if (!apiKey()) { setOut("The sanctuary needs your sacred key, beloved — set VITE_ANTHROPIC_API_KEY in a .env file."); setLoading(false); return; }
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: anthropicHeaders(),
        body: JSON.stringify({
          model: ANTHROPIC_MODEL, max_tokens: 1000,
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
        <Panel hover onClick={() => { pendingAngelDraw = true; go("angels"); }} style={{ marginBottom: 14, padding: 0, overflow: "hidden", borderColor: "#9cb8ee44", background: "linear-gradient(160deg, #141b33, #0e0e1c)" }}>
          <div style={{ display: "flex", alignItems: "stretch", minHeight: 96 }}>
            <div style={{ position: "relative", width: 104, flexShrink: 0 }}>
              <img src="/images/angels/archangel-michael.webp" alt="Archangel Michael" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 24%" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(14,14,28,0) 50%, #10101d 98%)" }} />
            </div>
            <div style={{ padding: "15px 18px", flex: 1 }}>
              <Eyebrow colour="#9cb8ee">Daily Angel Card · Free</Eyebrow>
              <div className="lum-serif" style={{ fontSize: 21, color: T.ink }}>Which angel walks with you today?</div>
              <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 4 }}>Seven cards shuffle in the heavens — one steps forward ✧</div>
            </div>
          </div>
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
  { id: "quotes", name: "Daily Quotes", icon: "🕯️", note: "A little light for today · Free", free: true },
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
    quotes: <QuotesScreen />,
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
      <VersionBadge />
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
