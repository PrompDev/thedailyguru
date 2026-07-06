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

const tarotSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const MAJOR_MEANINGS = {
  "The Fool": { essence: "Standing at the cliff's edge with the whole sky ahead, you are free to begin again — so leap, and trust the ground to rise.", upright: "The Fool is the thrill of the open road and the courage to start before you feel ready. Something fresh is calling — a new relationship, a bold career pivot, a move, a creative spark — and this card blesses the leap of faith. In love, it's the giddy first spark, a chance worth taking with an open heart. In work, it favours the unproven idea, the side project, the yes to the unknown. Inwardly, it invites beginner's mind: to meet life with wonder rather than a plan, unburdened by who you were. Yes, there is risk, and yes, you may look a little foolish — that is the point. Innocence here is a strength, not a flaw. Timing is now, or very soon. Pack light, follow your curiosity, and step off the edge; the universe tends to catch a trusting heart.", reversed: "Reversed, The Fool whispers that you may be holding back at the very edge — hesitating, over-planning, or talking yourself out of the leap. Or the opposite: rushing in recklessly without looking down. Neither is failure. It's simply an invitation to feel your fear honestly, gather what you truly need, and take the step with both eyes open and heart intact." },
  "The Magician": { essence: "As above, so below — everything you need is already in your hands; now focus your will and watch the spark become real.", upright: "The Magician is the moment potential becomes power. With one hand raised to the heavens and one pointing to earth, you are the channel that turns idea into form — the great manifester of the deck. All four elements lie on your table: you have the tools, the talent, the timing. In work, it's the entrepreneur's card, favouring bold action, communication, and skilful use of resources you may have overlooked. In love, it's magnetism and clear intention — say what you want and mean it. Inwardly, it asks you to align thought, word, and deed so your energy stops leaking and starts creating. This is focused willpower, not wishful thinking. Concentrate, commit, and act. When you know your intention and trust your gifts, you become alchemist of your own life, and the world rearranges itself to meet your resolve.", reversed: "Reversed, The Magician points to scattered focus, untapped talent, or a gap between what you say and what you do. Sometimes it warns of manipulation — yours or another's — or of tricks masking insecurity. Gently, it asks: are your intentions honest, your energy aligned? Gather your power back from distraction, name what you truly want, and let your actions match your words again." },
  "The High Priestess": { essence: "Between the pillars of light and dark she sits, keeper of the deep waters — the answer you seek is already whispering within you.", upright: "The High Priestess is the hush before knowing, the wisdom that arrives without words. She guards the threshold of the unseen and asks you to trust your intuition over noise, logic, or the opinions of the crowd. Something is unfolding beneath the surface — in a relationship, a decision, a dream that keeps returning — and it is not yet ready to be forced into the light. In love, she counsels patience and reading between the lines; not everything must be spoken to be true. In work, she favours the quiet, perceptive move over the loud one. Inwardly, she is the pull toward meditation, dreams, symbols, and the sacred feminine — the part of you that already knows. Timing is slow, gestational, mysterious. Grow still. Listen inward. The veil is thin right now, and your inner voice is unusually, reliably wise.", reversed: "Reversed, The High Priestess suggests you may be talking over your own inner voice — ignoring a gut feeling, seeking answers everywhere but within, or letting others drown out what you quietly know. Secrets may feel heavy, or you may be hiding from yourself. This is a tender nudge to slow down, get quiet, and trust the intuition you've been overriding." },
  "The Empress": { essence: "Life pours through you like a river through a garden — soft, fertile, and endlessly generous; everything you tend now blooms.", upright: "The Empress is abundance made tender — the great mother, creation in full flower. She rules everything that grows: love, art, gardens, families, projects born of the heart. In love, she is deep sensual warmth, devotion, sometimes pregnancy or the blossoming of a bond into something lasting. In work, she blesses creative fertility — ideas that ripen, ventures that flourish when nurtured with patience and care. Inwardly, she calls you home to your senses and your body: to rest, to pleasure, to beauty, to receiving as much as you give. She reminds you that abundance is your natural state, that you can afford to be generous, and that nurturing yourself is not indulgence but the very soil from which everything else grows. Timing is ripe and unhurried. Slow down, savour the world, and let what you love come to fruition.", reversed: "Reversed, The Empress can mean the well of nurture has run dry — you're pouring into everyone but yourself, or a creative project has stalled and needs replenishing. It may point to smothering rather than supporting, or feeling disconnected from your body and joy. The remedy is gentle: turn some of that boundless care inward, and let yourself be replenished too." },
  "The Emperor": { essence: "On the mountain throne sits the one who builds to last — steady, protective, sovereign; the strong foundation beneath every lasting thing.", upright: "The Emperor is order made loving — the architect who turns vision into something solid and enduring. He brings structure, discipline, and the quiet confidence of someone who has built a life that holds. In work, he is leadership, strategy, and the follow-through that makes dreams real; he rewards the plan, the boundary, the steady hand. In love, he is the loyal, dependable partner — protection, commitment, a safe harbour you can count on. Inwardly, he asks you to claim your own authority: to set boundaries, take responsibility, and become the stable ground others (and you) can stand on. His strength isn't domination but stewardship — power used to protect and provide. Timing is grounded and reliable. Build the framework, honour your word, lead with fairness, and you create a fortress of stability from which everything worthwhile can safely grow.", reversed: "Reversed, The Emperor can tip into rigidity, control, or stubbornness — rules that no longer serve, or a need to dominate rather than protect. It may also reveal the opposite: a lack of structure, discipline slipping, or difficulty owning your authority. Kindly, it asks where firmness has hardened, or where you might build the steady foundation you've been avoiding." },
  "The Hierophant": { essence: "A wise old door swings open, and every teacher who ever loved a question is standing behind it, waiting for you.", upright: "The Hierophant is the keeper of the well-worn path — tradition, mentorship, and the quiet power of learning from those who walked ahead. He speaks of finding a teacher, a faith, a lineage, or a community whose structure gives your seeking a shape to grow into. In work, he can mean formal study, apprenticeship, credentials, or joining an institution whose rules reward patience. In love, he blesses commitment made sacred and public — engagement, marriage, shared values, two people building on solid ground. Inwardly, he is the search for meaning that is bigger than you, the comfort of ritual and belonging. Timing tends toward the steady and established rather than the sudden. Trust the tried-and-true here; some wisdom must be received before it can be reinvented, and there is grace in being a student.", reversed: "Reversed, the Hierophant invites you to question inherited rules that no longer fit. Dogma, conformity, or a mentor's outgrown authority may be quietly boxing you in. This is not rebellion for its own sake — it is the moment your own inner teacher finds its voice. Keep what still rings true, and gently release the rest. Your path can be your own." },
  "The Lovers": { essence: "Two flames lean toward each other and become one bright thing — this is the card of yes, spoken from the deepest part of you.", upright: "The Lovers is far more than romance, though it holds romance at its most radiant — deep union, chemistry, and a bond where two people truly see each other. At its heart it is alignment: your values, your choices, and your desires all pointing the same direction. It often arrives at a crossroads, asking you to choose from the heart rather than fear, and to honor what you love. In relationships it blesses partnership, reconciliation, and vulnerable honesty. In work it can mean a partnership, a collaboration, or committing to a path that feels like a calling. Inwardly, it is the marriage of your opposites — head and heart, shadow and light — into wholeness. Timing feels ripe and mutual. Whatever you decide, decide as your whole self, and let love be the compass.", reversed: "Reversed, the Lovers points to misalignment — a choice made from pressure, a value quietly betrayed, or two people out of step. There may be indecision, disharmony, or a bond that needs honest repair. Rather than doom, read it as an invitation to come back into agreement with yourself first. When your inner world is aligned, your outer choices grow clear and your relationships steady." },
  "The Chariot": { essence: "Reins in hand, will ablaze, you ride straight through what once stopped you — momentum is yours, and the road is opening.", upright: "The Chariot is triumph won through focus. It shows you harnessing opposing forces — drive and doubt, softness and steel — and steering them toward a single goal. This is the card of determination, self-discipline, and the forward motion that follows once you truly commit. In work it signals ambition rewarded, a project driven home, a promotion or move earned by sheer resolve. In love it can mean pursuing what you want boldly, or steering a relationship through a challenging stretch with confidence. Inwardly, it is mastery over impulse — the calm control that lets you channel emotion into direction rather than be scattered by it. Timing is fast and favorable when your aim is clear. Keep your eyes on the horizon, trust your strength, and know that victory here is not luck but the fruit of a will that refused to quit.", reversed: "Reversed, the Chariot asks where your momentum has stalled or scattered. Forcing, aggression, or racing off in every direction at once can leave you spinning without traction. Sometimes the reins have slipped and something else is steering. Pause, gather your focus, and reconnect with why you set out. Direction restored, even gently, will carry you further than sheer force ever could." },
  "Strength": { essence: "A gentle hand rests on the lion's mane, and the wild thing softens — real power was tenderness all along.", upright: "Strength is courage wearing a soft face. It shows the quiet mastery that tames not by force but by patience, compassion, and steady inner resolve. Here you meet your fears, your anger, your appetites — the lion within — and befriend them rather than cage them. In life's challenges it promises that you have more fortitude than you know, and that calm persistence outlasts brute effort. In love it blesses tenderness, forgiveness, and the strength to stay open-hearted when it would be easier to harden. In work it is grace under pressure, influence through warmth rather than domination. Inwardly, it is self-compassion — the confidence that needs no proof. Timing rewards the patient and the kind. Whatever you are facing, meet it gently and unafraid; the softest touch, offered from a settled center, moves what pushing never could.", reversed: "Reversed, Strength whispers that your inner reserves feel low — self-doubt, frayed patience, or a harshness turned against yourself. Perhaps you are muscling through what needs tenderness, or letting fear roar louder than your courage. This is not weakness; it is a call to refill your own well. Be as gentle with yourself as you would be with someone you love, and your quiet power returns." },
  "The Hermit": { essence: "One lantern in the dark, held high by a patient hand — the light you have been seeking has been yours to carry all along.", upright: "The Hermit is the sacred pause, the deliberate step back from noise to hear your own soul speak. He blesses solitude not as loneliness but as homecoming — time alone to reflect, to search, and to find the inner light that outside voices had drowned out. In life he counsels withdrawal for wisdom's sake: a retreat, a sabbatical, a quiet season of soul-searching before the next move. In work he can mean deep focus, independent study, or seeking a mentor's guidance — and becoming, in time, a guide yourself. In love he may ask for space to know your own heart, or point to a bond built on genuine self-knowledge. Inwardly, he is the truth-seeker's patience. Timing slows on purpose. Trust the value of going within; the answers you long for are not out there — they are glowing quietly inside you.", reversed: "Reversed, the Hermit marks solitude that has tipped into isolation, or a restlessness that keeps you from the reflection you need. Perhaps you are hiding from the world, or refusing to hear inner wisdom that is patiently waiting. Gently rebalance — reach back toward connection if you have withdrawn too far, or grant yourself the quiet you have been avoiding. Your inner light still burns." },
  "Wheel of Fortune": { essence: "The great wheel turns, and luck swings your way — what felt stuck is about to move, so ride the rising arc.", upright: "The Wheel of Fortune is life in motion — the sense that the cosmos has just clicked into a new position and something is turning in your favor. It speaks of cycles and fate, of turning points that arrive when you least expect them, of being lifted by a current larger than yourself. In love, a chance meeting or a sudden thaw can shift everything overnight. In work, a lucky break, a door reopening, an offer out of nowhere. Inwardly, it asks you to trust the rhythm of rising and falling, knowing no low lasts and no high is the whole story. Timing here is everything: the moment is ripe, momentum is with you, so say yes. Whatever seed you plant as the wheel climbs will spin outward into your future. Grab the spoke and rise.", reversed: "The wheel feels jammed, or spinning too fast to steady yourself. You may be clinging to a phase that has already turned, resisting change or blaming bad luck for what's simply a low point in a natural cycle. Loosen your grip. Look for the small choice within your control, and trust that the turn upward is already on its way." },
  "Justice": { essence: "Truth stands clear-eyed with her scales — what you set in motion now returns to you, so choose with an honest heart.", upright: "Justice holds the sword of clarity and the scales of balance, and she asks you to see things exactly as they are. This is the card of truth, fairness, and cause and effect — the quiet law that every action ripples back. A decision awaits, and it deserves your full honesty; weigh it carefully, account for consequences, and act with integrity. In love, it can mean fairness restored, a commitment made real, or accountability owed on either side. In work, contracts, agreements, and long-overdue recognition come due — what you have fairly earned tends to arrive. Legally and practically, outcomes align with the truth of what happened. Inwardly, Justice invites radical honesty with yourself: own your part, forgive where fair, and let your choices match your values. Do right, and the universe balances its books in your favor.", reversed: "Something feels out of balance — a truth being dodged, accountability avoided, or an unfairness you're still carrying. You may be judging yourself too harshly, or letting someone off too easily. This is a gentle nudge to face the facts honestly, take responsibility for your part, and release the guilt or blame that was never yours to hold." },
  "The Hanged Man": { essence: "Hang the world upside down and suddenly it makes sense — in the pause, a whole new way of seeing is born.", upright: "The Hanged Man rests suspended, serene, seeing the world from an angle no one else will take. His is the wisdom of surrender — not defeat, but the deliberate choice to stop pushing and let a new perspective arrive. When life feels paused, stuck, or on hold, this card reframes the waiting as sacred: the pause is the point. In love, it may mean giving up control, releasing an outcome, or seeing a partner with fresh eyes. In work, a project on hold or a plan that must be reimagined rather than forced. Inwardly, it's the fertile in-between where old assumptions dissolve and insight blooms. Let go of the need to have it figured out. Sacrifice a small certainty to gain a larger truth. Sometimes the way forward is to stop, breathe, and turn everything upside down until it becomes clear.", reversed: "You may be resisting a pause the moment is asking for — struggling against a delay, stalling on a needed release, or clinging to a stale viewpoint. Or you've been suspended so long it's become an excuse to avoid deciding. Gently: either surrender fully and let the new perspective land, or step down from the tree and move." },
  "Death": { essence: "One chapter closes so the next can open — this is not an ending to fear, but a doorway into who you're becoming.", upright: "Death is the great transformer, and despite its stark name it rarely means anything literal — it means metamorphosis. Something in your life has run its course, and this card marks the clean, freeing ending that clears the way for genuine renewal. What falls away here was ready to fall. In love, it can mean releasing a relationship or an old dynamic that no longer fits, making room for something truer. In work, the close of a role or chapter, a bold reinvention, a shedding of an outworn identity. Inwardly, it's the death of a former self — the fears, habits, and stories you've outgrown. The invitation is to let go with grace rather than cling to what's already gone. Every ending it brings is a beginning in disguise. Walk through the door; on the other side, you are lighter and reborn.", reversed: "You may be resisting a change that's already underway, holding tight to what's finished out of fear of the unknown. This clinging can leave you stuck in limbo, stalling the very renewal you long for. Be tender with yourself — endings hurt. But loosen your grip a little; the release you're avoiding is the doorway to your freedom." },
  "Temperance": { essence: "The angel pours between two cups, and everything finds its measure — patience, blend, and perfect timing weave your gold.", upright: "Temperance is the art of the graceful middle — the angel who blends opposites into something finer than either alone. It speaks of balance, patience, and the quiet trust that things unfold in divine timing, not on demand. This is a card of moderation and harmony: mixing effort with rest, passion with reason, giving with receiving. In love, it's the steady, healing kind of union — compromise, calm, two lives flowing together at the right pace. In work, it counsels patience and steady craft over the quick fix; the slow-cooked result will be worth it. Inwardly, it's integration — reconciling parts of yourself that once pulled in opposite directions, finding your center. Don't rush; don't force. Bring a little of this and a little of that, adjust the recipe, and let time do its part. What you're brewing needs to simmer to become truly golden.", reversed: "Balance feels just out of reach — too much of one thing, too little of another; impatience with a process that can't be hurried; a sense of running to extremes. Come back to the center gently. Adjust the mix, breathe, and trust the timing you can't control. What you're building will come together — a little slower, and all the more solid for it." },
  "The Devil": { essence: "The chains you feel are lighter than you think — look closely and you may already hold the key.", upright: "The Devil meets you exactly where you feel stuck — the habit you can't quit, the relationship you outgrew, the belief that says you're not enough. Yet its deepest teaching is liberation: these chains are looser than they look, and the power you gave away is yours to reclaim. In love, it can reveal magnetic passion or a bond ruled by obsession, jealousy, or control worth naming honestly. In work, it names golden handcuffs — a paycheck or status you cling to while your spirit dims. Within, it invites brave shadow work: befriending your desire, ambition, anger, and appetite rather than shaming them, for what you deny secretly runs the show. This is also the card of embodied pleasure and raw vitality, unashamed. Timing feels heavy but temporary. Face what binds you with open eyes, and the lock quietly gives.", reversed: "Reversed, The Devil is the moment you sense the chains slackening. You're waking up — questioning an attachment, an addiction, a story that shrank you. Detachment is beginning, though it may feel raw. Be gentle: don't trade one compulsion for another, or hide from your own shadow. This is an invitation to step free, reclaim your power, and choose yourself again." },
  "The Tower": { essence: "Lightning clears what could no longer hold — and in the sudden dark, you finally see the stars.", upright: "The Tower cracks open what was built on a shaky foundation — a truth revealed, a certainty overturned, a change that arrives all at once. It can feel like the ground giving way, yet it only topples what was never truly yours to keep. In love, a mask may slip and honesty comes rushing in; in work, a plan collapses so a realer one can rise. Within, it's the flash of awakening — an illusion you outgrew, a belief that finally shatters, setting you free faster than comfort ever could. This is release, not ruin: the lightning is also revelation. What survives the storm is real and load-bearing. Timing is swift and unmistakable. Let it fall. Standing in the rubble, breath knocked loose, you'll feel a strange clean relief — and see the wide sky that was always there.", reversed: "Reversed, The Tower is the change you sense coming and keep bracing against — patching cracks, avoiding the hard conversation, delaying the inevitable. It can also mean you've weathered the worst and are quietly rebuilding. Either way, resistance costs more than release. Let the untrue thing fall on your terms, and trust that clearing space is its own kind of mercy." },
  "The Star": { essence: "After the storm, one clear light returns to the sky — and with it, the soft certainty that you will be okay.", upright: "The Star rises in the hush after The Tower, pouring water on parched ground and calm into a weary heart. This is hope reborn — not naive, but hard-won and luminous. It promises healing: wounds closing, faith in life quietly restored, a sense that the universe is holding you after all. In love, it's tender renewal, vulnerability that feels safe, a connection that soothes rather than strains. In work, it's inspiration and a guiding vision worth following, even far off. Within, it invites you to bare your soul honestly, to trust your gifts, and to let yourself be seen without armor. The Star is also serenity and generosity — cup overflowing, you have enough to share. Timing unfolds gently, in its own good season. Wish on it. Follow its light. You are exactly where healing begins.", reversed: "Reversed, The Star whispers that faith has dimmed — you feel disconnected, discouraged, unsure the good will come. Perhaps you've been pouring out for everyone and forgot to refill your own cup. This isn't the light going out; it's a call to rest, tend your hope tenderly, and remember your worth. The stars are still there, patient behind the clouds." },
  "The Moon": { essence: "Not everything real can be seen by daylight — trust the quiet knowing that guides you through the dark.", upright: "The Moon lights a winding path where nothing is quite as it seems, and asks you to walk it by feel. This is the realm of dreams, intuition, and the deep subconscious — the messages that arrive sideways, in symbols, tides, and gut-level knowing. It can stir uncertainty or illusion: fears that loom larger in the dark, situations clouded by half-truths or your own projections. In love, unspoken feelings and mixed signals ask for patience and honesty. In work, something isn't fully revealed yet — resist forcing clarity too soon. Within, it's a powerful invitation to honor your imagination, your shadow, and the wisdom rising from your depths. Fear and intuition can feel alike here; learn to tell them apart. Timing is fluid and cyclical. Don't demand the whole road be lit — take the next honest step, and trust.", reversed: "Reversed, The Moon is fog beginning to lift — confusion clearing, a truth surfacing, a fear you can finally name and release. You may be untangling intuition from anxiety, or coming out of a disorienting stretch. Alternatively, it asks you not to bury feelings you'd rather not face. Honor the messages your inner life is sending; they've been trying to reach you." },
  "The Sun": { essence: "The clouds break, warmth floods everything, and life says a clear and radiant yes to you.", upright: "The Sun is the sky's wholehearted yes — the card of pure joy, vitality, and success that needs no hiding. After the Moon's uncertainty, everything is suddenly, gloriously clear. This is warmth on your face, energy in your body, and confidence that comes from simply being yourself. In love, it's radiant connection, laughter, and honesty that feels effortless; in work, well-earned success, recognition, and creative fire. Within, it's the freedom of a child at play — alive, curious, unashamedly happy. The Sun also blesses truth: what was hidden is illuminated, and you can trust what you see. It brings healing, optimism, and the vitality to pursue what you love. This is one of the deck's brightest omens, promising good things flowing your way. Timing is now and favorable. Step into the light — you were always meant to shine here.", reversed: "Reversed, The Sun still shines, just behind a passing cloud. Joy may feel muted, confidence shaky, or your inner light dimmed by others' expectations or your own doubt. Perhaps you're chasing external shine over real contentment. This is a tender nudge to reconnect with what genuinely delights you, lighten your grip, and let simple happiness back in. The warmth is still yours." },
  "Judgement": { essence: "The trumpet sounds and something in you rises up, wide awake at last — this is your great second chance.", upright: "Judgement is the moment of awakening, when a horn sounds across your life and long-buried parts of you rise up to answer. A calling makes itself known — a purpose you can no longer ignore, a truth you finally hear. This is rebirth: you look back honestly at where you have been, forgive yourself and others, and step into a wiser, freer version of you. In love, it can mean a relationship reborn, a reconciliation, or clarity about what truly matters. In work, it is a vocation clicking into place, a decision made from your deepest values. Inwardly, it brings absolution — release from old guilt, a clean slate, self-acceptance. Its timing feels fated, as though the universe itself is calling your name. Answer honestly, and everything you have lived through becomes the ground you now rise from.", reversed: "Reversed, the call is muffled — you may be doubting yourself, dodging a decision, or holding onto guilt long past its use. Perhaps you hear the summons but fear you are unworthy to answer. This is a gentle nudge to stop judging yourself so harshly, to listen inward again, and to trust that it is never too late to begin. Forgiveness, especially of yourself, is the doorway." },
  "The World": { essence: "The whole world rests in the palm of your hand — a great cycle complete, and from here, anything is possible.", upright: "The World is arrival: the long journey rounds full circle and you stand, at last, in a place of wholeness. Something you have poured yourself into reaches completion — a project, a chapter, a version of yourself — and you have earned the reward. This card speaks of integration, of scattered pieces finally fitting into one dancing whole, of belonging fully in your own life. In love, it is a bond that feels complete, harmonious, celebrated. In work, it is achievement, graduation, mastery recognised. It can be literal too: travel, expansion, the wide world opening its doors and inviting you through. Yet completion is also a threshold — every ending is the seed of a new beginning. Pause here. Let yourself feel the fullness of how far you have come, then step through the open door into everything that waits beyond.", reversed: "Reversed, you are close but not quite there — a loose thread, an unfinished piece, a goal that keeps sliding out of reach. Perhaps you have arrived yet cannot let yourself celebrate, or you cling to a chapter that is asking to close. This is an invitation to tie off what remains, honour how far you have come, and give yourself full permission to complete and move on." },
};
const MAJORS_DECK = FULL_DECK.filter((c) => c.arcana === "Major");
const MINOR_MEANINGS = {
  "Ace of Cups": { essence: "A cup that overflows — new love, an open heart, feeling that spills into everything.", upright: "The Ace of Cups is the heart cracking open. Something tender is beginning — a new relationship, a friendship, a rush of creativity, or simply a fresh capacity to feel. Love is being offered to you, and love is welling up inside you too; the cup overflows because there is more than enough to share. In relationships, this is the first spark, an invitation to trust. In work, it is inspiration and joy in what you make. Inwardly, your intuition is clear and your compassion is awake. Let yourself receive. Say yes to the feeling before your mind talks you out of it.", reversed: "The cup is there, but held back — feelings blocked, love guarded, intuition drowned out by noise. Maybe you are pouring into others and running dry, or numbing a heart that longs to open. This is an invitation to refill yourself first, gently, and let one small feeling be felt." },
  "Two of Cups": { essence: "Two hearts meeting as equals — connection, attraction, a promise exchanged between them.", upright: "The Two of Cups is the meeting of two souls on equal ground. This is partnership in its truest form — mutual attraction, respect flowing both ways, a bond where each person is truly seen. In love, it is the spark that becomes a real connection: a first date, a reconciliation, a deepening. But it is not only romance; it is any relationship of genuine give-and-take — a close friendship, a creative collaboration, a partnership built on trust. What makes it work is balance. You bring your cup, they bring theirs, and something healing passes between you. Meet the other halfway and honor what you are building together.", reversed: "The balance has tipped — someone gives more than they receive, or a connection has cooled into misunderstanding. Tension, crossed wires, or a bond that needs tending. This is not the end; it is a nudge to speak honestly, rebuild trust, and restore the give-and-take between you." },
  "Three of Cups": { essence: "Friends raising their cups — celebration, community, joy shared and multiplied together.", upright: "The Three of Cups is a toast among friends. This is the card of celebration, community, and belonging — the moment you gather with the people who love you and raise a glass to something good. A wedding, a reunion, a birthday, a project finished well; joy that grows because it is shared. In relationships, it is warmth and easy friendship, the chosen family who show up for you. In work, it is collaboration and mutual support. Whatever you have been tending has borne fruit, and it is time to enjoy it. Let yourself be held by your people. Accept the invitation, and give thanks out loud.", reversed: "The party feels off — gossip, a friendship strained, or a crowd that leaves you lonelier than solitude would. Maybe you have been overindulging, or giving so much to others that you have lost yourself. Step back, tend the friendships that are real, and rest away from the noise." },
  "Four of Cups": { essence: "Three cups ignored, a fourth offered unseen — apathy, restlessness, a gift you are missing.", upright: "The Four of Cups is the sigh of someone who has enough but cannot feel it. You may be restless, bored, or quietly discontent — going through the motions while a fourth cup is offered right beside you, unnoticed. This is emotional withdrawal, the mood where nothing quite lands and you are not sure what you want. In love, it can mean taking a good thing for granted, or needing space to reconnect with yourself. In work, it is motivation gone flat. The medicine is awareness. Look up. Notice what is already here, and consider that the thing you are missing may be reaching toward you now.", reversed: "You are beginning to stir. The fog of boredom is lifting, and curiosity returns — you are ready to say yes to the cup you refused, to re-engage with life. Or you may be retreating further inward. Either way, gently choose: withdraw a little longer to heal, or step back into connection." },
  "Five of Cups": { essence: "Grieving the spilled cups, blind to the two still standing — loss, and what remains.", upright: "The Five of Cups is standing in grief. Three cups have spilled, and your whole attention is on the loss — the disappointment, the mistake, the relationship that ended, the thing that did not go as you hoped. The sorrow is real, and you are allowed to feel it. But behind you, two cups still stand upright, unspilled: what remains, what can still be saved, the people and possibilities that loss did not take. This card asks you to honor the mourning and, when you are ready, to turn around. Across the river a home is waiting. Not everything is gone. Grieve, then look for the bridge.", reversed: "You are beginning to turn around. Acceptance is coming, and with it forgiveness — of yourself, of another, of how things went. You are gathering the cups that remain and moving toward home. Let the last of the grief move through you; you do not have to carry it forever." },
  "Six of Cups": { essence: "A cup of flowers offered to a child — sweetness, memory, innocence, kindness returned.", upright: "The Six of Cups is a visit from the past, warm and kind. It is the scent that carries you back to childhood, the old friend who reappears, the simple pleasure of giving without wanting anything back. There is innocence here, and nostalgia — a gentleness you may have forgotten you carried. In relationships, it can mean reconnecting with someone from long ago, or bringing childlike playfulness and safety into a bond. In work, it is kindness, generosity, a return to what you first loved. Let yourself remember the good. Offer someone a small gift of care. Sometimes healing looks like being tender the way you were as a child.", reversed: "You may be lingering too long in the past, idealizing what was or wishing you could go back. Growing up is calling. Cherish the memories, but let them nourish the present rather than replace it — the sweetness you are missing can be built again, here, now." },
  "Seven of Cups": { essence: "Seven dreamy cups floating in cloud — choices, fantasy, illusion; which one is real?", upright: "The Seven of Cups is a head full of options and not enough ground. Seven cups float before you in the clouds, each holding a different dream — love, riches, adventure, success — and it is dazzling, but it is also a fog. This is the card of imagination and possibility, and also of illusion: wishful thinking, scattered focus, choices that look shinier than they are. In love or work, you may be daydreaming instead of deciding, or tempted by something that will not deliver. There is real magic in your vision. The task is to tell the true cup from the tempting one. Get clear, then choose one and reach for it.", reversed: "The fog is clearing. You are ready to cut through fantasy, name what you actually want, and commit to a single path. Or you may feel overwhelmed by the choices and tempted to avoid them all. Simplify. One honest step on solid ground beats a hundred daydreams." },
  "Eight of Cups": { essence: "You walk away from something good but hollow, toward what your soul actually needs.", upright: "You've built something that looks fine from the outside, yet inside you feel the ache of \"this isn't it.\" The Eight of Cups is the quiet, brave decision to leave. Not because everything's wrong, but because something deeper is calling you onward. In love, it may mean stepping back from a bond that's stopped feeding your heart. At work, it's outgrowing a role that once fit. This is a lunar, night-lit departure, guided more by feeling than logic. Honor the courage it takes to turn from the familiar and seek meaning. What you're walking toward is worth the loneliness of the road.", reversed: "You sense it's time to go, yet you keep circling back, afraid the leaving will hurt too much. Reversed, this card gently asks: are you staying out of love, or out of fear? Sit with the restlessness. Clarity comes when you stop bargaining with yourself." },
  "Nine of Cups": { essence: "The wish card: contentment earned, comfort savored, your heart quietly getting its way.", upright: "This is the moment you lean back, arms folded, and think: life is good. The Nine of Cups is satisfaction you can feel in your body, the pleasure of a full table, a warm night, a wish coming true. It rewards you for the emotional work you've done and invites you to actually enjoy what you have instead of racing to the next thing. In love, it's ease and mutual delight. At work, a goal met. Inside, a rare peace. Let yourself feel proud and well-fed by your life. Gratitude here is not naive, it's the whole point.", reversed: "The comforts are all there, but something still feels empty, like you got what you wanted and it didn't fill you. Reversed asks you to look past surface pleasures toward what your heart truly hungers for. True contentment is inner, not something you can buy or collect." },
  "Ten of Cups": { essence: "The rainbow after the rain: love that holds, belonging, a home that feels whole.", upright: "This is the happy ending the heart dreams of, made real and daily. The Ten of Cups is emotional fulfillment shared, the warmth of people who love you and a place that feels like home. Where the Nine was your own contentment, the Ten is joy multiplied through connection: family, chosen or born, laughter, safety, belonging. In love, it's lasting harmony and a shared future. At work, a team that feels like kin. Inside, gratitude so full it spills over. Look up and notice the blessing you're standing in. This is what all the striving was quietly for.", reversed: "The picture of happiness is there, but a small distance hums beneath it, a gap between how things look and how they feel. Reversed invites honest, tender conversation. Real harmony isn't perfect, it's built by people willing to tend the small cracks before they widen." },
  "Page of Cups": { essence: "A young heart open to wonder: a sweet message, a creative spark, unexpected feeling.", upright: "Something tender and new is bubbling up, a crush, an idea, an invitation to feel again. The Page of Cups is the part of you that stays soft and curious, willing to be surprised by beauty. Messages arrive here, often about love or the heart's quiet longings. In relationships, it's the flutter of a beginning or a gentle offer of affection. Creatively, it's inspiration that seems to leap out of nowhere, like the little fish popping from the cup. Don't dismiss the dreamy, playful nudges you're getting. Follow the small wonder. Say yes to the feeling before your grown-up mind talks you out of it.", reversed: "The feelings are there, but you're second-guessing them, or a message got tangled in worry. Reversed can mean tender emotions turned shy or moody. Be gentle with your own sensitivity. Let yourself feel without needing it to make sense or be perfectly returned yet." },
  "Knight of Cups": { essence: "The romantic rides in: an offer of the heart, an invitation, a dream pursued.", upright: "Here comes the charmer, the poet, the one moved by beauty and feeling. The Knight of Cups approaches with a cup held out, an offer, a courtship, an invitation to something that stirs your heart. He follows his emotions and his ideals, moving gracefully rather than fast. In love, this is the sweep of romance, someone making their feelings known, or you leading with your heart. Creatively, it's chasing a dream that inspires you. Let yourself be moved, but keep your feet on the ground too. Accept the beautiful offer, follow the vision, just make sure the feeling has substance beneath the shine.", reversed: "The romance feels a little too smooth, or a promise hasn't quite landed in action. Reversed asks you to tell true feeling from empty charm, in others and yourself. Let your heart lead, but let it be honest. Real love shows up, not just says lovely things." },
  "Queen of Cups": { essence: "Deep, still water: compassion, intuition, a heart that feels everything and holds it gently.", upright: "She sits at the edge of the sea, gazing into her cup, at home in the world of feeling. The Queen of Cups is emotional wisdom, the ability to feel deeply without drowning, to hold others' pain with tenderness. She trusts her intuition and follows the quiet knowing beneath her thoughts. In relationships, she's nurturing, empathetic, safe to be vulnerable with. In yourself, she's the invitation to honor your sensitivity as strength, not weakness. Listen to your gut this week, it's speaking clearly. Care for others from a full cup, and remember to mother yourself as kindly as you tend everyone else.", reversed: "You're feeling so much for everyone else that your own cup has run dry, or you've walled the feelings off to cope. Reversed is a call home: tend your inner tides first. You can't pour from an empty heart. Your sensitivity needs care, not silencing." },
  "King of Cups": { essence: "Calm amid the waves: a heart that feels fully yet stays steady and kind.", upright: "He sits on a throne that floats on a churning sea, yet the water never topples him. The King of Cups is emotional mastery, the rare gift of feeling deeply while staying calm, wise, and generous. He doesn't repress his feelings or get swept away by them, he holds them with a steady hand. In relationships, he's the mature, supportive presence who listens without judgment and stays warm under pressure. At work, the diplomat who keeps their cool. Inside, he's the invitation to lead with both heart and balance. Be the steady one this week, compassionate and unshaken. Your calm is a gift to everyone around you.", reversed: "The waves have gotten into you, feelings bottled up until they leak as moodiness, or kindness curdled under stress. Reversed asks you to feel what you've been holding back, honestly and safely. Steadiness isn't numbness. Let the emotion move through you so it stops running the show." },
  "Ace of Wands": { essence: "A match strikes in the dark — raw inspiration, a spark begging to become a fire.", upright: "Something in you just lit up. The Ace of Wands is pure creative spark — a new idea, a project, a desire, a rush of energy that wants to move. It's the moment before anything is built, when possibility feels electric and your hands itch to begin. In love, it's chemistry and fresh attraction; at work, an exciting opportunity or a bold new venture. Don't overthink it — this card asks you to say yes to the impulse while it's still hot. Trust the instinct tugging at you. Strike the match, and see what catches.", reversed: "The spark is there but stalling — an idea you keep postponing, or enthusiasm that fizzled before it took hold. Maybe fear, doubt, or bad timing dimmed the flame. Nothing's lost. Reconnect with what first excited you, and give that impulse a little room to breathe." },
  "Two of Wands": { essence: "The world in your hands, a horizon to choose — power, planning, the pull of more.", upright: "You've proven you can start things; now you're deciding how far to go. The Two of Wands is the view from the tower — you hold the world in your palm and survey what's possible. This is planning, ambition, and personal power: mapping a bigger future and daring to want it. In work, you're weighing a real opportunity or an expansion. In love, you're clarifying what you truly want before you commit. One wand is fixed, safe and familiar; the other is in your grip, ready to travel. Choose boldly. Small steps now shape a wide horizon.", reversed: "Fear of the unknown may be keeping you close to shore. You sense a bigger life but hesitate to plan for it, or you overplan and never move. Let yourself want more. One honest step past your comfort zone reopens the horizon." },
  "Three of Wands": { essence: "You've set things in motion; now you watch the horizon for your ships to come in.", upright: "The plan is launched and now you wait, but this is confident waiting, not idle worry. The Three of Wands is foresight and expansion — you've sent your efforts out into the world and you can already see them returning. This is a card of growth, trade, travel, and long-range vision; opportunities may come from far away or from people beyond your usual circle. In work, your reach is widening. In love, patience pays as something develops at its own pace. Keep your eyes on the distance. What you started is sailing toward you.", reversed: "Delays or setbacks may be testing your patience, and it's tempting to give up right before the ships arrive. Maybe your plans were too narrow, or you're not looking far enough ahead. Widen your view, adjust the sails, and keep trusting the longer horizon." },
  "Four of Wands": { essence: "Garlands and open doors — a milestone reached, and everyone you love gathered to celebrate.", upright: "Pause and celebrate — you've reached something worth marking. The Four of Wands is joy, homecoming, and harmony: a wedding, a housewarming, a milestone, a season of belonging. Four sturdy wands hold up a canopy of flowers, and the message is that your foundation is solid enough to throw a party under. In love, it's stability, commitment, and shared happiness; at work, a project lands and the team rejoices. This card invites you to feel your roots and let the people around you in. Gratitude, community, and rest are the reward here. Enjoy it fully — you earned this.", reversed: "The celebration feels muted, or a transition has home and belonging feeling unsettled. Maybe you're between chapters, or joy is there but you're too busy to feel it. Come back to your roots. Even a small, honest gathering can restore your sense of home." },
  "Five of Wands": { essence: "Everyone talking at once, wands clashing — messy competition, friction, the scramble to be heard.", upright: "Things are chaotic, but not truly dangerous. The Five of Wands is the scuffle — clashing opinions, competition, and everyone pushing their own agenda at the same time. It's the group project where no one's listening, the crowded field, the friction of too many wills in one room. This tension can be exhausting, yet it's often the friction that sharpens you. In work, it's rivalry or disagreement; in love, petty squabbles that need untangling. The trick is to stop swinging wildly and find your footing. Bring order to the noise, name what you actually want, and the fight becomes progress.", reversed: "The conflict may be winding down, or you're finally tired of the pointless struggle. Perhaps you've been avoiding a needed clash, or turning the competition inward on yourself. Choose your battles. Step back, breathe, and decide which fights are actually worth your fire." },
  "Six of Wands": { essence: "The parade, the laurel wreath, the crowd cheering — your win, seen and celebrated.", upright: "This is your victory lap. The Six of Wands is public recognition, success, and well-earned acclaim — you rode through the hard part and now you're being celebrated for it. A laurel wreath crowns you and the crowd is on your side. In work, it's a promotion, a win, or praise that finally lands; in love, confidence and being appreciated for who you truly are. This card asks you to actually receive the applause instead of deflecting it. Let yourself feel proud. Success shared with those who cheer you on is sweeter, and it fuels the next climb.", reversed: "The recognition you hoped for hasn't come, or self-doubt is drowning out the applause. Maybe you're waiting on others to validate you, or a win feels hollow. Your worth isn't the crowd's to grant. Acknowledge your own progress; quiet victories count too." },
  "Seven of Wands": { essence: "High ground, one against many — you hold your position and defend what's yours.", upright: "You've got the high ground, and now you have to defend it. The Seven of Wands is standing firm — the moment success or belief invites challenge, and you must hold your position against the pushback. Six wands rise up at you, but you have the advantage of higher ground and conviction. This is courage, perseverance, and the willingness to say, no, this is mine. At work, defend your ideas or boundaries; in love, stand up for what you need. It can feel like you're outnumbered, but you're not outmatched. Plant your feet. What you're protecting is worth it.", reversed: "The constant defending has worn you down, and you're wondering if it's still worth the fight. Maybe you're being defensive where no real threat exists, or giving ground you shouldn't. Pause. Decide what genuinely needs protecting, and let the rest go so you can rest." },
  "Eight of Wands": { essence: "Everything speeds up at once — the green light you've waited for finally flashes.", upright: "Something you set in motion is suddenly racing forward. After a slow stretch, the way clears and events move fast — messages arrive, plans align, and momentum carries you. This is the card of swift action and good timing, so answer the call quickly rather than overthinking it. In love, a rush of communication or feeling closes distance; someone reaches out, or you finally send the message. At work, projects launch and news lands, and travel may beckon. Trust the flow, stay ready, and aim your energy true — like arrows once loosed, these things land where you point them.", reversed: "The rush stalls, or moves too fast to steer. Delays, crossed wires, or scattered energy leave you spinning. This is an invitation to slow down, untangle the miscommunication, and pick one clear direction before you launch. Patience now saves you from chasing arrows already off course." },
  "Nine of Wands": { essence: "Bruised but still standing — one more push and the wall is yours.", upright: "You've come far and it hasn't been easy. This card finds you weary yet resilient, guarding what you've built with the last of your strength. You may feel wary, braced for one more challenge — but you have more grit than you know, and you're closer to the finish than it feels. In love, past hurts can make you cautious; let healthy boundaries protect you without walling out the good. At work, persistence pays, so don't quit right before the breakthrough. Rest if you must, then rise once more. Your stamina is your quiet superpower here.", reversed: "Exhaustion has hardened into defensiveness, and you may be fighting battles that are already over. This is an invitation to lower your guard, ask for help, and tend your wounds instead of bracing for the next blow. Not every wall needs defending." },
  "Ten of Wands": { essence: "You're carrying the whole load — but not alone, and not all at once.", upright: "You've taken on a great deal, and the weight shows. This is the card of burden and responsibility — the hard, honorable work of seeing things through even when your arms are full. Success brought its own load: more duties, more demands, more you feel obliged to hold. Notice what's truly yours to carry and what you can set down or share. In love, you may be shouldering the relationship's effort alone, so speak up. At work, you're stretched thin. The town is in sight — finish the last stretch, then finally put the bundle down.", reversed: "The load has become too much, and something has to give. This is a kind nudge to delegate, decline, or release what was never yours to hold. Burnout is not proof of devotion. Lighten the bundle before it bends you further." },
  "Page of Wands": { essence: "A spark of an idea, a restless itch to explore — say yes to the adventure.", upright: "Curiosity is tugging at you. The Page of Wands is the beginner's fire — full of enthusiasm, fresh ideas, and the urge to explore before you know exactly where you're headed. A new passion, message, or opportunity is lighting you up; follow it playfully, without needing all the answers first. In love, this is flirtation, excitement, and the courage to make the first move. At work, an inspiring project or bold idea wants your attention. Let yourself be a delighted beginner. Enthusiasm is your compass now — chase what sets you alight and see where the trail leads.", reversed: "The spark sputters — an idea stalls, or restlessness scatters you before you begin. This is an invitation to gently follow through on one thing rather than flitting between many. Your enthusiasm is real; give it a little patience and direction to grow roots." },
  "Knight of Wands": { essence: "Full-throttle passion — you leap first and let the world catch up.", upright: "You're fired up and ready to charge. The Knight of Wands is pure forward motion — bold, adventurous, magnetic, chasing what excites you with everything you've got. When your energy is aimed well, you're unstoppable; you take the risk others hesitate over and make things happen. In love, this is passion, pursuit, and heat — thrilling, if a touch impulsive. At work, you launch fearlessly and inspire others to move. Just remember to look before you leap, so your fire builds rather than burns out. Channel this daring, keep your eyes on the goal, and ride hard toward what you want.", reversed: "The fire runs hot and unfocused — impulsiveness, delays, or false starts leave your plans half-finished. This is a gentle call to pause, aim before you charge, and see one thing through. Your passion isn't the problem; steadying it is the whole art." },
  "Queen of Wands": { essence: "Warm, magnetic, sure of yourself — you light up every room you enter.", upright: "This is confidence with a warm heart. The Queen of Wands is vivacious, charismatic, and self-assured — she knows her worth, pursues her passions boldly, and draws people in with her warmth rather than force. She invites you to own your fire: be sociable, courageous, and unapologetically yourself. In love, this is radiant, generous, loyal energy — attractive because you're wholly you. At work, you lead with charm and determination, juggling much without losing your spark. Trust your instincts, tend your independence, and let your light spill over onto others. When you're rooted in self-belief, you become irresistible and quietly powerful.", reversed: "Self-doubt has dimmed your usual glow, tempting you toward jealousy, people-pleasing, or holding back. This is an invitation to rekindle your confidence from the inside — you don't need anyone's permission to shine. Reconnect with what makes you feel alive and warm again." },
  "King of Wands": { essence: "A born leader with a big vision — you turn bold ideas into real momentum.", upright: "This is mature fire — vision paired with the will to make it real. The King of Wands is a natural leader: bold, charismatic, decisive, and generous with his energy. He sees the big picture, sets a daring course, and inspires others to follow. He invites you to lead with confidence and integrity, to back your vision with action, and to be the entrepreneur of your own life. In love, this is passionate, protective, honorable devotion. At work, you command respect by example, not force. Own your authority, keep your word, and let your bold ideas light the way forward for everyone.", reversed: "The fire tips into arrogance, impatience, or ruling by force rather than inspiring. This is a kind reminder that true leadership listens. Soften the ego, lead by example, and make sure your bold vision leaves room for others to shine too." },
  "Ace of Swords": { essence: "The fog burns off and one true thought stands sharp, bright, and undeniable.", upright: "Something clicks, and suddenly you see clearly. The fog lifts, the confusion burns off, and one true thought stands sharp and bright. This is the card of breakthrough — a fresh idea, an honest word, a decision that finally feels right. In love, it's a raw and clarifying conversation; in work, a brilliant insight or a plan that cuts straight to the point. Truth is your ally now, even when it stings. Speak plainly, think boldly, and trust the clean edge of your own mind. You have the power to name what's real and to begin again.", reversed: "The clarity is there but tangled — confused thinking, a truth you're afraid to speak, or brilliance used to wound instead of heal. Slow down. Get quiet until the real thought surfaces, then wield it gently. Honesty still frees you, but only when it's kind." },
  "Two of Swords": { essence: "Blindfolded at a crossroads, balancing two hard choices you don't yet want to face.", upright: "You're at a crossroads and don't want to look. Blindfolded, arms crossed, you hold two heavy choices in perfect, aching balance — and staying still feels safer than choosing. But this truce is only temporary. Somewhere beneath the standoff, your heart already leans one way; you've simply blocked the feeling out to avoid the discomfort. In love, it's a stalemate needing honesty; in work, a decision you keep postponing. The invitation is tender: take off the blindfold. Let yourself feel, gather the facts, and trust that you can face what you see. Peace comes not from avoiding the choice, but from finally making it.", reversed: "The logjam is easing — or the pressure to decide has grown too great to ignore. Information you were avoiding comes to light, and the blindfold slips. Be careful of choosing rashly just to end the tension. Let clarity, not exhaustion, guide your next step." },
  "Three of Swords": { essence: "The honest ache of a hurting heart, and the mercy of letting it rain.", upright: "This is the ache of a hurting heart, and there's no use pretending it doesn't sting. Three swords, a gray sky, honest rain — grief, heartbreak, a painful truth you couldn't unsee. Maybe words were said, a trust was broken, or love went a way you didn't choose. The card doesn't rush you; it simply lets the storm be real. And there is mercy in that. Rain clears the air. Pain named is pain that can begin to move through you. Feel it fully, let yourself cry if you need to, and know the sky does not stay gray forever. You will mend.", reversed: "The worst of the storm is passing, and you're ready to release the sorrow you've been holding. Forgiveness — of another, or of yourself — begins to feel possible. Don't rush the healing, but do let the swords come out. You were never meant to carry this pain forever." },
  "Four of Swords": { essence: "Lay down the swords and rest; recovery is not the same as surrender.", upright: "Rest. That's the whole message, and it's a kind one. Like the knight lying still in the quiet chapel, you've earned a pause — from the striving, the worrying, the endless mental noise. This isn't giving up; it's recovering. Your mind and body need stillness to heal and to gather strength for what's next. In work, step back before you burn out; in love, give a tender situation room to breathe. Sleep well, be gentle with yourself, meditate, retreat. The swords stay on the wall for now. When you rise again, you'll be clearer, calmer, and far more able to meet the world.", reversed: "You may be pushing too hard, running on empty, or feeling restless in a stillness you keep resisting. This is your body's gentle warning. Slow down before you're forced to. Alternatively, it's time now to wake, stretch, and re-enter life — the rest has done its work." },
  "Five of Swords": { essence: "A hollow victory that leaves everyone smaller — some fights aren't worth the winning.", upright: "Someone has won, but the air tastes bitter. Here is conflict that leaves everyone smaller — the smirking figure gathering swords while others walk away in defeat. Maybe you fought and 'won' at the cost of a friendship; maybe you're the one retreating, stung by unfair words. The card asks you to look honestly at the battle. Is this fight worth what it's costing you? Some victories aren't worth the winning, and some hills aren't worth the dying. In love and work, pride and point-scoring only deepen the distance. Choose your conflicts wisely, and be willing to lay a sword down first.", reversed: "You're ready to end the fighting and make peace. The desire to be right loosens its grip, and reconciliation becomes possible. Reach out, apologize where it's warranted, or simply walk away from a battle that was never truly yours. Releasing the grudge sets you free." },
  "Six of Swords": { essence: "A quiet boat drifting away from hard waters toward a gentler, calmer shore.", upright: "You are moving toward calmer waters. Like the quiet boat gliding a mother and child across the river, you're leaving a hard chapter behind — not with fanfare, but with weary relief. The passage may be sad; you carry your swords, your memories, the weight of what happened. Yet the current is finally carrying you somewhere gentler. In love, it's healing after hurt; in work, a needed transition or a literal move. Trust the journey even if the far shore is still misty. You don't have to know exactly where you're headed. You only have to keep drifting toward the peace ahead.", reversed: "You long to move on but feel stuck at the dock — unfinished business, old baggage, or fear keeping you tethered. Something in you isn't ready to let go yet, and that's okay. Name what's holding you, tend it honestly, and the way forward will open." },
  "Seven of Swords": { essence: "Tiptoeing off with a clever plan — be smart, but stay honest with yourself.", upright: "There's cleverness in the air, and a whiff of getting away with something. The figure tiptoes off with an armful of swords, sure no one is watching. Sometimes this is you being strategic — acting alone, keeping plans close, choosing your battles with cunning rather than brute force. Sometimes it's a warning: watch for deception, in others or in yourself. Are you avoiding a hard truth by sneaking around it? In love and work, shortcuts and half-honesty tend to catch up with us. Be smart, yes, but be honest too. The cleverest move is usually the one you could explain in the open.", reversed: "A secret comes to light, or you're ready to stop hiding and come clean. Maybe you're returning something you slipped away with, or forgiving your own missteps. Honesty feels like a weight lifting. Alternatively, don't try to do it all alone — it's safe to ask for help." },
  "Eight of Swords": { essence: "Blindfolded and fenced by fear — yet the cage was never locked.", upright: "You feel stuck, hemmed in, like every option leads nowhere. But look closer: the swords around you leave a clear path out, and the blindfold is one you can lift. Most of what traps you here is a story your mind keeps repeating — \"I can't,\" \"there's no way.\" In love, you may feel powerless or afraid to speak. At work, overwhelmed and boxed in by other people's expectations. The card's kind truth is that your situation is far less fixed than it feels. One honest step, one question, one call for help, and the fence falls away.", reversed: "The blindfold is slipping. You're beginning to see how you kept yourself small, and freedom feels near. Move gently — release the old fears one at a time rather than blaming yourself for wearing them. You always had permission to walk out." },
  "Nine of Swords": { essence: "Three a.m. worry, head in your hands — but nightmares are not the morning.", upright: "You wake in the dark and the fears pile on, each one louder than the last. This is the card of anxiety, guilt, and the racing 3 a.m. mind that turns worries into monsters. Something is genuinely weighing on you, but notice: the swords hang on the wall, they haven't touched you. Most of this suffering lives in imagination, not fact. In love or work, you may be catastrophizing, replaying regrets, losing sleep. Be gentle. Name the fear out loud, tell someone, write it down. In daylight, most of these shadows shrink back to their true, manageable size.", reversed: "The worst of the worry is loosening its grip. You're ready to face what you've been dreading, or to ask for help carrying it. Reach out — a therapist, a friend, a journal. What felt unbearable alone becomes survivable once it's spoken aloud." },
  "Ten of Swords": { essence: "Rock bottom, ten blades in your back — and the very first light of dawn.", upright: "This is a painful ending, the bottom of a hard chapter. Something is truly over — a relationship, a job, a hope you clung to — and it may have ended with betrayal or a final, cutting blow. Don't rush to pretend you're fine; this card honors real grief. Yet look at the horizon: the sky is already lightening. Ten swords is as bad as it gets, which means there is nowhere left to fall. The hardest part is behind you. Let it end fully, mourn it honestly, and trust that dawn is genuinely, quietly on its way.", reversed: "You're rising from the ground, slowly. Recovery has begun, though you may still fear the pain returning. Resist the urge to relive the wound or dramatize the ending. It's finished. Gather yourself, forgive where you can, and walk toward the light that's already breaking." },
  "Page of Swords": { essence: "Wind in your hair, sword raised, mind ablaze with restless new ideas.", upright: "A fresh curiosity is stirring — new ideas, questions, a hunger to learn and to say what you think. The Page of Swords is quick, alert, and endlessly interested, standing ready for whatever the wind brings. This is a good time to study, start a conversation, send the message, speak your truth. In love, honesty and playful banter open doors. At work, your sharp mind spots what others miss. Just watch the shadow side: gossip, sarcasm, jumping to conclusions, or so much talk that little gets done. Stay truthful and kind, and let your keen mind serve, not sting.", reversed: "Your thoughts may be scattered, your words a little sharp or hasty. Slow down before you speak or send. Guard against gossip, snooping, or all talk and no action. The remedy is patience: gather the full story, then choose your words with care." },
  "Knight of Swords": { essence: "Full gallop into the wind, sword high — all drive, all speed, no brakes.", upright: "Here comes action, fast and fearless. The Knight of Swords charges straight at his goal, blade raised, certain and impatient to make things happen. When this card rides in, it's time to move on an idea with courage and conviction — speak up, push the project, chase the thing you want. Your mind is sharp and your ambition electric. But at a full gallop it's easy to overlook the details, trample feelings, or burn out. In love and work, passion is high but patience is thin. Aim before you charge, and channel all that force toward something that truly deserves it.", reversed: "All that energy has nowhere good to go — you may feel scattered, blunt, or reckless, rushing in before you've thought it through. Pull back on the reins. Speed without direction only causes crashes. Pause, aim clearly, then move. The goal will still be there." },
  "Queen of Swords": { essence: "Clear-eyed and kind but unfooled — wisdom earned the hard way.", upright: "The Queen of Swords sees clearly and speaks honestly. She has known sorrow and come through it wiser, so she offers truth without cruelty and compassion without illusion. When she appears, lead with clarity: set the boundary, name the thing plainly, make the decision your head and heart both agree on. This is a card of independence and perceptiveness — you can read a situation for exactly what it is. In love, honesty matters more than flattery. At work, your judgment is sound and fair. Trust your discernment, keep your standards high, and let your directness be a form of respect, not coldness.", reversed: "Your clarity may be tipping into harshness — sharp words, cold distance, or a mind that assumes the worst. Old hurt might be hardening your edges. Soften. You can be honest and warm at once. Let a little tenderness back into how you speak and judge." },
  "King of Swords": { essence: "The calm, fair mind that cuts through noise straight to the truth.", upright: "The King of Swords is the master of clear thought — rational, principled, and fair. He rules by intellect and integrity, weighing the facts before he speaks and standing by what is true even when it's hard. When he appears, step into your own authority: think it through, be honest, make the ethical call, and hold your ground with quiet confidence. This is a card of good judgment, expertise, and mental discipline. In love, communicate honestly and keep your word. At work, your objectivity earns trust. Lead with your head, temper it with fairness, and let truth be your standard.", reversed: "Reason may be curdling into coldness or control — logic used to dominate, judgments made without heart, or standards so rigid nothing measures up. Even truth needs kindness. Ask whether you're being fair or just fierce, and let compassion back into your decisions." },
  "Ace of Pentacles": { essence: "A hand offers you a golden seed — new work, new money, a solid start taking root.", upright: "Something solid is being handed to you — a job offer, a raise, a fresh start with your health, a home taking shape. The Ace of Pentacles is a seed of real, touchable prosperity, and it's ripe. This is the moment to say yes and plant it. In love, a relationship built to last, grounded and warm. At work, an opportunity worth your effort. Your body feels like a good place to live. Trust that abundance isn't a fantasy here; it's a doorway right in front of you. Step through and tend what you've been given.", reversed: "A good opportunity feels just out of reach, or you're clutching a plan that isn't ripe yet. Maybe money worries crowd out the yes. Slow down. The seed is still real — check your soil, steady your footing, and the doorway reopens when you're ready to commit." },
  "Two of Pentacles": { essence: "Juggling it all with a dancer's grin — money, time, two lives held in easy motion.", upright: "You're keeping a lot of balls in the air — two jobs, a budget, family and fun — and the Two of Pentacles says you can actually dance with it. This is the art of the flexible one, the person who adjusts on the fly and keeps their sense of humor. Money comes and goes; you're learning its rhythm. In love, you juggle time between someone and everything else. The trick isn't to freeze under the weight but to stay light on your feet. Prioritize, laugh, breathe. You're far more capable of balance than you fear.", reversed: "Too many balls, and one's about to drop. You feel stretched thin, over-committed, robbing one part of life to pay another. This is an invitation to simplify — set something down on purpose before it falls. You don't have to carry all of it at once." },
  "Three of Pentacles": { essence: "Your skill, seen and valued — three heads building what none could raise alone.", upright: "Your work is being noticed, and it turns out you're good at this. The Three of Pentacles is the card of the craftsperson, the team, the project where everyone's talents click into place. You bring skill; others bring vision and support; together you build something that lasts. This is a fine time to collaborate, to ask for feedback, to let yourself be recognized. In work, a well-earned nod or a spot on a solid team. In love, a partnership where you actually build together. Take pride in the doing — mastery grows one careful, appreciated stroke at a time.", reversed: "The teamwork stalls — mismatched effort, fuzzy roles, or your work going unseen. Maybe you're cutting corners, or no one's listening to your ideas. Name what the project needs and ask for it plainly. Good building requires everyone rowing together; realign before you raise the next wall." },
  "Four of Pentacles": { essence: "Holding on so tight your knuckles whiten — safe, maybe, but unable to move.", upright: "You've got something and you don't want to lose it — money, a routine, a person, a sense of control. The Four of Pentacles is that grip. There's wisdom in it: saving, protecting, building security all matter. But held too tightly, the same grip that guards you also stiffens you. Notice where you're clenched. In money, you're careful — which is good, unless fear runs the show. In love, holding on can quietly tip into holding back. Ask: is this keeping me safe, or keeping me stuck? Security is meant to free you, not fence you in.", reversed: "The grip is loosening — for better or worse. Maybe you're finally learning to give, to spend, to trust and let a little go. Or control is slipping and it scares you. Either way, open the hand gently. You lose far less than you fear when you release." },
  "Five of Pentacles": { essence: "Out in the cold, hurting — but warm light glows just beside you, if you'll look.", upright: "This is a hard stretch — money is tight, health is shaky, or you feel shut out and alone. The Five of Pentacles knows real struggle, the kind that makes you feel invisible in the snow. But look closely: the lit window is right there. Help exists, warmth exists, and part of this lesson is letting yourself walk toward it instead of trudging past. In love, don't isolate; reach for the ones who would hold you. Hard times are real, and also temporary. You are not as alone as the cold makes you feel. Ask, and let yourself be let in.", reversed: "The worst may be lifting — recovery, a hand extended, a door you finally knock on. You're coming in from the cold, forgiving yourself, accepting help you once refused. Or, gently: notice if pride is still keeping you outside. Warmth is waiting; let yourself receive it." },
  "Six of Pentacles": { essence: "Coins passed hand to hand, scales held level — the give and take of generosity.", upright: "Something is flowing between people — money, help, kindness — and you're part of the exchange. The Six of Pentacles is generosity with a fair hand: giving when you have, receiving when you need, without shame on either side. Right now you may be the one who shares, or the one who's helped; both are honorable. In work, a bonus, a mentor, support that arrives just in time. In love, a balanced give and take. Just watch the scales — true generosity keeps no one small. Give freely, receive gracefully, and notice how abundance grows when it's allowed to move.", reversed: "The exchange feels off — strings attached, a debt held over you, or giving that's really about control. Maybe you always give and never receive, or the reverse. Rebalance the scales. Real generosity carries no invoice; look for where the flow has quietly turned into leverage." },
  "Seven of Pentacles": { essence: "Leaning on your hoe, watching the vines — the pause where you weigh what's growing.", upright: "You've been working, and now you stop to look at what you've grown. The Seven of Pentacles is that breath of assessment — the garden isn't ripe yet, but it's coming, and you're deciding whether to keep tending this patch or turn your effort elsewhere. This is patience, the long game, the honest question of whether the investment is paying off. In work, results are slow but real; don't yank up the plant to check its roots. In love and money alike, some things simply need time. Trust the season. What you've planted is quietly becoming.", reversed: "Impatience gnaws — you want the harvest now, or you fear all this effort was wasted. Maybe it's time to admit a plant won't fruit and move your energy somewhere better. Pause honestly: is this slow growth, or a dead end? Either answer sets you free." },
  "Eight of Pentacles": { essence: "Head down, heart in it — the quiet joy of getting good at something.", upright: "This is the card of practice, of showing up again and again until your hands know the work by heart. You're building a real skill, and there's deep satisfaction in doing something carefully, well, for its own sake. In work, it's an apprenticeship, a craft, a project you're pouring yourself into — mastery earned one repetition at a time. In love, it means tending the relationship like a craft, small attentive acts done with care. Inwardly, you're learning patience with your own progress. Don't rush. Every honest hour you put in is quietly making you excellent.", reversed: "Maybe the effort feels hollow — busywork without meaning, or perfectionism that never lets you finish. Perhaps you're cutting corners, or bored and going through the motions. This is a gentle nudge to reconnect with why you started, or to let 'good enough' finally be enough." },
  "Nine of Pentacles": { essence: "You did the work, and now the garden is yours to enjoy.", upright: "Here is the reward of self-discipline: a life you built with your own hands, comfortable and truly yours. You can stand in your garden and enjoy what you've grown — money you earned, a home you made, a peace you cultivated. This card celebrates independence, the quiet luxury of not needing anyone to complete you. In love, it asks you to be whole on your own first; a good partner adds to a full life, not a fixing of an empty one. In work, it's abundance from long effort. Treat yourself. You've earned this ease, and it suits you.", reversed: "Perhaps you're leaning too hard on others, or on money, to feel safe — or you've won the comfort but can't relax into it. This is an invitation to build your own steady foundation, and to trust that you're allowed to enjoy what you already have." },
  "Ten of Pentacles": { essence: "Home, family, and the kind of wealth you pass down through generations.", upright: "This is the card of legacy — not just money, but the whole rich fabric of family, home, and belonging built to last. You're part of something bigger than yourself: traditions, roots, people who came before and those who'll come after. In work, it's lasting security, the business or savings that hold steady. In love, it's commitment with a future — building a household, blending families, thinking long-term. Inwardly, it's the peace of knowing you're supported and connected. Notice who your people are and what you're creating together. Some things you build are meant to outlive you.", reversed: "Maybe family feels more like pressure than shelter — old conflicts, money tangles, expectations that don't fit you. Or the stability itself feels stifling. This is a chance to honor your roots while writing your own chapter, and to sort out what truly belongs to you." },
  "Page of Pentacles": { essence: "A fresh start you can hold in your hands — curious, eager, ready to learn.", upright: "Something new and solid is beginning, and you're wide-eyed about it. The Page is the student, the beginner, the one who looks at a fresh opportunity like a coin turned over in wonder. This is the spark to learn a skill, start a course, take a first real job, or plant a seed you'll tend for years. In work, it's an offer or an apprenticeship worth taking seriously. In love, it's a sincere, budding connection. Stay curious and grounded. You don't have to know everything yet — just be willing to begin and to keep showing up.", reversed: "Perhaps the dream stays a daydream — big plans, no first step, or a start that keeps stalling. Maybe you're scattered or impatient. This is a soft nudge to pick one small, real action today and actually do it. Beginnings only count when you begin." },
  "Knight of Pentacles": { essence: "Slow, steady, and utterly dependable — the one who actually finishes the job.", upright: "This Knight doesn't gallop; he plods, and that's his power. He's the one who keeps his promises, does the boring maintenance, and finishes what he starts. If you've been waiting for progress, trust the steady path — routine, patience, and reliability will get you there more surely than any shortcut. In work, it's diligence and follow-through that build real results. In love, it's a loyal, grounded partner, or a courtship that unfolds carefully. Inwardly, it's discipline. Yes, it can feel slow. But look up: the field is being plowed, row by row, and the harvest is coming.", reversed: "Steady can tip into stuck — stubborn, stalled, or so cautious nothing moves at all. Or you're grinding through work that's lost its meaning. This is an invitation to check whether your routine still serves you, and to allow a little flexibility back in." },
  "Queen of Pentacles": { essence: "Warm, capable, generous — she nurtures people and prospers at the same time.", upright: "The Queen of Pentacles turns a house into a home and a little into enough. She's practical and deeply nurturing — the friend who feeds you, remembers what you need, and somehow keeps the whole show running. This card invites you to care for yourself and others in tangible ways: good food, a cozy space, steady money, a warm hand. In work, you're resourceful and grounded, balancing ambition with real life. In love, you give generously and want security too. Tend your garden — body, home, budget, relationships. Abundance grows where you patiently, lovingly, look after it.", reversed: "Maybe you're giving so much to everyone else there's nothing left for you, or leaning on comfort and spending to soothe a deeper worry. This is a gentle reminder that you're allowed to receive too. Fill your own cup; you matter as much as those you tend." },
  "King of Pentacles": { essence: "The self-made provider — abundance, stability, and a steady hand on it all.", upright: "Here is the master of the material world, the one who built his wealth and knows how to keep it growing. The King of Pentacles is generous because he's secure — a provider, a mentor, the steady one others lean on. This card points to prosperity earned through discipline and good judgment, and the quiet confidence that comes with it. In work, it's leadership, business sense, long-term success. In love, it's a reliable, loyal partner who shows care through commitment and provision. Stand in your competence. You have what it takes to build something lasting and to share it well.", reversed: "Perhaps security has hardened into control, stubbornness, or measuring worth only in money and status. Or you quietly doubt your own solid footing. This is an invitation to loosen your grip, remember what wealth is really for, and trust the abundance you've already built." },
};

const DECKS = [
  { id: "classic", name: "The Classic", free: true, desc: "Rider-Waite inspired · deep midnight tones", g1: "#1a1a3e", g2: "#0d0d1a", frame: T.gold, motif: "✦" },
  { id: "fairy", name: "Fairy Realm", free: true, desc: "Luminous watercolour fairies · enchanted forests", g1: "#1d3326", g2: "#101d24", frame: T.sage, motif: "🦋" },
  { id: "ocean", name: "Ocean Oracle", free: false, desc: "Dolphins & sea creatures · flowing blue hues", g1: "#0d2740", g2: "#081826", frame: T.teal, motif: "🐚" },
  { id: "botanical", name: "Botanical", free: false, desc: "Lush florals & sacred plants", g1: "#23301c", g2: "#131c10", frame: T.sage, motif: "🌿" },
  { id: "celestial", name: "Celestial", free: false, desc: "Nebulae, planets & starfields", g1: "#1d1438", g2: "#0d0a20", frame: T.violet, motif: "🪐" },
  { id: "wings", name: "Spirit Wings", free: false, desc: "Angels & ethereal beings in golden light", g1: "#33291a", g2: "#1a1410", frame: T.goldHi, motif: "🕊️" },
  { id: "dark", name: "Dark Mystic", free: false, desc: "Gothic ravens, moons & ancient symbols", g1: "#1c1022", g2: "#0c0810", frame: T.rose, motif: "🌙" },
  { id: "earth", name: "Sacred Earth", free: false, desc: "Art honouring the natural world", g1: "#33231a", g2: "#1a120d", frame: "#d39a6a", motif: "🌾" },
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
  { name: "Archangel Michael", domain: "Protection & Courage", colour: "Cobalt Blue", hex: "#3b6fd4", crystal: "Black Tourmaline", img: "/images/angels/archangel-michael.webp",
    about: "The leader of the archangels and the great protector, Michael carries a sword of blue flame that cuts away fear, negativity, and all that is not of love. He is the angel of courage, strength, and divine protection — the one who stands between you and harm, both seen and unseen, and lends his fearlessness to anyone who asks.",
    signs: "A sudden warmth or flash of cobalt-blue light, an unexpected wave of calm, or the quiet sense of being 'backed' and no longer alone.",
    callOn: ["Fear, panic, or anxiety takes hold of you", "You feel unsafe, threatened, or drained by someone", "You need to protect your home, your children, or someone you love", "You must find courage to speak up or hold a boundary", "You want to clear a room or your own energy of heaviness", "You're facing something that frightens you and need strength"],
    invocation: "Archangel Michael, surround me in your blue flame of protection. Cut away all that is not of the light, and fill me with courage and strength.",
    messages: [
      "The fear you have been carrying is not too big for me. Name it, even in a whisper, and watch my blade of blue flame pass clean through it. What frightens you has no roots in the truth of who you are. I am here, larger than the shadow, closer than your breath. Breathe now. You do not face this alone, and you never once did.",
      "There is a cord still tying you to someone who quietly drains your light. You feel it tug, don't you, each time you almost feel free. Give me your permission and I will sever it cleanly, with love, harming no one. What is truly yours returns to you. What was never yours releases its grip. You will feel lighter by evening, I promise you this.",
      "Plant your feet. Yes, right there, in the very place they told you to shrink. You have every right to stand here, to want what you want, to speak the difficult no. I am at your back with my sword drawn, and no one moves you from ground that is genuinely yours. Feel how solid the earth is beneath you, how it holds.",
      "Rest now. Truly rest. You have stood on guard so long you forgot that another can hold the watch. Tonight I will keep it for you. Lay down your vigilance like a heavy coat at the door and let your shoulders fall. Nothing reaches you here that I would not meet first, and gladly. You are safe. Sleep, little one, sleep.",
      "That heaviness in your home is not yours to keep. Open a window, and let me move through every room with cobalt light, gathering up all that soured the air. Old arguments, old grief, the residue of people who came and took. Gone. Your space is being made clean and bright again. Walk through it tomorrow and feel the difference settle in your chest.",
      "Leap. You keep whispering that you are not ready, but readiness is a myth the fearful tell themselves at the edge. Courage is simply moving forward while your knees shake, and I have never once seen brave knees that did not. So go. Say the thing, begin the thing, become the thing. I lead the charge, and you ride right here beside me.",
      "Who told you that you were unguarded? Somewhere a lie took root that you must fend off the whole world alone with your own two hands. Look again, more carefully. There is an entire host standing at your shoulder, and I command it. You have never once been undefended. When you feel small tomorrow, press your hand to your heart and remember an army loves you.",
      "Your mind has been racing through worst cases again, running down every dark hallway at once. Come here. Let me set Black Tourmaline at your feet and blue flame at your crown, and let the racing slow. Not every thought is a true warning; most are only weather, passing through. Watch them go. I am the still one in the storm, and I am not leaving.",
      "Speak. The words have been pressed down in your throat so long they ache, and I tell you plainly that they deserve air. Your truth is not too much, not too sharp, not too loud. Say it, and let it land wherever it lands. I stand guard over every honest word you send into the world. No one punishes you for your own voice while I am near.",
      "How long have you been carrying all of that alone? Set it down a moment, here, into my open hands. You were never meant to be the strong one every hour of every day, without rest, without help of any kind. Even the strongest lean. So lean now. My strength is not a loan you must repay; it is simply yours, poured in until you are full.",
      "Someone made you smaller than you are, and slowly you began to believe them. I have come to take that lie back, by force if I must. You are not weak. You were surrounded, outnumbered, exhausted, and still you stood. That is not weakness, that is a warrior mid-battle. Reclaim your name. Reclaim your fire. I am placing your power back into your own two hands.",
      "Look at you, still bracing for a blow that isn't coming. Loosen that jaw. Unclench those brave little fists. Not every day is a battle, and this one, I promise, is safe enough to actually enjoy. Let me carry the sword today so your hands are free for something good. Go find one small, ordinary delight, and let today be exactly that simple."
    ] },
  { name: "Archangel Raphael", domain: "Healing & Health", colour: "Emerald Green", hex: "#3da06b", crystal: "Malachite", img: "/images/angels/archangel-raphael-2.webp",
    about: "The divine physician, Raphael pours emerald-green healing light through body, mind, and heart. He tends the unwell, guides doctors, nurses, and all healers, watches over travellers, and mends not only the body but grief, heartbreak, and addiction — restoring wholeness wherever he is welcomed.",
    signs: "Emerald-green sparkles or light, a sudden easing of pain or tension, or the gentle urge to rest, breathe, or drink water.",
    callOn: ["You or someone you love is ill or in pain", "You're facing surgery, treatment, or a medical appointment", "You need support with recovery, rest, and renewal", "You're travelling — he is the patron of safe journeys", "You're healing heartbreak, grief, or an old wound", "You or a loved one is in recovery from addiction"],
    invocation: "Archangel Raphael, pour your emerald healing light through every cell of my being. Restore me to wholeness in body, heart, and spirit.",
    messages: [
      "You are not as alone in this sickbed as you feel. I am already here, my hands warm against the ache in you, breathing emerald light into every tired cell. Let the fever do its slow work while I keep watch. Your only task tonight is to rest and to trust — the mending has begun beneath your skin, quiet and sure. Sleep now. I will not leave.",
      "I know how long you have carried this pain, how it has become the first thing you meet each morning. Hear me: you are not being punished, and you are not broken. Let me lay my light where it hurts most. Some days I will ease it; other days I will simply help you bear it. Either way, I am beside you inside every hour. You are still whole.",
      "Rest is not the enemy of your healing — it is the very ground of it. I see you fighting to be useful again, restless in your own bed, ashamed of your own slowness. Put that shame down. A seed does its deepest growing in the dark, unseen. Let me tend you the way I tend everything that heals: gently, without hurry. You will rise when your body is ready, not a moment before.",
      "Before you set out on this journey, let me go ahead of you. I will smooth the road you cannot see, steady the wings and wheels that carry you, and stand at every doorway between here and where you are going. Travel light and unafraid. My presence goes with you like a lantern held just past the dark — you are watched over, mile by mile, all the way home.",
      "Give me the pieces of your broken heart — yes, even the sharp ones you are afraid to hold. I have mended hearts far more shattered than you believe yours to be, and I will not flinch at yours. Love did not make a fool of you; it made you brave. Let me pour my green light into that hollow place until it becomes tender again, not numb. You will love once more.",
      "Grief is love with nowhere left to go, and I would never ask you to hurry it. Cry as long as you need; each tear is holy to me. The one you lost is not as far from you as this ache makes it seem, and the bond between you was never severed — only changed. Let me sit with you in the missing. I will hold the weight you cannot carry alone tonight.",
      "One breath at a time is enough — you do not have to conquer a lifetime today. I know the pull that whispers you are weak, and I am telling you it lies. Every hour you choose yourself, I am cheering you on, closer than that craving ever was. When the wanting rises like a tide, reach for my hand instead. You are not your worst night. You are healing, and I see it.",
      "Who heals the healer? Tonight, I do. You have poured yourself out for so many that your own cup rings empty, and still you believe you must give more. Stop. Turn those tending hands toward yourself for once and let me refill you. The world does not need you drained to a shadow — it needs you well. Rest in my light now; I will keep watch over the ones you love while you do.",
      "Something in you is quietly beginning again. Do you feel it? The heaviness that clung to you for so long is loosening its grip, cell by cell, and a lighter self is stirring underneath. You need not force this renewal — only allow it. Drink the water, feel the sun, move a little more than yesterday. I am greening you from the inside, like spring returning to a bare and patient tree.",
      "Set that fear down for a moment — the one that keeps you awake rehearsing the worst. I am here in the waiting, in the not-knowing, and I have not looked away from you once. Whatever the days ahead hold, you will not face a single hour of it alone. Breathe with me. Let my calm become your calm. Fear is loud, but I am steady, and I am not going anywhere.",
      "There is a thread still binding you to something that only ever made you sick — a person, a habit, an old story about yourself. Let me cut it clean. You will not bleed; you will breathe. What drained your health through that cord ends here, and the light that pours back in is yours to keep. Feel how much lighter your body already is. You were never meant to carry that poison. Be free.",
      "Here, come closer. Lay the whole tired weight of your body against my wing and let yourself be held the way you are always holding everyone else. Nothing is required of you in this moment — not strength, not answers, not a brave face. You are safe. My emerald light is a blanket over you, warm and unhurried, and it will still be here when you wake. Breathe out. You can finally let go."
    ] },
  { name: "Archangel Gabriel", domain: "Communication & Creativity", colour: "White & Copper", hex: "#d8c8b8", crystal: "Selenite", img: "/images/angels/archangel-gabriel.webp",
    about: "The great messenger, Gabriel opens the voice and the creative channel. She carries announcements and new life, inspires writers, artists, and speakers, and helps you say the true thing with clarity and grace. She is also the tender guardian of parents, pregnancy, and children.",
    signs: "A soft copper or white shimmer, a rush of unexpected inspiration, or the right words arriving as if from nowhere.",
    callOn: ["You must speak, write, or express something important", "You're facing an interview, presentation, or hard conversation", "Your creativity feels blocked or stalled", "You're pregnant, giving birth, or raising children", "You're called toward a new beginning or purpose", "You need to find the right words in a difficult moment"],
    invocation: "Archangel Gabriel, open my voice and my creative channel. Help me express my truth with clarity and grace.",
    messages: [
      "There is a conversation you keep rehearsing in the dark of your mind, and I hear every version. You do not need the perfect script — you need only to begin. Say the first true thing, and I will carry the rest on my breath. The words will arrive as you speak them. Trust the opening you are about to make; I am already there in the pause before you speak.",
      "So the page has gone blank on you again, and you think the well has run dry. It hasn't. You've simply been guarding the tap too tightly. Let something ugly out first — a crooked line, a wrong note, a clumsy sentence. That is how I prime the channel. Creation is never clean at the start. Make the mess with me, and watch what rushes through the moment you stop demanding it be beautiful.",
      "Something is beginning in you, small as a seed and just as certain. You may not have words for it yet, and that is well — not every dawn announces itself loudly. Let it root in the quiet before you speak it aloud. When the moment ripens you will know, and I will stand beside you as you say it. New things deserve tender keeping. Guard this one gently a little while longer.",
      "I have been near the tender news you carry, closer than your own heartbeat. Whether it is a child, a hope, or a whole life quietly rearranging itself within you, know that it is held. You are not doing this alone, and you never were. Breathe. Let your body and your spirit do what they already know how to do. I am keeping watch over the small bright thing that grows in you.",
      "You worry that you are getting it wrong with the little one you love — too sharp one hour, too soft the next. Hear me: children do not need a flawless parent, only a present one. Your fumbling, honest love reaches them more than any perfect word ever could. Kneel to their height, meet their eyes, and speak plainly. I will help you find the sentence that lands as pure tenderness in their small, listening heart.",
      "Enough of swallowing your own voice to keep a room comfortable. I did not open your throat so you could make peace by disappearing. Your truth is not an attack; it is a lamp. Set it on the table. Some will squint, some will look away, and the right ones will finally see you clearly. Speak it clean and let it land where it lands. I stand with you inside every single word.",
      "The fear you feel — that you will say it clumsily, that your voice will shake, that they will misunderstand — I know it intimately. But a trembling voice still tells the truth. Let it shake. Sincerity has never once required steadiness. I will be in the breath beneath your ribs, steadying what needs steadying. You have never been as alone in your speaking as your fear keeps trying to convince you that you are.",
      "Set down the words that were spoken over you long ago — the ones that told you to be quiet, to be smaller, to fold yourself away. Those were never mine. My voice in you is the one that says you are worth hearing. Cut the old cord that binds your tongue. In my white-and-copper light let that heaviness burn clean away, and draw one full breath as the free and unmuzzled thing you truly are.",
      "Rest your voice a while. You do not have to explain yourself today — not to anyone, not even to me. There are seasons for speaking and seasons for the sweet silence where wisdom quietly gathers. Sit in this stillness and let it hold you completely. Nothing is required of you here. When you are ready, the words will be waiting, riper for the patience. For now, simply be quiet, and safe, and here.",
      "Someone near you is aching, and you are so afraid of saying the wrong thing that you have said nothing at all. Come closer instead. You need no wisdom and no cure — only your honest, clumsy, unhurried presence. 'I am here. I don't know what to say, but I am here.' Let that be enough, because it is. I will guide your hands and your silences alike. Love so rarely needs the perfect words.",
      "That thing you keep almost-making — the book, the song, the work only your particular hands can shape — it is not vanity to want it. It is a summons. I set that restless spark in you on purpose, and it will not let you rest until you honor it. Stop waiting to feel ready; ready never arrives on its own. Begin badly, begin today, begin afraid. I will meet you the very instant you say yes.",
      "Go on — tell them your good news. You have been cradling this joy so carefully, half-afraid that speaking it aloud might somehow shatter it. It won't. Joy shared is joy doubled, and yours deserves to ring out through the room. Let your whole face light up as you say it. I love the sound of you when you are unguarded and glad. Announce it, and let me carry the echo far and wide."
    ] },
  { name: "Archangel Uriel", domain: "Wisdom & Clarity", colour: "Gold", hex: "#d4b04c", crystal: "Amber", img: "/images/angels/archangel-uriel-3.webp",
    about: "The angel of wisdom and inner light, Uriel illuminates the mind with golden clarity. He brings insight, understanding, and calm to troubled thoughts, and helps you find the wisdom hidden inside a problem or a hard season — a steady lamp for study, decisions, and confusing times.",
    signs: "A warm golden glow, a sudden 'aha' of understanding, or a quiet calm settling over a racing mind.",
    callOn: ["You're facing a difficult decision", "Your mind is confused, anxious, or overwhelmed", "You have study, exams, or important thinking ahead", "You need insight into a problem you can't crack", "You're seeking peace after conflict or upheaval", "You're searching for your purpose or direction"],
    invocation: "Archangel Uriel, illuminate my mind with your golden light. Show me the wisdom hidden within this moment.",
    messages: [
      "Two roads pull at you tonight, and you keep turning between them, terrified of choosing wrongly. Here is a secret: no path is so crooked that my light cannot find you on it. Choose with your whole heart rather than your fear, and even a small step, taken honestly, becomes the right one the very moment you begin to walk.",
      "Your mind feels like a room with every lamp lit at once, so bright that you cannot see. Come, let me dim the noise for you. You do not need to solve all of it today. Set down the thoughts that are not yours to carry, and keep only the one nearest your hand. Clarity is not more thinking; it is quieter thinking.",
      "I have watched you bent over your work, wondering whether any of it is truly sinking in. It is. Every page you turn, every question you sit with, is laying gold beneath the surface where you cannot yet see it. Trust the slow build. Wisdom rarely arrives in a flash; more often it seeps in quietly, and one day you simply know.",
      "Feel how that problem you have circled for weeks begins to loosen now. The answer was never hiding from you; you were simply too tired to receive it. Rest your grip on it. I am pouring a thread of amber light straight into the tangle, and where it touches, knots come undone. Watch the solution rise on its own, as if it always knew the way.",
      "The argument is over now, yet it still echoes inside your chest. Breathe. You do not have to win it again in your mind at midnight. I am smoothing those sharp words into something you can finally lay down. Forgiveness is not pretending it did not hurt; it is refusing to let the hurt keep writing your story. Let peace have the last word.",
      "Wondering what you are for, are you? I feel the ache of it, the sense that everyone else received a map and you were handed a blank page. But that page is not empty; it is yours to write, and that is the rarer gift. Your purpose is not lost. It is being assembled from every true thing you have ever loved. Keep loving them out loud.",
      "Come close, and let me speak to the fear that says you will ruin everything with one wrong move. You are not so powerful that a single mistake can undo a whole life, nor so alone that you must decide it perfectly by yourself. I stand beside your every choice, ready to redeem even the clumsy ones. Move; I would far rather steady you than watch you frozen.",
      "How tired you are. I can feel it in the way your thoughts keep running long after the day is done. You are allowed to stop now. Nothing important will be lost while you rest; the answers will keep until morning. Lay your head down and let me hold the whole tangled day for you. You will wake clearer than any amount of striving could make you.",
      "Others have tried to talk you out of what you already know, haven't they? Do not let a louder voice convince you that your quiet knowing is wrong. I gave you that discernment; it is real, and it is yours. Stand in it gently but fully. You need not argue or defend, simply remain, rooted in the clarity I have lit within you, and let them wonder.",
      "An old belief clings to you, whispering that you are not clever enough, not the one who figures things out. Hand it to me. It was never true; it was only loud and well practiced. Right now I am cutting the thread that binds you to that lie, and I feel it fall away. What remains is the bright, capable mind that was always yours beneath the doubt.",
      "Oh, you serious thing, when did you last let yourself be curious purely for the joy of it? Wisdom is not all furrowed brows and heavy books. Sometimes it giggles. Sometimes it wanders down a side street with no destination and comes home glowing. Go chase a question that simply delights you today, with no use for it at all. Your mind opens widest when it is allowed to play.",
      "Be still with me a moment. You do not have to reach for anything right now, or become anyone other than who you already are. Feel the small, steady flame I keep burning at your center; it has never once gone out, not even in your darkest hour. When the way forward is not yet clear, this is enough: to sit in the warmth of your own inner light and let it be trusted."
    ] },
  { name: "Archangel Chamuel", domain: "Love & Relationships", colour: "Pink", hex: "#d489a0", crystal: "Rose Quartz", img: "/images/angels/archangel-chamuel.webp",
    about: "The angel of love in every form, Chamuel helps you find and nurture loving bonds, mend broken ones, and — most of all — love yourself. His rose-pink light soothes anxiety and helps you find whatever you've lost, whether a soulmate, a set of keys, or your own inner peace.",
    signs: "A warm pink glow around the heart, a sudden feeling of being deeply loved, or something lost turning up just when you'd given up.",
    callOn: ["You long for love or a soulmate", "You want to heal or strengthen a relationship", "You feel lonely, anxious, or heartbroken", "You've lost something — an object, a person, your peace", "You struggle to love, accept, or forgive yourself", "You're facing a hard conversation with someone you love"],
    invocation: "Archangel Chamuel, open my heart to give and receive love freely. Help me see myself and others through the eyes of compassion.",
    messages: [
      "Look at how hard you are on yourself today. I would like you to stop, just for a moment, and speak to yourself the way you would speak to someone you adore. You are not a project to be fixed; you are a garden already blooming. The tenderness you keep pouring outward, turn a little of it home. I am pouring my rose-pink light into every place you have called unlovable.",
      "Right there at your own table sits a love you keep overlooking. You have been so busy chasing what is far away that you nearly missed the hand resting near yours. Water what is alive. Say the small true thing. Let them see your face without its armor. Ordinary devotion, repeated, is the most extraordinary magic I know, and you are already fluent in it.",
      "You said something you cannot unsay, and it has been sitting between you like broken glass. Go to them. Not to win, not to explain, simply to lay down your weapon first. Repair is not weakness; it is the bravest form of love there is. I will steady your voice as you begin: I'm sorry, and I have missed you. Watch how quickly a bridge can be rebuilt.",
      "Would it shock you to learn how many hearts hold you gently, even now? The friend who thinks of you on their evening walk. The one who quietly saved you the last seat. You have decided you are hard to love, and it simply is not true. Let today be the day you stop guarding the door and let the warmth already knocking come all the way in.",
      "That relationship has been draining you drop by drop, and some quiet part of you already knows it. Loving someone does not mean handing them your whole self to spend. I am placing my hand over yours as you draw the line, kindly, clearly, without apology. A boundary is not a wall against love; it is the shape that lets real love stay. Hold it.",
      "The quiet of your home has turned heavy tonight, and I feel it with you. Come, sit close a while, you are not as alone as this silence would have you believe. Heartbreak is love with nowhere to land, and yours is still so alive, still so worthy of a home. Let it lean against me; I will hold the ache so your hands are free to begin healing.",
      "What you thought was gone for good is closer than you fear, a friendship left to grow cold, a tender version of yourself you set down years ago. Retrace your steps with a soft heart. What is lost is rarely destroyed; it is usually just waiting to be looked for. Follow the warmth. My rose light will fall upon it the very moment you turn the right corner.",
      "Your heart has been racing since morning, bracing for a blow that may never come. Breathe with me now, in, and slowly out. You are safe in this exact moment; feel the floor beneath you, steady and sure. Anxiety is only love that has forgotten it is held. I am wrapping you close, and nothing can reach you here that I will not help you carry.",
      "Set down the stone you keep aimed at your own chest. The mistake you cannot forgive, I forgave it before you even thought to ask. That frightened younger self was only doing their clumsy best with what little they knew. You have already outgrown the one who did that. Begin again today, lighter; you are so much more than your worst hour.",
      "Oh, let yourself be a little delighted! Someone is going to notice the way you laugh, and I have front-row seats. Stop rehearsing all the ways it could go wrong and let your heart be curious again. Wear the color that makes you feel alive. Say yes to the coffee. Love has a sense of humor, you know, and it has been trying to make you smile all week.",
      "Death did not sever the love between you; it only changed the shape that love takes. When you miss them, speak their name aloud, I carry your words straight to where they rest. Grief this deep is simply love with nowhere left to pour. You are not betraying them by living fully; that living is the truest way you keep on loving them.",
      "I know the ache of wanting someone to come home to. It is not foolish, this longing, it is your heart doing exactly what hearts were made to do. But do not shrink yourself smaller while you wait, hoping to be easier to love. The love meant for you will want all of you, the whole bright blaze. Keep your fire lit; it is a beacon, not a burden."
    ] },
  { name: "Archangel Jophiel", domain: "Beauty & Joyful Thought", colour: "Sunshine Yellow", hex: "#eccb55", crystal: "Citrine", img: "/images/angels/archangel-jophiel.webp",
    about: "The angel of beauty and joyful thought, Jophiel brightens your inner world and helps you see the beauty already around you. She lifts heavy, anxious, or self-critical thinking, slows you down to savour life, and pours in joy, gratitude, and a lighter heart.",
    signs: "A sunny yellow light, a smile that rises out of nowhere, or beauty catching your eye in something you'd walked past a hundred times.",
    callOn: ["Your thoughts turn dark, heavy, or self-critical", "You need to see beauty and feel gratitude again", "Low mood needs lifting and joy needs inviting in", "Life feels rushed, grey, and joyless", "You're beautifying a space, a project, or yourself", "You want to shift the energy of a bad day"],
    invocation: "Archangel Jophiel, beautify my thoughts and brighten my inner world. Open my eyes to the beauty already all around me, and lift my heart into joy.",
    messages: [
      "That voice inside you — the one that lists your flaws before your feet even touch the floor — is not your true voice, and I will not let it have the last word. Come closer. I am pouring my sunshine-yellow light over every place you have called ugly. What if you are not broken, only tired of being told so? Let me show you what I see.",
      "Heavy, isn't it, this day you have been carrying like wet wool. Set it down a moment — just a moment — and look up with me. Notice the light on the wall. The steam curling off your cup. One small good thing, then another. I am not asking you to feel joyful. I am only asking you to let joy find a crack to slip through.",
      "Before you rush into the doing, let me hold you here in the noticing. You woke. You breathe. Someone, somewhere, is glad you exist — and so am I. Gratitude is not a chore you owe the universe; it is a door, and behind it your whole life is waiting to look larger. Open it slowly. Let me count the blessings with you until you believe them.",
      "Slow down, you glorious, galloping thing. Life is not a list to be finished — it is a peach to be eaten over the sink with the juice running down your wrist. You have been swallowing your days whole. Chew. Taste. Let one ordinary hour be delicious. I promise the world will still be here when you look up, only lovelier for your having tasted it.",
      "Your rooms have been listening to your sadness, and they have grown dim to match you. Let us change that together. Open a window. Move one thing into the light. Put flowers where you will see them from your bed. Beauty is not vanity, sweet one — it is a language of care you speak to yourself. Make one corner lovely today, and watch how it begins to love you back.",
      "Stand at your mirror without flinching for once, and let me stand behind you. I have watched you scan your own reflection for evidence against yourself, and it breaks my luminous heart. Those eyes have held so much. That face has smiled through storms you told no one about. You are not here to be decorative. You are here to be radiant — and radiance was never about symmetry.",
      "Ah, you have been scrolling through everyone else's brightness again, measuring your dim against their glow. Come away from that window. What you are seeing is a highlight, not a life. Meanwhile your own light — real, warm, particular — has been waiting in the room the whole time, unwitnessed by you. Turn around. I will not have you go on believing you are the only ordinary one. You are anything but.",
      "There is a colour in you that has not been let out to play in far too long. I can see it — bright as marigolds, restless behind your ribs. Make something today. It does not have to be good. Draw, hum, rearrange the shelf, wear the ridiculous earrings. Joy is not the reward for a finished life; it is the paint you fling around while you are living it. Go on. Make a mess with me.",
      "I know today the world looks grey to you, and I will not insult that greyness by pretending it away. But sit with me a while. I have been placing small beauties in your path all morning, hoping — the bird at the sill, the kind word from a stranger, the way the tea warmed your hands. You missed them, and that is alright. I will keep placing them. I am patient, and I am not going anywhere.",
      "You keep waiting for the perfect moment to be happy — when the house is clean, the weight is off, the work is done. My love, that moment is a mirage, and you are dying of thirst chasing it. Happiness is not on the far side of your to-do list. It is here, in the unfinished, imperfect, gorgeously ordinary now. Stop postponing your own delight. I am handing it to you today.",
      "Hold this thought like a warm citrine in your palm: nothing that is alive stays the same, and you were never meant to. The lines gathering at your eyes are a map of every time you laughed. Let them. There is a beauty that only arrives with the years — deeper, unbothered, sure of itself. You are ripening, not fading. I have loved every version of your face, and I love this one most.",
      "Go out into your day wearing joy like a colour that suits you — because it does. Laugh too loudly. Admire the sky as though you had paid for it. Tell someone their eyes are kind. You are allowed to be delighted by small things; it is not childish, it is wise. Scatter brightness wherever you pass today, and know that every ray of it comes home to you doubled. Shine, you marvel."
    ] },
  { name: "Archangel Zadkiel", domain: "Mercy & Forgiveness", colour: "Violet", hex: "#9a6fd8", crystal: "Amethyst", img: "/images/angels/archangel-zadkiel.webp",
    about: "The angel of mercy and transmutation, Zadkiel bathes you in the violet flame that dissolves the past into freedom. He helps you forgive — others and yourself — release old pain and guilt, and remember what your heart has buried. He is gentle with regret and powerful with release.",
    signs: "A violet light or haze, a sudden softening or tears of relief, or the simple sense of a weight quietly lifting.",
    callOn: ["You're carrying guilt, regret, or shame", "You need to forgive someone — or forgive yourself", "You want to release the past and old emotional pain", "A memory or grudge won't loosen its grip", "You're beginning prayer, meditation, or healing work", "You're trying to remember something important"],
    invocation: "Archangel Zadkiel, bathe me in the violet flame of transmutation. Help me forgive myself and others, releasing the past into light and freedom.",
    messages: [
      "You have carried that one mistake like a stone sewn into your coat, and I have watched you flinch each time it knocks against your ribs. Set it down here, in my open hands. I do not weigh it the way you do. What you have named unforgivable, I simply call human, already softening in the violet light I am pouring over you now. Let it go.",
      "Loosen your grip on that grudge, just one finger at a time. I feel how your jaw tightens at their name. You believe forgiveness would mean the wound was alright — it does not. It means you finally stop drinking the poison you brewed for them. You are not excusing what they did to you; you are refusing to keep bleeding for it.",
      "Years ago something broke in you, and a part of you has knelt by that wreckage ever since, keeping vigil, as if leaving would betray it. Sweet one, you are allowed to stand up now. The past cannot be re-lived into a kinder shape, but it can be released, thread by thread, until it no longer runs your today. Come away from the ruins. Walk out into the warm.",
      "Shame swears that if anyone truly saw you, they would turn and leave. It is a liar, and a loud one. I see all of you — the hidden rooms, the locked drawers, the things you have never said aloud — and I have not moved an inch from your side. There is nothing inside you my mercy cannot hold.",
      "The healing you began is not failing just because it still aches. Tender things throb as they knit — this is your soul doing its quiet, stubborn work. Do not keep tearing off the bandage every hour to check. Rest into it. While you sleep I am tending the deep places your own hands cannot reach. Trust the mending, even when it is unseen.",
      "Regret keeps replaying the door you did not walk through, as though standing here longer might change which way it opened. But you chose with the light you had then, not the light you carry now. Forgive that younger self for not knowing what only time could teach. They were doing their honest best in the dark. Let them off the hook at last.",
      "Oh, the way you speak to yourself — I would never let anyone address my dearest friend so cruelly, and yet you do it a hundred times before breakfast. Try this with me: the next unkind sentence you aim at your own heart, hand it over instead, and I will trade you something truer. You are not behind. You are not too much. You are so deeply loved.",
      "Somewhere a cord still runs from your chest to a person, a season, a version of things long finished, and it tugs you backward each time you try to move on. I lift my violet flame to it now. You need not hate them to be free of them. Feel the cord thin, and fray, and part — cleanly, without cruelty. You belong to yourself again.",
      "In all your striving to fix and prove and repair, you have forgotten the small true thing at your center — the reason any of it ever mattered to you. Let the rest fall quiet for one moment. What remains when the guilt and the clamour burn off in my flame is simply love, aching to be lived. That is what matters. Everything else can wait until morning.",
      "Rest here awhile; you do not have to earn this. I am not keeping a ledger of your worthiness, adding and subtracting through the long night. Mercy is not a wage paid for good behaviour — it is simply what I am, poured out over you whether you have earned it or not. Set the accounting down. Breathe. You are safe in the violet hush of my wings.",
      "There is a face that stops your breath when it surfaces — someone you love, whom you wounded. This ache is your conscience, and it is holy; it means your heart is good. Yet do not let it harden into a sentence with no end. Make what amends you can, and then release yourself. Carrying guilt forever will not heal them — it only raises a second wound beside the first.",
      "Bring me the whole heap of it — the regret, the old anger, the shame you have been composting in secret for years. This is exactly what my violet flame is for. I do not merely tidy your past away; I transmute it, turning even your hardest chapter into gold you can spend on becoming wise. Nothing in you is waste. Hand it all over, and watch what mercy makes."
    ] },
];

/* ---------------- Crystals ---------------- */
const CRYSTALS = [
  { name: "Amazonite", colour: "Turquoise green", hex: "#6ec5b0", chakra: "Throat & Heart", element: "Water", zodiac: "Virgo", pair: "741 Hz",
    keywords: ["Communication", "Truth", "Hope", "Harmony", "Courage", "Throat"],
    use: "Soothes anxiety, restores hope, and empowers honest speech.",
    meaning: "Amazonite is the stone of truth and hope — a soothing blue-green that calms an anxious mind while lending quiet strength to say what needs saying. Long called the 'stone of courage,' it filters out the static of others' opinions and helps you find your own clear voice. It brings heart and throat into gentle agreement, so the words you speak are both honest and kind.",
    work: "Hold it while journalling or before speaking up, or set it on your desk to keep worry at bay and communication flowing.",
    affirm: "I speak my truth with courage and an open heart.",
    deep: { origin: "Amazonite is the blue-green gem variety of microcline, a potassium feldspar from the same vast mineral family that makes up much of the Earth's crust. Its soft turquoise colour was long blamed on copper, but modern study traces it instead to trace lead and water locked in the crystal lattice, coaxed into colour by natural radiation over geological time. It grows as blocky crystals in coarse igneous rock called pegmatite, often intergrown with smoky quartz and with pale albite that gives it its characteristic white streaking. Despite its name it is not actually found on the Amazon (an old case of mistaken identity with green stones traded there) — the finest material comes from Pikes Peak in Colorado, Russia's Ilmen Mountains, Madagascar, Brazil and Ethiopia.", lore: "Green feldspar beads and amulets turn up in Egyptian tombs, including among the treasures of Tutankhamun, and it is thought to be one of the green stones alluded to in the Egyptian Book of the Dead. The stone earned its modern name from the Amazon River in the eighteenth and nineteenth centuries, though the green stones the river's peoples truly prized were more likely nephrite jade. Its romantic reputation as a 'stone of courage' tied to the mythic Amazon warrior-women is a modern embellishment rather than a documented ancient tradition — but it captures honestly the calm, unhurried boldness people have always felt in it.", mind: "Amazonite is the great soother of the anxious, over-thinking mind. Crystal tradition works with it to filter out the static of other people's opinions and expectations so you can finally hear your own truth beneath the noise. It is reached for to calm the worried chatter that keeps honest words stuck in the throat, to ease the fear of confrontation, and to bring heart and head into agreement so that what you feel and what you say are at last the same thing.", spirit: "Bridging the throat and heart chakras, Amazonite lets love rise up into speech, so the words you offer come out both truthful and kind. Energetically it is used to align these two centres of feeling and expression, dissolving the gap between what the heart holds and what the mouth dares to say. Many keep it close in the work of setting boundaries and speaking authentically, trusting it to lend a grounded, hopeful courage that never tips into harshness.", body: "In folk and crystal tradition Amazonite is associated with the throat and thyroid and with easing the physical tension that gathers there, and it has been reached for to calm the nervous system and soothe muscle spasm. Some also keep it as a talisman against the strain of environmental and electromagnetic 'stress.' All of this is tradition and comfort only — Amazonite is never a treatment and no substitute for proper medical care.", care: "Amazonite is reasonably hard (about 6 to 6.5 on the Mohs scale) but it has perfect cleavage and can chip or flake if knocked, so handle tumbled pieces gently. You may cleanse it briefly under cool running water and dry it well, or clear it more gently with sound, smoke or a night resting on selenite. A little early-morning light is fine, but avoid long, harsh sunlight, which can slowly pale its blue-green — recharge it instead on the earth, in moonlight, or nestled among clear quartz." } },
  { name: "Amethyst", colour: "Violet", hex: "#9b72cf", chakra: "Third Eye & Crown", element: "Air", zodiac: "Pisces, Aquarius", pair: "963 Hz",
    keywords: ["Calm", "Intuition", "Sleep", "Protection", "Spiritual Growth", "Clarity"],
    use: "Calms the mind, deepens intuition, supports restful sleep.",
    meaning: "Amethyst is the stone of the serene mind — a natural tranquilliser that quiets mental chatter and lifts awareness toward the spiritual. Long worn as a guard against overindulgence and a doorway into deeper meditation, it turns a racing head into a still, listening one, and is often called the traveller's stone of intuition.",
    work: "Keep a piece by the bed or under your pillow for restful, dream-rich sleep, or hold it during meditation and breathe until the mind settles.",
    affirm: "My mind is calm, and my inner sight is clear.",
    deep: { origin: "Amethyst is the violet variety of quartz — crystalline silicon dioxide (SiO2) — coloured by trace iron built into its lattice, whose purple colour-centre is switched on by natural gamma irradiation deep within the host rock. It grows as crystals lining cavities in volcanic rock, the geodes and vugs of basalt lava, where silica-rich groundwater cools slowly over long ages and lays down quartz point by point; the same mineral crystallising without that irradiated iron centre stays clear. It measures 7 on the Mohs scale. Fine amethyst comes chiefly from Brazil (especially Rio Grande do Sul) and Uruguay, whose deep-violet geodes are the most prized, as well as Zambia, Madagascar, the Ural Mountains of Russia — the historic 'Siberian' amethyst — and Thunder Bay in Ontario, Canada.", lore: "The name descends from the Greek amethystos, 'not intoxicated.' Greeks and Romans carved drinking cups and set amulets of it believing the stone would keep a wine-drinker sober — a notion recorded by Pliny the Elder and later embroidered into a Renaissance myth by the poet Remy Belleau, who invented a maiden named Amethyste turned to clear crystal by Diana to save her from Bacchus. In the medieval and Renaissance Church it became a bishop's stone, set into rings and pectoral crosses as an emblem of sober, spiritual devotion, and Leonardo da Vinci noted the belief that it dispelled evil thoughts. It long counted among the 'precious' or cardinal gems, rivalling ruby and emerald in value, until the vast 19th-century Brazilian and Uruguayan finds made it widely affordable.", mind: "Amethyst is traditionally worked with as the stone of the serene, sober mind. Folk practice reaches for it to quiet racing thoughts, ease worry and overwhelm, and cool an over-stimulated head into stillness — a companion for meditation, for calmer dreams and restful sleep, and for steadying the emotions. It has a long-standing reputation as a stone of temperance, kept close as a gentle support in loosening the grip of overindulgent habits and finding inner balance.", spirit: "In the crystal-healing tradition amethyst governs the Third Eye and Crown chakras, and as an Air-element stone it is said to lift awareness toward the spiritual. It is a favoured meditation and dream crystal, believed to open intuition, deepen inner vision, and strengthen connection to higher guidance. It is also regarded as a protective and purifying stone, said to transmute heavier energies into higher ones and to shield and clear the aura.", body: "In folk and crystal-lore tradition amethyst is associated with peaceful, restful sleep and with soothing tension and headaches, and was historically tucked under the pillow to invite calm dreams; some traditions also link it with easing the strain of overindulgence, in keeping with its ancient 'sobriety' symbolism. These are traditional associations only — amethyst is not a medicine, makes no cure, and is never a substitute for professional medical care.", care: "Amethyst is a hard stone (Mohs 7) and can be rinsed briefly under cool running water, but its colour is fragile to light: the iron colour-centre that makes amethyst violet was switched on by natural irradiation, and prolonged or direct sunlight slowly bleaches it, fading a rich purple toward pale grey, washed-out yellow or greenish tones. For that reason, never charge amethyst in the sun or leave it sitting in a sunny window. Cleanse and recharge it gently instead — by moonlight (a full moon is ideal), in the smoke of sage or palo santo, with sound, or resting it on a piece of selenite. A quick running-water rinse refreshes it, but skip long soaks and harsh heat." } },
  { name: "Ametrine", colour: "Violet-gold", hex: "#b98fc9", chakra: "Crown & Solar Plexus", element: "Air, Fire", zodiac: "Libra, Gemini", pair: "963 Hz",
    keywords: ["Balance", "Clarity", "Abundance", "Harmony", "Willpower", "Creativity", "Crown"],
    use: "Marries clarity with abundance, harmonizing mind, will and spirit.",
    meaning: "Ametrine is a rare marriage of two stones in one — amethyst's serene violet meeting citrine's golden light within a single crystal — and it carries the gifts of both at once. It joins the calm, clear intuition of the higher mind to the warm confidence and abundance of the will, dissolving inner conflict and helping the opposites within you come into balance. A stone of mental clarity and decisive action, it is wonderful for cutting through confusion and bringing spirit and practicality into gentle harmony.",
    work: "Keep ametrine at your desk or hold it when you must weigh a decision, letting its balance clear the mind and align your intentions with action.",
    affirm: "I hold clarity and abundance in perfect balance.",
    deep: { origin: "Ametrine is a single quartz crystal that is part amethyst and part citrine, its violet and golden zones meeting along a sharp natural boundary within one stone. Both colours come from the same iron impurity: the amethyst zones hold iron in the state produced by natural irradiation, while the citrine zones formed where gentle geological heat — likely a temperature gradient across the growing crystal — converted that iron to its golden form. It is genuinely rare in nature: virtually all the world's natural ametrine comes from a single source, the Anahí mine in eastern Bolivia near the Brazilian border, with only minor material reported elsewhere. Be aware that much cheaper 'ametrine' is heat-treated or laboratory-grown rather than natural.", lore: "Ametrine's documented history is short and charming: the Anahí mine is said to have been given as a dowry to a seventeenth-century Spanish conquistador by a Bolivian Ayoreo princess named Anahí, then lost to European memory for centuries before its rediscovery in the 1960s and arrival on world markets in the 1970s and 80s. Because it is so recent a stone to the wider world, it carries almost no genuine ancient lore — much of what is sold as 'tradition' is modern invention. Its real meaning in crystal work grows honestly out of the far older, deeper traditions of its two halves, amethyst and citrine, married in one body.", mind: "Ametrine is worked with to dissolve inner conflict and quiet the war between head and gut. Tradition reaches for it when you are torn, procrastinating, or paralysed by indecision, trusting it to wed amethyst's calm clarity to citrine's warm confidence so that you can both see clearly and act. It is a favourite for mental focus, creative problem-solving, and shaking off the stuck, foggy feeling of ambivalence when two parts of you want different things.", spirit: "Linking the crown to the solar plexus, Ametrine bridges the highest and the most personal of centres — joining spiritual insight above to willpower, confidence and vitality at the belly. Energetically it is used to draw spirit and practicality into a single current, so that inspiration is promptly followed by grounded action, and to balance the opposites within: receiving and doing, stillness and drive. It is kept above all for integration — for making the whole scattered self finally pull in one direction.", body: "In folk and crystal tradition Ametrine is associated with mental stamina and with clearing the low, foggy fatigue that comes with overwhelm, blending citrine's old reputation for vitality and digestion with amethyst's for calming the nerves. Practitioners have reached for it to support steady energy and a settled, less scattered mind through demanding stretches. This is tradition and encouragement only, never a medical claim or a substitute for care.", care: "As quartz, Ametrine is hard (7 on the Mohs scale) and safe in water, so a rinse under running water and a good dry will do it no harm. Its citrine half, though, shares amethyst's sensitivity to light — prolonged direct sun will slowly wash out the violet zone and unbalance the stone's beautiful two-tone contrast — so keep it well off sunny sills. Cleanse it with running water, smoke, sound or selenite and recharge it in moonlight or briefly on the earth; being part citrine, it is also counted among the stones that tend to stay bright and rarely need heavy clearing." } },
  { name: "Angelite", colour: "Soft powder blue", hex: "#a3bcd4", chakra: "Throat & Crown", element: "Air", zodiac: "Aquarius", pair: "963 Hz",
    keywords: ["Angelic Connection", "Peace", "Compassion", "Communication", "Serenity", "Comfort", "Throat"],
    use: "Deepens angelic connection, compassion, and peaceful, kind expression.",
    meaning: "Angelite is compressed celestite — the stone of quiet, angelic communion. Its gentle powder-blue carries a deeply peaceful, compassionate energy that dissolves fear and invites the sense of being watched over. Traditionally reached for to strengthen connection with guardian angels and spirit guides, it soothes anger into serenity and helps you speak your truth with kindness.",
    work: "Hold Angelite over the throat or heart during meditation to feel supported, or carry a tumbled piece through grief and change for gentle comfort.",
    affirm: "I am surrounded by loving guidance, and I move through the world in peace.",
    deep: { origin: "Angelite is the trade name for a soft, powder-blue form of anhydrite — calcium sulfate, the water-free cousin of gypsum. It forms in evaporite settings, where an ancient sea or salt lake dried out and its minerals were compressed and dehydrated into stone over long ages, quite literally gypsum with the water pressed out of it; the gentle blue commercial material is mined chiefly in Peru. Crucially, anhydrite is thirsty: leave it wet and it will slowly drink the water back in and revert toward gypsum, softening, swelling and losing its polish. It is a genuinely soft stone (about 3.5 on the Mohs scale) and easily scratched, so it must be treated with real gentleness.", lore: "True Angelite is a modern stone — the Peruvian material only reached the crystal market around 1987, so its 'tradition' is recent and even its name is a marketing choice, picked for its heavenly colour and gentle feel rather than handed down. Anhydrite itself has been known to mineralogists since 1804 (its name is Greek for 'without water') but carries little folklore of its own. What lore Angelite has is New Age in origin, built quickly but sincerely around its serene blue and its supposed affinity for angelic contact, so it is honest to call its meaning young rather than ancient.", mind: "Angelite is worked with for deep peace and the softening of fear, anger and grief. Tradition reaches for it when you feel unsupported or alone, to invite the comforting sense of being watched over and held, and to melt sharp anger gently into serenity and forgiveness. It is a tender companion for an over-defended heart, quietly encouraging compassion — for others, and just as much for yourself.", spirit: "Bridging the throat and crown, Angelite is above all the stone of angelic and spirit-guide communion, kept for prayer, mediumship and the quiet practice of asking for and feeling guidance. Energetically it is used to open a calm, high channel of communication, to raise awareness gently toward the finer realms, and to help you speak spiritual truth with kindness rather than force. Many simply hold it in meditation to sense the nearness of guardian angels and the deep relief of not being alone.", body: "In folk and crystal tradition Angelite is associated with the throat, with soothing and balancing, and with a general sense of comfort and equilibrium through grief and transition. Practitioners have loosely linked it to easing tension and inflammation and to a feeling of overall calm. This is gentle tradition alone — Angelite treats nothing, and it is no replacement whatsoever for medical care.", care: "Here is the warning that matters most: never cleanse Angelite in water. As anhydrite it will absorb moisture, cloud, soften and slowly turn back toward crumbly gypsum, so keep it dry and clear it only by dry means — smoke, sound, moonlight, or a rest on selenite or a bed of dry salt (never in salt water). Because it is soft and fragile, store it apart from harder stones that would scratch it, and recharge it gently under the moon rather than in sun, which serves it far better than any risk of damp." } },
  { name: "Apatite", colour: "Bright blue-green", hex: "#2f8fbf", chakra: "Throat & Third Eye", element: "Air & Water", zodiac: "Gemini", pair: "852 Hz",
    keywords: ["Manifestation", "Motivation", "Communication", "Clarity", "Focus", "Ambition", "Third Eye"],
    use: "Sparks motivation, clears the vision, and powers manifestation.",
    meaning: "Apatite is the stone of manifestation and motivation — a bright blue-green crystal that clears confusion and lights the path from idea to action. It stirs the intellect and the will, dissolving apathy and rekindling the drive to reach for your goals, while its throat-and-third-eye resonance keeps your vision clear and your voice aligned with it. Traditionally used to encourage focus, healthy ambition, and inspired self-expression, it turns dreams into concrete, motivated steps.",
    work: "Hold Apatite while you set intentions or plan your week, or keep it on your desk to stay focused, inspired, and moving toward your goals.",
    affirm: "I am motivated and clear, and I bring my dreams into being.",
    deep: { origin: "Apatite is a family of calcium phosphate minerals (fluorapatite, chlorapatite and hydroxylapatite) and, remarkably, the very same mineral that forms the enamel of your teeth and the hard mineral of bone. The prized gem blue and neon blue-green material is usually iron- or manganese-bearing fluorapatite, crystallising in pegmatites, metamorphic rocks and phosphate-rich deposits. Its name comes from the Greek apatáō, 'to deceive,' because it was so easily mistaken for other gems like beryl, tourmaline and peridot. Fine blue and blue-green crystals come from Brazil, Madagascar and Mexico, with other notable stones from Myanmar, Canada, India and East Africa.", lore: "Apatite was only recognised and named as a distinct mineral in 1786, by the German geologist Abraham Werner, so unlike amethyst or lapis it has no deep ancient lapidary tradition of its own — for most of history its stones were unknowingly worn under other names. It is enormously important to the wider world, though: apatite is the chief ore of phosphorus and the foundation of phosphate fertiliser, and geologists read tiny apatite crystals like clocks to date the age of rocks. Its metaphysical reputation, much like its mineral name, is therefore essentially modern, built around the clear, motivating pull of its blue.", mind: "Apatite is the stone of motivation, focus and getting unstuck. Tradition works with it to clear mental confusion and dissolve apathy, sluggishness and self-doubt, rekindling drive, healthy ambition and the will to actually begin. It is kept for concentration and study, for creative and intellectual work, and for carrying an idea past the daydream stage and all the way into concrete action.", spirit: "Resonating at the throat and third eye, Apatite is used to keep your inner vision clear and your outer voice aligned with it, so that what you see, what you say and what you do all point the same way. Energetically it is worked with for manifestation: clarifying intention at the third eye, then speaking and living it out through the throat. It is also reached for to deepen intuition, expand insight, and support inspired, honest self-expression.", body: "In folk and crystal tradition — fittingly, given its true mineralogy — Apatite is associated with the bones, teeth and cartilage and with a healthy appetite and metabolism; it even carries a folk reputation as an 'appetite suppressant,' a play on its deceiving name. Practitioners have also reached for it to support energy, growth and general vitality. This is folk association and wordplay, not medicine, and it is no substitute for professional care.", care: "Apatite is fairly soft (5 on the Mohs scale) and somewhat brittle, so treat it more carefully than quartz and keep it away from knocks and abrasive surfaces. A quick rinse in cool running water is generally fine, but dry it promptly and never soak it, especially softer tumbled pieces; safest of all is dry cleansing by smoke, sound or a night on selenite. Keep it out of prolonged harsh sunlight to protect the depth of its blue, and recharge it gently in moonlight or nestled among clear quartz." } },
  { name: "Aquamarine", colour: "Sea blue-green", hex: "#82c9cf", chakra: "Throat", element: "Water", zodiac: "Pisces, Aries", pair: "741 Hz",
    keywords: ["Calm", "Communication", "Courage", "Throat", "Serenity", "Truth"],
    use: "Cools hot emotions, clears communication, and eases fear.",
    meaning: "Aquamarine carries the calm of the open sea — a cool, clear stone that steadies the emotions and loosens the tongue. Named for the water it resembles, it was long the talisman of sailors and travellers crossing deep waters, trusted to soothe fear and keep the heart courageous. It clears the throat of held-back words so honest, gentle speech can flow, and invites a serene, go-with-the-tide surrender to life's currents.",
    work: "Wear it or hold it at the throat before a hard conversation, or keep a piece close when you travel or feel swamped by big feelings.",
    affirm: "I speak my truth calmly, and I flow with life's tides.",
    deep: { origin: "Aquamarine is the sea-blue variety of beryl, a beryllium aluminium silicate that grows in stout hexagonal prisms and shares its mineral species with emerald and pink morganite. Its cool colour comes from traces of ferrous iron; stones straight from the earth often lean greenish, and much commercial aquamarine is gently heated to settle it into a purer blue. It crystallises in granite pegmatites and gem-bearing pockets, and the finest stones come from Minas Gerais in Brazil — the deep 'Santa Maria' blues especially — with important finds also in Pakistan, Nigeria, Madagascar and the Ural Mountains of Russia. At 7.5 to 8 on the Mohs scale it is a hard, durable gem, and Brazil has yielded flawless crystals large enough to fill a hand.", lore: "The name is simply Latin — aqua marina, 'sea water' — and the Romans imagined it spilled from the jewel caskets of mermaids, sacred to Neptune and to the deep. Sailors carried it across the ancient and medieval world as a charm against drowning and rough seas, and it was long trusted to keep travellers safe over deep water. Greek and Roman lapidaries engraved it, medieval belief held it could rekindle married love and serve as an antidote to poison, and its clear watery depths made it a favoured stone for scrying — the seer's 'magic mirror.'", mind: "Aquamarine has always been the stone of calm, cooling hot temper and quieting anxious, overreactive emotion so the mind can settle like still water. It is the great ally of honest speech: traditionally reached for by the shy, the tongue-tied and anyone facing an audience, it loosens held-back words so gentle truth can flow. Where feelings run high or tangled, it invites a soft, go-with-the-tide surrender rather than a fight against the current.", spirit: "This is a throat-chakra stone through and through, clearing the channel between heart and voice so what is true can be spoken kindly. As a stone of the water element it deepens meditation, washes the aura clean and heightens intuition and psychic clarity. Worked with quietly, it helps you attune to your higher self and speak from that serene, unhurried place.", body: "Following its throat affinity, folk and crystal tradition have long associated aquamarine with the throat, the voice and the thyroid, and healers of old reached for it to soothe a sore throat or swollen glands. It was also traditionally linked with tired, strained eyes and with a general cooling of inflamed, overheated states. These are old associations of tradition and comfort, held alongside — never in place of — proper medical care.", care: "Beryl is tough enough to enjoy a brief rinse of cool running water, so aquamarine is happy under a quick wash, then dried and left in gentle moonlight to recharge — moon and sea suit its nature perfectly. Its one real vulnerability is light and heat, not water: prolonged direct sunlight and high heat can slowly fade that precious sea-blue, so keep it off hot, sunny sills and cleanse and charge it by the moon instead. A quick bath, a pass through smoke, or a night on a quartz cluster all keep its colour clear and its energy bright." } },
  { name: "Aragonite", colour: "Golden brown", hex: "#a86b3c", chakra: "Root", element: "Earth", zodiac: "Capricorn", pair: "396 Hz",
    keywords: ["Grounding", "Stability", "Root", "Centering", "Patience", "Focus", "Earth Connection"],
    use: "Grounds and centres scattered energy, builds patience and stability.",
    meaning: "Aragonite is the great grounder — often found as russet, star-shaped clusters that seem to anchor light straight into the earth. Known as an Earth-healer's stone, it gathers scattered energy, draws you gently back into your body, and lends patience when life feels rushed or unsteady. It is traditionally used to build a calm, centred foundation, helping you feel rooted, present, and unshakeably here.",
    work: "Hold it in both hands or place it at your feet during meditation to feel rooted, or keep it on your desk when the day turns frantic.",
    affirm: "I am grounded, centred, and steady in the present moment.",
    deep: { origin: "Aragonite is calcium carbonate — chemically identical to calcite but built on a different, orthorhombic crystal lattice, which makes it a distinct mineral and, over long geological time, a slightly unstable one that tends to recrystallise into calcite. It grows in hot springs, caves and near-surface deposits, and life builds it too: mother-of-pearl, coral and pearls are all aragonite. The beloved russet 'sputnik' or star clusters — interlocking reddish-brown crystals — come famously from Spain, and it was near Molina de Aragón that the mineral was first described in 1797 and named for the Aragon region; Morocco is another fine source. It is soft, only 3.5 to 4 on the Mohs scale, and will fizz in acid.", lore: "Aragonite is a relatively modern arrival to the mineral cabinet, named only at the close of the eighteenth century, so it carries little of the ancient Greek or Egyptian legend that older stones do — and it is honest to say so. Its lore belongs mostly to the modern earth-healing movement, which prized those star-shaped clusters as tools for grounding and for tending the land itself. Yet its substance is ancient: as the stuff of shell and coral and reef, aragonite has been quietly building the living architecture of the seas since long before any lapidary wrote of it.", mind: "Aragonite is the great steadier of a scattered, over-revved mind, gathering frantic energy back to centre and lending patience when life feels rushed and unsettled. It is traditionally worked with to cool anger and emotional stress, to ease the feeling of being pulled in too many directions, and to teach acceptance of things as they are. Where overwhelm sets in, it whispers you back down to a slower, more tolerant pace.", spirit: "This is a root- and earth-chakra stone, the Earth-healer's ally, anchoring light straight down into the body and the ground beneath you. It draws scattered energy home, deepens grounding in meditation, and helps you feel genuinely present and connected to the Earth rather than floating above your own life. Held before stillness, it builds the calm, centred foundation from which everything steadier can grow.", body: "Being calcium carbonate, folk and crystal tradition naturally associate aragonite with the bones and the framework of the body, and with a warming, settling influence on cold hands and feet and a jittery nervous system. Practitioners have reached for it to soothe restlessness, chills and the trembly, over-caffeinated feeling of a body run too fast. These are traditional associations offered for comfort and grounding, never a treatment or a substitute for a doctor's care.", care: "Aragonite is soft and carbonate, so keep it away from water — a soak will dull, etch or slowly dissolve it — and well away from salt and any acid. Cleanse it gently instead with smoke, sound, or a night resting on a bed of hematite or quartz, and recharge it where it belongs: on bare earth or soil, or among other brown, grounding stones. Handle the delicate star clusters with a soft touch, as their fine points chip easily." } },
  { name: "Black Obsidian", colour: "Glossy black", hex: "#141414", chakra: "Root", element: "Fire & Earth", zodiac: "Scorpio, Sagittarius", pair: "396 Hz",
    keywords: ["Protection", "Grounding", "Truth", "Cleansing", "Shadow Work", "Root"],
    use: "Grounds, shields, and reflects back what needs to be seen.",
    meaning: "Black Obsidian is volcanic glass born of fire meeting earth — a fiercely protective stone that acts like a psychic mirror, throwing back negativity and gently revealing the truths we hide from ourselves. It has been shaped into scrying mirrors and blades for millennia, prized for cutting through illusion and drawing scattered energy back down into the body and the earth. Honest and grounding, it is a stalwart guardian for anyone doing the tender work of facing their own shadow.",
    work: "Place it by your front door or carry a small piece as a shield, and hold it during honest self-reflection; cleanse it often, as it takes on all it deflects.",
    affirm: "I am grounded, protected, and unafraid of my own truth.",
    deep: { origin: "Black obsidian is not, strictly, a crystal at all but a natural volcanic glass — a mineraloid — formed when silica-rich rhyolitic lava cools so fast that no orderly crystal lattice can take shape. It is mostly silica, and its deep black comes from a fine scattering of iron-bearing minerals like magnetite through the glass; it breaks with a smooth conchoidal fracture into edges keener than surgical steel. It forms wherever such lava has quenched quickly — Oregon and California, Mexico, Iceland, Italy's Lipari islands, Armenia, Turkey and beyond. At around 5 to 5.5 on the Mohs scale it is workable but brittle, prone to sharp chips.", lore: "Its name reaches back to Rome and Pliny, who recorded a stone 'obsianus' said to be found by one Obsius in Ethiopia. Long before that, humans across the Stone Age world knapped obsidian into the sharpest blades and arrowheads they possessed, and by the Neolithic were polishing it into mirrors, as at Çatalhöyük some eight thousand years ago. In Mesoamerica it was sacred: the Aztec smoking-mirror god Tezcatlipoca took his name from the obsidian scrying mirror, and ritual blades and mirrors were carved from it — one such Aztec mirror later served the Elizabethan magus John Dee for his scrying. Across cultures, in fact and in legend, it has been the stone of the truth-telling mirror and the cutting edge.", mind: "Obsidian is honest to the point of bluntness, a mirror that reflects back the truths we tuck away and the shadow we would rather not meet. It is worked with for that tender, necessary labour — releasing buried grief, anger and self-deception, and cutting cleanly through illusion and excuse. It can be an intense companion, so tradition pairs it with gentleness: it shows what is there so it can finally be faced and freed.", spirit: "A powerful root-chakra stone, obsidian pulls scattered energy firmly down into the body and the earth, and throws up a dark protective shield against negativity and psychic intrusion. For millennia it has been the scryer's glass, a doorway for gazing inward and beyond, and it remains a favoured tool for shadow work, cord-cutting and grounding after deep or draining spiritual practice. It does not so much soothe as protect and reveal.", body: "Folk and crystal tradition associate black obsidian with grounding the body after emotional release and with easing the tension we clench and store in gut and muscle. It has long been reached for, in that tradition, to settle a churning digestion and to draw off what feels stagnant or heavy. Such uses are old associations of comfort and grounding only, and stand alongside — never instead of — real medical care.", care: "As a hard but brittle glass, obsidian tolerates a brief rinse under cool running water — just mind the sharp edges of any knapped or pointed piece, which chip and cut easily. It is said to soak up a great deal, so cleanse it often: running water, smoke or sound all clear it well, and it needs no sunlight to charge, a night on the earth or on a hematite bed suiting it just as well. Its colour is stable and will not fade." } },
  { name: "Black Tourmaline", colour: "Black", hex: "#1f1f22", chakra: "Root", element: "Earth", zodiac: "Capricorn", pair: "396 Hz",
    keywords: ["Protection", "Grounding", "Cleansing", "Root", "Safety", "Calm"],
    use: "Shields your energy, dissolves negativity, and roots you to the earth.",
    meaning: "Black Tourmaline is the great protector — a grounding anchor that draws off heavy, anxious, and unwanted energy and roots you firmly back into the earth. Long kept by doorways and carried into crowded or draining places, it works like an energetic shield, transmuting negativity into steadiness and turning frayed nerves into solid ground. When the world feels like too much, this is the stone that quietly says: you are safe, and you are held.",
    work: "Carry a piece in your pocket or place one by the front door to guard your space; hold it and feel your feet on the ground whenever anxiety rises.",
    affirm: "I am grounded, protected, and safe.",
    deep: { origin: "Black tourmaline is the mineral schorl, the iron-rich and most common member of the tourmaline family — a complex boron aluminium silicate whose iron content gives it its dense black colour. It grows as long, striated three-sided prisms in granite and in gem pegmatites, and it carries a genuinely remarkable trait: it is both piezoelectric and pyroelectric, generating a small electric charge when squeezed or heated. Fine schorl comes from Brazil, Pakistan, Afghanistan, Namibia and Madagascar, and from the pegmatites of Maine and California. At 7 to 7.5 on the Mohs scale it is durable and readily worked.", lore: "The name descends from the Sinhalese turmali, a term Sri Lankan traders used for mixed parcels of coloured gems. That pyroelectric quirk earned it a Dutch nickname in the 1700s — aschentrekker, the 'ash-drawer' — because a warmed crystal would pull ash and dust toward it, and it was used to clean the ash from meerschaum pipes. Shamanic and folk cultures kept black stones like schorl as talismans against curses, ill-wishing and 'earth demons,' and while much of its towering modern reputation as a protector is twentieth-century crystal lore, that reputation grew, fittingly, from a stone that visibly moves unseen energy.", mind: "Black tourmaline is the steady hand on a racing nervous system, drawing off anxiety, dread and looping negative thought and leaving solid ground in their place. It is the classic stone for anyone who takes on too much of the room — the sensitive, the empathic, the frazzled — offering a firm energetic boundary and a sense of being safely contained. When the world feels like too much, it quietly turns frayed nerves back into steadiness.", spirit: "This is a root-chakra anchor and the archetypal protective stone, forming a shield around the aura that deflects and transmutes heavy or hostile energy into something grounded and calm. Traditionally kept by doorways and carried into crowded or draining places, it also has a modern following as a guard against environmental and electromagnetic 'smog' — a belief best held as belief. Above all it roots you: down through the base of the spine and into the reassuring solidity of the earth.", body: "Folk and crystal tradition link black tourmaline with the base of the spine and the legs — the body's own grounding rods — and with shaking off the heavy, depleted feeling of exhaustion and overstimulation. Practitioners have reached for it to ease tension and to 'clear' a body that feels wired and drained at once. These are traditional associations for comfort and grounding, and no replacement for proper medical attention.", care: "Hardy and water-safe, black tourmaline is content with a brief rinse under running water whenever it feels heavy — and because it is such a willing absorber of unwanted energy, it benefits from frequent cleansing by water, smoke or sound. Being black, it will not fade, so you may recharge it in sun or moonlight, on bare earth, or resting on a clear-quartz or selenite bed to renew its protective charge. A crystal cluster kept nearby helps it work at its best." } },
  { name: "Bloodstone", colour: "Deep green flecked red", hex: "#34623f", chakra: "Root", element: "Earth", zodiac: "Aries, Pisces", pair: "396 Hz",
    keywords: ["Courage", "Vitality", "Grounding", "Strength", "Protection", "Root"],
    use: "Restores courage and vitality, grounds scattered energy, steadies you through hardship.",
    meaning: "Bloodstone is the warrior's stone — a deep forest green scattered with drops of red, prized since antiquity for courage, endurance and renewal. Roman soldiers and ancient healers carried it for strength and vitality, and it is still turned to when life asks more of you than you feel you can give. Grounding and revitalising, it gathers scattered energy, steadies frayed nerves, and rekindles the will to keep going.",
    work: "Carry it when you need stamina or courage, or hold it at the base of the spine during grounding meditation to feel rooted and renewed.",
    affirm: "I am strong, grounded, and full of vital energy.",
    deep: { origin: "Bloodstone, or heliotrope, is a variety of chalcedony — cryptocrystalline quartz — in a deep, opaque forest green flecked with drops of red. The green comes from included chlorite or amphibole minerals, while the vivid red spots are iron oxide, chiefly hematite, scattered like blood across the stone. It forms in volcanic rocks where silica-rich fluids fill cavities, and the classic material comes from the Deccan traps of India, with further sources in Brazil, Australia, Germany, China and the Isle of Rum in Scotland. As a quartz it is hard and durable, around 6.5 to 7 on the Mohs scale.", lore: "The old name heliotrope, 'sun-turner,' comes from a Greek belief that the stone, dropped into water, would turn the sun's reflection blood-red. Its deeper legend is Christian and medieval: the red spots were said to be the blood of Christ, fallen at the Crucifixion onto green jasper at the foot of the cross, which earned it the name 'martyr's stone.' Long before that, Babylonians and Egyptians carved it into seals and amulets, Greek and Roman athletes and soldiers wore it for strength and endurance, and medieval lapidaries prized it above all to staunch bleeding — pressed cold to a wound or worn to stem a nosebleed. Pliny even records the magicians' fanciful claim that, joined with the heliotrope plant, it could render its bearer invisible.", mind: "True to its reputation as the warrior's stone, bloodstone is worked with for courage, endurance and the will to keep going when life asks more than you feel you can give. It steadies emotions under pressure, clears confusion and dispels the fog of overwhelm, calling scattered energy and frayed nerves back to a determined centre. It is a stone for the second wind — for finding heart when heart runs low.", spirit: "Grounding through the root chakra while its green touches the heart, bloodstone is a stone of vitality and life-force, drawing energy down and revitalising a depleted spirit. Tradition treats it as both cleanser and protector, clearing the lower chakras of stagnation and warding off unwanted influence. It rekindles motivation and the raw drive to act, anchoring courage firmly in the body.", body: "No stone is more bound to blood in folk tradition: for centuries it was the great 'blood stone,' associated with the circulation, with purifying and strengthening the blood, and — most famously — with staunching haemorrhage and nosebleeds when held cold to the skin. Old healers also linked it with vitality and stamina and with the blood-cleansing organs. All of this is inherited tradition and lore, offered for its history and its comfort, never as medicine or a substitute for a doctor's care.", care: "As a member of the quartz family, bloodstone is hard, stable and thoroughly water-safe, happy under a rinse of cool running water or in warm soapy water to clean it. Its colours are stable and will not readily fade, though there is no need to leave it baking in the sun; a night in moonlight, on the earth, or on a quartz cluster recharges it beautifully. Smoke and sound cleanse it just as well." } },
  { name: "Blue Lace Agate", colour: "Soft sky blue", hex: "#a8c8dd", chakra: "Throat", element: "Water", zodiac: "Pisces, Gemini", pair: "741 Hz",
    keywords: ["Communication", "Calm", "Peace", "Expression", "Serenity", "Throat"],
    use: "Soothes frayed nerves and frees calm, gentle, honest communication.",
    meaning: "Blue Lace Agate is the peacemaker's stone — pale sky-blue laced with soft white ribbons, radiating a cool, calming energy that quiets an anxious mind and frees the voice. It is treasured for gentle, articulate communication, easing the tension that catches words in the throat. Where feelings run high, it invites you to speak your truth softly but clearly, and to listen with the same grace.",
    work: "Wear it at the throat or hold it before a difficult conversation to speak calmly, kindly, and from the heart.",
    affirm: "I speak my truth with calm, clarity, and gentleness.",
    deep: { origin: "Blue lace agate is a banded variety of chalcedony, the cryptocrystalline form of quartz (silicon dioxide) whose crystals are far too fine to see with the naked eye. It forms when silica-rich waters seep into gas cavities and cracks in ancient volcanic rock and deposit in slow, successive layers, each pause in the flow laying down another delicate ribbon — which is why the stone reads as pale sky-blue threaded with soft white and darker lace. The gem-quality material is remarkably localised: nearly all of it comes from a single region of southern Namibia (the celebrated Ysterputs deposit), which makes fine, translucent blue lace agate genuinely scarcer than its low price suggests.", lore: "The word agate descends from the Achates River in Sicily, where the Greek writer Theophrastus recorded the stones being gathered, and agates in general were carried as protective amulets across Sumer, Egypt, and Rome. Blue lace agate itself, however, is an honest modern discovery — it was only brought to market in the twentieth century after the Namibian find — so it carries no genuine ancient myth of its own, and any source claiming otherwise is borrowing agate's older reputation. What it inherits truthfully is agate's long-standing folk role as a steadying, protective talisman, now recast for its gentle blue in the language of calm and clear speech.", mind: "This is a quieting stone for an overwrought mind, traditionally reached for to cool anxious chatter and take the sharp edge off nervous tension. It is especially loved by those who freeze up or overheat when they have to speak — before a difficult conversation, a confrontation, or an audience — because its energy is one of soft articulation rather than force. Where feelings run high, it is worked with to help you say the true thing gently and to listen without bracing for a fight.", spirit: "Blue lace agate is a throat-chakra stone through and through, opening and soothing the energetic centre of expression so that inner truth can travel outward without catching. Practitioners use it to bridge the throat to the higher mind, encouraging communication that is both honest and kind, and it is a favourite for meditation aimed at peace rather than intensity. Its current is cool, flowing, and unhurried — a stone that calms the aura rather than charging it.", body: "In the crystal-healing tradition it is the classic throat stone, folk practice reaching for it to soothe the neck, throat, and the region of the thyroid, and to ease tension held in the shoulders and jaw. It is also traditionally associated with a gentler nervous system and cooler, calmer moods. None of this is medicine — it is old association and comfort, and it belongs alongside proper care, never in place of it.", care: "As a form of quartz, blue lace agate is hard (around 7 on the Mohs scale) and genuinely durable, so it is safe in water and can be briefly rinsed under a cool tap and cleansed with moonlight, sound, or smoke. Prolonged, intense sunlight is best avoided, since strong UV can slowly pale banded agates over the years (and cheap dyed imitations fade quickly), so charge it under the moon rather than baking it in a window. It takes and holds a peaceful charge easily and rarely needs heavy clearing — a gentle stone that keeps gentle company." } },
  { name: "Carnelian", colour: "Fiery orange-red", hex: "#c0392b", chakra: "Sacral", element: "Fire", zodiac: "Aries, Leo", pair: "417 Hz",
    keywords: ["Courage", "Creativity", "Vitality", "Motivation", "Passion", "Sacral"],
    use: "Sparks courage, creativity, and the drive to begin.",
    meaning: "Carnelian is the stone of the inner fire — a glowing orange-red gem that ancient warriors wore for courage and artisans kept close for creative flow. It is traditionally used to rekindle motivation, warm the passions, and restore vitality when life has gone flat, lending bold, forward-moving energy to anyone who has been hesitating at the edge of something new. Vivid and life-affirming, it stokes the sacral centre where desire, drive, and creation are born.",
    work: "Carry or wear it when you need a burst of confidence, and place it on the lower belly or your creative workspace to keep the spark of inspiration alive.",
    affirm: "I am bold, alive, and full of creative fire.",
    deep: { origin: "Carnelian is a warm red-to-orange variety of chalcedony — cryptocrystalline quartz — coloured by finely dispersed iron oxides, and it grades into the browner stone called sard as the tone deepens. It forms as silica-bearing fluids fill cavities and seams in volcanic and sedimentary rock, and a great deal of today's carnelian begins as paler agate that is heat-treated to draw out its iron and warm its colour, a practice so ancient it is honestly part of the tradition rather than a modern trick. Fine natural and enhanced material comes from India (the historic agate-baking works of Khambhat), Brazil, Uruguay, and Madagascar.", lore: "Few stones carry a richer documented history. The Egyptians set carnelian throughout their jewelry and funerary work — the tyet, or Knot of Isis, was often carved from it and called the blood of Isis, laid on the dead for protection into the next world — while Roman citizens prized carnelian for signet rings because hot sealing wax lifts cleanly from its surface. Islamic tradition holds that the Prophet Muhammad wore a carnelian seal ring, medieval lapidaries recommended it to stem bleeding and cool anger, and its reputation as a warrior's and craftsman's stone runs unbroken from antiquity to the present.", mind: "Carnelian is the great motivator of the stone kingdom, traditionally worked with to reignite drive when life has gone flat and to steady the nerve of anyone hesitating at the threshold of something new. It is called on for courage, confidence, and the boldness to begin, dissolving the apathy and self-doubt that keep good ideas stuck. Artists and makers keep it close for creative momentum — the push that turns intention into a first real move.", spirit: "This is a sacral-chakra stone above all, kindling the energetic centre where desire, passion, creativity, and physical vitality are born. Its current is warm, forward-moving, and life-affirming, used to restore a sense of appetite for living and to anchor scattered energy back into the body and the here-and-now. It is also a traditional charging stone, thought to lend its fire to other crystals kept beside it.", body: "Folk and crystal tradition associate carnelian with the blood, warmth, and circulation, and it was historically the stone reached for to symbolically stanch bleeding and stir sluggish vitality. It carries old links to fertility, physical stamina, and the low back and hips that sit near its sacral centre. These are traditional associations offered for encouragement and warmth, not treatment, and they belong beside real care rather than instead of it.", care: "Being quartz, carnelian is hard and water-safe, so it can be rinsed under running water and cleansed with smoke, sound, or moonlight without harm. It suits its fiery nature to take a little morning sun, but keep sun sessions brief — long, repeated exposure can gradually pale the orange, since it is the same UV-sensitivity that fades agate over time. It clears easily and is generous with its energy, making it a reliable, low-maintenance stone to carry daily." } },
  { name: "Celestite", colour: "Pale sky blue", hex: "#bcd9e8", chakra: "Third Eye & Crown", element: "Air", zodiac: "Gemini", pair: "963 Hz",
    keywords: ["Angelic Connection", "Peace", "Serenity", "Intuition", "Calm", "Hope", "Crown"],
    use: "Invites angelic connection, deep peace, and a calm, uplifted heart.",
    meaning: "Celestite is a whisper of the heavens — its soft sky-blue crystals carry a serene, uplifting energy long associated with angelic connection and divine peace. It gently raises awareness toward the higher realms, soothing frayed nerves and inviting a stillness that feels almost holy. Kept close, it is traditionally used to quiet worry, encourage hope, and open a clear line to guidance from above.",
    work: "Set a cluster in your bedroom or meditation space to fill the room with calm, or hold it as you breathe and ask for guidance before sleep.",
    affirm: "I am held in peace, and divine guidance flows to me easily.",
    deep: { origin: "Celestite (properly celestine) is strontium sulfate, and it is the chief natural ore from which the element strontium is drawn — the same strontium that burns crimson in fireworks and flares. Its heavenly powder-blue crystals grow most beautifully lining the hollow interiors of geodes within sedimentary limestone and dolostone, and also in evaporite beds, sometimes alongside sulfur. The finest sky-blue geodes come from Madagascar, while one of the world's great celestite occurrences is on South Bass Island in Lake Erie, Ohio, home to a geode large enough to stand inside; notable material also comes from Sicily, Poland, and the Bristol region of England.", lore: "The name was given in 1799 by the mineralogist A. G. Werner from the Latin caelestis, meaning celestial or of the sky, purely for that soft blue colour — so this is a stone whose very name is modern and descriptive rather than mythic. As a recent scientific discovery it carries none of the deep antiquity of agate or carnelian, and its now-famous link to angels and the higher heavens is a genuinely modern, New Age association rather than an ancient one. It is fairer to say the lore grew up around the colour and the name: a stone that looks like a fragment of clear sky came, understandably, to be spoken of in the language of the divine.", mind: "Celestite is prized as a deeply calming presence, traditionally kept close to quiet worry, ease a racing or grief-stricken mind, and coax frayed nerves back toward stillness. Its energy is gentle and uplifting rather than grounding, encouraging hope, mental clarity, and a sense that peace is available even in hard weeks. Many keep a cluster in the bedroom or a meditation corner for exactly this softening, dreamlike quiet.", spirit: "This is a stone of the upper chakras, working the third eye and crown to lift awareness toward the higher realms, and it is the crystal most associated with angelic connection and spirit guidance. Practitioners use it for dream work, serene meditation, and opening a clear, unhurried channel to inner counsel that feels almost holy. Its current is high and airy, meant to raise the vibration of a space toward tranquillity.", body: "In folk and crystal tradition celestite is associated with rest, relaxation, and the release of stress held in the body, and it is often placed near those who struggle to unwind or sleep. It carries gentle traditional links to the eyes and ears and to a calmer nervous system. These are comforting associations only, offered in the spirit of peace — never a medical claim, and never a substitute for proper care.", care: "Celestite needs a careful hand: its blue colour is notoriously light-sensitive and will bleach toward pale grey or white under prolonged sunlight, so keep it well away from sunny windowsills and never charge it in the sun. It is also soft (only about 3 to 3.5 on the Mohs scale) and its geodes are fragile and slightly water-sensitive, so do not soak it — clean and clear it gently with smoke, sound, or a short spell in moonlight instead. Handle the delicate crystal tips with care, and never use salt or salt water, which can pit and dull the surface." } },
  { name: "Chrysocolla", colour: "Copper teal", hex: "#18a5a0", chakra: "Throat & Heart", element: "Water", zodiac: "Gemini, Virgo", pair: "741 Hz",
    keywords: ["Communication", "Truth", "Empowerment", "Calm", "Expression", "Wisdom", "Throat"],
    use: "Calms emotion and empowers truthful, heartfelt communication.",
    meaning: "Chrysocolla is the tranquil goddess stone — a vivid teal of copper blue and green that calms, empowers, and gives voice to inner wisdom. Sacred to gentle, feminine energy, it soothes emotional turbulence into serenity while strengthening the courage to speak and share what is true. Long carried for heartfelt communication, it helps you teach, express, and stand in your truth from a place of calm rather than fear.",
    work: "Wear Chrysocolla at the throat when you need to speak or teach, or hold it during upheaval to let turbulent feelings settle into calm.",
    affirm: "I express my truth with calm strength and an open heart.",
    deep: { origin: "Chrysocolla is a hydrated copper silicate that forms in the weathered, oxidised upper zones of copper ore bodies, where copper-rich waters percolate through rock and leave behind its unmistakable teal — a blend of copper blue and green. On its own it is soft and often botryoidal or crust-like, but it frequently grows intergrown with quartz to make the tougher, translucent stone called gem silica, and mingles with malachite, azurite, and turquoise. It is mined wherever great copper deposits lie: the Democratic Republic of the Congo, Peru, Chile, the copper country of Arizona, and Israel, where the Eilat stone (a natural mix of chrysocolla, malachite, and turquoise) is treasured as a national gem.", lore: "Its name is honest about an old craft use: from the Greek chrysos, gold, and kolla, glue, because ancient goldsmiths employed a chrysocolla-derived material as a flux to solder gold, a use noted by Theophrastus and Pliny. It is popularly said that Cleopatra carried chrysocolla to keep herself calm and diplomatic in negotiation, and while that charming story is legend rather than documented record, the stone's link to soothing, persuasive speech is genuinely old. As Eilat stone it is woven into the traditions of King Solomon's mines and remains a beloved emblem of the region.", mind: "Chrysocolla is worked with to calm emotional turbulence into serenity, especially the kind of upset that steals your voice or tempts you into either silence or a fight. It is a stone of steady, feminine strength, traditionally reached for to speak and share difficult truths from a place of calm rather than fear. Teachers, healers, and anyone who must express themselves clearly under emotional pressure keep it close for exactly that grounded confidence.", spirit: "It bridges the throat and heart chakras, aligning what you feel with what you say so that communication flows from compassion rather than reaction. Long regarded as a goddess stone, it is used to connect with gentle feminine wisdom, to teach and counsel, and to stand in one's truth with quiet authority. Its energy is tranquil and empowering at once — a rare pairing of softness and strength.", body: "Folk and crystal tradition associate chrysocolla with feminine cycles and with soothing emotional and physical tension, and it is often linked to the throat and to a calmer, more balanced state during times of change. As a copper mineral it also carries the old folk reputation copper holds for comfort of the body. These are traditional associations only — never a medical claim, and no substitute for proper care.", care: "This is a stone to keep dry: pure chrysocolla is soft and porous and, as a copper-bearing mineral, it can be damaged by water and should never be soaked, made into an elixir, or exposed to salt or salt water. Cleanse and charge it gently instead with smoke, sound, moonlight, or by resting it on a selenite or hematite plate. Keep it away from knocks and harsh chemicals, and note that the harder gem-silica form is more forgiving but still deserves the same gentle care." } },
  { name: "Chrysoprase", colour: "Apple green", hex: "#6cbf74", chakra: "Heart", element: "Water", zodiac: "Libra, Cancer", pair: "639 Hz",
    keywords: ["Joy", "Hope", "Emotional Healing", "Abundance", "Forgiveness", "Heart"],
    use: "Opens the heart to joy and hope, heals old hurts, invites abundance.",
    meaning: "Chrysoprase is the stone of joyful renewal — a luminous apple-green that shines like fresh spring growth and gently turns the heart back toward hope. Long carried to lift heaviness of spirit and encourage forgiveness, it soothes a grieving or guarded heart and dissolves old resentment. Warm and reassuring, it reminds you that fresh starts, simple happiness and new love are always within reach.",
    work: "Wear it over the heart or keep it near when you need to lighten your mood, forgive, or open to new love and opportunity.",
    affirm: "My heart is open to joy, hope, and new beginnings.",
    deep: { origin: "Chrysoprase is the green jewel of the chalcedony family — a cryptocrystalline (microcrystalline) form of quartz, silicon dioxide, whose silica fibres are far too fine to see. Unlike most chalcedony, which is coloured by iron, its glowing apple-to-mint green comes from traces of nickel, held in minute nickel-bearing clay minerals (kerolite and pimelite) finely dispersed through the stone. It forms in the weathering crust of nickel ore bodies, where silica-rich groundwater seeps into cracks and cavities in serpentinite and nickel laterite and slowly sets into veins and nodules. Fine material has long come from Australia (Queensland, sometimes sold as 'Australian jade'), from the historic Silesian deposits of Poland and Germany, and from Kazakhstan, Tanzania, Brazil and the western United States.", lore: "Its name joins the Greek chrysos, gold, and prason, leek — the golden-green of a leek in the sun. Chrysoprase was among the most prized stones of the ancient Greek and Roman world, cut for signets, cameos and beads, and it appears in medieval lapidaries as a stone of gladness. Legend — not historical record — named it the favourite gem of Alexander the Great, said to have adorned his belt in battle. What history does record is the passion of Frederick the Great of Prussia, who so loved Silesian chrysoprase that he had it set into rooms at Sanssouci and sent to face the Chapel of St. Wenceslas in Prague. Down the centuries folk tradition also cast it as a stone of secrecy and hidden sight.", mind: "In the crystal tradition chrysoprase is worked with as a stone of joy and emotional renewal — reached for to lighten a heavy or grieving mood, to loosen the grip of old resentment, and to make forgiveness feel possible again. It is thought to ease jealousy, restlessness and a harshly self-critical inner voice, encouraging hope, self-acceptance and an open-hearted trust that good things can begin again.", spirit: "Chrysoprase is a Heart-chakra stone that carries the fluid, feeling nature of the Water element. Energy workers use it to open and soothe the heart centre, to draw in calm and loving vibrations, and to restore a sense of grace and non-judgement. It is often paired with the 639 Hz frequency of connection and laid over the heart in meditation to invite gentle emotional flow, compassion, and a feeling of being held.", body: "In folk and crystal-healing lore chrysoprase has long been the green stone of comfort and fresh starts, traditionally associated with soothing frayed nerves, easing tension the body holds, and supporting a sense of vitality and renewal. These are traditional associations only — not medical claims — and crystals are never a substitute for professional care.", care: "Chrysoprase is a hard chalcedony (Mohs ~6.5–7) and is safe to cleanse briefly under lukewarm running water; it will not dissolve or soften. It is, however, the exception among the otherwise light-stable chalcedonies: because its green is nickel-derived, prolonged sunlight, heat and drying-out can slowly pale or fade the colour. Keep it out of long direct sun and away from heat, and don't let it sit bone-dry for extended stretches — an occasional damp cleanse actually helps it hold its colour. Charge it gently in moonlight, on the earth, or beside clear quartz rather than on a sunny windowsill." } },
  { name: "Citrine", colour: "Golden yellow", hex: "#e8a92b", chakra: "Solar Plexus", element: "Fire", zodiac: "Leo, Gemini", pair: "528 Hz",
    keywords: ["Abundance", "Prosperity", "Joy", "Confidence", "Manifestation", "Solar Plexus", "Success"],
    use: "Draws abundance and joy, and kindles confidence and personal power.",
    meaning: "Citrine is captured sunlight — the golden stone of abundance, confidence, and warm, uncomplicated joy. Traditionally called the merchant's stone for its reputation of drawing prosperity and success, it kindles the fire of the solar plexus, dissolving self-doubt and inviting you to shine without apology. It carries a bright, optimistic energy that rarely needs cleansing, holding the light like a small, steady sun.",
    work: "Keep a piece in your wallet, purse, or cash box to invite prosperity, or hold it in the morning and set a bright intention for the day ahead.",
    affirm: "I welcome abundance, and I shine with confidence.",
    deep: { origin: "Citrine is a variety of macrocrystalline quartz (silicon dioxide, SiO2), coloured in its warm yellow-to-amber tones by trace amounts of iron held within the crystal lattice. It forms the way quartz does — crystallising from silica-rich fluids in igneous and metamorphic rock, lining the walls of geodes and cavities and growing in veins — and it rates a hard 7 on the Mohs scale. Genuinely iron-coloured natural citrine is actually quite scarce; most citrine offered today is amethyst or smoky quartz that has been gently heated, underground or in a kiln, until it turns golden. Fine material comes from Brazil, Bolivia (the Anahí mine, also famed for ametrine), Madagascar, the Ural Mountains of Russia, Spain, and parts of Africa.", lore: "For centuries citrine has been carried as a token of captured sunlight and good fortune; its name comes from the French citron, lemon, for its colour. It appears as a gemstone in ancient Greek and Roman jewellery and intaglios, and it enjoyed a great vogue in Victorian and Art Deco pieces, where its warm gold suited brooches and rings. It is best known in folk tradition as the 'merchant's stone' or 'money stone,' tucked into tills and cash boxes to draw trade and prosperity — a charming and widespread belief rather than any guarantee of wealth. Because true golden citrine was so rare, much historic 'citrine' was in fact heated amethyst, a practice recorded since at least the 18th century.", mind: "Citrine is the stone people traditionally reach for when the mood needs lifting. Crystal-healing lore associates it with optimism, warmth, and steady self-confidence — a stone said to disperse self-doubt, quiet the inner critic, and rekindle motivation after a low or discouraging spell. Many like to keep it close during new ventures or creative work for the bright, can-do spirit it is believed to encourage.", spirit: "In the crystal-healing tradition citrine is a stone of the solar plexus chakra, the seat of personal power and will, where it is worked with to kindle confidence, drive, and the courage to shine without apology. Its sunny colour also links it to the sacral chakra and to creative, manifesting energy, and it is a favourite in abundance and prosperity practices — held or placed nearby while setting a bright intention for the day.", body: "In folk and crystal-healing practice, citrine has traditionally been associated with warmth, vitality, and a sense of energy and good cheer, and its solar-plexus placement is often linked in that tradition with digestion and general get-up-and-go. These are traditional associations only, not medical facts — crystals are not a treatment for any condition and are never a substitute for care from a qualified professional.", care: "Citrine is durable (hardness 7) and not water-soluble, so it can be cleansed with a brief rinse under cool running water, with sound, with incense or sage smoke, or by a night in the light of the full moon. In crystal lore citrine is traditionally said to be one of the self-cleansing stones — believed to shed rather than hold heavy energy — so many people feel it needs clearing only rarely; treat that as a lovely belief rather than a proven property, and cleanse it whenever it feels right to you. One practical caution: avoid charging citrine in strong, prolonged sunlight. Natural iron-coloured citrine can gradually fade with extended sun and heat, so a short spell of gentle early light or moonlight is far kinder to its colour than hours on a hot windowsill." } },
  { name: "Clear Quartz", colour: "Clear white", hex: "#e6edf1", chakra: "Crown & All", element: "Spirit", zodiac: "All Signs", pair: "963 Hz",
    keywords: ["Clarity", "Amplification", "Healing", "Focus", "Intention", "Crown", "Cleansing"],
    use: "Amplifies intention and energy, clears the mind, and sharpens your focus.",
    meaning: "Clear Quartz is the master stone — a luminous amplifier that magnifies intention, clears the mind, and lifts energy to its highest, clearest note. Known as the great programmable crystal, it takes on whatever purpose you give it and echoes it back stronger, which is why it partners so beautifully with every other stone. Think of it as clear light made solid: cleansing, focusing, and endlessly adaptable.",
    work: "Hold it while setting an intention to charge it with your goal, or place it beside your other crystals to magnify their gifts.",
    affirm: "My intention is clear, and my energy is bright.",
    deep: { origin: "Clear quartz is crystalline silicon dioxide, the same simple chemistry as sand and glass, yet it is the second most abundant mineral in the Earth's crust and the archetype of what most people picture as a 'crystal.' It grows in the trigonal system as those unmistakable six-sided prisms capped by pyramidal points, precipitating over vast spans of time from silica-rich waters in hydrothermal veins, granite pegmatites, and gas cavities. Fine clear material comes from Arkansas in the United States, the Brazilian state of Minas Gerais, Madagascar, and the Alps, while the naturally double-terminated Herkimer 'diamonds' of New York are an especially bright, water-clear variety. Because pure quartz is colourless, it is the parent from which amethyst, citrine, smoky quartz, and rose quartz all arise through trace elements and irradiation.", lore: "The old name rock crystal comes from the Greek krystallos, meaning ice, because the Greeks genuinely believed clear quartz was water frozen so intensely by the gods that it could never thaw, an idea Pliny the Elder set down in the first century. Cultures across the world have treated it as sacred: Roman nobles held polished spheres to cool their hands, diviners have gazed into crystal balls for scrying, Japanese tradition named it tama, the perfect jewel, and Aboriginal Australian lore held clear quartz as maban, the substance of powerful medicine. The celebrated pre-Columbian crystal skulls belong more to legend than record, as the most famous were shown to be nineteenth-century workshop pieces.", mind: "Clear quartz is the crystal of mental clarity, reached for to lift fog, sharpen focus, and cut through cluttered or circling thoughts to the clean heart of a matter. It is worked with to strengthen concentration and memory and to bring a scattered mind back to a single, quiet point. Because it takes on and echoes back whatever purpose you set, it is often used to hold and steady an intention you want to keep clearly in mind.", spirit: "Known as the master stone, clear quartz is the great amplifier and programmable crystal, said to magnify the energy and intention of anything it touches, which is why it partners so beautifully with every other stone in a grid or pouch. It resonates with the crown chakra and, by extension, with all the chakras, drawing energy upward to its highest and clearest note and acting as a general balancer and cleanser. Practitioners program it by holding a clear intention while touching it, trusting it to hold and radiate that purpose back stronger.", body: "In crystal tradition clear quartz is regarded as an all-purpose harmoniser, associated with restoring a general sense of balance and amplifying the supportive qualities of whatever stone it is paired with. Folk practice placed it on the body as a kind of energetic tuning fork, believed to bring the whole system into a clearer, more even hum. These are traditional associations within crystal-healing practice and are not medical claims or a substitute for professional care.", care: "Durable and forgiving, clear quartz is a 7 on the Mohs scale, fully water-safe, and does not fade in sunlight, though a very sudden change of temperature can shock and fracture a piece. It is such a reliable cleanser that it is used to clear other crystals, and it responds happily to running water, smoke, sound, or a night in the moonlight. Charge it in sun or moon as you prefer, and remember that whatever intention you set into it, it will faithfully amplify, so cleanse it before giving it a new purpose." } },
  { name: "Fluorite", colour: "Green & Violet", hex: "#7db5a0", chakra: "Third Eye & Crown", element: "Air", zodiac: "Capricorn, Pisces", pair: "963 Hz",
    keywords: ["Focus", "Clarity", "Protection", "Intuition", "Cleansing", "Decision-Making", "Third Eye"],
    use: "Clears mental fog, sharpens focus, and brings order to a busy mind.",
    meaning: "Fluorite is the stone of focus and mental order — often called the genius stone for the way it clears confusion and draws scattered thoughts into gentle alignment. Cool and many-hued, it soaks up mental fog and chaotic energy, restoring calm concentration and helping you see a situation clearly before you decide. It is also a quiet protector, traditionally used to shield the mind from outside pressure and psychic clutter.",
    work: "Keep Fluorite where you study or work to steady concentration, or hold it during meditation and let it draw scattered thoughts into calm, clear order.",
    affirm: "My mind is clear, focused, and free of confusion.",
    deep: { origin: "Fluorite (also called fluorspar) is calcium fluoride, CaF₂, a halide mineral that crystallises in the cubic system — most often as clean cubes, octahedra, and interpenetrating twins. It is famously soft, defining hardness 4 on the Mohs scale, and has perfect octahedral cleavage in four directions, so it parts along smooth planes if struck. It grows mainly in hydrothermal veins, threaded through quartz, calcite, barite, galena and sphalerite, and as an accessory in granites and limestones. Pure fluorite is colourless; its rainbow of greens, purples, blues, yellows and pinks comes from trace impurities and colour-centres formed by natural radiation, and a single stone is often banded with several hues at once. Fine specimens come from Derbyshire in England (the blue-purple banded 'Blue John'), China, Mexico, the fluorite district of southern Illinois in the USA, Spain, Germany and Argentina.", lore: "The name comes from the Latin fluere, 'to flow' — since the Renaissance, fluorite has been added to metal ores as a flux to help them melt and flow. From this very mineral came the word 'fluorescence,' coined by the physicist George Gabriel Stokes in 1852 after the eerie glow many fluorites give off under ultraviolet light. In Georgian and Victorian England the banded Blue John of Castleton was carved into prized vases, urns and jewellery, and carved fluorite vessels survive from Roman times as well — though the romantic tale that Roman drinkers used it to ward off drunkenness is legend rather than record. Its popular nickname, the 'genius stone,' and its reputation as a mind-clearer belong to the twentieth-century crystal-healing revival, not to any ancient tradition.", mind: "Fluorite is traditionally worked with for focus, clarity and mental order. Folk practice reaches for it to dispel confusion, quiet a scattered or over-busy head, and steady the mind before a decision — the reason it earned the 'genius stone' name and a place on desks and study tables. Emotionally, it is associated with calming chaotic, anxious feeling and letting cluttered thoughts settle into clean, clear order.", spirit: "In the crystal-healing tradition fluorite is linked to the Third Eye and Crown chakras and to the element Air. It is used in meditation to open intuition and higher awareness, to cleanse and stabilise the aura, and as a psychic-protective stone said to shield the mind from outside pressure and draining influence. Multicoloured 'rainbow' fluorite is thought to tune and align the subtle bodies — purple worked for spiritual insight, green for clearing the heart.", body: "In folk and crystal-healing tradition fluorite is associated with the bones, the teeth and the brain — a resonance practitioners partly draw from the mineral sharing its name with fluoride. It has traditionally been kept close as a companion for mental stamina through long, demanding work and as a calming presence in tense surroundings. This is association and lore only: fluorite is not a treatment for any condition and is never a substitute for professional medical care.", care: "Fluorite needs gentle handling. Keep it out of prolonged direct sunlight — many fluorites fade or shift colour with long light exposure — and away from heat and sudden temperature change, which can thermal-shock and crack the stone. Protect it from knocks and drops too: at Mohs 4 with perfect octahedral cleavage it scratches and chips easily. To cleanse it, use gentle methods only — a brief rinse under cool (never hot) water followed by a soft pat dry, an hour resting in moonlight, or a pass through cleansing smoke. Never charge fluorite in the sun." } },
  { name: "Garnet", colour: "Deep red", hex: "#7b1e2b", chakra: "Root", element: "Fire", zodiac: "Capricorn, Aquarius", pair: "396 Hz",
    keywords: ["Passion", "Vitality", "Courage", "Grounding", "Root", "Strength"],
    use: "Reignites passion, vitality, and grounded courage.",
    meaning: "Garnet is the ember stone — a deep, glowing red that stokes passion, vitality, and the courage to act. Carried for centuries as a protective talisman by travellers and warriors, it was believed to light the way through darkness and bring the wearer safely home. It grounds fiery energy down into the body, reigniting drive, desire, and devotion when life has left you cold or weary.",
    work: "Wear it close to the body or hold it at the base of the spine when your energy or motivation runs low.",
    affirm: "I am alive with passion, strength, and courage.",
    deep: { origin: "Garnet is not a single mineral but a family of related silicates sharing one crystal structure, most familiar in the deep glowing red of almandine (iron-aluminium garnet) and pyrope (magnesium-aluminium garnet), though the group also runs through orange spessartine, green grossular and demantoid, and rare emerald-green uvarovite. It crystallizes in the cubic system, often as beautifully complete rhombic dodecahedra, and forms chiefly in metamorphic rocks such as schist and gneiss where heat and pressure reshape the earth, as well as in some igneous rocks. Historic and modern sources include the famous Bohemian pyrope of the Czech lands, along with India, Sri Lanka, several parts of Africa, and Arizona. Garnet is so common and hard that it is even crushed for industrial abrasive and waterjet cutting.", lore: "The name comes from the Latin granatum, pomegranate, for the way clustered red crystals echo the fruit's glistening seeds. Egyptians were setting garnets into jewellery more than three thousand years before our era, Romans wore them in signet rings, and in Hebrew tradition the glowing 'carbuncle' said to light Noah's ark is often taken to be garnet. Medieval crusaders and travelling warriors genuinely carried garnet as a protective talisman, believing it would light the way through darkness, guard against wounds, and bring them safely home, and Bohemian garnet jewellery became a Victorian obsession. It remains the birthstone of January.", mind: "Garnet is the ember of the emotional world, worked with to rekindle passion, courage, and the will to act when life has left you cold, weary, or resigned. It is reached for to burn off apathy and despair and to restore desire, drive, and devotion, whether toward a person, a purpose, or one's own life force. Many turn to it for the steady confidence to take a bold step rather than retreat.", spirit: "This is a root chakra stone that grounds fiery, passionate energy down into the body and the earth, anchoring vitality where it can actually be used. In energetic practice it is associated with stoking the base life force, sometimes described in terms of awakening kundalini, and with strengthening the resolve to move toward what you want. Its old role as a protective talisman carries into modern work as a stone of safe return and steadfast commitment.", body: "Because of its deep blood-red colour, garnet has long been associated in folk tradition with the blood, circulation, and bodily warmth, and old talismanic lore even credited it with staunching bleeding and reviving flagging strength. Crystal tradition still reaches for it as a stone of physical energy, stamina, and warmth when one feels depleted. These associations are traditional and symbolic only, never a medical claim, and no crystal should stand in for proper care.", care: "Garnet is one of the easier stones to care for, hard at roughly 6.5 to 7.5 on the Mohs scale, water-safe, and colourfast, so it will not fade in sunlight the way amethyst or fluorite do. Cleanse it with running water, smoke, or sound, and recharge it in sun or moon, or by resting it on hematite or red jasper to renew its grounding fire. Its main vulnerability is a sharp knock, since a stone with visible fractures can chip, so store it apart from harder gems." } },
  { name: "Green Aventurine", colour: "Soft green", hex: "#56a86e", chakra: "Heart", element: "Earth", zodiac: "Aries, Libra", pair: "639 Hz",
    keywords: ["Luck", "Abundance", "Prosperity", "Opportunity", "Heart", "Optimism"],
    use: "Opens the heart to luck, opportunity, and easy optimism.",
    meaning: "Green Aventurine is known as the luckiest of all stones — a shimmering green quartz that soothes the heart and turns the mind toward possibility. Traditionally carried to attract abundance, win favour, and greet new opportunity with an open hand, it works by softening worry and resistance so that good fortune has room to arrive. Warm and encouraging, it reminds you that a light, hopeful heart is itself a magnet for the very things you long for.",
    work: "Keep a piece in your pocket, purse, or wealth corner when courting opportunity, and hold it over the heart while picturing what you wish to welcome in.",
    affirm: "My heart is open, and good fortune flows to me.",
    deep: { origin: "Green Aventurine is a variety of quartz — a translucent-to-opaque stone whose soft green colour and gentle internal glitter both come from the same source: countless tiny platelets of fuchsite, a chromium-rich green mica, suspended through the quartz. Those flat, reflective flakes catch the light to create aventurescence, the shimmering sheen that gives the whole aventurine family its name. It forms in metamorphic and quartz-rich rock, and is often cut from massive quartzite rather than single crystals. India is by far the largest source, with fine material also coming from Brazil, Russia's Ural Mountains, Chile, Spain and Tanzania.", lore: "The name comes not from an ancient civilisation but from a happy accident of Venetian glassmaking. In 18th-century Murano, workers are said to have spilled copper filings into molten glass and created a sparkling stone they called 'avventurina,' from the Italian a ventura — 'by chance.' The natural mineral, with its similar glittering sheen, was later named after that lucky glass, and the association with chance and good fortune has clung to it ever since — it is often called 'the gambler's stone' and 'the luckiest of all crystals.' Older tales connect green aventurine to fortune, opportunity and visionary sight (some say Tibetan statues were given aventurine eyes to sharpen their powers), though these belong more to folklore than to firm historical record; the documented thread is the name's descent from that accidental Venetian glass.", mind: "Green Aventurine is traditionally worked with as a stone of quiet optimism and emotional recovery. It is the crystal people reach for when worry has grown loud and indecision has taken hold — folk practice turns to it to soften anxiety, dissolve old disappointment, and coax a light, hopeful outlook back into place. It is said to encourage perseverance, steady the nerves before something new, and help the heart let go of what has passed so there is room to welcome what is coming. A calm, encouraging companion for anyone rebuilding confidence or opening to fresh possibility.", spirit: "As a Heart-chakra stone, Green Aventurine is associated in the crystal-healing tradition with opening and balancing the heart centre — clearing away energetic congestion so that giving and receiving flow more freely. Its Earth element lends this heart-work a grounded, growing quality, like a seed finding good soil. It is the classic stone of luck, abundance and opportunity, traditionally kept in a wealth corner or carried to draw favourable circumstance, and it is regarded as a gentle comforter and harmoniser that soothes the aura and shields the heart from harsher energies.", body: "In crystal-healing folklore Green Aventurine is traditionally associated with the heart and with a general sense of vitality, ease and renewal — a stone practitioners have long linked to comfort and gentle wellbeing. These are cultural and folk associations only: Green Aventurine is not a treatment, a cure, or a substitute for medical care, and any real health concern belongs with a qualified professional.", care: "Green Aventurine is a hardy, forgiving stone — roughly 7 on the Mohs scale and water-safe — so you can cleanse it under lukewarm running water, in a bowl of moonlit water, or with the smoke of sage or palo santo without worry. One caution worth knowing: while the stone itself is tough, its green colour comes from fuchsite (chrome mica), which can slowly fade under prolonged direct sunlight. Keep any sun-charging brief, and favour gentler methods to recharge it — moonlight, a selenite plate, sound, or a rest on the earth — so its green shimmer stays vivid for years." } },
  { name: "Hematite", colour: "Metallic grey", hex: "#5b5d63", chakra: "Root", element: "Earth", zodiac: "Aries, Aquarius", pair: "396 Hz",
    keywords: ["Grounding", "Protection", "Courage", "Focus", "Strength", "Stability", "Root"],
    use: "Grounds and shields, absorbs negativity, and restores calm strength.",
    meaning: "Hematite is the stone of the steadying anchor — heavy, metallic, and iron-rich, it pulls anxious energy downward and roots you firmly to the earth. Long carried as a protective shield, it is said to absorb negativity and return it to the ground, leaving a calm, collected strength in its place. Quietly fortifying, it restores courage and focus when you feel scattered, overwhelmed, or unsafe.",
    work: "Hold a piece of Hematite in your hand and feel its weight when you need to settle, or carry one in your pocket to stay anchored and protected through the day.",
    affirm: "I am strong, grounded, and safe.",
    deep: { origin: "Hematite is iron oxide (Fe₂O₃), the earth's principal ore of iron and a true crystalline mineral — silvery-metallic to the eye, yet it leaves a rust-red streak that earned it the Greek name haima, 'blood.' It forms wherever iron meets oxygen and water: in the great banded-iron formations laid down in ancient seas, in hydrothermal veins, and in sedimentary beds, growing as mirror-bright rhombohedra, botryoidal 'kidney ore,' or earthy red masses. Fine specimens come from the Lake Superior ranges of the United States, Minas Gerais in Brazil, the Cumbrian kidney-ore of England, Elba and Morocco. Be warned that the cheap, strongly magnetic 'hematite' of bead shops is usually man-made hematine — genuine hematite is only faintly magnetic at most.", lore: "Ground to powder, hematite is red ochre — humanity's oldest pigment, dusted over Palaeolithic burials and painted on cave walls tens of thousands of years ago as a symbol of blood and life. The Egyptians set it in tombs and amulets, and Greek and Roman soldiers rubbed the red stone over their bodies before battle, trusting the metal of Mars to make them invulnerable. Pliny and the medieval lapidaries prescribed it to staunch bleeding and cool inflammation, and the Victorians cut its mirror-black faces into mourning jewellery and seals.", mind: "Hematite is the classic stone for a scattered, anxious mind, traditionally worked with to pull racing thoughts down out of the head and back into the body. Collectors reach for it to restore focus and mental discipline, to firm up weak boundaries, and to lend a quiet, iron-spined courage when you feel overwhelmed or unsafe. It has long been called a stone that absorbs worry and hands you back a calm, collected strength.", spirit: "This is a Root-chakra stone through and through, an anchor that grounds the spirit firmly into the physical body and the earth beneath your feet. In the crystal tradition it is worn as a protective shield that draws off negativity and returns it harmlessly to the ground, sealing the aura like armour. Aligned with the element of Earth, it steadies and centres, which makes it a favourite for grounding after meditation or energy work.", body: "Because it is iron-rich and bleeds red, hematite is the stone folk tradition has always associated with the blood — reached for to support healthy circulation and, symbolically, the body's iron. It is traditionally linked with vitality and physical stamina, and was once held to cool inflammation and stem bleeding. These are old associations of folklore and crystal lore, not medicine, and never a substitute for proper care.", care: "Hematite does not fade in light, so sun or moonlight will not harm its colour — but it is iron, and iron rusts, so keep it out of prolonged water and never salt water, which corrodes and dulls the mirror finish. Cleanse it instead with smoke, sound, or a night resting on selenite or a bed of dry hematite chips. To recharge its grounding nature, lay it briefly on bare earth or bury it in soil overnight, then dry it thoroughly afterward." } },
  { name: "Howlite", colour: "White", hex: "#ededea", chakra: "Crown", element: "Air", zodiac: "Gemini, Virgo", pair: "963 Hz",
    keywords: ["Calm", "Patience", "Sleep", "Stress Relief", "Awareness", "Crown"],
    use: "Calms the mind, soothes anger, supports patience and restful sleep.",
    meaning: "Howlite is stillness carved in stone — creamy white laced with soft grey veins, like marble touched by moonlight. It is the classic stone of patience and a quiet mind, traditionally used to absorb tension, cool a hot temper, and hush the mental chatter that keeps us awake at night. Gentle and unhurried, it teaches the art of waiting calmly and meeting frustration with grace.",
    work: "Keep a piece by the bed to quiet a busy mind, or hold it when frustration flares and let its coolness settle you.",
    affirm: "I am patient, peaceful, and calm within.",
    deep: { origin: "Howlite is a calcium borosilicate hydroxide, a borate mineral that grows as chalky white nodules and masses threaded with grey or black veins, giving it the look of marble touched by moonlight. It forms in evaporite deposits — the borate-rich beds left behind by ancient drying lakes — and it is soft and porous, only about 3.5 on the Mohs scale. It was first described in 1868 by Henry How, a Nova Scotian chemist who found it near Windsor, and today most comes from the borate country of California. That same porosity means howlite drinks up dye eagerly, which is why it is the stone most often tinted blue to counterfeit turquoise and red to mimic coral.", lore: "As nineteenth-century minerals go, howlite is a newcomer, so it carries none of the Greek or Egyptian pedigree of the ancient gems — its 'history' is largely the history of the turquoise it has been dyed to imitate. Named for the geologist Henry How, its gentle metaphysical reputation is entirely a modern, twentieth-century one. An honest collector keeps that in mind: the lore of patience and stillness around howlite is recent folk wisdom, not antiquity.", mind: "Howlite is the quintessential stone of patience and a quiet mind, traditionally kept close to absorb tension, cool a hot temper, and hush the racing mental chatter that keeps you awake at night. It is worked with to meet frustration with grace and to teach the art of waiting calmly, softening reactivity into composure. Many keep a piece by the pillow precisely for the way it seems to still an overactive head.", spirit: "A Crown-chakra stone of the element Air, howlite quiets the mind enough for genuine meditation and attunement to subtler states. In the crystal tradition it is used to prepare the awareness for higher wisdom, to aid calm astral travel, and to strengthen memory and clear thinking. Its energy is unhurried and cooling, an invitation to stillness rather than a jolt.", body: "Being rich in calcium, howlite is traditionally associated in folk crystal practice with the bones, teeth, and the body's calcium balance. More than anything, it is the stone people have reached for to soothe an overactive mind toward restful sleep. These are traditional associations only, offered as folklore and never as medical advice or a replacement for care.", care: "Howlite is soft and porous, so keep it away from water — a long soak can damage the surface, and any dye will bleed and cloud. Cleanse it gently with smoke, sound, or a night on a selenite plate rather than in salt or liquid. Moonlight is its natural charger and perfectly safe; keep it out of strong, prolonged sunlight, especially if it has been dyed, as tinted howlite fades." } },
  { name: "Iolite", colour: "Violet-blue", hex: "#5b6cae", chakra: "Third Eye", element: "Water", zodiac: "Sagittarius, Libra", pair: "852 Hz",
    keywords: ["Intuition", "Vision", "Clarity", "Guidance", "Balance", "Third Eye", "Focus"],
    use: "Awakens inner vision and steadies you through fog, change and confusion.",
    meaning: "Iolite is the Viking's compass — the \"water sapphire\" whose violet-blue depths the old navigators are said to have read to find the sun through cloud and fog. It is the stone of inner vision and true direction, lifting the haze from a scattered mind so intuition can rise and quietly show you your way. Traditionally called upon when you feel lost or pulled in too many directions, it helps you trust your own inner knowing and hold your course toward what truly matters.",
    work: "Hold iolite in meditation to deepen intuition, or keep it close through a season of change to steady your inner compass and find your bearings.",
    affirm: "I trust my inner vision to guide me home.",
    deep: { origin: "Iolite is the gem-quality, transparent variety of cordierite, a magnesium-aluminium silicate whose name comes from the Greek ios, 'violet.' Its magic is pleochroism: the same crystal shows violet-blue down one axis, a watery near-colourless yellow down another, and pale blue down a third, which is exactly why the old lapidaries called it 'water sapphire.' It crystallises deep in high-grade metamorphic rocks — gneisses and schists — where aluminium-rich sediments were cooked under heat and pressure. Fine stones come from Sri Lanka, India, Madagascar, Myanmar, Tanzania, Brazil and the Nordic countries.", lore: "Iolite's fame rests on the Viking legend that Norse navigators sliced it into thin plates and peered through it as a polarising filter to locate the hidden sun and steer through cloud and fog. It is a wonderful story and genuinely plausible — cordierite does polarise light — but no such 'sunstone' has ever been dug from a Viking site, and scholars still debate whether the sagas meant iolite, Iceland-spar calcite, or something else entirely. Long confused with true sapphire, iolite was only sorted out and properly named by mineralogists in the nineteenth century.", mind: "Iolite is the stone of inner vision and true direction, traditionally called upon when you feel lost, foggy, or pulled in too many directions at once. It is worked with to lift the haze from a scattered mind, sharpen focus and decision-making, and help you trust your own inner knowing enough to hold your course. It carries an old reputation, too, as a stone of self-governance, reached for to loosen the grip of unhealthy attachments and habits.", spirit: "This is a Third-Eye stone of the element Water, prized for awakening intuition and clear inner sight. In the crystal tradition it is a companion for shamanic journeying, astral travel and vivid dream work, gently aligning the aura so that guidance can rise unclouded. Working with it in meditation is said to open the inner compass and quietly show you the way.", body: "Folk and crystal tradition have long associated iolite with the eyes and clear seeing, and with easing headaches and the fog of a weary head. It is also linked, by tradition, with the liver and with the body's efforts to release what it no longer needs. All of this is inherited folklore, offered as tradition rather than medicine, and never a substitute for proper care.", care: "At around 7 to 7.5 on the hardness scale iolite is fairly durable, but it can chip or split along its cleavage, so treat it kindly and skip the ultrasonic cleaner, which can crack it. A brief rinse in cool water is fine; avoid sudden heat, which can disturb its colour. Being a stone of moonlit vision, it recharges beautifully under the moon — cleanse it with water, smoke or sound, and leave harsh, prolonged sunlight to gentler moonlight instead." } },
  { name: "Jade", colour: "Green", hex: "#5cab7d", chakra: "Heart", element: "Earth", zodiac: "Aries, Libra", pair: "639 Hz",
    keywords: ["Luck", "Prosperity", "Abundance", "Harmony", "Serenity", "Wisdom", "Heart"],
    use: "Attracts luck and prosperity while calming the heart into gentle harmony.",
    meaning: "Jade is the ancient stone of luck, longevity and quiet prosperity — treasured for thousands of years, above all in China, as a bringer of good fortune and a guardian of the heart. Cool, smooth and serene, it steadies the emotions, softens irritability, and draws in abundance and opportunity. More than a wealth stone, it is a stone of wisdom and balance that helps you act from calm rather than from want.",
    work: "Carry a piece in your pocket or wallet to invite prosperity, or rest it over the heart to release tension and restore a sense of harmony.",
    affirm: "I am a magnet for good fortune, and my heart rests in peace.",
    deep: { origin: "'Jade' is really two different minerals that history lumped together: nephrite, a calcium-magnesium amphibole, and jadeite, a sodium-aluminium pyroxene. Neither is especially hard, yet both are astonishingly tough, built from densely interlocking fibres and grains that let ancient carvers work them without shattering. Nephrite forms in metamorphosed serpentinites and comes from Hetian in China, British Columbia, Siberia, Wyoming and the rivers of New Zealand; jadeite forms only under the extreme pressure of subduction zones, and the finest emerald-green 'imperial' jade — coloured by chromium — comes from Myanmar, with a second source in Guatemala. Beware that much 'jade' on the market is dyed nephrite, serpentine sold as 'new jade,' or resin-impregnated stone.", lore: "No stone is more deeply woven into a civilisation than jade is into China, where 'yu' has been carved for six to eight thousand years, prized above gold, and treated as the very emblem of virtue — Confucius compared its qualities to those of the noble person. Han-dynasty princes were buried in suits of jade plaques sewn with gold wire, trusting the stone to preserve body and soul. Across the Pacific the Maori treasured nephrite pounamu as sacred heirloom weapons and hei-tiki pendants passed down the generations, while the Olmec, Maya and Aztec valued jadeite above all else, linking its green to water, breath and life itself.", mind: "Jade is a supremely calming heart-stone, worked with to steady the emotions, soften irritability, and dissolve the inner tension that clouds good judgement. It carries an ancient reputation for luck and quiet prosperity, but its deeper gift is wisdom — helping you act from serenity and sufficiency rather than from want or grasping. Many keep it close to encourage self-reliance and peaceful, harmonious dreams.", spirit: "A Heart-chakra stone of the element Earth, jade harmonises and protects, long carried as a guardian against harm and a magnet for good fortune and opportunity. In the crystal tradition it draws abundance while keeping the heart open and balanced, and it is valued for dream work and for connection to grounding, ancestral earth energies. It is less a stone of sudden fire than of steady, blessed flourishing.", body: "In Chinese folk tradition jade is the great stone of health and longevity, associated above all with the kidneys and the body's filtering, cleansing work, and worn against the skin to encourage overall vitality. It has long been reached for as a soothing, cooling presence in times of physical strain. These are traditional and cultural associations, not medical claims, and no stone should ever replace proper care.", care: "Genuine jade is durable and water-safe — a rinse in cool, mildly soapy water suits it well — but avoid harsh chemicals, sudden heat, and the ultrasonic cleaner, especially on dyed or resin-treated pieces whose colour will bleed and fade. Keep treated jade out of prolonged strong sun for the same reason. Cleanse it with water or smoke, and charge it under the moon, in the soft light of dawn, or by resting it on the earth or in a garden — the Earth element that feeds it." } },
  { name: "Kyanite", colour: "Streaky blue", hex: "#4a70a8", chakra: "Throat & Third Eye", element: "Air", zodiac: "Aries, Libra", pair: "852 Hz",
    keywords: ["Communication", "Alignment", "Intuition", "Clarity", "Truth", "Meditation", "Throat"],
    use: "Aligns the chakras, clears blocks, and opens honest, easeful communication.",
    meaning: "Kyanite is the great aligner — a high-vibration stone said to sweep every chakra into gentle alignment all at once. Prized because it holds no negativity, it is one of the rare crystals that never needs cleansing, quietly clearing blockages and opening the channels of honest speech and clear inner sight. Long turned to for calm, truthful communication, it helps words arrive whole and unforced, and steadies a scattered mind for meditation.",
    work: "Sweep a blade of kyanite slowly over the body to align your energy, or hold it at the throat before a hard conversation and let the words settle.",
    affirm: "I speak my truth clearly, and my whole being is in alignment.",
    deep: { origin: "Kyanite is an aluminium silicate, Al₂SiO₅, that grows in long bladed crystals of a deep, streaky blue — its name comes from the Greek kyanos, 'dark blue.' It is famous among mineralogists for a strange 'two hardness': soft enough to scratch with a knife along the length of the blade, yet distinctly harder across it, which earned it the old name disthene, 'two strengths.' It forms in high-pressure metamorphic rocks — gneiss, schist and aluminous pegmatite — and shares its exact chemistry with andalusite and sillimanite, the three being pressure-and-temperature siblings. Blades come from Minas Gerais in Brazil, Nepal, the Swiss Alps and the Kenyan and North Carolinian deposits, where it is also mined industrially for heat-proof ceramics.", lore: "Kyanite carries less ancient named lore than the classical gems; much of its industrial and metaphysical fame is modern, tied to its use in refractory ceramics and spark plugs and to its rediscovery by twentieth-century crystal workers. There is, though, an old traveller's tradition of hanging a blade as a pendulum to find true direction, echoing the compass symbolism that clings to blue stones. Its celebrated reputation as a crystal that never holds negativity, and so never needs cleansing, is a cherished tenet of that modern practice rather than an antique one.", mind: "Kyanite is long turned to for calm, truthful communication, worked with to help words arrive whole and unforced and to loosen the throat before a hard conversation. It is prized for clearing mental confusion and steadying a scattered mind, dissolving anger and frustration into level thinking. Many reach for it to encourage honest self-expression and to recall and work with their dreams.", spirit: "Both a Throat and a Third-Eye stone of the element Air, kyanite is the great aligner, said to sweep every chakra into gentle alignment at once and to clear blockages along the energy channels. Because it is held to carry no negativity of its own, it is counted — with citrine and selenite — among the rare self-cleansing crystals, one that can even cleanse and align other stones. High and quiet in vibration, it is a favourite bridge into meditation and attunement.", body: "Sitting where the throat is, kyanite is traditionally associated in folk crystal practice with the throat and voice, and by extension with the brain and the nerves that carry its signals. It has also been linked, by tradition, with the muscles and easy motion. These are inherited folk associations only, never medical claims, and no crystal is a substitute for proper care.", care: "Here is the rare gift: kyanite is self-cleansing and, in the crystal tradition, never needs clearing — you can simply use it, and it will not accumulate negativity. Physically, though, it is fragile, splitting readily along its bladed cleavage, so handle it gently and keep it out of long water soaks and salt, which can work between the blades; skip the ultrasonic entirely. If you like, refresh it briefly under the moon or lay it out to charge, but truly it looks after itself and quietly tends the stones around it." } },
  { name: "Labradorite", colour: "Grey-blue with peacock flash", hex: "#4a6d7c", chakra: "Third Eye & Throat", element: "Water", zodiac: "Leo, Scorpio", pair: "852 Hz",
    keywords: ["Protection", "Intuition", "Transformation", "Magic", "Psychic Shield", "Third Eye"],
    use: "Shields the aura, awakens intuition, guides you through change.",
    meaning: "Labradorite is the stone of magic and hidden light — plain grey until the moment it catches the sun and throws out its famous flash of blue and gold, a reminder that transformation lives inside the ordinary. Long carried by seers and shamans as a stone of the aurora, it seals and protects the aura while raising your psychic senses, helping you trust the quiet knowing that rises from within. It is a steadfast companion through change, tempering fear so you can step into what is becoming.",
    work: "Carry a tumbled piece when you feel drained by others, or hold it during meditation and watch for the flash as you set an intention for the path ahead.",
    affirm: "I am protected, and my intuition lights the way.",
    deep: { origin: "Labradorite is a member of the plagioclase feldspar family, a sodium-calcium aluminium silicate that crystallises deep in slow-cooling igneous rock such as gabbro, basalt and anorthosite. Its celebrated flash — that peacock shimmer of blue, gold and green called labradorescence — is not surface colour at all but light bending and interfering through microscopically thin internal layers, so the stone looks plain grey until the angle is exactly right. First described in the 1770s from Paul's Island off the coast of Labrador in Canada, it is today mined most abundantly in Madagascar, with the richest, most multicoloured material — the variety called spectrolite — coming from Ylämaa in Finland.", lore: "The Inuit of Labrador told that the northern lights were once trapped inside the coastal rocks until a warrior struck them with his spear, freeing most of the aurora into the sky while some light stayed locked in the stone forever, which is why it still throws fire from within. Moravian missionaries carried the first specimens to Europe in the late eighteenth century, where it quickly became a prized ornamental stone. Because its recorded discovery is fairly recent, most of its mystical reputation as an aurora and shaman's stone has been woven over the last two centuries rather than handed down from antiquity, and it is honest to say so.", mind: "Labradorite is reached for in times of upheaval and uncertainty, valued as a steadying companion when everything familiar is shifting. It is said to temper fear and impulsiveness, cool an overactive imagination, and restore a sense of quiet trust in one's own perception. Many keep it close through transitions — a new home, a new path, a leap into the unknown — precisely because it holds the promise that something luminous is waiting inside the grey.", spirit: "Working with the Third Eye and Throat chakras, labradorite is the classic stone of psychic protection, thought to seal the aura and shield it from energy drain while raising intuition, clairvoyance and dream recall. Seers and energy workers have long turned to it to strengthen the quiet knowing that rises unbidden, and to explore the subconscious without becoming unmoored. It is regarded as a bridge stone, one that helps you move consciously between the ordinary world and the hidden one.", body: "In folk and crystal tradition it is associated with the eyes and the brain, and was reached for to ease the strain of tired sight and to support clear, orderly thinking. Some traditions also link it to the metabolism and to steadying the body's rhythms through stressful seasons. These are longstanding associations of belief and practice, not medical claims, and it is never a substitute for proper care.", care: "Labradorite is reasonably durable at around 6 to 6.5 on the Mohs scale, though its feldspar cleavage means it can chip on a sharp knock, so handle it gently. It tolerates a brief rinse under cool running water and its colour is stable in light, but it needs no harsh scrubbing and dislikes salt. Most fittingly it is cleansed and charged under the moon and stars — an echo of its aurora lore — or with smoke and sound, and a night on a selenite plate refreshes it beautifully." } },
  { name: "Lapis Lazuli", colour: "Deep royal blue with gold", hex: "#26619c", chakra: "Throat & Third Eye", element: "Water", zodiac: "Sagittarius, Libra", pair: "852 Hz",
    keywords: ["Truth", "Wisdom", "Communication", "Intuition", "Inner Power", "Throat"],
    use: "Speaks and sees the truth; deepens wisdom and inner authority.",
    meaning: "Lapis Lazuli is the royal stone of truth — a deep celestial blue flecked with gold that adorned pharaohs and philosophers as an emblem of wisdom and inner royalty. It is traditionally used to open honest communication, sharpen the intellect, and awaken the inner eye, helping you speak your truth with clarity and stand in your own quiet authority. Ancient and dignified, it draws the mind upward toward understanding while keeping your words rooted in integrity.",
    work: "Wear it at the throat or hold it before an important conversation, and rest it on the brow in meditation to invite insight and clear inner vision.",
    affirm: "I speak my truth with wisdom and clarity.",
    deep: { origin: "Lapis lazuli is not a single mineral but a rock, a deep celestial-blue metamorphic stone whose colour comes from lazurite, a sulphur-bearing silicate, marbled with white calcite and studded with brassy flecks of pyrite. It forms where limestone is transformed by contact with intruding magma, the heat and mineral-rich fluids growing lazurite through the rock. The world's oldest and finest source is the Sar-e-Sang mines of Badakhshan in Afghanistan, worked more or less continuously for over six thousand years; secondary deposits are found in the Andes of Chile, which run paler and greener with calcite, and around Lake Baikal in Siberia.", lore: "Few stones carry so long a human record: the Sumerians and Egyptians prized it above almost all else, inlaying it into the funerary mask of Tutankhamun and carving it into scarabs and amulets, while Cleopatra is said to have ground it for eyeshadow. From the Renaissance onward it was crushed into ultramarine, the most costly pigment on any painter's palette, reserved for the robes of the Virgin and worth more by weight than gold. Pliny the Elder called it a fragment of the starry firmament, and much of the sapphire praised in medieval and biblical texts was in fact this stone.", mind: "Lapis has always been the scholar's and truth-teller's stone, worked with to sharpen the intellect, aid memory and bring order to a cluttered mind. It is turned to for the courage to speak honestly — to say the hard true thing with dignity rather than heat — and to dissolve the old habit of swallowing one's own voice. Traditionally it is thought to reveal inner truth as well, encouraging self-awareness and the quiet authority that comes from knowing your own mind.", spirit: "Governing the Throat and Third Eye chakras, lapis is used to open honest communication and to awaken the inner eye, bridging the spoken word with higher understanding. It has been regarded since antiquity as a stone of royalty and the divine, drawing the awareness upward toward wisdom while keeping speech rooted in integrity. Energy workers use it to stimulate psychic insight and to align what one thinks, says and believes into a single honest line.", body: "Folk and crystal tradition associate lapis with the throat and the head — it was reached for to soothe sore throats, to quiet headaches, and to ease strain around the eyes and brow. Some older practices also linked it to the thyroid and to calming an overheated system. These are traditional associations only, offered in the spirit of lore and never as medicine or a replacement for a physician's care.", care: "Lapis is soft and porous at about 5 to 5.5 on the Mohs scale, and it should be kept well away from water: the calcite within can etch and the pyrite can rust and stain the blue. Salt and harsh chemicals will damage it too, and long, direct sunlight can slowly dull the depth of its colour. Cleanse it only by dry means — smoke, sound, or a soft cloth — and recharge it overnight in moonlight or resting on clear quartz or selenite." } },
  { name: "Larimar", colour: "Sky blue", hex: "#6fbfcf", chakra: "Throat", element: "Water & Fire", zodiac: "Leo, Pisces", pair: "741 Hz",
    keywords: ["Calm", "Communication", "Serenity", "Throat", "Stress Relief", "Tranquility", "Healing"],
    use: "Cools and calms the mind, soothes emotion, frees clear expression.",
    meaning: "Larimar is the sea made solid — a rare Caribbean stone the colour of tropical water and clear sky, yet born of ancient volcanic fire. Long called the dolphin stone and the stone of Atlantis, it carries a cooling, calming presence that soothes an overheated mind and steadies the emotions like a gentle tide. It is treasured for softening fear into serenity and helping honest, heartfelt words find their voice.",
    work: "Rest it at the throat or hold it during slow breathing to release stress, or keep it close through times of change to feel the calm of the sea.",
    affirm: "I am calm as the sea, and I speak my truth with ease.",
    deep: { origin: "Larimar is a rare blue variety of pectolite, a sodium-calcium silicate whose gentle sky-to-turquoise colour comes from copper substituting for some of the calcium in its structure. It is born of ancient volcanism: hot, mineral-rich fluids filled gas cavities in basaltic rock and crystallised into the fibrous blue mineral, and over time some was carried by rivers down toward the Caribbean sea. Astonishingly, gem-quality larimar is found in only one place on earth — a single mountainside in the Barahona province of the Dominican Republic — which is exactly what makes it so scarce and so treasured.", lore: "Larimar's story is remarkably young for a stone of legend: though a local priest sought permission to mine the blue rock as early as 1916, it was not truly brought to light until 1974, when Miguel Méndez and a Peace Corps volunteer traced it to its source, and Méndez named it for his daughter Larissa joined with 'mar,' the Spanish word for sea. Its link to the lost world of Atlantis comes not from antiquity but from the twentieth-century seer Edgar Cayce, who foretold that a blue healing stone would surface on a Caribbean island once part of Atlantis. It is honest to call it a modern stone whose 'dolphin stone' and Atlantean lore were woven within living memory.", mind: "Larimar is treasured as a cooling, calming presence for an overheated mind — the stone people reach for when thoughts race, tempers flare, or anxiety rises like a tide. It is said to soften fear into serenity, dissolve self-sabotaging patterns, and return the emotions to an even keel, much as the sea smooths a jagged stone. Many keep it near in stressful hours for the way it seems to invite a long, slow exhale.", spirit: "A pure Throat-chakra stone carrying both the Water of the sea and the Fire of its volcanic birth, larimar is worked with to help honest, heartfelt words find their voice with ease rather than force. It is associated with soft, receptive energy and with a tranquil, dolphin-like joy, and is used in meditation to cool the fires of the spirit and open a peaceful connection to something larger. Energy workers value it for balancing the heat of the emotions with the clarity of clear speech.", body: "In crystal tradition larimar is associated above all with cooling — folk practice reached for it to ease fevers, inflammation and hot, agitated states, and to soothe the throat. Some also link it to calming an overstimulated nervous system and steadying the breath. These are traditional associations only and carry no medical claim; larimar is a comfort to hold, never a substitute for proper care.", care: "Larimar is fairly soft at 4.5 to 5 on the Mohs scale, and its blue is genuinely light-sensitive: prolonged sunlight will slowly bleach and fade the colour, so store and charge it out of direct sun. A brief rinse in cool, fresh water suits this sea-born stone, but avoid soaking, salt water and heat. Cleanse it gently with moonlight, smoke or sound, and recharge it beneath the moon or, fittingly, in the presence of real running water." } },
  { name: "Lepidolite", colour: "Lilac", hex: "#b7a2cc", chakra: "Third Eye & Crown", element: "Water", zodiac: "Libra", pair: "963 Hz",
    keywords: ["Calm", "Anxiety Relief", "Balance", "Sleep", "Transition", "Serenity", "Stress Relief"],
    use: "Eases anxiety and overwhelm, calms the mind, smooths transitions.",
    meaning: "Lepidolite is the great soother — a shimmering lilac mica naturally rich in lithium, the very mineral long associated with emotional balance. It is one of the most reached-for stones in seasons of worry and overwhelm, quieting a racing mind and easing the restless energy of stress and change. Traditionally used to support restful sleep and to smooth life's difficult transitions, it wraps you in a soft, lavender hush.",
    work: "Slip it under your pillow for peaceful sleep, or hold it when anxiety rises and breathe slowly until the tension begins to soften.",
    affirm: "I am calm, balanced, and at peace with change.",
    deep: { origin: "Lepidolite is a lithium-rich mica — a potassium-lithium-aluminium silicate — and its soft lilac-to-violet colour comes from traces of manganese within that lithium-bearing structure. It grows in granite pegmatites, the coarse veins where slow-cooling, mineral-rich melt forms large crystals, and it is very often found alongside pink tourmaline, whose blades it sometimes encloses. An important ore of lithium, it takes its name from the Greek 'lepidos,' meaning scale, for the way it splits into glittering, flexible flakes; fine material comes from Minas Gerais in Brazil, California, Madagascar, the Czech Republic and the Ural Mountains.", lore: "Lepidolite has little ancient folklore, and its reputation is very much a modern one grounded in real chemistry: it was among the first minerals from which lithium was drawn after that element's isolation in the early nineteenth century. Because lithium later became one of the best-known mineral stabilisers of mood, the stone's fame as the great soother is a genuine echo of the metal it carries rather than an inherited myth. It is refreshingly honest to say that this crystal earned its calming name through its lithium content, not through the lapidaries of old.", mind: "This is one of the most reached-for stones in seasons of worry, grief and overwhelm — valued for quieting a racing mind, loosening the grip of stress, and gently lifting a heavy mood. It is worked with to cool obsessive thoughts, calm panic, and restore emotional balance when change feels like too much to hold. Many keep it by the bed or in a pocket as a soft, steadying presence to return to whenever the day turns turbulent.", spirit: "Opening the Third Eye and Crown chakras, lepidolite is used to still mental chatter so that deeper insight and restful meditation can rise. It is thought to smooth energetic transitions — helping the spirit release old patterns and move through change without resistance — and to clear emotional and electromagnetic 'static' from one's field. Its lavender energy is felt as a hush, a settling of the whole system toward peace.", body: "Folk and crystal tradition associate lepidolite with restful sleep and with easing the physical toll of stress — it was reached for to quiet a tense, wakeful body and to soothe frayed nerves. Some also link it to relieving the tension held in the head, jaw and shoulders. These are traditional associations only, never a medical claim, and it is no replacement for proper rest or care.", care: "Lepidolite is soft and layered at just 2.5 to 3 on the Mohs scale, so it flakes and scratches easily and must be handled with a gentle hand. It tolerates only the briefest contact with water — never soak it, and keep it from salt water, as moisture can seep between its mica sheets and split them apart over time. Cleanse it with smoke, sound or moonlight, and recharge it beneath the moon or on a bed of clear quartz or selenite rather than in water or strong sun." } },
  { name: "Malachite", colour: "Banded green", hex: "#127c5a", chakra: "Heart", element: "Earth", zodiac: "Scorpio, Capricorn", pair: "639 Hz",
    keywords: ["Transformation", "Protection", "Heart", "Healing", "Courage", "Release", "Abundance"],
    use: "Stone of transformation — clears the heart and protects through change.",
    meaning: "Malachite is the stone of transformation — a deep green guardian banded with rings like the growth of a living thing. It draws out what no longer serves, clearing old patterns and stagnant emotion from the heart so that genuine change can take root, and it has long been worn as a protective talisman against negativity. Bold and encouraging, it supports emotional healing and the courage to step into something new.",
    work: "Place a polished piece over the heart during reflection, or keep it close through a season of change; cleanse it often, as it draws in a great deal of energy.",
    affirm: "I welcome transformation and open my heart to what is next.",
    deep: { origin: "Malachite is a copper carbonate hydroxide, a secondary mineral that forms where copper ores weather and their dissolved copper reacts with carbonate-rich water in the oxidation zones above the deposit. It builds up in rounded, botryoidal masses and concentric layers, which when cut reveal its signature banded rings of light and deep green; it frequently grows beside its blue cousin azurite. Historic sources include the Ural Mountains of Russia, which yielded masses large enough to veneer whole rooms and columns, while the great modern source is the copper belt of the Democratic Republic of Congo, with fine material also from Zambia, Namibia and Arizona.", lore: "Malachite has been mined and treasured for millennia: the ancient Egyptians ground it into the green eye-paint sacred to the goddess Hathor, herself called the Lady of Malachite, and used it as a pigment and a protective amulet. Its name comes from the Greek — either 'malache,' the mallow plant, for its leaf-green colour, or 'malakos,' meaning soft. Across the ancient and medieval world it was worn to guard children and travellers from danger and the evil eye, and it was long believed to warn its wearer of coming harm by breaking apart.", mind: "Bold and encouraging, malachite is worked with to draw out and clear away what no longer serves — buried grief, old trauma, stagnant emotion — so that genuine change can take root in the heart. It is reached for when courage is needed to break a stubborn pattern or step into something new, and to face and release feelings that have long been avoided. Because it stirs things up in order to heal them, it is regarded as a powerful but sometimes intense companion for deep emotional work.", spirit: "A Heart-chakra stone through and through, malachite is used to cleanse and activate the heart centre, clearing energetic blockages and absorbing negativity from the aura and the surrounding space. It has been carried as a protective talisman since antiquity, thought to shield against negative energy and to guard those who wear it. Energy workers treat it as a transformer stone — one that pulls out density and old imprints so the spirit can move forward unburdened.", body: "In folk and crystal tradition malachite is associated with the heart in a bodily sense and with easing cramps, tension and the discomforts of change; older practice reached for it as a general guardian of wellbeing. These are traditional associations only and never a medical claim. It is important to know that malachite contains copper and its dust is genuinely toxic, so it should be admired as a polished, sealed stone, kept from the mouth, and never made into a water elixir by direct immersion.", care: "This is the one stone to keep well away from water and salt: as a soft copper carbonate at only 3.5 to 4 on the Mohs scale, it can be etched, dulled and chemically degraded by moisture, and the runoff is toxic — so never soak it or make direct gem water with it. It scratches easily and dislikes heat and harsh sunlight as well. Cleanse it by dry means only — smoke, sound, or a night resting on selenite, hematite or clear quartz — which refreshes it safely without ever touching liquid." } },
  { name: "Moldavite", colour: "Forest green", hex: "#4d6b34", chakra: "Heart, Third Eye & Crown", element: "Storm", zodiac: "All Signs", pair: "963 Hz",
    keywords: ["Transformation", "Spiritual Awakening", "Ascension", "Heart Opening", "Rapid Change", "Cosmic Connection", "Manifestation"],
    use: "Meteorite-born green tektite — the great catalyst of rapid spiritual transformation.",
    meaning: "Moldavite was forged some fifteen million years ago, when a great meteorite struck what is now the Czech countryside and fused earthly rock with cosmic fire into a translucent green glass found nowhere else on Earth. It is a tektite — a stone of the stars married to the ground — and it carries one of the most intense, unmistakable frequencies in the mineral kingdom; many feel its heat rise in the hand at first touch, the famous 'moldavite flush.' Prized above almost every other stone for accelerating spiritual evolution, it dissolves what no longer serves and draws your life swiftly, sometimes startlingly, toward its highest path. This is not a gentle stone: it opens the heart to the cosmos and asks you to grow, ready or not — so work with it in short, intentional sessions, and keep a grounding stone close.",
    work: "Wear or hold it briefly at first, with Black Tourmaline or Hematite nearby to stay grounded, and set one clear intention — Moldavite amplifies and hastens whatever you point it toward.",
    affirm: "I welcome swift transformation and rise to meet my highest path.",
    deep: { origin: "Moldavite is not, strictly speaking, a crystal at all but a natural glass — a tektite, amorphous and without any lattice, born of catastrophe rather than slow mineral growth. Some fifteen million years ago a giant meteorite slammed into what is now southern Germany, gouging out the Nördlinger Ries crater and flinging molten, silica-rich terrestrial rock high into the atmosphere, which cooled and rained down across Bohemia and Moravia in the modern Czech Republic. It is found in a single strewn field near the Vltava (Moldau) river that gives it its name, and genuine moldavite occurs nowhere else on Earth — a mossy, bottle-green glass often etched with the wormy, sculpted texture of its fiery fall. Because the world's supply comes from that one small region and mining is increasingly restricted, real specimens are both scarce and heavily counterfeited.", lore: "Moldavite has been prized far longer than the modern crystal movement suggests: Stone Age peoples of central Europe chipped it into amulets and small tools, and pieces have turned up near Palaeolithic sites alongside the famed Venus figurines. In folklore it became entwined with the legend of the Holy Grail, imagined by some medieval storytellers as a green stone fallen from the heavens — from Lucifer's crown, in one telling — which lends the tektite an enduring 'stone of the Grail' mystique. In the nineteenth century polished moldavite was set into jewellery and given as betrothal gifts, and it drew crowds at the 1900 Paris World's Fair. Its towering reputation as an accelerator of spiritual evolution, in honesty, is largely a product of the late-twentieth-century metaphysical revival rather than the ancient record.", mind: "Moldavite is worked with as a catalyst for deep and sometimes uncomfortable change — the stone many reach for when they sense they have outgrown a job, a relationship, or an old version of themselves but cannot quite let go. Tradition holds that it brings buried patterns swiftly to the surface so they can be released, which is why sensitive people so often describe a rush of heat, lightheadedness, or the famous flushing warmth on first contact. It is treasured for cutting through stagnation and inertia, but it asks for honesty and readiness, so most keepers work with it in short, deliberate sessions rather than wearing it around the clock.", spirit: "Energetically moldavite is associated above all with the heart, third eye, and crown, and with the rare quality of activating all three at once — opening the heart to the cosmos while lifting awareness toward higher guidance. It carries what practitioners call a 'star' or extraterrestrial frequency, and is used to strengthen connection to guides, to quicken meditation, and to draw a life rapidly toward its highest path. Because it opens so forcefully upward, seasoned users almost always pair it with a grounding stone such as black tourmaline, smoky quartz, or hematite to stay tethered to the body and the earth.", body: "In the crystal tradition moldavite is associated most of all with a felt physical response unlike almost any other stone — the warmth or tingling 'moldavite flush' that spreads through the hand and body, taken as a sign of energy moving. Folk practice has kept it as a talisman of vitality and renewal and as a companion through periods of profound change, always as an energetic support rather than a remedy. None of this is medicine, and moldavite is a stone to be enjoyed alongside, never in place of, proper care.", care: "As a glass of moderate hardness (roughly 5.5 to 6.5 on the Mohs scale) moldavite is safe in water but scratches easily, so keep it away from harder stones and never scrub it with abrasive salt. It does not fade, and many keepers feel it barely needs cleansing, but it responds beautifully to a gentle rinse under running water, a pass through sage or palo santo smoke, or a night resting on selenite. To recharge it, set it out under moonlight or, most fittingly, beneath a clear night sky full of stars — returning this fallen fragment of the cosmos to the light it came from." } },
  { name: "Moonstone", colour: "Pearly white with blue sheen", hex: "#dde5ec", chakra: "Crown & Sacral", element: "Water", zodiac: "Cancer, Libra", pair: "963 Hz",
    keywords: ["Intuition", "New Beginnings", "Feminine Energy", "Calm", "Balance", "Fertility"],
    use: "Softens new beginnings and attunes you to your natural cycles.",
    meaning: "Moonstone is the stone of the inner tides — a milky gem lit from within by a soft blue glow, long held as a fragment of moonlight and a talisman of the divine feminine. It is traditionally used to steady the emotions through change, welcome fresh starts, and reconnect you to the natural rhythms of waxing and waning that the busy world asks you to ignore. Gentle and nurturing, it invites intuition to rise like the tide, in its own time and without force.",
    work: "Wear it or keep it close through any beginning or ending, and hold it under the light of a full moon to cleanse and renew its glow.",
    affirm: "I move with my own rhythm and trust what is unfolding.",
    deep: { origin: "Moonstone is a gem variety of feldspar — most classically orthoclase, a potassium feldspar — and its dreamy inner glow is a genuine optical effect called adularescence. As the mineral cooled it separated into microscopically thin, alternating layers of orthoclase and albite, and light striking those layers scatters into the soft, floating blue-to-white sheen that seems to drift beneath the surface as you tilt the stone. (What is sold as 'rainbow moonstone,' worth noting, is usually white labradorite, a related plagioclase feldspar.) The finest blue-sheen material has long come from Sri Lanka, with important sources also in India, Myanmar, Madagascar, Tanzania, Brazil, and the United States.", lore: "The Romans genuinely believed moonstone was frozen moonlight and linked it to their lunar goddesses, while in India it has been revered for millennia as a sacred stone — chandrakanta, 'beloved of the moon' — tied to the moon god Chandra and considered a fortunate gift between lovers. Across many cultures it was carried as a traveller's talisman, thought to protect those journeying by night. It saw a great revival in the Art Nouveau era, when jewellers such as René Lalique set its lunar shimmer into flowing, naturalistic designs, and it endures today as a birthstone of June.", mind: "Moonstone is the gentle steadier of the emotions, traditionally worked with to smooth the turbulence of change and to soften mood swings, over-reaction, and emotional overwhelm. It is the classic stone of new beginnings — kept close at the start of a venture, a chapter, or a season of life — and it is said to reconnect us to our own natural rhythms of rising and receding when the busy world demands constant output. Nurturing rather than forceful, it invites intuition and feeling to surface in their own time and without pressure.", spirit: "Energetically moonstone bridges the crown and the sacral chakras, joining higher awareness to the creative, feeling centre of the body, and it is perhaps the pre-eminent stone of the divine feminine and the lunar mysteries. It is used to open and refine intuition, to enrich dreamwork and psychic receptivity, and to align the keeper with the waxing and waning cycles of the moon — many charge it and set intentions with it across a full lunar month. It carries a soft, tidal, yin energy that draws inward and reflects gently back.", body: "In folk and crystal tradition moonstone is associated above all with the feminine cycles and rhythms of the body — kept close to honour menstruation, fertility, pregnancy, and the great hormonal tides — earning it old names such as the 'woman's stone.' It has also long been carried as a companion for restful sleep and vivid, meaningful dreams. These are gentle traditional associations rather than treatments, and moonstone is a comfort to hold alongside, never instead of, real medical care.", care: "Moonstone is a feldspar of moderate hardness (about 6 to 6.5) with pronounced cleavage, which makes it somewhat brittle and prone to chipping if knocked, so handle it with a little tenderness. It can tolerate a brief, cool rinse but should not be soaked for long or exposed to heat, harsh chemicals, or ultrasonic cleaners, any of which can dull its sheen or encourage internal fracturing. Its truest cleansing and charging, fittingly, is by moonlight — leave it out overnight beneath a full moon to drink in the light it is named for, or rest it on selenite or in the smoke of sage or palo santo." } },
  { name: "Onyx", colour: "Deep black", hex: "#1e1c1c", chakra: "Root", element: "Earth", zodiac: "Leo, Capricorn", pair: "396 Hz",
    keywords: ["Protection", "Grounding", "Strength", "Willpower", "Self-Discipline", "Root", "Focus"],
    use: "Grounds, protects, and lends steady strength through the hardest seasons.",
    meaning: "Onyx is the stone of quiet strength — a deep, glossy black crystal that has guarded and steadied its keepers since ancient times. It absorbs and transforms heavy energy, anchoring you firmly to the earth and lending the stamina to hold your ground through grief, stress and demanding times. Traditionally worn for self-mastery and protection, it helps you become the calm, unshakeable centre of your own life.",
    work: "Carry onyx or wear it as a ring or pendant when you need grounding and protection, or hold it through a difficult stretch to steady your resolve and reclaim your power.",
    affirm: "I am grounded, protected, and steady in my own strength.",
    deep: { origin: "Onyx is a variety of chalcedony — the compact, microcrystalline form of quartz — distinguished specifically by its straight, parallel bands, as opposed to the curved banding of agate or the brown-and-white layering of its cousin sardonyx. It forms slowly as silica-rich waters seep into cavities and gas pockets within volcanic rock, laying down fine layer upon fine layer over long spans of time. It is worth knowing that the uniform jet-black 'onyx' most commonly sold is usually grey chalcedony dyed and heat-treated to an even black — a practice so old it reaches back to Roman times — since naturally solid-black onyx is relatively uncommon. Notable material comes from Brazil, India, Madagascar, Uruguay, and the United States.", lore: "The name comes from the Greek onyx, meaning 'fingernail' or 'claw,' preserved in a charming myth in which Cupid trimmed the sleeping Venus's nails and the parings, scattered on the earth, turned to stone. It was a favourite of ancient carvers, worked into the layered cameos and seal-intaglios of Greece and Rome and prized in Egypt as well. Medieval lapidaries gave it a distinctly mixed reputation — some warned that onyx stirred up discord, sorrow, and troubling dreams, while others valued it for protection and steadiness — and by the Victorian era its sombre black had made it the stone of mourning jewellery and rosary beads.", mind: "Onyx is the stone of quiet, enduring strength, worked with for stamina and self-discipline when life asks you to hold your ground through grief, stress, or a long and demanding season. It is traditionally used to steady runaway emotions and to foster self-mastery — the calm, unshakeable centre — helping the keeper contain and process heavy feelings rather than be swept away by them. Many turn to it for focus and follow-through, keeping it close during difficult decisions or when real discipline is needed to see something through.", spirit: "Energetically onyx is firmly a root-chakra stone, anchoring and grounding the keeper into the body and the earth, which is why it feels so stabilising in chaotic times. It is one of the classic protective stones, said to absorb and transform dense or hostile energy and to shield against negativity, and it has long been used to guard personal boundaries and hold a steady field around its keeper. It also carries an old reputation as a stone of memory, thought to retain the record of its wearer's experiences.", body: "Folk and crystal tradition associate onyx with physical stamina, strength, and endurance — the reserves needed to keep going — and with a grounding steadiness through times of exhaustion and grief. Older traditions also linked it to the bones, teeth, and feet, the body's own structures of support. These associations belong to tradition and lore alone; onyx is a steadying companion to hold, never a substitute for proper medical care.", care: "As a quartz-family stone onyx is a durable 7 on the Mohs scale and safe to cleanse under running water, and its black colour will not fade in light. It responds well to smoke cleansing with sage or palo santo, to sound, and especially to being rested on or briefly buried in the earth, which suits its grounding nature. One gentle caution: because most commercial black onyx is dyed, avoid prolonged soaks in salt water, which can over time work at the dye — a quick rinse and a night on selenite or in moonlight will keep it clear and charged." } },
  { name: "Opal", colour: "Iridescent white", hex: "#d6e7e5", chakra: "Crown & Heart", element: "Water", zodiac: "Libra, Cancer", pair: "963 Hz",
    keywords: ["Inspiration", "Creativity", "Emotional Healing", "Love", "Amplification", "Passion", "Intuition"],
    use: "Amplifies emotion, sparks creativity, and mirrors the soul's inner fire.",
    meaning: "Opal is the rainbow held in stone — a milky, water-born gem alive with dancing flashes of colour, long treasured as the crystal of inspiration and imagination. An emotional amplifier, it magnifies whatever you carry and reflects it gently back, making feelings easier to see, honour and release while it kindles creativity, spontaneity and passion. Once called the Queen of Gems for holding the virtue of every coloured stone at once, it invites you to feel deeply and create freely.",
    work: "Wear or hold opal when you want to spark creativity or move stuck emotion, working with it from a calm, grounded place since it magnifies whatever you bring to it.",
    affirm: "I let my emotions flow freely and my imagination take flight.",
    deep: { origin: "Opal is one of the great exceptions in the crystal world — not a crystal at all, but a hydrated amorphous silica that holds anywhere from three to twenty-one percent water within its structure. Precious opal's famous play-of-colour arises from a microscopic, orderly stacking of silica spheres that diffracts light into shifting flashes of spectral fire, while 'common' opal lacks that ordered array and so glows without the rainbow. It forms at low temperatures as silica-rich water seeps into cracks and cavities in weathered rock and slowly sets into a gel. Australia yields the great majority of the world's precious opal — Coober Pedy, Andamooka, and the black opal of Lightning Ridge — with Ethiopia's Welo highlands, Mexico's fire opal, Brazil, and Nevada rounding out the notable sources.", lore: "The Romans adored opal, calling it opalus and, in Pliny's telling, a stone that gathered the beauty of every other gem into one; it stood as a symbol of hope and purity and ranked among the most valued of all stones in antiquity. The Greeks believed it granted the gift of prophecy and protection from disease. Its unlucky reputation is a genuine historical accident, largely traceable to Sir Walter Scott's 1829 novel Anne of Geierstein, whose readers wrongly took a bewitched opal in the plot as proof the gem was cursed — a superstition Queen Victoria did much to dispel, wearing opals proudly and championing the young Australian mines. Shakespeare's Twelfth Night calls it the queen of gems, and it remains the birthstone of October.", mind: "Opal is best understood as an emotional amplifier: it is traditionally said to magnify whatever the keeper already carries and to reflect those feelings gently back, making them easier to see, to honour, and to release. Because of this mirroring quality it is worked with for emotional honesty and for kindling creativity, spontaneity, and passion — a stone for those wishing to feel more deeply and create more freely. It is often recommended for seasons of self-exploration, when bringing hidden feelings into the light is exactly the work at hand.", spirit: "Energetically opal is linked to the crown and the heart, joining higher inspiration to the feeling centre, and it carries an old association with the eyes and with clear inner vision. It is used to spark imagination and artistic flow, to enhance intuition and, in some traditions, prophecy, and — holding every colour at once — to gently touch and balance the whole spectrum of the chakras. Its watery, receptive nature makes it a stone of dreaming and of amplified intention, so many keepers hold their aims clear and kind while working with it.", body: "In folk and crystal tradition opal, a water-born stone, is associated with the body's own waters and with the eyes — the Greeks in particular treasured it for sight — and it has been kept as a talisman of vitality and emotional balance. Its element is water, and lore connects it with hydration, flow, and renewal. These are traditional associations only; opal is a beautiful companion to hold, never a remedy or a replacement for medical care.", care: "Opal asks for more care than almost any stone in the cabinet, precisely because it holds water: never cleanse it in salt water, and never leave it baking in the sun or beside a heat source, as drying out can cause it to craze and crack. Ethiopian 'hydrophane' opal is especially thirsty and will drink up water — even brief soaking can temporarily cloud its play-of-colour — so keep it away from prolonged wetting, oils, and perfume. Cleanse it gently instead with moonlight, sound, or a soft dry cloth, charge it under the moon rather than the sun, and, being soft (about 5.5 to 6.5 on the Mohs scale), store it apart from harder gems so nothing can scratch it." } },
  { name: "Peridot", colour: "Olive green", hex: "#a4c73c", chakra: "Heart & Solar Plexus", element: "Fire", zodiac: "Leo, Virgo", pair: "639 Hz",
    keywords: ["Abundance", "Prosperity", "Renewal", "Heart", "Confidence", "Release", "Joy"],
    use: "Draws abundance, renews the heart, and lifts the spirit's light.",
    meaning: "Peridot is the sun's own gem — a bright olive-green crystal born of volcanic fire and, remarkably, sometimes of meteorites, carrying the warm and generous energy of light itself. It is the classic stone of abundance and renewal, gently clearing envy, resentment and the old stories we tell ourselves about lack, and opening the heart to receive good fortune. Worn since ancient times as a talisman against fear and a magnet for prosperity, it quietly reminds you that you are allowed to flourish.",
    work: "Carry or wear peridot when you're calling in abundance or a fresh start, or rest it over the heart to release an old grudge and make room for new growth.",
    affirm: "I open my heart to abundance and welcome my own renewal.",
    deep: { origin: "Peridot is the gem-quality form of olivine, a magnesium-iron silicate, and it is one of the few gems coloured by its own essential chemistry rather than by trace impurities — the iron woven into its structure is the very source of that bright olive-to-lime green. Unusually, it is born deep in the earth's mantle and carried upward by basaltic volcanism, which is why it turns up in lava flows and in nodules of green peridotite; more remarkably still, olivine has been found in pallasite meteorites, making peridot one of the very few gems to fall from space as well as rise from the deep. The historic source is Zabargad (St John's) Island in Egypt's Red Sea, with today's finest stones coming from Myanmar, Pakistan, China, Hawaii, and the San Carlos Apache lands of Arizona.", lore: "The ancient Egyptians mined peridot on the remote, snake-guarded island of Zabargad more than three thousand years ago and called it the 'gem of the sun,' and there is a real case that some of Cleopatra's celebrated 'emeralds' were in fact peridot. Crusaders carried it back to Europe where, frequently mistaken for emerald, it adorned church treasures — the great green gems on the Shrine of the Three Kings in Cologne Cathedral, long thought emeralds, are genuinely peridot. Across the ancient and medieval world it was believed to banish night terrors and drive off evil spirits, an effect said to be strongest when the stone was set in gold. It endures as the birthstone of August.", mind: "Peridot is the classic stone of abundance and emotional renewal, traditionally worked with to clear away the corrosive feelings of envy, jealousy, resentment, and spite — both those we receive and those we harbour. It is used to release the old, tired stories of lack and unworthiness that keep good fortune at arm's length, and to open the heart to receiving. Warm and encouraging in nature, it is the gentle reminder that you are allowed to flourish, to prosper, and to accept good things without guilt.", spirit: "Energetically peridot works across the heart and the solar plexus, uniting the capacity to love and receive with personal will and confidence, which is why it feels at once tender and empowering. It carries the generous, life-giving frequency of sunlight, and is used to cleanse the energetic body of stagnation and negativity and to draw prosperity and renewal. As a stone of the sun and of light itself, it is turned to for fresh starts and for lifting the spirit up out of gloom.", body: "Long before modern gemmology, folk practice reached for peridot — the green stone of the sun — to soothe the digestion and the liver, and it was traditionally associated with cleansing, detoxification, and renewed vitality. Ancient wearers also kept it as a guard against fear and night terrors, believing it brought restful, untroubled sleep. All of this belongs to tradition and lore; peridot is a warming companion to hold, never a treatment or a substitute for proper care.", care: "Peridot is a moderately hard stone (about 6.5 to 7 on the Mohs scale), but it has a real sensitivity to acids and to sudden changes in temperature, both of which can etch or fracture it, so keep it well away from vinegar, harsh cleaners, and ultrasonic machines. A brief rinse under cool running water is safe and welcome, followed by a soft cloth. Being the sun's own gem, it is one of the stones that genuinely loves the light: cleanse and recharge it in gentle early-morning sunlight or under the moon, and rest it on selenite between wearings to keep its bright energy clear." } },
  { name: "Prehnite", colour: "Pale apple green", hex: "#b3cc84", chakra: "Heart & Solar Plexus", element: "Earth & Water", zodiac: "Libra, Virgo", pair: "639 Hz",
    keywords: ["Unconditional Love", "Healing", "Peace", "Intuition", "Calm", "Heart", "Growth"],
    use: "Refills the giving heart, calms worry, and deepens intuitive trust.",
    meaning: "Prehnite is the stone that heals the healer — a soft, luminous green crystal that renews the caregiver's own well of energy. It marries the heart and the will, easing worry and letting unconditional love flow without depleting you, and is long valued for calming a restless mind into trusting peace. Known too as a stone of prophecy, it sharpens intuition and helps you feel always prepared, never caught off guard.",
    work: "Place Prehnite on the heart to release stored stress, or keep it in your workspace to stay calm, prepared, and open-hearted through a full day.",
    affirm: "My heart is replenished, and I give and receive love with ease.",
    deep: { origin: "Prehnite is a calcium-aluminium phyllosilicate, Ca2Al2Si3O10(OH)2, that grows inside the gas cavities and veins of volcanic rock such as basalt and dolerite, typically as botryoidal, grape-like crusts of soft translucent green to yellow-green, its colour owed to traces of iron. It keeps good company underground, forming alongside zeolites, calcite, datolite and slender epidote needles; the celebrated 'grape' specimens shot through with dark epidote come from Mali, while classic material is drawn from the Cape region of South Africa, the traprock quarries of New Jersey and Connecticut, and localities in Australia, Scotland and France. It also holds a quiet footnote in mineral history as the first mineral ever named for a person — Colonel Hendrik von Prehn, who carried it back from the Cape in the 1780s.", lore: "An honest collector should know that because prehnite was only identified and named in the late eighteenth century, it carries none of the ancient Greek, Vedic or Egyptian pedigree of older stones — its reputation as a 'stone of prophecy' belongs to modern metaphysical tradition rather than the classical lapidaries. In that newer lore it became a favourite of healers and diviners, described as a stone worked by seers to sharpen premonition and 'always be prepared,' and it is widely linked today to the Archangel Raphael, patron of healing. Its gentle name and gentler colour have together made it, in contemporary practice, the archetypal stone for those who spend themselves tending others.", mind: "Prehnite is the balm reached for by the over-giver and the chronic worrier, said to quiet a mind that will not stop rehearsing what might go wrong. Emotionally it is worked with to renew the caregiver's own depleted well, so that unconditional love can flow outward without draining the one who offers it. Where the thoughts race, it is turned to for a settling, trusting kind of peace — the felt sense that you are ready for whatever comes, and need not brace against it.", spirit: "As a bridge between the heart and the solar plexus, prehnite is used to marry love with will, so that compassion is backed by steady personal power rather than self-sacrifice. In energetic work it is prized for clearing and calming both centres at once, dissolving the clutter that muddies intuition and letting inner knowing rise clean and clear. Many keep it as a stone of preparedness and prophecy, holding it in meditation to open the third eye gently while keeping the practitioner grounded and unafraid.", body: "Folk and crystal tradition, drawing on prehnite's watery, cooling green, has long associated it with the body's fluid systems — the kidneys and bladder — and with soothing frayed, overwrought nervous energy. Practitioners have also traditionally linked it to the thymus and to a general sense of renewed vitality after a long stretch of caring for others. These are associations of tradition and folk practice only, never medical claims, and they are no substitute for proper care from a qualified professional.", care: "With a hardness of about 6 to 6.5, prehnite tolerates a brief rinse under cool running water, but it should never be left to soak. Its translucent green can slowly pale under prolonged, strong sunlight, so recharge it instead in soft morning light or overnight moonlight. Cleanse it with the smoke of sage or palo santo or with sound, and honour its Earth-and-Water nature by resting it on soil or nestling it among houseplants to renew its gentle green glow." } },
  { name: "Pyrite", colour: "Metallic gold", hex: "#c4a24a", chakra: "Solar Plexus", element: "Earth", zodiac: "Leo", pair: "528 Hz",
    keywords: ["Abundance", "Prosperity", "Protection", "Confidence", "Manifestation", "Solar Plexus"],
    use: "Draws abundance and shields while boosting confidence.",
    meaning: "Pyrite — 'fool's gold' — is anything but foolish; it is the stone of abundance, confidence, and shielded ambition. Its bright metallic gleam is said to draw prosperity and opportunity while forming a protective mirror that deflects negativity and doubt. A stone of the doer, it kindles willpower and self-worth, helping you back your ideas with grounded, take-action confidence.",
    work: "Keep a piece in your workspace, wallet, or wealth corner, and hold it for a jolt of confidence before you act.",
    affirm: "I am worthy of abundance, and I act with confidence.",
    deep: { origin: "Pyrite is iron sulfide, FeS2, crystallising in the cubic system into some of the most geometrically perfect natural forms in all of mineralogy — sharp brass-yellow cubes, twelve-sided pyritohedrons and octahedrons with a bright metallic lustre that earned it the nickname 'fool's gold.' It forms across an extraordinary range of settings: in hydrothermal veins, as concretions and framboids in shale and coal, and in metamorphic rock, with the world's most flawless cubes coming from the marl beds of Navajún in La Rioja, Spain, and superb material from Peru, Italy's Elba, and the coal measures of Illinois that yield flat 'pyrite suns.' Despite its gleam it is genuinely a crystal, though its resemblance to gold has fooled prospectors for centuries — real gold is soft, heavy and non-crystalline in habit, while pyrite is hard, brittle and sparks when struck.", lore: "Pyrite takes its name from the Greek pyr, 'fire,' because it throws sparks when struck against steel or flint, and it served humankind as a fire-starter long before matches, later igniting the powder in wheel-lock firearms. Across Mesoamerica the Maya and Aztec polished slabs of pyrite into mirrors used for scrying and adornment, and the Inca prized it similarly, while in the wider world it became a workhorse ore mined for the sulfur used to make sulfuric acid. Its association with prosperity is old and intuitive — a stone that looks like gold has always been treated as a talisman for wealth and the courage to pursue it.", mind: "Pyrite is the stone of the doer, worked with to kindle willpower, self-worth and the nerve to back your own ideas and act on them. It is turned to when confidence flags or doubt creeps in, said to burn off passivity and remind you of your own capability and drive. For anyone talking themselves out of an ambition, it is the grounded, take-action spark that says begin.", spirit: "Seated firmly at the solar plexus, the seat of personal power, pyrite is used to strengthen the will and to draw prosperity and opportunity toward the one who carries it. Its bright metallic face is regarded as a mirror-shield, deflecting negativity, criticism and draining influences back away from you while you stay steady in your purpose. It is a distinctly Earth-element, masculine, active stone — energising rather than soothing — held to fuel ambition that keeps its feet on the ground.", body: "Because it is an iron mineral with a warm golden gleam, folk and crystal tradition have long associated pyrite with vitality, physical stamina and the circulation of the blood, and some older texts reached for it against fatigue and to support the lungs and breath. Practitioners keep it as a stone of robust, energised well-being and endurance. These are traditional associations only, never medical claims or a cure, and no crystal is a substitute for care from a qualified professional.", care: "This is the one warning that matters most for pyrite: keep it dry. As an iron sulfide it oxidises in moisture and humidity — a slow decay that rusts the surface, releases a whiff of sulfur and can even shed traces of sulfuric acid — so it must never be washed, soaked, or cleansed in salt water. Cleanse it instead with sage or palo santo smoke, with sound, or on a bed of dry salt, and charge it safely in sunlight, which will not dim its shine; store it away from damp, ideally with a little silica gel, to keep its golden faces bright for years." } },
  { name: "Red Jasper", colour: "Brick red", hex: "#a24632", chakra: "Root", element: "Earth", zodiac: "Aries, Scorpio", pair: "396 Hz",
    keywords: ["Grounding", "Strength", "Endurance", "Vitality", "Courage", "Root"],
    use: "Grounds and steadies you, builds endurance, kindles a slow, warm vitality.",
    meaning: "Red Jasper is the stone of endurance — a warm, earthy red that grounds you firmly and feeds a slow, steady flame of vitality. Often called a nurturing stone, it doesn't flare and fade but builds lasting strength, stamina and courage over time. A dependable anchor, it keeps you calm, determined and rooted through demanding days and long, patient efforts.",
    work: "Carry it through busy or draining days for steady stamina, or hold it at the base of the spine in meditation to feel grounded and secure.",
    affirm: "I am grounded, steady, and strong in body and spirit.",
    deep: { origin: "Red jasper is an opaque, cryptocrystalline variety of quartz — a densely packed chalcedony whose warm brick-to-blood red comes from finely disseminated iron oxides, chiefly hematite, threaded through the silica. It forms where silica-rich fluids permeate and cement sediment, volcanic ash or fractured rock, hardening into a tough, uniform stone that takes a fine polish, and it is found the world over, with abundant material from India, Brazil, Russia, the western United States, Australia and the deserts of Egypt. Being quartz-based it rates a durable 6.5 to 7 on the hardness scale, which is part of why it has been carved and worn since the earliest civilisations.", lore: "Few stones have a longer human record: the ancient Egyptians carved red jasper into the tyet, or 'Knot of Isis,' an amulet placed at the throat of the dead and invoked in the Book of the Dead as the blood of Isis to guard the soul on its journey. The Greeks and Romans knew it as iaspis, set it in signet rings and gave warriors jasper for courage in battle, and it appears among the twelve stones of the high priest's breastplate in Hebrew tradition. Across many cultures its earthy red made it a stone of the warrior and the rain-bringer — a genuinely ancient talisman rather than a modern invention.", mind: "Red jasper is the emotional equivalent of ballast, worked with for steadiness, patience and the quiet courage to see a long task through. Rather than a flare of excitement it offers a slow, dependable fortitude, calming anxiety and keeping you determined and level through demanding, drawn-out efforts. It is the stone to hold when you need to stop spiralling and simply keep going.", spirit: "Anchored at the root chakra, red jasper is the classic grounding stone, drawing scattered energy down into the body and tying you firmly to the earth beneath you. Energetically it is used to build endurance and to feed a slow, steady inner flame rather than a quick burst, making it a favourite for stamina, protection and staying rooted. Its Earth element and its ties to Aries and Scorpio mark it as a stone of enduring, embodied strength.", body: "Guided by the old doctrine of signatures, its red hue linked jasper in folk tradition to the blood, to circulation and to physical vitality, and it was long reached for as a nurturing stone to build stamina and sustain the body through hard labour. Crystal practice still keeps it as an anchor of steady physical energy and endurance. These associations belong to tradition and folk practice alone — they are not medical claims, cures, or any replacement for professional care.", care: "Red jasper is wonderfully low-maintenance: at 6.5 to 7 in hardness and coloured by stable iron oxide, it is safe in water, unbothered by salt, and will not fade in sunlight. You can rinse it under running water, leave it in the sun or moon to recharge, or rest it on the earth to renew its grounding charge. Cleanse it however you like — smoke, sound, running water or a night on the soil — and it will keep its warm, dependable glow indefinitely." } },
  { name: "Rhodochrosite", colour: "Rose pink", hex: "#e07a9c", chakra: "Heart", element: "Fire & Water", zodiac: "Scorpio, Leo", pair: "639 Hz",
    keywords: ["Self-Love", "Compassion", "Heart", "Emotional Healing", "Inner Child", "Forgiveness", "Joy"],
    use: "Opens the heart to self-love, joy, and gentle emotional healing.",
    meaning: "Rhodochrosite is the stone of the compassionate heart — a swirl of rose and cream that speaks the language of self-love and tender emotional healing. Traditionally reached for when old wounds ask to be met with kindness, it is beloved as an 'inner-child' stone, gently coaxing joy, playfulness, and warmth back to the surface. It invites you to forgive yourself first, and to let your heart open again without fear.",
    work: "Hold it over the heart during quiet reflection, or carry a tumbled piece through the day when you're learning to be kinder to yourself.",
    affirm: "I love myself fully, and my heart is open to joy.",
    deep: { origin: "Rhodochrosite is manganese carbonate, MnCO3, a trigonal mineral whose rose-pink colour is intrinsic to its chemistry — the manganese itself is what makes it blush. It grows in two very different guises: as banded pink-and-cream stalactitic masses formed in the old silver veins of Argentina's Capillitas mine, giving the swirled 'Inca Rose' cabochons collectors love, and as rare, gemmy scarlet rhombohedra from the Sweet Home Mine near Alma, Colorado, source of the famous 'Alma King,' with further fine material from Peru and the N'Chwaning mines of South Africa. It is a soft carbonate at just 3.5 to 4 on the hardness scale, and like all carbonates it will fizz and etch in contact with acids.", lore: "The banded Argentine stone earned the name Rosa del Inca, or Inca Rose, and a tender legend grew up with it — that these pink veins were the blood of former Inca rulers turned to stone, drawn from mines the Inca themselves once worked for silver. Today it is honoured as a national stone of Argentina. The mineral itself was only formally named in 1813, from the Greek rhodon, 'rose,' and chros, 'colour,' so much of its emotional and 'inner-child' reputation is honestly a twentieth-century flowering of metaphysical practice rather than an ancient inheritance.", mind: "Rhodochrosite is the great stone of self-love, reached for when old emotional wounds ask at last to be met with kindness rather than judgement. It is cherished as an 'inner-child' stone, said to coax joy, playfulness and warmth back to the surface for those who learned to armour their tenderness away. Above all it is worked with for self-forgiveness — the gentle, difficult work of turning compassion first toward yourself so the heart can open again without fear.", spirit: "Rhodochrosite opens and warms the heart chakra, and its Fire-and-Water nature marries emotional feeling with the vitality to actually feel it fully rather than flee it. In energetic work it is used to clear the heart of buried grief and shame, releasing what has calcified there so that spontaneous joy can flow again. It is the tender counterpart to harsher heart-openers — a stone of emotional thaw rather than confrontation.", body: "Following its rose colour and heart association, folk and crystal tradition have long linked rhodochrosite to the circulation, the skin and the soothing of tension held in the body, and some reach for it as comfort during times of emotional exhaustion. It is kept as a stone of gentle, warming vitality. These are associations of tradition and folk practice only — never medical claims, never a cure, and never a substitute for the care of a qualified professional.", care: "Handle rhodochrosite gently, because it is soft and vulnerable: at 3.5 to 4 in hardness it scratches easily, and as a carbonate it should never be soaked, cleaned in salt water, or exposed to anything acidic, all of which will dull or etch its surface. Its pink can also fade under prolonged sunlight, so keep it out of harsh, direct sun and recharge it in soft moonlight instead. Cleanse it with sage or palo santo smoke, with sound, or by resting it overnight on or beside a piece of selenite, and store it away from harder stones that could scratch its tender face." } },
  { name: "Rhodonite", colour: "Rose pink", hex: "#cc6b81", chakra: "Heart", element: "Fire", zodiac: "Taurus", pair: "639 Hz",
    keywords: ["Love", "Forgiveness", "Compassion", "Heart", "Emotional Healing", "Balance"],
    use: "Soothes emotional wounds and nurtures forgiveness and compassion.",
    meaning: "Rhodonite is the compassionate heart-healer — rose-pink laced with black, a stone that holds both love and the grounded strength to move through pain. It is treasured as a 'rescue stone' for the emotions, gently drawing out old hurt, resentment, and grief so forgiveness can take root. Where it soothes, it also steadies, reminding you that a wounded heart can still beat with generosity and love.",
    work: "Hold it over the heart in quiet reflection when old hurts surface, or carry it as you work to forgive yourself or another.",
    affirm: "I release old wounds and open my heart to love.",
    deep: { origin: "Rhodonite is a manganese chain-silicate, (Mn,Fe,Mg,Ca)SiO3, crystallising in the triclinic system, and though it can form rare translucent pink crystals it is best known as a massive rose-pink stone laced with dramatic black veins of manganese oxide. That black tracery, so different from rhodochrosite's soft cream banding, is one of the surest ways to tell the two 'rose stones' apart, along with rhodonite's greater hardness of 5.5 to 6.5 and its silicate — rather than carbonate — chemistry. It forms in manganese-rich metamorphic and hydrothermal deposits, with legendary material from the Ural Mountains of Russia, gem-quality crystals from Broken Hill in Australia, and further sources in Sweden's Långban, Brazil and the United States, where it is the state gem of Massachusetts.", lore: "In Russia rhodonite is called orletz, the 'eagle stone,' from a folk belief that eagles carried small pieces to line their nests — so parents in the Urals would tuck rhodonite into a newborn's cradle to pass on the eagle's strength. The Russian tsars prized it as a decorative stone above almost any other, working it into vast carved vases, columns and even a monumental sarcophagus, and Fabergé set it into his treasures. Named in 1819 from the Greek rhodon, 'rose,' it earns its ancient-feeling reputation more through this rich Russian lapidary tradition than through the classical Mediterranean lapidaries.", mind: "Rhodonite is treasured as a 'rescue stone' for the emotions, the stone to hold in the aftermath of betrayal, loss or heartbreak. It is worked with to draw out old hurt, resentment and grief so that genuine forgiveness — of others and of oneself — can take root where the wound was. Its gift is a double one: even as it soothes raw feeling, its black veining lends the grounded steadiness to move through the pain rather than be swept away by it.", spirit: "Rhodonite works the heart chakra with a distinctly grounded touch, its pink opening compassion while its black manganese threads anchor that love in the body and the earth. Energetically it is used to balance the emotions and to reconcile the pull between love and pain, reminding the wounded heart that it can still beat with generosity. Its Fire element and its tie to steadfast Taurus make it a stone of patient, embodied heart-healing rather than airy sentiment.", body: "Its manganese content and its 'rescue' reputation led folk and crystal tradition to reach for rhodonite as a first-aid comfort stone — traditionally held over bruises, knocks and after physical shock, and associated with the heart and circulation. It is kept as a steadying stone in times of physical as well as emotional strain. These are traditional and folk associations only; they are not medical claims, they cure nothing, and they are no replacement for the care of a qualified professional.", care: "Rhodonite is more robust than its cousin rhodochrosite — at 5.5 to 6.5 in hardness it tolerates a brief rinse under cool running water, though it is wise not to leave it soaking or to use salt water for long. Its colour is fairly stable, but as the pink can slowly darken with air and harsh light over years, keep it out of prolonged intense sunlight and charge it in gentle daylight or moonlight instead. Cleanse it with sage or palo santo smoke, with sound, or overnight beside selenite, and rest it on the earth now and then to renew its grounded, heart-steadying charge." } },
  { name: "Rose Quartz", colour: "Rose pink", hex: "#f2a7bb", chakra: "Heart", element: "Water", zodiac: "Taurus, Libra", pair: "639 Hz",
    keywords: ["Love", "Compassion", "Self-Love", "Forgiveness", "Emotional Healing", "Heart", "Calm"],
    use: "Opens the heart to love, compassion, and gentle self-forgiveness.",
    meaning: "Rose Quartz is the stone of unconditional love — the gentle pink heart-opener that softens hard edges and invites tenderness back in. Traditionally carried to draw in romance, mend old grief, and, above all, to teach kindness toward oneself, it radiates a soothing, motherly warmth that reassures the heart it is safe to feel again. Where other stones sharpen, Rose Quartz simply softens.",
    work: "Wear it over the heart or set a piece by your bed, and hold it close whenever you need reminding that you, too, are worthy of love.",
    affirm: "I am open to love, and I am worthy of it.",
    deep: { origin: "Rose Quartz is the soft pink massive variety of quartz (silicon dioxide, SiO2), and unlike its cousins amethyst and citrine it almost never grows in well-formed points — it occurs as cloudy, anhedral masses filling the cores of granite pegmatites. Its blush was long blamed on traces of titanium or manganese, but modern study shows the color comes from microscopic pink fibrous inclusions of a borosilicate mineral related to dumortierite scattered through the stone, which is also why it glows milky rather than glass-clear. The finest material comes from the pegmatites of Minas Gerais in Brazil, with important sources in Madagascar, the Black Hills of South Dakota, and India. The rare, transparent, well-crystallised 'pink quartz' from a few Brazilian localities is a different, more light-sensitive stone, colored by phosphate and natural irradiation.", lore: "The Greeks and Romans wove Rose Quartz into the myth of Aphrodite and her mortal lover Adonis — one telling says the goddess cut herself on a briar as she rushed to him, and their mingled blood stained a white quartz pink, sealing it forever as love's stone. Egyptian and Roman women are recorded grinding it into face masks and unguents believed to clear the complexion and hold back age, and worked rose quartz beads from Mesopotamia are among the oldest known, some dated to around 7000 BC. Much of its romantic reputation, though, is a genuinely modern flowering — the 'unconditional love' language belongs to twentieth-century crystal work rather than the ancient lapidaries.", mind: "This is the great heart-softener, the stone tradition reaches for after loss, heartbreak, or a long season of being hard on oneself. It is worked with to melt resentment and old grief, to reopen the capacity to trust, and above all to turn some of that tenderness inward — self-forgiveness and self-worth are its real specialty, before any question of romance. Where sharper stones push and clarify, Rose Quartz simply reassures the heart that it is safe to feel again.", spirit: "Rose Quartz is the classic Heart chakra (Anahata) stone, its gentle pink frequency used to clear and open the heart center and restore emotional circulation after it has been walled off. In energy work it is called the stone of unconditional love, carried to raise the atmosphere of a room to warmth and acceptance, to draw in kindred and romantic connection, and to keep the heart open rather than defended. It pairs naturally with the Water element — flowing, receptive, motherly — and suits the Venus-ruled tenderness of Taurus and Libra.", body: "Folk and crystal tradition have long associated Rose Quartz with matters of the physical heart and circulation, and it was traditionally laid over the chest to soothe. In women's folk practice it is linked to fertility, pregnancy, and the postpartum heart, and it is a darling of the 'beauty' tradition, reached for to calm and comfort the complexion much as the Roman women believed. These are gentle, symbolic folk associations cherished for comfort — not remedies, and never a substitute for real medical care.", care: "Rose Quartz genuinely fades — its soft pink washes toward grey-white under prolonged sunlight, so charge it in gentle moonlight or the first hour of dawn rather than on a sunny windowsill. It is durable and water-safe: rinse it under cool running water or cleanse it in a stream, and it also responds beautifully to smoke (sage, palo santo) or a night resting on selenite or a bed of clear quartz. To recharge its loving intent, many keepers simply hold it to the heart and breathe." } },
  { name: "Selenite", colour: "Pearly white", hex: "#f0eee6", chakra: "Crown", element: "Air", zodiac: "Taurus, Cancer", pair: "963 Hz",
    keywords: ["Cleansing", "Clarity", "Peace", "Protection", "Spiritual Connection", "Crown"],
    use: "Cleanses energy, clears the mind, and opens a channel to higher guidance.",
    meaning: "Selenite is liquid moonlight in stone — a high, luminous crystal of cleansing, clarity, and connection to the higher realms. Named for Selene, the moon goddess, it sweeps stagnant energy from a space and from other stones, restoring a sense of peace and quiet spaciousness wherever it rests. Working with it feels like opening a window in a stuffy room: the air clears, the mind stills, and light pours back in.",
    work: "Lay a wand across your other crystals to cleanse and recharge them, or sweep it slowly around your body to clear your energy field — keep it dry, as Selenite is soft and dissolves in water.",
    affirm: "I am clear, cleansed, and connected to the light.",
    deep: { origin: "Despite the crystalline glow, Selenite is not a quartz at all but the clear, well-crystallised variety of gypsum — hydrous calcium sulfate, CaSO4·2H2O — a strikingly soft mineral you can scratch with a fingernail (Mohs 2). It grows wherever mineral-rich saline water evaporates, the dissolved sulfate crystallising slowly into glassy blades, 'desert rose' rosettes, and, most spectacularly, the translucent beams up to eleven metres long in the Cave of Crystals at Naica, Mexico. Other fine sources include Morocco, the gypsum fields of Oklahoma and the American Southwest, and Australia. Much of what is sold as 'selenite' wands is properly the silky fibrous form, satin spar — mineralogically the very same gypsum.", lore: "The name comes from the Greek selēnē, the moon, and from Selene the moon goddess, given for the soft lunar sheen that plays across a polished piece. Ancient and medieval builders prized transparent gypsum as lapis specularis, slicing it into thin panes for the windows and lanterns of Roman villas and early churches, so that it quite literally let the light in. Its role as an energetic cleanser and 'liquid light' is largely a modern metaphysical development, though its old lunar name gave it a mystical reputation long before the crystal shops.", mind: "Selenite is worked with to still a churning mind and lift a heavy, cluttered mood, the way opening a window airs out a stuffy room. It is the stone of mental clarity and calm perspective, reached for to clear confusion, quiet anxious chatter, and restore a sense of peaceful spaciousness when life feels crowded. Keepers turn to it when they need to think clearly and feel light again.", spirit: "This is the great Crown chakra (Sahasrara) crystal and one of the premier tools for connection to the higher realms, angelic guidance, and one's own higher self. Selenite is famous as a self-cleansing stone that never needs clearing, and as a cleanser of other stones and whole spaces — laid in a grid or set at the thresholds of a room, it is said to sweep out stagnant energy and hold a field of luminous peace. It aligns with the Air element and the moon: high, clarifying, and quietly spacious.", body: "In crystal tradition Selenite is gently associated with the spine and skeletal alignment — a poetic nod to its long, straight, structural crystals — and with a general sense of flexibility and light in the body. Folk practice places it near the head to encourage restful sleep and calm, and combs it along the body to smooth and settle the aura. These are traditional, symbolic associations for comfort — not treatments, and no replacement for proper medical care.", care: "The single most important rule: never cleanse Selenite in water. It is water-soluble gypsum, and soaking will cloud, pit, and eventually dissolve it, while shedding splintery fibers if left damp. Happily, it is self-cleansing and actually charges and clears other crystals, so simply resting it in moonlight, smoke, or on a dry windowsill keeps it bright — handle it gently, keep it dry, and store it away from harder stones that can scratch its soft surface." } },
  { name: "Shungite", colour: "Black", hex: "#1e1e22", chakra: "Root", element: "Earth", zodiac: "Cancer, Scorpio", pair: "396 Hz",
    keywords: ["Protection", "Grounding", "Purification", "EMF Shield", "Cleansing", "Detox", "Root"],
    use: "Shields and grounds, purifies energy, buffers electronic overwhelm.",
    meaning: "Shungite is the ancient guardian — a deep-black, carbon-rich stone from the old forests of Karelia, prized for its powerful protective and purifying nature. It is a go-to crystal for shielding your space, traditionally used to cleanse heavy energy and to buffer the invisible 'noise' of modern electronics. Deeply grounding, it draws you down into the earth and forms a quiet fortress of calm around your aura.",
    work: "Place it near your devices or carry a piece as an energetic shield, and cleanse it often under running water or the light of the moon.",
    affirm: "I am protected, grounded, and my energy is clear.",
    deep: { origin: "Shungite is not a crystal at all but a rare, lustrous black carbon-rich rock — a mineraloid of non-crystalline (amorphous) carbon, remarkable for containing natural fullerenes, the hollow carbon molecules whose laboratory discovery won a Nobel Prize. It formed from ancient organic sediment on the floor of a Precambrian sea some two billion years ago, then was buried and enriched into nearly pure carbon; it takes its name from the village of Shunga in Karelia, north-western Russia, on the shores of Lake Onega, which remains essentially the only significant source on Earth. Collectors distinguish the lustrous, silvery 'elite' or 'noble' shungite (up to 98% carbon, only a few percent of what is mined) from the more common matte black stone whose carbon is bound in a silicate rock.", lore: "Karelian tradition holds that Peter the Great founded Russia's first spa there in the early 1700s, sending his soldiers to drink from the 'healing' shungite springs, and local people had long steeped the black stone in water as a folk purifier. Its scientific fame is recent — fullerenes were only identified in natural shungite in the 1990s — which is why the electromagnetic-shielding reputation, hugely popular though it is, is a very modern claim rather than ancient lore. What is genuinely old is the regional practice of purifying drinking water with the stone.", mind: "Shungite is worked with as an anchor for a frazzled, overstimulated mind, drawing scattered nervous energy down and out of the head. It is the stone reached for in overwhelm — to buffer the sense of invisible 'noise' and pressure, to steady the emotions, and to restore the feeling of being protected enough to finally relax. Keepers value the quiet, fortress-calm it seems to build around them.", spirit: "A powerful Root chakra (Muladhara) stone, Shungite is prized above almost all others for grounding and protection, said to pull the aura down into deep contact with the earth and to seal it against draining or hostile energy. In modern practice it is the go-to crystal for cleansing heavy energy from a space and for buffering the electromagnetic 'smog' of phones, routers, and screens — set beside devices or carried as a shield. It carries a dense, still Earth-element frequency, more fortress than fountain, well matched to the deep-water intensity of Cancer and Scorpio.", body: "Folk tradition in Karelia has long associated shungite water with purity and vitality, and the stone is traditionally placed in the home as a general cleanser of the living environment. Modern crystal practice reaches for it to soothe the strain many attribute to screens and devices and to support a grounded sense of physical resilience. These are traditional and folk associations only — customs and comforts, never medical claims, and no substitute for professional care.", care: "Shungite is unusual among protective stones in being water-safe and easy to keep — it is chemically stable, which is exactly why it has been steeped in drinking water for centuries (rinse elite pieces gently, as the softest can leave a little black dust at first). Cleanse it often, since it is thought to absorb a great deal: running water, smoke, or a few hours resting on dry earth all work well, and many keepers simply set it out on soil or a sunny windowsill to recharge. It needs no protection from light and will not fade." } },
  { name: "Smoky Quartz", colour: "Smoky brown", hex: "#5a4d43", chakra: "Root", element: "Earth", zodiac: "Scorpio, Capricorn", pair: "396 Hz",
    keywords: ["Grounding", "Protection", "Calm", "Root", "Release", "Stability"],
    use: "Grounds scattered energy, eases stress, and transmutes heavy feelings into calm.",
    meaning: "Smoky Quartz is the great grounding stone — earth's own anchor, drawing scattered energy and worry down through the body and into the ground beneath your feet. Traditionally carried as a shield, it gently transmutes heavy or unwanted energy into calm, steady presence, making it a trusted companion in times of stress or grief. Where other stones lift you skyward, Smoky Quartz reminds you that you are safe, held, and firmly here.",
    work: "Hold a piece in each hand or rest one at your feet during meditation, or slip a tumbled stone into your pocket to stay grounded through a demanding day.",
    affirm: "I am grounded, calm, and safe in this moment.",
    deep: { origin: "Smoky Quartz is the smoky-brown to near-black variety of quartz (SiO2), and its color is a small marvel of natural physics — it arises when natural gamma irradiation acts on tiny traces of aluminium substituted into the crystal lattice, creating a 'smoky' color center; grow that same quartz without the radiation and it would be colorless. It forms in granite, gneiss, and pegmatite pockets and in Alpine fissure veins, ranging from pale champagne to the opaque black known as morion. Scotland's Cairngorm Mountains gave the traditional gem its old name 'cairngorm,' with other renowned sources in the Swiss Alps, Brazil, Madagascar, Colorado, and the granites of the American West.", lore: "In the Scottish Highlands cairngorm was the native jewel, set into kilt pins, brooches, and the pommels of dirks and sgian-dubhs, carrying a whiff of Druidic and Celtic reverence for the dark earth. Far away in ancient China, smoky quartz was cut into flat slabs and set in frames to make some of the earliest known sunglasses, worn by judges to hide their expressions in court. Himalayan Buddhist tradition honored it as a stone of grounding protection, though its role as a 'transmuter of negative energy' is chiefly modern crystal language.", mind: "Smoky Quartz is the great steadying companion in stress, grief, fear, and low spirits, worked with to draw worry down out of the racing head and into the calm of the body. It is reached for to dissolve panic and brooding, to lift the mood gently without forcing false brightness, and to help someone feel safe, present, and able to cope. Where uplifting stones can leave you unmoored, this one keeps your feet firmly on the floor.", spirit: "A premier Root chakra (Muladhara) stone, Smoky Quartz anchors and grounds while working its signature magic — transmuting heavy, unwanted, or chaotic energy down through the body and into the earth to be neutralised, rather than merely blocking it. It is carried as a protective shield, used to clear a space of gloom, and valued for its earthing Earth-element frequency, a natural bridge between the crown of clarity and the ground of safety. Many keepers pair it with clear quartz to balance grounding with light, and its resolute steadiness suits Scorpio's depth and Capricorn's discipline.", body: "Folk and crystal tradition associate Smoky Quartz with the base of the body, the legs and feet, and a general sense of physical grounding and steadiness. It has long been laid on the abdomen or held in moments of tension, in the belief that it eases the physical grip of stress and helps the body let go and settle. These are traditional associations offered for comfort and symbolism only — never medical claims, and no substitute for proper care.", care: "Take real care with sunlight: because its color is created by irradiation, smoky quartz can fade with prolonged sun, and long windowsill sessions will slowly bleach a good stone toward grey or clear — charge it in moonlight or briefly on the earth instead. It is durable (Mohs 7) and fully water-safe, so running water clears it beautifully, as do smoke, sound, or a night nestled on a bed of quartz or hematite. Being of the earth, it also loves to be buried in soil for a day to recharge its grounding pull. A note for collectors: much very-black 'smoky quartz' is irradiated colorless quartz — genuinely quartz, just human-darkened." } },
  { name: "Sodalite", colour: "Deep blue", hex: "#2b5a9c", chakra: "Throat & Third Eye", element: "Air", zodiac: "Sagittarius, Virgo", pair: "852 Hz",
    keywords: ["Intuition", "Communication", "Truth", "Clarity", "Calm", "Third Eye", "Logic"],
    use: "Unites logic and intuition, calms the mind, and supports honest speech.",
    meaning: "Sodalite is the stone of truth and clear thinking — deep ocean-blue veined with white, uniting the logical mind with quiet intuition. Traditionally used to calm a busy head and steady the emotions, it helps you find the right words and speak them honestly, making it a favourite of writers, teachers, and seekers. It brings a cool, orderly clarity, dissolving mental confusion into calm understanding.",
    work: "Keep Sodalite on your desk or hold it before speaking or writing to clear the mind, or rest it at the throat during meditation to ease honest self-expression.",
    affirm: "I speak my truth with a calm and clear mind.",
    deep: { origin: "Sodalite is a rich royal-blue feldspathoid — a sodium aluminium silicate carrying chloride, Na8(Al6Si6O24)Cl2 — typically threaded with white veins of calcite; it is the 'sodium stone' that gives the whole mineral group its name. It crystallises in silica-poor igneous rocks such as nepheline syenites, forming as masses and grains rather than showy crystals, and it is one of several minerals that together make up lapis lazuli (sodalite lacks the golden pyrite and the intense ultramarine of pyrite-bearing lapis). First described in 1811 from the Ilímaussaq complex in Greenland, its great commercial sources are Bancroft in Ontario, Canada, along with Brazil, Namibia, Bolivia, and Russia; the rare violet-flushing, light-responsive variety is hackmanite.", lore: "Because good sodalite only entered the mineral world in 1811 and became widely available after large Canadian finds around 1900 — a celebrated Ontario deposit was popularised following Princess Patricia's 1901 visit, earning the name 'Princess Blue' — it has almost no genuine ancient lore of its own. Much of the deep-blue symbolism attached to it is really borrowed from lapis lazuli, its famous look-alike, which the Egyptians, Sumerians, and Renaissance painters treasured for millennia. As a named stone with named virtues, Sodalite is essentially a modern metaphysical citizen.", mind: "Sodalite is the clear-thinking stone, worked with to quiet a busy, over-full head and bring cool order to mental chaos. It is the friend of writers, students, and teachers — anyone who must find the right words — said to marry logic with intuition so that thought and feeling agree; it also steadies the emotions, calming panic and defensiveness into honest, articulate calm. Keepers reach for it to speak their truth without heat.", spirit: "Sodalite bridges two centers: it opens the Throat chakra (Vishuddha) for honest, clear communication and the Third Eye (Ajna) for intuition and insight, uniting the rational mind with the perceptive one. In energy work it is used to deepen meditation, enhance trust in the inner voice, and bring the spoken word into alignment with inner truth. It carries a cool, orderly Air-element clarity well suited to Sagittarius's search for truth and Virgo's love of precision.", body: "In folk and crystal tradition Sodalite is associated with the throat and voice and with a cooling, calming quality that practitioners have linked to easing the physical signs of stress and an overheated, overactive mind. It is traditionally kept near the throat as a companion for public speakers and singers, and reached for to encourage a settled, clear-headed calm. These are traditional associations only, offered for comfort and symbolism — not medical claims, and never a replacement for professional care.", care: "Sodalite is reasonably durable (Mohs 5.5–6) but best treated kindly with water — a quick rinse and pat-dry is fine, but avoid long soaks, salt water, and harsh chemicals, which can dull the surface and attack the calcite veins running through it. Its deep blue can also weaken under prolonged strong sunlight, so cleanse and charge it in moonlight, with smoke, on a piece of selenite, or in the company of clear quartz rather than on a hot sunny sill. Store it apart from harder stones to protect its polish." } },
  { name: "Sunstone", colour: "Golden orange", hex: "#dd7a33", chakra: "Sacral & Solar Plexus", element: "Fire", zodiac: "Leo, Libra", pair: "528 Hz",
    keywords: ["Joy", "Confidence", "Abundance", "Vitality", "Leadership", "Solar Plexus"],
    use: "Rekindles joy, confidence, and personal power.",
    meaning: "Sunstone is captured sunlight — a warm, glittering stone of joy, vitality, and personal power. It scatters the clouds of self-doubt and seasonal gloom, rekindling optimism and the courage to shine without apology. Long linked to leadership and good fortune, it warms the will and restores the confidence to say yes to life and step into your own brightness.",
    work: "Carry it or sit with it in the morning light when you feel low or dim, and let its warmth relight your spark.",
    affirm: "I shine with confidence, joy, and personal power.",
    deep: { origin: "Sunstone is a member of the feldspar family — most often a sodium-calcium plagioclase such as oligoclase, though the celebrated Oregon sunstone is a labradorite. Its signature inner fire, called aventurescence or schiller, is a play of metallic glints thrown off by countless microscopic platelets suspended within the stone — usually hematite or goethite, and, uniquely in Oregon material, flakes of native copper that lend it peach, red and rare green flashes. It crystallises in igneous rocks like basalt lava flows and in some metamorphic settings, and is gathered today from Oregon in the United States, India, Tanzania, Russia, and the historic Scandinavian deposits of Norway and Sweden.", lore: "The ancient Greeks saw the sun god's living light trapped in the stone and carried it as a talisman of vitality and good fortune, while Norse legend holds that Viking navigators may have used a 'sunstone' to find the sun through overcast skies — though the sagas' sólarsteinn was more likely a clear calcite than this feldspar. In the folk traditions of India and Renaissance Europe it was worn to attract abundance and the favour of powerful people, and Victorian lapidaries prized its warm shimmer for jewellery meant to lift the spirits. Through all these threads runs one honest constant: wherever it surfaced, sunstone was linked to solar power, leadership and joy.", mind: "Sunstone is the classic ally for self-doubt and low spirits — worked with to scatter the inner clouds of hesitation and rekindle a natural, unforced optimism. It is traditionally reached for when the will has gone dim: to restore the confidence to say yes, to lead, and to take up space without apology. Many keep it close through the short, grey days of winter as a warm counterweight to seasonal gloom.", spirit: "Energetically sunstone lights the Sacral and Solar Plexus chakras, the seats of pleasure, creativity and personal power, warming both so that desire and will move together. As a Fire stone tied to Leo and Libra it is used to burn off stagnation and re-ignite motivation, and to call one's authentic radiance back into the body. It is often paired with moonstone as its solar complement — the two together honouring the balance of active and receptive energies.", body: "Folk and crystal tradition associate sunstone with warmth and vital energy, and practitioners have long reached for it to lift a sense of fatigue or sluggishness and to encourage a feeling of overall vitality. It is traditionally linked with the metabolism and circulation, and with easing the heaviness of seasonal low mood. These are associations of tradition and folklore only, never medical claims, and it is no substitute for proper care.", care: "Happily, sunstone is one of the stones that adores the light it is named for — a rest in the morning sun both cleanses and recharges it beautifully, with none of the fading that dulls amethyst or rose quartz. At Mohs 6 to 6.5 it is reasonably hard but carries feldspar cleavage, so avoid sharp knocks and prolonged soaking; a brief rinse under running water, a pass through cleansing smoke, or a few hours on a selenite plate all serve well. To charge it, simply set it on a sunny sill at dawn and let it drink the light." } },
  { name: "Tektite", colour: "Brownish black", hex: "#241f1b", chakra: "Crown & Root", element: "Storm", zodiac: "Aries, Cancer", pair: "963 Hz",
    keywords: ["Cosmic Connection", "Protection", "Grounding", "Spiritual Growth", "Manifestation", "Psychic Insight", "Transformation"],
    use: "Meteoric glass bridging earth and cosmos — expanding yet grounding, and quietly powerful.",
    meaning: "Tektite is natural glass born in the violence of a meteorite strike, where earthly rock was hurled skyward, melted, and fell back to the ground as dark, glassy stone — a literal union of earth and cosmos. Though not a true crystal (like obsidian it is amorphous glass, with no lattice), it carries an ancient, potent frequency long valued for strengthening the aura, drawing down higher wisdom, and encouraging spiritual growth without letting you lose your footing on the earth. It is said to amplify the energy of other stones, aid manifestation, and open steady communication with the higher realms. Moldavite is itself a green tektite, so the two are kin born of the same cosmic fire — and a piece uniting tektite with moldavite is a true treasure, pairing moldavite's soaring transformation with tektite's protective, steadying ground.",
    work: "Carry or wear it to strengthen and protect your energy field, and pair it with Moldavite or another tektite to balance rapid, high-vibration change with a deep, calm grounding.",
    affirm: "I am open to cosmic wisdom and rooted in the earth that holds me.",
    deep: { origin: "Tektite is not a true crystal at all but a natural glass — amorphous, with no internal lattice, closer in structure to obsidian or window glass than to quartz. It is born in the cataclysm of a meteorite impact: the strike melts terrestrial rock and flings it skyward, where it cools and quenches in flight before falling back to earth as dark, glassy stone, often sculpted into teardrops, buttons and dumbbells by its passage through the air. Tektites occur in scattered 'strewn fields' tied to specific impacts — the vast Australasian field (australites, indochinites, philippinites), the North American field, the Ivory Coast field, and the Czech moldavite field, whose bottle-green glass is itself a tektite and thus tektite's cosmic kin.", lore: "Because they fell from the sky as black glass, tektites were treasured as sacred, otherworldly objects long before anyone understood their origin. Aboriginal Australians carried australites as amulets and cutting tools; in Southeast Asia they were regarded as celestial stones of protection; and a carved Libyan desert glass — a related impact glass — sits at the breast of Tutankhamun as a scarab. The name tektite comes from the Greek tēktos, 'melted', coined in the nineteenth century once naturalists grasped that fire, not simple weathering, had shaped them.", mind: "Tektite is worked with to steady the mind through periods of upheaval — its very origin, a violent transformation that nonetheless returns to solid ground, mirrors the passage through crisis into renewal. Tradition reaches for it to encourage spiritual growth and a higher perspective without letting one drift into overwhelm or ungroundedness. It is regarded as a stone that helps you keep your feet on the earth while your understanding expands.", spirit: "Uniting the Crown and Root chakras, tektite is prized as a bridge between cosmos and earth — drawing down higher wisdom and steady communication with the higher realms while anchoring that energy firmly in the body. As a Storm stone of Aries and Cancer it is said to strengthen and cleanse the aura, amplify the energy of other stones, and aid manifestation. Paired with its kin moldavite it becomes a true treasure: moldavite's soaring, sometimes dizzying transformation grounded and protected by tektite's steadying weight.", body: "In crystal tradition tektite is associated with vitality and the circulation of energy through the body, and folk practice has linked it to fever and to supporting a general sense of resilience. Some traditions place it with fertility and with releasing physical tension held from stress. These are traditional and folkloric associations only, never medical claims, and no stone should stand in for proper care.", care: "As a tough, non-porous glass, tektite is one of the easier stones to keep: it takes no harm from water, so a rinse under running water is a fine and fitting cleanse, and it will not fade in light. Being an earth-and-sky stone, it responds especially well to being buried briefly in soil or set out under the moon and stars to recharge. Its only real vulnerability is its glassy brittleness — like obsidian it can chip or fracture on a hard knock, so store and handle it with a little care." } },
  { name: "Tiger's Eye", colour: "Golden brown", hex: "#b07d2b", chakra: "Solar Plexus", element: "Fire", zodiac: "Leo, Capricorn", pair: "528 Hz",
    keywords: ["Courage", "Confidence", "Protection", "Willpower", "Abundance", "Grounding", "Solar Plexus"],
    use: "Kindles courage and confidence, sharpens willpower, and guards against fear.",
    meaning: "Tiger's Eye is the stone of the courageous heart — a warm, golden talisman long worn to summon confidence and ward off harm. With its shifting bands of light it is called the all-seeing eye, sharpening perception and helping you act with clear willpower rather than fear. It grounds the fire of the Solar Plexus, balancing bold action with steady discernment so you can move toward what you want without losing your footing.",
    work: "Carry Tiger's Eye when you need a boost of nerve — before a big conversation, decision, or challenge — or hold it over the Solar Plexus and breathe warmth into your resolve.",
    affirm: "I move through the world with courage, clarity, and confidence.",
    deep: { origin: "Tiger's eye is a variety of quartz shot through with fine parallel fibres that give it chatoyancy — the shifting golden band of light that earns it the name 'the all-seeing eye'. It forms where silica-rich fluids infiltrate seams of fibrous crocidolite (blue asbestos); classic accounts describe quartz replacing the crocidolite in place as a pseudomorph, though modern mineralogy (Heaney and Fisher, 2003) shows much of it grows by a crack-seal process, with quartz and the fibres crystallising together as the vein slowly opens. Where the original blue-grey survives unoxidised it is called hawk's eye, and where iron has stained it golden-brown you have tiger's eye proper; the world's finest comes from the Northern Cape of South Africa, with more from Western Australia, Namibia and India.", lore: "Roman soldiers carried tiger's eye into battle as a talisman of courage and protection, trusting its ever-watchful eye to deflect harm and keep the wearer sharp-sighted. Ancient Egyptians used the golden stone for the eyes of deity statues, honouring it as a symbol of divine vision and the protective gaze of the sun. Through the medieval and Victorian eras it kept this reputation as an amulet against ill wishes and the evil eye — a stone worn to see clearly and to stand firm.", mind: "Tiger's eye is the stone of the courageous heart, worked with to summon confidence and replace fear-driven reaction with clear, deliberate willpower. It is traditionally used to steady a scattered or anxious mind, sharpen focus and discernment, and help you see a situation whole — recognising both opportunity and risk without flinching from either. Many turn to it when a bold decision is needed but a level head must guide it.", spirit: "Tiger's eye grounds the fire of the Solar Plexus, the chakra of will and personal power, tempering bold action with earthy steadiness so ambition does not tip into recklessness. A Fire stone of Leo and Capricorn, it balances the drive to act with the discipline to act wisely, and is often used as a protective stone that returns unwanted or manipulative energy to its sender. It marries the golden solar current with a grounding, root-ward pull, keeping the willpower it kindles firmly on the ground.", body: "Folk and crystal tradition associate tiger's eye with the metabolism and the endocrine system, and practitioners have reached for it to support a feeling of steady energy and to ease the physical grip of anxiety. It is also traditionally linked to the eyes and to clear sight, fitting for the 'all-seeing' stone. Such associations belong to tradition and folklore alone, not to medicine, and it is no substitute for proper care.", care: "At Mohs 7 tiger's eye is hard and water-tolerant, so a brief rinse under cool running water is a simple and effective cleanse, as is smoke, sound, or a night resting on a selenite plate. As a solar stone it enjoys a short charge in early sunlight, but keep the exposure brief — long hours in strong sun can slowly dull its warm colour and lustre, and much commercial tiger's eye is dyed and fades faster still. A pass through moonlight is the gentlest recharge if you would rather not risk the sun." } },
  { name: "Turquoise", colour: "Sky blue-green", hex: "#45c4b9", chakra: "Throat", element: "Air", zodiac: "Sagittarius, Scorpio", pair: "741 Hz",
    keywords: ["Protection", "Communication", "Healing", "Truth", "Wisdom", "Serenity", "Throat"],
    use: "Steadies the voice, protects the traveller, and calls in whole-being healing.",
    meaning: "Turquoise is the sky-stone of the honest voice — worn for thousands of years across many cultures as an amulet of protection for warriors, healers and wanderers alike. It bridges earth and sky, drawing serene, clarifying energy to the throat so that what you feel and what you say become one true thing. Long honoured as a master healer and the faithful friend of every traveller, it is said to guard against harm and to keep bonds of friendship strong across any distance.",
    work: "Wear it at the throat or tuck it in your pocket when you travel or must speak your truth, and hold it when you need to say the hard, honest thing gently.",
    affirm: "I speak my truth with a clear and open heart.",
    deep: { origin: "Turquoise is a hydrated phosphate of copper and aluminium (CuAl6(PO4)4(OH)8·4H2O), and it is the copper that gives it that unmistakable robin's-egg blue, tipping toward green as iron enters the mix. It forms as a secondary mineral in arid, copper-rich country, where percolating waters weather aluminous rock and deposit turquoise in seams and nodules — a slow, near-surface process rather than a deep crystalline one, which is why it is nearly always massive rather than in visible crystals. The historic finest came from Nishapur in Iran ('Persian turquoise'), while the Sinai peninsula holds some of the oldest mines on earth, and the American Southwest — Sleeping Beauty, Kingman, Bisbee — has been a great modern source, alongside China and Tibet.", lore: "Turquoise is one of humanity's oldest gemstones, mined by the Egyptians in the Sinai over six thousand years ago and set into the funerary treasures of the pharaohs, Tutankhamun's burial mask among them. Persian tradition set it in daggers and horse bridles as a guard against a violent death, Tibetan and many Native American peoples honoured it as a sacred sky-stone bridging earth and heaven, and a well-travelled European belief held that turquoise would protect the rider from falls. The word itself came into English as 'Turkish stone', after the trade route that carried Persian turquoise into Europe.", mind: "Turquoise is worked with to bring the honest voice into being — to align what one feels with what one says so that the two become a single true thing. It is traditionally used to calm the nerves before speaking, dissolve self-sabotage and the fear of judgement, and restore a serene, clarifying steadiness to an anxious mind. As the faithful friend of travellers and wanderers it is also carried for reassurance, and for keeping bonds of friendship strong across any distance.", spirit: "Turquoise governs the Throat chakra, opening clear, unguarded communication and true self-expression, and as an Air stone of Sagittarius and Scorpio it is said to bridge earth and sky and to unite the physical and spiritual planes. Long honoured as a master healer and a stone of whole-being protection, it is used to shield the aura and draw serene, clarifying energy up to the throat. It is a favourite for the traveller's amulet, believed to guard the wearer wherever the road may lead.", body: "Turquoise has been called a master healer in crystal tradition, and folk practice has reached for it to soothe the throat, calm inflammation, and ease the strain of overexertion. It is traditionally associated with the respiratory system and with a general strengthening of the whole body. These are associations of tradition and folklore only — never a medical claim, cure, or replacement for proper care.", care: "Here care truly matters: turquoise is soft (Mohs 5 to 6) and porous, and water is its enemy — soaking will discolour it, salt water and household chemicals will damage it, and even skin oils, perfume and sunscreen can dull a stone over time. Never cleanse it in water or a salt bath, and keep it out of prolonged sun and heat, which fade its blue toward a tired green and can crack it. Cleanse and charge it dry instead — a bath of cleansing smoke, sound, a night under gentle moonlight, or a rest on selenite — and wipe it only with a soft dry cloth." } },
  { name: "Unakite", colour: "Pink & green", hex: "#8ba36f", chakra: "Heart", element: "Earth", zodiac: "Scorpio", pair: "639 Hz",
    keywords: ["Balance", "Emotional Healing", "Patience", "Growth", "Grounding", "Heart"],
    use: "Balances the emotions, releases old wounds, supports patient and steady growth.",
    meaning: "Unakite is the stone of gentle, gradual transformation — its marbling of soft green and salmon pink weds the heart's love to the earth's patience. Traditionally used to coax buried feelings to the surface so they can be met and released with compassion, it favours slow, steady growth over force. A nurturing companion through recovery, grief and new beginnings, it helps you rebuild on solid, loving ground.",
    work: "Keep it close during emotional release or recovery, or place it over the heart in meditation to soften and let go of what no longer serves you.",
    affirm: "I release the past gently and grow at my own perfect pace.",
    deep: { origin: "Unakite is not a single mineral but a rock — an altered granite, sometimes called epidosite, made of three companions grown together: salmon-pink orthoclase or potassium feldspar, mossy-green epidote, and clear to milky quartz. It forms when granite is hydrothermally altered, the circulating fluids replacing some of its original minerals with epidote to produce the characteristic pink-and-green marbling. It takes its name from the Unaka Range of the southern Appalachians, on the North Carolina–Tennessee border, where it was first described, and is also quarried in South Africa, Brazil, China, Zimbabwe and along the shores of Lake Superior.", lore: "As a stone only named and described in the nineteenth-century United States, unakite has no ancient Greek or Egyptian mythology behind it — an honest point worth making, since much of the 'lore' marketed for it is modern invention. Its genuine story is one of place: the Appalachian people knew the handsome pink-and-green rock from their rivers and ridges, and it has been polished into cabochons, beads, eggs and carvings ever since. Its metaphysical reputation for gentle transformation is a twentieth-century development rather than an inheritance from the old lapidaries.", mind: "Unakite is the stone of gentle, gradual transformation — worked with to coax buried feelings quietly to the surface so they can be met and released with compassion rather than forced. It is a favoured companion through recovery, grief and new beginnings, valued for supporting slow, steady growth over abrupt change. Many keep it close when patience and self-kindness are needed to rebuild on solid, loving ground.", spirit: "Unakite works upon the Heart chakra, its pink feldspar carrying love and its green epidote carrying growth and renewal, wedding the two so that emotional healing stays rooted and unhurried. As an Earth stone of Scorpio it lends patience and grounding to the heart's work, holding you steady while feeling moves. It is often used in gridwork and meditation aimed at releasing what no longer serves, gently and in its own time.", body: "In crystal and folk tradition unakite is associated with the reproductive system and with a healthy pregnancy, and it has long been reached for as a nurturing stone through convalescence and recovery. It is also traditionally linked with gently supporting healthy weight and the gradual release of habits held in the body. These associations belong to tradition and folklore alone, are never medical claims, and are no substitute for proper care.", care: "Unakite is a durable, water-tolerant stone thanks to its quartz and feldspar (around Mohs 6 to 7), so a rinse under running water is a fine cleanse, as are smoke and sound. Being an Earth stone it especially loves to be recharged in contact with the ground — buried briefly in soil, set on a windowsill in soft moonlight, or laid among plants. Its colours are stable, but as with any feldspar-bearing stone avoid long soaking and harsh chemicals, and keep it out of prolonged strong sun to hold the pink and green vivid." } },
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

/* ---------------- Inspirational Quotes ---------------- */
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
  ["Tell me, what is it you plan to do with your one wild and precious life?", "Mary Oliver"],
  ["Instructions for living a life: Pay attention. Be astonished. Tell about it.", "Mary Oliver"],
  ["Try to be a rainbow in someone's cloud.", "Maya Angelou"],
  ["We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.", "Maya Angelou"],
  ["My mission in life is not merely to survive, but to thrive.", "Maya Angelou"],
  ["Go confidently in the direction of your dreams. Live the life you have imagined.", "Henry David Thoreau"],
  ["Heaven is under our feet as well as over our heads.", "Henry David Thoreau"],
  ["Not until we are lost do we begin to understand ourselves.", "Henry David Thoreau"],
  ["Keep your face always toward the sunshine, and shadows will fall behind you.", "Walt Whitman"],
  ["I am larger, better than I thought; I did not know I held so much goodness.", "Walt Whitman"],
  ["Hope is the thing with feathers that perches in the soul.", "Emily Dickinson"],
  ["Dwell in possibility.", "Emily Dickinson"],
  ["Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.", "Kahlil Gibran"],
  ["Your pain is the breaking of the shell that encloses your understanding.", "Kahlil Gibran"],
  ["In one drop of water are found all the secrets of all the oceans.", "Kahlil Gibran"],
  ["Nature does not hurry, yet everything is accomplished.", "Lao Tzu"],
  ["A journey of a thousand miles begins with a single step.", "Lao Tzu"],
  ["When I let go of what I am, I become what I might be.", "Lao Tzu"],
  ["Knowing others is intelligence; knowing yourself is true wisdom.", "Lao Tzu"],
  ["The soul becomes dyed with the colour of its thoughts.", "Marcus Aurelius"],
  ["Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", "Marcus Aurelius"],
  ["What stands in the way becomes the way.", "Marcus Aurelius"],
  ["When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love.", "Marcus Aurelius"],
  ["As long as you live, keep learning how to live.", "Seneca"],
  ["Wherever there is a human being, there is an opportunity for a kindness.", "Seneca"],
  ["The only journey is the one within.", "Rainer Maria Rilke"],
  ["Let everything happen to you: beauty and terror. Just keep going. No feeling is final.", "Rainer Maria Rilke"],
  ["Be patient toward all that is unsolved in your heart and try to love the questions themselves.", "Rainer Maria Rilke"],
  ["Faith is the bird that feels the light and sings when the dawn is still dark.", "Rabindranath Tagore"],
  ["Clouds come floating into my life, no longer to carry rain or usher storm, but to add colour to my sunset sky.", "Rabindranath Tagore"],
  ["Let your life lightly dance on the edges of Time like dew on the tip of a leaf.", "Rabindranath Tagore"],
  ["Although the world is full of suffering, it is also full of the overcoming of it.", "Helen Keller"],
  ["Keep your face to the sunshine and you cannot see a shadow.", "Helen Keller"],
  ["The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.", "Helen Keller"],
  ["Whoever is happy will make others happy too.", "Anne Frank"],
  ["How wonderful it is that nobody need wait a single moment before starting to improve the world.", "Anne Frank"],
  ["In the middle of winter I at last discovered that there was in me an invincible summer.", "Albert Camus"],
  ["Adopt the pace of nature: her secret is patience.", "Ralph Waldo Emerson"],
  ["Walk as if you are kissing the Earth with your feet.", "Thich Nhat Hanh"],
  ["Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", "Thich Nhat Hanh"],
  ["Smile, breathe and go slowly.", "Thich Nhat Hanh"],
  ["Realize deeply that the present moment is all you ever have.", "Eckhart Tolle"],
  ["Acknowledging the good that you already have in your life is the foundation for all abundance.", "Eckhart Tolle"],
  ["Sell your cleverness and buy bewilderment.", "Rumi"],
  ["Raise your words, not your voice. It is rain that grows flowers, not thunder.", "Rumi"],
  ["Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", "Rumi"],
  ["Where there is ruin, there is hope for a treasure.", "Rumi"],
  ["This being human is a guest house. Every morning a new arrival.", "Rumi"],
  ["The breeze at dawn has secrets to tell you. Don't go back to sleep.", "Rumi"],
  ["Everything in the universe is within you. Ask all from yourself.", "Rumi"],
  ["Be like a tree and let the dead leaves drop.", "Rumi"],
  ["It always seems impossible until it's done.", "Nelson Mandela"],
  ["May your choices reflect your hopes, not your fears.", "Nelson Mandela"],
  ["Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'", "Mary Anne Radmacher"],
  ["Act as if what you do makes a difference. It does.", "William James"],
  ["The great use of life is to spend it for something that will outlast it.", "William James"],
  ["Turn your face to the sun and the shadows fall behind you.", "Māori proverb"],
  ["I wish I could show you, when you are lonely or in darkness, the astonishing light of your own being.", "Hafiz"],
  ["And still, after all this time, the Sun never says to the Earth, 'You owe me.' Look what happens with a love like that. It lights the whole sky.", "Hafiz"],
  ["For a seed to achieve its greatest expression, it must come completely undone.", "Cynthia Occelli"],
  ["Nothing ever goes away until it has taught us what we need to know.", "Pema Chödrön"],
  ["Owning our story and loving ourselves through that process is the bravest thing that we'll ever do.", "Brené Brown"],
  ["Almost everything will work again if you unplug it for a few minutes, including you.", "Anne Lamott"],
  ["Piglet noticed that even though he had a Very Small Heart, it could hold a rather large amount of Gratitude.", "A. A. Milne"],
  ["At any given moment, you have the power to say: this is not how the story is going to end.", "Christine Mason Miller"],
  ["My religion is very simple. My religion is kindness.", "Dalai Lama XIV"],
  ["If you want others to be happy, practice compassion. If you want to be happy, practice compassion.", "Dalai Lama XIV"],
  ["Happiness is not something ready-made. It comes from your own actions.", "Dalai Lama XIV"],
  ["Be kind whenever possible. It is always possible.", "Dalai Lama XIV"],
  ["Our prime purpose in this life is to help others. And if you can't help them, at least don't hurt them.", "Dalai Lama XIV"],
  ["You are not behind. The garden does not scold the seed for its season.", "Luminae"],
  ["Let today be soft. Let it be enough.", "Luminae"],
  ["The light you seek is already keeping you warm.", "Luminae"],
];
/* ---------------- Shuffle & day-seeded picks ----------------
   shuffle(): Fisher–Yates — a genuinely fair shuffle, every ordering equally
   likely, freshly random on every single draw.
   daySeeded(): deterministic "random" for a calendar day — the whole family
   sees the same daily pick, but the day-to-day sequence never settles into a
   predictable rotation. Different salts keep quote/angel/crystal days apart. */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const daySeeded = (date = new Date(), salt = 0) => {
  let h = (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()) ^ Math.imul(salt, 0x9e3779b9);
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^= h >>> 16) >>> 0) / 4294967296;
};

function dailyQuote(date = new Date()) {
  return QUOTES[Math.floor(daySeeded(date, 7) * QUOTES.length)];
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
  { id: "nine", cat: "Numerology", colour: "#7fd4e0", title: "The nine numbers: a field guide to 1 through 9", min: 6, body: [
    "Every calculation in numerology — your Life Path, your Expression, your Soul Urge, even the number on your front door — ends in the same small country: the digits 1 through 9. However large the total, we fold it, and fold it again, until a single figure is left standing. These nine are not a scoreboard and they are not a horoscope; they are the alphabet of the craft, the root archetypes from which every longer word is spelled. Learn them well and the rest of numerology stops being memorisation and becomes reading.",
    "The idea is old and unhurried. Around 570 BCE, on the Greek island of Samos, Pythagoras taught that 'all is number' — that reality itself is woven of proportion and pattern, and that each digit carries a living quality, not merely a quantity. His school even drew them: 1 is the point, 2 the line stretched between two points, 3 the triangle that first encloses a space, 4 the solid that makes a world you can stand in. Odd numbers they heard as active and outgoing, even numbers as receptive and gathering — a steady pulse of giving and holding running all the way up. And the whole run of nine tells a single story in three acts: 1 through 3, the birth of a self; 4 through 6, that self building a life among others; 7 through 9, the turning back toward spirit and release.",
    "## 1, 2, 3 — the first triad",
    "One is the number of the first step — the single point, original fire, the courage to exist unprecedented. In its light it is the pioneer and the leader: initiative, invention, an unborrowed will that can begin what no one else dares to begin. Its shadow is the tyranny of the ego — arrogance, isolation, the loneliness of insisting that every duet become a solo — or the quiet inversion of that, a self-doubt that never stands up at all. The One moves through the world by going first; its path opens only by being walked, and it is never so alive as when there is a frontier in front of it.",
    "If One is the point, Two is the line — the first relationship, the bridge thrown across the space between self and other. Two is the peacemaker and the diplomat: sensitivity, patience, the quiet genius of truly listening, an attunement that reads the mood of a room before a word is spoken. Its shadow is the self that dissolves into the other — people-pleasing, chronic indecision, resentment swallowed until it curdles, a vote never cast because it feared the conflict. The Two leads from beside rather than in front, and its lifelong lesson is that its own needs belong on the very scales it is forever balancing for everyone else.",
    "Three is the triangle — the child born of the pair, and with it the first surplus, the overflow that becomes art. This is the creator and the communicator: expression, imagination, charisma, joy practised as a discipline rather than indulged as a mood. Words, colour, music, laughter — the Three takes raw feeling, gives it a form, and hands it to the world as delight or as medicine. Its shadow is scatter: a dozen half-finished enthusiasms, glitter and gossip standing in for depth, or a wounded Three that goes silent and lets the gift rot unsung inside it. The Three thrives the moment it says the thing, and withers every time it swallows the song.",
    "## 4, 5, 6 — the world takes shape",
    "Four is the square — the first solid, four corners, the foundation firm enough to build a house upon. This is the builder: order, method, patience, a sacred stubbornness, devotion to the slow work that outlasts every passing mood. Where Three improvises, Four comes back tomorrow and lays the next brick, and the one after that. Its shadow is rigidity — rules loved long past their usefulness, a fear of change dressed up as principle, labour so worshipped it forgets what it was for. The Four moves by reliability and keeps its word; its growth is to let a little spontaneity in through the door before the house becomes a fortress.",
    "Five sits at the exact centre of the nine — the hinge, the turn, the number of freedom in motion. This is the free spirit and the wanderer: adaptability, appetite, magnetism, fearless curiosity, all five senses thrown open to a changing world. After Four's careful walls, Five flings back the windows and lets the weather in. Its shadow is excess — a restlessness that cannot commit, an appetite with no off-switch, freedom that curdles into flight the instant love begins to feel like a room with a lock. The Five moves by change itself; its whole art is to choose its changes consciously rather than be dragged by them — to roam wide without abandoning everyone it meets along the way.",
    "Six is the number of the hearth — love made responsible, beauty offered as an act of care. This is the nurturer and the guardian: devotion, loyalty, a healer's instinct for mending what is broken, an eye that cannot help but tend the home, the family, the friend who is quietly falling apart. Of all nine, it carries the most reliable heart in the room. Its shadow is the martyr — care that hardens into control, advice no one asked for, a giving so total the giver vanishes, and the cold swing into resentment when the sacrifice goes unthanked. The Six moves by service; its lesson is to pour from a full cup, and to let itself, for once, be the one cared for.",
    "## 7, 8, 9 — the turn toward spirit",
    "Seven turns inward — the seeker, the mystic, the hermit with a telescope. This is the mind wed to the mysteries: analysis and intuition working as one instrument, a hunger to know what lies beneath the surface of things, and a genuine need for solitude in which to find it. Seven trusts what it has worked out for itself and is politely unmoved by almost everything else. Its shadow is withdrawal — aloofness, cynicism, a solitude that quietly hardens into isolation, over-thinking mistaken for wisdom, or escape into the cloud or the cup. The Seven moves by questioning; its solitude is a temple to visit, not a house to move into, and its faith is the kind earned rather than inherited.",
    "Eight is the powerhouse — mastery in the material world, the number of harvest, authority, and consequence. Here the inner work of Seven comes back down to earth to be built at scale: ambition, sound judgement, resilience, the strength to steward money, people, and power without being crushed beneath them. The very shape of the eight is a loop — as above, so below — a standing reminder that outer wealth answers, always, to an inner law. Its shadow is the tyrant and the miser: domination, workaholism, a life whose worth is measured only in the ledger, power hoarded rather than allowed to circulate. Softly held, the Eight's power feeds many; gripped too tightly, it costs the very things it was built to protect.",
    "Nine completes the circle — the humanitarian, the old soul, compassion wide as a horizon. Having travelled through all the numbers before it, Nine belongs to no single one; it is the number of endings, of hard-won wisdom, of the ache to give back what a long road has taught. Its love is impersonal in the grandest sense — it loves the whole through the one — and it is drawn to art, to service, to every cause larger than itself. Numerologists have long marvelled that Nine is, mathematically, the sage of the digits: multiply any number by nine and the result folds back to nine, and add nine to any digit and that digit returns unchanged — it gives everything away and keeps its own nature intact. Its shadow is the sorrow of holding on: clinging to what is finished, martyrdom, a bitterness when the world refuses to be saved. The Nine moves by release, because open hands are the only ones that can receive.",
    "## You are a chord, not a single note",
    "Here is the secret a field guide can only point toward: no one is a single number. Your Life Path may read as a 3, while your Soul Urge sings a 7, your Expression builds like a 4, and this year turns beneath you like a 1. You are not one of these nine portraits — you are all of them, sounding at different volumes, a chord rather than a note. And notice how the journey closes on itself, the way the well-made ones always do: add the digits 1 through 9 together and you reach 45, which folds to 9 — the whole alphabet returning home to the sage, to completion, to the wisdom of having walked the entire path. Learn the nine voices well, and you will always be able to hear which are singing loudest in any chart in front of you — and which are waiting, quietly, to be invited in.",
  ]},
  { id: "corenumbers", cat: "Numerology", colour: "#7fd4e0", title: "Your five core numbers: the map of a soul", min: 6, body: [
    "Every soul, numerology suggests, arrives carrying a small handful of numbers — and five of them do most of the load-bearing. Together they are called the core numbers, and reading them side by side is less like consulting a fortune than unfolding a map: here is the road, here is the destination, here is the traveller's secret reason for walking, here is the face they show at the border, and here is one gift tucked in the pack. Learn to lay these five over one another and a single, believable person rises off the page — contradictions and all. That layering is the whole art; no one number is ever the answer.",
    "The craft is old. Pythagoras, around 570 BCE, taught that 'all is number' — that reality itself is woven from ratio and proportion — and Western numerology has been listening for those patterns in a human life ever since. Your five core numbers rise from only two sources: two of them from the date you were born, three from the name you were given. To read the date you need only add and reduce; to read the name you need the Pythagorean key, which lays the alphabet across the numbers 1 through 9: A/J/S=1, B/K/T=2, C/L/U=3, D/M/V=4, E/N/W=5, F/O/X=6, G/P/Y=7, H/Q/Z=8, and I/R=9. (That sequential key belongs to the Pythagorean system; the older Chaldean tradition assigns its letters by sound and never hands out a 9 — a story for another page.) Hold the key close; we will use it in a moment.",
    "## The road you walk: the Life Path",
    "If numerology has a headline, it is the Life Path — the one number most people know, and the truest single word for the shape of a life. It is calculated from the whole birth date, because the day you arrived is the one fact no name-change or nickname can revise. Add the digits of the month, the day and the year, reduce each to a single figure, then add those three and reduce once more — always pausing to keep 11, 22 or 33 intact, since these master numbers are never folded down. Take a birth of 12 October 1988: October is the tenth month, so 1+0=1; the day 12 gives 1+2=3; the year 1988 gives 1+9+8+8=26, then 2+6=8; and 1+3+8=12, which becomes 1+2=3. That is a Life Path 3 — a road of voice, expression and creative courage — and the number describes the terrain you keep being handed, not the luck you will have crossing it.",
    "## The name you were given: three numbers, one name",
    "Where the Life Path is the road, the Expression number — also called the Destiny — is the destination and the vehicle both: the sum of your natural gifts and the aim they point toward. It comes from your full birth name exactly as it was written on the certificate, first, middle and last, because that complete name is the fullest note the world struck when it named you. You convert every letter to its value with the Pythagorean key, add them all, and reduce. To watch the mechanism plainly, take the small name MIA: M=4, I=9, A=1, totalling 14, which reduces to 5 — a destiny of freedom, versatility and the restless gift of change. A real Expression uses the entire birth name and so runs much longer, but the motion is identical: letters into numbers, numbers into one aim.",
    "Read the same name again, but keep only the vowels, and you find the Soul Urge — the Heart's Desire — the quiet engine of wanting that runs beneath everything you do. Vowels are the open, breathed sounds of a name, the parts you cannot say without letting air through, and numerology treats them as the voice of the inner life: what you long for when no one is asking, the reason behind your reasons. In MIA the vowels I and A give 9 and 1, totalling 10, which reduces to 1 — a heart that privately craves independence and the freedom to lead itself. One graceful complication for the adept: the letter Y is counted as a vowel only when it does a vowel's work (as in Lynn or Bryan, where no other vowel sounds) and as a consonant otherwise — a small judgement call that rewards a careful ear.",
    "Now keep the consonants instead, and the same name yields the Personality number — the self that arrives before you do, the impression a stranger forms across a room. Consonants are the shaped, closed sounds, the walls and edges of a name, and fittingly they describe your outer manner: the clothing your energy wears in public, which may differ sharply from the heart beneath it. MIA has a single consonant, M=4, so its Personality is 4 — a steady, dependable, grounded first impression. Here is the detail that delights people who have studied a while: the vowel-stream and the consonant-stream are simply your whole name pulled into two, so their raw totals add back into the Expression exactly — MIA's 10 and 4 return to 14, the Expression itself. What the world sees and what the soul wants are two readings of one name.",
    "## The gift in the pack: your Birthday",
    "The fifth core number is the friendliest to find: your Birthday number is simply the day of the month you were born, with no arithmetic required. Where the Life Path speaks of the whole journey, the Birthday is a single, specific talent you brought along for it — a gift already unwrapped. Someone born on the 3rd carries an easy expressive charm; the 8th, a native feel for the material world; the 22nd carries the master-builder's reach even before it is reduced to a 4. A double-digit day is read twice — for its own texture and for the number it folds down to — so the 29th is both a 2-and-9 sensitivity and, reduced, an 11's bright intuition. Small as it is, this number often names the very thing people thank you for without your ever having tried.",
    "## How five become one soul",
    "Set the five side by side and resist the urge to average them — a soul is not a single blended figure but a small ensemble, five instruments playing at once. The Life Path lays the melody, the long line of the piece; the Expression supplies the gifts that ornament it; the Soul Urge is the feeling that chose the song; the Personality is the room's acoustics; and the Birthday is one bright, recurring motif. You are not the loudest of these, and not their sum — you are the chord they make together. Part of the pleasure of a chart is learning to hear each strand clearly without ever losing the whole.",
    "And the strands rarely agree, which is precisely where a chart turns interesting rather than flattering. A Life Path 7, walking a road of solitude and study, might carry a Soul Urge 2 that aches for partnership and an Expression 3 built to perform for a crowd: a private mystic, longing for closeness, gifted at dazzle. Read shallowly, that looks like confusion; read well, it is the whole human being — the scholar who teaches beautifully and goes home lonely, learning across a lifetime to let the three make peace. When your numbers pull in different directions, they are not errors to reconcile away; they are the tension that makes you a person and not a slogan. The long work of a life is often exactly the conversation between them.",
    "So begin anywhere — the day is easiest, the name most revealing — and calculate one core number tonight, another tomorrow. Lay them over each other slowly and let the map assemble; there is no rush, and no wrong order. Whether this is your first step or you have walked with numbers for years, the same quiet marvel waits at the end of the arithmetic: that five small figures, honestly read, can hold something as large and contradictory and alive as you.",
  ]},
  { id: "masters", cat: "Numerology", colour: "#7fd4e0", title: "Why 11, 22 and 33 refuse to be reduced", min: 7, body: [
    "Nearly every number in numerology gets 'reduced' — folded down digit by digit until a single figure remains. 29 becomes 2 + 9 = 11, and 11 would ordinarily become 1 + 1 = 2… except it doesn't. It stops. Three numbers — 11, 22 and 33 — are left standing at full height, and numerologists call them master numbers. The rule is simple to state and strangely hard to feel: when a total lands on a doubled digit that also happens to be a resonant one, you hold it there rather than fold it away.",
    "If you're new to this, reduction isn't mathematics for its own sake. It's a way of asking, 'what essence hides inside this bigger pattern?' Most patterns simplify happily — they were only ever a longer way of spelling a single note. A few refuse to simplify, and that refusal is itself the message. The master number is the one place in the whole system where the arithmetic pauses and says: don't put this away yet, there is more current here than a single digit can carry.",
    "## Where the masters show up",
    "A master number can appear in any of the core positions, and it means something slightly different in each. On the Life Path — the reduction of your whole birth date — it colours the arc of an entire life, the long lesson you were born partway into. On the Expression (or Destiny), drawn from the full birth name, it describes the scale of what you're built to make and be seen doing. On the Soul Urge, the sum of the vowels, it points inward: an 11 heart hungers for meaning and resonance, a 22 heart aches to build something that outlasts it, a 33 heart wants to pour care into the world. It can also surface as a Personality number, from the consonants, or simply as a Birthday — anyone born on the 11th or the 22nd carries a small dose of the voltage regardless of the rest of the chart.",
    "The rarest and most telling case is repetition. When the same master number turns up in two or three positions — an 11 Life Path that also carries an 11 Soul Urge, say — the theme stops being a feature of the chart and becomes its spine. Seasoned readers watch for this the way a musician notices a motif returning in a new key: once is character, twice is destiny. And a gentle caution for beginners — a genuine master number only counts when the position's own total lands on 11, 22 or 33. Spotting a stray '11' in the middle of an unrelated sum, or in a running tally you were meant to keep reducing, doesn't make a master number. The refusal has to happen at a real resting place.",
    "## The master number tax",
    "Here is the part the glossier books skip. A master number is not a gift you unwrap on your birthday — it is a bill that comes due slowly, and almost everyone pays the reduced form first. An 11 lives for years as a competent, peace-keeping 2; a 22 as a diligent, methodical 4; a 33 as a warm, dutiful 6. The higher octave switches on later, usually under real pressure — grief, a calling that won't let go, a responsibility too large to hand back. This is the master number tax: the intensity arrives before the maturity to hold it, and the wiring has to be built up to carry a current it wasn't born ready for.",
    "You can often feel the switch-on before you can name it. It tends to look like a recurring, oversized theme that keeps finding you no matter how you arrange your ordinary life — the 11 who cannot stop sensing what a room is feeling, the 22 who keeps being handed projects that dwarf the brief, the 33 whom everyone quietly comes to for repair. There's usually a season of overwhelm first, a sense that the volume is set too high for the equipment. That flicker is not failure. It's the reduced self meeting a demand only the master octave can answer, and learning, unevenly, to rise to it.",
    "## Three doorways: 11, 22 and 33",
    "11 is 2's sensitivity turned up until it hums — the Illuminator, intuition so fine it can frighten its own carrier. At its best it is prophetic instinct, magnetism, a spiritual antenna tuned to frequencies others miss, and the gift of making a whole room feel understood. Its shadow is the anxiety that rides shotgun with all that sensitivity: nervousness, self-doubt, a mind that amplifies every signal until it can't tell insight from static. The 11 that hasn't made peace with its own wiring oscillates between visionary and frayed — dazzling one week, paralysed by second-guessing the next. The work is grounding: rituals, rest, a trusted person to check the readings against, so the antenna can stay switched on without shaking itself apart.",
    "22 is 4's builder-craft raised to cathedral scale — the Master Builder, handed blueprints too big for one lifetime and the stubbornness to try anyway. It marries vision to discipline, turning dreams into things you can actually stand inside: institutions, bodies of work, structures that outlast their maker. Its shadow is overwhelm and burnout. Because the 22 can see the whole cathedral at once, it feels the full weight of it at once too, and either flogs itself to exhaustion trying to build it all today or freezes, crushed by a scale no single day can match. The medicine is the opposite of grandeur: pour one footing, lay one course, trust the structure to accrue. A 22 that learns to work in ordinary days builds the extraordinary; a 22 that demands the whole thing at once builds nothing but its own collapse.",
    "33 is 6's care widened into vocation — the Master Teacher, whose classroom is simply the way they live. It is the rarest of the three, a healing presence, selfless wisdom, love offered without an invoice attached. Its shadow is martyrdom: care that curdles into self-erasure, giving until the giver is hollow, a quiet tally of sacrifice that no one asked for and no one can repay. The 33 who cannot receive burns out into resentment or exhaustion, teaching by cautionary example instead of by joy. Its lesson is almost embarrassingly simple and almost impossibly hard — to let itself be cared for in return, so the well it draws from never runs dry.",
    "## The argument over 44 and beyond",
    "If the logic is 'doubled digits stay unreduced,' why stop at 33? It's a fair question, and numerologists genuinely disagree. A conservative lineage holds that only 11, 22 and 33 qualify, because these sit directly atop the foundational 2–4–6 and complete a natural triad — illumination, construction, teaching — beyond which the system has nothing coherent left to say. A more expansive camp counts 44, 55, 66 and up as higher master numbers, reasoning that the same refusal to reduce should apply all the way. In practice 33 is already so rare as a lived Life Path that 44 and above are largely theoretical — and here the beginner's guardrail matters most: any number can pile up doubled digits mid-calculation without meaning a thing. The honest position is that the big three are established craft, and everything above them is contested extrapolation you're free to explore but shouldn't mistake for settled ground.",
    "## Living the voltage without burning the wiring",
    "So how do you carry one of these without it carrying you off? Start by respecting the reduced form rather than resenting it — the 2, 4 and 6 are not a lesser self to outgrow but the wiring that has to hold the current, and neglecting them is how the voltage arcs into anxiety, burnout or martyrdom. Build the mundane supports the shadows demand: grounding and rest for the 11, incremental patience and delegation for the 22, receiving and boundaries for the 33. Expect the switch-on to be uneven, and don't read the flicker as proof you were never a master number after all. Above all, remember what the whole tradition, from Pythagoras onward, keeps insisting — that number describes the shape of a life, not its worth. If your chart holds no master numbers at all, hear this clearly: the masters are not 'better'. A 7 who truly lives its depth out-shines an 11 who hides from its own light. The number is the instrument — the music is always yours.",
  ]},
  { id: "karmic", cat: "Numerology", colour: "#7fd4e0", title: "Karmic debt numbers: 13, 14, 16 and 19", min: 7, body: [
    "Sometimes, on the way to a reduced number, your birth date or name passes through one of four way-stations: 13, 14, 16 or 19. Traditional numerology calls these karmic debt numbers - old lessons asking to be finished this time around. They are not extra figures you carry alongside your core chart; they are hidden inside it, visible only in the arithmetic, like the grain of wood beneath a coat of paint. Most people live their whole lives beside one without ever being told its name.",
    "Don't let the word 'debt' frighten you. This is not punishment; it is unfinished curriculum. A karmic number simply marks the place where the soul says: 'here - this one we practise until it's beautiful.' The older traditions imagined a ledger carried between lifetimes, but you needn't believe in past lives to feel the truth of it. Everyone knows the sensation of a lesson that keeps returning in fresh costumes until it is finally, properly learned.",
    "## Debt, or merely difficulty?",
    "It helps to say plainly what a karmic debt is not. Every chart has friction - Challenge numbers, tension between the core figures, a Life Path whose temperament simply runs against the grain of the life it is given. Those are difficulties, and difficulty is ordinary. A karmic debt is narrower and far more specific: it is one of exactly four totals - 13, 14, 16 or 19 - surfacing before a number reduces. What sets it apart is the pattern. A plain difficulty is a headwind you lean into; a karmic debt is a circle, the same situation arriving again and again, each time asking the same question in a slightly louder voice. And unlike a Master number, which raises the voltage of a chart, a debt does not amplify - it corrects.",
    "You find them by watching the totals before reduction. If your Life Path calculation passes through 16 on its way to 7, you are a 7 - and the 16 tells you which door your 7 walks in through. The reduced number is who you are; the debt behind it is the weather you grew up in. Only these four totals count, and only when they arise honestly in the sum. A 4 that arrives cleanly as 2+2 carries no debt at all; a 4 that arrives as 13 carries the whole of it. Same destination, entirely different road.",
    "## Where a debt can hide",
    "These four can surface in any of the core positions, and each position tints the lesson a different colour. In the Life Path - the sum of the whole birth date - the debt describes the arc of the entire life, the theme the years keep circling back to. In the Expression or Destiny, drawn from the full birth name, it shapes how you meet the world and what your gifts keep tripping over. In the Soul Urge, taken from the vowels, it lives in the private wanting; in the Personality, taken from the consonants, in the face you turn outward. It is one lesson seen through several windows.",
    "Two positions deserve special mention, because beginners so often miss them. The Birthday number is simply the day of the month you were born - and if that day is the 13th, 14th, 16th or 19th, the debt sits there in plain sight, needing no calculation at all. The Personal Year, found by adding your birth month and day to the current year, can likewise pass through one of the four on its way to reducing: a single twelve-month season coloured by that old lesson, a year the theme comes round for review. A debt in the Birthday or the Personal Year is gentler and more time-bound than one woven through the Life Path, but the flavour is unmistakable once you have learned to taste it.",
    "## The four lessons",
    "13, living as 4, is the debt of work left undone - the shortcut taken, the task abandoned, the wish for something handsome in return for nothing. It arrives as a life in which ease is quietly withheld. What comes effortlessly to others seems to ask of you a foundation laid stone by stone, and every shortcut you attempt has a way of collapsing and sending you back to the beginning. This can feel unfair until you notice the mercy hidden in it: disciplined, patient labour does not merely work for the 13 - it compounds, raising something sturdier than talent alone could ever build. Repayment looks unglamorous. It is showing up on the ordinary Tuesday, finishing the thing you started, keeping the promise no one is watching you keep - and waking one morning to find the ground beneath you no longer shifts.",
    "14, living as 5, is the debt of freedom once misused - appetite let off its leash, commitments dropped for the next bright thing, the senses indulged until they ran the whole house. It returns as a life pulled hard toward escape: restlessness, overindulgence, the itch to bolt the instant a door begins to close. The 14 is not asked to renounce freedom - freedom is its birthright and its genius - but to put a spine inside it. The lesson is moderation discovered from the far side of excess, adaptability that chooses rather than merely reacts. Paying it feels like catching yourself mid-overdo - one more drink, one more purchase, one more abandoned plan - and, for once, setting the appetite down on purpose. Freedom used well, rather than freedom fled into, is the entire debt repaid.",
    "16, living as 7, is the debt of the toppled tower - and the name is deliberate, echoing the sixteenth card of the Tarot, the Tower struck by lightning. It is the debt of pride in love and spirit: the self built too high, the heart offered with an ego attached, the intimacy that was quietly about control. Life meets it with sudden, disorienting collapse - the relationship that ends without warning, the identity that falls away, the certainty that proves hollow - always clearing a false foundation so a truer one can be laid. It is the most frightening of the four to live through and the most transforming to complete. Repayment feels like being emptied and then, in the quiet afterward, discovering you are still there: it is loving without possessing, meeting the spirit before reaching for another person, letting what is false fall so that what is real can finally stand.",
    "19, living as 1, is the debt of power once hoarded - authority misused, help refused, the self set so far above others that it ended up alone. It comes back as a life that keeps insisting you stand on your own feet, often by stripping your supports away and daring you to manage anyway. Yet the same life teaches the opposite truth in the same breath: that no one arrives entirely unaided, and that leaning is not the same as failing. The 19 must grow strong enough to lead and humble enough to be helped - and in the end those are one lesson, not two. Paying it feels like the day you finally ask, after years of refusing, and find that the sky does not fall. Fittingly, the older Chaldean tradition reads 19 as among the most fortunate of all numbers, the 'Prince of Heaven' - a reminder that this debt, more than any other, is shadowed by real promise.",
    "## What paying it actually feels like",
    "Across all four, repayment shares a texture. It is rarely a single dramatic reckoning, and almost never a lightning-bolt of insight that settles the matter forever. More often it is the slow discovery that the situation you kept meeting has stopped arriving - that the circle has quietly become a spiral, each turn a little higher than the last. You do not pass a test and graduate; you simply notice, one season, that the old temptation has loosened its grip, that the thing which used to knock you flat now merely leans against you. The debt lightens by degrees, in exact proportion to how honestly it is met, and that meeting is made of small, unwitnessed choices far more than grand ones.",
    "Seen kindly, a karmic number is the most hopeful thing in a chart: it means the lesson is not vague but named, not endless but completable, and already ripe enough to be worked. The debt only lingers while it is ignored. To find one of these four in your own numbers is to be handed, in a single figure, both the difficulty you were born knowing by heart and the precise shape of your freedom from it.",
  ]},
  { id: "personalyear", cat: "Numerology", colour: "#7fd4e0", title: "The nine-year cycle: your Personal Years", min: 7, body: [
    "Astrology has its transits, tarot its spreads — and numerology has the Personal Year, its quiet, faithful instrument for reading time. Where your Life Path describes the whole road, your Personal Year tells you which stretch of it you are walking right now: the weather of the twelve months ahead, and what those months are gently asking of you. It is the most practical tool in the numerologist's kit, and one of the easiest to learn.",
    "Underneath it lies an old and beautiful idea — that a life does not move in a straight line but in a spiral. We return, season after season, to familiar ground, yet never quite at the same height. Pythagoras taught that 'all is number', that reality is patterned and countable to its roots; the Personal Year applies that intuition to time itself, proposing that our years are not a random scatter but a repeating cycle of nine. Learn the shape of the cycle and the calendar stops being a blur of events — it becomes a rhythm you can move with instead of against.",
    "## Finding your Personal Year",
    "The calculation is gentle. Take the month of your birth, the day of your birth, and the current calendar year, and add them together — then reduce the total to a single digit. Your month and day never change; only the year advances, and that advance is what turns the wheel. One graceful detail for those who like precision: because the Personal Year cycle runs cleanly from one through nine, we reduce all the way down here rather than pausing at the master numbers — though a total that passes through 11 or 22 on its way lends that year a higher, more charged undertone worth noting.",
    "Say you were born on the fifteenth of March. Your month is 3; your day, 15, reduces to 1 + 5 = 6; and the year 2026 reduces to 2 + 0 + 2 + 6 = 10, then 1 + 0 = 1. Add the three — 3 + 6 + 1 = 10 — and reduce once more: 1 + 0 = 1. You are in a Personal Year 1, standing at the very start of a fresh nine-year arc. Next year the same birthday yields a 2, the year after a 3, and so on until the cycle completes and renews.",
    "When does the new number actually click over? Here two respected schools differ. Many numerologists simply switch the year at midnight on the first of January, which keeps everyone's cycle tidy and shared. Others hold that your Personal Year truly turns on your birthday, ripening through a 'ramp' of a few months on either side — so a January reading and a birthday reading blur together in the weeks around your solar return. Neither is wrong; try both against your memory of recent years and keep whichever tells you the truer story.",
    "## The nine seasons",
    "The first three years open the arc like a spring. A Personal Year 1 is the planting year — new beginnings, bold first steps, seeds pushed into fresh soil; it rewards courage and initiative, and asks you not to cling to whatever the last cycle ended. A Personal Year 2 slows the tempo on purpose: a year of patience, partnership and quiet tending, when the seed works underground and pushing too hard only bruises it — collaboration, diplomacy and rest do the real labour now. A Personal Year 3 is the first bloom — expression, creativity, colour and joy, a season to speak, make, gather and let the delight of the earlier planting show its face.",
    "The middle three years are where the harvest is earned. A Personal Year 4 is the builder's season — work, structure, foundations, the unglamorous laying of brick on brick; it can feel heavy, but everything solid in your life is poured in a 4. A Personal Year 5 throws the windows open again: change, freedom, movement, the unexpected — travel, new appetites, the old walls suddenly restless. It asks you to stay loose and curious rather than gripping, because much of it arrives unplanned. A Personal Year 6 comes home to the heart — love, family, responsibility and the beauty of care; it draws the focus to relationships, home and the people who depend on you, and rewards the tending of them.",
    "The final three years bring the cycle to its fullness and its close. A Personal Year 7 turns inward — retreat, study, reflection and spiritual deepening; it is the hermit's year, quieter and more solitary by design, and its wisdom is not to force outer results but to go beneath them. A Personal Year 8 is the harvest and the year of power — recognition, money, achievement, the material return on years of sowing; it asks you to step fully into your authority and to receive what you have built without apology. And a Personal Year 9 is completion and release — a long exhale, a clearing-out of what is finished, so that hands and heart are empty enough for what comes next; it is a year for endings honoured, forgiveness given, and space made.",
    "## The turning of the wheel",
    "The seam between a 9 year and the 1 that follows is the most important threshold in the whole cycle — and the one people most often fight. After a 9, a year that may have stripped away a job, a relationship, a whole identity, the temptation is to grab immediately at something new. But the 9 is the compost that feeds the seed of the coming 1; what you release becomes the ground you will plant in. Rush the ending and the beginning arrives thin-soiled and pale. Honour the 9, let it empty you honestly, and the 1 opens with astonishing fresh power. You cannot skip a season — the wheel turns in order, or it does not turn at all.",
    "## The finer grain: Personal Months",
    "For sharper timing still, the Personal Year subdivides. To find a Personal Month, add your Personal Year number to the number of the calendar month and reduce — so a person in a Personal Year 1, come April (the fourth month), is living a 1 + 4 = 5 month: a burst of change and movement inside a year of fresh beginnings. Read this way, the year gives the theme and the month gives the tempo, letting you choose when within a season to launch, to rest, to push or to wait. Some numerologists refine further into Personal Days, though for most lives the year and month together are guidance enough.",
    "The quiet magic of all this is how it dissolves the friction of timing — your own, and other people's. So much struggle comes from expecting the same thing of every year and every person: straining for a harvest in a planting year, or resenting a partner for wintering while you are in bloom. Once you know that your restless, world-changing friend is simply sprinting through a 1 while you are lighting the lamps of a 9, half your quarrels turn back into mere weather. The cycle is not a cage and not a prophecy; it is a rhythm older than worry. Learn where you stand in it, and you can finally stop rowing against the current — and let the season carry you where it was always going to.",
  ]},
  { id: "pinnacles", cat: "Numerology", colour: "#7fd4e0", title: "Pinnacles and Challenges: the four seasons of a life", min: 7, body: [
    "Your Life Path names the whole road, but no life is walked in a single weather. A person is born in spring rain and dies in some far winter, and in between the light changes more than once — ground that grew corn one decade learns to grow something else the next. Numerology has names for this turning: the four Pinnacles, the long seasons of opportunity, and the four Challenges, the recurring lessons woven through them. Both are drawn from the very same three numbers that make your Life Path — the month, the day, and the year you were born — only now the question is not simply who you are, but when.",
    "The oldest root of the craft is Pythagoras's conviction, around 570 BCE, that 'all is number' — that the cosmos is legible in ratio and pattern. The Pinnacle-and-Challenge framework itself is far younger, a refinement of the modern Pythagorean revival that flowered across the twentieth century, when numerologists began to ask the birth date not only for a portrait but for a calendar. It is an advanced layer, and a lovely one, because it invents nothing new: it takes the three humble components you already reduced for your Life Path and re-reads them as a map of timing. Learn it once and your own chart quietly gains a fourth dimension.",
    "## How the four pinnacles are built",
    "Begin where you always begin — reduce your birth month, your birth day, and your birth year each to a single digit. (For this layer we reduce all the way; the Pinnacles are assembled from these plain digits.) From those three numbers, four peaks are made. The First Pinnacle is your month plus your day. The Second is your day plus your year. The Third is the first two Pinnacles added together. The Fourth is your month plus your year. Reduce each result to a single digit — keeping 11, 22 or 33 if one appears — and you are holding the four seasons of a life in your hand.",
    "Notice that these peaks are only new arrangements of the same threads that spin your Life Path; the number governing the whole is present, rewoven, in every season of it. The First Pinnacle is the long one, the formative morning of a life: it runs from birth until the age of thirty-six minus your Life Path number. (If your Life Path is a master number, reduce it for this one sum — 11 becomes 2, 22 becomes 4, 33 becomes 6.) After it come three seasons of nine years each, and the Fourth Pinnacle, once reached, stays with you to the end. A low Life Path opens the second season early; a high one lets the first ripen longer. It is worth doing this small arithmetic for yourself, because it tells you almost to the year when your own weather last turned — and when it will turn again.",
    "## What a pinnacle asks of you",
    "A Pinnacle number is not a prophecy of events; it is the prevailing wind of a season, the theme the years keep returning to. Under a 1 Pinnacle the air favours beginnings, independence, the nerve to author your own life. A 3 season loosens the tongue and the brush — expression, delight, company, creative overflow. A 6 turns the heart toward home, love, and responsibility, so that marriages and mortgages and the care of others tend to belong here. A 7 draws you inward toward study, solitude, and faith; a 9 brings the long exhale of completion, harvest, and letting go. Should a master 11 or 22 rule a season, expect intensity — the wind blows harder, toward vision, or toward building something meant to outlast you.",
    "Because the seasons are long, their edges are where a life is felt to pivot. Many people can point to the very year a chapter closed and another opened — a move, a marriage, a vocation found or shed — and often that year sits precisely on the seam between two Pinnacles. The change need not be dramatic to be real; sometimes it is only that the same person, in the same house, begins to want different things. Knowing a turn is coming robs it of none of its grace. It simply lets you meet it awake.",
    "## The four challenges",
    "If the Pinnacles are the wind, the Challenges are the knots — and they are made not by adding the birth-date components but by subtracting them. Take the absolute difference each time, always the smaller from the larger. The First Challenge is your month and your day; the Second, your day and your year; the Third, often called the main or lifelong Challenge, is the difference between those first two; the Fourth is your month and your year. Here we never keep a master number — Challenges reduce all the way down — and, uniquely, a Challenge can come out as 0.",
    "A Challenge number names the lesson you keep being handed until it is learned — not a punishment, but a teacher who returns each term. A 1 Challenge asks you to find your own authority without either shrinking from it or bullying with it. A 2 Challenge is the tenderness that tips into over-sensitivity and self-doubt, slowly learning to trust its own worth. A 3 asks the scattered, self-critical maker to speak anyway; a 4 tests your patience with limits, order, and honest labour. And the 0 Challenge — the challenge of choice — hands you every tool and no excuse: with no single obstacle imposed, you must choose your own discipline. It tends to visit old souls who have, in some sense, done this work before.",
    "In any given season a Pinnacle and a Challenge run together, the opportunity and its accompanying knot. A 6 Pinnacle of love and home laid over a 2 Challenge of self-doubt, for instance, describes years rich in relationship yet asking, again and again, that you believe yourself worthy of the love you are given. Read the two as a pair and a season stops being abstract. It becomes a specific invitation with a specific lesson folded inside it — which is, after all, how real life tends to arrive.",
    "## A worked example",
    "Picture someone born on the twelfth of April, 1977. The month is 4; the day, 12, reduces to 3; the year, 1977, reduces to 6 (1+9+7+7 = 24, and 2+4 = 6). Their Life Path is 4+3+6 = 13, which becomes 4. The First Pinnacle is month plus day, 4+3 = 7. The Second is day plus year, 3+6 = 9. The Third is those two summed, 7+9 = 16, reducing to 7. The Fourth is month plus year, 4+6 = 10, reducing to 1. Their first, long season ends at thirty-six minus four — age 32; the second runs 32 to 41, the third 41 to 50, and the fourth from 50 onward.",
    "Now the Challenges, by subtraction: month minus day is 1; day and year differ by 3; the difference of those two is 2 (the lifelong knot); month and year differ by 2. So this life opens under a 7 Pinnacle of study and inwardness carrying a 1 Challenge — a long youth spent learning to think for oneself and claim one's own authority. It matures into a 9 season of completion shadowed by a 3 Challenge to keep expressing and not fall silent, and settles at last into a 1 Pinnacle of fresh beginnings late in life — proof that new roads can open in any season, not only the first.",
    "## Reading the seasons kindly",
    "Hold all of this lightly. A Pinnacle is an invitation, not a verdict — it tells you which way the wind is set so you can raise the right sail, not that the voyage is already decided. A Challenge is a teacher, not a sentence; it does not vanish when you 'pass' it, but it softens, the knot loosening a little each time you work it with patience instead of force. Neither one overrides your Life Path or your free will. They are the texture of the road, not its destination.",
    "Used well, the four seasons let you stop fighting your own weather. There is little sense in forcing beginnings in a season built for harvest, or clinging to what a 9 Pinnacle has come to release. Learn where you stand among your own four seasons and you can plant what the ground is ready to grow — which is, in the end, all that any calendar of the soul is for. For first steps and old souls alike, that is a quietly practical kind of grace.",
  ]},
  { id: "livednumbers", cat: "Numerology", colour: "#7fd4e0", title: "The numbers you live inside: homes, phones and beyond", min: 7, body: [
    "Your Life Path describes the road you walk — but numerology has always noticed that we also *live inside* numbers. Long before street signs and dial tones, Pythagoras taught his students that 'all is number' — that quantity is not laid over the world but woven through it. The address on your door, the digits in your pocket, the plate on your car: these are frequencies you brush against every single day, and a craft as old as counting insists they are quietly in conversation with you. The good news, which we will come back to, is that it is a conversation — not a sentence.",
    "You find a home's number the way you find any core number — add the digits and reduce. Number 47 becomes 4 + 7 = 11, a master-number home, a lightning rod under a roof. A flat like 12B counts the letter too, because letters have always carried values in this practice: B is a 2, so 12B sums to 1 + 2 + 2 = 5, a home that will never quite sit still. None of this overwrites who lives there; it flavours the air they breathe. Think of it less as destiny and more as the key signature a house is playing in — you can still sing any melody you like over it.",
    "## The nine airs of a place",
    "A 1 home is a launchpad — it suits the founder, the soloist, the person forging a fresh identity, and it can turn lonely when no one is invited in. A 2 home is tender and diplomatic: it favours couples and close friendships, softens sharp edges, and asks only that its people not sink into its moods. A 3 home is a salon — laughter, colour, half-finished paintings, guests who overstay in the best way — wonderful for artists and quietly ruinous to anyone trying to concentrate or save.",
    "A 4 home steadies its people; it rewards routine, honest work and saved money, though it can begin to feel like all labour and no play if joy is never scheduled in. A 5 home keeps the suitcase by the door — comings and goings, travel, appetite, romance, and a restlessness that never quite lets the last box get unpacked. A 6 home is the truest nest of all: the number of love, family and beauty, it wants to feed people and hold them, and its only shadow is the host who gives until nothing is left on her own plate.",
    "A 7 home is a hermitage — quiet, bookish, a little set apart from the street; it is heaven for writers, seekers and anyone healing, yet it can turn so inward that the world forgets to knock. An 8 home hums with ambition and money; it magnifies enterprise and status and keeps a strict ledger — meet it with integrity and it builds you, cut corners and it collects. A 9 home quietly gathers people who are finishing chapters of their lives; it is generous, artistic and thrown open to the whole world, which is also why things — money, objects, tenants — tend to pass through it rather than settle.",
    "Master-number homes are rarer and more charged. An 11 address is that lightning rod — inspired, intuitive, occasionally nerve-jangling, and always happier when it is grounded by ordinary ritual. A 22 address is a master builder's plot, suited to large, patient, world-shaping work; a 33 address, rarest of all, carries the air of a place given over to teaching and care. Read a master home as a raised voltage running through whichever single number it reduces to — an 11 is still practising the lessons of 2, only louder and with less sleep.",
    "## The lines and vessels we carry",
    "Phone numbers work exactly the same way — add every digit, reduce, and you have the line's vibration, the kind of conversations it tends to attract. An 8 line hums with opportunity and negotiation, a fine number for a working SIM; a 2 line becomes the one friends call at midnight to feel heard. It sounds fanciful until you change numbers and notice, months later, that the tenor of who reaches you has quietly shifted. You need not chase a 'lucky' line — but when the shop offers you a choice of three, you now have one more beautiful way to listen.",
    "The same air fills the rooms where we work. An office or shopfront wears its street number like a mood: an 8 address flatters a firm built on deals and growth, a 3 unit suits a studio that lives on ideas and delight, a 6 door is kind to a clinic, a bakery, anywhere people come to be cared for. A business that keeps stalling at a 7 address is not cursed — it may simply be a contemplative number trying to run a marketplace, and a little more visibility, warmth and outward welcome can rebalance it. Founders weighing one suite against another can hold this beside the footfall and the light.",
    "Even the machines we travel inside carry a number, read from the digits on the plate. A car is a 5 thing by nature — motion, freedom, the open road — so its number tends to colour the journeys rather than the household. A 4 car is the dependable workhorse that starts on the coldest morning; a 3 car collects road-trip laughter and long, wandering talk; an 8 car always seems to be driving toward a meeting that matters. It is a small, playful reach of the same principle: wherever you spend your hours, a number is keeping you company.",
    "## Choosing the moment things begin",
    "Numerology does not only describe the spaces we occupy; it can help us choose the *moments* we step into. Reduce a full date — month plus day plus year — and you have that day's own number, and the old electional instinct is to match the day's air to the thing you are beginning. A 6 day loves a wedding: 8 June 2026 reduces to 6 + 8 + 1 = 15 → 6, the number of love and lasting home (the year 2026 folding down to its 1). A launch, a shop opening or a signature leans naturally toward 1 for fresh starts or 8 for money and momentum — 8 January 2026 reduces to 1 + 8 + 1 → 1, a clean beginning; 8 August 2026 reduces to 8 + 8 + 1 = 17 → 8, a day humming with commerce.",
    "A few dates repay a second look. A 9 day — 20 June 2026 reduces to 2 + 6 + 1 → 9 — is glorious for a farewell, a graduation, a release or a final performance, but a strange day on which to begin a marriage, since 9 is the number of endings and completion. A 5 day suits travel and change more than vows meant to hold still. Adepts layer one more question on top: how does the chosen date sit inside your own Personal Year (your birth month plus birth day plus the current year, reduced)? Marrying or launching during your personal 1 or 6 year, on a day that agrees with it, is the difference between swimming with the current and against it — and it is worth noting that 2026 itself reduces to a Universal 1 year, a worldwide season for beginnings.",
    "## Balance, and consent",
    "None of this is fate — it is furniture, and furniture can be rearranged. If your home or office runs hot (1, 5, 8), balance it with grounding ritual: shared meals, plants, stone, unhurried routine. If it runs quiet or heavy (2, 4, 7), invite aliveness in on purpose — music, guests, colour, movement. A 9 space that keeps losing things wants a little 4-style order; a 3 space that never finishes anything wants a little 4-style spine; a 6 home whose host is worn thin needs someone else, now and then, to do the cooking. You are not correcting the number so much as answering it.",
    "Here is the deeper principle, for those who have walked with numbers a long while: environment-numerology is the practice of *consent*, never of fate. A hard number over the door has never doomed a household, and a lucky one has never rescued a careless one; the digit describes the room's weather, while you remain the one who decides what to wear and whether to open the window. Choose your address, your line and your wedding day with this in mind and you lose nothing while gaining a quiet fluency — a way of noticing the frequencies you already live inside, and of answering them on purpose. You are not ruled by the number on the door. You are in conversation with it.",
  ]},
  { id: "pairs", cat: "Numerology", colour: "#7fd4e0", title: "Numerology for two: how paths entwine", min: 6, body: [
    "Compare two Life Paths and you are really asking a quiet, enormous question: what does each soul come here to practise — and what happens when two lifelong practices have to share a kitchen? A Life Path is not a personality quiz; it is the curriculum a person is working through this time around. So a pairing is never two flavours stirred together but two disciplines meeting — sometimes rhyming, sometimes wrestling, always teaching. Read this way, no chart can tell you whether to love someone. It can only tell you what the love will ask of you both.",
    "Pairings tend to fall into three weathers, and it helps to name yours before you read the forecast. Some bonds flow, some balance, some forge — and each weather is its own kind of good. The mistake beginners make is to crave only the flowing kind, as though friction itself were failure. In truth the three weathers are simply three ways two numbers can be honest with one another.",
    "## The three weathers",
    "Flowing bonds share a dialect. The classic examples are 3 with 5 and 2 with 6, and the reason runs deeper than luck. Three (the creator, the voice, the bright child of the chart) and five (the adventurer, the sensualist, the lover of open doors) are both expansive and restless, allergic to cages — they speak the same fast language and rarely need it translated. Two (the diplomat, the tender partner) and six (the nurturer, the keeper of the hearth) are both relational to the bone, organising their whole lives around care and connection. Energy moves easily here and laughter comes cheap; the only real danger is shallowness, because easy love still needs deliberate roots, or it drifts pleasantly nowhere.",
    "Balancing bonds pair a strength with its complement — opposite instincts that happen to interlock. One with two is the pioneer and the peacemaker: the first goes first, the second makes the going bearable for everyone in the room. Four with nine is the mason and the visionary: four lays the wall brick by patient brick while nine blesses it with a meaning larger than any single wall — and each saves the other from a private failure, four from building things that mean nothing, nine from dreaming things that never get built. These couples spend their days quietly translating for one another, and the translation is the intimacy. What looks like difference from the outside feels, from the inside, like being completed.",
    "Forging bonds put iron against iron. One with eight sets personal will against executive power — two natural commanders, each certain they should be holding the map; handled with respect it is heat and growth, handled with ego it is a turf war in the living room. Four with five is even more elemental: the fence and the open road, security in love with freedom, the one who wants routine bound to the one who wants the horizon. These pairings throw sparks off the anvil, and that is precisely the point — four teaches five to finish what it starts, five teaches four to breathe, and nothing on earth makes stronger metal than two people willing to be reshaped by the friction.",
    "## No doomed numbers",
    "Hear this before anything else: there are no doomed pairings in numerology, and no guaranteed ones either. A 'difficult' combination between two conscious, honest people outgrows an 'easy' one between two sleepwalkers every single time. The chart describes the dance floor, never the dancers' skill — it can tell you the tempo and the tilt of the room, but not whether you will listen to the music or tread on each other's feet. That part was never written in the numbers. It is written, nightly, by how you choose to treat each other.",
    "When a master number turns up in a pairing — an 11, a 22 or a 33 in either chart — it adds voltage to whatever weather already exists. Eleven pours in more intuition and nervous brilliance, twenty-two more world-building ambition, thirty-three more devotional care, and all of it turned up loud. Master-number love is rarely lukewarm. It asks for grounding rituals built for two — ordinary meals, early nights, bare feet on the floor — exactly because the current running through it is so high.",
    "## The other three layers",
    "The Life Path is the loudest voice in a chart, but it is not the only one, and adepts rarely stop there. Each full name yields three more numbers worth comparing: the Expression (the whole name — your outward gifts and working style), the Soul Urge (the vowels — what the heart privately wants), and the Personality (the consonants — the self you show at the door). Set two people's charts side by side and these quieter layers often tell a subtler, truer story than the Life Paths alone.",
    "Compare Expressions and you learn how two people will actually get things done together — not what they came to learn, but how they naturally move through a day. Two lovers can share flowing Life Paths and still grate at the level of Expression, one a methodical 4 who plans the holiday in a spreadsheet, the other an improvisational 5 who wants to miss the train on purpose. This is the number of collaboration: whose hands do what, who speaks up in the meeting, how the labour of a shared life gets divided. When two Expressions harmonise, a couple builds smoothly even while their souls are chasing quite different horizons.",
    "Compare Soul Urges and you touch the most private thing of all: what each heart is secretly reaching for, underneath every visible choice. This is where the real surprises live. Two people can look mismatched on the surface — clashing Life Paths, opposite Expressions — and yet carry the same Soul Urge, both quietly aching for freedom, or for home, or for the divine; and that hidden agreement can hold a marriage steady through decades of surface friction. The reverse is the quiet tragedy: partners who match beautifully in public and privately want opposite things. Once you know each other's Soul Urge, you stop mistaking a difference of longing for a lack of love.",
    "## Standing in different seasons",
    "Finally, compare Personal Years, and half of all timing arguments dissolve on the spot. Your Personal Year — birth month plus birth day plus the current year, reduced — tells you which season of a nine-year cycle you are standing in, and two partners are almost never standing in the same one. A partner in a 1 Year is sprinting at dawn, hungry to launch and begin and plant; a partner in a 9 Year is lighting lamps at dusk, ready to release, complete and let things end. Put a 4 Year (build, stay, work) beside a 5 Year (change, move, risk) and watch them quarrel about when to buy the house — not because either is wrong, but because they are reading from different calendars. The numbers do not settle the disagreement; they reframe it, from 'you never want what I want' into the far kinder 'we are simply in different seasons, and seasons turn.'",
    "Use the Partnership calculator here as a beginning, not a verdict. Run the two Life Paths, then go deeper — lay the Expressions beside each other, whisper the Soul Urges, check which season each of you is walking through this year. Every number you compare opens one more door in the conversation. But the numbers only ever open the door. You two, night after ordinary night, are the answer.",
  ]},
  { id: "history", cat: "Numerology", colour: "#7fd4e0", title: "Where numerology comes from: Pythagoras, gematria and the sacred number", min: 7, body: [
    "Before numerology was a chart you could cast on a birthday, it was a suspicion — an old, persistent hunch that the world is not a heap of unrelated things but an order, and that the order can be counted. To follow that hunch back to its source is to travel a long way, past the birthday tables and the reduction sums, to a handful of civilisations that each, in their own tongue, arrived at the same astonishing idea: that number is not something we invented to tally sheep, but something we discovered lying underneath everything.",
    "## The man and the music",
    "Pythagoras of Samos (c.570 – c.495 BCE) stands at the head of the Western story, though he is a strangely shadowed figure to be so famous. He left no writings; his school at Croton, in the Greek south of Italy, was a secretive brotherhood that pooled its discoveries and credited them all to the master; and most of what we 'know' reaches us centuries later, thickened with legend — the golden thigh, the memory of past lives, the ability to be seen in two cities at once. Sober history keeps only a little: that he existed, that he taught a way of life as much as a doctrine, and that his followers held number to be the key to everything. Our earliest reliable witness is Aristotle, writing well over a century afterward, who reported that the Pythagoreans 'supposed the elements of numbers to be the elements of all things.'",
    "That is the seed of the whole tradition: all is number. The Pythagoreans did not mean merely that things can be counted. They meant that number was the hidden grammar of reality — that each number carried a character, a quality, a role in the order of the cosmos. One was the monad, the indivisible source; two the dyad, the first division and so the first tension; odd numbers were ranked with limit and light, even numbers with the boundless. To think in numbers was, for them, to read the mind of the world. It is a conviction our modern practice still runs on, every time we say that a 4 is patient and a 5 is restless.",
    "What turned the hunch into a certainty was music. The Pythagoreans found that the intervals the ear calls beautiful correspond to simple whole-number ratios: halve a taut string and it sounds the octave (2:1); take two-thirds of it and you hear the fifth (3:2); three-quarters gives the fourth (4:3). Here was harmony — the most bodily, immediate pleasure — revealed to be arithmetic you could hear. The famous tale of Pythagoras deducing all this from the ringing hammers of a blacksmith is almost certainly a legend, and acoustically it does not even work; but on a single stretched string, the monochord, the ratios are real, and anyone can check them. From that discovery grew the grandest Pythagorean image of all: the harmony of the spheres, the planets themselves sounding inaudible chords as they turn, the whole sky a piece of music written in number.",
    "## The tetractys",
    "If one figure held all of this, it was the tetractys: ten dots arranged in a triangle of four rows — one, then two, then three, then four. Its beauty is that four humble counting numbers, stacked, sum to the perfect ten (1+2+3+4=10), and along the way they spell out the very ratios that make music: 2:1, 3:2, 4:3. The Pythagoreans revered it enough to swear their most solemn oath upon it — 'by him who gave to our soul the tetractys, the fountain and root of ever-flowing nature.' It was, in effect, a diagram of how the many flow from the one: a shape you could hold in the mind as a picture of the cosmos coming into being, rung by rung.",
    "It is worth being honest here about lineage. The system most English speakers call 'Pythagorean numerology' — the one that assigns 1 to A, 2 to B, and counts the letters of a name into a Life Path — is not a document handed down from Croton. Pythagoras almost certainly never numbered an alphabet; the practice we use took its modern shape barely more than a century ago, in the writings of revivalists such as L. Dow Balliett and, later, Juno Jordan. What is genuinely Pythagorean is not the method but the faith behind it: the trust that a name and a birth date are not noise, that number can carry meaning. The old master lends the tradition his conviction, and his name, more than his arithmetic.",
    "## The wider river",
    "Greece was only one tributary. In the Hebrew world every letter of the alphabet doubled as a numeral — aleph is one, bet is two, on through yod for ten, then the tens and hundreds — so that every word was also, quietly, a sum. This is gematria (the word itself probably a Hebrew borrowing of the Greek geōmetria), and it became a way of reading scripture in depth: when two words share a numerical value, the tradition treats them as secretly related, each illuminating the other. Its most familiar fruit is small and warm — the letters of chai, 'life,' add to eighteen, which is why eighteen and its multiples are still given as blessings and gifts in Jewish custom. In the hands of the Kabbalists, gematria became a vast instrument for hearing the harmonics beneath the plain sense of the Torah.",
    "The Greeks did the same with their own letters and called it isopsephy — from isos, 'equal,' and psephos, the little pebble once used for counting. Lovers scratched it on the walls of Pompeii ('I love her whose number is 545'); and its most notorious appearance is in the Book of Revelation, where the number of the beast, 666, is almost certainly an isopsephic cipher for 'Nero Caesar' spelled in Hebrew letters — a reading quietly supported by early manuscripts that give the variant 616, exactly the value of the same name in its Latinised form. The instinct is identical to the Hebrew one: if letters are numbers, then names have sums, and a sum can hide a truth in plain sight.",
    "Further east the river runs older still, though here we must tread carefully between history and label. Babylon gave the ancient world its star-watchers — the Chaldeans, whose name became a byword for astrology — and its mathematicians, who counted in sixties and left us the sixty minutes and the 360-degree circle we keep to this day. India developed its own rich symbolism of number, binding certain numbers to the planets and encoding numerals within syllables. Modern numerology borrows freely and reverently from all of it. But it is worth saying plainly: much of what is sold today as 'ancient Chaldean' or 'Vedic' number-lore is a modern synthesis wearing antique dress. The reverence is genuinely old; the specific systems are often young.",
    "## Two systems, two philosophies",
    "Two of those systems dominate practice today, and it helps to know how they part ways. The Pythagorean system — by far the more common in the English-speaking world — is elegantly plain: the alphabet is numbered in order and folded into the nine digits, so A/J/S are 1, B/K/T are 2, and on to I/R at 9. Every letter has a value, nine is fully in play, and the whole thing is transparent enough to work out on the back of an envelope. Its virtue is accessibility; its logic is the logic of order, of a letter's position in a sequence.",
    "The Chaldean system is older in feel and stranger in shape. It runs only from 1 to 8, holding 9 back as sacred — too holy, in this tradition, to be pinned to an ordinary letter — and it numbers letters not by their place in the alphabet but by the vibration of their sound, so the values fall in an order no child could recite. Each number is tied to a planet, knotting the name back to the sky. Popularised in the West largely by the Edwardian palmist and seer known as Cheiro, it takes the name of Babylon as a badge of antiquity more than a certificate of descent. Where the Pythagorean asks what a name spells, the Chaldean asks what a name sounds like — and expects the two to give different, complementary answers rather than a single right one.",
    "Why has number felt sacred to so many peoples who never met? Perhaps because it is the one language the universe seems to speak on its own. A shepherd and a king count the same way; three is three in every tongue and on every world; the ratios that make a lyre sweet in Greece make it sweet everywhere, forever. Number looks less like something we made up than something we found already there, waiting — which is why Galileo, two thousand years after Croton, could still call mathematics the language in which the book of nature is written. To practise numerology, then, is to take that ancient intuition personally: to suspect that the same order humming under the planets and the musical scale is humming, too, under your own name and the date you were born. Whether you cast your chart in the Pythagorean or the Chaldean key, you are doing the oldest thing the tradition knows — listening for the number beneath the thing, and trusting that it means something.",
  ]},
  { id: "bigthree", cat: "Astrology", colour: "#b898e8", title: "Sun, Moon and Rising: your three-fold self", min: 6, body: [
    "'What's your sign?' almost always means your Sun sign — where the Sun stood on your birthday. It is real and it matters: the Sun is your core voltage, the hero of your story, the thing you are learning to *be*. But a birth chart is a whole sky caught in a single instant, and the Sun is only its brightest light, not its only one. Ask that famous question and you are handed a single word — Leo, Pisces, Scorpio — as though a person could be summed in one syllable. Two other placements share the throne with it, and until you know all three, you are reading a book by its title alone.",
    "This is the quiet scandal of the horoscope column: it speaks to one-twelfth of you and calls it the whole. Everyone born inside the same roughly month-long window carries the same Sun sign, yet no two of them are the same person — because behind that shared Sun, the Moon was racing through a fresh sign every two and a half days, and the eastern horizon was turning up a new sign every two hours or so. Those two faster hands, the Moon and the Ascendant, are what make your sky yours and no one else's. The old astrologers named the Sun and Moon the two *luminaries* — the lights — and set the Rising beside them as the third pillar of any first reading. Learn to feel all three and the flat cartoon of 'your sign' rounds out into a living person.",
    "## The Sun: your core voltage",
    "The Sun is the centre you orbit — the steady fire your whole chart turns around. In the old language it rules vitality itself: the life-force that gets you out of bed, the thing that dims when you are living someone else's life and blazes when you are living your own. But its deepest secret is that it describes less who you *are* than who you are *becoming*. A Sun sign names a quality you spend a lifetime growing into, not a trait stamped on you at birth like a serial number. The Leo is learning to be generous with their light; the Capricorn to author their own authority; the Pisces to trust what cannot be proven — and none of them arrives finished. That is why the Sun can feel, in youth, like a size of clothing you have not yet grown into.",
    "You feel your Sun most clearly in what restores your sense of purpose after it has been drained. Watch where your energy *returns* rather than leaks — the activities that leave you more yourself than when you began. A Sagittarius Sun comes back to life on the open road, or mid-argument about the meaning of things; a Virgo Sun is quietly recharged by putting one small corner of the world in order; a Libra Sun by making something, or someone, more beautiful and more fair. When people say they feel 'lit up,' they are describing the Sun doing its literal work. Follow that light and you are following your solar sign home, whatever the calendar happens to call it.",
    "## The Moon: the tides underneath",
    "If the Sun is who you are becoming, the Moon is who you already were — the child you started as, still living inside you. Your Moon sign is where the Moon sat at the moment of your birth, and it governs the tides beneath the visible self: your emotional weather, your reflexes, what safety actually feels like in the body. It is who you are at two in the morning when no one is performing, the self that reaches for comfort before the thinking mind has woken. Where the Sun asks *what am I here to do*, the Moon asks the older, softer question — *am I safe, am I held, am I home*. Many people, especially in private and especially in love, feel far more like their Moon than their Sun.",
    "Because the Moon rules need, it also rules the exact shape of comfort — and that shape differs wildly from sign to sign. A Cancer Moon is soothed by home, familiar food, the people it has quietly claimed as its own; a Gemini Moon settles by talking it out, by turning the feeling into words; an Aries Moon needs to *move* the emotion, to burn it off in action rather than sit inside it; a Capricorn Moon feels safe only once it knows it is competent and in control. This is why couples so often love each other and still fail to comfort each other — each offers the soothing their own Moon would crave, in a dialect the other's Moon does not speak. Learn your Moon and you learn how to parent your own inner child; learn a beloved's Moon and you finally know how to reach them when they are hurting.",
    "## The Rising: the doorway self",
    "The Rising sign, or Ascendant, is the sign that was climbing over the eastern horizon at the exact minute you drew your first breath. Picture the dawn of your birth: as the Earth turned, one sign after another lifted into view, and whichever was cresting the horizon in that instant became your Rising. It is the doorway self — the mask you meet the world in, your instinctive style of entering a room, the first impression you make before you have said a word. It even shapes the body and its manner: the tilt of the walk, the cast of the face people feel they have half-met before. This is why so many people 'don't seem like their sign.' They are being read, quite correctly, by their Rising — the self that answers the door.",
    "But the Ascendant is far more than a first impression, and here is where beginners are usually short-changed. The Rising is the hinge the entire chart hangs on. It sets the first house, and from there it deals out all twelve houses in order — deciding which province of your life each of your planets will actually colour. Change the Rising and you re-room the whole sky: the same Mars becomes drive poured into career in one chart and into intimacy in another. That is why astrologers call the Ascendant the *lens* over the reading — every other placement is seen through it, tinted by it, angled by it. It is not one voice among three so much as the frame the other two are heard inside.",
    "All of which is why the Rising asks the one thing the Sun and Moon can forgive you for lacking: an accurate birth *time*. The horizon turns a full circle every twenty-four hours, lifting a new sign roughly every two hours, so even an hour's error can hand you the wrong Ascendant — and, worse, shuffle all twelve houses out of place. If you do not know your birth time, this is the single best reason to hunt down the birth certificate, ask the parent or relative who was there, or write to the hospital. Without it, the Sun and Moon still ring true, but the Rising, and the whole house structure it governs, stays a door you cannot quite open.",
    "## The three in one breath",
    "Here is a formula worth carrying: the Rising is how you enter the room, the Sun is why you came, and the Moon is what you need before you can leave whole. The Ascendant is the outermost layer, the one strangers meet first; the Sun is the core beneath it, revealed as they come to know you; the Moon is the innermost chamber, shown only to those you trust with the two-a.m. self. Think of a house — the Rising is the front door and the face of the building, the Sun is the hearth burning at its centre, the Moon is the private room upstairs where you go to be soothed. One dwelling, three depths, and you live at all of them at once.",
    "It is tempting, learning these, to feel like three different people stitched together — but the three are one person, always. Take a Leo Sun with a Cancer Moon and Scorpio Rising. From across a room this person reads as Scorpio: watchful, magnetic, self-contained, giving little away. Come closer and the Leo core warms into view — genuinely generous, wanting to be seen, happiest when their light lands on someone. And behind closed doors the Cancer Moon runs the emotional household: deeply tender, needing home and belonging, wounded more easily than the guarded surface would ever admit. That is not a contradiction but a sequence — the Scorpio mask is precisely how a soft Cancer heart learns to shield its bright Leo fire in a world that does not always deserve it. When the three seem to pull against one another, that tension is not a flaw to correct; it is the particular music of that person, three instruments in one body learning to keep time.",
    "## Feeling them in your own life",
    "You can catch all three in a single ordinary evening once you know where to look. The moment you walk into a gathering and some reflex decides how to hold yourself — that is your Rising, choosing the mask before you have thought about it. The subject you find yourself talking about with real heat, the craft or cause that makes you feel most *you* — that is your Sun, showing its purpose. And the small ache for a particular comfort as the night winds down — to go home, to be held, to be alone, to be fed — that is your Moon, asking for what it needs before it can rest. Nothing esoteric is required; the three are already running. Astrology only teaches you their names.",
    "So return to that first question and answer it more truly. If you know your birth time, Luminae's natal reading can begin weaving all three into one portrait — Sun through Moon through Rising, and the houses the Ascendant unlocks. If you do not, the Sun and Moon will still speak plainly: find your Moon among the signs and simply *feel* for the tide that recognises you, the description that makes something in you go quiet with recognition — your own resonance is evidence too. 'What's your sign?' — you have three, and they are not rivals. One tells the world you have arrived, one tells you why you came, one tells you what you will need before you can leave the room whole. Hold all three at once and the flat little word you were handed on a birthday opens into something far more interesting: a self with a surface, a centre and a depth — a whole sky, caught at the one moment it became yours.",
  ]},
  { id: "signs", cat: "Astrology", colour: "#b898e8", title: "The twelve signs: a field guide to the zodiac", min: 8, body: [
    "Ask a room of people their sign and you will hear twelve different words said in twelve different tones — some proud, some sheepish, one or two defiant. But the zodiac is not a bag of twelve unrelated labels drawn from a hat. It is a single wheel, divided with almost suspicious elegance, and the moment you see the architecture the whole thing stops being a list to memorise and becomes a pattern you can read. Every sign is a precise crossing of two simpler ideas — an element and a modality — and no two signs cross them the same way. Learn that grid and each sign's genius and blind spot stop being trivia you look up and start being something you can reason out.",
    "There are four elements — Fire, Earth, Air, Water — the raw temperaments beneath everything: Fire acts, Earth builds, Air thinks, Water feels. Running across them are three modalities, the tempo at which each temperament moves: cardinal signs begin a thing, fixed signs sustain it, mutable signs change it and hand it on. Four elements times three modalities makes exactly twelve, and here is the elegant part — each of the twelve pairings occurs once and only once. Aries is the sole cardinal fire, Leo the sole fixed fire, Sagittarius the sole mutable fire; there are no duplicates and no gaps, no two flavours alike. The wheel is anchored in the turning year, too: in the tropical zodiac Aries opens at the spring equinox, Cancer at the summer solstice, Libra at the autumn equinox and Capricorn at the winter solstice — which is exactly why the four cardinal signs, the openers, each stand at the hinge of a season.",
    "## Spring: the self is born (Aries · Taurus · Gemini)",
    "Aries (21 March – 19 April) is cardinal fire, ruled by Mars, and its keyword is the most primal in the zodiac: I am. It comes first because it is the first act — the green shoot cracking frozen ground, the impulse that moves before the mind can talk it out of moving. At its best Aries is pure courage and clean beginning: it goes first so the rest of us learn a thing can be done, and it forgives fast because it is already looking at the next horizon. Its shadow is that same fire turned reckless — an impatience that abandons the voyage mid-ocean, a temper that speaks before the soul has finished voting. The lifelong art of an Aries is learning which battles actually deserve so beautiful a flame, and which are only noise.",
    "Taurus (20 April – 20 May) is fixed earth, ruled by Venus, and its keyword is I have. If Aries is the spark, Taurus is the ground that receives it and makes it grow — the gardener of the zodiac, patient, sensual, loyal to whatever is real enough to be touched, tasted or kept. Its genius is endurance: where others chase, Taurus stays long enough for things to actually bloom, and its steadiness can settle a whole panicking room. The shadow is comfort curdled into a cage — a stubbornness that mistakes not-moving for principle, and a grip on the familiar that outlasts the familiar's usefulness. Taurus grows by learning that some things must be released for the garden to keep growing at all.",
    "Gemini (21 May – 20 June) is mutable air, ruled by Mercury, and its keyword is I think. Here spring exhales into pure curiosity — the messenger of the zodiac, twin currents of a mind quick enough to hold two truths at once and dart between them like light on water. Gemini's gifts are wit, wordcraft and an almost magical ease with strangers; it gathers ideas the way others gather keepsakes, then hands them out, freshly wrapped, as conversation. Its shadow is scatter — a dozen half-open windows, brilliance that never quite lands, and the clever trick of speaking fluently around a feeling rather than through it. The Gemini lesson is depth: to choose, at least sometimes, where to alight and stay.",
    "## Summer: the self shines and serves (Cancer · Leo · Virgo)",
    "Cancer (21 June – 22 July) is cardinal water, ruled by the Moon, and its keyword is I feel. As the first water sign it opens summer by opening the heart — it reads the temperature of a room before it steps inside, and it carries home with it wherever it goes, offering shelter the way others offer a handshake. Its light is fierce nurture: a long memory for kindness, an intuition that arrives as simple knowing, a loyalty that will defend its own to the very last. The shadow is the shell — retreating sideways, crab-fashion, into moods and silence instead of naming the tender thing out loud. Cancer's growth is to trust that its softness is a strength it chooses, not a wound it is caught hiding.",
    "Leo (23 July – 22 August) is fixed fire, ruled by the Sun itself, and its keyword is I will. It is the only sign governed by the star we orbit, and it burns accordingly — warm, steady, generous, built to give heat rather than merely take the light. At its best Leo is radiant loyalty and creative courage, a heart that dignifies everyone it truly notices and guards its people the way a lion guards the pride. Its shadow is that same warmth grown hungry — a heart that can mistake applause for love, or dims the people around it so its own gold looks brighter. The royal lesson is simple to say and hard to live: real gold warms the whole room; it never needs to outshine it.",
    "Virgo (23 August – 22 September) is mutable earth, ruled by Mercury, and its keyword is I serve. As summer ripens toward harvest, Virgo arrives with the discerning eye that parts wheat from chaff — it sees the missing stitch in any fabric, the one detail that would make the whole thing finally work. This is devotion disguised as precision: its love language is improvement, its craft the sacred, unglamorous maintenance that quietly keeps the world running. The shadow is the inner critic handed a megaphone — perfection wielded as a form of procrastination, and a worry so outward-facing it forgets to turn its own tenderness inward. Virgo heals the day it learns that it, unedited, was never a rough draft in need of fixing.",
    "## Autumn: the self turns toward the other (Libra · Scorpio · Sagittarius)",
    "Libra (23 September – 22 October) is cardinal air, ruled by Venus, and its keyword is I balance. It opens autumn at the equinox — the single day the light stands perfectly even — and it spends a lifetime seeking that equipoise everywhere else. Libra is the zodiac's diplomat and aesthete, for whom beauty and fairness are not luxuries but something nearer to justice; it has a real genius for making peace feel possible and rooms feel gracious. Its shadow is decision by committee — a self-erasing habit of abandoning its own side of the scale to keep everyone else level, until harmony decays into mere quiet. Libra matures the moment it remembers that its own truth belongs on the scale too.",
    "Scorpio (23 October – 21 November) is fixed water, ruled by Pluto (and by Mars in the older tradition), and its keyword is I desire. It lives at the depths the rest of us only visit — intimacy, mystery, power, the whole cycle of death and rebirth are its native waters. Scorpio does not do casual; it does transformation, meeting you with an X-ray honesty and a devotion that goes all the way down or not at all. Its shadow is control worn as armour — a sting saved for precisely the people who got closest, a betrayal remembered in the bones for decades. The Scorpio work is to go deep without drowning, to trust another without needing to hold the entire ocean still.",
    "Sagittarius (22 November – 21 December) is mutable fire, ruled by Jupiter, and its keyword is I seek. It is the arrow and the horizon at once — faith, wander, laughter, and a philosopher's genuine hunger for what is true. As autumn's last fire it takes Scorpio's hard-won depth and flings it outward toward meaning: travel, belief, the big question asked out loud in a quiet room. Its gifts are an optimism that can heal a whole gathering and an honesty that flatly refuses to flatter. The shadow is the exit door left permanently ajar — a restlessness that bolts the instant things ask for staying, and truth delivered without a drop of anaesthetic. Sagittarius grows by learning to stay present while it aims.",
    "## Winter: the self meets the world and the infinite (Capricorn · Aquarius · Pisces)",
    "Capricorn (22 December – 19 January) is cardinal earth, ruled by Saturn, and its keyword is I build. It opens winter at the solstice, in the year's longest dark, and it climbs anyway — born with a mountain in its eye and the patience to summit it. This is the elder of the zodiac: endurance, mastery, a dry and unexpected humour, a spine strong enough to carry the whole family tree. Time is its ally rather than its enemy. The shadow is a worth measured only in output — a loneliness at altitude, the achiever who forgot it was already worthy long before the achievement arrived. Capricorn's summit teaches what the valley never could: that it was always more than what it builds.",
    "Aquarius (20 January – 18 February) is fixed air, ruled by Uranus (and by Saturn before Uranus was found), and its keyword is I know. It is the lightning that visits the village — future-sighted, communal, gloriously unbothered by how a thing has always been done. Aquarius holds the paradox of the humanitarian who needs solitude to love humanity well: it belongs to the many, to the movement and to friendship raised to an art form, yet it thinks most clearly from a slight, cool distance. Its gifts are vision, invention and a fierce loyalty to principle. The shadow is a head so far into tomorrow that the heart misses today — detachment used as a place to hide. Aquarius ripens by belonging to the room it is standing in, not only to the future it can see.",
    "Pisces (19 February – 20 March) is mutable water, ruled by Neptune (and by Jupiter in the older reckoning), and its keyword is I believe. It is the zodiac's final chapter, and it carries a little of all eleven signs that came before it — which is why the world pours itself so easily into a Pisces, and why its compassion arrives without borders. Its gifts are mystic antennae, artistry, and an almost effortless forgiveness; it feels the unspoken and translates it into music, image or mercy. The shadow is escape — dissolving into dream, fog or fantasy the moment the shore turns sharp, mistaking every boundary for a wall. Pisces learns, slowly, that it can feel absolutely everything and still choose; the banks are what let the river actually flow.",
    "## One year, one story",
    "Read straight through, the twelve are not rivals but a single narrative told in twelve breaths — the year-long autobiography of a self. Aries strikes the first spark of I am; Taurus gives it a body and a garden; Gemini gives it language; Cancer, a heart and a home; Leo, a voice and a will; Virgo, a craft and a use. Then the wheel turns outward and the story stops being only about the self: Libra discovers the other, Scorpio the depths that open between two people, Sagittarius the meaning that outruns any single relationship. Capricorn builds all of it into the world, Aquarius offers it to the many, and Pisces, at the very end, dissolves the whole hard-won self back into the ocean it came from — just in time for Aries to be born again out of the spring. Each sign is the medicine for the one before it and the seed of the one after; every gift, carried too far, becomes precisely the shadow the next sign was built to answer.",
    "So your Sun sign is one chapter of that story read especially loud in you — but you carry the entire wheel. Your Moon may speak fluent Pisces while your Sun strides through Capricorn and your Rising greets the door as a Gemini; a full chart is all twelve signs distributed across your sky, each governing some room of your life. That is the deeper invitation of any field guide to the zodiac: not to shrink yourself down to a single word, but to recognise, sign by sign, the whole cast already living inside you — the courage and the caution, the shine and the depth, the builder and the dreamer — and to learn, over the length of a life, to let each of them speak in its proper season.",
  ]},
  { id: "elements", cat: "Astrology", colour: "#b898e8", title: "Fire, Earth, Air, Water — the sky's four temperaments", min: 7, body: [
    "The twelve signs are not twelve strangers — they are four families, three siblings apiece. Long before astrology counted planets it counted temperaments: Fire, Earth, Air, and Water, the four elements the ancient world believed everything was woven from. In a birth chart they are not literal flames and rivers but four ways of being alive — four answers to the question of how a soul meets its own existence. Fire runs on inspiration and wants to act; Earth runs on manifestation and wants to build; Air runs on connection and wants to understand; Water runs on feeling and wants to bond. Learn to hear which element is speaking, and half of astrology's noise resolves into music.",
    "The word to hold is *temperament* — not a mood you are in, but the climate you are made of. Medieval physicians mapped the same four onto the body's humors: fiery choler, earthy melancholy, airy blood, watery phlegm — and a healthy person was simply one in whom the four ran in balance. Astrology inherited that wisdom and kept its most useful instinct: that no element is good or bad, only warm or cool, moist or dry, and that trouble is almost always a matter of too much or too little rather than wrong. As we meet each family in turn, notice which one you recognise as home, and which one goes strangely quiet in you. Both are telling the truth.",
    "## Fire — the spark that must move",
    "Fire is the element of Aries, Leo, and Sagittarius — the ram who charges, the lion who reigns, the archer who aims past the horizon. It is ruled, family-wide, by the boldest lights: Aries by Mars, Leo by the Sun itself, Sagittarius by expansive Jupiter. Fire moves through the world by inspiration and action; it does not deliberate its way toward life so much as ignite and go. Where the other elements gather evidence, fire trusts the leap — the hunch, the vision, the sudden certainty that *this* is the way. It is the courage in a chart, the faith that anything can begin at all, and it warms every room it does not accidentally set alight.",
    "Fire loves the way it does everything — immediately, generously, out loud. It adores the chase and the grand gesture, wants to be dazzled and to dazzle back, and stays devoted so long as the romance keeps its spark. Its excess is the wildfire: impatience, ego, a heat that scorches the very people it means to warm, burning through projects and lovers because tending the slow middle bores it. Its lack is a hearth gone cold — the person who cannot rouse desire or self-belief, who waits for permission to want, whose days have lost their forward pull. Fire in balance is not the biggest flame in the room; it is the one that keeps others warm without consuming them.",
    "## Earth — the hand that shapes",
    "Earth is the element of Taurus, Virgo, and Capricorn — the bull in its meadow, the harvester in the field, the mountain goat climbing the sheer rock of ambition. Venus rules sensual Taurus, Mercury sharpens Virgo's craft, and Saturn sets Capricorn its long patient tasks. Earth moves through the world by manifestation and sensing; it trusts what it can touch, weigh, plant, and finish. Where fire asks 'what if,' earth asks 'what is' and 'what will it cost' — and then, unglamorously, does the thing. It is the element that turns vision into harvest, the reason anything gets built, tended, repaired, and made to last.",
    "Earth loves through devotion made physical: the meal cooked, the bill paid, the body held, the promise kept across years without fanfare. It is slow to give its heart and slower still to take it back, showing love less in declarations than in reliable, unshowy presence. Its excess is the stone that will not move — rigidity, materialism, a caution that mistakes the rut for the road and calls stagnation 'realism.' Its lack is the ungrounded life: brilliant plans that never touch soil, a body neglected, a chronic sense of scarcity or of never being quite substantial enough. Earth in balance is not heaviness; it is trustworthiness — the quiet gravity that lets everyone else's dreams find a place to land.",
    "## Air — the current that connects",
    "Air is the element of Gemini, Libra, and Aquarius — the twin trading ideas, the scales weighing every side, the water-bearer pouring vision over the crowd. Mercury quickens Gemini's tongue, Venus gives Libra its love of harmony, and Uranus — with old Saturn behind it — lends Aquarius its cool, inventive distance. Air moves through the world by connection and thought; it lives in the space *between* people and things: in language, pattern, comparison, the long human conversation. Where earth touches, air names; where water merges, air relates while keeping just enough distance to see. It is the element of perspective, the mind lifted high enough to notice how everything talks to everything else.",
    "Air loves with words and the meeting of minds — through wit, correspondence, the delight of being genuinely understood and of understanding in turn. It needs conversation the way fire needs fuel, and it can fall for a voice, an idea, a rapport long before it notices the body across the table. Its excess is the gale that never lands: overthinking, detachment, a coolness that analyses a feeling instead of having it, forever debating the map and forgetting the territory. Its lack is a life without perspective — trapped inside its own single mood, unable to step back, reconsider, or ask whether another view might be truer. Air in balance is clarity that stays kind: the rare capacity to see all sides and still choose one.",
    "## Water — the tide that feels",
    "Water is the element of Cancer, Scorpio, and Pisces — the crab guarding its tender inside, the scorpion diving to the depths, the fish dissolving the line between self and sea. The Moon rules Cancer's tides, Pluto (with Mars beneath it) gives Scorpio its intensity, and Neptune (with Jupiter behind it) grants Pisces its oceanic reach. Water moves through the world by feeling and bonding; it knows things before it can say them, reading the emotional temperature of a room the instant it enters. Where air keeps its clarifying distance, water closes the gap and merges — it is the element of empathy, memory, intuition, and the invisible threads that tie us to one another. It does not so much think about life as absorb it.",
    "Water loves the deepest of the four and the most completely, fusing with the beloved until 'you' and 'I' blur into a single tide. It offers tenderness, loyalty, and an uncanny attunement to what you feel before you have admitted it — and asks, in return, to be let all the way in. Its excess is the flood: overwhelm, moodiness, a boundarylessness that drowns in others' pain, or a clinging that manipulates to keep from being left. Its lack is the dry heart — emotionally illiterate, uneasy with need, mistaking numbness for strength and intimacy for danger. Water in balance is not fragility; it is depth with banks — the one who feels everything and is not swept away.",
    "## The balance of a whole chart",
    "No one is a single element, and this is where the four become a craft. Take every placement in a chart — the Sun, Moon, and rising, then each planet — sort them into their families, and a personal weather map appears: perhaps four points of fire, three of air, one lonely drop of water, no earth at all. That tally often reveals more than the Sun sign ever could. A missing element is not a flaw but a hunger; it names the quality you did not inherit and must therefore learn on purpose — usually by loving people who carry it, and by building, deliberately, the habit your chart forgot to give you.",
    "A flooded element is the opposite trouble — the same note struck so many times it drowns the melody. A chart drenched in water may feel everything and finish nothing, forever weathering storms no one else can see. A chart crowded with fire burns bright and brief, lighting a hundred fires and tending none. Too much earth can harden into a life that mistakes its own walls for the horizon; too much air can spin so high it forgets it has a body at all. The gift you are richest in is also, reliably, the gift you overspend — and the work of a life is often learning to turn its volume down, not up.",
    "This is why the elements are not rivals but a single ecology, each supplying what another cannot. Fire needs earth to give its inspiration a form that lasts; earth needs fire to keep its patience from curdling into rut. Air needs water to warm its ideas into meaning; water needs air to lift its feeling into words and give the flood a shore. The classical eye saw it in the qualities themselves — fire and air share warmth and quicken one another, earth and water share coolness and steady one another, while the cross-pairs must *work* to meet. So when you feel flat, borrow the element you lack: too airy and anxious, touch earth — cook, garden, walk barefoot; too scorched by fire, return to water — bathe, weep, listen to rain. The four elements are a first-aid kit as old as the sky, and a whole life is simply the art of keeping all of them lit.",
  ]},
  { id: "planets", cat: "Astrology", colour: "#b898e8", title: "The planets: the cast of your inner sky", min: 8, body: [
    "Open a birth chart and you do not meet a single face — you meet a company. Ten moving bodies, each a distinct character with its own appetite and gift, arranged around the wheel of your life like players taking their marks. Astrology's oldest insight is that the sky is not one voice but an ensemble, and that the drama of a life is what happens when these ten begin to speak to one another. To read a chart well is first to know the cast: who each planet is, what it hungers for, how it tends to show up in a life, and the sign it calls home.",
    "There is a hidden logic to their order, and it is written in the sky itself. The bodies nearest and swiftest — the Moon crosses a sign in two and a half days, the Sun in about a month — press closest to who you personally are. The slow, far ones, by contrast, move too gradually to mark one soul apart from another: Pluto can linger two decades in a single sign, so it paints whole generations rather than single people. Speed, in other words, is intimacy. As we walk outward from the Sun, the planets grow steadily less about *you* and more about the age you were born into — and that single principle will organise everything that follows.",
    "## The two luminaries",
    "The Sun and Moon are called the luminaries because they do not merely reflect light — in the old cosmology they *are* light, the two great lamps by which everything else is seen. The Sun is your core voltage: purpose, vitality, the hero of your story, the self you are slowly learning to become. It rules Leo, the sign of the lion and the heart, and wherever the Sun falls in your chart is where you are meant to shine, to be seen, to spend your warmth without apology. A Sun run on a dimmer switch feels like a life lived at half-power; a Sun given room looks like a person doing exactly what they came here to do.",
    "The Moon is the Sun's tender opposite — not who you are becoming but who you already are underneath, the emotional body that forms before you have language for it. It governs need, memory, instinct, the reflex to be soothed and to soothe others; it is who you are at two in the morning when nobody is performing. The Moon rules Cancer, the sign of the shell and the tide, and its placement quietly describes what safety feels like to you and how you go about securing it. Many people, especially in private and in love, live far more from their Moon than their Sun, which is why someone can seem to contradict their 'sign' entirely.",
    "Between them the luminaries hold the whole rhythm of a psyche — the Sun's daylight will and the Moon's nightside feeling, the one reaching outward to act, the other turning inward to receive. Neither alone is the true self. The self is the conversation between them, and half the work of a life is teaching these two lamps to burn in the same person without eclipsing each other.",
    "## The personal planets",
    "Closest to the Sun and never wandering far from it, Mercury is the mind in motion — perception, language, curiosity, the way you gather the world and hand it back in words. It governs how you think and speak, learn and bargain, joke and explain and negotiate; it is the swift messenger running between your inner and outer worlds. Mercury holds a double office, ruling two signs: quicksilver Gemini, where it delights in ideas for their own restless sake, and meticulous Virgo, where it turns that same intelligence toward craft, analysis and precision. Three times a year Mercury appears to travel backward — the famous retrograde — a stretch tradition reads not as catastrophe but as an invitation to *re*-view, revise and revisit rather than to launch something new.",
    "Venus is desire's gentler face: love, beauty, pleasure, and the deep question of what you find *worth* having. She governs how you attract and are attracted, what you name beautiful, how you handle money, comfort and the whole art of enjoyment — the grammar of value and taste. Venus too rules a pair: earthy Taurus, where she savours the body, the garden, the reliable sweetness of things you can touch, and airy Libra, where she becomes relationship itself, balance, fairness, the beauty of two held in harmony. Read her placement and you learn what a person will forgive almost anything for, and what they consider a life well spent.",
    "If Venus is the yearning toward, Mars is the force that acts — drive, desire, courage, and yes, anger, the clean heat that says *no* and *mine* and *now*. Mars governs how you pursue what you want, how you compete and defend, the engine of assertion and the way the body turns wanting into motion. It rules fiery Aries, the sign of the first strike and the raw will to begin, and in the older tradition it governed Scorpio as well, lending that water sign its buried, unquenchable intensity. A well-lived Mars is not domination but honest force: the ability to want plainly, to move toward it, and to burn without setting fire to everyone standing near you.",
    "## The social planets",
    "Beyond Mars the planets slow and widen, and we cross into new territory. Jupiter and Saturn are the social planets — the two great teachers standing at the threshold between your private inner sky and the larger world, each taking years rather than months to circle the wheel. Together they form the classic pair of expansion and limit, the gas pedal and the brake, and no life is well made without learning to work both.",
    "Jupiter is the greater benefic, the principle of growth, meaning and grace — the impulse to expand, explore, believe and bless. It governs your sense of the big picture: philosophy, faith, higher learning, travel, generosity, and the conviction that life is going somewhere worth going. Jupiter rules Sagittarius, the archer aiming at far horizons, and in the older scheme co-ruled dreamy Pisces; wherever it sits in your chart is where the world tends to open its hand to you and say *yes*. Its single shadow is excess — Jupiter can promise more than any one day can hold — but at its best it is the planet of the open door and the widening view.",
    "Saturn is Jupiter's necessary counterweight: structure, limit, time, discipline, and the slow-won mastery that only sustained pressure can produce. It governs boundaries, responsibility, consequence — the reality principle that says *not yet* and *earn it* and *this will take years*, and means it kindly, though it rarely feels kind in the moment. Saturn rules Capricorn, the mountain-climbing sign of the long ascent, and anciently ruled Aquarius too. Its great signature is the Saturn return, around ages twenty-nine and again near fifty-eight, when the planet completes a full orbit and life asks you to become, first, the adult and, later, the elder your old structures can no longer avoid becoming. Where Saturn sits is where you will struggle — and therefore, if you stay with it, where you will one day be genuinely wise.",
    "## The outer planets: a generational tide",
    "The last three were unknown to the ancients; each needs a telescope, and each was discovered at a moment whose spirit it seems to carry — Uranus in the age of political revolutions, Neptune amid Romanticism and the first anaesthetics and photographs, Pluto in the years of the splitting atom and the mapping of the unconscious. They move so slowly that they cross a sign in years or whole decades, which means everyone born within a wide span of time shares their placement. These are the *generational* planets: they colour entire cohorts, and they reach you personally mostly through the house they occupy and the sharp aspects they make to your faster, inner planets.",
    "Uranus is the awakener — the lightning-strike of sudden insight, rebellion, freedom, and the future breaking abruptly in. It governs everything that disrupts the settled order: invention, genius, the electric refusal to be caged, the truth that will not wait for permission. Uranus rules Aquarius, the sign of the visionary and the outsider — a rulership modern astrology granted it after its discovery, for Saturn had kept Aquarius before. By sign it marks how a whole generation rebels and innovates; by house and aspect it shows where *you* in particular are built to break free, and where life may deliver its abrupt, liberating shocks.",
    "Neptune is the dissolver of edges — dream, imagination, spirituality, compassion, and the longing to merge with something larger than the small separate self. It governs the mystical and the artistic, the film and the fantasy, devotion and illusion alike, for the same softening that opens the soul to grace can also blur the plain truth. Neptune rules Pisces, the ocean sign where every boundary returns at last to water, displacing an older ruler in Jupiter. By generation it flavours a cohort's shared dreams and its shared delusions; by house and aspect it shows where you are called to transcend, to create, to serve — and where you must take special care not to deceive yourself.",
    "Pluto is the smallest and slowest of the ten, and by far the most concentrated: the lord of power, death and rebirth, of all that is hidden, buried, taboo and profound. It governs deep transformation — the demolition that clears the ground for renewal, the surfacing of what was long repressed, the raw undertow of control and surrender. Pluto rules Scorpio, the sign of the phoenix and the depths, a rulership it inherited from Mars. Across a generation it marks a cohort's collective obsessions and its bargain with power; where it falls in your own chart is where life will, sooner or later, take you down into the underworld and hand you back changed. Its demotion by astronomers to a 'dwarf planet' has not moved astrologers an inch — the pressure it names is still, unmistakably, felt.",
    "## Reading the whole cast",
    "Knowing the ten is only the first act; the real drama is in how they combine. Each planet wears the *sign* it occupies like a costume and a dialect — Mercury in Scorpio thinks like a detective, Mercury in Sagittarius like an explorer — and does its work chiefly in the *house* it stands in, one particular room of your life. A planet placed in the sign it rules is said to be strong, at home, freely itself. And because your Rising sign has a ruling planet, that one body becomes your *chart ruler*, a kind of leading actor for the whole story: follow it, and the scattered wheel begins to organise itself around a spine.",
    "Weigh them, too, by how personal they truly are. Your Sun, Moon and the three swift planets describe you almost fingerprint-close; Jupiter and Saturn place you within the rhythm of your own maturing; the outer three mostly speak of your generation — unless one of them sits on an angle or locks tightly to a personal planet, in which case that slow, vast energy pours directly into a single life. This is why two people born the same week can feel Pluto so differently: the same sign for both, but one carries it quietly in a distant house while the other has it rising, and lives its intensity out loud.",
    "So the birth chart is less a portrait than a company assembled — the luminaries at the centre, the personal planets close and quick, the social pair keeping the gate, and the slow outer three moving like weather across a whole generation. None of them is your fate; each is an instrument, and you are the one slowly learning to conduct. Meet them one at a time, let each teach you its single word — *shine, need, think, love, act, grow, master, awaken, dream, transform* — and the sky stops being a riddle and becomes, at last, a mirror clear enough to read.",
  ]},
  { id: "houses", cat: "Astrology", colour: "#b898e8", title: "The twelve houses: where the sky touches your life", min: 8, body: [
    "If a planet is *who* is acting and its sign is *how* that energy moves, the house is *where* it all comes down to earth. A planet in the sky is a character with a costume; a house is the room that character walks into and goes to work. This is the layer that turns astrology from a portrait into an address — the reason two people born on the very same day, under the same Sun and Moon, can live lives that barely rhyme. The birth chart is a wheel of twelve rooms, and every planet you own is standing in one of them, lighting up one province of an ordinary human life.",
    "The wheel does not begin at the top. It begins at the eastern horizon — your Rising sign, the Ascendant — and turns *counter-clockwise* through the twelve, dipping first below the horizon and then climbing back into daylight. The lower six houses, beneath the line of the horizon, build a private self: body, resources, mind, roots, joy, and daily craft. The upper six, above the horizon, carry that self out to meet the world: partnership, intimacy, belief, vocation, community, and finally the great dissolving. And the whole apparatus turns a full circle every twenty-four hours, which is why the houses, alone among the chart's furniture, demand the hour of your birth. Miss the time and you have the sky's weather but not its map of *your* rooms.",
    "## The lower half: building a self (houses 1–6)",
    "The **first house** is the threshold — the self, the body, and the manner of your arrival. Its cusp is the Ascendant, the mask you wear before you have decided to wear anything, the way you enter a room and meet whatever comes. It governs your physical vitality, your instinctive first move, the impression made before a single word. A person with Mars in the 1st barrels in and asks questions later; a Neptune here softens the edges of the self so that others never quite agree on what they saw. This is the most personal room in the chart, and a planet sitting just inside its door colours everything you are taken to be.",
    "The **second house** is what the self can hold onto: money you earn with your own hands, possessions, and — deeper than either — your values and your sense of worth. It answers the quiet question of what you believe you are allowed to have and to be. It rules income, talents, and the resources you can actually reach and steward, as distinct from the shared and borrowed wealth of the eighth. Venus at home here has a gift for turning taste into a living; Saturn here can grow up feeling poor even amid plenty, and spend a life learning that worth was never a number. This room is where security begins, not as fate but as a relationship with enough.",
    "The **third house** is the near mind and the near world — everyday thought, speech, writing, curiosity, the phone in your hand and the street outside your door. It holds siblings, cousins, neighbours, early schooling, and the short journeys that stitch a life together. This is Mercury's home ground, the house of the restless, note-taking, question-asking intelligence. A crowded third house often marks a life lived in words: the teacher, the writer, the one forever explaining. Where the ninth house will later climb toward the far horizon of grand meaning, the third is content with the honest genius of the ordinary — the errand, the conversation, the thing learned in passing.",
    "The **fourth house** sits at the very bottom of the wheel, the midnight point, and its cusp is the IC — the roots. This is home in the deepest sense: the family line, the ancestry, the nurturing parent, the psychological foundation laid down long before memory. It is the private self no colleague ever meets, the place you return to when the performing is done, and, in the old tradition, the end of life and the grave — the ground the wheel returns to. The Moon is deeply at ease in this room. A wounded planet here can make a person spend decades renovating an inner house they were handed unfinished; a blessed one gives roots that hold in any storm.",
    "The **fifth house** is the heart's overflow — creativity, romance, children, play, and everything made for the sheer joy of making it. This is the room of the love affair and the first flush of falling, of art and performance and sport, of pleasure taken without apology and risk taken for the thrill. It rules children, especially as creative extensions of the self, and any offspring of the imagination. The Sun rejoices here, in Leo's natural room, where a life learns to shine on purpose. A rich fifth house asks a serious question of a serious adult: where, in all your responsibility, do you still allow yourself to play?",
    "The **sixth house** is the least glamorous and most quietly essential — the daily craft that keeps a life running. Here live work (the tasks and routines, distinct from the *vocation* of the tenth), health and the body's maintenance, diet, exercise, habit, service, and the small animals we tend. It is the house of the apprentice and the artisan, of skill honed through unshowy repetition. Mercury and Virgo govern this room, and its virtue is refinement: the doctor, the craftsperson, the person who makes the machinery of ordinary days actually work. Neglect the sixth and the body eventually sends the invoice; honour it and a life gains the humble spine that lets everything else stand up.",
    "## The upper half: meeting the world (houses 7–12)",
    "The **seventh house** stands opposite the first, and its cusp is the Descendant — the point of the other. This is one-to-one partnership: marriage, the committed 'we,' the business partner, the client, the contract, and, in the old texts, the 'open enemy' who opposes you to your face. We tend to meet our Descendant sign in the people we choose, as though the partner carries the very quality we left out of ourselves. Angular and Venus-ruled, this is the house of relating as a discipline — the mirror in which we finally see the parts of ourselves we could only recognise once they walked in wearing someone else's coat.",
    "The **eighth house** is the deep water, and our culture never stops whispering about it. Here is true intimacy — the merging that lies far beyond the fifth's flirtation — along with shared resources, other people's money, inheritance, debt, taxes, and the tangled finances of any bond. It rules death and rebirth, crisis and transformation, the occult, and the depth-psychology of what we would rather not look at. Scorpio and Pluto govern this room, and its work is metamorphosis: the things that end us so that something truer can begin. A strong eighth house does not promise disaster; it promises depth — a life that will be handed, more than once, the alchemy of loss turned into power.",
    "The **ninth house** is the far horizon, the near mind's grown-up twin. Where the third gathered facts on the neighbourhood, the ninth reaches for meaning: philosophy, religion, faith, the search for truth, higher education, and the long journeys — foreign travel, other cultures, the pilgrimage. It rules publishing, the law, the guru and the teacher of teachers, and that restless human hunger to know what it all means. Jupiter and Sagittarius are at home here, expansive and optimistic. A lit-up ninth house makes the seeker, the scholar, the wanderer who cannot be fully happy until the view keeps widening — the soul convinced there is always one more horizon worth the crossing.",
    "The **tenth house** climbs to the very top of the chart, the noon point, and its cusp is the Midheaven — the most public degree you own. This is career in the largest sense: vocation, reputation, standing, the role the world knows you by, distinct from the sixth's daily labour. It holds ambition, authority, the worldly parent, and your visible mark upon the world. Saturn and Capricorn govern this summit, and its lesson is mastery earned in the open. Here is the truest test of the wheel's whole premise: a Leo Sun in the tenth performs its fire on a public stage and needs to be *seen*, while the same Sun down in the fourth warms a home like a hearth and may never want a stage at all.",
    "The **eleventh house** widens the circle from the one to the many — friends, community, groups, teams, networks, alliances, and the causes we lend ourselves to. It is also the house of hopes, wishes, and the future we are walking toward: the tribe we join, as against the child we make in the fifth. Uranus and Aquarius rule this room, tilting it toward the collective, the reformist, the humane. A busy eleventh house builds a life through belonging — the organiser, the connector, the one whose dreams are always larger than a single household. It quietly reminds us that we become ourselves not only in private but in the company we keep and the future we are willing to imagine.",
    "The **twelfth house** is the last room and the hidden sea — the unconscious, dreams, the imagination, mysticism, and everything that works behind the veil. Here are solitude and retreat, what happens off-stage, and the institutions of seclusion (hospitals, monasteries, prisons). The old texts named it the house of 'self-undoing,' the private habits that quietly trip us, and it carries too the karmic residue, the surrender, and the great dissolving back into the collective before the wheel restarts at the first. Neptune and Pisces govern this depth. Read it kindly: this is not a house of doom but of the invisible, where planets are felt more than seen and the most spiritual, compassionate, and creative lives are often quietly made.",
    "## The four angles: the chart's crossbeams",
    "Four of those rooms open onto something more than a room. The wheel is cut by two great axes, like the arms of a compass: the horizon, running east to west, and the meridian, running top to bottom. Their four points are the angles — the Ascendant (ASC) at the eastern horizon, where the sky rises; the Descendant (DSC) at the western horizon, where it sets; the Midheaven (MC, *Medium Coeli*, 'middle of the sky') at the noon summit; and the IC (*Imum Coeli*, 'bottom of the sky') at the midnight root. These four degrees begin the first, seventh, tenth, and fourth houses, and they are the most sensitive, load-bearing points in the entire chart. A planet sitting exactly on an angle is amplified enormously — turned up loud, pushed to the front of a life. If the houses are rooms, the angles are the doorways the whole building is hung upon.",
    "## Angular, succedent, cadent: the three tempos",
    "The twelve rooms also come in three tempos, named for their nearness to those angles. The **angular** houses — first, fourth, seventh, tenth — sit right on the doorways; they carry cardinal, initiating force, and planets here are the most active, visible, and immediately felt. The **succedent** houses — second, fifth, eighth, eleventh — follow behind, with a fixed, gathering quality; they stabilise, resource, and hold on to what the angular houses set in motion. The **cadent** houses — third, sixth, ninth, twelfth — fall away toward the next angle, mutable and adaptive; they are the houses of mind, learning, service, and release. Older astrology called cadent 'weak,' but that undersells them badly: they are simply quieter and more inward, the places where a life processes and transforms rather than announces. Tempo is not worth — it only tells you how loudly, and how soon, a planet tends to speak.",
    "## When a house stands empty",
    "Here is where beginners most often frighten themselves needlessly. There are ten traditional planets and twelve houses, so *at least two houses are always empty*, and most charts cluster their planets in just five or six — empty rooms are the norm, not a flaw. An empty seventh does not doom you to solitude; an empty second does not spell poverty; an empty fifth does not forbid you children or joy. An empty house means only that this arena is not a major theatre of struggle and growth this lifetime — you tend to run it on instinct rather than wrestle with it. To read one, look to the sign resting on its cusp for its flavour, and then to *where that sign's ruling planet lives*, because the ruler quietly carries the house's business off to wherever it sits. An empty seventh ruled by Venus up in the tenth simply weaves your partnerships into your public life; the room is never vacant, only furnished from elsewhere.",
    "This is the deeper reason the houses reward the hunt for your birth certificate. The wheel turns a full circle every twenty-four hours — roughly one house every two hours, the Ascendant sliding a degree every four minutes — so an hour's error re-rooms every planet you own and hands you a different map. Get the time right, and astrology stops being a horoscope written for millions who share your Sun and becomes a floor plan of your one particular life: here is the room where your fire performs, here the room where your heart takes its risks, here the quiet room where your roots go down. That is what the houses are for, for first steps and old souls alike — not to tell you your fortune, but to show you, room by room, exactly where the sky comes down to touch your days.",
  ]},
  { id: "aspects", cat: "Astrology", colour: "#b898e8", title: "Aspects: how the planets talk to each other", min: 7, body: [
    "Learn the planets, the signs, and the houses and you can already name every voice in your chart — but you have not yet heard them speak to one another. Aspects are that speech. They are the angles the planets make across the wheel: the geometry of who is talking to whom, who agrees, who argues, who cannot stop finishing the other's sentences. A placement is a noun; an aspect is a verb. It is the difference between a cast of characters listed on a page and the same characters alive in a room, mid-conversation.",
    "The mechanism is pure geometry. Every planet sits at some degree along the 360° ring of the zodiac, and an aspect is simply the angular distance between two of them. When that distance lands on certain special numbers, the two planets are said to be *in aspect* — locked into a relationship. Those numbers are not arbitrary: they come from dividing the circle by whole numbers, the way a vibrating string divides into halves and thirds to sound an octave or a fifth. Kepler, who took astrology as seriously as he took astronomy, heard the aspects exactly this way — as consonances and dissonances, the harmony of the world. Some intervals ring sweet; some grind; all of them are music.",
    "## The five conversations",
    "A conjunction (0°) is two planets standing on the same spot, so close they have stopped being two. Their energies fuse into a single, amplified voice, and you rarely feel them as separate — you feel the blend as simply *you*. Whether that blend is a blessing or a burden depends entirely on who is fused: Venus conjunct Jupiter pours out warmth and easy abundance, while Mars conjunct Saturn can feel like driving with the handbrake on, effort and restraint welded together. The conjunction is the most concentrated aspect precisely because no distance is left for perspective. It is less a conversation than a marriage.",
    "A sextile (60°) is an open door. It is the aspect of easy opportunity — two planets in friendly, cooperative elements that *could* work beautifully together, if you choose to walk through. The key word is choose: unlike gifts that fall in your lap, a sextile waits to be used, and if you never reach for it, it quietly stays shut, like a language you studied once and let go rusty. It is smaller and gentler than its cousin the trine — a helpful hand rather than a fortune — but it has one great virtue. Because it asks for a little effort, it rarely goes to waste the way pure ease so often does.",
    "A square (90°) is friction, and friction is where most of the real work of a life gets done. Two planets at right angles pull against each other — same intensity, incompatible aims — and the result is tension, blockage, the recurring problem you keep bumping into from a fresh direction. It is fashionable to dread squares, and older astrology did call them *hard*. But grind is also traction. The square is the aspect of drive: it refuses to let you settle, it manufactures the discomfort that makes you build, train, prove, and grow. The most accomplished charts are almost never the smoothest ones — they are braced with squares that gave their owner no peace until something got made.",
    "A trine (120°) is natural flow. Two planets of the same element beam at each other across the wheel, and their energies pass back and forth with no resistance at all — this is the aspect of talent, grace, the thing you were quietly good at before anyone taught you. Trines feel like luck, and in the moment they are. But their gift carries a shadow you will meet in a page or two: because a trine costs nothing, it is easy to lean on it until it softens into laziness. A gift that is used becomes genius; a gift merely coasted on becomes a talent that never quite grows up.",
    "An opposition (180°) sets two planets on exactly opposite sides of the sky, staring each other down across the wheel like the two ends of a seesaw. The energy here is polarity — pull and counter-pull, a tension forever seeking a balance it rarely finds in a straight line. Oppositions are famous for projection: the trait you cannot own in yourself you tend to meet *out there*, worn by a partner, a rival, a maddening colleague who is secretly carrying your other half. The work of an opposition is never to pick a side but to learn the swing — to hold both ends of the pole at once. Do that, and the seesaw becomes a bridge.",
    "## Counting the signs",
    "Here is the elegance beginners are rarely shown: the aspects are not random angles at all — they are woven straight into the elements and modalities you already know. Count the signs between two planets and the logic falls open. Four signs apart is a trine, and four signs always lands you in the *same element*, which is why trines flow — fire simply understands fire. Three signs apart is a square, and three signs share a *modality* while clashing in element, which is why squares grind — two cardinal signs both determined to lead in incompatible directions. Two signs apart is a sextile, joining compatible elements of the same charge (fire with air, earth with water); six signs apart is an opposition, landing on your polar sign — same modality, opposite seat, the missing half you spend a life learning to hold. A working astrologer still measures the exact degrees rather than the signs alone — a planet at the tail of one sign can trine a planet at the head of another and slip the tidy pattern — but this sign-count is the honest skeleton underneath, and the fastest way to *feel* why an aspect behaves as it does.",
    "## How close counts: orbs and motion",
    "Two planets almost never sit at a flawless 90° or 120°. Astrology allows a margin — the *orb* — a few degrees of slack on either side of exact within which the aspect still counts. The tighter the orb, the louder the conversation: a square one degree from exact can organise a whole life, while a square eight degrees wide only murmurs in the background. Conventional orbs run to roughly eight degrees for the major aspects, a touch wider still for the Sun and Moon, and narrow to a few degrees for gentler contacts like the sextile; the minor aspects — the 30° semisextile, the awkward 150° quincunx of two signs that share nothing — are given tighter orbs again, because their voices are quieter. There is no single sacred number here. Orbs are a matter of tradition and taste, and part of learning to read is learning how loose an ear you trust.",
    "Motion adds one last subtlety. Because the planets travel at different speeds, an aspect is either *applying* — the faster planet still moving toward exactness — or *separating*, having already passed it. Applying aspects are the ones tightening, building, seeking their moment, and most astrologers read them as the stronger and more fated of the two. A separating aspect has already had its say; its theme feels more integrated, more spent, more behind you. It is the difference between a conversation climbing toward its point and one gently winding down after it.",
    "When several aspects link up, they form patterns with characters all their own. A T-square — two planets in opposition, both squared by a third — is a pressure-cooker engine of ambition, forever pushing its owner to resolve a tension that will not resolve. A grand trine — three planets closed into a triangle of a single element — is a charmed but self-satisfied circuit that can hum along achieving remarkably little. And now and then a planet makes no major aspect at all: *unaspected*, ungoverned by the committee, it tends to run wild and pure, either strangely absent or startlingly dominant. These are the sentences the chart builds once the single words are in place.",
    "## Hard, soft, and the myth of the lucky chart",
    "Squares and oppositions are the *hard* aspects; trines and sextiles the *soft* ones — and no pair of words in astrology is more misread. Hard does not mean bad, and soft does not mean good. The hard aspects are where drive, growth, and character are forged, because tension is the one thing that reliably makes a person move. Show me someone who has built something real and I will usually show you a chart braced with squares — the itch that would not quit, the friction that refused to let them rest in whatever came easy.",
    "The soft aspects, meanwhile, are genuine gifts — and gifts can fall asleep. A talent that never meets resistance often never fully develops; the person blessed with a beautiful grand trine can spend decades coasting on charm, never pressed to become more. This is the quiet honesty at the heart of reading aspects: the smoothest chart is not the luckiest one. A life is not measured by the ease it was handed but by what it made of its friction. The most fortunate charts, in the end, are usually the ones that hold both — enough trine to have somewhere to stand, and enough square to be driven off the couch.",
    "So read your chart not as a verdict handed down but as a room full of talk. Some of your planets are old friends who finish each other's thoughts; some are rivals locked in a lifelong argument; some barely nod across the wheel. None of it is fixed. An aspect only names the *tone* two energies tend to take when they meet — and you are the one seated at the table, always able to change how the conversation goes. The sky appoints the members of the debate. You are still the one holding the gavel.",
  ]},
  { id: "retrogrades", cat: "Astrology", colour: "#b898e8", title: "Retrogrades and transits: the sky in motion", min: 7, body: [
    "A birth chart is a photograph of the sky, taken at the one instant you first drew breath. The Sun stood at a certain degree, the Moon at another, Mercury a single step ahead or behind — and astrology freezes that arrangement and keeps it, unchanging, for the whole of your life. But the heavens themselves were never frozen. The moment after your photograph was taken, every planet kept moving, exactly as it always had, and it has not paused once since. Overhead right now, in the real and physical sky, the actual planets are still wheeling along their orbits — and that living, moving sky is what an astrologer means by the transits.",
    "A transit is, at heart, a meeting. When a planet in today's sky arrives at the same degree where one of your natal planets has waited since birth, the two make contact, and astrology reads that contact as a season quietly unfolding in your life. Transiting Saturn crossing your natal Sun, transiting Jupiter lighting up your natal Moon, a Full Moon falling exactly on your Ascendant — these are the machinery behind almost everything a thoughtful horoscope is really pointing at. Your natal chart is the instrument, fixed and tuned at your first breath; the transits are the hands that play it. Learn to feel the difference between the standing score and the moving fingers, and astrology stops being a fortune printed once and becomes a conversation that never ends.",
    "## When the moving sky touches the still one",
    "Not all transits move at the same speed, and speed is the first thing to feel for. The Moon crosses your whole chart in under a month and brushes each placement for only hours — it is the sky's passing mood, real but brief. The Sun, Mercury and Venus colour a week or a season. But the slow giants — Saturn, Uranus, Neptune, Pluto — can sit within reach of a single natal point for a year or more, and those are the transits that reshape a life rather than a Tuesday. When people speak of the year that changed everything, they are almost always describing one slow planet crossing an angle or a luminary.",
    "Astrologers measure a transit by its orb — how near, in degrees, the moving planet has come to the exact meeting. Beyond a certain orb the contact is only theoretical; inside it, the season is genuinely underway. And every transit has a tide: it is applying while the planet is still closing in on the exact degree, and separating once it has passed. The applying phase is the building weather — the pressure, the anticipation, the sense of something gathering; the separating phase is the release, and the long quiet work of integrating whatever the meeting brought. A careful reader watches the approach far more closely than the aftermath.",
    "Hold onto one word here above all others: invitation. A transit is not a sentence handed down, nor an event scheduled to befall you; it is a quality of time knocking at a particular door of your life, asking to be lived consciously rather than blindly. The very same Saturn transit that one person meets as burnout, another meets as the year they finally built something that lasts — because the planet describes the weather, never the sailor. Astrology's oldest and most easily forgotten secret is that the map does not steer the ship. It only tells you which way the wind is setting, so that you might trim your sails with a little more grace.",
    "## The planets that appear to walk backward",
    "Every so often the almanac reports that a planet has turned retrograde — that it is moving backward through the zodiac — and it is worth knowing, first, that nothing in the heavens has actually reversed. No planet ever truly stops or doubles back; each keeps sailing forward around the Sun exactly as it always has. Retrograde motion is an optical effect, a trick of perspective born of the simple fact that we watch the other planets from a world that is itself in motion. It is one of the sky's most beautiful illusions, and for centuries it was one of astronomy's hardest puzzles to solve.",
    "Picture two cars on a motorway. When you overtake a slower car in the next lane, there is a moment when it seems to slide backward against the fields behind it — even though it is still travelling forward — simply because you have passed it. That is precisely what happens overhead. When faster Earth, on its shorter inner orbit, overtakes a slower outer planet like Mars or Saturn, that planet appears to drift backward against the fixed stars for a while, then resumes its forward course once we have swept on past. Mercury and Venus, orbiting nearer the Sun than we do, cast the same illusion in reverse, as they overtake us.",
    "At the turning points of this illusion a planet seems to hang almost motionless, and astrologers call these moments the stations — the planet stationing retrograde as it appears to stop and reverse, and stationing direct weeks later as it steadies and moves forward again. The days around a station are held to be the most charged of the whole cycle, the held breath before the direction changes. Between the stations lies the retrograde period itself, and around it a softer border-country the tradition calls the shadow — where the planet crosses the same degrees twice more, before and after, as if re-reading the same page three times to be sure of it.",
    "## Mercury retrograde: the myth and the mercy",
    "No transit has escaped its cage and wandered into ordinary conversation quite like Mercury retrograde. It arrives roughly three times a year, for about three weeks each time, and it has gathered a reputation as a season of pure misfortune — lost emails, missed trains, quarrels, technology in open revolt. That reputation is not baseless; it is simply inflated into doom. Mercury governs the small daily machinery of life — messages, contracts, commerce, travel, the moving parts of the mind — and when its symbol turns backward, that machinery does genuinely seem to catch and stutter a little more than usual.",
    "But read the myth for its mercy and it turns from a curse into an instruction, and the whole instruction lives in a single prefix: re. This is a season built for the re- verbs — to review, revise, reconsider, reconnect, repair, reflect, and return to what was left unfinished. It is a poor time to sign the untested contract, launch the untried venture, or buy the costly machine sight unseen; it is a wonderful time to edit the draft, mend the friendship, revisit the half-abandoned project, and read the fine print you skimmed the first time. The practical counsel that has grown up around it is honestly sound: back up your files, confirm your travel, say what you mean twice, and leave a little more room in the day for things to go sideways.",
    "What it is not is a fate to dread or an excuse to stop living. Mercury does not break your car or end your relationship, and three weeks in every year are not cursed. Held rightly, the retrograde is less a storm to survive than a tide that pulls the mind naturally inward and backward — toward reflection, toward loose ends, toward the unglamorous grace of finishing what you started. Meet it that way and you may even come to look forward to it: three standing appointments a year with your own second thoughts.",
    "## Retrogrades as inward seasons",
    "Mercury is only the most famous of the wanderers to turn back. Venus turns retrograde for about six weeks roughly every eighteen months, and tradition reads it as a season to review the heart — old loves, old values, the quiet question of what and whom we truly treasure. Mars turns back for about two to two-and-a-half months every couple of years, asking us to reconsider how we act, assert and desire, often drawing raw drive inward before it can move cleanly out into the world again. These are not misfortunes either; they are the psyche's periodic invitations to look before it leaps.",
    "The outer planets go further still, resting in retrograde for roughly five months of every year — so that Jupiter, Saturn, Uranus, Neptune and Pluto each spend a large share of their time apparently moving backward. Because this is so ordinary, astrologers read an outer-planet retrograde less as an event than as a change of direction for its energy: an outward-building force turned inward for a season, doing its work in the interior rather than the world. Where the direct phase asks you to build, the retrograde phase asks you to reflect on what, and why, you are building. Read this way, retrogrades are simply the sky's rhythm of exhale and inhale — and no life, and no lung, was ever meant only to breathe out.",
    "## The Saturn return and the coming-of-age",
    "Of all the transits, one has earned a name of its own and a place in the folklore of growing up: the Saturn return. Saturn takes roughly twenty-nine and a half years to complete a single orbit and arrive back at the exact degree it held when you were born — so that at around ages twenty-nine to thirty, and again near fifty-eight to fifty-nine, the planet of time, structure and consequence comes home to where it began. It is felt, by almost everyone who notices it, as a reckoning and a threshold: the end of a borrowed life and the beginning of a chosen one. Careers pivot, relationships are tested to their foundations, and the question the whole transit keeps asking is quietly enormous — is the life you have built actually yours?",
    "Saturn carries a fearsome reputation, and the first return in particular can feel like a hard passage — the scaffolding of a too-young life coming down so that something truer can be raised in its place. But Saturn is not cruelty; it is gravity. It tends to remove only what was never load-bearing, and what survives its testing is inclined to last for decades. Those who meet the first return consciously — who use it to take real responsibility, to commit or to release, to become the author of their days rather than a guest in them — most often describe it afterward not as a catastrophe but as the season they finally grew up. The second return, near sixty, is eldership's own threshold, and asks a gentler, deeper version of the very same question.",
    "Saturn is not the only visitor to keep such appointments. Jupiter returns to its birth-place about every twelve years — near ages twelve, twenty-four, thirty-six — and tends to arrive as expansion, opportunity and a widening of the horizon, the more generous cousin of Saturn's discipline. Whichever planet is knocking, the counsel is the same, and it is the note this whole moving sky is written in: a transit is an invitation, never a sentence. The heavens set the weather and mark the hour, but the living of it — the courage, the choosing, the meaning made from it — has always, and only, been yours. Read the sky as a map of the tides, and then sail; it was never the sea, and it was certainly never you.",
  ]},
  { id: "firstchart", cat: "Astrology", colour: "#b898e8", title: "How to read a birth chart without fear", min: 7, body: [
    "The first time you open a real birth chart, it looks like the cockpit of a starship — a wheel sliced into twelve, strewn with glyphs, threaded with coloured lines that all seem to mean something urgent. Breathe. Every working astrologer began exactly this lost, squinting at symbols they could not yet pronounce, certain they had missed the lesson where it all made sense. And the whole daunting instrument opens to a single, almost childishly simple key: planet, sign, house. What, how, where. Learn to ask those three questions, in that order, and the cockpit quietly turns back into a story about you.",
    "Hold the grammar in your hand before you ever touch the wheel. A *planet* is a what — a living verb, a character in your inner company who wants something. A *sign* is a how — the costume that character wears, the accent it speaks in, its whole style of going about things. A *house* is a where — the room of your life in which it mostly does its work. String the three together and any placement becomes a plain sentence: Venus (the way I love) in Capricorn (carefully, loyally, built to last) in the seventh house (inside committed partnership). There — you have just read a birth chart. Everything that follows is only more of the same, said slowly.",
    "The mistake that frightens beginners is trying to hear all forty voices at once. A chart holds ten or so planets, twelve houses, four angles, and a whole cat's-cradle of aspects strung between them — read simultaneously, it is pure noise, and noise feels like doom. So astrologers read in an order, loudest and nearest first, the way you would meet a family: the people who raised you before the second cousins. Work from the inside out — the personal planets before the generational ones, the great load-bearing placements before the fine trim. Nothing in that sky is going anywhere. You are allowed to take it one voice at a time.",
    "## Begin with the big three",
    "The Sun, the Moon and the Rising sign are the load-bearing walls; raise these first and the whole house stands. Find your Sun and say it aloud — *my purpose behaves like ___, in the room of ___.* Then your Moon — *my needs behave like ___, in the room of ___.* Then your Rising, the sign that was climbing the eastern horizon at the very minute you were born, which is exactly why the birth *time* matters so fiercely — *I arrive like ___.* Three sentences, and you already hold a truer likeness than any newspaper column ever drew, because you built it yourself, from the actual sky that stood over your actual arrival.",
    "Then do the thing that turns placements into a person: let them talk to one another. A Leo Sun with a Cancer Moon and a Virgo Rising might slip into the room quietly checking the details, blaze with warmth once it feels safely seen, and need real tenderness the moment the crowd goes home. That is not a contradiction to be solved — it is texture, three instruments playing one piece of music. Synthesis, not arithmetic, is the whole art of chart-reading, and you begin practising it right here, with only three notes to hold in your hands. Get comfortable letting placements modify each other, and the rest of the chart will never overwhelm you.",
    "## The inner court: mind, love and drive",
    "With the walls up, meet the three personal planets that colour ordinary daily life the most: Mercury, Venus and Mars. Mercury is your mind and your voice — how you think, how you learn, how you reach for the right word. It never strays far from the Sun, so look just beside it: Mercury in Scorpio researches like a detective and says little until it is sure, while Mercury in Gemini thinks in a bright, quick scatter of links and loves the saying itself. Its house tells you where your attention naturally goes to work — the province of life where you are forever reading, talking, and joining the dots.",
    "Venus and Mars are the relational engine, the two hands of desire. Venus is how you love and what you find beautiful — your taste, your values, the way you draw closeness gently toward you. Mars is how you *want* and how you fight — your drive, your appetite, and the particular shape your anger takes on the day it finally arrives. Read the two together and you glimpse how a person both pursues and receives: a tender Venus in Pisces reaching across the chart for a blunt, sprinting Mars in Aries makes a very specific kind of music. Their signs give the flavour of wanting; their houses give the arena in which the wanting plays out.",
    "## The teachers and the tide",
    "Beyond Mars stand the two social planets, the sky's paired schoolmasters. Jupiter is expansion — growth, luck, faith, meaning, and the generous excess of always wanting *more*; its house shows where life tends to fling doors open and hand you room to spread out. Saturn is contraction — discipline, time, limit, and the slow-earned mastery that only pressure can make; its house shows where you must work, wait, and eventually become the authority you once wished someone would be. They are not reward and punishment but breath in and breath out. Saturn even keeps a famous appointment — the *Saturn return*, near ages twenty-nine and again near fifty-eight, when it completes a full lap of your chart and asks, without cruelty but without flinching, whether you have grown into your own life.",
    "The outermost three — Uranus, Neptune and Pluto — move so slowly that nearly everyone born within a few years of you shares their sign; they paint a whole generation's weather, not your private temperament. So read them lightly. Note the *house* each one falls in — where the collective current happens to run through your particular life — and note whether one of them makes a tight aspect to a personal planet or an angle, because that is precisely where a generational force turns personal and unmistakably yours. Then move on. Beginners who linger here, hunting catastrophe in Pluto, have mistaken the tide for the boat.",
    "## The angles, and only the tightest aspects",
    "Glance next at the four angles, the cross that pins your chart to the exact earth and hour of your birth. The Ascendant you have already met as your Rising. Directly opposite it is the Descendant — the kind of other you seek out, partner with, and meet yourself inside. At the very base of the wheel sits the IC, your roots, your home, the private foundation no one else quite sees; at the summit, the Midheaven, your vocation and the name the world slowly learns to call you by. The ASC–MC spine — from how you rise each morning to how you are ultimately known — is a wonderfully honest thing to sit quietly with early on.",
    "Aspects are the conversations the planets hold across the wheel, the geometry of who is talking to whom. A conjunction (0°) fuses two voices into a single one; a sextile (60°) and a trine (120°) let them help each other with easy grace; a square (90°) and an opposition (180°) make them strain, argue, and grow. Two mercies keep this from swamping you. First, mind the *orb* — the closer to exact the angle, the louder the aspect — so read only the two or three tightest and let the faint whispers wait for another day. Second, an *applying* aspect, still tightening toward exact, hums stronger than a *separating* one already loosening its grip and drifting away.",
    "## On difficult placements, retrogrades, and the freedom not to memorise",
    "Two reassurances now, because fear is truly the only obstacle in this whole room. There are no bad charts. A square is not a curse but torque — and torque is precisely how an engine turns effort into motion; the people with the most friction written in their sky are very often the ones who *do* the most with a life. And a planet drawn retrograde in a natal chart is not broken, backward, or unlucky. Roughly a fifth of us are born under Mercury retrograde alone — Mercury turns retrograde some three times every year — and all it means is that this energy runs inward first: more reflective, more private, rehearsed thoroughly within before it is ever spoken aloud. Retrograde is a temperament, not a wound.",
    "Nor do you need to memorise the sky in order to read it. No astrologer alive carries all of this in their head; they keep an ephemeris and a notebook, and so should you — let the keywords here be training wheels, and trust meaning to accrue the way a language does, one honest observation at a time, until the morning you notice you are simply *reading*. So come back, at the last, to the one thing worth keeping above all the rest. The chart describes weather, never worth; it is a map, and you remain the sailor with both hands on the wheel. Read from the inside out, hold the big three like a chord, let the planets talk among themselves, and forgive yourself every glyph you have not yet learned. Astrology's oldest secret is that it was never fortune-telling at all — it is self-remembering, with the whole sky held up as a mirror, and you are the one who was always meant to look.",
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
      max_tokens: 2000,
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
    @keyframes orbAura { 0%, 100% { opacity: .6; transform: scale(1); } 50% { opacity: .92; transform: scale(1.05); } }
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

const HomeBtn = ({ onClick }) => (
  <button onClick={onClick} className="lum-sans" aria-label="Back to home" style={{
    position: "fixed", top: 10, left: 12, zIndex: 999, cursor: "pointer",
    fontSize: 11.5, letterSpacing: ".08em", color: T.goldHi,
    background: "rgba(13,13,26,.6)", border: "1px solid rgba(201,168,76,.4)",
    borderRadius: 10, padding: "4px 12px", backdropFilter: "blur(6px)",
  }}>✧ Home</button>
);

const VersionBadge = ({ onReveal }) => {
  const stamp = new Date(__BUILD_TIME__).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const taps = useRef(0), timer = useRef(null);
  const hit = () => {
    taps.current += 1;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1200);
    if (taps.current >= 5) { taps.current = 0; onReveal && onReveal(); }
  };
  return (
    <div onClick={hit} className="lum-sans" style={{
      position: "fixed", top: 10, right: 12, zIndex: 999, pointerEvents: "auto", cursor: "default", userSelect: "none",
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
/* Generative card faces: every card gets its own deterministic starfield and
   halo tilt (seeded from its name, stable across renders), dressed in the
   chosen deck's palette and watermark motif. */
const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const cardHash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

const TarotCard = ({ card, deck, label, delay = 0, w = 108, rev = false }) => {
  const hsh = cardHash(card.name);
  const major = card.arcana === "Major";
  const [artOk, setArtOk] = useState(true);
  useEffect(() => setArtOk(true), [card.name]);
  const plate = major ? card.n : card.name.split(" of ")[0];
  const stars = [...Array(10)].map((_, i) => ({
    left: 8 + ((hsh >> (i * 2)) % 84), top: 10 + ((hsh >> (i * 2 + 5)) % 78),
    s: 1 + ((hsh >> i) % 3) * 0.6, o: 0.2 + ((hsh >> (i + 3)) % 45) / 100,
  }));
  return (
  <div style={{ textAlign: "center", animation: `cardIn .8s ease ${delay}s both`, perspective: 600 }}>
    <div style={{
      width: w, height: w * 1.62, margin: "0 auto", borderRadius: 12,
      background: `radial-gradient(130% 90% at 50% -15%, ${deck.frame}26, transparent 55%), radial-gradient(95% 65% at 50% 115%, ${deck.frame}1a, transparent 62%), linear-gradient(165deg, ${deck.g1}, ${deck.g2})`,
      border: `1.5px solid ${deck.frame}99`, boxShadow: `0 10px 28px rgba(0,0,0,.55), 0 0 18px ${deck.frame}22, inset 0 0 24px rgba(0,0,0,.35)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      padding: "10px 8px", position: "relative", overflow: "hidden",
    }}>
      {artOk && (
        <div style={{ position: "absolute", inset: 0, zIndex: 4, borderRadius: 12, overflow: "hidden" }}>
          <img src={`/images/tarot/${major ? "majors" : "minors"}/${tarotSlug(card.name)}.webp`} alt={card.name} onError={() => setArtOk(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: rev ? "rotate(180deg)" : "none" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,16,.72) 0%, transparent 20%, transparent 72%, rgba(8,8,16,.9) 100%)" }} />
          <div aria-hidden style={{ position: "absolute", inset: 4, borderRadius: 9, border: `1px solid ${deck.frame}77` }} />
          <div className="lum-serif" style={{ position: "absolute", top: 6, left: 0, right: 0, textAlign: "center", fontSize: Math.max(11, w * 0.1), color: deck.frame, letterSpacing: ".2em", textShadow: "0 1px 6px #000, 0 0 10px #000" }}>{plate}</div>
          <div className="lum-serif" style={{ position: "absolute", bottom: 7, left: 5, right: 5, textAlign: "center", fontSize: Math.max(10.5, w * 0.098), color: T.ink, lineHeight: 1.15, textShadow: "0 1px 6px #000, 0 0 10px #000" }}>{card.name}</div>
        </div>
      )}
      {stars.map((st, i) => (
        <span key={i} aria-hidden style={{ position: "absolute", left: `${st.left}%`, top: `${st.top}%`, width: st.s, height: st.s, borderRadius: "50%", background: deck.frame, opacity: st.o }} />
      ))}
      <div aria-hidden style={{ position: "absolute", bottom: -w * 0.05, right: -w * 0.03, fontSize: w * 0.5, opacity: 0.08, transform: "rotate(-14deg)", pointerEvents: "none", filter: "grayscale(30%)" }}>{deck.motif}</div>
      <div aria-hidden style={{ position: "absolute", inset: 4, borderRadius: 9, border: `1px solid ${deck.frame}55` }} />
      <div aria-hidden style={{ position: "absolute", inset: 7, borderRadius: 7, border: `1px dotted ${deck.frame}2e` }} />
      {[{ top: 7, left: 9 }, { top: 7, right: 9 }, { bottom: 7, left: 9 }, { bottom: 7, right: 9 }].map((p, i) => (
        <span key={i} aria-hidden style={{ position: "absolute", ...p, fontSize: 7, color: deck.frame, opacity: 0.85, lineHeight: 1 }}>✦</span>
      ))}
      <div className="lum-serif" style={{ fontSize: major ? Math.max(11, w * 0.1) : Math.max(8.5, w * 0.08), color: deck.frame, letterSpacing: ".22em", textTransform: "uppercase", zIndex: 1, textShadow: `0 0 10px ${deck.frame}55`, marginTop: 3 }}>{plate}</div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <div aria-hidden style={{ position: "absolute", width: w * 0.64, height: w * 0.64, borderRadius: "50%", background: `radial-gradient(circle, ${deck.frame}30 0%, transparent 70%)`, border: `1px solid ${deck.frame}2c` }} />
        <div aria-hidden style={{ position: "absolute", width: w * 0.78, height: w * 0.78, borderRadius: "50%", border: `1px dashed ${deck.frame}24`, transform: `rotate(${hsh % 360}deg)` }} />
        <div style={{ fontSize: w * 0.3, filter: `drop-shadow(0 0 14px ${deck.frame}66)`, transform: rev ? "rotate(180deg)" : "none" }}>{card.glyph}</div>
      </div>
      <div style={{ zIndex: 1, width: "100%" }}>
        <div aria-hidden style={{ height: 1, margin: "0 14px 5px", background: `linear-gradient(90deg, transparent, ${deck.frame}88, transparent)` }} />
        <div className="lum-serif" style={{ fontSize: Math.max(10.5, w * 0.1), color: T.ink, lineHeight: 1.2, padding: "0 2px 2px" }}>{card.name}</div>
      </div>
    </div>
    {(label || rev) && <div className="lum-sans" style={{ fontSize: 11, color: T.gold, marginTop: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>{label}{label && rev ? " · " : ""}{rev && <span style={{ color: T.rose }}>Reversed ⟲</span>}</div>}
  </div>
  );
};

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
  const wrap = size * 2.3;
  const body = (
    <div style={{ position: "relative", width: wrap, height: wrap, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Soft aura radiating outward — smooth and steady, no spinning rays or strobing sparks */}
      <div aria-hidden style={{ position: "absolute", width: wrap, height: wrap, borderRadius: "50%", pointerEvents: "none", background: `radial-gradient(circle, ${tint}5c 0%, ${tint}26 30%, ${T.gold}12 50%, transparent 70%)`, animation: "orbAura 6s ease-in-out infinite" }} />
      {/* The bright golden orb, gently breathing */}
      <div style={{
        width: size, height: size, borderRadius: "50%", position: "relative", overflow: "hidden",
        background: `radial-gradient(circle at 35% 30%, #fdf3cf, ${tint} 42%, ${T.gold} 72%, #5e4a1d)`,
        animation: "orbBreath 6s ease-in-out infinite",
      }}>
        <div aria-hidden style={{ position: "absolute", inset: -size * 0.2, background: "linear-gradient(115deg, transparent 45%, rgba(255,250,228,.32) 50%, transparent 55%)", animation: "glisten 10s ease-in-out infinite" }} />
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
  const [majorsOnly, setMajorsOnly] = useState(false);
  const [reversals, setReversals] = useState(true);
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
      const shuffled = shuffle(majorsOnly ? MAJORS_DECK : FULL_DECK);
      const cards = shuffled.slice(0, spread.cards).map((c) => ({ ...c, rev: reversals && Math.random() < 0.32 }));
      setDrawn(cards); setReading(""); setErr(""); setStage("reading"); setLoading(true);
      try {
        const desc = cards.map((c, i) => `${spread.pos[i]}: ${c.name}${c.rev ? " (reversed)" : ""} (themes: ${c.keys})`).join("\n");
        const text = await askLuminae(
          `Give a tarot reading for the "${spread.name}" spread.\nSeeker's intention: "${intention || "an open heart, no specific question"}"\nCards drawn:\n${desc}\n\nRead any card marked (reversed) in its reversed sense — the same energy turned inward, blocked, delayed, or softened, and framed kindly. Weave the cards together into one flowing reading that speaks to each position and closes with a gentle blessing or invitation.`
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
      <button onClick={() => setMajorsOnly((v) => !v)} aria-pressed={majorsOnly} className="lum-sans" style={{ width: "100%", marginTop: 16, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 15px", borderRadius: 12, cursor: "pointer", background: T.card2, border: `1px solid ${majorsOnly ? T.goldHi : "rgba(201,168,76,.25)"}` }}>
        <span>
          <span className="lum-serif" style={{ display: "block", fontSize: 15, color: T.ink }}>Major Arcana only</span>
          <span className="lum-sans" style={{ fontSize: 11.5, color: T.dim }}>Read with just the 22 great archetypes</span>
        </span>
        <span className="lum-sans" style={{ flexShrink: 0, fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: majorsOnly ? "#0b0a14" : T.dim, background: majorsOnly ? T.goldHi : "transparent", border: `1px solid ${majorsOnly ? T.goldHi : T.dim}`, borderRadius: 20, padding: "4px 13px" }}>{majorsOnly ? "On" : "Off"}</span>
      </button>
      <button onClick={() => setReversals((v) => !v)} aria-pressed={reversals} className="lum-sans" style={{ width: "100%", marginTop: 10, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 15px", borderRadius: 12, cursor: "pointer", background: T.card2, border: `1px solid ${reversals ? T.goldHi : "rgba(201,168,76,.25)"}` }}>
        <span>
          <span className="lum-serif" style={{ display: "block", fontSize: 15, color: T.ink }}>Read reversals</span>
          <span className="lum-sans" style={{ fontSize: 11.5, color: T.dim }}>Let some cards fall reversed, for shadow &amp; nuance</span>
        </span>
        <span className="lum-sans" style={{ flexShrink: 0, fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: reversals ? "#0b0a14" : T.dim, background: reversals ? T.goldHi : "transparent", border: `1px solid ${reversals ? T.goldHi : T.dim}`, borderRadius: 20, padding: "4px 13px" }}>{reversals ? "On" : "Off"}</span>
      </button>
      <div style={{ marginTop: 18 }}><Btn onClick={draw}>Enter the reading ✧</Btn></div>
    </div>
  );

  if (stage === "reading") return (
    <div className="fade-up">
      <Back onClick={() => setStage("spreads")} label="New reading" />
      <Eyebrow>{spread.name}</Eyebrow>
      {intention && <p className="lum-serif" style={{ color: T.moon, fontStyle: "italic", fontSize: 16, margin: "0 0 18px" }}>“{intention}”</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", margin: "10px 0 26px" }}>
        {drawn.map((c, i) => <TarotCard key={i} card={c} deck={deck} rev={c.rev} label={spread.pos[i]} delay={i * 0.25} w={drawn.length > 5 ? 84 : 104} />)}
      </div>
      {loading ? <Channeling /> : err ? (
        <Panel style={{ borderColor: T.rose + "55" }}>
          <p className="lum-sans" style={{ color: T.ink, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{err}</p>
          <div style={{ marginTop: 12 }}>{drawn.map((c, i) => <div key={i} className="lum-sans" style={{ color: T.dim, fontSize: 13, margin: "4px 0" }}><b style={{ color: T.gold }}>{spread.pos[i]}</b> · {c.name} — {c.keys}</div>)}</div>
        </Panel>
      ) : <Panel style={{ padding: 26 }}><ReadingText text={reading} /></Panel>}
      <div style={{ marginTop: 24 }}><Eyebrow>Each card's meaning</Eyebrow></div>
      <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
        {drawn.map((c, i) => {
          const m = MAJOR_MEANINGS[c.name] || MINOR_MEANINGS[c.name];
          return (
            <Panel key={i} style={{ padding: "14px 18px", borderColor: T.gold + "33" }}>
              <div className="lum-sans" style={{ fontSize: 10.5, color: T.gold, letterSpacing: ".14em", textTransform: "uppercase" }}>{spread.pos[i]}</div>
              <div className="lum-serif" style={{ fontSize: 18, color: T.ink, margin: "2px 0 6px" }}>{c.name}{c.rev && <span className="lum-sans" style={{ color: T.rose, fontSize: 11.5, letterSpacing: ".08em", textTransform: "uppercase", marginLeft: 9 }}>Reversed ⟲</span>}</div>
              {m ? (
                <>
                  <p className="lum-serif" style={{ fontSize: 15, fontStyle: "italic", color: T.goldHi, lineHeight: 1.5, margin: "0 0 9px" }}>{m.essence}</p>
                  {c.rev ? (
                    <>
                      <p className="lum-serif" style={{ fontSize: 14, color: T.ink, lineHeight: 1.68, margin: "0 0 9px" }}><b style={{ color: T.rose }}>Reversed · </b>{m.reversed}</p>
                      <p className="lum-sans" style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6, margin: 0 }}><b style={{ color: T.gold }}>Upright · </b>{m.upright}</p>
                    </>
                  ) : (
                    <>
                      <p className="lum-serif" style={{ fontSize: 14, color: T.ink, lineHeight: 1.68, margin: "0 0 9px" }}>{m.upright}</p>
                      <p className="lum-sans" style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6, margin: 0 }}><b style={{ color: T.rose }}>Reversed · </b>{m.reversed}</p>
                    </>
                  )}
                </>
              ) : (
                <p className="lum-sans" style={{ fontSize: 13, color: T.dim, lineHeight: 1.5, margin: 0 }}>{c.keys}</p>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );

  if (stage === "guide") return (
    <div className="fade-up" style={{ maxWidth: 520 }}>
      <Back onClick={() => setStage("spreads")} />
      <Eyebrow>Tarot</Eyebrow>
      <H>How to read your cards</H>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <Panel style={{ padding: "16px 18px" }}>
          <Eyebrow colour={T.gold}>Begin in stillness</Eyebrow>
          <p className="lum-serif" style={{ color: T.ink, fontSize: 14.5, lineHeight: 1.7, margin: "6px 0 0" }}>Take a slow breath. Hold your question gently, or simply stay open — the cards answer a soft heart, not a demand. There are no wrong cards.</p>
        </Panel>
        <Panel style={{ padding: "16px 18px" }}>
          <Eyebrow colour={T.gold}>Upright &amp; reversed</Eyebrow>
          <p className="lum-serif" style={{ color: T.ink, fontSize: 14.5, lineHeight: 1.7, margin: "6px 0 0" }}>A card drawn upright speaks in its fullest, most open voice. A <b>reversed</b> card (turned upside-down) is the same energy turned inward — blocked, softening, or still becoming. Never a curse, only a different shade of the same truth. You choose: flip <b>“Read reversals”</b> on or off before any reading.</p>
        </Panel>
        <Panel style={{ padding: "16px 18px", borderColor: T.violet + "55" }}>
          <Eyebrow colour={T.violet}>Trust your intuition first</Eyebrow>
          <p className="lum-serif" style={{ color: T.ink, fontSize: 14.5, lineHeight: 1.7, margin: "6px 0 0" }}>The meanings here are a doorway, never a verdict. If a card stirs a feeling, a memory, or a sudden knowing the moment you see it — <b>trust that</b>. Your intuition knows your life; the words only know the card. When the two disagree, follow your inner voice.</p>
        </Panel>
        <Panel style={{ padding: "16px 18px" }}>
          <Eyebrow colour={T.gold}>Let the cards talk to each other</Eyebrow>
          <p className="lum-serif" style={{ color: T.ink, fontSize: 14.5, lineHeight: 1.7, margin: "6px 0 0" }}>A reading is a conversation, not a list. Notice the story the cards tell together — and the one image or word that won’t quite let you go. That is usually the message.</p>
        </Panel>
        <p className="lum-serif" style={{ color: T.faint, fontStyle: "italic", fontSize: 13.5, textAlign: "center", lineHeight: 1.7, marginTop: 4 }}>Tarot is a mirror for reflection, not a fixed fortune. You always hold the pen. ✧</p>
      </div>
      <div style={{ marginTop: 20, textAlign: "center" }}><Btn onClick={() => setStage("spreads")}>Choose a spread ✧</Btn></div>
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
      <button onClick={() => setStage("guide")} className="lum-sans" style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: 12, cursor: "pointer", background: "transparent", border: "1px dashed rgba(201,168,76,.35)", color: T.gold, fontSize: 13, letterSpacing: ".04em" }}>✧ New to tarot? How to read your cards</button>
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
  const related = [...LEARN.filter((a) => a.id !== id && a.cat === art.cat), ...LEARN.filter((a) => a.id !== id && a.cat !== art.cat)].slice(0, 6);
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

      <div style={{ marginTop: 26 }}>
        <Eyebrow colour={T.violet}>The Astrology Library</Eyebrow>
        <p className="lum-sans" style={{ color: T.dim, fontSize: 12.5, lineHeight: 1.6, margin: "6px 0 12px" }}>Eight deep readings — from the whole cast of planets to the signs, houses, aspects and the sky in motion. Free, and written for first steps and old souls alike.</p>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <LearnBtn id="bigthree" onOpen={setArticle}>Sun, Moon & Rising</LearnBtn>
          <LearnBtn id="signs" onOpen={setArticle}>The twelve signs</LearnBtn>
          <LearnBtn id="elements" onOpen={setArticle}>The four elements</LearnBtn>
          <LearnBtn id="planets" onOpen={setArticle}>The planets</LearnBtn>
          <LearnBtn id="houses" onOpen={setArticle}>The twelve houses</LearnBtn>
          <LearnBtn id="aspects" onOpen={setArticle}>Aspects</LearnBtn>
          <LearnBtn id="retrogrades" onOpen={setArticle}>Retrogrades & transits</LearnBtn>
          <LearnBtn id="firstchart" onOpen={setArticle}>Reading your first chart</LearnBtn>
        </div>
      </div>

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
            <div className="lum-sans" style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6 }}>Enter your <b style={{ color: T.ink }}>full birth name</b> (exactly as first given at birth — middle names and all) and your <b style={{ color: T.ink }}>date of birth</b>. Together they reveal your core numbers.</div>
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
            <LearnBtn id="corenumbers" onOpen={setArticle}>Your five core numbers</LearnBtn>
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

      <div style={{ marginTop: 26 }}>
        <Eyebrow colour={T.teal}>The Numerology Library</Eyebrow>
        <p className="lum-sans" style={{ color: T.dim, fontSize: 12.5, lineHeight: 1.6, margin: "6px 0 12px" }}>Nine deep readings — from the meaning of every number to the cycles that shape a life. Free, and written for first steps and old souls alike.</p>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <LearnBtn id="nine" onOpen={setArticle}>The nine numbers</LearnBtn>
          <LearnBtn id="corenumbers" onOpen={setArticle}>Your five core numbers</LearnBtn>
          <LearnBtn id="masters" onOpen={setArticle}>Master numbers (11 · 22 · 33)</LearnBtn>
          <LearnBtn id="karmic" onOpen={setArticle}>Karmic debt numbers</LearnBtn>
          <LearnBtn id="personalyear" onOpen={setArticle}>The nine-year cycle</LearnBtn>
          <LearnBtn id="pinnacles" onOpen={setArticle}>Pinnacles & Challenges</LearnBtn>
          <LearnBtn id="livednumbers" onOpen={setArticle}>Homes, phones & lived numbers</LearnBtn>
          <LearnBtn id="pairs" onOpen={setArticle}>Numerology for two</LearnBtn>
          <LearnBtn id="history" onOpen={setArticle}>Where numerology comes from</LearnBtn>
        </div>
      </div>

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

/* One angel per day for the whole family — but daySeeded scrambles the
   sequence, so it never falls into a predictable weekly rotation. */
const angelOfTheDay = () => ARCHANGELS[Math.floor(daySeeded(new Date(), 3) * ARCHANGELS.length)];

const AngelCardRitual = ({ paid }) => {
  const N = ARCHANGELS.length;
  const [stage, setStage] = useState("idle"); // idle | fan | backs | shuffle | gather | reveal | zoom | done
  const [slots, setSlots] = useState([...Array(N).keys()]);
  const [message, setMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [beheld, setBeheld] = useState(false); // zoom sub-phase: false = behold the whole angel; true = message revealed beneath
  const [channeling, setChanneling] = useState(false); // paid: fetching a bespoke message
  const chosen = useMemo(angelOfTheDay, []);
  const chosenIdx = ARCHANGELS.indexOf(chosen);
  const timers = useRef([]);
  const after = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  const tidy = useMemo(() => ARCHANGELS.map(() => ({ deg: Math.random() * 10 - 5, x: Math.random() * 8 - 4, y: Math.random() * 6 - 3 })), []);

  // Today's message from the chosen angel — drawn from that angel's own pool of
  // written messages, one per day for the whole family, scrambled by date (salt 11)
  // so it changes daily. Falls back to a gentle template if a pool isn't present.
  const dayMsg = (a) =>
    (a.messages && a.messages.length)
      ? a.messages[Math.floor(daySeeded(new Date(), 11) * a.messages.length)]
      : `${a.name} draws close to you today, beloved. ${a.invocation} Let ${a.domain.toLowerCase()} be your compass through the hours ahead. Walk gently — you are so deeply loved.`;

  // Illuminate extra: channel a fresh, bespoke message in the moment.
  const channelPersonal = async () => {
    setChanneling(true);
    try {
      const t = await askLuminae(`Speak a message (110-150 words) in the FIRST PERSON as ${chosen.name}, archangel of ${chosen.domain}, to the seeker who drew this card today (${new Date().toDateString()}). Warm, direct, and personal — a fresh channelling, not a template. Weave in the essence of ${chosen.domain.toLowerCase()} naturally.`);
      setWordCount(0); setMessage(t);
    } catch (e) { /* keep the pool message */ }
    setChanneling(false);
  };

  const begin = () => {
    setMessage(""); setWordCount(0); setChanneling(false); setSlots([...Array(N).keys()]);
    setStage("fan");
    after(2100, () => setStage("backs"));
    after(3100, () => setStage("shuffle"));
    [3200, 3850, 4500, 5150].forEach((t) => after(t, () => setSlots((s) => shuffle(s))));
    after(5900, () => setStage("gather"));
    after(6000, () => setMessage(dayMsg(chosen)));
    after(7100, () => setStage("reveal"));
    after(9100, () => setStage("zoom"));
  };

  useEffect(() => { if (pendingAngelDraw) { pendingAngelDraw = false; begin(); } }, []);

  const words = useMemo(() => (message ? message.split(/\s+/) : []), [message]);

  // Let the whole angel be seen first: once the portrait blooms full-screen,
  // hold on it for a few moments before the message rises in beneath it.
  useEffect(() => {
    if (stage !== "zoom") { setBeheld(false); return; }
    const t = setTimeout(() => setBeheld(true), 3200);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "zoom" || !beheld || !words.length) return;
    const iv = setInterval(() => setWordCount((c) => (c >= words.length ? (clearInterval(iv), c) : c + 1)), 200);
    return () => clearInterval(iv);
  }, [stage, beheld, words.length]);

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
        <div style={{ position: "fixed", inset: 0, zIndex: 95, background: "rgba(8,8,18,.985)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <button onClick={finish} aria-label="Close" style={{ position: "absolute", top: 14, right: 18, zIndex: 6, background: "none", border: "none", color: "#f2ecdf", fontSize: 26, cursor: "pointer", textShadow: "0 0 10px #000" }}>✕</button>

          {/* The whole angel — shown complete (contain), glowing in its own colour.
              Fills the screen at first, then lifts to the top to make room for the message. */}
          <div style={{ position: "relative", flex: `0 0 ${beheld ? "56%" : "100%"}`, minHeight: 0, overflow: "hidden", transition: "flex-basis 1s cubic-bezier(.4,.85,.3,1)" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(115% 80% at 50% 34%, ${chosen.hex}2b, transparent 62%)` }} />
            <img src={chosen.img} alt={chosen.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", animation: "bloomFull 1.2s cubic-bezier(.2,.75,.25,1) both" }} />
            {[...Array(10)].map((_, i) => (
              <span key={i} aria-hidden style={{ position: "absolute", left: `${(i * 47 + 8) % 100}%`, top: `${(i * 29 + 6) % 92}%`, width: 3, height: 3, borderRadius: "50%", background: chosen.hex, opacity: .7, animation: `twinkle ${2.4 + (i % 4) * 0.8}s ease-in-out ${(i % 5) * 0.5}s infinite` }} />
            ))}
            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "32%", background: "linear-gradient(rgba(8,8,18,0), rgba(8,8,18,.94))", opacity: beheld ? 1 : .45, transition: "opacity .8s ease" }} />
            <div className="lum-sans" style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: chosen.hex, opacity: beheld ? 0 : .92, transition: "opacity .55s ease", pointerEvents: "none" }}>
              {chosen.name.replace("Archangel ", "")} draws close ✧
            </div>
          </div>

          {/* The message — rises in only after the angel has had its moment; the
              portrait stays whole and visible above, so nothing needs scrolling. */}
          <div style={{ flex: "1 1 0", minHeight: 0, overflowY: "auto", opacity: beheld ? 1 : 0, transform: beheld ? "none" : "translateY(16px)", transition: "opacity .85s ease .12s, transform .85s ease .12s", pointerEvents: beheld ? "auto" : "none", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8px 22px 26px" }}>
            <div style={{ maxWidth: 580, margin: "0 auto", width: "100%", textAlign: "center" }}>
              <Eyebrow colour={chosen.hex}>Your angel today</Eyebrow>
              <div className="lum-serif gold-shimmer" style={{ fontSize: 29, fontWeight: 600, margin: "2px 0 3px" }}>{chosen.name}</div>
              <div className="lum-sans" style={{ fontSize: 12, color: T.dim, marginBottom: 13 }}>{chosen.domain} · {chosen.colour} · {chosen.crystal}</div>
              <p className="lum-serif" onClick={() => setWordCount(words.length)} style={{ color: T.ink, fontSize: 17.5, fontStyle: "italic", lineHeight: 1.75, minHeight: 56, margin: 0, cursor: wordCount < words.length ? "pointer" : "default" }}>
                {words.length === 0
                  ? <span style={{ color: chosen.hex, opacity: .9 }}>{chosen.name.replace("Archangel ", "")} is here…</span>
                  : words.slice(0, wordCount).map((w, i) => <span key={i} className="ink-word">{w}</span>)}
              </p>
              {channeling && <div className="lum-serif" style={{ color: chosen.hex, fontStyle: "italic", marginTop: 14 }}>Channelling a message just for you…</div>}
              {words.length > 0 && wordCount >= words.length && !channeling && (
                <div className="fade-up" style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                  <SpeakBtn text={message} colour={chosen.hex} />
                  {paid && <Btn small kind="ghost" onClick={channelPersonal}>✧ Channel just for me</Btn>}
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
  const [angel, setAngel] = useState(null);
  const [msg, setMsg] = useState(""); const [loadingA, setLoadingA] = useState(false);
  const [michael, setMichael] = useState(false);

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
                <div className="fade-up" style={{ position: "relative", marginTop: 14, height: 430, borderRadius: 16, overflow: "hidden", border: `1px solid ${a.hex}66`, background: `radial-gradient(120% 80% at 50% 32%, ${a.hex}22, transparent 62%), linear-gradient(165deg, ${a.hex}14, #0b0a14 72%)`, boxShadow: `0 10px 32px rgba(0,0,0,.5), 0 0 34px ${a.hex}26` }}>
                  <img src={a.img} alt={a.name} style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} />
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(10,10,20,0) 66%, rgba(10,10,20,.82))" }} />
                  <div className="lum-serif" style={{ position: "absolute", left: 14, right: 14, bottom: 10, textAlign: "center", fontStyle: "italic", fontSize: 15, color: "#f2ecdf", textShadow: "0 1px 10px rgba(0,0,0,.9)" }}>
                    {a.domain} · <span style={{ color: a.hex }}>{a.colour}</span>
                  </div>
                </div>
              )}
              {open && (
                <div className="fade-up" style={{ marginTop: 14 }}>
                  <p className="lum-serif" style={{ color: T.ink, fontSize: 15.5, lineHeight: 1.75, margin: 0 }}>{a.about}</p>
                  <div className="lum-sans" style={{ fontSize: 11, color: a.hex, letterSpacing: ".16em", textTransform: "uppercase", margin: "16px 0 9px" }}>Here for you when…</div>
                  <div style={{ display: "grid", gap: 7 }}>
                    {a.callOn.map((c, i) => (
                      <div key={i} className="lum-sans" style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.5, display: "flex", gap: 9 }}>
                        <span aria-hidden style={{ color: a.hex, flexShrink: 0 }}>✦</span><span>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lum-sans" style={{ fontSize: 12.5, color: T.faint, lineHeight: 1.6, marginTop: 14 }}><b style={{ color: T.dim }}>How to know {a.name.replace("Archangel ", "")} is near — </b>{a.signs}</div>
                  <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(13,13,26,.5)", border: `1px solid ${a.hex}33` }}>
                    <div className="lum-sans" style={{ fontSize: 10.5, color: a.hex, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 7 }}>A prayer to call on {a.name.replace("Archangel ", "")}</div>
                    <p className="lum-serif" style={{ color: T.ink, fontSize: 15, fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>“{a.invocation}”</p>
                    <div style={{ marginTop: 10 }}><SpeakBtn text={a.invocation} colour={a.hex} /></div>
                  </div>
                </div>
              )}
              {open && (loadingA
                ? <div className="lum-serif" style={{ color: a.hex, fontStyle: "italic", marginTop: 14 }}>Channelling today's message…</div>
                : msg && (
                  <div className="fade-up" style={{ marginTop: 16 }}>
                    <div className="lum-sans" style={{ fontSize: 10.5, color: a.hex, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>Today's channelled message</div>
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
   ANGEL NUMBERS
   ============================================================ */
const AngelNumberScreen = ({ paid, askUpgrade }) => {
  const [num, setNum] = useState("");
  const [lookup, setLookup] = useState(null);
  const [personal, setPersonal] = useState(""); const [loadingP, setLoadingP] = useState(false);

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

  return (
    <div className="fade-up" style={{ maxWidth: 600 }}>
      <Eyebrow>Angel Numbers</Eyebrow>
      <H>Messages in the numbers</H>
      <p className="lum-serif" style={{ color: T.dim, fontSize: 15, lineHeight: 1.7, margin: "2px 0 18px" }}>When a number keeps finding you — on clocks, receipts, licence plates — your angels may be speaking. Enter a sequence to hear what it carries.</p>

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
    </div>
  );
};

/* ============================================================
   INSPIRATIONAL QUOTES  (flip-card deck — draw as many as you like)
   ============================================================ */
const QuotesScreen = () => {
  const DECK = 8;                       // face-down cards shown as "the deck"
  const CARD_W = 74, CARD_H = 112;
  const [order, setOrder] = useState(() => shuffle(QUOTES.map((_, i) => i)));
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState(null);   // { text, author, card }

  const draw = (card) => {
    if (picked) return;
    let p = pos, ord = order;
    if (p >= ord.length) { ord = shuffle(QUOTES.map((_, i) => i)); p = 0; setOrder(ord); }
    const [text, author] = QUOTES[ord[p]];
    setPos(p + 1);
    setPicked({ text, author, card });
  };
  const again = () => setPicked(null);

  return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Eyebrow>Inspirational Quotes</Eyebrow>
      <H>Turn a card, receive a little light</H>
      <p className="lum-serif" style={{ color: T.dim, fontSize: 15, lineHeight: 1.7, margin: "2px 0 6px" }}>
        Take a breath, choose a card, and turn it over for a message meant for this moment. Draw as many as your heart needs.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, margin: "22px 0 8px" }}>
        {[...Array(DECK)].map((_, i) => {
          const isPicked = picked && picked.card === i;
          const dimmed = picked && !isPicked;
          return (
            <div key={i} onClick={() => draw(i)} style={{ width: CARD_W, height: CARD_H, perspective: 800, cursor: picked ? "default" : "pointer", opacity: dimmed ? 0.28 : 1, transform: isPicked ? "scale(1.08)" : "none", transition: "opacity .5s ease, transform .5s ease" }}>
              <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform .7s ease", transform: isPicked ? "rotateY(0deg)" : "rotateY(180deg)" }}>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(120% 120% at 50% 30%, #2a2440, #14121f)", border: `1px solid ${T.gold}77`, boxShadow: `0 0 22px ${T.gold}44`, color: T.goldHi, fontSize: 30 }}>✦</div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #191830, #0e0d18)", border: `1px solid ${T.gold}33`, boxShadow: "inset 0 0 22px rgba(0,0,0,.5)", color: `${T.gold}aa`, fontSize: 22 }}>✧</div>
              </div>
            </div>
          );
        })}
      </div>

      {picked ? (
        <div className="fade-up">
          <Panel style={{ padding: 26, textAlign: "center", borderColor: T.gold + "44" }}>
            <div className="lum-serif" style={{ fontSize: 21, color: T.ink, fontStyle: "italic", lineHeight: 1.6 }}>“{picked.text}”</div>
            <div className="lum-sans" style={{ fontSize: 13, color: T.gold, marginTop: 14, letterSpacing: ".04em" }}>— {picked.author}</div>
            <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <SpeakBtn text={`${picked.text} — ${picked.author}`} />
              <Btn small kind="ghost" onClick={again}>Draw another ✧</Btn>
            </div>
          </Panel>
        </div>
      ) : (
        <p className="lum-sans" style={{ textAlign: "center", color: T.faint, fontSize: 12.5, marginTop: 4 }}>Tap a card to turn it over ✧</p>
      )}
    </div>
  );
};

/* ============================================================
   LUMINAE ORACLE CARDS
   Artwork lives at public/images/oracle/<id>.webp — drop a file in with a
   card's id as its name and it appears automatically; until then the app
   paints a gradient placeholder so the deck always works. Every draw is a
   true Fisher–Yates shuffle — never a rotation.
   ============================================================ */
const ORACLE_CARDS = [
  { id: "golden-dawn", name: "The Golden Dawn", essence: "Beginnings · Hope · First light", hex: "#e3b54a", message: "Something new is quietly beginning in you, beloved — do not rush it into the light. Meet this day the way dawn meets the hills: softly, certainly, and without apology.",
    book: "The Golden Dawn rises when a chapter is beginning whether or not you feel ready — and its deeper teaching is that readiness was never the requirement; willingness is. Dawn does not ask the night's permission, and it does not arrive all at once: it comes as a thin gold line, then a blush, then the whole sky. Whatever is starting in your life will unfold at that same holy pace. Your work is not to force the sunrise but to face east — to put yourself where the light will find you, and to stop rehearsing the darkness.",
    shadow: "In shadow, this card warns against false starts made from impatience, and against dismissing a real beginning because it looks too small to matter.",
    affirm: "I do not need the whole sky to change — a thin gold line is enough to begin." },
  { id: "moonlit-path", name: "The Moonlit Path", essence: "Intuition · Trust · The unseen way", hex: "#9cb8ee", message: "You cannot see the whole road, and you were never meant to. Take the one step the moonlight shows you, and trust that the next stone will appear beneath your foot.",
    book: "The Moonlit Path is the card of navigation without daylight — those seasons when logic runs out of map and something older must take the wheel. Moonlight never shows the destination; it shows exactly one step, and that is its mercy, because a whole road revealed at once would send you back to bed. This card confirms that the quiet pull you feel is trustworthy even though you cannot defend it in daylight language. Intuition is not the absence of information; it is information arriving by an older road.",
    shadow: "In shadow, it cautions against demanding certainty as the price of movement — and against mistaking anxiety's loud static for intuition's quiet signal.",
    affirm: "I can walk a road I cannot see, one moonlit stone at a time." },
  { id: "sacred-pause", name: "The Sacred Pause", essence: "Rest · Stillness · Permission", hex: "#8fb8a8", message: "This card is not asking you to do anything — that is the whole message. Rest is not the absence of progress; it is where your soul catches up with your life.",
    book: "The Sacred Pause arrives for the ones who treat rest as a reward they haven't earned yet. Its deeper teaching: everything alive is rhythmic — the heart rests between every beat, the tide withdraws before it returns, winter is not the field failing. You have been reading your own fallow season as falling behind, and this card has come to correct the translation. Something in you is being restored that can only be restored in stillness, and it is not optional maintenance; it is the next part of the work, wearing quieter clothes.",
    shadow: "In shadow, it distinguishes true rest from hiding: pausing to be restored is sacred; pausing to avoid a door you already know you must walk through is not rest but rehearsal of fear.",
    affirm: "My stillness is not stalling — the field is being fed." },
  { id: "rising-phoenix", name: "The Rising Phoenix", essence: "Rebirth · Release · Becoming", hex: "#e07a5f", message: "What burned away was never the truest part of you. You are allowed to rise different — brighter, lighter, and unashamed of the ashes that taught you.",
    book: "The Rising Phoenix comes to those standing in the aftermath of an ending they did not choose or barely survived choosing. Its teaching is precise: the fire took only what could burn — and what cannot burn in you is exactly what rises. You are not required to reassemble the person you were; that person was the chrysalis, not the point. Grief for the old life and joy for the new one can share a chest. Rise anyway, with both.",
    shadow: "In shadow, it warns against building a replica of the life that burned simply because its shape was familiar — and against picking through cold ashes for an identity that has already been released.",
    affirm: "What is truest in me is fireproof — and it is rising now." },
  { id: "open-heart", name: "The Open Heart", essence: "Love · Receiving · Softness", hex: "#d489a0", message: "You have given so generously — this card asks whether you have let yourself receive. Let love in through the door you usually hold open only for others.",
    book: "The Open Heart names a quiet imbalance: you have made yourself the giver in nearly every room, because giving keeps you safely in control of the exchange. Receiving requires a vulnerability that giving never asks — to be seen mid-need, unpolished, mid-becoming. This card comes when love is already present and waiting, blocked not by scarcity but by your own closed hand. The deeper work is believing you are not a debt that kindness must be repaid to, but a home it wants to live in.",
    shadow: "In shadow, it asks whether generosity has become armour — and whether you have been calling self-sufficiency 'strength' when some of it is just old fear of needing anyone.",
    affirm: "I am allowed to be loved in the same measure I love." },
  { id: "quiet-voice", name: "The Quiet Voice", essence: "Inner knowing · Discernment", hex: "#b7a8e0", message: "Beneath the noise of every opinion you carry, there is a voice that has never once lied to you. Get quiet enough today to hear it — you already know.",
    book: "The Quiet Voice appears when you have been outsourcing a decision that was only ever yours to make — polling friends, collecting articles, waiting for a sign loud enough to override responsibility. Its teaching: the knowing arrived before the noise did. You felt the answer in the first thirty seconds, and everything since has been negotiation. The voice is quiet not because it is weak but because it has nothing to prove; only fear needs volume. Discernment is learning the difference in texture — fear argues, knowing simply waits.",
    shadow: "In shadow, it warns against using endless 'gathering of perspectives' as a hiding place, and against confusing the loudest inner voice with the truest one.",
    affirm: "I trust the voice in me that has never needed to shout." },
  { id: "guardians-wing", name: "The Guardian's Wing", essence: "Protection · Safety · Being held", hex: "#3b6fd4", message: "You are more protected than you feel, beloved. Walk today as one who is watched over — because you are, in ways seen and unseen.",
    book: "The Guardian's Wing arrives for the vigilant — the ones who believe that if they stop scanning for danger for one moment, the sky will fall on the people they love. Its teaching is a demotion you will be glad of: you were never hired to hold the whole sky. Protection is already present in your life in forms you rarely audit — the near-misses that missed, the doors that closed against your will and saved you years. This card invites you to borrow, for one day, the nervous system of someone who believes they are held. Notice what becomes possible.",
    shadow: "In shadow, it asks whether hyper-vigilance has been mistaken for love — and gently notes that a guard who never sleeps eventually guards nothing well.",
    affirm: "I am held by more than my own hands." },
  { id: "rivers-surrender", name: "The River's Surrender", essence: "Letting go · Flow · Trust", hex: "#7fd4e0", message: "The river does not argue with its bends. Loosen your grip on the outcome you've been white-knuckling, and let the current carry what was always too heavy for your hands.",
    book: "The River's Surrender comes when control has quietly become your heaviest possession. Its teaching: surrender is not giving up — it is giving over. The river reaches the sea precisely because it does not insist on a straight line; every bend you are currently fighting may be the course correction you would have prayed for with more information. This card marks the moment to stop swimming against what has already been decided by the current of your life, and to save your strength for the stretch where it will genuinely matter.",
    shadow: "In shadow, it distinguishes surrender from passivity: letting the river carry you is trust; refusing to steer at all, ever, is abdication dressed as spirituality.",
    affirm: "I release the oar I was using to fight the current that is carrying me home." },
  { id: "inner-flame", name: "The Inner Flame", essence: "Courage · Creation · Vitality", hex: "#ecb14c", message: "The spark you keep dismissing as 'just a little idea' is a flame waiting for your breath. Feed it one brave act today — tiny is enough; lit is what matters.",
    book: "The Inner Flame appears when something in you wants to be made — a work, a change, a life — and has been waiting politely behind the excuse of timing. Its teaching: fire does not scale by planning; it scales by feeding. One log, then the next. The creative force in you is not fragile, but it is responsive — it grows toward whatever you actually do and starves on what you merely intend. This card is permission to be a beginner in public, to make the imperfect first thing, to let enthusiasm be a compass instead of an embarrassment.",
    shadow: "In shadow, it warns of the flame turned inward — restlessness, irritability, envy of those who began — which is simply unmade work burning the vessel that refuses to pour it.",
    affirm: "I feed my fire with action, one brave log at a time." },
  { id: "star-seed", name: "The Star Seed", essence: "Purpose · Destiny · Remembering", hex: "#b898e8", message: "You did not come here by accident. The longing you feel is not homesickness — it is your purpose remembering itself. Follow what makes you feel most like you.",
    book: "The Star Seed speaks to the ache that successful, sensible lives are often built on top of — the sense of being meant for something you cannot quite name. Its teaching: purpose is not found, it is remembered, and the memory returns in fragments — the activities where time dissolves, the subjects you cannot stop circling, the compliment strangers keep repeating. These are not coincidences; they are coordinates home. This card does not demand you burn down your life. It asks only that you stop treating the longing as a malfunction and start treating it as a map.",
    shadow: "In shadow, it cautions against waiting for purpose to arrive as one blinding revelation — and against using 'I don't know my calling yet' to postpone the small faithful steps that reveal it.",
    affirm: "My longing is a map, and I am already on the road it draws." },
  { id: "healing-waters", name: "The Healing Waters", essence: "Forgiveness · Gentleness · Mending", hex: "#6fc3b0", message: "Some wounds close only when you stop reopening them with blame — including the blame you aim at yourself. Let mercy be the medicine today, in both directions.",
    book: "The Healing Waters flow toward a wound that has been kept open by revisiting — the replayed conversation, the verdict you keep re-reading, the apology you are still waiting for or still owe yourself. Its teaching: forgiveness is not declaring that what happened was acceptable; it is declaring that your life will no longer be its full-time museum. And the harder half is usually self-forgiveness — extending to your past self, who decided with less information and fewer resources, the same mercy you would hand a friend without hesitation.",
    shadow: "In shadow, it distinguishes mending from erasing: healing does not require amnesia or reunion — some forgiveness is completed entirely within your own chest, with the door still lovingly closed.",
    affirm: "I release the wound from its post as the narrator of my story." },
  { id: "infinite-thread", name: "The Infinite Thread", essence: "Connection · Synchronicity · Grace", hex: "#c9a84c", message: "Nothing about today is random, beloved. The repeated number, the song, the stranger's sentence that landed like a letter — the universe is speaking in thread. Follow it.",
    book: "The Infinite Thread appears when life has been winking at you — repeated numbers, impossible timing, the friend who called the moment you thought of them — and you have been explaining it all away. Its teaching is not superstition but attention: meaning travels through the world along threads of coincidence, and whether they are woven by heaven or by your own deep mind noticing what matters, following them leads somewhere true. This card also speaks of the threads between people: no kindness you have given has been lost. The web holds; you are woven in; you have never once been separate.",
    shadow: "In shadow, it warns against reading omens as a substitute for decisions — the thread invites you forward; it does not walk for you.",
    affirm: "I am woven into a pattern larger and kinder than I can see." },
  { id: "full-cup", name: "The Full Cup", essence: "Gratitude · Thanksgiving · Enough", hex: "#eac66a", message: "The good you have been waiting to feel is already standing in the room, beloved — it is only waiting to be noticed. Today, do not pray for more; turn and thank what is already here, and watch how enough becomes a feeling and not a number.",
    book: "The Full Cup arrives on the ordinary morning when you have been so busy reaching for the next thing that you have stopped tasting the cup already in your hands. Its teaching is that gratitude is not a mood that visits the lucky; it is a practice, a turning of the head, a discipline of noticing what mercy has quietly left on your table. The common mistake is to treat thanksgiving as something you will feel once life finally delivers enough — but enough is not a threshold the world crosses for you; it is a decision you make from where you already stand. Count slowly today, and count small: the warm cup, the breath, the face that knows your name. The cup was full the whole time; you were simply looking past its rim.",
    shadow: "In shadow, this card warns against a hollow gratitude that recites its blessings without feeling them, and against using thankfulness to shame yourself out of a longing that is also true.",
    affirm: "I turn toward what is already here and let it be enough." },
  { id: "endless-field", name: "The Endless Field", essence: "Abundance · Provision · Plenty", hex: "#a9c46c", message: "There is more than you have been letting yourself believe — the field does not run out because you finally exhaled. Loosen your grip today; provision has never depended on your fear, and the hand that scatters seed is never the hand that goes hungry.",
    book: "The Endless Field appears when scarcity has become the lens you mistake for clear sight — when you have been rationing your love, your money, your rest as though generosity were a leak in the hull. Its teaching is that abundance is not a pile you guard but a current you trust: the field gives because giving is its nature, and the seed multiplies only once it leaves the closed fist. The misunderstanding is to believe that holding tighter makes you safer, when in truth the clenched hand can neither plant nor receive. You were not made to hoard the harvest against a famine that fear keeps predicting. Open your hands to what is passing through them; there is enough, there has been enough, and what you release in trust returns as more than you let go.",
    shadow: "In shadow, this card exposes both the hoarding that mistakes a full vault for a full life, and the spiritual bypass that calls reckless spending 'trust' while ignoring the wisdom of tending what you are given.",
    affirm: "I open my hands, trusting that what flows through them will not run dry." },
  { id: "walled-garden", name: "The Walled Garden", essence: "Boundaries · The Sacred No · Sovereignty", hex: "#b5566a", message: "Your yes has meant so little lately because you have been afraid to say no — but a garden without a wall is not generous, it is simply trampled. Draw the line today, gently and without apology; protecting your peace is not the opposite of love, it is the shape mature love takes.",
    book: "The Walled Garden arrives when your kindness has quietly curdled into self-abandonment — when you keep answering doors you were never obligated to open, and calling the exhaustion virtue. Its teaching is that a boundary is not a wall against love but the very thing that keeps love from being consumed; the garden thrives precisely because something guards its gate. The misunderstanding is to hear 'no' as cruelty, as a slammed door, when in truth the sacred No is what makes your yes trustworthy and your care sustainable. You are not a public commons obliged to host every trespass. Decide what belongs inside your walls and what does not, and say it plainly — for the peace you protect is not selfishness hoarded, it is the soil in which everything you love is finally able to grow.",
    shadow: "In shadow, this card warns against the wall built so high it becomes a prison — boundaries hardened into punishment, or a No wielded to control others rather than to keep yourself whole.",
    affirm: "I protect my peace without apology, for my No is what keeps my Yes true." },
  { id: "ripening-bough", name: "The Ripening Fruit", essence: "Patience · Divine Timing · The Slow Ripening", hex: "#d8956a", message: "What you are waiting for is not late; it is ripening, and no fruit was ever made sweeter by being pulled green from the branch. Let the timing be holy today — your only task is to keep faith with the slow work, not to force what only the sun and the waiting can finish.",
    book: "The Ripening Fruit arrives in the long middle, after the bloom has fallen and before the fruit is ready — the unglamorous season when nothing visible seems to be happening and you begin to suspect you have been forgotten. Its teaching is that ripening is not idleness; beneath the still surface the sweetness is being made, slowly, invisibly, at a pace no anxiety can hurry. The misunderstanding is to read the wait as refusal, to mistake 'not yet' for 'no' and pluck the thing down hard and sour just to end the ache of uncertainty. But some things spoil under a forced hand and flourish only under a patient one. Keep faith with the slow work. What is meant for you is not being withheld — it is being finished, and it will fall into your open palm the moment it is truly ripe.",
    shadow: "In shadow, this card names the impatience that forces a green harvest and calls the sourness fate, and also the passivity that hides behind 'divine timing' to avoid the ripening's real and necessary work.",
    affirm: "I trust the slow ripening, and I refuse to pull the fruit before its time." },
  { id: "tender-dark", name: "The Tender Dark", essence: "Grief · Mourning · Honoring Loss", hex: "#6a72c0", message: "What you are carrying deserves to be carried, not hurried — let the sorrow move through you today instead of asking it to detour politely around your days. Grief is not the enemy of healing; it is the shape love takes when it has nowhere left to go.",
    book: "The Tender Dark arrives when you have been managing a loss instead of mourning it — staying busy, staying strong, letting the tears wait for a more convenient hour that never comes. Its teaching: grief is not a problem to be solved but a passage to be walked, and the only way out of it has always been through the middle of it. The common mistake is believing that if you let yourself fully feel the sorrow, it will swallow you whole and never give you back. But grief moves like weather, not like a verdict; it rises, it breaks, it passes over — and what it asks is not that you be destroyed, only that you be present. Let it come through you like rain through open windows. It is love, still looking for the one it lost.",
    shadow: "In shadow, this card names the two ways sorrow curdles — the grief performed for an audience that never touches the real wound, and the grief locked away so completely that it hardens into a numbness mistaken for peace.",
    affirm: "I let my sorrow move through me, trusting that feeling it fully is how I set it free." },
  { id: "true-face", name: "The True Face", essence: "Authenticity · The True Face · Being Seen", hex: "#5fb98f", message: "The performance you have kept running is exhausting the very person it was meant to protect — you may set it down now. Let yourself be seen as you actually are today; the ones worth keeping were never in love with the mask.",
    book: "The True Face arrives when the gap between who you are and who you perform has grown wide enough to ache — when you catch yourself curating your own face, editing your laugh, rehearsing opinions you do not quite hold. Its teaching: the mask you wear to be accepted guarantees that acceptance will never reach you, because it lands on the disguise and not the person beneath. The common mistake is believing authenticity means broadcasting every feeling to everyone; it does not. It means ceasing to counterfeit — letting your yes mean yes, your face match your heart, your life stop being a role you audition for daily. Being truly seen is frightening precisely because it is real: only the unmasked can be genuinely loved, and only what is true can finally rest.",
    shadow: "In shadow, this card warns of authenticity twisted into a weapon — cruelty and oversharing excused as 'just being honest,' and the quiet performance of a 'flawless authenticity' that is only a subtler, more convincing mask.",
    affirm: "I set down the mask and let myself be known as I truly am." },
  { id: "unweighed-gold", name: "The Unweighed Gold", essence: "Enoughness · Worth · Wholeness", hex: "#e6cfa0", message: "You have been trying to earn a worth that was already yours before you achieved a single thing — the striving cannot add to it, and the failing cannot subtract. Rest here today: you are not a project to be completed, beloved, you are already whole.",
    book: "The Unweighed Gold arrives when you have quietly organized your whole life around proving you are worth keeping — chasing the achievement, the approval, the number that will finally make you enough. Its teaching: gold does not become valuable when it is weighed; the scale only measures a worth that was already there in the ground, in the dark, before any hand reached for it. You were not born as raw material awaiting improvement. The common mistake is believing your worth is a balance you must keep earning, forever one failure away from bankruptcy — but intrinsic means exactly that: it cannot be added to by success or spent down by struggle. You may rest from the auditioning. What you have been trying to become, you have quietly been all along.",
    shadow: "In shadow, this card exposes the counterfeit cures — the arrogance that overcompensates for a hidden sense of lack, and the endless self-improvement that keeps postponing worthiness to a finish line deliberately kept out of reach.",
    affirm: "I am already whole, and nothing I achieve or fail at can add to or diminish my worth." },
  { id: "ringing-bell", name: "The Ringing Bell", essence: "Presence · The Eternal Now · Arriving", hex: "#a8c4d4", message: "You keep leaving this moment to visit a past you cannot change and a future that has not arrived — and your life is happening in neither. Come back, beloved; the only place you have ever been able to breathe is here.",
    book: "The Ringing Bell sounds when you have been living everywhere but here — narrating yesterday, rehearsing tomorrow, and missing the warm cup already in your hands. Its teaching: the present is not a thin sliver between two vast countries of past and future; it is the only country, and the other two are made entirely of thought. A bell does not ring in memory or in anticipation — its sound exists only in the instant it is struck, and so do you. The common misunderstanding is that presence means emptying the mind, becoming blank and still as a monk on a poster. It asks something humbler: simply to notice you are here, once more, and then once more again, each time the mind wanders off to somewhere it cannot actually live.",
    shadow: "In shadow, this card warns that 'being present' can curdle into a new perfectionism — scolding yourself for every wandering thought and turning the open now into one more test you are failing.",
    affirm: "I return, gently and as often as it takes, to the only moment I am alive in." },
  { id: "guest-at-the-door", name: "The Guest at the Door", essence: "Shadow · Integration · Welcoming the Exiled", hex: "#7a5c9e", message: "The part of you that you locked away for being too much — too tender, too angry, too hungry, too afraid — is standing at the door of your life, asking only to be let back in. It was never your enemy, beloved; it was the child who learned that love had conditions.",
    book: "The Guest at the Door arrives when something you exiled long ago — a temper, a hunger, a softness, a need — begins knocking again through your dreams, your slips, the people who suddenly irritate you beyond all reason. Its teaching: what you disown does not leave the house; it moves to the basement and pulls the strings from there. Wholeness is not becoming good enough to have no shadow — it is turning on the light and discovering the monster was a frightened younger self doing its clumsy best to keep you safe. The common error is to fight the shadow, to shame or starve it into submission. But the exiled part does not want to be conquered; it wants to be welcomed home to the table it was sent away from.",
    shadow: "In shadow, this card warns against the two easy exits — pretending you have no dark to face, or romanticizing your wounds until the shadow becomes your whole identity instead of an honored guest.",
    affirm: "I open the door to the parts of me I once sent away, and set a place for them at my table." },
  { id: "elder-tree", name: "The Elder Tree", essence: "Wisdom · The Inner Elder · Lived Knowing", hex: "#c39a5a", message: "You have been searching the world for a teacher, forgetting that you have already survived everything that once seemed impossible — and something in you kept the notes. The elder you are becoming is already here, quietly, and would like a word.",
    book: "The Elder Tree appears when you are hunting outside yourself for an authority you have slowly been becoming all along. Its teaching: wisdom is not cleverness, and it is not information; it is the slow sediment of everything you have lived through, felt fully, and did not run from. A young tree bends at every wind; the old one has been shaped by a thousand storms into something that no longer needs to argue with the weather. The common misunderstanding is that wisdom arrives as certainty, a final answer that ends all doubt. But the inner elder rarely gives orders — it offers perspective, the long view that knows this too will pass, that you have been here before, and that you already know more than your fear will let you admit.",
    shadow: "In shadow, this card warns against mistaking mere opinion or stubbornness for wisdom, and against silencing your own hard-won knowing out of deference to louder, more confident voices.",
    affirm: "I honor the quiet authority of everything I have lived, and let my inner elder speak." },
  { id: "long-table", name: "The Long Table", essence: "Belonging · Community · You Are Not Alone", hex: "#e0925c", message: "You were never meant to carry your life alone, and the ache you keep calling weakness is simply your belonging trying to find its way home. There is a table where your absence is felt, beloved — let yourself be found at it.",
    book: "The Long Table arrives when you have been mistaking self-sufficiency for strength, quietly starving on a diet of doing everything yourself. Its teaching: belonging is not something you earn by being impressive enough to deserve a seat; it is your birthright as a creature made for one another, and the chair with your name on it has been empty this whole time. Human beings are not solitary by design — we are woven into peoples, held by kitchens and choirs and circles of the ordinary faithful. The common misunderstanding is that you must first become whole and healed before you are fit for company. But you do not join the table once you are well; you grow well because you finally sat down, passed the bread, and let yourself be counted among the loved.",
    shadow: "In shadow, this card warns against belonging bought by self-erasure — shrinking, performing, or abandoning your truth just to keep a seat at a table that was never really yours.",
    affirm: "I let myself be held by my people, and take the seat that has been waiting for me." },
  { id: "company-of-one", name: "The Company of One", essence: "Solitude · Sacred Aloneness · Belonging to Self", hex: "#7d94c8", message: "Being alone is not the same as being unaccompanied, beloved — you keep the oldest company there is. Let today's quiet be a garden rather than a waiting room; the parts of you that only ripen in solitude are ripening now.",
    book: "The Company of One arrives when the world has emptied of voices and you have mistaken the silence for absence — the unanswered evening, the table set for one, the weekend no one claimed. Its teaching is that solitude and loneliness are not the same country, though they share a border: loneliness is aloneness you did not choose and cannot leave, while solitude is the same room entered on purpose, with the door left open. You are not being left out of life here; you are being handed back to yourself. Much of who you are was grown in exactly this quiet — the long reading, the wandering thought, the unwitnessed hour. Do not rush to fill the space with anyone. Some fruit ripens only where no one is watching.",
    shadow: "In shadow, this card warns against dressing avoidance up as retreat — using chosen aloneness to hide from the people who would love you, and calling a wall a sanctuary.",
    affirm: "I am good company to myself, and the quiet is where I grow." },
  { id: "doorway-between", name: "The Doorway Between", essence: "Threshold · Transition · The Sacred In-Between", hex: "#9d7cc0", message: "You are standing in the doorway now — no longer in the room you left, not yet in the one ahead — and this narrow place is not a mistake to hurry through. The threshold is holy ground; let yourself be here, between, without demanding to know the shape of the next room.",
    book: "The Doorway Between arrives in the unnamed season — after the ending, before the beginning; the notice given but not yet worked out, the grief softening but not gone, the self you were dissolving faster than the self you will be can form. You want to sprint across this space because you were taught that only rooms matter and hallways are wasted time. But every old tradition posts its angels at the threshold, not the hearth — the doorway is where the blessing is given and the name is changed. You are not in limbo; you are in the one place where you are still soft enough to be reshaped. Stop measuring this stretch by how quickly it ends. Something is being decided in you that could be decided nowhere but here.",
    shadow: "In shadow, this card warns against bolting through the between out of sheer discomfort — seizing any next room simply to be done with the ache of standing in the door.",
    affirm: "I let the in-between be holy, and I do not rush the threshold to be done." },
  { id: "unseen-hold", name: "The Unseen Hold", essence: "Faith · Trust Before Proof · The Unseen Holding You", hex: "#4a76c8", message: "You are being asked to trust something you cannot yet prove, and the proof is not coming before the trust — that is the whole nature of the thing. Lean your weight into the day anyway; what holds you has never once required you to see it first, beloved.",
    book: "The Unseen Hold arrives when life asks you to move before the evidence is in — to keep an appointment with a future you cannot yet see, to trust a person, a path, a healing, a God, with no receipt in your hand. The misunderstanding it comes to correct is this: you were told faith means the absence of doubt, and so every tremor of uncertainty has felt like a failing. But faith was never the opposite of doubt — fear is. Faith is simply what you do with your hands and your feet while the doubt keeps talking. It is leaning your weight onto ground you cannot see and discovering, only afterward, that it held. You do not need to feel certain to act faithfully; you need only to lean, one honest ounce at a time, into what is already holding you.",
    shadow: "In shadow, this card warns against mistaking faith for passivity — using 'trusting the unseen' as an excuse to abandon the footing and the effort that were plainly yours to provide.",
    affirm: "I lean my weight into what I cannot yet see, trusting that it holds." },
  { id: "first-time-again", name: "The First Time Again", essence: "Wonder · Awe · The Astonished Ordinary", hex: "#74c8dd", message: "The world has not grown dull, beloved — only your looking has grown used to it. Let something ordinary stop you today: the light caught in a glass of water, a face you have seen ten thousand times; look as though it were the first time, and it very nearly is.",
    book: "The First Time Again arrives when the days have begun to blur — the same commute, the same faces, the same sky you have stopped looking up at — and you have quietly concluded that the wonder simply ran out. It did not. Wonder is not a substance the world dispenses in childhood and then withholds; it is a way of looking that can be picked back up at any age. The child is not astonished because the world is more astonishing to them, but because nothing has yet been filed under 'already seen.' That glass of water is still an impossibility. That the person beside you exists at all is still outrageous. Awe was never hiding in the far-off and exotic — it was always here, waiting for you to un-forget how to look.",
    shadow: "In shadow, this card warns against chasing ever-bigger spectacles to feel something — outsourcing awe to the extraordinary while walking blind past the miracles already resting in your hands.",
    affirm: "I look at the ordinary as if for the first time, and find it was never ordinary." },
  { id: "worn-step", name: "The Worn Step", essence: "Devotion · Practice · Faithfulness", hex: "#e8a94e", message: "Love is not the grand vow you make once in the firelight; it is the small return you make ten thousand times in the ordinary dark. Show up for the practice again today, beloved — the step is worn smooth precisely because you kept coming back.",
    book: "The Worn Step appears when you are waiting to feel inspired before you begin, mistaking devotion for a mood instead of a movement. Its teaching is that the sacred is built by repetition, not by intensity — the step in the old doorway was not carved by one heroic leap but by countless plain mornings of the same faithful foot. You want the feeling to carry you to the practice; devotion knows the practice is what summons the feeling, and often long after. Discipline has been slandered as the enemy of love, but it is only love made repeatable — the form that tenderness takes when the initial thrill has quietly left the room and someone must keep the fire fed anyway. What you keep returning to is what you are truly worshipping. Choose the step you would be proud to have worn.",
    shadow: "In shadow, this card warns against devotion hardened into rote duty that has forgotten who it once loved, and against the pride that keeps the practice only to be seen keeping it.",
    affirm: "I return to my practice again today, and let faithfulness do what feeling cannot." },
  { id: "turning-wheel", name: "The Turning Wheel", essence: "Cycles · Seasons · Turning", hex: "#cc8a55", message: "Nothing you are living right now is standing still, beloved — not the ache, and not the sweetness. Hold what is bright a little more lightly, and let what is heavy keep moving; the wheel was never built to stop for either one.",
    book: "The Turning Wheel arrives to remind you of the one thing every season forgets about itself — that it is passing. It comes in the bright times to whisper that the harvest was never meant to be held, and in the lean times to promise that this, too, is only a position on the wheel and not the shape of the whole. Its teaching is that nothing you are living is permanent: not the grief that feels like weather with no forecast, not the joy you are quietly trying to freeze in place. The wheel does not stop at the top for the ones it favours, nor punish anyone at the bottom — it simply turns, faithfully, carrying every state into the next. To love what is here without clutching, and to release what is leaving without despair, is how you learn to ride a moving thing.",
    shadow: "In shadow, this card warns against gripping a bright season so tightly that you crush it — and against the opposite mistake of using 'this too shall pass' as a reason to never fully arrive anywhere.",
    affirm: "I hold both the bright and the bitter lightly, and trust the wheel to keep turning." },
  { id: "ancestral-ground", name: "The Ancestral Ground", essence: "Home · Roots · Lineage", hex: "#c07a4e", message: "You did not begin at your birth, beloved — you are the newest branch of something with very deep roots. Whatever holds you today, notice the ground you are standing on and how far down it goes.",
    book: "The Ancestral Ground rises when you feel unmoored — as if you must invent yourself from nothing, carry every weight alone, and hold your own edges together by force of will. Its teaching is that you are not the first of your kind: beneath you runs a lineage of hands that planted, endured, buried, and began again, and their surviving is the soil you grow in. The common misunderstanding is that roots hold you back, that belonging is a cage and freedom means cutting loose. But a tree is not imprisoned by its roots; it is fed by them. You may honor where you come from without agreeing to repeat it — keep the ground, and still choose which way to grow toward the light.",
    shadow: "In shadow, this card becomes ancestor-worship that traps you in inherited wounds, or the opposite refusal that severs you from every source of belonging.",
    affirm: "I stand on ground I did not have to build, and I am free to grow my own way." },
  { id: "living-temple", name: "The Living Temple", essence: "Embodiment · Presence · The Body's Wisdom", hex: "#d68c86", message: "Your body is not a thing you drag through the day, beloved — it is the one home you have never once left. Come back into it now: feel your feet, your breath, the warm animal fact of being alive.",
    book: "The Living Temple appears when you have been living from the neck up — treating your body as luggage, as a problem to manage, as something you will attend to once the important thinking is done. Its teaching is that the body is not beneath your wisdom; it is where your wisdom actually lives. The gut that tightened, the shoulders that rose, the breath that went shallow — these were messages sent before your mind had words, and you called them nothing. The misunderstanding is that presence is a mental achievement, reached by thinking harder about the moment. But you cannot think your way home; you can only descend into it — into the hands, the belly, the soles of the feet — where you have been waiting for yourself all along.",
    shadow: "In shadow, this card curdles into using the body only as a mirror to be judged, or numbing its signals until pain is the only voice loud enough to reach you.",
    affirm: "I return to my body as a home, not a battleground." },
  { id: "waking-dream", name: "The Waking Dream", essence: "Vision · Dreams · Possibility", hex: "#b0a2e2", message: "Let yourself picture it fully — not the safe, shrunken version, but the one that makes your chest ache with how much you want it. What you can vividly imagine, you have already begun to build.",
    book: "The Waking Dream arrives when you have quietly stopped letting yourself want things — when you catch a vision of a fuller life and dismiss it in the same breath as foolish, unrealistic, not for someone like you. Its teaching is that imagination is not escape from reality; it is the first draft of it. Nothing was ever built that was not first pictured — the house, the healing, the work you were made for all lived as a daydream before they wore a single nail. The misunderstanding is that dreaming is passive, a way of avoiding the present. But to dare to picture what could be is the bravest act there is, because it admits desire and risks disappointment. Give the vision room. You cannot walk toward a door you refuse to see.",
    shadow: "In shadow, this card drifts into fantasy used as a hiding place — endless imagining that never risks a single step into the daylight where the dream must actually be built.",
    affirm: "I dare to picture the life I want, and I let the vision lead me forward." },
  { id: "watchfire", name: "The Watchfire", essence: "Righteous Anger · Fierce Love · Sacred Protection", hex: "#e2664e", message: "Not all fire is destruction, beloved — some of it is the flame you keep lit at the threshold of what is sacred to you. The anger rising in you today is not a flaw to apologize for; it is love standing up to say this far, and no farther.",
    book: "The Watchfire is lit when you have been treating your anger as a shameful thing to douse rather than a faithful sentry to heed — apologizing for the very feeling that was trying to protect you. Its teaching is that clean anger is not cruelty; it is love that has finally noticed a boundary being crossed and refused to look away. The fire at the threshold does not rage at the whole night — it burns precisely, warming what belongs to you and warning what does not. You were taught that gentleness and fury cannot share a heart, but the fiercest protectors are the tenderest ones; the flame guards exactly because it cherishes. Do not confuse the guardian at your gate with the intruder it was raised to turn away.",
    shadow: "In shadow, this fire forgets its purpose and becomes the very thing it was raised to guard against, scorching the ones it loves instead of lighting the line between them.",
    affirm: "I let my anger stand guard at the door of what is holy in me, without letting it burn the house down." },
  { id: "cleansing-rain", name: "The Cleansing Rain", essence: "Release · Tears · Catharsis", hex: "#8fb4dd", message: "You have been braced and buttoned and holding it all together so long, beloved, that the holding turned invisible to you — you are allowed to come undone. Let the sky in you finally break today; these are tears of release, not of ruin, the body rinsing off a long, tense season, and what pours out will leave you lighter rather than less.",
    book: "The Cleansing Rain arrives for the one who has been clenched against their own overwhelm through a long, braced season — shoulders up, jaw set, running on the fumes of keeping everything upright. Its teaching is that feeling is weather, not climate: every wave allowed to rise is a wave allowed to fall, and it is the held tension, not the released one, that hardens in the body over years. You were told composure is strength, but there is nothing strong about a pressure you refuse to let vent. Not every tear is grief; some are simply relief, the storm that finally answers a long dry drought of holding on. Let the rain come today, and notice how clean the air feels once it has washed the season off you and left you new.",
    shadow: "In shadow, this energy either keeps the valve clamped shut until the held pressure calcifies into a chronic ache, or mistakes wallowing for washing — running the tap endlessly instead of letting the rain move through, rinse, and pass.",
    affirm: "I let the rain move through me, trusting that release will leave me clean and lighter, not empty." },
  { id: "skipping-stone", name: "The Skipping Stone", essence: "Play · Lightness · Whimsy", hex: "#f0c862", message: "You were not placed here only to be useful, beloved — some of your lightest hours will be the ones that lead nowhere and prove nothing. Let yourself be gloriously unserious today: follow the pointless impulse, take the long way home, and let play be its own good reason.",
    book: "The Skipping Stone appears when you have folded even your leisure into the ledger of productivity — turning walks into exercise, hobbies into side hustles, rest into preparation for more work. Its teaching is that play is not what you earn once the meaningful things are done; it is one of the meaningful things, the part of you that remembers you are a creature and not a machine. A stone thrown to skip crosses no distance that matters and arrives nowhere useful, yet the throwing is its own complete point — that very pointlessness is the gift. You were taught that seriousness is the mark of a life well lived, but children are wiser: they know that a game with no score, a detour with no destination, and an afternoon that files no report are not distractions from your soul's work — some days they are the whole of it.",
    shadow: "In shadow, this energy either dismisses play as childish and beneath a serious life, or scatters into constant distraction — using perpetual lightness to skip across the surface of everything that quietly asks to be felt.",
    affirm: "I let myself play for no reason at all, trusting that not everything worth doing has to be worth something." },
  { id: "long-road", name: "The Long Road", essence: "Perseverance · Endurance · Steadfastness", hex: "#c66a4a", message: "The distance still ahead is not a verdict on whether you will arrive, beloved — it is only the shape of the road. Take the next step, and then the one after it; the far country is reached the same way the near one is, one faithful footfall at a time.",
    book: "The Long Road comes to you at the stretch where the destination has dropped below the horizon and every mile ahead looks like the mile behind — no signpost, no landmark, no proof that you are any nearer than when you set out. Its teaching is that perseverance is not a feeling of strength but a decision made in its absence; the steady foot keeps walking precisely on the nights the heart has none of its earlier fire. You imagine that those who finished were carried by motivation the whole way, but motivation is a fair-weather friend that leaves at the first steep hill — what remains is the humble, unglamorous willingness to take one more step in the dark. You do not have to see the far country to reach it. You have only to refuse to make the road your permanent address.",
    shadow: "In shadow, this energy hardens into grim endurance for its own sake, mistaking the refusal to ever rest or reconsider for the clear-eyed walking that knows both when to continue and when the road itself has changed.",
    affirm: "I take the next step in the dark, trusting that arrival is built from footfalls and not from certainty." },
  { id: "last-sheaf", name: "The Last Sheaf", essence: "Completion · Endings · Fruition", hex: "#d4a94c", message: "Something in your life has quietly reached its end, and it asks now to be honored rather than extended. You do not have to keep the field growing to prove the harvest mattered — let what is finished be finished, beloved, and turn toward home.",
    book: "The Last Sheaf arrives when a season of your life has done all it came to do, yet you keep returning to the field as if there were one more thing to gather. Its teaching: completion is not loss but fulfillment — the harvest is not diminished by ending; the ending is the harvest. We are taught to fear the final page, to read closure as failure or abandonment, to leave chapters open in case we need them again. But a thing left perpetually unfinished cannot nourish you; only what is bound and brought in becomes bread. To honor an ending is to bow to it, to say the work was real and the work is done, and to walk back toward the house with your arms full and your hands, at last, gently empty.",
    shadow: "In shadow, this card names the refusal to let a good thing end well — the reopening of closed chapters, the mistaking of loyalty for an inability to say the work is finally complete.",
    affirm: "I let what is finished be finished, and I carry its harvest, not its empty field." },
  { id: "daring-yes", name: "The Daring Yes", essence: "Daring · Courage · The Unknown", hex: "#5a6cc0", message: "The yes is yours to give, beloved — no one is coming to make this choice safe enough first. Say the daring yes while your voice still shakes; courage was never the calm before the leap — it is the leap, chosen out loud, on your own authority.",
    book: "The Daring Yes arrives at the lip of a decision you have already outgrown your excuses for — the move, the confession, the beginning you keep pricing out in worst cases. Its teaching: courage is not a feeling that visits before the leap; it is a choice you make while still shaking, and the choosing is the whole of it. We imagine the brave act only once doubt has cleared, but doubt is not a gate that finally opens — it is weather, and the bold have always stepped out into it anyway. No one alive holds the authority to grant the permission you keep waiting for; the yes was always yours to sign. So lay down the case you keep building against yourself and answer the life that keeps calling your name — not because it is safe, but because it is yours, and you are done waiting to be sure.",
    shadow: "In shadow, this card warns against the leap made to flee rather than to reach — impulse costumed as courage — and against forever awaiting a certainty that was never once on the menu.",
    affirm: "I choose the daring yes while my voice still shakes, on no authority but my own." },
  { id: "tended-garden", name: "The Tended Garden", essence: "Self-Nourishment · Replenishment · Tending", hex: "#8fc890", message: "You cannot pour from a well you never return to fill, and lately you have been giving from the very bottom of yours. Tend your own garden today — not as selfishness but as stewardship — for the fruit others enjoy from you grows only on a root you keep faithfully watered.",
    book: "The Tended Garden appears when you have become so practiced at feeding others that your own soil has gone dry without your quite noticing. Its teaching: replenishment is not indulgence but the quiet infrastructure of everything you give. We are told that tending ourselves is a subtraction from those we love, that rest claimed for our own roots is somehow taken from another's mouth — but a gardener who lets the well run empty soon has nothing green left to offer anyone. What you restore in yourself does not vanish; it becomes the very abundance others come to you seeking. To kneel and water your own ground is not to turn away from the world but to make certain there is still a harvest waiting in you for it. Fill the well. Then draw.",
    shadow: "In shadow, this card names the martyrdom that lets the well run dry and calls the drought love, and the self-tending that curdles into hiding from every legitimate need but your own.",
    affirm: "I fill the well before I draw from it, so the giving and the giver are both kept whole." },
  { id: "open-cage", name: "The Open Cage", essence: "Freedom · Liberation · Unbinding", hex: "#6fb0e0", message: "The weight you have carried so long you mistook it for your own bones was never yours to hold, beloved. Set it down. The door of the cage has stood open all along — the only thing keeping you perched was the old habit of believing it was locked.",
    book: "The Open Cage arrives when a burden you assumed was permanent turns out to be something you are still, quietly, choosing to hold — a role assigned to you, a guilt handed down, an expectation you never agreed to but never once questioned. Its teaching: much of what cages us was never locked; it was inherited, absorbed, and slowly mistaken for identity. We imagine freedom as something to be earned or fought for, a far liberation waiting past some final permission — but often it is simply the laying down of what was never ours to carry in the first place. The bird is not freed by breaking the bars; it is freed the instant it notices the door and remembers it has wings. You are not obligated to keep suffering a thing merely because you have already suffered it for a long time.",
    shadow: "In shadow, this card warns against confusing genuine liberation with mere flight from what is rightfully yours to answer for, and against staying perched in a cage grown comfortable simply because its open door frames the only sky you have ever known.",
    affirm: "I lay down what was never mine to carry and step through the door that was always open." },
  { id: "uncaged-word", name: "The Uncaged Word", essence: "Expression · Voice · Truth Spoken", hex: "#56c2c0", message: "There is something in you that has gone unsaid for too long, and the silence has started to cost you. Let it be spoken today, beloved — not to wound, but because a truth kept caged goes sour, and your voice was made to be heard.",
    book: "The Uncaged Word arrives when a truth has been sitting in your throat — the honest no, the overdue confession, the need finally worth naming aloud — and you keep swallowing it to keep some fragile peace. Its teaching is that expression is not the same as aggression; you can be both truthful and kind, but you cannot be silent and whole. Every word you refuse to say does not disappear — it settles into the body as tightness, into the relationship as distance, into the self as a slow erasure. The misunderstanding is that keeping the peace means keeping quiet. But real peace is not the absence of sound; it is the presence of honesty. A voice that is never raised is not peaceful. It is only unused.",
    shadow: "In shadow, this card mistakes cruelty for candor — using 'just being honest' as a weapon, or waiting for a perfectly safe moment that will never quite arrive.",
    affirm: "I let my truth be spoken, kindly and clearly, because silence was never safety." },
  { id: "widening-circle", name: "The Widening Circle", essence: "Generosity · Overflow · Giving", hex: "#dcb45e", message: "There is more in you than you have let yourself spend, beloved — and the sweetest thing fullness knows how to do is move toward someone else. Give today not to prove a thing, but for the sheer gladness of it, and watch the circle you feed widen back around you.",
    book: "The Widening Circle appears when you have forgotten that generosity is a pleasure, not a price. Its teaching is that real giving is overflow, not sacrifice — the fountain loses nothing by pouring; pouring is simply what a full thing does. When you give from what genuinely brims in you, the act is not subtraction but circulation: the grain a sower scatters does not leave the world, it plants it. And there is a gladness here you may not have let yourself expect — the particular joy of watching your abundance become someone else's morning. Notice today how what you send outward seems to widen the very circle it returns through. You are not a vessel being emptied; you are a season doing what all seasons of plenty are for.",
    shadow: "In shadow, this card names the counterfeit of overflow — the gift given to be seen, or scored, or quietly repaid, which is not generosity spilling over but a transaction wearing its clothes.",
    affirm: "I give from what already overflows in me, and the giving itself is the joy." },
  { id: "wild-gladness", name: "The Wild Gladness", essence: "Joy · Delight · Permission", hex: "#f2a65a", message: "Some joy is knocking today that you did not schedule and do not have to justify — let it in without checking whether you have suffered enough to deserve it. You are allowed to feel good, beloved, and you do not have to brace for the bill.",
    book: "The Wild Gladness arrives when you have been treating gladness as something dangerous — a debt that will be collected, a lull before the next blow, a feeling you must earn through enough hardship first. Its teaching: joy is not a reward for the deserving; it is nourishment for the living, and bracing against it does not soften future loss, it only steals the sweetness available now. The common mistake is believing that guarding your happiness keeps you safe, when in truth the shoe you keep waiting to drop has already cost you a hundred good mornings. Delight is not naïve. It is a form of courage — the willingness to be fully in a moment that could later be taken, and to let it be beautiful anyway. Let the gladness run wild in you the way flowers overtake a field no one tended — it was never asking your permission to bloom.",
    shadow: "In shadow, this card becomes the manic flight from grief, a performance of positivity used to skip past real sorrow — for delight that refuses to feel anything heavy is not joy but avoidance in a bright costume.",
    affirm: "I am allowed to feel good without first proving I have suffered enough to deserve it." },
  { id: "beginners-heart", name: "The Beginner's Heart", essence: "Humility · Teachability · Wonder", hex: "#e2b673", message: "The wisest people you know still come as beginners — they have learned that a heart willing to be taught is welcomed into rooms a know-it-all is turned away from. Meet this day as a student, beloved, and everything, and everyone, becomes your teacher.",
    book: "The Beginner's Heart arrives when you have started to confuse knowing about a thing with being open to it — when the very competence you worked so hard for has quietly begun to close the door that wonder used to keep open. Its teaching is that a beginner's heart is not ignorance; it is the humble, unguarded willingness to be surprised, to ask the simple question, to be shown. The expert defends what they already hold; the student, with hands still empty, can always be filled. This is why the wisest people you meet seem the least finished — they have kept the door of learning propped open long after pride told them to close it. Come to this day willing not to have arrived: let the child, the stranger, the small ordinary moment teach you something, and watch how much larger your life becomes than your certainty about it.",
    shadow: "In shadow, this card warns against the false humility that plays the eternal beginner to dodge the responsibility of what you already know, and against a curiosity so restless it never stays long enough to truly learn anything.",
    affirm: "I come to this day as a student, and let everything I meet become my teacher." },
];

/* When certain cards rise together, they speak a third meaning between them —
   shown in multi-card spreads for Illuminate members, like the pairings
   chapter at the back of a printed oracle guidebook. */
const ORACLE_COMBOS = [
  { pair: ["golden-dawn", "rising-phoenix"], name: "The Second Sunrise", meaning: "This is not starting over — it is starting from. The ashes are not your shame; they are your soil. Whatever begins now is built on everything the fire taught you, and it will not burn the same way twice." },
  { pair: ["moonlit-path", "quiet-voice"], name: "The Confirmed Knowing", meaning: "When the path and the voice arrive together, the message is doubled: you already know, and you are already being shown. Stop asking for a third confirmation — the moon and your own soul agree." },
  { pair: ["sacred-pause", "inner-flame"], name: "The Banked Fire", meaning: "A fire banked overnight is not a fire abandoned — it is a fire protected so it can burn for years. Rest now is not the enemy of your creation; it is its insurance. Pause as an act of ambition." },
  { pair: ["open-heart", "healing-waters"], name: "The Mended Vessel", meaning: "The heart can only receive to the depth it has healed. Together these cards say the mending and the opening are one motion — every old wound you tend becomes new room for love to live in." },
  { pair: ["guardians-wing", "moonlit-path"], name: "Escorted Through the Dark", meaning: "You are being asked to walk a road you cannot see — and promised an escort for every step of it. Walk unlit roads if you must; you do not walk them unaccompanied." },
  { pair: ["rivers-surrender", "infinite-thread"], name: "The Woven Current", meaning: "What you release does not fall — it is caught. Together these cards promise that surrender is not a plunge into chaos but a hand-off into pattern; the current you finally trust is the thread itself." },
  { pair: ["star-seed", "golden-dawn"], name: "The Remembered Assignment", meaning: "The purpose you have carried like a rumor is stepping into daylight. This pairing marks the moment a calling stops being a feeling and becomes a beginning — small, real, and already underway." },
  { pair: ["inner-flame", "star-seed"], name: "The Torch of Purpose", meaning: "Your creative fire and your soul's assignment are the same flame seen from two sides. What you keep wanting to make is what you are here to make — stop auditioning other explanations." },
  { pair: ["healing-waters", "rising-phoenix"], name: "Ashes Washed Clean", meaning: "After the burning, the bathing. This pairing closes an era with both fire and water: what ended is released from blame, and what rises carries no debt to the past it survived." },
  { pair: ["open-heart", "guardians-wing"], name: "Safe Enough to Soften", meaning: "The armour came off the day someone proved the room was safe. These cards together are that proof: protection is present precisely so that openness can be possible. You can be soft here." },
  { pair: ["quiet-voice", "rivers-surrender"], name: "The Answer Is Release", meaning: "You asked the question and the quiet voice answered: let go. Not because you were wrong to want it, but because your hands are needed for what is actually coming." },
  { pair: ["sacred-pause", "moonlit-path"], name: "Waiting for Moonrise", meaning: "Not every darkness is for walking; some are for waiting until the light returns. This pairing blesses the delay — the road ahead is real, and it will still be there when the moon lifts." },
  { pair: ["full-cup", "endless-field"], name: "The Overflowing Store", meaning: "Gratitude and abundance are the same truth seen twice — one counts what is already here, the other trusts there will be more. Together they close the fist you have been clenching: you are held now, and you will be held again." },
  { pair: ["walled-garden", "tended-garden"], name: "The Kept Ground", meaning: "A boundary and an act of self-care are one motion: you cannot pour from a garden you refuse to protect. These cards together bless the wall AND the watering can — guard the ground, then tend it." },
  { pair: ["ripening-bough", "long-road"], name: "The Faithful Wait", meaning: "Patience and perseverance meet where the road is long and the fruit is slow. Neither asks you to hurry; both ask you to stay. Keep walking, keep waiting — arrival is being made while you are not looking." },
  { pair: ["tender-dark", "cleansing-rain"], name: "Grief Into Rain", meaning: "First the sorrow is honored, then it is released — mourning that is allowed to move becomes the rain that finally washes you clean. What you grieve fully, you do not have to carry forever." },
  { pair: ["true-face", "uncaged-word"], name: "The Spoken Self", meaning: "To take off the mask and to finally say the thing are one courage. When authenticity and expression rise together, the truth you have been living privately is ready to be said aloud." },
  { pair: ["ringing-bell", "sacred-pause"], name: "The Held Moment", meaning: "Presence and rest ring the same note: both call you out of the striving future and into the only moment that was ever real. Stop here. This instant is enough, and it is asking nothing of you." },
  { pair: ["guest-at-the-door", "healing-waters"], name: "The Welcomed Wound", meaning: "The part of you that you exiled and the wound you keep reopening are often the same orphan. Together these cards say: stop guarding the door against yourself — mercy is how the exile finally comes home." },
  { pair: ["elder-tree", "star-seed"], name: "The Remembered Wisdom", meaning: "The wisdom you are becoming and the purpose you are remembering were planted in the same soil. What the elder in you already knows is exactly what the seed was sent here to do." },
  { pair: ["company-of-one", "quiet-voice"], name: "The Clear Solitude", meaning: "Chosen aloneness and inner knowing keep good company. In the quiet you did not flee, the voice that never shouts can finally be heard — solitude is not the absence of counsel but the room where your own returns." },
  { pair: ["daring-yes", "rising-phoenix"], name: "The Leap and the Rising", meaning: "The courage to jump and the grace to rise are one arc. This pairing marks a threshold crossed on purpose: you did not fall, you leapt — and what meets you on the other side is not the ground but your own wings." },
  { pair: ["wild-gladness", "inner-flame"], name: "The Kindled Joy", meaning: "Delight and vitality feed the same fire. Joy is not a distraction from your creative life — it is its fuel. Let yourself be glad, and watch the flame you have been rationing leap up unbidden." },
  { pair: ["widening-circle", "infinite-thread"], name: "The Given Thread", meaning: "What you give from fullness travels along the same web that connects all things — no kindness is lost, every gift returns by a longer road. Generosity and connection together promise: you are woven in, and you are weaving." },
  { pair: ["last-sheaf", "rivers-surrender"], name: "The Finished Harvest", meaning: "To complete a thing and to let it go are the same bow. When the last sheaf is bound, stop gleaning the empty field — release the finished chapter to the current and let it carry the harvest onward." },
  { pair: ["doorway-between", "golden-dawn"], name: "The Threshold of Dawn", meaning: "The in-between and the beginning meet at first light. Standing in the doorway is not being lost — it is being early. What you are waiting on the sill of is already breaking gold on the far hills." },
];

const FAIRY_CARDS = [
  { id: "the-firefly-lantern", name: "The Firefly Lantern", essence: "Wonder · Light · Guidance", hex: "#f6c453", message: "You do not need to see the whole path tonight, beloved — you only need the next small glow of light to step toward. Follow the firefly, not the floodlight: one soft flicker of knowing is enough to carry you safely through the dark.",
    book: "The Firefly Lantern drifts into your night when you are waiting for certainty before you dare to move — and its teaching is that guidance rarely arrives as a floodlight; it comes as a single trembling spark that shows you only the next few steps of grass. The common mistake is to distrust a light this small, to think that anything true would be brighter, louder, more sure. But fireflies were never meant to light the whole meadow at once — they were meant to be followed. Trust the quiet glow of your own inner knowing, even when it illuminates almost nothing but the ground beneath your feet. Step toward it, and it will lead you on. Wonder is not the absence of darkness; it is the courage to be enchanted by one small light.",
    shadow: "In shadow, this card warns against waiting for a brighter, surer sign before you will move at all — and against mistaking your own small, faithful light for something too dim to be worth following.",
    affirm: "One small light is enough — I will follow the next glow I can see." },
  { id: "the-first-green-shoot", name: "The First Green Shoot", essence: "Hope · Beginning · Faith", hex: "#7cc47f", message: "Something tender is already pushing up through the cold ground of you, beloved, long before you thought spring could come. Do not dig it up to check that it is real — the longest winter has ended, and this small green shoot is proof that life never stopped believing in you.",
    book: "The First Green Shoot appears when the season has been so hard and so long that you have half-forgotten what it feels like to grow — and it comes to tell you that renewal has already, quietly begun. Its deeper teaching is that life does not wait for the frost to fully lift before it begins again; the shoot rises while the mornings are still cold, trusting a warmth it cannot yet feel. The common misunderstanding is to believe nothing is happening simply because nothing yet shows above the soil. But roots work in the dark long before the leaf, and faith is exactly this: tending what you cannot see. Whatever is beginning in you is fragile and unmistakably alive. Guard it gently, and let it come at the patient pace of spring.",
    shadow: "In shadow, this card warns against uprooting a fragile new beginning to test whether it is real, or dismissing green growth as too small and too late to trust.",
    affirm: "Something new is already rising in me, even before I can feel the spring." },
  { id: "the-mushroom-ring", name: "The Mushroom Ring", essence: "Play · Joy · Freedom", hex: "#e0629a", message: "You have been so busy earning your rest and justifying your joy, beloved — but the fairies never asked why before they began to dance. Step into the ring today and move for no reason at all; delight is not something you must first deserve.",
    book: "The Mushroom Ring springs up in the grass when you have grown too serious, too careful, too convinced that every good thing must first be earned. In fairy lore the ring is where the little folk dance the whole night through — not to accomplish anything, but for the sheer wild joy of it. Its deeper teaching is that play is not the reward at the end of the work; it is a doorway that heals you in the middle of it. The common mistake is to wait until everything is finished and deserved before you allow yourself to be glad. But joy asks for no permission slip. Step into the ring, kick off your shoes, and let yourself be foolish and free. The dance itself is the point, and it always was.",
    shadow: "In shadow, this card warns against postponing all joy until the work is finally done, or believing that play must be earned before it is ever allowed.",
    affirm: "I am allowed to dance for no reason — my joy needs no justification." },
  { id: "the-butterflys-first-flight", name: "The Butterfly's First Flight", essence: "Courage · Trust · Leap", hex: "#ff8a5b", message: "No butterfly has ever felt certain before its first flight, beloved, and neither will you — the wings are already yours whether or not you believe them. Stop waiting for the fear to leave and open them anyway; the air has been holding a place for you all along.",
    book: "The Butterfly's First Flight arrives at the exact threshold where you have finished becoming but have not yet dared to fly. Its teaching is that readiness is a feeling that arrives after the leap, not before it — the butterfly does not wait to feel confident about wings it has never used; it simply trusts the transformation already worked in the dark of the chrysalis. The common misunderstanding is to mistake the trembling for a warning, to read fear as proof that you are not yet ready. But every creature that ever flew felt that same flutter at the edge. You have done the quiet, hidden work of changing. Now the only thing left is the letting go. Open your wings, beloved, and discover mid-air what you could never have known standing still.",
    shadow: "In shadow, this card warns against reading your fear as evidence that you are not ready, and against clinging to the safe cocoon long after you have outgrown it.",
    affirm: "I am ready before I feel ready — I open my wings and trust the air." },
  { id: "the-hidden-fairy-door", name: "The Hidden Fairy Door", essence: "Intuition · Mystery · Invitation", hex: "#8e6fc0", message: "There is a small door in the roots of the old tree that only the quiet-hearted ever notice, beloved — and today you are being invited through. Trust the soft tug of your own knowing over the loud opinions around you; the way in has always been felt, never argued.",
    book: "The Hidden Fairy Door appears at the base of the tree when a new way forward is opening that logic alone would walk right past. Its deeper teaching is that intuition does not shout; it beckons — a faint glow between the roots, a quiet certainty with no evidence attached, a knowing that arrives before the reasons do. The common misunderstanding is to wait for proof before you trust the pull, to demand that the door be obvious to everyone before you dare to knock. But fairy doors reveal themselves only to those willing to believe in them first. The invitation you are sensing is real. Stop asking the crowd for directions and turn instead toward that soft inner tug. Knock gently, beloved. What is meant for you will open.",
    shadow: "In shadow, this card warns against silencing your own quiet knowing to please louder voices, or demanding proof before you will trust an invitation only you can feel.",
    affirm: "I trust the quiet knowing within me — it is showing me the way in." },
  { id: "the-sleeping-bud", name: "The Sleeping Bud", essence: "Rest · Patience · Renewal", hex: "#9fb8d8", message: "The bud is not failing to flower, beloved — it is gathering the whole of its colour in the quiet dark before it opens. Let yourself close for a while without guilt; your rest is not you falling behind, it is you preparing to bloom.",
    book: "The Sleeping Bud folds its petals into your hand when you have been mistaking exhaustion for a moral failing, pushing to open before your season. Its teaching is that a bud is not lazy for staying closed — it is doing the slow, invisible work of gathering everything it will one day pour into flower. The common misunderstanding is to believe that worth is measured only in bloom, that any pause is time wasted and any rest is falling behind. But no flower blooms without first being a bud, and none blooms all year long. The quiet you are craving is not weakness; it is wisdom. Curl inward, beloved. Let the world turn without you for a while. What looks like sleep is renewal, and the colour you are storing now will one day astonish you.",
    shadow: "In shadow, this card warns against forcing yourself to bloom before your season, and against mistaking necessary rest for laziness or falling behind.",
    affirm: "My rest is not laziness — it is how I gather my bloom." },
  { id: "the-dragonfly-messenger", name: "The Dragonfly Messenger", essence: "Message · Signs · Listening", hex: "#3fb8c4", message: "The answer you have been asking for is already flying toward you, beloved — so soften your grip and stop chasing it across the garden. Grow quiet the way the pond grows still at dusk, and you will feel the message arrive on iridescent wings.",
    book: "The Dragonfly Messenger darts in when you have sent a question out into the world and grown weary waiting for its return. Its deeper teaching is that guidance rarely arrives as a shout; it comes as a flicker at the edge of sight — a stranger's kind word, a song, a feeling you cannot quite explain. The common misunderstanding is to think a sign must be enormous to be true, so you overlook the small ones and call the sky silent. But dragonflies do not knock; they hover. Turn toward the truth by tending your attention like a garden pond: still your worrying, widen your eyes, and let the surface go smooth enough to hold a reflection. What you are waiting for has been circling you all along, waiting only for you to look up.",
    shadow: "In shadow, this card warns of a mind so loud with anxious guessing that it drowns out the very answer it begs for — or of demanding proof so certain that no gentle sign will ever be allowed to count.",
    affirm: "I grow quiet and trust that the answer is already winging its way to me." },
  { id: "the-dandelion-wish", name: "The Dandelion Wish", essence: "Release · Trust · Surrender", hex: "#cfd8a8", message: "Open your hands, beloved — what is ready to leave will only bruise if you clutch it. Breathe your hope onto the dandelion and let the wind take each seed; some part of you is meant to travel now, and it cannot fly while you are holding on.",
    book: "The Dandelion Wish appears at the moment holding on begins to cost more than letting go. Its deeper teaching is that release is not loss but sending — the dandelion does not mourn its seeds, it trusts the wind to plant them somewhere it will never see. The common misunderstanding is to believe surrender means giving up, as if opening your hands were the same as being left empty-handed. But the seed head was always going to scatter; your only choice is whether you scatter it with a wish or a clenched fist. Turn toward the truth by naming what you are ready to release, breathing your hope into it, and opening your fingers. What is meant to go will carry your dreams farther than your grip ever could.",
    shadow: "In shadow, this card names the counterfeit surrender that is really exhaustion — flinging things away just to be rid of them — and its opposite, the white-knuckled grip that keeps a seed from ever becoming a flower.",
    affirm: "I open my hands and trust the wind to carry what is meant to go." },
  { id: "the-tangled-bramble", name: "The Tangled Bramble", essence: "Boundaries · Protection · Strength", hex: "#7a5c8e", message: "Not every gate in your garden is meant to stand open, beloved. The bramble is not unkind when it says no — it is guarding the tender roses behind it, and your soft heart deserves that same fierce, thorned protection today.",
    book: "The Tangled Bramble grows across your path when your kindness has become a door that will not close. Its deeper teaching is that a boundary is not a wall against love but a fence around it — the bramble bristles precisely because there is something precious it refuses to let be trampled. The common misunderstanding is to hear your own no as cruelty, and so you swing every gate open and call it generosity while the roses inside are stripped bare. But thorns are not the opposite of tenderness; they are how tenderness survives. Turn toward the truth by remembering what you are protecting: your peace, your time, your gentlest self. Saying no to what harms you is the same breath as saying yes to what you love.",
    shadow: "In shadow, this card warns of thorns grown so dense they wall out even the ones who mean you well — protection curdled into isolation — or of a garden with no bramble at all, left open to every trampling foot.",
    affirm: "My no is a sacred fence around everything my heart holds dear." },
  { id: "the-open-meadow", name: "The Open Meadow", essence: "Freedom · Space · Possibility", hex: "#8fd3a6", message: "The trees have thinned, beloved, and you are standing at the edge of an open meadow where no single path is drawn for you. This is not lostness — it is freedom; every direction is yours to choose, and the grass will make a path wherever your feet decide to go.",
    book: "The Open Meadow opens before you when the narrow, forested part of the journey ends and suddenly there are no walls telling you where to walk. Its deeper teaching is that space is a gift, not a threat — the absence of a marked trail means you have earned the right to make one. The common misunderstanding is to feel the openness as anxiety and to rush back into the trees, mistaking any set of walls for safety. But a meadow does not ask you to hurry; it simply waits, wide and sunlit, holding room for whatever you choose. Turn toward the truth by slowing down long enough to feel how much room you actually have. You are not stranded here — you are free, and freedom only feels frightening until you remember it is yours.",
    shadow: "In shadow, this card warns that too much freedom can freeze you at the meadow's edge, endlessly weighing paths and walking none — or tempt you to flee back into old fences simply because a wall, however cramped, feels like a decision.",
    affirm: "I stand in the open and trust that any path I choose is mine to make." },
  { id: "the-dewdrop-mirror", name: "The Dewdrop Mirror", essence: "Reflection · Truth · Self-Knowing", hex: "#6fb0d4", message: "Kneel at the dewdrop, beloved, and dare to look at your own reflection without flinching. You have been so afraid of what an honest glance might show — but the fairies who tend this garden already know the truth: you are far kinder and braver than your fears have let you believe.",
    book: "The Dewdrop Mirror appears when you have been avoiding your own eyes, bracing for a reckoning that is far harsher in your imagination than it is in truth. Its deeper teaching is that honest self-reflection is not a trial but a homecoming — the small round mirror of a dewdrop shows the whole sky, and it shows you whole too, flaws and light together. The common misunderstanding is to think looking closely will only confirm the worst, so you look away, and the not-looking becomes its own quiet cruelty. But the dew does not exaggerate. Turn toward the truth by finally meeting your reflection with curiosity instead of judgment. You will not find the monster you feared — you will find someone tired, tender, and trying, someone genuinely worth loving, looking back.",
    shadow: "In shadow, this card warns of the distorted mirror of harsh self-judgment, which magnifies every fault and hides every grace — or of refusing to look at all, so that fear, not truth, gets to tell you who you are.",
    affirm: "I look at myself honestly and meet what I find with kindness." },
  { id: "the-rose-that-opens", name: "The Rose That Opens", essence: "Love · Tenderness · Courage", hex: "#e86b7f", message: "You have kept this bud closed to keep it safe, beloved — but a rose was never made to stay a fist. Let one petal loosen, then another; the softness you fear is not weakness at all, it is the very courage love requires to bloom.",
    book: "The Rose That Opens arrives when you have been guarding your heart so long that closed has started to feel like safe. Its deeper teaching is that opening is the bravest thing a tender thing can do — a rose risks its softest center to the whole world simply by unfurling, and that risk is not foolishness but the entire point of being a rose. The common misunderstanding is to believe a guarded heart is a protected one, when in truth a bud held shut too long does not stay safe; it simply never blooms. Turn toward the truth by letting one petal soften today — one honest word, one lowered guard, one act of tenderness offered anyway. Love will ask for your softness, yes. It is worth every petal you are brave enough to open.",
    shadow: "In shadow, this card names the armored heart that mistakes numbness for safety and calls its closing wise — and warns, too, of opening so recklessly to the wrong hands that tenderness is torn rather than received.",
    affirm: "I let my heart open, trusting that my softness is a kind of courage." },
  { id: "the-snails-slow-path", name: "The Snail's Slow Path", essence: "Patience · Trust · Timing", hex: "#b6a06a", message: "You are not behind, beloved — you are exactly as far along as a life lived at your own true pace can be. Watch the snail cross the whole garden by nightfall, leaving a silver trail behind it: slow is still moving, and every small inch counts.",
    book: "The Snail's Slow Path appears when you are measuring your progress against a clock that was never yours, and finding yourself wanting. Its deeper teaching is that pace is not the same as direction: you can move slowly and still be moving unfailingly toward the thing you love. The common mistake is to read slowness as failure and to abandon a good path just because it is taking longer than you hoped. But the snail does not doubt the garden; it simply keeps carrying its home and crossing the next leaf, and by evening it has travelled further than any anxious sprint could manage. Turn toward the truth that trust is patience with its eyes open. Keep going at the pace that is honestly yours, and the distance will quietly close.",
    shadow: "In shadow, this card warns against mistaking stillness for defeat, and against the restless impatience that rips up a seed to check whether it is growing.",
    affirm: "I am still moving forward, even when my progress is too quiet to see." },
  { id: "the-crown-of-petals", name: "The Crown of Petals", essence: "Worth · Dignity · Belonging", hex: "#d98cc4", message: "You keep trying to deserve a place that was already yours from your very first breath, beloved — set that exhausting labour down. The flowers do not audition for their petals; they simply open, and by opening they are crowned. So are you, and so you always were.",
    book: "The Crown of Petals arrives when you have been working to prove you are worthy of love, of rest, of the very room you take up — as though belonging were a wage to be earned. Its deeper teaching is that worth is not a prize handed to the accomplished; it is the ground you were born standing on. The common misunderstanding is to believe you must achieve, please, or perfect your way into deserving, and so to feel like an impostor whenever you fall short. But the fairies weave no finer crown for the busiest bloom — every flower in the garden wears one simply for being alive. Turn toward the truth that you were dignified before you did a single thing. Wear your crown of petals now, unearned and undeniable.",
    shadow: "In shadow, this card warns against the counterfeit worth that must be constantly re-earned through achievement or applause, leaving you forever one stumble away from feeling worthless.",
    affirm: "My worth was never a wage — it has always simply been mine." },
  { id: "the-melting-frost", name: "The Melting Frost", essence: "Forgiveness · Thaw · Release", hex: "#a8c9d8", message: "The frost you have kept around your heart was meant to protect you, beloved, but it has only left you cold. Let the morning sun touch it now and let the hardness melt — not because they earned your softness, but because you were never meant to live your whole life in winter.",
    book: "The Melting Frost appears when an old hurt has hardened into ice you have carried so long you have forgotten its weight. Its deeper teaching is that forgiveness is not something you hand to the one who wounded you — it is something you free yourself from holding. The common mistake is to believe that staying frozen keeps you safe, or that softening would mean the wrong was somehow fine. But frost does not punish the sky; it only numbs the ground beneath it, and no garden can bloom in a heart kept hard. Turn toward the truth that the thaw is entirely for you. Let the warmth in slowly, one bright drop at a time, and feel the green begin to stir where you were sure nothing could ever grow again.",
    shadow: "In shadow, this card warns against mistaking a frozen heart for a protected one, and against the pride that would rather stay cold than risk the tenderness of the thaw.",
    affirm: "I let the hardness melt, and I am the one it sets free." },
  { id: "the-turning-leaf", name: "The Turning Leaf", essence: "Change · Acceptance · Grace", hex: "#e08a4c", message: "The leaf is not dying when it turns to gold, beloved — it is becoming the most beautiful version of its whole season. What is changing in you is not being taken away; it is simply ripening into its next colour. Let it turn, and let yourself be lovely in the turning.",
    book: "The Turning Leaf arrives when something in your life is shifting and you have been grieving it as a loss. Its deeper teaching is that transformation and loss are not the same thing: the leaf that blushes to red has not been robbed of its green — it has grown into a deeper hue it could never have worn in spring. The common misunderstanding is to cling to what was and to read every ending as something breaking, rather than something becoming. But the fairies love the autumn garden most of all, for there it wears every colour it has ever earned. Turn toward the grace of accepting what is moving. You are not losing yourself; you are turning, as all living things must, toward the next radiant colour of who you are.",
    shadow: "In shadow, this card warns against clutching so tightly to what was that you miss the beauty of what is becoming, and against reading every change as something stolen from you.",
    affirm: "I let myself turn, trusting that change is only my next colour." },
  { id: "the-berry-harvest", name: "The Berry Harvest", essence: "Gratitude · Plenty · Thanks", hex: "#c0506a", message: "Look how full your basket already is, beloved, though you have been aching over the branches still bare. The hedgerow is heavy with ripe berries within your reach right now — turn your eyes from what is missing and count the sweetness already resting in your hands.",
    book: "The Berry Harvest appears when your gaze has drifted to what you lack, and the abundance already surrounding you has faded quietly into the background, unnoticed. Its deeper teaching is that gratitude is not a reward for having enough — it is the very thing that lets you finally see how much you have. The common mistake is to postpone thankfulness until some future fullness arrives, while the ripe fruit of this ordinary day goes unpicked and spoils on the vine. But the fairies feast in every season, blessing each berry before they eat it. Turn toward the truth that plenty is a practice of attention. Gather what is good in your life today — the small warmth, the given love, the daily bread — and watch your basket reveal how full it was all along.",
    shadow: "In shadow, this card warns against the hunger that can never be fed because it only stares at the empty branches, and against treating gratitude as something owed only once the wanting finally stops.",
    affirm: "My basket is fuller than my worry lets me see, and for it I give thanks." },
  { id: "the-stepping-stones", name: "The Stepping Stones", essence: "Trust · Faith · Forward", hex: "#5fa8b0", message: "You have been standing at the water's edge, waiting to see the whole path across before you dare to move, beloved — but the crossing was never meant to be seen all at once. Trust the single stone lit before you now: step onto it, and the next one will show itself.",
    book: "The Stepping Stones appear when fear has frozen you at the bank because you cannot yet see the far shore. Its deeper teaching is that faith was never asked to see the whole journey — only to trust the one stone within reach. The common misunderstanding is to believe you must have the entire way mapped before you dare to begin, and so you wait, and wait, while the crossing goes forever untaken. But the fairies never light the whole stream at once; they lift a glow over a single stone, and then, once your foot is upon it, over the next. Turn toward the truth that clarity comes with motion, not before it. Take the step you can see today, and trust the path to keep unfolding beneath your feet, one lit stone at a time.",
    shadow: "In shadow, this card warns against the paralysis that demands the whole map before the first step, and against mistaking a refusal to move for the wisdom of waiting.",
    affirm: "I trust the one stone before me, and the next will appear when I need it." },
  { id: "the-moonflower", name: "The Moonflower", essence: "Healing · Restoration · Peace", hex: "#b7a8e0", message: "The moonflower opens only after dark, and something in you is healing that same unhurried way — not on display, but in the quiet. Do not measure your mending against the clock, beloved; rest tonight and let the soft repair happen while you sleep.",
    book: "The Moonflower arrives when you are tired of waiting to feel whole again, when healing seems too slow to be real. Its deeper teaching is that restoration is not idleness but the quietest kind of work — the moonflower does its blooming in the dark, unseen, and is no less in blossom for the fact that no one applauds. The common misunderstanding is to believe that because you cannot feel yourself getting better, you are not. But mending, like the moon, moves in phases you cannot rush; the garden repairs itself at night while you sleep. Turn toward the truth that peace is already gathering in you, petal by folded petal, and that you may wake one soft morning to find you have opened without ever noticing the moment it began.",
    shadow: "In shadow, this card warns against forcing your own recovery — poking the wound to check whether it has closed — and against the guilt that whispers you should already be well by now.",
    affirm: "I am healing at the pace of moonlight, and that is fast enough." },
  { id: "the-willows-tears", name: "The Willow's Tears", essence: "Grief · Comfort · Tenderness", hex: "#6b8ea3", message: "The willow bows low over the water and lets its leaves weep, and it is the most graceful tree in the whole garden for it. You do not have to be strong today, beloved — let the tears come, for they are not weakness but the rain that softens hard ground.",
    book: "The Willow's Tears arrives in the season of loss — when something or someone has gone, and the ache of it will not be talked away. Its deeper teaching is that grief is love with nowhere left to land, and that weeping is not the opposite of healing but part of it. The common misunderstanding is that sorrow must be hidden or hurried, that a strong heart does not cry; but the willow is strong precisely because it bends and lets the water run through. Your tears are not spilling you empty — they are watering the soil where new life waits, still folded in the dark. Turn toward the truth that you are allowed to grieve as long as you need, and that tenderness toward your own sadness is where comfort quietly begins.",
    shadow: "In shadow, this card warns against damming your grief behind a brave face until it hardens into numbness, and against the false belief that to stop crying you must first stop feeling.",
    affirm: "My tears are sacred rain, and I let them fall without shame." },
  { id: "the-sunbeam-meadow", name: "The Sunbeam Meadow", essence: "Joy · Warmth · Delight", hex: "#ffd24a", message: "Step out into the sunbeam meadow, beloved, where the grasses are warm and the light asks nothing of you but to be enjoyed. Happiness need not be earned or grand today — let one ordinary ray of gold on your face be enough to make you glad.",
    book: "The Sunbeam Meadow arrives to remind you that joy is not a reward waiting at the end of your striving but a meadow you can walk into right now. Its deeper teaching is that delight lives in the smallest things — warm grass, a bee's drowsy hum, sunlight caught in a dandelion's seed — and that these were never too simple to count. The common misunderstanding is that happiness must be big to be real, that we should save our gladness for something worthy. But the fairies feast on a single dewdrop and dance for the plain fact of morning. Turn toward the truth that you are allowed to be happy for no reason at all — that letting the sun warm you is not frivolous but holy, and that delight, freely taken, only multiplies.",
    shadow: "In shadow, this card warns against postponing your joy until conditions are perfect, and against the quiet suspicion that you must suffer a little longer before you have earned the right to be glad.",
    affirm: "I let simple sunlight be reason enough for my happiness today." },
  { id: "the-climbing-vine", name: "The Climbing Vine", essence: "Growth · Effort · Reaching", hex: "#6cae5c", message: "The climbing vine does not fret that it has not yet reached the top of the trellis — it simply sends out one more green tendril toward the light. Keep reaching, beloved; the small effort you make today is not nothing, it is exactly how growing is done.",
    book: "The Climbing Vine arrives when the goal is still far above you and the reaching has begun to feel like effort. Its deeper teaching is that growth is not a leap but a series of small, faithful stretches — the vine climbs by curling one tendril at a time around whatever is nearest, and never once by seeing the whole trellis at once. The common misunderstanding is that progress should feel fast and certain, and that slow reaching means you are failing. But every tall thing in the garden was once a shoot straining toward a light it could not yet touch. Turn toward the truth that your striving is not proof of how far you have to go but proof that you are alive and rising — and that the light, like a patient gardener, is always leaning down to meet you.",
    shadow: "In shadow, this card warns against straining so hard for the top that you snap your own tender stem, and against mistaking rest for surrender — even the vine pauses to set down deeper roots.",
    affirm: "I reach a little higher today, and my small effort is enough." },
  { id: "the-toadstool-house", name: "The Cozy Toadstool House", essence: "Home · Belonging · Comfort", hex: "#d97b5c", message: "There is a little toadstool house waiting with its round door and its one warm window glowing gold, and it was built with you in mind. You deserve a place to belong, beloved — somewhere soft to come home to, where you are welcome exactly as you are.",
    book: "The Cozy Toadstool House arrives when you have grown weary of wandering, when some part of you longs for a place to simply be held. Its deeper teaching is that belonging is not a luxury you must earn but a need as real as bread — every creature in the garden has a burrow, a nest, a hollow of its own, and so should you. The common misunderstanding is that home is only a house, or that you must wait for someone else to build it for you. But the truest home is the one you tend within — a warm inner hearth where you are always welcome. Turn toward the truth that you are allowed to want comfort, to claim a corner of the world as safe, and to be, at last, at home in your own dear self.",
    shadow: "In shadow, this card warns against staying in places that do not honor you because you fear no other door will open, and against believing you must shrink yourself small to be let inside.",
    affirm: "I deserve a safe and warm place to belong, beginning within myself." },
  { id: "the-still-pond", name: "The Still Pond", essence: "Peace · Calm · Stillness", hex: "#7fb3ae", message: "The still pond mirrors the whole sky perfectly only when its surface stops trembling — and so it is with you, beloved. Grow quiet inside today; let the ripples of worry settle, and watch how much becomes clear once you simply stop stirring the water.",
    book: "The Still Pond arrives when your thoughts have been churning and the answer you seek keeps slipping beneath the froth. Its deeper teaching is that clarity is not something you chase but something that surfaces on its own once you grow calm — a muddied pond does not clear by being stirred harder, but by being left, at last, to settle. The common misunderstanding is that peace must be achieved through effort, that you must think your way into stillness. But the pond does nothing at all to reflect the moon; it simply stops moving. Turn toward the truth that quiet is not empty and stillness is not idle — that when you let the fretting drift down like silt to the floor, you will find the sky was inside you all along, whole and shining and clear.",
    shadow: "In shadow, this card warns against confusing stillness with numbness or avoidance, and against agitating a decision so endlessly that you cloud the very water you are trying to see through.",
    affirm: "I let my inner waters grow still, and clarity rises on its own." },
  { id: "the-honeycomb", name: "The Golden Honeycomb", essence: "Abundance · Sweetness · Reward", hex: "#f0a93a", message: "Something you have tended quietly, beloved, is beginning to ripen into sweetness — trust that the honey is forming even where you cannot see it. The bees of your patience have not been idle; let yourself taste the reward without guilt.",
    book: "The Golden Honeycomb arrives when a long, patient effort is finally thickening into reward — when the small, unglamorous days of showing up have quietly built a store of sweetness. Its deeper teaching is that abundance is made, not stumbled upon: every cell of the comb was filled one careful drop at a time, and nothing about that is an accident. The common misunderstanding is that reward should feel earned only through struggle, so we refuse the honey or rush past it, already anxious about the next empty cell. The turn toward truth is to stop, dip a finger in, and taste — to let yourself be nourished by what you built. Sweetness received is not laziness; it is the whole reason the bees ever flew.",
    shadow: "In shadow, this card warns against hoarding the honey out of a fear of scarcity, and against the counterfeit sweetness of rewards snatched before the work has truly ripened.",
    affirm: "I am allowed to taste the sweetness of what I have patiently built." },
  { id: "the-dawn-blossom", name: "The Dawn Blossom", essence: "Renewal · Fresh Start · Awakening", hex: "#f39fb0", message: "Beloved, the flower that closed against last night's cold is opening again in this morning's light — and so may you. Whatever yesterday held, today unfolds a clean petal; you are allowed to begin again as if for the very first time.",
    book: "The Dawn Blossom arrives when you have been carrying yesterday as though it were a sentence rather than a page already turned. Its deeper teaching is that renewal is not something you must earn back after failure — it is the ordinary miracle written into every living thing: the blossom does not apologize for having closed at dusk, it simply opens again at dawn. The common misunderstanding is that a fresh start requires you to first fix the old one, to settle every account before you are permitted to feel new. The turn toward truth is gentler: you may awaken now, mid-story, unfinished, and let this hour be genuinely fresh. Morning does not withhold itself from the imperfect garden. It comes for all of it, and it comes today.",
    shadow: "In shadow, this card warns against the counterfeit fresh start that only flees the past rather than releasing it, and against believing you must deserve the morning before you are allowed to rise into it.",
    affirm: "I open again to the light of this new day, exactly as I am." },
  { id: "the-painted-wings", name: "The Painted Wings", essence: "Creativity · Inspiration · Expression", hex: "#c94fb0", message: "The colors on your wings, beloved, were never meant to be hidden in the shadow of the leaves — they were painted to catch the light and be seen. Let something you imagine take shape today, however small; the garden grows brighter each time you dare to show your true hues.",
    book: "The Painted Wings arrive when an idea has been fluttering inside you, bright and restless, waiting for permission to be expressed. Its deeper teaching is that imagination is not a private indulgence but a gift given through you for others — the butterfly's beauty is not for the butterfly alone, but for every eye that lifts to follow it. The common misunderstanding is that your creation must be flawless, or original enough, or worthy of applause before it earns the air. The turn toward truth is to remember that expression is generosity, not performance: you make something and set it loose, and its wobbling flight is precisely what makes it real. Share the color you carry. A wing kept folded helps no one, and the garden was waiting for exactly your particular light.",
    shadow: "In shadow, this card warns against the perfectionism that keeps your wings folded until they are somehow 'ready,' and against making beauty only to be admired rather than to give.",
    affirm: "My imagination is a gift, and I let it take flight today." },
  { id: "the-acorn-shield", name: "The Acorn Shield", essence: "Protection · Safety · Courage", hex: "#8a6d4a", message: "Beloved, you are held inside a sturdier shell than fear would have you believe — the same small acorn that seems so fragile carries a whole oak within it. Walk gently into today knowing you are guarded; nothing that comes can crack the quiet strength already rooted in you.",
    book: "The Acorn Shield arrives when fear has grown loud and convinced you that you are exposed, breakable, alone against the weather. Its deeper teaching is that protection is not the absence of storms but the presence of something within you tougher than the storm — the acorn's cap does not stop the wind, yet the small seed rides it out and answers with a forest. The common misunderstanding is that safety means never being afraid, so we mistake the feeling of fear for proof of real danger. The turn toward truth is to let courage and fear share the path: you can tremble and still be guarded, doubt and still be strong. You were built with a shell for a reason. Trust it to hold, and take the step you have been afraid to take.",
    shadow: "In shadow, this card warns against mistaking the loud voice of fear for the truth of your circumstances, and against building walls so high in the name of safety that nothing living can reach you.",
    affirm: "I am safer and stronger than my fear, and I carry an oak inside me." },
  { id: "the-gathered-friends", name: "The Gathered Friends", essence: "Friendship · Connection · Support", hex: "#e498b8", message: "You were never meant to carry the whole basket alone, beloved — look up, and you will find hands already reaching to share the weight. Let someone in today; the fairies of true friendship gather not to watch you struggle, but to lift beside you.",
    book: "The Gathered Friends arrive when you have been quietly carrying too much, certain that needing help is a kind of failure you must hide. Its deeper teaching is that connection is not weakness but design — no single flower makes a meadow, and no fairy was ever meant to hold up the whole sky by herself. The common misunderstanding is that self-reliance means refusing every hand, that to ask is to become a burden. The turn toward truth is tender and freeing: letting others in is a gift you give them, too, for we are made glad by being needed. Set down a corner of what you carry and let a friend take it. The circle around you is not an audience. It is a pair of hands, and another, and another.",
    shadow: "In shadow, this card warns against the pride that calls isolation 'strength,' and against surrounding yourself with company while still refusing to let anyone truly help.",
    affirm: "I am not meant to carry everything alone, and I let my friends share the weight." },
  { id: "the-watering-can", name: "The Watering Can", essence: "Self-Care · Nurture · Kindness", hex: "#79c2b0", message: "Beloved, even the most generous watering can runs dry when it is never filled — so pause today and let yourself be tended, too. You are not a garden meant only to give; be kind enough to pour a little care back into your own thirsty roots.",
    book: "The Watering Can arrives when you have poured yourself out for everyone else until your own soil has cracked and gone dry. Its deeper teaching is simple and often forgotten: you cannot give from an empty vessel, and tending yourself is not the opposite of generosity but its very source — the well that waters the whole garden must first be filled. The common misunderstanding is that self-care is selfishness, that resting or refilling steals something from those who need you. The turn toward truth is to see that your kindness to others is only ever as deep as your kindness to yourself. Drink before you pour. A tended gardener grows a greener garden, and the people you love do not need you emptied. They need you well.",
    shadow: "In shadow, this card warns against the martyrdom that calls self-neglect 'devotion,' and against the counterfeit self-care that only numbs instead of truly nourishing you.",
    affirm: "I fill my own cup first, so that what I pour for others comes from overflow." },
  { id: "the-clearing-mist", name: "The Clearing Mist", essence: "Clarity · Understanding · Vision", hex: "#9cc0cc", message: "The fog that has been sitting over your garden is thinning, beloved, and the path you thought you had lost is quietly showing itself again. You do not have to understand everything at once — trust the first shapes that come clear, and take one honest step toward them.",
    book: "The Clearing Mist arrives after a season of not-knowing, when you have wandered through grey air unsure which way was home. Its deeper teaching is that clarity is not a bolt of lightning but a slow warming of the morning — the mist does not tear away, it lifts, thread by thread, until the meadow is simply there. The common misunderstanding is to demand the whole view at once and to call the half-seen path no answer at all. But fairies read the land by its first emerging shapes: a fence post, a bending willow, the glint of a stream. Trust what has already come clear rather than mourning what is still veiled. Follow the near landmarks, and the far ones will come to meet you as you walk.",
    shadow: "In shadow, this card warns against forcing a false certainty just to escape the discomfort of fog — grabbing any answer to end the not-knowing — and against distrusting a real clarity because it arrived softly instead of all at once.",
    affirm: "I trust the shapes that have already come clear, and I let the rest arrive as I walk." },
  { id: "the-hearth-lantern", name: "The Warm Hearth Lantern", essence: "Comfort · Warmth · Solace", hex: "#e59a4c", message: "When the wind outside turns sharp, beloved, you are not meant to stand in it and prove you can bear the cold. Come in close to what warms you — the small fire, the kind voice, the soft blanket of your own tenderness — and let yourself be held for a while.",
    book: "The Warm Hearth Lantern glows into view when you have been enduring too long out in the frost, mistaking hardness for strength. Its deeper teaching is that comfort is not weakness but repair — every creature of the garden knows to den down when the season bites, and none of them call it failure. The common misunderstanding is to believe you must earn your rest, or that softening means you have given up. But the lantern in the fairy window was never lit as a reward; it was lit as a welcome. There is a warmth already waiting for you — a person, a place, a practice, a prayer. Stop bracing against the night and turn toward the glow. Let it thaw you gently, and you will find you can go on.",
    shadow: "In shadow, this card warns against the counterfeit hearth of distraction or excess — a comfort that numbs the surface but leaves the heart cold — and against refusing all comfort out of pride.",
    affirm: "I let myself be warmed; receiving comfort is not weakness but the way I am mended." },
  { id: "the-starlit-path", name: "The Starlit Path", essence: "Dreams · Guidance · Wonder", hex: "#5a5fa8", message: "Your dreams are not a distraction from the path, beloved — tonight they are the path, laid out in points of light across the dark. Trust the quiet pull toward the thing you love, and take the next small step by starlight, even before the whole road is bright.",
    book: "The Starlit Path appears when the practical daylight road has gone quiet and a deeper wanting begins to shine. Its deeper teaching is that dreams are not idle wishes but wayfinding — the same instinct that turns a moth toward the moon and sends the fairy wandering out beneath the constellations. The common misunderstanding is to wait for the entire route to be lit before setting out, or to dismiss a longing as foolish because it cannot yet be explained. But no traveler ever saw all the stars at once and mapped them; they simply followed the nearest bright one, and then the next. Let wonder lead where logic has stalled. The single step you can see is enough. Walk it, and the sky will keep unfolding its lanterns ahead of you.",
    shadow: "In shadow, this card warns against gazing at the stars so long you never take a step — mistaking endless dreaming for the journey — and against letting cynicism snuff a true calling before it can guide you.",
    affirm: "I follow the light of my dreams one step at a time, and the path reveals itself as I go." },
  { id: "the-balancing-feather", name: "The Balancing Feather", essence: "Balance · Harmony · Poise", hex: "#a9b96a", message: "You have been pouring nearly all of yourself into one corner of the garden, beloved, while the other beds go thirsty. Come back to gentle balance — a little water for work and a little for rest, some for others and some, at last, for you — and watch the whole garden bloom.",
    book: "The Balancing Feather drifts down when your life has tipped — too much given to one duty, one worry, one person, while other precious parts of you wilt in the shade. Its deeper teaching is that harmony is not a rigid, equal split but a living poise, the way a feather rests level on the wind through small, constant adjustments. The common misunderstanding is to think balance means doing everything at once, or to wait for a calmer season to tend what you have neglected. But the fairy does not steady the scales by force; she notices which side has grown heavy and lends a feather's weight to the other. Ask honestly which part of your life is starving. Give it its gentle, fair share today, and let equilibrium return by small, kind corrections.",
    shadow: "In shadow, this card warns against the counterfeit balance of spreading yourself so thin that nothing is truly nourished, and against using 'someday' as an excuse to keep neglecting what quietly matters most.",
    affirm: "I give each part of my life its fair and gentle share, and I return to balance through small, kind corrections." },
  { id: "the-floating-leaf", name: "The Floating Leaf", essence: "Surrender · Flow · Ease", hex: "#7fb8c8", message: "You have been swimming hard against the stream, beloved, and your arms are tired from a current that was never yours to conquer. Let go the way a leaf lets go — rest on the water, trust where it is carrying you, and save your strength for the turns that truly need you.",
    book: "The Floating Leaf comes to the weary, to those who have been straining to control what will not be controlled. Its deeper teaching is that surrender is not defeat but intelligence — the leaf that stops thrashing does not drown; it rides. Every fairy who has followed a brook knows the water understands the way down the mountain far better than any wish to hurry it. The common misunderstanding is to confuse letting go with giving up, or to believe that if you stop pushing, everything will fall apart. But some things move best only once you take your hands off them. Notice where you have been forcing a timing that is not yours. Lay yourself upon the current for a while. Rest, trust, and let life carry you toward the shore it already knows.",
    shadow: "In shadow, this card warns against the false surrender of passivity — drifting so limply you neglect the strokes that are genuinely yours to make — and against clutching control long after your grip has begun to harm you.",
    affirm: "I release what I cannot steer and let the current carry me toward where I am meant to be." },
  { id: "the-glowing-heart", name: "The Glowing Heart", essence: "Inner Light · Confidence · Radiance", hex: "#f26d8a", message: "You have been searching the whole garden for a light to guide you, beloved — patting your pockets, scanning the horizon — while all the while it has been glowing softly in your own chest. Stop looking outward for permission to shine, and simply let what is already lit be seen.",
    book: "The Glowing Heart shines forth when you have been seeking outside yourself for a worth, a warmth, or a certainty you already carry. Its deeper teaching is that your inner light was never something to be granted by another's approval — it is the original glow you were born holding, the same spark that makes the firefly and the fairy luminous from within. The common misunderstanding is to believe you must become more impressive before you are allowed to feel radiant, or to dim yourself so as not to outshine anyone. But no lantern apologizes for being bright, and no one is warmed by a light kept hidden. Turn your gaze inward and find the flame that is already there. Trust it, tend it, and let it show — the garden has been waiting for exactly your light.",
    shadow: "In shadow, this card warns against seeking endless outer validation to feel worthy — mistaking applause for the source of your light — and against shrinking your own radiance to keep others comfortable.",
    affirm: "The light I have been seeking is already within me, and I let it shine without apology." },
  { id: "the-elder-tree", name: "The Wise Old Tree", essence: "Wisdom · Insight · Guidance", hex: "#6a8a5c", message: "The answer you have been chasing is not hiding, beloved — it is waiting quietly, the way an old tree waits for you to sit down at its roots. Stop searching for a moment and simply listen; the wisest voice in your life has always spoken slowly.",
    book: "The Wise Old Tree arrives when you have been gathering opinions like fallen leaves, asking everyone but yourself. Its deeper teaching is that real wisdom is rarely loud or new — it is old and patient, already rooted inside you, grown ring by ring through every season you have survived. The common mistake is to believe insight must be found out there somewhere, chased down through more books, more voices, more restless searching. But a tree does not run through the forest looking for answers; it stands still and lets its roots go deep. Turn now toward the quiet. Sit with your own knowing until it settles, and you will find that the guidance you longed for was never far away — only waiting for you to stop long enough to hear it.",
    shadow: "In shadow, this card warns that endless seeking can become a way of avoiding the answer you already sense — and that borrowed wisdom, worn as your own, will never quite fit.",
    affirm: "I grow quiet, and I trust the knowing already rooted deep in me." },
  { id: "the-winding-path", name: "The Winding Path", essence: "Curiosity · Adventure · Discovery", hex: "#e0a85c", message: "That little pull you feel toward the unknown is not a distraction, beloved — it is a map. Follow the path that winds and curves without demanding to see where it ends; curiosity is the garden's oldest way of leading you exactly where you are meant to wander.",
    book: "The Winding Path appears when a straight line has stopped serving you and something in you longs to explore. Its deeper teaching is that curiosity is a kind of intelligence — a gentle tug from your future self, showing you the way before your mind can explain it. We often mistake the meandering road for a wrong turn, believing that if we cannot see the destination, we must be lost. But paths through an enchanted wood were never meant to be straight; they bend so you will notice the mushroom, the hidden stream, the little door you would have walked right past. Trust the turn. Let one small wonder lead you to the next, and you will discover that following your delight is not aimless at all — it is the surest way home to a life that feels like yours.",
    shadow: "In shadow, this card warns against a restlessness that never lands — chasing novelty for its own sake and mistaking constant motion for genuine discovery.",
    affirm: "I trust my curiosity to lead me somewhere worth going, even when I cannot see the end." },
  { id: "the-snowdrop", name: "The Brave Snowdrop", essence: "Perseverance · Hope · Resilience", hex: "#bcd0dd", message: "You do not have to wait for the winter to be over to begin blooming, beloved. Like the snowdrop that pushes its small white head up through the last of the frost, you carry more strength than the season around you — and hope was always braver than warmth.",
    book: "The Brave Snowdrop arrives when you are still standing in a hard season and wondering whether it is too soon to hope. Its deeper teaching is that resilience does not wait for perfect conditions — the snowdrop blooms while the ground is still frozen, not because the cold has left, but because something inside it refused to. We often think we must be fully healed, fully safe, fully ready before we can begin again. But the smallest flower in the garden is the first to rise, and it does so straight through the snow. Let yourself bloom early. One tender act of hope, one green shoot of effort offered before the thaw, is not foolishness — it is the quiet courage that tells winter, gently and certainly, that it will not last forever.",
    shadow: "In shadow, this card warns against the despair that insists there is no point in trying until everything improves — and against dismissing your own quiet perseverance simply because it has gone unnoticed.",
    affirm: "I can begin to bloom now, even while the frost still lingers around me." },
  { id: "the-blossom-festival", name: "The Blossom Festival", essence: "Celebration · Joy · Gratitude", hex: "#f28fb5", message: "Stop for a moment, beloved, and look at how much has quietly blossomed since you began. You have carried so much and grown so far — let today be a festival, a garden in full flower, and give yourself the simple joy of noticing it before you rush toward the next thing.",
    book: "The Blossom Festival arrives when you have been so busy tending the next task that you have forgotten to enjoy the bloom. Its deeper teaching is that celebration is not a reward you earn only at the finish line — it is a practice, a way of letting joy and gratitude finally catch up to your effort. We often postpone happiness, telling ourselves we will feel proud once the whole garden is grown. But the fairies do not wait for the last flower to throw their festival; they dance when the first blossoms open, and again, and again. Pause here. Name three things that have flowered in you this season and let yourself truly feel glad about them. Gratitude is how you turn a life of striving into a life of blooming.",
    shadow: "In shadow, this card warns against the habit of endless postponement — always waiting for a better, worthier moment to be grateful, until the flowers fade unadmired.",
    affirm: "I pause to celebrate how far I have come, and I let joy catch up to my effort." },
  { id: "the-quiet-nook", name: "The Quiet Nook", essence: "Solitude · Reflection · Recharge", hex: "#8f9cb8", message: "Slip away for a while, beloved, into the small quiet nook where no one needs anything from you. Being alone is not the same as being lonely — it is the moss-lined hollow where you set down the noise of the world and remember the sound of your own heart.",
    book: "The Quiet Nook arrives when you have given so much of yourself away that you can no longer hear your own voice beneath the chorus of everyone else's. Its deeper teaching is that solitude is not emptiness — it is a nest, a soft green place where you gather yourself back together. We tend to fear time alone, mistaking stillness for loneliness and rest for falling behind. But even the busiest fairy knows to curl into a hollow tree when the day grows too loud, and she comes out clearer, kinder, more herself. Give yourself that hollow. Let a little sacred solitude refill what the world has spent, and you will find that time alone was never a retreat from life — it was how you gathered the very self you bring back to it.",
    shadow: "In shadow, this card warns against solitude that hardens into hiding — withdrawing not to recharge but to avoid, until the quiet nook becomes a place you never leave.",
    affirm: "My time alone is not lonely; it is how I return to myself." },
  { id: "the-vine-bridge", name: "The Bridge of Vines", essence: "Faith · Perseverance · Crossing", hex: "#7a9a6a", message: "Do not turn back now, beloved — the swaying vine bridge always feels longest in the middle, but you are far nearer the other side than the fear will admit. Keep placing one careful step after another; the ground you are reaching for is already waiting under the mist.",
    book: "The Bridge of Vines arrives in the middle of a crossing, at the exact moment doubt whispers that you should never have left the safe shore. Its deeper teaching is that faith is not the absence of the sway — it is the choice to take the next step while the whole bridge trembles. We often measure how far we still have to go and forget to count how far we have already come, and so the middle feels like failure when it is really progress. But no one weaves a bridge of vines only to strand a traveler halfway. Trust the crossing. The other side is closer than your fear can see, hidden only by the mist, and every step you keep taking is quietly carrying you home to solid ground.",
    shadow: "In shadow, this card warns against turning back so near the end — abandoning the crossing in the trembling middle and mistaking the fear of the height for proof you were wrong to begin.",
    affirm: "I keep going; I am closer to the other side than my fear can see." },
  { id: "the-offered-berry", name: "The Offered Berry", essence: "Kindness · Generosity · Giving", hex: "#d0607a", message: "A small kindness is being asked of you today, beloved — not a grand gesture, only a single berry offered from your open palm. Give it freely and without keeping count, for the smallest sweetness, once shared, travels farther through the garden than you will ever see.",
    book: "The Offered Berry arrives when life presents a chance to give something small — a word, a moment, a share of your own quiet harvest — and you wonder whether it could possibly matter. Its deeper teaching is that kindness is measured not by its size but by its motion: a single berry set in another's hand becomes seeds, becomes a bramble, becomes a whole hedge of fruit for creatures you will never meet. The common misunderstanding is that we must be overflowing before we may give, that generosity belongs only to those with baskets to spare. But the fairies know better — the berry you offer when you have little is the one that ripples the widest. Give from exactly where you are. The garden always multiplies what love is brave enough to let go.",
    shadow: "In shadow, this card reveals giving that secretly keeps a ledger — kindness offered to be seen, repaid, or quietly owed back — and warns that a berry handed over to buy affection has already spoiled in the palm.",
    affirm: "I give my small sweetness freely, trusting it to ripple far beyond my sight." },
  { id: "the-wishing-star", name: "The Wishing Star", essence: "Magic · Possibility · Hope", hex: "#5f6fd0", message: "Make the wish, beloved — the one you have been too afraid to say aloud in case the night should laugh. The first star has already risen over the garden, and magic does not wait for you to feel certain; it begins the very moment you dare to believe it might.",
    book: "The Wishing Star appears when a longing has been glowing quietly in you, kept secret because wanting felt dangerous and hope felt naive. Its deeper teaching is that a wish is not a wistful escape from your life but the first true act of building it — the star does not grant your desire from somewhere far away; it lights the path your own feet were always meant to walk. The common misunderstanding is that magic happens only to the lucky, arriving fully formed while we wait. But the fairies whisper that belief is the spark, not the reward: the moment you truly wish, doors you could not see begin to open. Name what you long for. Say it softly to the sky. The star is already listening, and possibility has already begun.",
    shadow: "In shadow, this card exposes the wish that never becomes a step — longing worn as a comfort, hope hoarded as fantasy — and reminds you that a star admired but never trusted leaves the whole sky dark.",
    affirm: "I dare to wish out loud, for my believing is where the magic begins." },
];

const OCEAN_CARDS = [
  { id: "the-dolphins-joy", name: "The Dolphin's Joy", essence: "Joy · Play · Freedom", hex: "#2fb0c4", message: "The dolphin does not wait until the work is finished to leap, beloved — it plays its way through the whole wide sea. Let yourself laugh today for no reason at all; your joy was never a prize to be earned, it is simply, already, yours.",
    book: "The Dolphin's Joy surfaces when you have been treating delight as something you must qualify for — as if you may only rest, only laugh, only play once every task is done and every worry is solved. Its deeper teaching is that joy is not the reward waiting at the end of the ocean; it is the water you were always meant to swim in. The common misunderstanding is that playfulness is childish, unserious, a thing to outgrow — but the dolphin is both wise and free, and loses none of its depth by leaping. Turn toward this truth today: you do not have to earn your gladness. Let one small, pointless pleasure back into your hours, and watch how quickly the heaviness in you learns, again, how to float.",
    shadow: "In shadow, this card warns against a forced, performed cheerfulness that hides real pain — and against postponing every joy until conditions are perfect, a day that never quite arrives.",
    affirm: "My joy is not a wage I must earn; it is the water I was born to swim in." },
  { id: "the-whales-song", name: "The Whale's Song", essence: "Wisdom · Depth · Belonging", hex: "#1d5b8a", message: "Beloved, the whale sings into miles of dark water and trusts that somewhere, someone is listening — and someone always is. Do not shrink your voice to fit small rooms; sing your truth into the deep, for it carries further than you could ever know.",
    book: "The Whale's Song rises when you have quieted yourself to keep the peace — swallowing what is true because you fear no one wants to hear it. Its deeper teaching is that the deepest voices travel the farthest; the whale's low song crosses whole oceans precisely because it comes from the depths and not the shallows. The common misunderstanding is that being heard means being loud, or clever, or constantly present — but you belong to something vast, and your true note reaches ears you will never see. Turn toward this truth: you were not made to mute yourself. Sing from where you actually feel it, slow and unhurried and low, and trust the water to carry you home to the ones who have been listening for your voice all along.",
    shadow: "In shadow, this card reveals the ache of silencing yourself just to belong — and the false belief that your voice is too strange or too deep for anyone to ever answer.",
    affirm: "I sing my truth into the deep, and I trust that it will be heard." },
  { id: "the-sea-turtles-patience", name: "The Sea Turtle's Patience", essence: "Patience · Trust · Endurance", hex: "#3f9e7c", message: "The sea turtle has crossed whole oceans, beloved, and never once did she hurry. Move through this day slowly — one steady, unpanicked stroke after another — and trust that a patient pace still arrives, and often arrives more surely than the frantic one.",
    book: "The Sea Turtle's Patience appears when the world is pressing you to move faster than your spirit can bear — when you have begun to mistake speed for progress and stillness for failure. Its deeper teaching is that endurance, not urgency, is what carries a life across its long distances; the turtle reaches shores no sprinter could, simply by refusing to stop. The common misunderstanding is that patience means passive waiting, doing nothing at all — but the turtle is always swimming, steady and sure, just never frantic. Turn toward this truth today: you are not behind. The current you are in has its own timing, older and wiser than your worry. Keep making your small, faithful strokes, and let the ocean do the carrying it has always known how to do.",
    shadow: "In shadow, this card names the restlessness that mistakes rushing for living — and also the excuse of 'patience' used to justify never truly moving at all.",
    affirm: "I move steadily and without panic, trusting that my patient pace will carry me home." },
  { id: "the-pearl-in-the-shell", name: "The Pearl in the Shell", essence: "Self-worth · Beauty · Hidden gifts", hex: "#f2e9dc", message: "Beloved, the oyster did not curse the grain of sand that troubled it — it wrapped that small ache, layer by patient layer, into a pearl. The very thing that has been rubbing you raw may be quietly forming something luminous inside you that no untroubled life could ever grow.",
    book: "The Pearl in the Shell arrives when you are tempted to see only the grit of your life — the irritation, the old wound, the long discomfort you never asked for. Its deeper teaching is that the pearl exists because of the intrusion, not in spite of it; beauty here is not the absence of difficulty but the slow, faithful response to it. The common misunderstanding is that your worth must be flawless to be real, that any roughness disqualifies you — but the most precious thing the sea makes is born entirely from a hurt. Turn toward this truth: what you have endured is not wasted. Somewhere in the quiet dark of you, layer upon patient layer, a hidden gift has been forming — and it was your tenderness, not your perfection, that made it.",
    shadow: "In shadow, this card exposes the habit of seeing only your flaws and irritations while missing the beauty they have been building — or of clinging to the old wound and forgetting the pearl it became.",
    affirm: "The very thing that troubled me has been quietly shaping something precious within me." },
  { id: "the-turning-tide", name: "The Turning Tide", essence: "Change · Renewal · Trust", hex: "#4a8fb5", message: "Look how the tide that emptied the shore this morning is already, quietly, returning — it was never leaving for good, beloved, only breathing out before it breathes back in. Whatever has felt drained or gone from your life is not the end of the story; it is turning, even now.",
    book: "The Turning Tide comes to you in the low hour — when something has receded, when the shore of your life looks bare and you fear the water will not return. Its deeper teaching is that the sea does not abandon; it moves in rhythm, and every going-out is bound to a coming-in you cannot yet see. The common misunderstanding is that a low tide is a verdict, proof that fullness has left you for good — but the ocean has never once forgotten how to return. Turn toward this truth today: nothing in your life is permanently stuck, though stuck is exactly how the ebb always feels. Stand where you are with a little faith. What pulled away is already gathering itself, far out, to come home to you again.",
    shadow: "In shadow, this card warns against reading a temporary low as a final ending — and against clawing the tide back before its hour instead of trusting its own certain return.",
    affirm: "Nothing in my life is stuck forever; the tide is already turning back toward me." },
  { id: "the-mermaids-mirror", name: "The Mermaid's Mirror", essence: "Self-love · Truth · Reflection", hex: "#6bbfae", message: "Beloved, the mermaid lifts her mirror not from vanity but from honesty — she has simply stopped refusing to see her own beauty. Look at yourself today the way you would look at someone you love, and the loveliness you keep searching for in others will reveal itself already living in you.",
    book: "The Mermaid's Mirror surfaces when you have grown harsh with your own reflection — quick to admire a quality in everyone but yourself. Its deeper teaching is that the mirror does not lie; it is your gaze that has learned to be unkind, and a truer, gentler looking is available the very moment you choose it. The common misunderstanding is that self-love is arrogance, that to see your own beauty is to become vain — but the mermaid holds no contempt for anyone; she has simply made peace with the face the water gives back. Turn toward this truth today: the tenderness you pour so freely onto those you love was always meant to include you too. Meet your own eyes kindly. The beauty you keep seeking elsewhere has been your own reflection all along.",
    shadow: "In shadow, this card reveals the mirror turned cruel — judging your own reflection by a standard you would never impose on someone you love, or chasing outer approval to feel a beauty that was already yours.",
    affirm: "I meet my own reflection with kindness, and I see the beauty that has always lived in me." },
  { id: "the-jellyfish-drift", name: "The Jellyfish Drift", essence: "Surrender · Flow · Ease", hex: "#b07fc4", message: "You have been swimming so hard against the tide, beloved, that you forgot the water was already moving your way. Let go the way the jellyfish lets go — arms open, no map, no fight — and let the current do the work your arms never could.",
    book: "The Jellyfish Drift arrives when you are worn out from steering a life that was never yours to force. Its deeper teaching is that surrender is not defeat but intelligence — the jellyfish has no bones, no brain, no engine, yet it has crossed these seas for five hundred million years by trusting the water completely. The common mistake is to believe letting go means giving up, that if you stop paddling you will sink. But the sea holds what stops struggling; it is the thrashing swimmer who tires and goes under. Today, loosen your grip on the outcome. Let the current carry you somewhere your effort could not reach, and trust that being moved is not the same as being lost.",
    shadow: "In shadow, this card warns that surrender can curdle into passivity — drifting with no compass, calling avoidance 'flow,' and letting the tide decide the things you were actually meant to choose.",
    affirm: "I stop fighting the water, and the water carries me." },
  { id: "the-otters-way", name: "The Otter's Way", essence: "Play · Balance · Togetherness", hex: "#b0783f", message: "Beloved, the otter has cracked the secret of a happy life: she works only as much as she must, rests without a shred of guilt, and plays — oh, how she plays — the whole day long, and always beside the ones she loves. You were not born only to labour; let today hold rest and play as well as work.",
    book: "The Otter's Way drifts to you when your life has tilted too far toward doing — when work has quietly swallowed the play, the rest, and the simple curious delight that makes a life worth living. Its deeper teaching is that a good life is not earned by toil alone; it is built, the way the otter builds hers, from a wise balance of effort and ease, and learned not through grim discipline but through play and the company of others. The common misunderstanding is that rest and play are what you get once the work is finally done — but the otter knows the work is never finally done, and chooses to be happy anyway. Turn toward this truth today: you are allowed a wonderfully fun life. Work when you must, then float on your back in the sun, hold the hands of your people, and let yourself learn, like the otter, through joy.",
    shadow: "In shadow, this card names the guilt that will not let you rest or play until every last task is done — and, at the other extreme, the avoidance that calls itself 'play' to dodge the work that truly matters.",
    affirm: "I balance work with rest and play; I am allowed a happy, playful life, and I live it beside the ones I love." },
  { id: "the-deep-calm", name: "The Deep Calm", essence: "Peace · Stillness · Rest", hex: "#1b3a5c", message: "The surface of you is all whitecaps today — worry, wind, a noise that will not settle — yet the storm is only the top few feet of a very deep sea. Sink beneath it, beloved, down to where the great whales rest and the water has been still for a thousand years; that quiet is yours.",
    book: "The Deep Calm surfaces when your days have become weather — every mood a squall, every hour blown somewhere new — and you have forgotten you are more than your surface. Its deeper teaching is that peace is not something you must manufacture against the storm; it is a place that already exists in you, far below the reach of any wind. The mistake is to fight the waves, to try to flatten the sea by force of will. But you cannot calm the surface from the surface. You go down. Rest is the descent — into breath, into silence, into the still dark where nothing needs fixing. Let the top of the ocean rage if it must. You will be resting in the deep, and the storm will pass over you like weather over stone.",
    shadow: "In shadow, this card warns that stillness can be counterfeited by numbness — sinking so deep to escape the storm that you stop feeling anything at all, and call that quiet peace.",
    affirm: "Beneath the storm, I am still, and the stillness is mine." },
  { id: "bioluminescence", name: "Bioluminescence", essence: "Wonder · Magic · Inner light", hex: "#37d6c0", message: "In the deepest part of the sea, where no sun has ever reached, the creatures make their own light — and so, beloved, do you. The dark you are moving through is not proof that your glow has failed; it is the only place your light was ever meant to be seen.",
    book: "Bioluminescence arrives to remind you of something the darkness made you doubt: that you carry your own light, and it does not depend on the sun. Its deeper teaching is that your glow was never meant for the bright and easy places — a candle is invisible at noon. It is precisely in the deep, in the cold and the black miles where nothing else shines, that the small light you were given becomes a wonder, a lantern, a way through. The common mistake is to wait for outside light before you dare to shine, to think you must feel bright to be bright. But the lantern fish does not wait for permission. Let your inner glow lead now, softly and without apology. What is dark around you is simply the night that finally lets you be seen.",
    shadow: "In shadow, this card warns of dimming your light to keep others comfortable — or chasing someone else's glow so long that you forget you were always meant to make your own.",
    affirm: "I make my own light, and the dark is where it shines." },
  { id: "the-seahorses-devotion", name: "The Seahorse's Devotion", essence: "Love · Loyalty · Tenderness", hex: "#d98a5c", message: "Seahorses do not clutch each other; they link tails and drift, holding on just gently enough to stay together through the current. That is the love being asked of you now, beloved — not a grip that leaves marks, but a quiet, faithful holding-on that lets you both sway and still remain.",
    book: "The Seahorse's Devotion swims close when you are wondering whether the quiet kind of love is enough — whether tenderness that makes no drama, keeps no score, and asks for no proof still counts as the real thing. Its deeper teaching is that the strongest love is not the tightest grip but the gentlest constancy: seahorses link their tails and hold on through the current, loosely enough to move, faithfully enough to stay. The mistake is to measure love by its intensity — its storms, its grand gestures, its ache. But devotion is measured in mornings, in the small steady returning to one another when nothing is on fire. Loosen your hold and deepen your loyalty. Love that lasts is not the one that clings hardest, but the one that keeps gently choosing to stay.",
    shadow: "In shadow, this card warns that devotion can curdle into clinging — gripping out of fear until love leaves marks, or staying faithful to someone who let go of your tail long ago.",
    affirm: "I hold the ones I love gently, and I stay." },
  { id: "the-octopus-wisdom", name: "The Octopus's Wisdom", essence: "Intuition · Cleverness · Adaptability", hex: "#7a4a8c", message: "The octopus has no bones and no blueprint, yet it pours its whole body through a gap the size of a coin and solves the locked box no one taught it to open. You carry that same quiet genius, beloved — trust the knowing in your own arms, even the part of you that cannot yet explain itself.",
    book: "The Octopus's Wisdom reaches for you when you are stuck at a wall you think you cannot pass, doubting a knowing because you cannot yet prove it. Its deeper teaching is that intelligence is not only in the head — the octopus thinks with its whole body, each arm tasting, sensing, and deciding on its own. That is why it can change color in a heartbeat and pour through any opening: it does not need to understand the escape before it makes it. The mistake is to trust only the thoughts you can explain. But your gut, your hands, the hair rising on your neck — these are old, wise instruments. Adapt like water with a mind. Trust the knowing that arrives before its reasons do, and let yourself be as clever as you already are.",
    shadow: "In shadow, this card warns that cleverness can become a hiding place — shape-shifting to please everyone until you lose your own color, or over-thinking a truth your body has already settled.",
    affirm: "I trust the knowing in my body, even before I can explain it." },
  { id: "the-starfish-healing", name: "The Starfish's Healing", essence: "Healing · Renewal · Wholeness", hex: "#e8927c", message: "The starfish does not mourn the arm it lost, beloved — it quietly grows a new one, because wholeness is written into its body. Something in you is already mending beneath the surface; you do not have to force the healing, only stop reopening the wound to check on it.",
    book: "The Starfish's Healing arrives when a part of you has been torn away — by loss, by change, by a hurt you did not choose — and you fear you will be less forever. Its deeper teaching is that regeneration is not a miracle you must summon; it is your natural state, already underway in the dark and quiet of your depths. The common misunderstanding is to measure healing by how you feel today, and to call the slowness a failure. But the starfish grows its arm one cell at a time, on the seafloor, unwatched. Turn toward the truth that wholeness is not something you lost and must earn back — it is the very pattern you are made of, patiently redrawing itself while you rest.",
    shadow: "In shadow, this card warns against tearing the scab off to inspect the wound, and against believing you are broken simply because the mending is invisible and slow.",
    affirm: "I am not broken — I am regrowing, one quiet cell at a time." },
  { id: "the-orcas-loyalty", name: "The Orca's Loyalty", essence: "Family · Strength · Loyalty", hex: "#22415c", message: "Beloved, the orca is powerful beyond measure, yet she spends her whole life beside her family, never swimming the cold miles alone. Your strength was never meant to be carried in solitude — call your pod close, and let yourself be held by the ones who would cross any ocean for you.",
    book: "The Orca's Loyalty surfaces when you have been mistaking strength for self-sufficiency — believing that to be powerful you must need no one, and to be loved you must first be strong enough to deserve it. Its deeper teaching is that true power and true belonging are not opposites; the orca is the ocean's fiercest hunter and its most devoted family member at once, and loses nothing of her strength by staying close to her pod. The common misunderstanding is that leaning on your people is weakness — but the orca's whole might is woven through her loyalty. Turn toward this truth: you do not have to be the strong one, alone, forever. There is a pod that claims you — by blood or by choosing — and your power is safest, and fiercest, when it protects what it loves and lets itself be protected in return.",
    shadow: "In shadow, this card names the lonely pride that refuses all help in the name of strength — and the old wound of a loyalty given freely to those who never returned it.",
    affirm: "My strength and my belonging are one; I let my pod hold me as fiercely as I would hold them." },
  { id: "the-kelp-forest", name: "The Kelp Forest", essence: "Growth · Rootedness · Home", hex: "#2e7d5b", message: "The kelp does not tear up its roots to chase the sun — it holds fast to one small stone and grows, patiently, until it reaches the light. Stay where you are planted, beloved; the growth you long for comes not from leaving, but from going deeper and reaching up at once.",
    book: "The Kelp Forest rises when you are tempted to uproot yourself — to abandon the place, the work, or the love you are in because growth feels slow and the light seems to be somewhere else. Its deeper teaching is that height comes from anchorage: the kelp grows tall precisely because it holds fast to a single stone on the ocean floor. The common misunderstanding is that being rooted means being stuck. But roots are not chains; they are how the tall things stay standing when the current pulls hard against them. Turn toward the truth that home is not a cage but a foundation. Commit to your one stone, send your strength steadily upward, and you will become part of a whole swaying forest — tall enough, at last, to touch the sun.",
    shadow: "In shadow, this card warns against mistaking restlessness for a calling to leave, and against pulling up young roots the very moment the growing turns slow.",
    affirm: "I hold fast to my place and grow tall enough to reach the light." },
  { id: "the-anchor-released", name: "The Anchor Released", essence: "Letting go · Freedom · Release", hex: "#456b8c", message: "There is an anchor you have been dragging across the seafloor, beloved, long after the storm it was meant for has passed. You are allowed to haul it up — to release what has kept you low — and let yourself rise toward the surface and the light.",
    book: "The Anchor Released arrives when something that once kept you safe has quietly become the very thing keeping you down. An anchor is a mercy in a storm — but a ship that never lifts its anchor never sails again. Its deeper teaching is that letting go is not the same as giving up; it is choosing motion over a safety that has curdled into weight. The common misunderstanding is that whatever we cling to must be important because it is so heavy to carry. But weight is not the same as worth, and some things ask only to be set gently down. Turn toward the truth that you were built to move with the tide. Loosen the chain, feel the hull lighten, and trust the water to carry you now that you are no longer fighting to stay still.",
    shadow: "In shadow, this card warns against clinging to old ballast out of habit, and against calling your fear of the open water 'being responsible.'",
    affirm: "I am allowed to release what holds me down and let myself rise." },
  { id: "the-coral-garden", name: "The Coral Garden", essence: "Gratitude · Abundance · Beauty", hex: "#ff8fa3", message: "You have been scanning the horizon for the abundance you think you are missing, beloved, while a whole coral garden blooms in colour right beneath you. Look down and around today; gratitude is the tide that turns what you already have from merely enough into plenty.",
    book: "The Coral Garden arrives when you have been living as though the good life is somewhere you have not reached yet — always one wave beyond where you are standing. Its deeper teaching is that abundance is rarely a matter of getting more; it is a matter of noticing what is already teeming around you. A reef is built slowly, one small living thing at a time, until it becomes the most abundant garden in all the sea. The common misunderstanding is that gratitude is a reward you hand to life once it has finally satisfied you. But gratitude is not the receipt for abundance — it is the doorway into it. Turn toward the truth that plenty begins the moment you stop counting what is missing and start blessing what is here, blooming, in a hundred quiet colours.",
    shadow: "In shadow, this card warns against the hunger that always needs more to feel full, and against letting comparison drain the colour from a life that is already rich.",
    affirm: "I notice the abundance already blooming, and gratitude turns it to plenty." },
  { id: "the-shoreline", name: "The Shoreline", essence: "Boundaries · Balance · Self-respect", hex: "#c9b899", message: "The shore does not apologize to the sea for where it begins — it simply holds its line, and in that clear meeting-place, both are kept whole. Know where you end and others begin, beloved; a boundary is not a wall against love, but the edge that keeps you from being washed away.",
    book: "The Shoreline arrives when you have blurred the line between caring for others and disappearing into them — when you can no longer tell where your own needs end and everyone else's begin. Its deeper teaching is that a boundary is not selfishness; it is the coastline that lets the sea and the land meet without one erasing the other. The common misunderstanding is that love means having no edges, letting every wave come as far inland as it likes. But a shore with no limit is not generous — it is a flood. Turn toward the truth that the clearest, kindest thing you can offer is a self that has not been washed away. Hold your line gently and without apology, and let the tide come only as far as the sand allows.",
    shadow: "In shadow, this card warns against letting guilt erode your edges until nothing of you is left, and against building a sea-wall so high that no tide of love can reach you at all.",
    affirm: "I know where I end and the sea begins, and I hold that line with love." },
  { id: "the-calm-after-the-storm", name: "The Calm After the Storm", essence: "Relief · Grief · Renewal", hex: "#8fb4c4", message: "The wind has finally dropped, beloved, and the sea is learning to be still again — let yourself feel both the relief and the grief the storm left on your shore. You do not have to choose between mourning what it took and breathing in the clean new light; the calm is wide enough to hold both at once.",
    book: "The Calm After the Storm arrives when the hardest part is already behind you, and yet you feel strangely hollow rather than triumphant — its deeper teaching is that relief and grief are tidal, and they come in together. Survival is not the same as being unharmed; the sea that has weathered a storm carries wreckage to its beach for days afterward, and this is not weakness but honesty. The common misunderstanding is that healing means rushing back to normal, pretending the water was never wild. But the truer thing is to stand in the quiet and let the waves return what you lost, to grieve it fully, so that when you finally breathe in, the air is genuinely clean. Renewal is not the denial of the storm. It is what grows in the ground the storm washed bare.",
    shadow: "In shadow, this card warns against mistaking numbness for peace, and against hurrying past your grief so quickly that the storm's lessons wash back out to sea unlearned.",
    affirm: "I let the calm hold both my grief and my gladness, and I breathe." },
  { id: "the-deep-currents", name: "The Deep Currents", essence: "Courage · Direction · Trust", hex: "#204d6b", message: "Beneath the choppy surface where you have been struggling, beloved, a deep current is already moving you toward the life you were made for. Stop fighting the water for a moment and feel where it wants to carry you — the steady pull you keep sensing is not fear to be resisted, it is direction to be trusted.",
    book: "The Deep Currents surfaces when you feel tossed by the waves on top and forget the vast, purposeful water moving far below — its deeper teaching is that your life has a direction even on the days your effort feels aimless. The great ocean currents are invisible, yet they carry whole migrations across the world without a single map. Something in you already knows where it is going. The common misunderstanding is that courage means gripping the wheel harder, forcing your way against every tide. But real trust is quieter: it is the bravery to stop thrashing, to let the deeper pull take your weight, and to discover that being carried is not the same as being lost. Point yourself toward what calls you, and let the current do what your strength alone never could.",
    shadow: "In shadow, this card warns against surrendering to just any current out of sheer exhaustion, and against calling it trust when you have really only stopped listening for where you are meant to go.",
    affirm: "I am brave enough to stop fighting the water and trust where it is carrying me." },
  { id: "the-moonlit-water", name: "The Moonlit Water", essence: "Intuition · Mystery · Reflection", hex: "#9db8d9", message: "When the loud bright noise of the day finally sets, beloved, a quieter voice rises in you like moonlight laid across dark water. Do not reach and grab for the answer — grow still, and let it come to you; what you could not see clearly by day will often show its whole face by night.",
    book: "The Moonlit Water appears when the truth you are seeking will not come by thinking harder, only by growing quieter — its deeper teaching is that intuition speaks in reflection, not in noise. The moon casts no light of its own; it simply receives and returns a softer version of the sun, and your inner knowing works that same gentle way. The common misunderstanding is that a hunch you cannot explain must be less trustworthy than a reasoned argument. But the sea does not doubt the tide for arriving without a spreadsheet. Some knowing is meant to be felt in the body long before it can be defended in words. Tonight, let the mystery stay a mystery a little longer. Sit beside the dark water, let it mirror you back to yourself, and trust the first quiet thing you hear.",
    shadow: "In shadow, this card warns against drowning your intuition in constant noise and second-guessing, and against mistaking a fearful imagining in the dark for the calm, true voice of your knowing.",
    affirm: "I trust the quiet voice that speaks to me in the stillness." },
  { id: "the-message-in-the-bottle", name: "The Message in the Bottle", essence: "Faith · Connection · Serendipity", hex: "#4fb89a", message: "What you set adrift with an open heart — the kind word, the honest prayer, the love you gave with no proof it would ever land — is still out there traveling, beloved. You cannot rush the tide that carries it, but nothing offered in true faith is ever lost at sea.",
    book: "The Message in the Bottle floats to you when you are waiting on something you released long ago and have begun to fear went unheard — its deeper teaching is that faith is what you do after the bottle leaves your hand. You do not get to choose the current, the distance, or the day it arrives on some far shore. The common misunderstanding is that an offering with no visible reply was wasted, that connection must be instant to be real. But the sea keeps its own calendar, and serendipity is simply the answer arriving by a route you could never have charted. What you send out in love joins a tide far larger than you. Keep sending, keep trusting, and let the timing of its return be the ocean's work, not yours.",
    shadow: "In shadow, this card warns against giving only to snatch back an immediate reply, and against abandoning faith the moment the water goes quiet and no answer has yet washed ashore.",
    affirm: "What I send out in love is never lost; I trust its timing to return to me." },
];

const GAIA_CARDS = [
  { id: "the-rising-sun", name: "The Rising Sun", essence: "Hope · Beginnings · Renewal", hex: "#f4a63b", message: "The sky forgives the night every single morning, beloved, and so may you forgive yourself. Whatever went unfinished or unwell yesterday, the sun returns anyway — not to erase what happened, but to hand you a fresh and lighted hour to begin again.",
    book: "The Rising Sun arrives when you have been carrying yesterday too far into today, as if the past were a debt the morning could not clear. Its deeper teaching is that renewal is not earned through penance but simply given — the earth turns, and light comes to the weary and the worthy alike. We often mistake a fresh start for a clean slate, and then despair that the old marks are still faintly there. But dawn does not require you to be new; it asks only that you face the coming day rather than the departed one. Turn east. The same sun that lit your finest morning is rising on this ordinary one, and it does not love you any less for how the night went.",
    shadow: "In shadow, this card warns against using each new beginning to flee the last one — starting over so often that nothing is ever allowed to root, ripen, and grow.",
    affirm: "The morning does not hold my yesterday against me, and neither will I." },
  { id: "the-sunset", name: "The Sunset", essence: "Gratitude · Completion · Peace", hex: "#c96b4a", message: "Let something end well today, beloved. The sun does not cling to the sky when its work is done — it lays its light down in gold and rose, grateful and unhurried, and the whole earth is made more beautiful by the letting go.",
    book: "The Sunset arrives when a chapter, a task, or a season is quietly asking to be finished, and part of you fears that ending it means it somehow failed to last. Its deeper teaching is that completion is not loss but fulfillment — the day was always meant to close, and its closing is where much of its beauty was kept. We tend to grieve every ending as a small death and forget to thank what is departing. But watch how the sky treats dusk: not as a wound, but as a ceremony. What is ending gave you something real. Turn toward it, name the gift aloud, and let the light go down in peace. Rest is not the absence of the day — it is the day's reward.",
    shadow: "In shadow, this card warns against dragging endings out past their hour — refusing to thank a thing and release it, until gratitude curdles into clinging.",
    affirm: "I can let this end and still be grateful that it was ever mine." },
  { id: "the-noon-sun", name: "The Noon Sun", essence: "Confidence · Vitality · Self-Worth", hex: "#f2c14e", message: "You have been dimming yourself to keep the room comfortable, beloved, and today the sky says stop. At its height the sun stands directly overhead and casts no long shadow to hide behind — be like that now, full and unafraid, warming everything you touch.",
    book: "The Noon Sun arrives when you have grown so practiced at shrinking that you have mistaken smallness for humility. Its deeper teaching is that your fullest light was never a threat to anyone — the noon sun does not apologize for ripening the wheat or warming the cold stones, and neither should you apologize for your strength, your gladness, or your worth. We are often taught that to be good is to be modest to the point of vanishing. But the sun at its peak gives the most and hoards nothing; its confidence is a form of generosity. Stand where you are and let yourself be fully lit. The people meant for your warmth are not asking you to be less — they are waiting, a little cold, for you to finally be all of it.",
    shadow: "In shadow, this card warns that confidence can overheat into arrogance that scorches rather than warms — and, just as truly, that false modesty is only vanity worn quietly.",
    affirm: "I am allowed to take up the whole of my own light." },
  { id: "the-full-moon", name: "The Full Moon", essence: "Intuition · Reflection · Wholeness", hex: "#c8cdd6", message: "There is something you already know, beloved, that the daylight was simply too loud for you to hear. Let the night grow quiet around you the way it does around the full moon, and let that soft certainty rise in you — whole, unhurried, needing no proof but its own calm light.",
    book: "The Full Moon arrives when your mind has been asking a question your body has already answered, and you keep waiting for the reply to come in words. Its deeper teaching is that some knowing is lunar, not solar — it does not blaze; it reflects, glowing quietly at the edge of your attention where your daytime self rarely looks. We tend to distrust anything we cannot argue for, and so we override that gentle inner tide again and again. But the moon does not shout, and still it moves whole oceans. Grow still. Let the noise of proving and planning go dark, and notice what remains lit within you. That steady, wordless certainty is not a passing mood to second-guess — it is the oldest part of you, keeping faith.",
    shadow: "In shadow, this card warns against mistaking every passing feeling for deep intuition — and against using 'a knowing' to dodge the honest, difficult work of thinking a thing all the way through.",
    affirm: "I trust the quiet certainty that rises in me once I finally grow still." },
  { id: "the-starry-night", name: "The Starry Night", essence: "Wonder · Faith · Belonging", hex: "#2f3b66", message: "Step out under the dark tonight, beloved, and let yourself feel small — not lost, but held. The same immensity that hangs a thousand stars without letting a single one fall is cradling your one small life just as carefully, and you were never meant to carry it alone.",
    book: "The Starry Night arrives when the weight of your own life has convinced you that everything depends on you, and that you must face it entirely by yourself. Its deeper teaching is that smallness and safety are not opposites — to stand beneath the stars is to remember that you belong to something vast, old, and ongoing that was holding things together long before you ever learned to worry. We mistake feeling small for feeling insignificant, and so we scramble to make ourselves large. But the child who looks up does not feel worthless under that sky; she feels wonder, and wonder is a kind of trust. Let the heavens be bigger than your trouble tonight. You are a small light among countless others, kept by the same quiet gravity, and you are not falling.",
    shadow: "In shadow, this card warns that wonder can curdle into insignificance — using the vastness of things as an excuse to feel powerless, when it was only ever meant to make you feel held.",
    affirm: "I am small beneath the stars and safely, wholly held." },
  { id: "the-ancient-oak", name: "The Ancient Oak", essence: "Strength · Endurance · Steadfastness", hex: "#6b4f2a", message: "You do not have to bow to every wind that comes for you today, beloved. Stand like the old oak — patient, deeply rooted, unbothered by the storm precisely because you know the storm is passing and your roots go down where the weather cannot reach.",
    book: "The Ancient Oak arrives when you are being tested by something loud and relentless, and you have begun to fear that endurance means never being shaken at all. Its deeper teaching is that true steadfastness is not rigidity — the oak that lasts a hundred winters is the one that lets its high branches sway while its roots hold utterly still. Its strength is not in the leaves the wind takes, but in the depth no one can see. We tend to measure our resilience by how unmoved we appear, and exhaust ourselves resisting every gust. But the oak knows what to give the storm and what to keep. Let the surface of your life move if it must. Tend the deep roots — your values, your rest, your quiet faith — and you will still be standing when the season turns.",
    shadow: "In shadow, this card warns that steadfastness can harden into stubbornness — refusing to bend even a little, so that what will not sway in the wind is finally broken by it.",
    affirm: "My roots go deeper than any storm can reach." },
  { id: "the-willow-tree", name: "The Willow Tree", essence: "Grief · Yielding · Grace", hex: "#7f9b6f", message: "When sorrow moves through you, beloved, do not stand rigid against it — bend the way the willow bends, low and green, until the wind has passed. Your grief is not weakness; it is love with nowhere left to go, and it will not break the branch that learns to yield.",
    book: "The Willow Tree arrives in seasons of loss, when something or someone you loved has slipped from your hands and the ache feels like it could split you in two. Its deeper teaching is that the willow survives every storm not by resisting but by relenting — its long arms sweep the ground, its trunk sways low, and by morning it is still standing, greener for the rain. The common misunderstanding is that strength means staying unmoved, that tears are a kind of falling apart. But grief is not the opposite of grace; it is grace in its most tender form. Turn toward your sorrow the way the willow turns toward water. Let it move you, weep you, bend you low — and trust that yielding is how the living survive what the rigid cannot.",
    shadow: "In shadow, this card warns against a yielding that becomes collapse — bending so far into sorrow that you forget you were ever meant to rise again, or numbing the grief so completely that you never let it move through you at all.",
    affirm: "I bend with my sorrow so that it cannot break me." },
  { id: "the-two-trees", name: "The Two Trees", essence: "Love · Devotion · Togetherness", hex: "#b06b7a", message: "Love is not two trees grown into one trunk, beloved, but two that rise side by side — roots tangled below, crowns leaning close, each still reaching for its own patch of sky. Let those you love have their own weather and their own height, and lean toward them anyway, all your days.",
    book: "The Two Trees appear when a bond is asking to deepen — a love, a friendship, a partnership that has weathered enough seasons to be trusted. Their deeper teaching is that true devotion is not fusion but companionship: two separate lives whose roots have quietly grown together underground, whose branches touch without tangling into knots. The common misunderstanding is that to love fully you must lose yourself, pour everything in until there is no you left to give. But a tree that leans its whole weight on another topples them both. Turn instead toward the wisdom of the grove — grow your own rings, drink your own rain, stand on your own roots — and from that fullness, lean. The closeness that lasts is the closeness between two who could each stand alone, and choose, every day, to stand together.",
    shadow: "In shadow, this card reveals the counterfeit of togetherness — a clinging that mistakes dependence for devotion, or a fusion so complete that two people can no longer tell where one of them ends and the other begins.",
    affirm: "I stand on my own roots, and from that fullness I lean toward the ones I love." },
  { id: "the-first-blossom", name: "The First Blossom", essence: "Courage · Tenderness · New Growth", hex: "#eaa6c2", message: "The first blossom opens while frost still lingers, beloved — tender petals unfurling into air that has not yet promised to be kind. There is more courage in your softness than in any armor, and the world does not wait for the brave to feel ready; it waits only for them to open.",
    book: "The First Blossom arrives at the trembling edge of something new — a love just spoken, a truth just told, a small green risk pushed up through hard ground. Its deeper teaching is that opening is always an act of courage, because to bloom is to become visible, soft, and unguarded in a world that has not promised to be gentle. The common misunderstanding is that bravery means feeling no fear, waiting to be strong before you begin. But the first blossom is not fearless; it is simply willing, unfurling anyway while the cold still bites. Turn toward that willingness. You do not need the whole orchard to be safe before you open — one tender flower, opening honestly, is how every spring that ever came began. Let yourself be new. Let yourself be seen.",
    shadow: "In shadow, this card warns against staying closed to protect a tenderness that was only ever meant to be shared — mistaking the armor for safety, when it is slowly becoming a cage.",
    affirm: "I am brave enough to open, soft and new, before the world has promised to be kind." },
  { id: "the-seed", name: "The Seed", essence: "Potential · Patience · Faith", hex: "#8a7d4a", message: "What you plant today, beloved, you plant in the dark — and the dark is not the end of it, only the beginning no one gets to watch. Trust the seed you cannot see; every green thing that ever reached the sun began by keeping faith underground, alone, in the quiet.",
    book: "The Seed arrives when you have begun something whose ending you cannot yet see — an intention set, a small effort made, a hope buried where no one can admire it. Its deeper teaching is that all real growth begins in the dark and in secret; the seed does its holiest work underground, splitting open, sending down roots, long before a single leaf breaks the surface. The common misunderstanding is that nothing is happening because nothing shows, that silence means failure. But the field in winter is not empty — it is pregnant. Turn toward patience and let the buried thing keep its own time. You planted in faith; now tend the soil, water the dark, and trust what you cannot yet measure. What is meant to rise will rise, in the season that is truly its own.",
    shadow: "In shadow, this card warns against digging up the seed to check whether it is growing — the impatience that mistakes stillness for death and uproots a future that only needed a little more time.",
    affirm: "I trust what I planted in the dark to find its own way to the light." },
  { id: "the-deep-roots", name: "The Deep Roots", essence: "Belonging · Foundation · Home", hex: "#5a4632", message: "You are steadier than you know, beloved. What the wind sees is only your swaying branches, but far below the noise of this hard day your roots run deep and wide, holding you to something older than fear — and nothing that shakes the leaves can pull the whole tree down.",
    book: "The Deep Roots arrive when the winds are high and you fear you might be blown away — a season of upheaval that has you doubting whether anything in your life is solid. Their deeper teaching is that a tree's true strength is never in the part that shows; the oak that has stood a hundred years is anchored by a hidden mirror of itself, roots reaching as far down and wide as its branches reach up. The common misunderstanding is that belonging must be visible and loud, that if you feel shaken you must be unmoored. But the storm only ever touches the leaves. Turn downward, toward what already holds you — the loves, the memories, the quiet places that are home. You are more anchored than this hard day can tell you. Bend in the wind; you will not fall.",
    shadow: "In shadow, this card reveals the ache of feeling rootless — clinging to shallow ground for a quick sense of belonging, or forgetting that the home you keep longing for has been holding you all along.",
    affirm: "My roots run deeper than any storm; I am held, and I will not fall." },
  { id: "the-wildflowers", name: "The Wildflowers", essence: "Joy · Freedom · Being Yourself", hex: "#e07a9b", message: "No one plants the wildflowers, beloved, and no one tells them which color to be — they simply spill across the hillside, loud and gold and gloriously themselves. You need no permission to bloom, no tidy row to stand in; be the ordinary, uninvited, riotous joy you already are.",
    book: "The Wildflowers arrive when some part of you has been waiting for approval before it dares to be fully itself — dimming your color, tidying your joy, quietly asking permission to take up space. Their deeper teaching is that nothing in a wild meadow was invited, arranged, or asked to justify its blooming; the poppy does not apologize for being red, and the whole riotous field is beautiful precisely because no one planned it. The common misunderstanding is that freedom must be earned and joy must be deserved, that you may bloom once you are finally acceptable enough. But the wildflowers never got that memo. Turn toward your own wild nature and let it open in the open air. You were never a garden meant to be pruned into shape — you are a meadow, and your only task is to bloom.",
    shadow: "In shadow, this card names the quiet grief of shrinking to stay acceptable — trading your wild color for the safety of the tidy row, and calling that smallness peace.",
    affirm: "I don't need permission to bloom; I am gloriously, unapologetically myself." },
  { id: "the-fallen-leaf", name: "The Fallen Leaf", essence: "Letting Go · Endings · Acceptance", hex: "#b5652c", message: "Something in your life has finished its season, beloved, and the kindest thing you can do is let it fall. A leaf does not cling to the branch in shame — it lets go in a slow gold spiral, trusting the ground to receive it.",
    book: "The Fallen Leaf arrives when you are holding on to something that has already completed its work in you — a role, a relationship, a version of yourself that served the summer but cannot survive the coming cold. Its deeper teaching is that release is not loss but return; the leaf that falls is not thrown away, it is given back to the soil that made it, becoming next year's green. The common misunderstanding is that falling means failing, that an ending is proof you did something wrong. But the tree is never more whole than in the moment it lets go. Turn, then, toward acceptance — not the bitter kind that gives up, but the wide, quiet kind that trusts what leaves to feed what comes.",
    shadow: "In shadow, this card reveals the grip that calls itself loyalty — clinging to what has already died and mistaking your own exhaustion for devotion.",
    affirm: "I let what is finished fall, trusting the ground to catch it." },
  { id: "the-quiet-forest", name: "The Quiet Forest", essence: "Stillness · Sanctuary · Peace", hex: "#3f5e43", message: "Step in beneath the trees, beloved, where the noise of the world thins to birdsong and your own slow breath. The forest asks nothing of you here — not to perform, not to hurry, not to be anyone at all — only to let yourself be held by something older and greener than your worry.",
    book: "The Quiet Forest arrives when the clamor of the world has grown so loud that you can no longer hear yourself think, let alone feel. Its deeper teaching is that peace is not something you must build or earn — it is a place you enter, always there, the way a forest waits whether or not anyone walks in. The common misunderstanding is that stillness is idleness, that stepping out of the noise means falling behind. But the forest grows its tallest trees in silence, and roots do their deepest work unseen. Turn toward sanctuary, then. Find the quiet — a room, a walk, a held breath — and let it close around you like a canopy, until the small true voice beneath the noise can finally be heard.",
    shadow: "In shadow, this card warns of the false peace of avoidance — using stillness to hide from what must be faced, mistaking a locked door for a sanctuary.",
    affirm: "I step into the quiet, and let the world's noise fall away behind me." },
  { id: "the-gentle-rain", name: "The Gentle Rain", essence: "Healing · Release · Nourishment", hex: "#7a99a8", message: "Let it come, beloved — the soft rain of feeling you have been holding behind your eyes. Tears are not weakness leaking out; they are the sky remembering how to be tender, and every one that falls is watering something quiet that is preparing to grow.",
    book: "The Gentle Rain arrives when you have been bracing against your own sorrow, holding the sky closed for fear that if you let it open you will never stop. Its deeper teaching is that grief, like rain, is not the enemy of life but its nourishment — the ground drinks what falls and answers, in its own time, with green. The common misunderstanding is that crying is falling apart, that to release is to be undone. But no storm has ever emptied the sky forever, and no honest weeping has ever failed to soften the hardened ground of a heart. Turn toward release. Let the rain come gently, without shame, and trust that what feels like breaking is only the long, slow work of things beginning to grow again.",
    shadow: "In shadow, this card reveals the drought of held-back tears — the belief that staying dry is staying strong, while everything within you quietly cracks for want of water.",
    affirm: "I let my tears fall softly, knowing they water what will grow next." },
  { id: "the-storm", name: "The Storm", essence: "Courage · Weathering · Truth", hex: "#4a5568", message: "The storm has come, beloved, and there is no shame in the wildness of what you feel — the wind that shakes you is not trying to break you. You are the tree, not the weather; you can bend all the way to the ground in the gale and still be standing when the sky clears.",
    book: "The Storm arrives when a feeling has grown too large to be politely contained — grief, anger, fear, a truth that will no longer stay quiet. Its deeper teaching is that you are far sturdier than your fear of the storm suggests; the same wind that snaps the rigid branch only bends the living one, and living things are built to bend. The common misunderstanding is that to feel something fully is to be destroyed by it, so we clench and hold our breath against the sky. But a storm weathered is a storm survived, and it always, always passes. Turn toward courage — not the courage that feels no fear, but the kind that stands in the rain and lets it fall, trusting that the roots will hold.",
    shadow: "In shadow, this card shows the storm turned inward or hurled outward — feeling used as a weapon, or a bracing so tight against the wind that the branch snaps where it might have bent.",
    affirm: "I can feel the full force of this and still stand." },
  { id: "the-rainbow", name: "The Rainbow", essence: "Hope · Promise · Reward", hex: "#5aa0c4", message: "Look up, beloved — the rain is passing, and the same light it tried to hide is bending now into color across the sky. This is the promise the storm was keeping all along: that the hardest weather so often breaks into the most beautiful light, and you were never walking through it for nothing.",
    book: "The Rainbow arrives after the weeping, when the storm has spent itself and you are still here — tired, rinsed clean, and quietly amazed to have made it through. Its deeper teaching is that beauty is not the opposite of hardship but often its answer; a rainbow needs both the rain and the sun, and cannot appear until the two have met. The common misunderstanding is that the reward should have come sooner, that you should not have had to weather so much to reach it. But the arc only shows itself to those who stayed until the light returned. Turn toward hope. Let yourself believe the promise written across the clearing sky — that what you endured was not wasted, and that the color was hidden in the light the whole time, waiting for the rain to reveal it.",
    shadow: "In shadow, this card warns against the false rainbow of forced positivity — rushing to the light before the rain has finished, or promising others a sky that has not yet cleared.",
    affirm: "I trust that the hardest weather is bending, even now, toward light." },
  { id: "the-snowfall", name: "The Snowfall", essence: "Rest · Quiet · Stillness", hex: "#dfe6ec", message: "Let the snow fall, beloved, and let it lay its white quilt over everything you thought you had to do today. Not every season is for growing; some are for resting under the cold and the quiet, gathering in the dark the strength that spring will one day ask of you.",
    book: "The Snowfall arrives when you have mistaken rest for laziness and pushed yourself to bloom in a season built for stillness. Its deeper teaching is that winter is not the absence of life but its wisdom — the field lies fallow so that it can feed again, the bear sleeps so that it can wake, and nothing green is being wasted beneath the snow. The common misunderstanding is that stopping means falling behind, that worth must be earned by ceaseless doing. But the earth does its quietest, deepest healing in the cold, and so do you. Turn toward rest. Let the snow fall over your striving, and lie still beneath it without guilt, trusting that the seeds you cannot see are being kept safe until it is truly time to grow.",
    shadow: "In shadow, this card reveals the frozen kind of stillness — rest that has hardened into hiding, a quiet that numbs rather than restores and forgets that spring is meant to come.",
    affirm: "I let myself rest, trusting that stillness is its own kind of growing." },
  { id: "the-wind", name: "The Wind", essence: "Change · Freedom · Listening", hex: "#a8b8a0", message: "You cannot see the wind, beloved, but you can feel it lift the hair from your face and turn the leaves to silver — and change is moving through your life in exactly the same way. Stop bracing against it; unclench your hands and let it carry you somewhere your careful plans never thought to go.",
    book: "The Wind arrives when something is shifting that you cannot name and cannot hold, and every instinct tells you to grip tighter. Its deeper teaching is that freedom begins the moment you stop resisting the unseen — the wind does not ask the tree's permission before it moves, yet the tree that bends lives on, and the one that refuses to sway is the one that cracks. We often mistake change for something being done to us, an enemy rattling the door. But the same wind that scatters also carries seeds to new ground, clears the stale air, and teaches the whole forest to listen. Loosen your grip. Let the change move through you rather than merely past you, and you will find it was never trying to knock you down — only to carry you somewhere your plans could not reach.",
    shadow: "In shadow, this card warns against clutching so tightly at how things were that every gust feels like loss — and against mistaking restlessness for freedom, blown from place to place without ever choosing a direction.",
    affirm: "I stop bracing against the change and let it carry me somewhere new." },
  { id: "the-morning-mist", name: "The Morning Mist", essence: "Mystery · Trust · Patience", hex: "#c3cbc8", message: "The mist has not come to hide your way, beloved — it has come to teach you to trust it. You cannot see the whole road this morning, and you were never meant to; there is just enough clear ground beneath your feet to take one honest step, and the next will show itself once you do.",
    book: "The Morning Mist arrives when the future has gone soft and grey, when you long for a clear view of where all of this is leading and simply cannot find one. Its deeper teaching is that mystery is not the absence of a path — it is the path, revealing itself only as far as you need to walk it. We tend to believe we must see the destination before we dare to move, and so we stand frozen at the edge of the fog, waiting for a certainty that mist was never going to give. But the trail does not vanish in the mist; it only waits to be walked. Take the step you can see. The mist moves as you move, and the road you could not find from standing still will open, patiently, one faithful footfall at a time.",
    shadow: "In shadow, this card warns against freezing at the edge of the fog, demanding total clarity before you will risk a single step — and against filling the unknown with fearful stories the mist itself never told.",
    affirm: "I do not need to see the whole path; I only need to take the next step." },
  { id: "the-thaw", name: "The Thaw", essence: "Forgiveness · Softening · Reawakening", hex: "#9fbcb0", message: "Something in you froze to survive a hard season, beloved, and it has held so still for so long that you forgot it could move at all. Feel the warmth returning now, and let the ice around your heart begin to soften, drop by patient drop, until what was locked away can finally flow again.",
    book: "The Thaw arrives when a part of you that went numb to get through the cold is quietly ready to feel again. Its deeper teaching is that forgiveness — of another, of yourself, of a whole frozen chapter — is not a thing you force but a warmth you allow; the river does not shatter its ice, it simply melts it from within. We often mistake our hardness for strength, believing that to soften is to be wounded all over again. But nothing frozen can grow, and a heart kept locked against the cold is also locked against the spring. Let the warmth in. What melts in you now is not weakness returning — it is life itself, released at last from the ice, remembering how to move.",
    shadow: "In shadow, this card warns against forcing a thaw before its time, cracking yourself open by sheer will — and against clinging to old resentment as armor, choosing the safety of ice over the risk of feeling again.",
    affirm: "I let the frozen places in me soften, and I trust what melts to move again." },
  { id: "the-turning-season", name: "The Turning Season", essence: "Change · Transition · Trust", hex: "#c98a3c", message: "The leaves are turning, beloved, and something you loved is quietly changing its shape. Do not read this as loss — the season is not taking anything from you; it is keeping the oldest promise the Earth ever made, that everything which lets go in its right time will one day be given back to you green.",
    book: "The Turning Season arrives at a threshold — the end of one chapter, the not-yet of the next — when your heart aches for what is passing and fears what is coming. Its deeper teaching is that change is not the world breaking its promise to you but keeping it: the same turning that strips the autumn tree bare is the turning that will clothe it again. We mistake transition for loss because we can see the leaving but not yet the arriving. But no season is the final one; each is a faithful hinge between what was and what will be. Trust the turn. Let the old thing fall when it is truly ready to fall, and you will learn what every orchard knows — that letting go in its right season is not an ending, but the way next year's abundance is made room for.",
    shadow: "In shadow, this card warns against gripping a season long past its time, exhausting yourself to keep summer from turning — and against grieving a change as pure loss when it is only the world making room for what comes next.",
    affirm: "Change is not taking from me; it is the world keeping its faithful promise." },
  { id: "the-mountain", name: "The Mountain", essence: "Patience · Perspective · Perseverance", hex: "#6d7885", message: "The summit is not reached in a single leap, beloved — it is earned one steady step at a time, and the mountain does not mind how slowly you climb, only that you keep climbing. Lift your eyes to how far you have already come, then take the next step; that is the whole quiet secret of every peak.",
    book: "The Mountain arrives when the thing you are working toward feels impossibly high and your legs have grown tired of the climb. Its deeper teaching is that patience is not passive waiting but faithful movement — a mountain is scaled not by heroic bounds but by the humble, unglamorous placing of one foot above the other, again and again and again. We grow discouraged because we keep measuring the distance still left to the summit instead of the ground already beneath us. But the mountain withholds its gift slowly on purpose: only the patient climber earns the high, wide view from which everything that once overwhelmed you finally makes sense. Keep climbing. The perspective you long for cannot be rushed or wished into being — it is waiting, quite certainly, at the pace of your own steady steps.",
    shadow: "In shadow, this card warns against the impatience that would leap the whole climb at once and quits the moment it cannot — and against fixing your eyes so hard on the far summit that the steady progress under your feet goes unseen.",
    affirm: "I climb one patient step at a time, trusting the view is earned this way." },
  { id: "the-rivers-journey", name: "The River's Journey", essence: "Flow · Trust · Movement", hex: "#4d8fa6", message: "You have been swimming so hard against the current, beloved, that you mistook your exhaustion for effort. Let go, and let the river turn you the way it means to go — the water has carried a thousand streams down to the sea without once losing its way, and it surely knows how to carry you too.",
    book: "The River's Journey arrives when you have been straining against the flow of your own life — forcing the timing, gripping the outcome, swimming upstream toward a shore that keeps receding. Its deeper teaching is that trust is itself a kind of movement, not a surrender of it: the river does not fight the bend or curse the rock, it simply moves around them and keeps going, and every mile of that yielding carries it closer to the sea. We confuse control with progress, believing that if we are not struggling, we cannot be getting anywhere. But water reaches the ocean precisely because it stops resisting the shape of the land. Let the current take you. What feels like giving up is so often the very moment life finally begins to carry you — steadily, surely, all the way home to the wider water.",
    shadow: "In shadow, this card warns against the exhausting need to control every turn, mistaking the strain of swimming upstream for the only way forward — and against drifting so passively that flow becomes an excuse never to choose a shore.",
    affirm: "I stop fighting the current and trust the river to carry me to the sea." },
  { id: "the-waterfall", name: "The Waterfall", essence: "Surrender · Power · Release", hex: "#3f7d84", message: "The river reaches the edge and does not cling to the cliff, beloved — it throws itself over in a roar of white and becomes more powerful for the falling. What you have been gripping so tightly is asking to be released; let go, and feel how much strength was hiding inside the surrender.",
    book: "The Waterfall arrives when you have been holding on so hard that your knuckles have forgotten how to open — clutching a plan, a grief, a version of how things were supposed to go. Its deeper teaching is that surrender is not defeat but a kind of power: the water does not lose itself by falling, it gathers force, carves canyons, and thunders louder than any still pool ever could. The common misunderstanding is that letting go means giving up, that release is the same as weakness. But the river does not weaken at the edge — it becomes unstoppable. Turn toward the truth by loosening your grip on the one thing you have been forcing. What is meant to fall will fall; what is truly yours will still be with you at the bottom, roaring and alive.",
    shadow: "In shadow, this card warns of the exhausting refusal to release what is already leaving — clinging to the cliff-edge until your strength is spent — or of a reckless flinging-away of what actually needed to be held.",
    affirm: "I release my grip and trust that letting go is its own kind of strength." },
  { id: "the-open-meadow", name: "The Open Meadow", essence: "Presence · Contentment · Simplicity", hex: "#8fae5d", message: "Set down the long list of what would finally make you happy, beloved, and simply stand in the meadow that is already around you. The grass, the wide sky, the warm ground beneath your feet — everything you need for peace is here in this ordinary, unhurried moment, asking only that you notice it.",
    book: "The Open Meadow spreads before you when your mind has been living somewhere other than where your feet are — rehearsing the future, chasing a fuller life just over the next hill. Its deeper teaching is that contentment is not something you arrive at once everything is finally sorted; it is something you sink into by being wholly present in the plain, sunlit here. The common misunderstanding is that peace requires more — more accomplishment, more certainty, more things — when in truth it usually asks for less. A meadow is not impressive; it is simply enough. Turn toward the truth by lowering yourself into this exact moment as into tall grass. Breathe. Notice how much is already provided. The simple life you keep postponing is quietly waiting for you to stop running through it.",
    shadow: "In shadow, this card warns of the restless hunger that treats every present moment as a mere waiting room for a better one — and so walks through a whole lifetime of meadows without once lying down in the grass.",
    affirm: "Everything I need for peace is already here, and I let this quiet moment be enough." },
  { id: "the-desert", name: "The Desert", essence: "Endurance · Solitude · Inner Resource", hex: "#cf9d5e", message: "This is a dry and lonely stretch, beloved, and no one is coming to carry your water for you — but that is not the cruelty it feels like. The desert is teaching you what you already hold within: the deep, hidden well you did not know you had until the land around you ran empty.",
    book: "The Desert arrives in the seasons that feel barren — when comfort is scarce, company is thin, and you must cross the dry miles largely alone. Its deeper teaching is that emptiness is not the same as lack; the desert strips away everything external so you can finally meet the resources you carry inside. The cactus does not wait for rain to survive; it stores its own water and blooms in the heat. The common misunderstanding is to read the solitude and hardship as punishment, or as proof that you have been abandoned. But the desert is not against you — it is revealing you. Turn toward the truth by asking not what you are missing but what you still, remarkably, have: your endurance, your breath, your own quiet company. You are more self-sufficient than the easy years ever let you know.",
    shadow: "In shadow, this card warns against mistaking a hard, dry season for a permanent verdict on your worth — and against a self-reliance so fierce that you refuse the oasis, and the offered hand, when they finally appear.",
    affirm: "I carry my own water within me, and I can cross the dry places on what I hold." },
  { id: "the-ebb-and-flow", name: "The Ebb and Flow", essence: "Balance · Ebb and Flow · Rhythm", hex: "#6ba3b0", message: "Watch the shore, beloved — the sea reaches out with all its strength, then draws all the way back, and it never once apologizes for the pulling-in. Your life has that same rhythm; the seasons of retreat and rest are not failures of the seasons of giving, but the very tide that makes them possible.",
    book: "The Shoreline appears when you have been trying to live in one direction only — all reaching out, all giving, all high tide, with no permission to withdraw. Its deeper teaching is that everything alive moves in rhythm: the sea cannot pour toward the land forever, and neither can you. Ebb is not the absence of flow; it is its other half, the drawing-back that gathers the water for the next wave. The common misunderstanding is that resting, retreating, and turning inward are lapses to apologize for, when in truth they are as vital and natural as any outward reach. Turn toward the truth by honoring whichever tide you are in. When you are called to give, give fully; when you are called to pull back, let yourself go all the way out. Both belong. The shore keeps its balance by refusing neither.",
    shadow: "In shadow, this card warns of forcing a permanent high tide until you are wrung dry — or of retreating so completely that the water never returns, and the ebb hardens into a shore that has forgotten how to reach.",
    affirm: "I honour the tides of my life, trusting that pulling in is as sacred as reaching out." },
  { id: "the-volcano", name: "The Volcano", essence: "Power · Boundaries · Honoring Anger", hex: "#c0472e", message: "The heat rising in you is not a flaw to be ashamed of, beloved — it is the mountain telling you, in the oldest language there is, that a line has been crossed. Do not swallow the fire back down; listen to what it is trying to protect, and let it show you exactly where your boundary belongs.",
    book: "The Volcano arrives when you have been taught to fear your own anger — to press it down, smooth it over, and call the swallowing being good. Its deeper teaching is that fire is sacred information: it rises precisely where something you value has been trampled, and it names the boundary you have been too gentle to draw. The common misunderstanding is that anger is the opposite of love or peace, a shameful thing to bury. But a mountain that never releases its pressure does not stay calm — it grows dangerous, and one day it breaks in a way no one chose. Turn toward the truth by letting your fire speak before it has to erupt. Honor the heat as a messenger, ask it what line was crossed, and let its power move you to protect what is worth protecting — clearly, and in time.",
    shadow: "In shadow, this card warns of the anger swallowed so long it finally erupts and scorches the innocent — and of the opposite, a temper that flares at every small thing until no one can hear the real line it is trying to name.",
    affirm: "My anger is sacred information, and I let it show me where my boundary belongs." },
  { id: "the-deep-cave", name: "The Deep Cave", essence: "Introspection · Rest · Facing the Dark", hex: "#4b4658", message: "The world has been asking you to keep shining outward, beloved, but the mountain is offering a darker mercy: come inside, into the quiet cave, and rest. Do not be afraid of the dark that waits within you; it is not your enemy but your teacher, holding a wisdom the bright, noisy days could never give.",
    book: "The Deep Cave appears when you have gone as far as the daylight can take you and something in you needs to turn inward — to withdraw from the noise and sit in the honest dark. Its deeper teaching is that not all wisdom lives in the light; some truths only surface in stillness, in rest, in the willingness to face what you have been outrunning. The common misunderstanding is that the darkness within is dangerous, a place to be feared and fled, so you keep the lights on and the schedule full and never go in. But the cave is not a threat — it is a sanctuary, and the things waiting there have been trying to reach you gently all along. Turn toward the truth by giving yourself permission to go quiet and inward. Rest in the dark. Listen. What you meet there has been keeping your deepest wisdom safe.",
    shadow: "In shadow, this card warns against the retreat that curdles into a hiding place, a cave you crawl into and refuse to leave — or against the frightened refusal to go inward at all, staying so busy and bright that your own depths never get to speak.",
    affirm: "I go inward without fear, trusting the quiet dark to teach me what the light could not." },
  { id: "the-valley", name: "The Valley", essence: "Humility · Comfort · Rest", hex: "#7c9464", message: "You have come down from the high, hard places, beloved, and here the ground softens and turns green again. Let the valley do what valleys do — gather the rain, cradle the river, and hold you low and safe until you are ready to climb.",
    book: "The Valley arrives after a descent — a loss, a humbling, a coming-down from something you fought hard to reach — and its deeper teaching is that the low places are not punishment but shelter. Every valley is carved by water seeking rest, and everything green and well-fed grows where the land lies down. The common mistake is to read your lowness as failure, to ache for the summit and despise the ground that is finally holding you. But the mountaintop cannot grow a garden; only the valley, gathering what falls, turns runoff into rivers and grief into soil. So lie down in it. Let yourself be low, be held, be quiet. What you could not force from the heights, the valley will grow in you slowly, patiently, from below.",
    shadow: "In shadow, this card warns of a rest that curdles into hiding — using the valley's comfort to avoid ever climbing again, or mistaking a small, self-diminishing life for true humility.",
    affirm: "I let myself be held low, trusting that green things grow where the land lies down." },
  { id: "the-canyon", name: "The Canyon", essence: "Time · Depth · Wisdom", hex: "#b56a45", message: "The same slow water that wore you down, beloved, is what carved you into something vast and beautiful. Do not resent the years or the wearing — every layer the river opened in you is a story made visible now, a depth that only time and patience could reveal.",
    book: "The Canyon arrives when you are counting the cost of how long something took — how slowly you healed, how many small erosions it took to change you — and its deeper teaching is that depth is never sudden. No canyon was ever cut in a day; it is the work of one patient river returning again and again to the same soft place. What looks like damage from above is, from within, a cathedral of colored stone, every band a season you survived. The common mistake is to want your wisdom quickly and to grieve the years the carving took. But you cannot rush a canyon into being. Trust the slow water. What wears at you now is not ruining you — it is opening you, layer by layer, into something deep enough to hold the light.",
    shadow: "In shadow, this card warns against mistaking mere age for wisdom, or letting old grooves harden into ruts you follow without question — deep is not the same as free.",
    affirm: "I honor the slow water that carved me; my depth is the gift of my patience." },
  { id: "the-living-earth", name: "The Living Earth", essence: "Gratitude · Abundance · Belonging", hex: "#4e8c4a", message: "Look around, beloved: the ground feeds you, the air keeps breathing for you, the whole green world goes on giving without being asked. You are not a stranger here scraping to survive — you are a child of a living, generous Earth that has been holding you since before your first breath.",
    book: "The Living Earth arrives to remind you of what you forget whenever fear makes you small: that you are not alone on a dead rock, bargaining for scraps. You live inside a vast, breathing, generous body — soil that turns death back into bread, rain that arrives without invoice, trees that exhale the very air you need. Its deeper teaching is that belonging is not something you earn; it is the ground you are already standing on. The common mistake is to move through the world as a taker or a trespasser, grasping because you believe there is not enough. But gratitude is simply accurate seeing. Look again. You are fed, you are breathed, you are held. Say thank you not because you should, but because it is true — and watch how much you already have.",
    shadow: "In shadow, this card warns against a gratitude that becomes a demand for endless abundance, or a belonging so passive that you only take from the Earth and forget you were made to give back to it.",
    affirm: "I belong to a living, generous world, and I meet its giving with thanks." },
];

const OracleCardFace = ({ card, label, w = 118, delay = 0, folder = "oracle" }) => {
  const [artOk, setArtOk] = useState(true);
  const h = Math.round(w * 1.62);
  return (
    <div className="fade-up" style={{ animationDelay: `${delay}s`, width: w, textAlign: "center" }}>
      {label && <div className="lum-sans" style={{ fontSize: 10, letterSpacing: ".14em", color: T.dim, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
      <div style={{ position: "relative", width: w, height: h, borderRadius: 12, overflow: "hidden", border: `1.5px solid ${card.hex}88`, boxShadow: `0 10px 28px rgba(0,0,0,.55), 0 0 18px ${card.hex}33`, background: `linear-gradient(165deg, ${card.hex}33, #12101f 70%)` }}>
        {artOk && <img src={`/images/${folder}/${card.id}.webp`} alt={card.name} onError={() => setArtOk(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        {!artOk && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, padding: "0 6px" }}>
            <div style={{ fontSize: 24, color: card.hex }}>✧</div>
            <div className="lum-serif" style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.35 }}>{card.name}</div>
          </div>
        )}
        <div aria-hidden style={{ position: "absolute", inset: 5, borderRadius: 8, border: `1px solid ${card.hex}55`, pointerEvents: "none" }} />
      </div>
    </div>
  );
};

const OracleScreen = ({ paid, askUpgrade, cards = ORACLE_CARDS, comboSet = ORACLE_COMBOS, folder = "oracle", eyebrow = "Oracle Cards", title = "The Luminae deck", intro = "Forty-four cards, born of golden light. Every draw is a true shuffle — the deck is freshly mixed each time, so the card that rises is the one that was meant for this moment.", spreadReason = "The three-card Luminae Oracle spread awaits in Illuminate." }) => {
  const [stage, setStage] = useState("idle"); // idle | shuffling | drawn
  const [drawn, setDrawn] = useState([]);
  const [bookOpen, setBookOpen] = useState({});
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const draw = (n) => {
    if (n === 3 && !paid) return askUpgrade(spreadReason);
    setStage("shuffling"); setDrawn([]); setBookOpen({});
    timer.current = setTimeout(() => { setDrawn(shuffle(cards).slice(0, n)); setStage("drawn"); }, 2000);
  };
  const toggleBook = (id) => {
    if (!paid) return askUpgrade("The Book of Luminae — the deep meaning living inside every card — opens with Illuminate.");
    setBookOpen((b) => ({ ...b, [id]: !b[id] }));
  };
  const combos = drawn.length > 1 ? comboSet.filter((k) => k.pair.every((id) => drawn.some((c) => c.id === id))) : [];
  const labels3 = ["Past", "Present", "Future"];

  return (
    <div className="fade-up" style={{ maxWidth: 560 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H>{title}</H>
      <p className="lum-serif" style={{ color: T.dim, fontSize: 14.5, fontStyle: "italic", lineHeight: 1.7, margin: "10px 0 16px" }}>
        {intro}
      </p>

      {stage === "idle" && (
        <Panel style={{ padding: 24, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
            {[-6, 0, 6].map((d, i) => (
              <div key={i} aria-hidden style={{ width: 64, height: 104, borderRadius: 10, transform: `rotate(${d}deg)`, background: "linear-gradient(165deg, #241f42, #12101f)", border: `1px solid ${T.gold}55`, boxShadow: "0 8px 20px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontSize: 15 }}>✧</div>
            ))}
          </div>
          <div className="lum-serif" style={{ fontSize: 19, color: T.ink, marginBottom: 16 }}>Breathe once, soften your question, and draw.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => draw(1)}>Draw one card ✧</Btn>
            <Btn kind="ghost" onClick={() => draw(3)}>Past · Present · Future {!paid && "🔒"}</Btn>
          </div>
        </Panel>
      )}

      {stage === "shuffling" && (
        <Panel style={{ padding: 34, textAlign: "center" }}>
          <div className="lum-serif gold-shimmer" style={{ fontSize: 21 }}>The cards are listening…</div>
          <div className="lum-sans" style={{ fontSize: 12, color: T.dim, marginTop: 8 }}>shuffling all forty-four, truly at random ✧</div>
        </Panel>
      )}

      {stage === "drawn" && (
        <>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", margin: "6px 0 14px" }}>
            {drawn.map((c, i) => <OracleCardFace key={c.id} card={c} folder={folder} label={drawn.length === 3 ? labels3[i] : null} delay={i * 0.3} />)}
          </div>
          {drawn.map((c, i) => (
            <Panel key={c.id} style={{ padding: 18, marginBottom: 12, borderColor: c.hex + "44" }}>
              <Eyebrow colour={c.hex}>{drawn.length === 3 ? `${labels3[i]} · ` : ""}{c.essence}</Eyebrow>
              <div className="lum-serif" style={{ fontSize: 20, color: T.ink, margin: "2px 0 8px" }}>{c.name}</div>
              <div className="lum-serif" style={{ fontSize: 15, color: T.dim, lineHeight: 1.7, fontStyle: "italic" }}>{c.message}</div>
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <SpeakBtn text={`${c.name}. ${c.message}`} />
                <Btn kind="ghost" small onClick={() => toggleBook(c.id)}>📖 {bookOpen[c.id] ? "Close the Book" : "Open the Book of Luminae"}{!paid && " 🔒"}</Btn>
              </div>
              {bookOpen[c.id] && (
                <div className="fade-up" style={{ marginTop: 14, padding: "16px 18px", borderRadius: 12, background: "rgba(13,13,26,.55)", border: `1px solid ${c.hex}33` }}>
                  <Eyebrow colour={c.hex}>From the Book of Luminae</Eyebrow>
                  <div className="lum-serif" style={{ fontSize: 14.5, color: T.dim, lineHeight: 1.8, marginTop: 8 }}>{c.book}</div>
                  <div className="lum-sans" style={{ fontSize: 12.5, color: T.faint, lineHeight: 1.7, marginTop: 12 }}><b style={{ color: c.hex }}>In shadow · </b>{c.shadow}</div>
                  <div className="lum-serif" style={{ fontSize: 14.5, color: T.goldHi, fontStyle: "italic", marginTop: 12 }}>“{c.affirm}”</div>
                </div>
              )}
            </Panel>
          ))}
          {combos.map((k) => (
            <Panel key={k.pair.join("+")} style={{ padding: 18, marginBottom: 12, borderColor: T.goldHi + "44", background: "radial-gradient(120% 150% at 50% -20%, #241f42 0%, #12101f 60%)" }}>
              <Eyebrow colour={T.goldHi}>When these cards rise together</Eyebrow>
              <div className="lum-serif" style={{ fontSize: 19, color: T.ink, margin: "2px 0 4px" }}>{k.name}</div>
              <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginBottom: 8 }}>{k.pair.map((id) => ORACLE_CARDS.find((c) => c.id === id).name).join(" ✧ ")}</div>
              <div className="lum-serif" style={{ fontSize: 14.5, color: T.dim, fontStyle: "italic", lineHeight: 1.7 }}>{k.meaning}</div>
            </Panel>
          ))}
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <Btn kind="ghost" small onClick={() => { setStage("idle"); setDrawn([]); setBookOpen({}); }}>Return the cards ✧</Btn>
          </div>
        </>
      )}
    </div>
  );
};

/* ============================================================
   CRYSTAL GUIDE
   ============================================================ */
/* ---- module-level helpers (place just above CrystalScreen) ---- */
const crystalSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const CRYSTAL_PROPS = ["Protection", "Love", "Abundance", "Calm", "Sleep", "Grounding", "Clarity", "Intuition", "Courage", "Healing", "Communication", "Prosperity"];

/* A crystal's gem: shows /images/crystals/<slug>.webp when it exists, else a
   luminous coloured placeholder in the stone's own colour (photos drop in later). */
const CrystalGem = ({ c, size = 46 }) => {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div aria-hidden style={{ width: size, height: size, borderRadius: "50%", position: "relative", overflow: "hidden", flexShrink: 0,
      background: `radial-gradient(circle at 34% 28%, #ffffffcc, ${c.hex} 44%, ${c.hex}aa 76%, #0c0a16)`,
      border: `1px solid ${c.hex}88`, boxShadow: `0 0 12px ${c.hex}55` }}>
      {imgOk && <img src={`/images/crystals/${crystalSlug(c.name)}.webp`} alt="" onError={() => setImgOk(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      {!imgOk && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, color: "#ffffffcc", textShadow: "0 1px 3px rgba(0,0,0,.4)" }}>💎</div>}
    </div>
  );
};

const CrystalScreen = ({ paid, askUpgrade }) => {
  const [mood, setMood] = useState(null);
  const [rec, setRec] = useState(""); const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [prop, setProp] = useState(null);
  const [open, setOpen] = useState(null);
  const [deepOpen, setDeepOpen] = useState(false); // full crystal-bible entry within the open card
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

  const q = query.trim().toLowerCase();
  const filtered = CRYSTALS.filter((c) => {
    if (prop && !c.keywords.some((k) => k.toLowerCase().includes(prop.toLowerCase()))) return false;
    if (!q) return true;
    const hay = [c.name, c.colour, c.chakra, c.element, c.zodiac, c.use, c.meaning, c.keywords.join(" ")].join(" ").toLowerCase();
    return hay.includes(q);
  }).sort((a, b) => a.name.localeCompare(b.name));
  const clearSearch = () => { setQuery(""); setProp(null); };

  return (
    <div className="fade-up" style={{ maxWidth: 620 }}>
      <Eyebrow colour={T.sage}>Crystal Guide</Eyebrow>
      <H>Allies of the Earth</H>

      <Panel style={{ margin: "16px 0", padding: 20, borderColor: T.sage + "44" }}>
        <div className="lum-sans" style={{ fontSize: 11, color: T.sage, letterSpacing: ".18em", marginBottom: 8 }}>TODAY'S CRYSTAL</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <CrystalGem c={daily} size={54} />
          <div>
            <div className="lum-serif" style={{ fontSize: 24, color: T.ink }}>{daily.name}</div>
            <div className="lum-sans" style={{ fontSize: 12, color: T.gold, marginTop: 2 }}>{daily.chakra} chakra · {daily.pair}</div>
          </div>
        </div>
        <div className="lum-sans" style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.65, marginTop: 10 }}>{daily.meaning}</div>
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

      <Eyebrow colour={T.sage}>The Library · {CRYSTALS.length} crystals</Eyebrow>
      <p className="lum-sans" style={{ color: T.dim, fontSize: 12.5, lineHeight: 1.6, margin: "6px 0 2px" }}>✧ Tap any crystal to open its meaning — then <b style={{ color: T.sage }}>“read the full entry”</b> to dive into its origins, history and deeper properties.</p>

      {/* Search by name or property */}
      <div style={{ position: "relative", margin: "10px 0 10px" }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or property — amethyst, protection, sleep…"
          className="lum-sans" style={{ ...inp, width: "100%", paddingRight: 34 }} />
        {(query || prop) && <button onClick={clearSearch} aria-label="Clear search" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.dim, fontSize: 18, cursor: "pointer" }}>✕</button>}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {CRYSTAL_PROPS.map((p) => {
          const on = prop === p;
          return (
            <button key={p} onClick={() => setProp(on ? null : p)} className="lum-sans" style={{
              background: on ? "rgba(142,201,160,.2)" : "rgba(233,230,242,.05)",
              border: `1px solid ${on ? T.sage : "rgba(233,230,242,.14)"}`,
              color: on ? T.sage : T.dim, borderRadius: 15, padding: "5px 11px", fontSize: 11.5, cursor: "pointer",
            }}>{p}</button>
          );
        })}
      </div>
      <div className="lum-sans" style={{ fontSize: 11.5, color: T.faint, marginBottom: 10 }}>
        {filtered.length === CRYSTALS.length ? `Showing all ${CRYSTALS.length}` : `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`}
        {prop && ` · ${prop}`}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 10 }}>
        {filtered.map((c) => {
          const isOpen = open === c.name;
          return (
            <Panel key={c.name} hover onClick={() => { setOpen(isOpen ? null : c.name); setDeepOpen(false); }} style={{ padding: 14, gridColumn: isOpen ? "1 / -1" : "auto", borderColor: c.hex + (isOpen ? "77" : "33"), background: isOpen ? `radial-gradient(130% 150% at 0% 0%, ${c.hex}1c, transparent 55%), linear-gradient(165deg, #16152b, #0e0e1b)` : undefined, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CrystalGem c={c} size={isOpen ? 60 : 40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lum-serif" style={{ fontSize: 16.5, color: T.ink }}>{c.name}</div>
                  <div className="lum-sans" style={{ fontSize: 10.5, color: T.gold, marginTop: 2 }}>{c.chakra} · {c.pair}</div>
                  {!isOpen && <div className="lum-sans" style={{ fontSize: 11, color: T.dim, lineHeight: 1.5, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{c.use}</div>}
                </div>
              </div>
              {isOpen && (
                <div className="fade-up" style={{ marginTop: 12 }}>
                  <div className="lum-serif" style={{ fontSize: 14.5, color: T.dim, lineHeight: 1.8 }}>{c.meaning}</div>
                  <div className="lum-sans" style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.7, marginTop: 12 }}><b style={{ color: c.hex }}>How to work with it · </b>{c.work}</div>
                  <div className="lum-serif" style={{ fontSize: 14, color: T.goldHi, fontStyle: "italic", marginTop: 12 }}>“{c.affirm}”</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
                    {c.keywords.map((k) => (
                      <button key={k} onClick={(e) => { e.stopPropagation(); setProp(k); setQuery(""); setOpen(null); }} className="lum-sans"
                        style={{ background: "rgba(142,201,160,.1)", border: `1px solid ${T.sage}44`, color: T.sage, borderRadius: 13, padding: "3px 9px", fontSize: 10.5, cursor: "pointer" }}>{k}</button>
                    ))}
                  </div>
                  <div className="lum-sans" style={{ fontSize: 11, color: T.faint, marginTop: 12, lineHeight: 1.7 }}>
                    <b style={{ color: T.dim }}>Colour</b> {c.colour} &nbsp;·&nbsp; <b style={{ color: T.dim }}>Element</b> {c.element} &nbsp;·&nbsp; <b style={{ color: T.dim }}>Zodiac</b> {c.zodiac}
                  </div>
                  {c.deep && (
                    <div style={{ marginTop: 14 }}>
                      <Btn small kind="ghost" onClick={(e) => { e.stopPropagation(); setDeepOpen(!deepOpen); }} style={{ borderColor: c.hex + "66", color: c.hex }}>
                        {deepOpen ? "Close the full entry ✧" : "📖 Read the full entry ✧"}
                      </Btn>
                      {deepOpen && (
                        <div className="fade-up" style={{ marginTop: 14, display: "grid", gap: 14 }}>
                          {[["Origins & formation", c.deep.origin], ["Through history & lore", c.deep.lore], ["For the heart & mind", c.deep.mind], ["For the spirit", c.deep.spirit], ["For the body", c.deep.body], ["Cleansing & charging", c.deep.care]].map(([h, t]) => (
                            <div key={h}>
                              <div className="lum-sans" style={{ fontSize: 10.5, color: c.hex, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>{h}</div>
                              <div className="lum-serif" style={{ fontSize: 14, color: T.dim, lineHeight: 1.8 }}>{t}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Panel>
          );
        })}
        {filtered.length === 0 && (
          <div className="lum-serif" style={{ gridColumn: "1 / -1", textAlign: "center", color: T.dim, fontStyle: "italic", padding: "24px 0" }}>
            No crystal matches “{query || prop}”. Try another name or property.
          </div>
        )}
      </div>

      <p className="lum-sans" style={{ color: T.faint, fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>To cleanse: moonlight, selenite, sound, or smoke. To charge: sunlight (briefly), intention, or the full moon. {moonPhase().name === "Full Moon" ? "✨ The moon is full tonight — a perfect time to charge your stones." : ""}</p>
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
        <Panel hover onClick={() => go("oracle")} style={{ marginBottom: 14, padding: "15px 18px", borderColor: T.violet + "44", background: "linear-gradient(160deg, #1d1633, #0e0e1c)" }}>
          <Eyebrow colour={T.violet}>Oracle Cards · Free</Eyebrow>
          <div className="lum-serif" style={{ fontSize: 21, color: T.ink }}>Draw from the Luminae deck</div>
          <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 4 }}>Forty-four cards, truly shuffled — pull one whenever your heart asks ✧</div>
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
          <Panel hover onClick={() => go("quotes")} style={{ padding: 16, borderColor: T.gold + "33" }}>
            <Eyebrow colour={T.gold}>Inspirational Quotes</Eyebrow>
            <div className="lum-serif" style={{ fontSize: 19, color: T.ink }}>🕯️ Turn a card</div>
            <div className="lum-sans" style={{ fontSize: 11.5, color: T.dim, marginTop: 4 }}>Draw a little light — anytime</div>
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
  { id: "oracle", name: "Oracle Cards", icon: "🔮", note: "The Luminae deck · truly shuffled · Free", free: true },
  { id: "fairyoracle", name: "Fairy Oracle", icon: "🧚", note: "44 enchanted fairy cards · truly shuffled · Free", free: true },
  { id: "oceanoracle", name: "Whispers of the Deep", icon: "🌊", note: "22 ocean cards · mermaids & sea life · Free", free: true },
  { id: "gaiaoracle", name: "Gaia Oracle", icon: "🌍", note: "33 nature cards · elements & seasons · Free", free: true },
  { id: "quotes", name: "Inspirational Quotes", icon: "🕯️", note: "Turn a card for a little light · Free", free: true },
  { id: "astrology", name: "Astrology", icon: "♒", note: "Weekly horoscope & natal chart" },
  { id: "numerology", name: "Numerology", icon: "7", note: "Life Path, Destiny, Soul Urge…" },
  { id: "angelnumbers", name: "Angel Numbers", icon: "🔢", note: "111 · 444 · 1111 — what your angels mean · Free", free: true },
  { id: "soul", name: "Soul Type Profile", icon: "✨", note: "Blue Ray · Indigo · Starseed…" },
  { id: "dreams", name: "Dream Journal", icon: "🌙", note: "Conversational interpretation" },
  { id: "meditate", name: "Guided Meditation", icon: "🧘", note: "Violet Flame, Gold Light & more" },
  { id: "crystals", name: "Crystal Guide", icon: "💎", note: "Daily crystal & full library" },
  { id: "iris", name: "Iris Reading", icon: "👁", note: "Iridology wellness portrait" },
  { id: "palm", name: "Palm Reading", icon: "🖐", note: "Heart, head, life & fate lines" },
];

// FREE PREVIEW: unlock everything during the testing/feedback phase.
// Flip to false to re-enable the paywall when it's time to monetise.
const FREE_PREVIEW = true;

export default function Luminae() {
  const [screen, setScreen] = useState("home");
  const [tier, setTier] = useState("seeker");
  const [devPreview, setDevPreview] = useState(() => { try { return new URLSearchParams(window.location.search).has("preview"); } catch (e) { return false; } });
  const [firstOpen, setFirstOpen] = useState(true);
  const [ritual, setRitual] = useState(null); // pending callback
  const [upgrade, setUpgrade] = useState(null);
  const [interstitial, setInterstitial] = useState(false);
  const [deckId, setDeckId] = useState("classic");
  const [birth, setBirth] = useState({ dob: "", time: "", place: "" });
  const [journal, setJournal] = useState([]);
  const [updateReady, setUpdateReady] = useState(false);
  const engine = useMemo(() => createAudioEngine(), []);
  const paid = FREE_PREVIEW || tier !== "seeker";

  const requestRitual = useCallback((cb) => setRitual(() => cb), []);
  const askUpgrade = useCallback((reason) => setUpgrade(reason), []);
  const onAfterReading = useCallback(() => { if (tier === "seeker") setTimeout(() => setInterstitial(true), 1200); }, [tier]);
  const go = (id) => {
    try { if (id !== screen) window.history.pushState({ screen: id }, ""); } catch (e) {}
    setScreen(id);
  };

  // Back gesture / browser Back steps one screen back instead of leaving the site.
  useEffect(() => {
    try { window.history.replaceState({ screen: "home" }, ""); } catch (e) {}
    const onPop = (e) => setScreen((e.state && e.state.screen) || "home");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Auto-update: notice when a newer build is deployed and offer a one-tap refresh,
  // so a cached tab never sticks on an old version.
  useEffect(() => {
    let current = null;
    try { const s = document.querySelector('script[type="module"][src*="/assets/index-"]'); current = s && s.getAttribute("src"); } catch (e) {}
    if (!current) return;
    let stopped = false;
    const check = async () => {
      try {
        const r = await fetch("/", { cache: "no-store" });
        const html = await r.text();
        const m = html.match(/\/assets\/index-[\w-]+\.js/);
        if (m && m[0] !== current && !stopped) setUpdateReady(true);
      } catch (e) {}
    };
    const onVis = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", check);
    const iv = setInterval(check, 90000);
    check();
    return () => { stopped = true; document.removeEventListener("visibilitychange", onVis); window.removeEventListener("focus", check); clearInterval(iv); };
  }, []);

  const screenEl = {
    home: <HomeScreen tier={tier} go={go} requestRitual={requestRitual} deckId={deckId} onAfterReading={onAfterReading} />,
    tarot: <TarotScreen paid={paid} deckId={deckId} setDeckId={setDeckId} requestRitual={requestRitual} askUpgrade={askUpgrade} onAfterReading={onAfterReading} />,
    sounds: <SoundScreen paid={paid} askUpgrade={askUpgrade} engine={engine} />,
    angels: <AngelScreen paid={paid} askUpgrade={askUpgrade} />,
    astrology: <AstrologyScreen paid={paid} askUpgrade={askUpgrade} birth={birth} setBirth={setBirth} />,
    numerology: <NumerologyScreen paid={paid} askUpgrade={askUpgrade} birth={birth} setBirth={setBirth} />,
    angelnumbers: <AngelNumberScreen paid={paid} askUpgrade={askUpgrade} />,
    soul: <SoulScreen paid={paid} askUpgrade={askUpgrade} />,
    dreams: <DreamScreen paid={paid} askUpgrade={askUpgrade} journal={journal} setJournal={setJournal} />,
    meditate: <MeditationScreen paid={paid} askUpgrade={askUpgrade} engine={engine} />,
    quotes: <QuotesScreen />,
    oracle: <OracleScreen paid={paid} askUpgrade={askUpgrade} />,
    fairyoracle: <OracleScreen paid={paid} askUpgrade={askUpgrade} cards={FAIRY_CARDS} comboSet={[]} folder="fairy" eyebrow="Fairy Oracle" title="The Fairy Oracle" intro="Forty-four enchanted fairy cards, painted in moonlight — flowers, fireflies, and winged folk. Every draw is a true shuffle, so the fairy who steps forward is the one meant for this moment." spreadReason="The three-card Fairy Oracle spread awaits in Illuminate." />,
    oceanoracle: <OracleScreen paid={paid} askUpgrade={askUpgrade} cards={OCEAN_CARDS} comboSet={[]} folder="ocean" eyebrow="Whispers of the Deep" title="Whispers of the Deep" intro="Twenty-two cards from the ocean realm — mermaids, dolphins, whales, otters and the tides. Every draw is a true shuffle, so the whisper that surfaces is the one meant for this moment." spreadReason="The three-card ocean spread awaits in Illuminate." />,
    gaiaoracle: <OracleScreen paid={paid} askUpgrade={askUpgrade} cards={GAIA_CARDS} comboSet={[]} folder="gaia" eyebrow="Gaia Oracle" title="The Gaia Oracle" intro="Thirty-three cards of the living Earth — the sun and moon, the seasons and storms, trees, rivers and mountains. Every draw is a true shuffle, so the whisper of nature that rises is the one meant for this moment." spreadReason="The three-card Gaia spread awaits in Illuminate." />,
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
          {devPreview && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(201,168,76,.2)" }}>
              <div className="lum-sans" style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold, marginBottom: 9 }}>Owner preview · not shown to visitors</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {["seeker", "oracle", "illuminate"].map((t) => (
                  <Btn key={t} small kind={tier === t ? undefined : "ghost"} onClick={() => setTier(t)} style={{ textTransform: "capitalize" }}>{t}</Btn>
                ))}
              </div>
              <div className="lum-sans" style={{ fontSize: 10.5, color: T.faint, marginTop: 9, lineHeight: 1.5 }}>Switch tier to unlock &amp; test paid features. Tap the version badge (top-right) 5× to hide this.</div>
            </div>
          )}
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
      <VersionBadge onReveal={() => setDevPreview((v) => !v)} />
      {screen !== "home" && <HomeBtn onClick={() => go("home")} />}
      {updateReady && (
        <div role="button" tabIndex={0} onClick={() => window.location.reload()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") window.location.reload(); }}
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "linear-gradient(90deg,#c9a84c,#e7d08a)", color: "#171728", textAlign: "center", padding: "9px 16px", cursor: "pointer", fontSize: 12.5, fontWeight: 600, letterSpacing: ".02em", boxShadow: "0 2px 14px rgba(0,0,0,.4)" }}>
          ✨ A new version of Luminae is ready — tap to refresh
        </div>
      )}
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
