# Luminae Oracle — fast artwork pipeline 🎨

The angels took ages because every image was its own project: new prompt, new style
decisions, new post-processing. This kit removes all three bottlenecks:

1. **One locked style block** (below) — paste it unchanged for every card, so the whole
   deck matches automatically and you never re-engineer the look.
2. **Ready-made subject lines** — one per card, each written so the *meaning of the card
   is visible in the picture* (the light, the posture, the moment — not just a pretty scene).
3. **Claude does all post-processing** — generate at any size, save with any filename,
   drop the raws into `assets/reference/oracle-raw/` (or the Shared_Oracle Drive) and say
   the word: cropping to 832×1344, webp conversion, renaming, filing, deploying is automatic.

**Batch tip:** do all 12 in one sitting with the same tool and settings — generate 2–4
variations per card, pick winners at the end, don't perfect as you go. What took a
week for 7 angels can be an afternoon for 12 cards.

---

## The locked style block (paste this into every prompt)

> Ethereal sacred digital painting, luminous golden-hour glow on deep midnight
> background, rich jewel tones, soft radiant light, intricate painterly detail,
> serene mystical atmosphere, oracle card composition, portrait orientation 2:3.25,
> soft vignette toward the edges, no text, no lettering, no watermark, no border

## The 12 subject lines (style block + one of these)

| Card | Subject prompt (meaning made visible) |
|---|---|
| **The Golden Dawn** (`golden-dawn.webp`) | first thin line of dawn breaking over misty violet hills, a single golden sunbeam touching a tiny glowing seedling on a dark meadow, the whole sky still night except that one growing band of gold — hope arriving softly, accent colour warm gold #e3b54a |
| **The Moonlit Path** (`moonlit-path.webp`) | a winding stepping-stone path through a dark enchanted forest, only the next single stone illuminated by a shaft of silver-blue moonlight, the rest of the road dissolving into soft mist, a full moon veiled by gentle clouds — trust in the unseen way, accent colour moon-blue #9cb8ee |
| **The Sacred Pause** (`sacred-pause.webp`) | a serene figure resting beneath a great ancient tree beside still water at dusk, eyes closed, utterly at peace, sage-green fireflies drifting, a winter field softly glowing beyond — holy stillness, nothing striving, accent colour sage #8fb8a8 |
| **The Rising Phoenix** (`rising-phoenix.webp`) | a magnificent phoenix mid-rise from a bed of soft glowing embers, wings unfurling upward in ember-orange and gold flame, ash transforming into drifting sparks of light, expression serene not fierce — rebirth without shame, accent colour ember #e07a5f |
| **The Open Heart** (`open-heart.webp`) | gentle hands open at the centre of the frame receiving a radiant rose-gold heart of light descending from above, soft pink luminous petals swirling, warm light flooding toward the viewer — receiving, not giving, accent colour rose #d489a0 |
| **The Quiet Voice** (`quiet-voice.webp`) | a peaceful figure in soft lilac robes with a hand over the heart, head slightly bowed and listening, one small steady flame of white-violet light glowing at the chest while a storm of faint grey whispers fades harmlessly around the edges — inner knowing beneath the noise, accent colour lilac #b7a8e0 |
| **The Guardian's Wing** (`guardians-wing.webp`) | one immense cobalt-blue angel wing curved protectively over a small sleeping traveller by a night road, feathers glowing with starlight at the tips, the space beneath the wing warm and golden while gentle rain falls beyond — being held, accent colour cobalt #3b6fd4 |
| **The River's Surrender** (`rivers-surrender.webp`) | an aqua-turquoise river winding in luminous bends through a twilight valley toward a distant glowing sea, a single empty rowboat drifting peacefully mid-current with its oar shipped, lanterns of light on the water — trust in the flow, accent colour aqua #7fd4e0 |
| **The Inner Flame** (`inner-flame.webp`) | cupped hands sheltering a small brilliant amber flame in a dark space, the flame casting growing golden light onto the face of an unseen figure leaning in to breathe on it, sparks beginning to rise — courage being fed, accent colour amber #ecb14c |
| **The Star Seed** (`star-seed.webp`) | a luminous violet seed of starlight descending from a swirling galaxy toward open ground below, a faint thread of light connecting seed to stars, small glowing sprouts where earlier seeds have landed — purpose remembering itself, accent colour violet #b898e8 |
| **The Healing Waters** (`healing-waters.webp`) | a tranquil teal spring pool in a moonlit grotto, soft glowing water gently flowing over old cracked stones and mending them with seams of light like kintsugi, steam rising as soft mist — mercy as medicine, accent colour teal #6fc3b0 |
| **The Infinite Thread** (`infinite-thread.webp`) | a single golden thread of light weaving through a night landscape, connecting a lit window, a flying dove, distant figures walking toward each other, and rising up into a web of stars — everything connected, nothing random, accent colour golden #c9a84c |

---

## How many cards does a deck need?

- **Oracle decks:** anything goes, but **44 is the beloved classic** (36–48 is the
  normal range). Luminae's code takes any number — the deck is just a list, so we can
  **grow in waves**: 12 now (live already), +8 whenever art is ready, land at 44 over time.
  Each new card needs: artwork + name + essence + message + book entry (Claude drafts
  the words, you approve).
- **Tarot decks:** fixed at **78** (22 majors + 56 minors). That's why the tarot uses
  generative card faces (now much fancier) rather than waiting on 78 × 8 decks of
  paintings. If you ever want painted tarot, do ONE deck's 22 majors first — the app
  could show painted majors and keep generative minors.
