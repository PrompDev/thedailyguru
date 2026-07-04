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

Card names, essences and messages live in `src/Luminae.jsx` (`ORACLE_CARDS`) —
tweak the words there anytime.
