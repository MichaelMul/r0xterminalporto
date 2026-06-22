import {

  createContext,

  useCallback,

  useContext,

  useMemo,

  useState,

  type ReactNode,

} from 'react'

import { getApp } from '../data/apps'

import type { AppId, WindowState } from '../types'



const MAX_WINDOW_Z = 89999



interface WindowContextValue {

  windows: WindowState[]

  activeWindowId: string | null

  openApp: (appId: AppId) => void

  closeWindow: (id: string) => void

  focusWindow: (id: string) => void

  minimizeWindow: (id: string) => void

  restoreWindow: (id: string) => void

  toggleMaximize: (id: string) => void

  moveWindow: (id: string, x: number, y: number) => void

  setWindowPosition: (id: string, x: number, y: number) => void

  resizeWindow: (id: string, width: number, height: number) => void

  setWindowBounds: (

    id: string,

    bounds: { x?: number; y?: number; width?: number; height?: number },

  ) => void

}



const WindowContext = createContext<WindowContextValue | null>(null)



let windowCounter = 0

let zCounter = 10



function nextZIndex() {

  zCounter = Math.min(zCounter + 1, MAX_WINDOW_Z)

  return zCounter

}



export function WindowProvider({ children }: { children: ReactNode }) {

  const [windows, setWindows] = useState<WindowState[]>([])

  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)



  const focusWindow = useCallback((id: string) => {

    const z = nextZIndex()

    setActiveWindowId(id)

    setWindows((prev) =>

      prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),

    )

  }, [])



  const openApp = useCallback(

    (appId: AppId) => {

      const existing = windows.find((w) => w.appId === appId && !w.minimized)

      if (existing) {

        focusWindow(existing.id)

        return

      }



      const minimized = windows.find((w) => w.appId === appId && w.minimized)

      if (minimized) {

        setWindows((prev) =>

          prev.map((w) =>

            w.id === minimized.id ? { ...w, minimized: false } : w,

          ),

        )

        focusWindow(minimized.id)

        return

      }



      const app = getApp(appId)

      if (!app) return



      windowCounter += 1

      const z = nextZIndex()

      const offset = (windowCounter % 8) * 24

      const newWindow: WindowState = {

        id: `win-${windowCounter}`,

        appId,

        title: app.title,

        x: 80 + offset,

        y: 40 + offset,

        width: app.defaultWidth,

        height: app.defaultHeight,

        minimized: false,

        maximized: false,

        zIndex: z,

      }



      setWindows((prev) => [...prev, newWindow])

      setActiveWindowId(newWindow.id)

    },

    [windows, focusWindow],

  )



  const closeWindow = useCallback((id: string) => {

    setWindows((prev) => prev.filter((w) => w.id !== id))

    setActiveWindowId((current) => (current === id ? null : current))

  }, [])



  const minimizeWindow = useCallback((id: string) => {

    setWindows((prev) =>

      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),

    )

    setActiveWindowId((current) => (current === id ? null : current))

  }, [])



  const restoreWindow = useCallback(

    (id: string) => {

      setWindows((prev) =>

        prev.map((w) => (w.id === id ? { ...w, minimized: false } : w)),

      )

      focusWindow(id)

    },

    [focusWindow],

  )



  const toggleMaximize = useCallback((id: string) => {

    setWindows((prev) =>

      prev.map((w) =>

        w.id === id ? { ...w, maximized: !w.maximized } : w,

      ),

    )

    focusWindow(id)

  }, [focusWindow])



  const setWindowPosition = useCallback((id: string, x: number, y: number) => {

    setWindows((prev) =>

      prev.map((w) =>

        w.id === id ? { ...w, x, y, maximized: false } : w,

      ),

    )

  }, [])



  const moveWindow = useCallback(

    (id: string, x: number, y: number) => {

      setWindowPosition(id, x, y)

      focusWindow(id)

    },

    [setWindowPosition, focusWindow],

  )



  const resizeWindow = useCallback((id: string, width: number, height: number) => {

    setWindows((prev) =>

      prev.map((w) =>

        w.id === id ? { ...w, width, height, maximized: false } : w,

      ),

    )

  }, [])



  const setWindowBounds = useCallback(

    (

      id: string,

      bounds: { x?: number; y?: number; width?: number; height?: number },

    ) => {

      setWindows((prev) =>

        prev.map((w) =>

          w.id === id

            ? {

                ...w,

                ...bounds,

                maximized: false,

              }

            : w,

        ),

      )

    },

    [],

  )



  const value = useMemo(

    () => ({

      windows,

      activeWindowId,

      openApp,

      closeWindow,

      focusWindow,

      minimizeWindow,

      restoreWindow,

      toggleMaximize,

      moveWindow,

      setWindowPosition,

      resizeWindow,

      setWindowBounds,

    }),

    [

      windows,

      activeWindowId,

      openApp,

      closeWindow,

      focusWindow,

      minimizeWindow,

      restoreWindow,

      toggleMaximize,

      moveWindow,

      setWindowPosition,

      resizeWindow,

      setWindowBounds,

    ],

  )



  return (

    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>

  )

}



export function useWindows() {

  const ctx = useContext(WindowContext)

  if (!ctx) throw new Error('useWindows must be used within WindowProvider')

  return ctx

}

