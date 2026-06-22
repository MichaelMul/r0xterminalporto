import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const VOLUME_KEY = 'portfolio-volume'
const MUTE_KEY = 'portfolio-muted'

interface AudioContextValue {
  volume: number
  muted: boolean
  setVolume: (value: number) => void
  toggleMute: () => void
  effectiveVolume: number
}

const AudioContext = createContext<AudioContextValue | null>(null)

function loadNumber(key: string, fallback: number) {
  try {
    const value = localStorage.getItem(key)
    if (value == null) return fallback
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function loadBoolean(key: string, fallback: boolean) {
  try {
    const value = localStorage.getItem(key)
    if (value == null) return fallback
    return value === 'true'
  } catch {
    return fallback
  }
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(() => loadNumber(VOLUME_KEY, 0.75))
  const [muted, setMuted] = useState(() => loadBoolean(MUTE_KEY, false))

  const setVolume = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value))
    setVolumeState(next)
    localStorage.setItem(VOLUME_KEY, String(next))
    if (next > 0) {
      setMuted(false)
      localStorage.setItem(MUTE_KEY, 'false')
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current
      localStorage.setItem(MUTE_KEY, String(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      volume,
      muted,
      setVolume,
      toggleMute,
      effectiveVolume: muted ? 0 : volume,
    }),
    [volume, muted, setVolume, toggleMute],
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
