import { useCallback, useEffect, useRef, useState } from 'react'
import { playlist, type Track } from '../data/media'
import { useAudio } from '../context/AudioContext'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function MusicPlayerApp() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { effectiveVolume, volume, muted, setVolume, toggleMute } = useAudio()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentTrack = playlist[currentIndex]

  const playTrack = useCallback(async (index: number) => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentIndex(index)
    setCurrentTime(0)
    setDuration(0)

    requestAnimationFrame(async () => {
      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
      }
    })
  }, [])

  const playNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % playlist.length
      requestAnimationFrame(async () => {
        try {
          await audioRef.current?.play()
        } catch {
          setIsPlaying(false)
        }
      })
      return next
    })
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = effectiveVolume
  }, [effectiveVolume, currentTrack.src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', playNext)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', playNext)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [playNext, currentTrack.src])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      return
    }

    try {
      await audio.play()
    } catch {
      setIsPlaying(false)
    }
  }

  const playPrevious = () => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    playTrack((currentIndex - 1 + playlist.length) % playlist.length)
  }

  const handleSeek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const selectTrack = (track: Track) => {
    const index = playlist.findIndex((item) => item.id === track.id)
    if (index >= 0) playTrack(index)
  }

  return (
    <div className="app-content app-content--fill music-app">
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      <div className="music-toolbar">
        <span className="music-toolbar-title">Windows Media Player</span>
      </div>

      <div className="music-body">
        <div className="music-now-playing">
          <div className="music-art">🎵</div>
          <div>
            <h3>{currentTrack.title}</h3>
            <p>{currentTrack.artist}</p>
            <p className="music-album">{currentTrack.album}</p>
          </div>
        </div>

        <div className="music-controls">
          <button type="button" className="xp-button" onClick={playPrevious}>
            ⏮ Prev
          </button>
          <button type="button" className="xp-button music-play-btn" onClick={togglePlay}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button type="button" className="xp-button" onClick={() => playTrack((currentIndex + 1) % playlist.length)}>
            Next ⏭
          </button>
        </div>

        <div className="music-progress">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="music-volume">
          <button type="button" className="xp-button" onClick={toggleMute}>
            {muted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>

        <div className="music-playlist">
          <h4>Playlist — Hearts2Hearts</h4>
          <ul>
            {playlist.map((track, index) => (
              <li key={track.id}>
                <button
                  type="button"
                  className={`music-track ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => selectTrack(track)}
                >
                  <span>{index + 1}.</span>
                  <span>{track.title}</span>
                  <span>{track.artist}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
