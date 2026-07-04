# Luminae Oracle deck — artwork slots

Drop a card's artwork in this folder and it appears in the app automatically —
no code changes needed. Until a file exists, the app shows an elegant gradient
placeholder, so the deck works either way.

**Format:** portrait `.webp`, roughly 2:3.25 ratio (e.g. 832 × 1344 px), ideally
under ~600 KB — same style pipeline as the angel portraits in `images/angels/`.

**Exact filenames the app looks for** (card · accent colour · essence):

| File | Card | Accent | Essence |
|---|---|---|---|
| `golden-dawn.webp` | The Golden Dawn | `#e3b54a` gold | Beginnings · Hope · First light |
| `moonlit-path.webp` | The Moonlit Path | `#9cb8ee` moon blue | Intuition · Trust · The unseen way |
| `sacred-pause.webp` | The Sacred Pause | `#8fb8a8` sage | Rest · Stillness · Permission |
| `rising-phoenix.webp` | The Rising Phoenix | `#e07a5f` ember | Rebirth · Release · Becoming |
| `open-heart.webp` | The Open Heart | `#d489a0` rose | Love · Receiving · Softness |
| `quiet-voice.webp` | The Quiet Voice | `#b7a8e0` lilac | Inner knowing · Discernment |
| `guardians-wing.webp` | The Guardian's Wing | `#3b6fd4` cobalt | Protection · Safety · Being held |
| `rivers-surrender.webp` | The River's Surrender | `#7fd4e0` aqua | Letting go · Flow · Trust |
| `inner-flame.webp` | The Inner Flame | `#ecb14c` amber | Courage · Creation · Vitality |
| `star-seed.webp` | The Star Seed | `#b898e8` violet | Purpose · Destiny · Remembering |
| `healing-waters.webp` | The Healing Waters | `#6fc3b0` teal | Forgiveness · Gentleness · Mending |
| `infinite-thread.webp` | The Infinite Thread | `#c9a84c` golden thread | Connection · Synchronicity · Grace |
| `full-cup.webp` | The Full Cup | `#eac66a` honey gold | Gratitude · Thanksgiving · Enough |
| `endless-field.webp` | The Endless Field | `#a9c46c` green-gold | Abundance · Provision · Plenty |
| `walled-garden.webp` | The Walled Garden | `#b5566a` garnet | Boundaries · The Sacred No · Sovereignty |
| `ripening-bough.webp` | The Ripening Bough | `#d8956a` terracotta | Patience · Divine Timing · The Slow Ripening |
| `tender-dark.webp` | The Tender Dark | `#6a72c0` deep indigo | Grief · Mourning · Honoring Loss |
| `true-face.webp` | The True Face | `#5fb98f` clear jade | Authenticity · The True Face · Being Seen |
| `unweighed-gold.webp` | The Unweighed Gold | `#e6cfa0` champagne | Enoughness · Worth · Wholeness |
| `ringing-bell.webp` | The Ringing Bell | `#a8c4d4` silver-blue | Presence · The Eternal Now · Arriving |
| `guest-at-the-door.webp` | The Guest at the Door | `#7a5c9e` deep plum | Shadow · Integration · Welcoming the Exiled |
| `elder-tree.webp` | The Elder Tree | `#c39a5a` antique bronze | Wisdom · The Inner Elder · Lived Knowing |
| `long-table.webp` | The Long Table | `#e0925c` hearth orange | Belonging · Community · You Are Not Alone |
| `company-of-one.webp` | The Company of One | `#7d94c8` slate blue | Solitude · Sacred Aloneness · Belonging to Self |
| `doorway-between.webp` | The Doorway Between | `#9d7cc0` twilight violet | Threshold · Transition · The Sacred In-Between |
| `unseen-hold.webp` | The Unseen Hold | `#4a76c8` sapphire | Faith · Trust Before Proof · The Unseen Holding You |
| `first-time-again.webp` | The First Time Again | `#74c8dd` starlit cyan | Wonder · Awe · The Astonished Ordinary |
| `worn-step.webp` | The Worn Step | `#e8a94e` candle amber | Devotion · Practice · Faithfulness |
| `turning-wheel.webp` | The Turning Wheel | `#cc8a55` copper | Cycles · Seasons · Turning |
| `ancestral-ground.webp` | The Ancestral Ground | `#c07a4e` warm sienna | Home · Roots · Lineage |
| `living-temple.webp` | The Living Temple | `#d68c86` rose clay | Embodiment · Presence · The Body's Wisdom |
| `waking-dream.webp` | The Waking Dream | `#b0a2e2` dream lilac | Vision · Dreams · Possibility |
| `watchfire.webp` | The Watchfire | `#e2664e` flame red | Righteous Anger · Fierce Love · Sacred Protection |
| `cleansing-rain.webp` | The Cleansing Rain | `#8fb4dd` rain blue | Release · Tears · Catharsis |
| `skipping-stone.webp` | The Skipping Stone | `#f0c862` sunlit yellow | Play · Lightness · Whimsy |
| `long-road.webp` | The Long Road | `#c66a4a` deep ember | Perseverance · Endurance · Steadfastness |
| `last-sheaf.webp` | The Last Sheaf | `#d4a94c` harvest gold | Completion · Endings · Fruition |
| `daring-yes.webp` | The Daring Yes | `#5a6cc0` cosmic indigo | Daring · Courage · The Unknown |
| `tended-garden.webp` | The Tended Garden | `#8fc890` spring green | Self-Nourishment · Replenishment · Tending |
| `open-cage.webp` | The Open Cage | `#6fb0e0` open-sky blue | Freedom · Liberation · Unbinding |
| `uncaged-word.webp` | The Uncaged Word | `#56c2c0` bright turquoise | Expression · Voice · Truth Spoken |
| `widening-circle.webp` | The Widening Circle | `#dcb45e` golden wheat | Generosity · Overflow · Giving |
| `wild-gladness.webp` | The Wild Gladness | `#f2a65a` coral gold | Joy · Delight · Permission |
| `low-lintel.webp` | The Low Lintel | `#9db884` soft moss | Humility · Teachability · Reverence |

Card names, essences and messages live in `src/Luminae.jsx` (`ORACLE_CARDS`) —
tweak the words there anytime.
