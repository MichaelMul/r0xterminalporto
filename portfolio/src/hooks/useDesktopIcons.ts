import { useCallback, useState } from 'react'
import { desktopIcons as defaultIcons } from '../data/apps'
import type { AppId, DesktopIconState } from '../types'

const STORAGE_KEY = 'portfolio-desktop-icons'

function loadIcons(): DesktopIconState[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as DesktopIconState[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = [...parsed]
        for (const icon of defaultIcons) {
          if (!merged.some((item) => item.appId === icon.appId)) {
            merged.push(icon)
          }
        }
        return merged
      }
    }
  } catch {
    // ignore invalid saved state
  }
  return defaultIcons
}

export function useDesktopIcons() {
  const [icons, setIcons] = useState<DesktopIconState[]>(loadIcons)

  const moveIcon = useCallback((appId: AppId, x: number, y: number) => {
    setIcons((prev) => {
      const next = prev.map((icon) =>
        icon.appId === appId ? { ...icon, x, y } : icon,
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { icons, moveIcon }
}
