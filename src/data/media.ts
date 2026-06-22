export const DEFAULT_WALLPAPER =
  'https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_XP.jpg'

export const WALLPAPER_STORAGE_KEY = 'portfolio-wallpaper'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  src: string
}

export const playlist: Track[] = [
  {
    id: '01',
    title: 'The Chase',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/01-the-chase.mp3',
  },
  {
    id: '02',
    title: 'Butterflies',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/02-butterflies.mp3',
  },
  {
    id: '03',
    title: 'STYLE',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/03-style.mp3',
  },
  {
    id: '04',
    title: 'Pretty Please',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/04-pretty-please.mp3',
  },
  {
    id: '05',
    title: 'FOCUS',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/05-focus.mp3',
  },
  {
    id: '06',
    title: 'Apple Pie',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/06-apple-pie.mp3',
  },
  {
    id: '07',
    title: 'Flutter',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/07-flutter.mp3',
  },
  {
    id: '08',
    title: 'Blue Moon',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/08-blue-moon.mp3',
  },
  {
    id: '09',
    title: 'RUDE!',
    artist: 'Hearts2Hearts',
    album: 'Hearts2Hearts',
    src: '/music/09-rude.mp3',
  },
]
