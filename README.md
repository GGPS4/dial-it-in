# Dial It In

Type a song and get Positive Grid **Spark 1 (Spark 40)** app settings that match the recorded guitar tone. Each part of the song (rhythm, lead, solo, clean) gets its own settings, retuned for the guitar you're actually playing.

## How a song is found

1. **Setlist**: songs dialed in by hand, part by part (`songs.js`).
2. **Artist rig**: if the song isn't on the setlist, [MusicBrainz](https://musicbrainz.org) identifies the artist and year, and the site uses that artist's known rig (`artists.js`).
3. **Claude (optional)**: when no rig profile exists, the site can ask Claude using your own Anthropic API key. The key is stored only in your browser and sent only to `api.anthropic.com`. Answers are cached locally.
4. **Genre estimate**: without a key, the artist's MusicBrainz genre and the decade pick a template (`genres.js`).

## Spark 1 rules the data follows

- Two 4" full-range speakers, so Treble rarely goes past 6 and Bass rarely past 5.5.
- Spark models saturate early, so gain sits well below what most ToneCloud presets use.
- Mids stay at 5 or above unless the record is truly scooped.
- Only Spark 1 models are used, including the July 2021 gear drop (ODS 50, Blues Boy, Insane 6508, Clone Drive, Guitar EQ, Bass EQ).

## Adding songs

Tone strings are compact: the amp model and Gain Bass Mid Treble Master come first, then each effect by slot.

```js
S('Song', 'Artist', 1991, 'Guitar on the record', 'H', [
  P('Rhythm', 'Verses', 'bridge', 'Plexiglas 6 5 6.5 5 7; drv Tube Drive 1 5 7; rev Room Studio B 2 3'),
]),
```

Slot keywords: `gate`, `cmp`, `drv`, `mod`, `dly`, `rev`. Delay times can be written in ms (`dly Digital Delay 2.5 380ms 3`).

Pickup codes: `S` single coil, `T` Tele bridge, `P` P-90, `F` Filter'Tron, `H` PAF humbucker, `HH` hot humbucker, `A` active, `AC` acoustic.

Not affiliated with Positive Grid. Gear names identify the gear each model is based on.
