import { useEffect, useState } from 'react'
import { getApp } from '../data/apps'
import { useAudio } from '../context/AudioContext'
import { useWindows } from '../context/WindowContext'
import { StartMenu } from './StartMenu'

interface TaskbarProps {
  startOpen: boolean
  onToggleStart: () => void
  onShutdown: () => void
}

export function Taskbar({ startOpen, onToggleStart, onShutdown }: TaskbarProps) {
  const { windows, activeWindowId, openApp, restoreWindow, minimizeWindow } = useWindows()
  const { muted, toggleMute } = useAudio()
  const [time, setTime] = useState('')
  const [showVolume, setShowVolume] = useState(false)

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const openWindows = windows.filter((w) => !w.minimized)
  const minimizedWindows = windows.filter((w) => w.minimized)

  return (
    <div className="taskbar">
      <button
        type="button"
        className={`start-button ${startOpen ? 'pressed' : ''}`}
        onClick={onToggleStart}
      >
        <span className="start-logo" />
        <span>start</span>
      </button>

      <div className="taskbar-programs">
        {[...openWindows, ...minimizedWindows].map((win) => {
          const app = getApp(win.appId)
          const isActive = activeWindowId === win.id && !win.minimized
          return (
            <button
              key={win.id}
              type="button"
              className={`taskbar-btn ${isActive ? 'active' : ''} ${win.minimized ? 'minimized' : ''}`}
              onClick={() => {
                if (win.minimized || activeWindowId !== win.id) {
                  restoreWindow(win.id)
                } else {
                  minimizeWindow(win.id)
                }
              }}
            >
              <img src={app?.icon} alt="" />
              <span>{app?.title}</span>
            </button>
          )
        })}
      </div>

      <div className="system-tray">
        <div className="tray-volume-wrap">
          <button
            type="button"
            className="tray-icon tray-btn"
            title={muted ? 'Unmute' : 'Volume'}
            onClick={() => setShowVolume((open) => !open)}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          {showVolume && (
            <div className="tray-volume-popup">
              <button type="button" className="xp-button" onClick={toggleMute}>
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <button
                type="button"
                className="xp-button"
                onClick={() => openApp('music-player')}
              >
                Open Media Player
              </button>
            </div>
          )}
        </div>
        <span className="tray-icon" title="Network">🌐</span>
        <span className="tray-clock">{time}</span>
      </div>

      <StartMenu
        open={startOpen}
        onClose={onToggleStart}
        onOpenApp={openApp}
        onShutdown={onShutdown}
      />
    </div>
  )
}
