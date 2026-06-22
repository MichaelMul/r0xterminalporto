import { useState } from 'react'
import { useDesktopIcons } from '../hooks/useDesktopIcons'
import { usePersonalization } from '../context/PersonalizationContext'
import { useWindows } from '../context/WindowContext'
import { DesktopIcon } from './DesktopIcon'
import { Window } from './Window'

export function Desktop() {
  const { windows, activeWindowId, openApp } = useWindows()
  const { icons, moveIcon } = useDesktopIcons()
  const { wallpaperStyle } = usePersonalization()
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(
    null,
  )

  return (
    <div
      className="desktop"
      style={wallpaperStyle}
      onContextMenu={(e) => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
      onClick={() => setContextMenu(null)}
    >
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.appId}
          appId={icon.appId}
          label={icon.label}
          x={icon.x}
          y={icon.y}
          onMove={moveIcon}
        />
      ))}

      {windows.map((win) => (
        <Window
          key={win.id}
          window={win}
          isActive={activeWindowId === win.id}
        />
      ))}

      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              openApp('display-properties')
              setContextMenu(null)
            }}
          >
            Properties
          </button>
          <button
            type="button"
            onClick={() => {
              openApp('display-properties')
              setContextMenu(null)
            }}
          >
            Change Desktop Background...
          </button>
          <div className="context-separator" />
          <button type="button" onClick={() => setContextMenu(null)}>
            Refresh
          </button>
          <div className="context-separator" />
          <button type="button" onClick={() => setContextMenu(null)}>
            Arrange Icons By
          </button>
        </div>
      )}
    </div>
  )
}
