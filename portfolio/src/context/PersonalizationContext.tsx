import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_WALLPAPER, WALLPAPER_STORAGE_KEY } from '../data/media'

interface PersonalizationContextValue {
  wallpaper: string | null
  wallpaperStyle: React.CSSProperties
  setWallpaperFromFile: (file: File) => Promise<void>
  resetWallpaper: () => void
  wallpaperError: string | null
}

const PersonalizationContext =
  createContext<PersonalizationContextValue | null>(null)

function loadWallpaper() {
  try {
    return localStorage.getItem(WALLPAPER_STORAGE_KEY)
  } catch {
    return null
  }
}

function buildWallpaperStyle(wallpaper: string | null): React.CSSProperties {
  const src = wallpaper || DEFAULT_WALLPAPER
  return {
    backgroundImage: `url("${src}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
}

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaper] = useState<string | null>(loadWallpaper)
  const [error, setError] = useState<string | null>(null)

  const persistWallpaper = useCallback((value: string | null) => {
    setWallpaper(value)
    try {
      if (value) {
        localStorage.setItem(WALLPAPER_STORAGE_KEY, value)
      } else {
        localStorage.removeItem(WALLPAPER_STORAGE_KEY)
      }
      setError(null)
    } catch {
      setError('Wallpaper saved for this session only (storage limit reached).')
    }
  }, [])

  const setWallpaperFromFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please choose an image file (JPG, PNG, GIF, or WebP).')
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Could not read that image file.'))
        reader.readAsDataURL(file)
      })

      persistWallpaper(dataUrl)
    },
    [persistWallpaper],
  )

  const resetWallpaper = useCallback(() => {
    persistWallpaper(null)
  }, [persistWallpaper])

  const value = useMemo(
    () => ({
      wallpaper,
      wallpaperStyle: buildWallpaperStyle(wallpaper),
      setWallpaperFromFile,
      resetWallpaper,
      wallpaperError: error,
    }),
    [wallpaper, setWallpaperFromFile, resetWallpaper, error],
  )

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  )
}

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext)
  if (!ctx) {
    throw new Error('usePersonalization must be used within PersonalizationProvider')
  }
  return ctx
}
