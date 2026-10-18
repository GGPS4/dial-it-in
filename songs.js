// Hand-dialed song recalls for the Spark 1. Each part is its own preset.
// pu = the pickup type on the recording, pos = pickup position used.
const P = (name, when, pos, tone, tip = '') => ({ name, when, pos, tone, tip });
const S = (title, artist, year, guitar, pu, parts, extra = {}) => ({ title, artist, year, guitar, pu, parts, ...extra });

export const SONGS = [
  S('Purple Haze', 'Jimi Hendrix', 1967, 'Fender Stratocaster', 'S', [
    P('Riff & verses', 'Main riff, verses', 'bridge', 'Plexiglas 5 5 6.5 5.5 7; drv Fuzz Face 7 6; rev Room Studio A 2 3', 'The Fuzz Face cleans up a lot when you roll back the guitar volume. Hendrix rode it constantly.'),
    P('Solo', 'Octave-fuzz solo', 'neck', 'Plexiglas 5.5 5 7 5 7; drv Fuzz Face 8.5 6.5; rev Room Studio A 2 3', 'The Spark has no Octavia, so play near the neck with the tone rolled to 7 for the closest feel.'),
  ]),
  S('Little Wing', 'Jimi Hendrix', 1967, 'Fender Stratocaster', 'S', [
    P('Intro chord melody', 'Intro & verses', 'neck', 'Plexiglas 2.5 5 6 5.5 6; mod UniVibe 2 3 5; rev Room Studio B 3 4', 'On the record a Leslie cabinet adds the shimmer. A slow UniVibe at low intensity is the closest Spark equivalent.'),
    P('Solo', 'Outro solo', 'neck', 'Plexiglas 4.5 5 6.5 5.5 6.5; mod UniVibe 2.5 4 5; rev Room Studio B 3 4'),
  ]),
  S('Pride and Joy', 'Stevie Ray Vaughan', 1983, 'Fender Stratocaster', 'S', [
    P('Rhythm shuffle', 'Main shuffle', 'neck + middle', 'Black Duo 5 5.5 6 5.5 7; drv Tube Drive 1 6 8.5; rev Plate Short 2 3', 'Dig in hard. SRV used 13-gauge strings, so on lighter strings bump Mid +0.5.'),
    P('Solo', 'Solos', 'neck', 'Black Duo 6 5.5 6.5 5.5 7; drv Tube Drive 2.5 6 8.5; rev Plate Short 2.5 3'),
  ]),
  S('Layla', 'Derek and the Dominos', 1970, 'Fender Stratocaster "Brownie" + Duane Allman Les Paul', 'S', [
    P('Main riff', 'Intro riff', 'bridge', 'American Deluxe 6.5 5 6.5 5.5 7; rev Room Studio A 2 3', 'The original runs small tweed Champs flat out.'),
    P('Slide lead', 'Duane\'s slide', 'bridge', 'American Deluxe 7.5 5 7 5 7; rev Room Studio A 2 3'),
    P('Piano coda', 'Outro', 'neck', 'Lux Verb 4 5 6 5 6; rev Plate Rich 3 4'),
  ]),
  S('Sunshine of Your Love', 'Cream', 1967, 'Gibson SG "The Fool"', 'H', [
    P('Riff', 'Main riff', 'bridge', 'JM45 6 5 6.5 5 7; rev Room Studio A 2 3'),
    P('Woman-tone solo', 'Solo', 'neck, tone at 0', 'JM45 7 5 7 3 7; rev Room Studio A 2 3', 'Turn the guitar tone knob fully down on the neck pickup. The amp treble alone will not get you there.'),
  ]),
  S('Sultans of Swing', 'Dire Straits', 1978, 'Fender Stratocaster', 'S', [
    P('Rhythm & verse fills', 'Verses', 'position 4', 'Lux Verb 3.5 5 6 6 6; cmp Red Comp 5 4; rev Room Studio B 2.5 3', 'Fingers, no pick. That alone is half the tone.'),
    P('Outro solo', 'Final solo', 'position 4 / neck', 'Lux Verb 4.5 5 6.5 6 6; cmp Red Comp 5 4; rev Room Studio B 2.5 3'),
  ]),
  S('Money for Nothing', 'Dire Straits', 1985, 'Gibson Les Paul', 'H', [
    P('Main riff', 'Riff', 'neck', 'Plexiglas 6 4 6.5 6.5 6.5; mod Guitar EQ 5.5 3.5 4.5 6 7 6.5 4.5; rev Room Studio A 1.5 3', 'The original sound is a Les Paul through a half-open wah and a badly placed mic. The Guitar EQ boost around 800 Hz to 1.6k fakes the parked wah.'),
  ]),
  S('Whole Lotta Love', 'Led Zeppelin', 1969, 'Gibson Les Paul', 'H', [
    P('Riff', 'Main riff', 'bridge', 'Plexiglas 6.5 5 6.5 5 7; rev Room Studio B 2.5 3'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 7 5 7 5 7; drv Booster 3; dly Echo Tape 2 280ms 2; rev Room Studio B 2.5 3'),
  ]),
  S('Stairway to Heaven', 'Led Zeppelin', 1971, '12-string acoustic / Telecaster solo', 'T', [
    P('Fingerpicked intro', 'Intro & first verses', 'neck', 'Lux Verb 2 5 5.5 5.5 6; rev Room Studio B 2.5 3', 'The original is an acoustic. On an electric, go neck pickup with the tone at 7.'),
    P('Electric rhythm', 'Middle build', 'bridge', 'Plexiglas 4.5 5 6 5.5 6.5; rev Room Studio B 2.5 3'),
    P('Solo', 'Telecaster solo', 'bridge', 'Plexiglas 6.5 5 6.5 5.5 7; dly Echo Tape 1.5 300ms 2; rev Room Studio B 2.5 3', 'Page plays this solo on a Telecaster into a Supro. The Plexiglas with Mid up lands close.'),
  ]),
  S('Paint It Black', 'The Rolling Stones', 1966, 'Gibson / Vox', 'H', [
    P('Riff', 'Main riff', 'bridge', 'AC Boost 4.5 5 6.5 4.5 6; rev Room Studio A 2 3'),
  ]),
  S('Back in Black', 'AC/DC', 1980, 'Gibson SG', 'H', [
    P('Rhythm riff', 'Main riff', 'bridge', 'Plexiglas 4.5 5 6.5 5 7.5; rev Room Studio B 1.5 3', 'This is far less gain than people expect. The chords should ring out, not sizzle.'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 6 5 7 5 7.5; rev Room Studio B 2 3'),
  ]),
  S('Thunderstruck', 'AC/DC', 1990, 'Gibson SG', 'H', [
    P('Tapping/pull-off intro', 'Intro', 'bridge', 'Plexiglas 5.5 5 7 5 7.5; rev Room Studio B 2 3', 'A touch more gain than Back in Black so the pull-offs sustain.'),
    P('Rhythm', 'Verses & chorus', 'bridge', 'Plexiglas 5 5 6.5 5 7.5; rev Room Studio B 2 3'),
  ]),
  S('Bohemian Rhapsody', 'Queen', 1975, 'Red Special', 'S', [
    P('Solo', 'Ballad solo', 'bridge + middle', 'AC Boost 6.5 4.5 7.5 4 7; drv Booster 7; rev Hall Medium 3 4', 'Brian May\'s treble booster into a cranked AC30 is a mid-heavy sound, so keep Treble down.'),
    P('Heavy section', 'Rock section', 'bridge + middle', 'AC Boost 7 4.5 7 4 7; drv Booster 7; rev Room Studio B 2.5 3'),
  ]),
  S('Iron Man', 'Black Sabbath', 1970, 'Gibson SG', 'H', [
    P('Riff', 'Main riff', 'bridge', 'Plexiglas 6.5 5 6 5 7; drv Booster 6; rev Room Studio B 2 3'),
    P('Solo', 'Solos', 'bridge', 'Plexiglas 7 5 6.5 5 7; drv Booster 7; rev Room Studio B 2.5 3'),
  ]),
  S('Smoke on the Water', 'Deep Purple', 1972, 'Fender Stratocaster', 'S', [
    P('Riff', 'Main riff', 'bridge', 'Plexiglas 6.5 4.5 6.5 5.5 7; rev Room Studio B 2 3', 'Blackmore plays the riff as fingered 4ths, with no power chords.'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 7 4.5 7 5.5 7; rev Room Studio B 2.5 3'),
  ]),
  S('Comfortably Numb', 'Pink Floyd', 1979, 'Fender Stratocaster (Black Strat)', 'S', [
    P('Verse clean', 'Verse arpeggios', 'neck', 'Plexiglas 2.5 5 6 5.5 6; cmp Red Comp 5 4; mod Chorus 2 3 5 4; dly Digital Delay 2 440ms 2; rev Hall Medium 3 4'),
    P('First solo', 'First solo', 'bridge', 'Plexiglas 3.5 5 6 5 6; drv Tube Drive 4 5 7; dly Digital Delay 2.5 440ms 2; rev Hall Medium 3 5'),
    P('Final solo', 'Outro solo', 'bridge', 'Plexiglas 3.5 5 6 5 6; drv Guitar Muff 6.5 4 6; dly Digital Delay 3 440ms 3; rev Hall Medium 3.5 5', 'Gilmour kept the amp clean and loud. Every bit of the sustain comes from the Muff.'),
  ]),
  S('Wish You Were Here', 'Pink Floyd', 1975, '12-string acoustic + Strat lead', 'AC', [
    P('Acoustic', 'Intro rhythm & verses', 'n/a', 'Jumbo 0 5 5.5 5.5 6; cmp LA Comp 4 3; rev Room Studio B 2.5 3'),
    P('Intro lead (radio)', 'Intro lead line', 'n/a', 'Pure Acoustic 0 4 6 6 6; mod Guitar EQ 5 3 4 6 6.5 5.5 4; rev Room Studio A 1.5 3', 'The intro lead is meant to sound like it is coming out of a radio. The Guitar EQ thins it out on purpose.'),
  ]),
  S('Hotel California', 'Eagles', 1976, 'Les Paul / Telecaster', 'H', [
    P('Verses', '12-string feel verses', 'neck', 'Black Duo 3 5 6 6 6; mod Chorus 2 2 5 3; rev Plate Short 2.5 3'),
    P('Dual outro solo', 'Outro harmony solo', 'bridge', 'Plexiglas 6.5 5 6.5 5 7; dly Digital Delay 1.5 330ms 2; rev Plate Rich 2.5 4'),
  ]),
  S('Europa', 'Santana', 1976, 'Gibson SG / Yamaha SG', 'H', [
    P('Lead', 'Main melody', 'neck', 'American High Gain 6.5 4.5 7.5 4.5 6.5; dly Digital Delay 1.5 380ms 2; rev Plate Rich 3 4', 'Santana gets his sustain from Mid and from standing close to the amp. Keep Treble under 5.'),
  ]),
  S('La Grange', 'ZZ Top', 1973, 'Gibson Les Paul "Pearly Gates"', 'H', [
    P('Boogie riff', 'Main riff', 'bridge', 'Plexiglas 5.5 5.5 6 5 7; rev Room Studio A 2 3'),
    P('Solo', 'Solos', 'bridge', 'Plexiglas 7 5.5 6.5 5 7; drv Tube Drive 2 5 7; rev Room Studio A 2 3'),
  ]),
  S('Eruption', 'Van Halen', 1978, 'Frankenstrat', 'HH', [
    P('Full piece', 'Whole track', 'bridge', 'Plexiglas 8 5 7 5.5 7.5; mod Phaser 2 2; dly Echo Tape 2 330ms 2; rev Plate Rich 3 4'),
  ]),
  S('Panama', 'Van Halen', 1984, 'Kramer 5150', 'HH', [
    P('Rhythm', 'Riff & verses', 'bridge', 'Plexiglas 7 5 6.5 5.5 7.5; rev Plate Rich 2.5 4'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 8 5 7 5.5 7.5; dly Echo Tape 2 330ms 2; rev Plate Rich 3 4'),
  ]),
  S("Sweet Child O' Mine", "Guns N' Roses", 1987, 'Gibson Les Paul replica', 'H', [
    P('Intro riff', 'Intro arpeggio', 'neck', 'Plexiglas 6 5 6.5 5 7; rev Plate Rich 2.5 4', 'Slash plays the intro on the neck pickup with the amp already distorted. It is not a clean tone.'),
    P('Rhythm', 'Verses & chorus', 'bridge', 'Plexiglas 7 5 6.5 5 7; rev Room Studio B 2 3'),
    P('Solo', 'Main solo', 'neck', 'Plexiglas 7.5 5 7 4.5 7; drv Tube Drive 0.5 5 7; dly Digital Delay 1.5 380ms 2; rev Plate Rich 3 4'),
    P('Wah solo', 'Outro wah solo', 'bridge', 'Plexiglas 7.5 4.5 7 5 7; cmp Auto Wah 6 6 6; rev Plate Rich 2.5 4', 'The Spark 1 has no expression-pedal wah. The Auto Wah follows your pick attack, so pick harder on the notes you want to "open".'),
  ]),
  S('Crazy Train', 'Ozzy Osbourne', 1980, 'Les Paul Custom', 'HH', [
    P('Riff', 'Main riff', 'bridge', 'Plexiglas 6 5 7 5 7; drv Over Drive 5 5 6; rev Plate Short 2 3'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 6.5 5 7.5 5 7; drv Over Drive 6 5 6; dly Digital Delay 2 380ms 2; rev Plate Rich 3 4'),
  ]),
  S('Master of Puppets', 'Metallica', 1986, 'ESP / Gibson Explorer', 'A', [
    P('Rhythm', 'Downpicked riffs', 'bridge', 'American High Gain 6 4.5 5 6 6.5; drv Tube Drive 0.5 5 7; gate 4 3; rev Room Studio A 1 2'),
    P('Clean interlude', 'Middle clean section', 'neck', 'Black Duo 3 5 5.5 6 6; mod Chorus 2 3 5 4; rev Plate Short 2.5 3'),
    P('Solo', 'Kirk\'s solo', 'bridge', 'American High Gain 6.5 4.5 6.5 6 6.5; drv Tube Drive 1.5 5 7; dly Digital Delay 2 400ms 2; rev Plate Short 2.5 3'),
  ]),
  S('Enter Sandman', 'Metallica', 1991, 'ESP / Gibson Explorer', 'A', [
    P('Rhythm', 'Riff & verses', 'bridge', 'Treadplate 5.5 4 5.5 6 6; drv Tube Drive 0.5 5 7; gate 4 3; rev Room Studio A 1 2', 'The Black Album sound is a Rectifier with mids left in. On a 2x4, Bass above 4 turns to mud.'),
    P('Intro clean', 'Intro', 'neck', 'Black Duo 3 5 5.5 6 6; mod Chorus 2 3 5 4; rev Plate Short 2.5 3'),
    P('Solo', 'Solo (wah)', 'bridge', 'Treadplate 6 4 6.5 6 6; cmp Auto Wah 6 6 6; dly Digital Delay 2 400ms 2; rev Plate Short 2.5 3'),
  ]),
  S('Symphony of Destruction', 'Megadeth', 1992, 'Jackson King V', 'A', [
    P('Rhythm', 'Main riff', 'bridge', 'Plexiglas 7.5 4.5 6.5 6 7; drv Tube Drive 1 5 8; gate 4 3; rev Room Studio A 1 2'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 8 4.5 7 6 7; drv Tube Drive 2 5 8; dly Digital Delay 2 400ms 2; rev Plate Rich 2.5 4'),
  ]),
  S('Walk', 'Pantera', 1992, 'Dean ML', 'HH', [
    P('Riff', 'Main riff', 'bridge', 'SwitchAxe 6.5 5.5 4.5 6.5 6.5; mod Guitar EQ 5.5 6 5 3.5 4 6 6.5; gate 5 3; rev Room Studio A 1 2'),
    P('Solo', 'Solo', 'bridge', 'SwitchAxe 7 5.5 5.5 6.5 6.5; gate 4 3; dly Digital Delay 2 380ms 2; rev Plate Short 2 3'),
  ]),
  S('Chop Suey!', 'System of a Down', 2001, 'Ibanez Iceman', 'HH', [
    P('Heavy riff', 'Verses & riff', 'bridge', 'Treadplate 5.5 4.5 6 6 6; gate 4 3; rev Room Studio A 1 2'),
    P('Clean picking', 'Intro arpeggio', 'neck', 'AD Clean 3 5 6 5.5 6; rev Plate Short 2.5 3'),
  ]),
  S('In the End', 'Linkin Park', 2000, 'PRS', 'HH', [
    P('Chorus wall', 'Chorus', 'bridge', 'Treadplate 5.5 4 5.5 6 6; drv Tube Drive 0 5 7; gate 5 3; rev Room Studio A 1 2'),
  ]),
  S('Change (In the House of Flies)', 'Deftones', 2000, 'ESP 7-string', 'A', [
    P('Verse clean', 'Verses', 'neck', 'AD Clean 3 5 5.5 5.5 6; mod Chorus 2 4 5 4; dly Digital Delay 2.5 420ms 3; rev Hall Ambient 3.5 6'),
    P('Chorus wall', 'Chorus', 'bridge', 'Treadplate 6 4 5.5 5.5 6; mod Flanger 1 3 3 2; gate 4 3; rev Room Studio B 2 3'),
  ]),
  S('Schism', 'Tool', 2001, 'Gibson Les Paul Custom', 'H', [
    P('Main riff', 'Riffs', 'bridge', 'RB 101 6 5 6 5 6; gate 3 3; rev Room Studio B 1.5 3'),
    P('Clean breakdown', 'Middle clean section', 'neck', 'AD Clean 3 5 6 5.5 6; dly Digital Delay 2.5 420ms 3; rev Hall Medium 3 4'),
  ]),
  S('Bat Country', 'Avenged Sevenfold', 2005, 'Schecter Synyster', 'HH', [
    P('Rhythm', 'Riffs', 'bridge', 'Insane 5 4.5 6 6 6; drv Tube Drive 0 5 7; gate 4 3; rev Room Studio A 1 2'),
    P('Solo', 'Solo', 'neck → bridge', 'Insane 5.5 4.5 6.5 6 6; gate 3.5 3; dly Digital Delay 3 400ms 3; rev Hall Medium 3 4'),
  ]),
  S('Smells Like Teen Spirit', 'Nirvana', 1991, 'Fender Mustang', 'H', [
    P('Chorus & riff', 'Intro riff & chorus', 'bridge', 'British 30 5 5 6 5.5 6.5; drv Black Op 5 4.5 6; rev Room Studio A 1.5 3', 'The original pedal is a Boss DS-1. Of the Spark drives, the Black Op (Rat) gets closest to it.'),
    P('Verse clean', 'Verses', 'neck', 'AD Clean 3 5 6 5.5 6; mod Cloner Chorus 3 6; rev Room Studio A 2 3'),
    P('Solo', 'Solo (melody)', 'bridge', 'British 30 5.5 5 6.5 5.5 6.5; drv Black Op 5 4.5 6; rev Room Studio A 2 3'),
  ]),
  S('Come as You Are', 'Nirvana', 1991, 'Fender Mustang', 'H', [
    P('Riff', 'Main riff', 'neck', 'AD Clean 3 5 6 5.5 6; mod Cloner Chorus 2 7; rev Room Studio A 2 3', 'The underwater wobble comes from a Small Clone with Depth all the way up.'),
    P('Chorus', 'Chorus', 'bridge', 'British 30 5 5 6 5.5 6.5; drv Black Op 4 4.5 6; rev Room Studio A 1.5 3'),
  ]),
  S('Man in the Box', 'Alice in Chains', 1990, 'G&L Rampage', 'HH', [
    P('Riff', 'Main riff', 'bridge', 'RB 101 5.5 5 6.5 5 6; drv Tube Drive 1 5 7; gate 3 3; rev Room Studio B 1.5 3'),
    P('Solo', 'Solo (wah)', 'bridge', 'RB 101 6 5 7 5 6; cmp Auto Wah 6 6 6; rev Room Studio B 2 3'),
  ]),
  S('Black Hole Sun', 'Soundgarden', 1994, 'Gibson / Guild', 'H', [
    P('Verse', 'Leslie verse arpeggio', 'neck', 'AD Clean 3 5 6 5.5 6; mod UniVibe 4 6 5; rev Plate Short 2.5 3', 'The verse runs through a Leslie speaker. A faster UniVibe stands in for it.'),
    P('Chorus', 'Chorus', 'bridge', 'RB 101 5.5 5 6 5 6; drv Guitar Muff 4 5 6; rev Room Studio B 2 3'),
  ]),
  S('Alive', 'Pearl Jam', 1991, 'Les Paul / Strat', 'H', [
    P('Rhythm', 'Verses & chorus', 'bridge', 'Plexiglas 5.5 5 6 5.5 7; rev Room Studio B 2 3'),
    P('Outro solo', 'Outro solo', 'neck', 'Plexiglas 6.5 5 6.5 5.5 7; drv Tube Drive 2 5 7; dly Digital Delay 2 380ms 2; rev Room Studio B 2.5 3'),
  ]),
  S('Cherub Rock', 'The Smashing Pumpkins', 1993, 'Fender Stratocaster', 'HH', [
    P('Fuzz wall', 'Main riff', 'bridge', 'Plexiglas 4.5 5 6 5 6.5; drv Guitar Muff 7 4.5 6; rev Room Studio B 1.5 3'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 5 5 6.5 5 6.5; drv Guitar Muff 8.5 5 6; dly Digital Delay 2 380ms 2; rev Room Studio B 2 3'),
  ]),
  S('Everlong', 'Foo Fighters', 1997, 'Gibson Trini Lopez', 'H', [
    P('Rhythm (drop D)', 'Verses & chorus', 'bridge', 'Plexiglas 6.5 5 6.5 5.5 7; rev Room Studio A 1.5 3'),
    P('Quiet bridge', 'Quiet middle section', 'neck', 'AC Boost 3 5 6 4.5 6; rev Room Studio A 2 3'),
  ]),
  S('Killing in the Name', 'Rage Against the Machine', 1992, 'Telecaster "Arm the Homeless"', 'HH', [
    P('Riff (drop D)', 'Main riff', 'bridge', 'Plexiglas 6 5 6.5 5.5 7; gate 3 3; rev Room Studio A 1 2'),
    P('Solo', 'Whammy solo', 'bridge', 'Plexiglas 6.5 5 7 5.5 7; rev Room Studio A 1 2', 'The solo needs a DigiTech Whammy, which the Spark 1 does not have. This keeps the base tone right so you can practice the phrasing.'),
  ]),
  S('Under the Bridge', 'Red Hot Chili Peppers', 1991, "Fender Stratocaster ('62)", 'S', [
    P('Intro & verses', 'Intro chord melody', 'neck / position 2', 'Plexiglas 2.5 4.5 6 6 6; cmp Red Comp 4 3; mod Chorus 2 3 5 4; rev Room Studio A 2 3'),
  ]),
  S('Californication', 'Red Hot Chili Peppers', 1999, 'Fender Stratocaster', 'S', [
    P('Verse riff', 'Verses', 'neck', 'Plexiglas 3 4.5 6 6 6; cmp Red Comp 4 3; rev Room Studio A 2 3'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 5 4.5 6.5 6 6; drv Black Op 4 4.5 6; rev Room Studio A 2 3'),
  ]),
  S('Creep', 'Radiohead', 1992, 'Fender Telecaster Plus', 'T', [
    P('Verse arpeggios', 'Verses', 'neck', 'Lux Verb 2.5 5 6 6 6; rev Plate Short 2.5 3'),
    P('Chorus crunch', '"Chunk-chunk" & chorus', 'bridge', 'Lux Verb 4.5 5 6 6 6; drv Black Op 7 4 6; rev Room Studio B 2 3', 'Those famous chunks are a ShredMaster with the guitar\'s killswitch. Black Op with Distortion high gets the bite.'),
  ]),
  S('Wonderwall', 'Oasis', 1995, 'Acoustic', 'AC', [
    P('Strummed acoustic', 'Whole song', 'n/a', 'Jumbo 0 5 5.5 5.5 6; cmp LA Comp 5 4; rev Room Studio B 2 3'),
  ]),
  S("Don't Look Back in Anger", 'Oasis', 1995, 'Epiphone Riviera / Les Paul', 'H', [
    P('Rhythm', 'Verses & chorus', 'bridge', 'Plexiglas 6 5 6.5 5 7; rev Room Studio B 2.5 3'),
    P('Solo', 'Solo', 'neck', 'Plexiglas 7 5 7 5 7; drv Tube Drive 2 5 7; dly Digital Delay 2 400ms 2; rev Room Studio B 3 3'),
  ]),
  S('Seven Nation Army', 'The White Stripes', 2003, 'Kay hollowbody', 'P', [
    P('Riff', 'Main riff (octave down on the original)', 'neck', 'Tweed Bass 5 6 6 5 7; drv Guitar Muff 6 4 6; rev Room Studio A 1.5 3', 'The original uses a Whammy an octave down. With no octaver, play it on the low strings with the neck pickup and push Bass to 6 to get the weight.'),
    P('Chorus', 'Chorus slide', 'bridge', 'Tweed Bass 6.5 5 6.5 6 7; drv Guitar Muff 8 5 6; rev Room Studio A 1.5 3'),
  ]),
  S('Lonely Boy', 'The Black Keys', 2011, 'Harmony / Gibson', 'P', [
    P('Riff', 'Main riff', 'bridge', 'American Deluxe 6 5 6.5 5.5 6.5; drv Fuzz Face 5 6; rev Room Studio A 2 3'),
  ]),
  S('No One Knows', 'Queens of the Stone Age', 2002, 'Maton / Ovation GP', 'H', [
    P('Riff', 'Main riff', 'bridge', 'Sunny 3000 5.5 5 7 5 6; drv Guitar Muff 4 4 6; rev Room Studio A 1.5 3'),
  ]),
  S('Last Nite', 'The Strokes', 2001, 'Fender Strat / Epiphone Riviera', 'S', [
    P('Rhythm', 'Rhythm guitar (Albert)', 'bridge', 'Lux Verb 5 4 6.5 6 6; drv Over Drive 3 5 6; rev Room Studio A 0.5 2'),
    P('Lead', 'Lead & solo (Nick)', 'bridge', 'Lux Verb 5.5 4 7 6 6; drv Over Drive 4 5 6; rev Room Studio A 0.5 2'),
  ]),
  S('Do I Wanna Know?', 'Arctic Monkeys', 2013, 'Gibson / Vox', 'H', [
    P('Riff', 'Main riff', 'bridge', 'British 30 5 5.5 6.5 5 6; drv Fuzz Face 5 6; rev Room Studio A 2 3'),
  ]),
  S('Mr. Brightside', 'The Killers', 2004, 'Fender Strat', 'S', [
    P('Intro & verse', 'Intro riff', 'bridge', 'AC Boost 5 4.5 6 4.5 6; mod Chorus 2 2 5 3; dly Digital Delay 2.5 380ms 3; rev Hall Medium 3 4'),
  ]),
  S('Where the Streets Have No Name', 'U2', 1987, 'Gibson Explorer / Strat', 'H', [
    P('Intro delay part', 'Intro', 'bridge', 'AC Boost 4.5 4.5 6 4.5 6; dly Digital Delay 4 375ms 4; rev Hall Medium 3 4', 'Set the delay to a dotted 8th of 126 BPM, which is about 357 ms. Use tap tempo if your app version shows BPM.'),
  ]),
  S('Basket Case', 'Green Day', 1994, 'Fernandes "Blue" Strat', 'HH', [
    P('Rhythm', 'Whole song', 'bridge', 'Plexiglas 7 5 6.5 5.5 7; rev Room Studio A 1 2'),
  ]),
  S('All the Small Things', 'Blink-182', 1999, 'Fender Strat (single humbucker)', 'HH', [
    P('Rhythm', 'Verses & chorus', 'bridge', 'Treadplate 5 4 6 6 6; rev Room Studio A 1 2'),
    P('Intro', 'Clean intro riff', 'bridge', 'Black Duo 3 5 5.5 6 6; rev Plate Short 2.5 3'),
  ]),
  S('Buddy Holly', 'Weezer', 1994, 'Gibson Les Paul', 'H', [
    P('Rhythm', 'Verses & chorus', 'bridge', 'American High Gain 5 5 6 5 6; drv Guitar Muff 4 5 6; rev Room Studio A 1.5 3'),
  ]),
  S('Hysteria', 'Muse', 2003, 'Manson', 'HH', [
    P('Riff', 'Main riff (guitar doubles the bass)', 'bridge', 'Plexiglas 6 5 6.5 5.5 7; drv Fuzz Face 7 6; gate 3 3; rev Room Studio B 1.5 3'),
  ]),
  S('Misery Business', 'Paramore', 2007, 'Fender Telecaster', 'T', [
    P('Rhythm', 'Riff & verses', 'bridge', 'Plexiglas 6 5 6 5.5 7; rev Room Studio A 1.5 3'),
  ]),
  S('Welcome to the Black Parade', 'My Chemical Romance', 2006, 'Gibson Les Paul', 'H', [
    P('Rhythm', 'Main build', 'bridge', 'Plexiglas 6.5 5 6.5 5.5 7; drv Tube Drive 1 5 7; rev Room Studio A 1.5 3'),
    P('Solo', 'Solo', 'bridge', 'Plexiglas 7 5 7 5.5 7; drv Tube Drive 2 5 7; dly Digital Delay 2.5 400ms 3; rev Plate Rich 2.5 4'),
  ]),
  S('Gravity', 'John Mayer', 2006, 'Fender Stratocaster', 'S', [
    P('Rhythm', 'Verses', 'position 4', 'Two Stone SP50 3.5 5 6 5.5 6; cmp LA Comp 4 3; rev Plate Rich 2.5 4'),
    P('Solo', 'Solos', 'neck', 'Two Stone SP50 5 5 6.5 5.5 6; drv Clone Drive 3 5 7; dly Digital Delay 1.5 360ms 2; rev Plate Rich 2.5 4'),
  ]),
  S('Slow Dancing in a Burning Room', 'John Mayer', 2006, 'Fender Stratocaster', 'S', [
    P('Intro & rhythm', 'Rhythm figure', 'position 4', 'Two Stone SP50 3.5 5 6 5.5 6; cmp LA Comp 4 3; rev Plate Short 2.5 3'),
    P('Solo', 'Solo', 'neck', 'Two Stone SP50 5.5 5 6.5 5.5 6; drv Tube Drive 2 5 7; dly Digital Delay 1.5 360ms 2; rev Plate Short 2.5 3'),
  ]),
  S('Maria Maria', 'Santana', 1999, 'PRS', 'H', [
    P('Lead', 'Melody', 'neck', 'American High Gain 6 4.5 7 4.5 6.5; rev Plate Rich 3 4'),
  ]),
  S('Le Freak', 'Chic', 1978, 'Fender Stratocaster', 'S', [
    P('Rhythm chops', 'Whole song', 'position 4', 'Black Duo 2.5 4 6 6.5 6; cmp Red Comp 6 5; rev Room Studio A 1.5 2'),
  ]),
  S('Dean Town', 'Vulfpeck', 2016, 'Fender Stratocaster', 'S', [
    P('Rhythm chops', 'Rhythm', 'position 4', 'Two Stone SP50 1.5 4 5.5 6.5 6; cmp Red Comp 6.5 6; rev Room Studio A 1 2'),
  ]),
  S('Misirlou', 'Dick Dale', 1962, 'Fender Stratocaster', 'S', [
    P('Tremolo-picked lead', 'Whole song', 'bridge', 'Black Duo 4.5 5 6 6 7; rev Plate Long 4.5 4 4 6 3 7'),
  ]),
  S('Folsom Prison Blues', 'Johnny Cash', 1955, 'Fender Esquire', 'T', [
    P('Boom-chicka rhythm', 'Rhythm', 'bridge', 'Lux Verb 3 5.5 6 5 6; dly Digital Delay 2 110ms 1; rev Plate Short 2 3', 'Palm-mute the bass strings. A short slapback delay at about 110 ms gives you the Sun Records sound.'),
  ]),
  S('Brown Eyed Girl', 'Van Morrison', 1967, 'Fender / Gibson', 'S', [
    P('Intro riff', 'Intro', 'bridge', 'Lux Verb 3.5 5 6 6 6; rev Room Studio A 2 3'),
  ]),
  S('Plush', 'Stone Temple Pilots', 1992, 'Gibson Les Paul', 'H', [
    P('Rhythm', 'Verses & chorus', 'bridge', 'Plexiglas 6 5 6.5 5 7; rev Room Studio B 2 3'),
  ]),
  S('Smooth', 'Santana', 1999, 'PRS', 'H', [
    P('Lead', 'Fills & solo', 'neck', 'American High Gain 6.5 4.5 7.5 4.5 6.5; dly Digital Delay 1.5 380ms 2; rev Plate Rich 3 4'),
  ]),
  S('Sleep Walk', 'Santo & Johnny', 1959, 'Steel guitar / Fender', 'S', [
    P('Melody', 'Melody', 'neck', 'Black Duo 2.5 5 6 5 6; mod Tremolo 3 2 5; rev Plate Long 3.5 5'),
  ]),
];
