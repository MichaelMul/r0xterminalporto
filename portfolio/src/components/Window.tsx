import { useCallback, useEffect, useRef, useState } from 'react'
import type { WindowState } from '../types'
import { getApp } from '../data/apps'
import { useWindows } from '../context/WindowContext'
import { AppContent } from './AppContent'

interface WindowProps {
  window: WindowState
  isActive: boolean
}

type ResizeDirection = 'sw' | 'se'

const MIN_WIDTH = 280
const MIN_HEIGHT = 180
const TASKBAR_HEIGHT = 30

const resizeHandles: { dir: ResizeDirection; className: string }[] = [
  { dir: 'sw', className: 'xp-resize-sw' },
  { dir: 'se', className: 'xp-resize-se' },
]

const moveHandles = ['xp-move-n', 'xp-move-s', 'xp-move-e', 'xp-move-w'] as const

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function Window({ window: win, isActive }: WindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    setWindowPosition,
    setWindowBounds,
  } = useWindows()

  const app = getApp(win.appId)
  const [isDragging, setIsDragging] = useState(false)
  const [resizeDir, setResizeDir] = useState<ResizeDirection | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragBounds = useRef({ width: 0, height: 0 })
  const resizeStart = useRef({
    x: 0,
    y: 0,
    bounds: { x: 0, y: 0, width: 0, height: 0 },
  })

  const getMoveLimits = useCallback(() => {
    const maxX = window.innerWidth
    const maxY = window.innerHeight - TASKBAR_HEIGHT
    const { width, height } = dragBounds.current
    return {
      minX: 0,
      minY: 0,
      maxX: Math.max(0, maxX - width),
      maxY: Math.max(0, maxY - height),
    }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const maxX = window.innerWidth
      const maxY = window.innerHeight - TASKBAR_HEIGHT

      if (isDragging && !win.maximized) {
        const limits = getMoveLimits()
        setWindowPosition(
          win.id,
          clamp(e.clientX - dragOffset.current.x, limits.minX, limits.maxX),
          clamp(e.clientY - dragOffset.current.y, limits.minY, limits.maxY),
        )
        return
      }

      if (resizeDir && !win.maximized) {
        const dx = e.clientX - resizeStart.current.x
        const dy = e.clientY - resizeStart.current.y
        const start = resizeStart.current.bounds
        let { x, y, width, height } = start

        if (resizeDir === 'se') {
          width = clamp(start.width + dx, MIN_WIDTH, maxX - start.x)
          height = clamp(start.height + dy, MIN_HEIGHT, maxY - start.y)
        }

        if (resizeDir === 'sw') {
          const nextWidth = clamp(start.width - dx, MIN_WIDTH, start.width + start.x)
          x = start.x + (start.width - nextWidth)
          width = nextWidth
          height = clamp(start.height + dy, MIN_HEIGHT, maxY - start.y)
        }

        setWindowBounds(win.id, { x, y, width, height })
      }
    },
    [
      isDragging,
      resizeDir,
      win.id,
      win.maximized,
      getMoveLimits,
      setWindowPosition,
      setWindowBounds,
    ],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setResizeDir(null)
  }, [])

  useEffect(() => {
    if (!isDragging && !resizeDir) return

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor =
      resizeDir === 'sw' || resizeDir === 'se'
        ? 'nwse-resize'
        : isDragging
          ? 'grabbing'
          : ''

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isDragging, resizeDir, handleMouseMove, handleMouseUp])

  if (win.minimized) return null

  const style = win.maximized
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
        zIndex: win.zIndex,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }

  const startDrag = (e: React.MouseEvent) => {
    if (win.maximized) return
    e.preventDefault()
    e.stopPropagation()
    focusWindow(win.id)
    dragBounds.current = { width: win.width, height: win.height }
    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    }
  }

  const startResize = (dir: ResizeDirection, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    focusWindow(win.id)
    setResizeDir(dir)
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      bounds: {
        x: win.x,
        y: win.y,
        width: win.width,
        height: win.height,
      },
    }
  }

  return (
    <div
      className={`xp-window ${isActive ? 'active' : 'inactive'} ${win.maximized ? 'maximized' : ''}`}
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className="xp-titlebar"
        onMouseDown={startDrag}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <img src={app?.icon} alt="" className="titlebar-icon" />
        <span className="titlebar-title">{win.title}</span>
        <div
          className="titlebar-buttons"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="titlebar-btn minimize"
            onClick={(e) => {
              e.stopPropagation()
              minimizeWindow(win.id)
            }}
            aria-label="Minimize"
          />
          <button
            type="button"
            className="titlebar-btn maximize"
            onClick={(e) => {
              e.stopPropagation()
              toggleMaximize(win.id)
            }}
            aria-label="Maximize"
          />
          <button
            type="button"
            className="titlebar-btn close"
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(win.id)
            }}
            aria-label="Close"
          />
        </div>
      </div>
      <div className="xp-window-body">
        <AppContent appId={win.appId} onClose={() => closeWindow(win.id)} />
      </div>
      {!win.maximized && (
        <>
          {moveHandles.map((className) => (
            <div
              key={className}
              className={`xp-move-handle ${className}`}
              onMouseDown={startDrag}
            />
          ))}
          {resizeHandles.map(({ dir, className }) => (
            <div
              key={dir}
              className={`xp-resize-handle ${className}`}
              onMouseDown={(e) => startResize(dir, e)}
            />
          ))}
        </>
      )}
    </div>
  )
}
