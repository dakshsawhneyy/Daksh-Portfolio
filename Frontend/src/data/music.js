/* Music disc config.
   src: an audio file in Frontend/public/music/ to play (looped). The file name has
        spaces/brackets, so it is URL-encoded with encodeURI.
   If the file is missing / not audio, the disc falls back to the built-in
   procedural rock loop (src/audio/rockEngine.js) and shows `fallback` as the label. */
const music = {
  title: 'Drowning',
  artist: 'A Boogie wit da Hoodie ft. Kodak Black',
  src: encodeURI('/music/A Boogie Wit Da Hoodie - Drowning (Lyrics) Pick up the ladder put it in the gun - Vibe Music.mp3'),
  fallback: {
    title: 'Overclocked',
    artist: 'daksh.fm · synth-rock',
  },
}

export default music
