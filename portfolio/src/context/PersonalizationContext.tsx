import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_WALLPAPER, WALLPAPER_STORAGE_KEY } from '../data/media'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

function compressImage(base64Str: string, maxWidth = 1280, maxHeight = 720, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64Str
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(base64Str)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = (err) => reject(err)
  })
}

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

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    async function fetchWallpaper() {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.wallpaper&select=*`, {
          headers: {
            apikey: SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })
        if (response.ok) {
          const rows = await response.json()
          if (rows && rows.length > 0 && rows[0].value) {
            setWallpaper(rows[0].value)
          }
        }
      } catch (err) {
        console.error('Failed to load shared wallpaper:', err)
      }
    }

    fetchWallpaper()
  }, [])

  const persistWallpaper = useCallback(async (value: string | null) => {
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

    if (isSupabaseConfigured()) {
      try {
        const payload = { key: 'wallpaper', value: value || '' }
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          throw new Error('Failed to update shared wallpaper.')
        }
      } catch (err) {
        console.error('Failed to save shared wallpaper:', err)
        setError('Wallpaper saved locally but failed to share online.')
      }
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

      let compressed = dataUrl
      try {
        compressed = await compressImage(dataUrl)
      } catch (err) {
        console.warn('Could not compress image, using original.', err)
      }

      await persistWallpaper(compressed)
    },
    [persistWallpaper],
  )

  const resetWallpaper = useCallback(async () => {
    await persistWallpaper(null)
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

