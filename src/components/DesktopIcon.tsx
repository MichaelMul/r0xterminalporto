import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppId } from '../types'
import { getApp } from '../data/apps'
import { useWindows } from '../context/WindowContext'

interface DesktopIconProps {
  appId: AppId
  label: string
  x: number
  y: number
  onMove: (appId: AppId, x: number, y: number) => void
}

const DRAG_THRESHOLD = 5
const ICON_WIDTH = 76
const ICON_HEIGHT = 72

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function DesktopIcon({ appId, label, x, y, onMove }: DesktopIconProps) {
  const { openApp } = useWindows()
  const [selected, setSelected] = useState(false)
  const [position, setPosition] = useState({ x, y })
  const [isDragging, setIsDragging] = useState(false)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressClick = useRef(false)
  const positionRef = useRef({ x, y })
  const dragState = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })
  const app = getApp(appId)

  useEffect(() => {
    const next = { x, y }
    setPosition(next)
    positionRef.current = next
  }, [x, y])

  const clearClickTimer = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
    }
  }

  const getBounds = useCallback(() => {
    const desktop = document.querySelector('.desktop')
    const rect = desktop?.getBoundingClientRect()
    const maxX = (rect?.width ?? window.innerWidth) - ICON_WIDTH
    const maxY = (rect?.height ?? window.innerHeight - 30) - ICON_HEIGHT
    return { maxX: Math.max(0, maxX), maxY: Math.max(0, maxY) }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.current.active) return

      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY

      if (
        !dragState.current.moved &&
        (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)
      ) {
        dragState.current.moved = true
        clearClickTimer()
        setIsDragging(true)
      }

      if (!dragState.current.moved) return

      const { maxX, maxY } = getBounds()
      const next = {
        x: clamp(dragState.current.originX + dx, 0, maxX),
        y: clamp(dragState.current.originY + dy, 0, maxY),
      }
      positionRef.current = next
      setPosition(next)
    },
    [getBounds],
  )

  const handleMouseUp = useCallback(() => {
    if (!dragState.current.active) return

    if (dragState.current.moved) {
      suppressClick.current = true
      onMove(appId, positionRef.current.x, positionRef.current.y)
    }

    dragState.current.active = false
    dragState.current.moved = false
    setIsDragging(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = ''
  }, [appId, onMove, handleMouseMove])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    dragState.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }

    if (clickTimer.current) {
      clearClickTimer()
      openApp(appId)
      setSelected(false)
      return
    }

    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      setSelected(true)
    }, 250)
  }

  return (
    <button
      type="button"
      className={`desktop-icon ${selected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onBlur={() => setSelected(false)}
    >
      <img src={app?.icon} alt="" className="desktop-icon-img" draggable={false} />
      <span className="desktop-icon-label">{label}</span>
    </button>
  )
}
