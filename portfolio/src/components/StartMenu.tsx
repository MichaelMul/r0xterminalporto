import { apps } from '../data/apps'
import type { AppId } from '../types'

interface StartMenuProps {
  open: boolean
  onClose: () => void
  onOpenApp: (appId: AppId) => void
  onShutdown: () => void
}

export function StartMenu({ open, onClose, onOpenApp, onShutdown }: StartMenuProps) {
  if (!open) return null

  const startApps = apps.filter((a) => a.startMenu)

  return (
    <>
      <div className="start-menu-overlay" onClick={onClose} />
      <div className="start-menu">
        <div className="start-menu-header">
          <span className="start-user-icon">👤</span>
          <span>User</span>
        </div>
        <div className="start-menu-body">
          <div className="start-menu-left">
            <div className="start-menu-pinned">
              {startApps.slice(0, 6).map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="start-menu-item"
                  onClick={() => {
                    onOpenApp(app.id)
                    onClose()
                  }}
                >
                  <img src={app.icon} alt="" />
                  <span>{app.title}</span>
                </button>
              ))}
            </div>
            <div className="start-menu-separator" />
            <div className="start-menu-all">
              <button type="button" className="start-menu-item all-programs">
                <span>All Programs</span>
                <span className="arrow">▶</span>
              </button>
              {startApps.slice(6).map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="start-menu-item sub"
                  onClick={() => {
                    onOpenApp(app.id)
                    onClose()
                  }}
                >
                  <img src={app.icon} alt="" />
                  <span>{app.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="start-menu-right">
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>🖥️</span> My Documents
            </button>
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>🖼️</span> My Pictures
            </button>
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>🎵</span> My Music
            </button>
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>🖥️</span> My Computer
            </button>
            <div className="start-menu-separator vertical" />
            <button
              type="button"
              className="start-menu-side"
              onClick={() => {
                onOpenApp('contact')
                onClose()
              }}
            >
              <span>✉️</span> E-mail
            </button>
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>🌐</span> Internet
            </button>
            <div className="start-menu-separator vertical" />
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>❓</span> Help and Support
            </button>
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>🔍</span> Search
            </button>
            <button type="button" className="start-menu-side" onClick={onClose}>
              <span>▶️</span> Run...
            </button>
          </div>
        </div>
        <div className="start-menu-footer">
          <button type="button" className="start-footer-btn" onClick={onClose}>
            <span>🔒</span> Log Off
          </button>
          <button
            type="button"
            className="start-footer-btn"
            onClick={() => {
              onShutdown()
              onClose()
            }}
          >
            <span>⏻</span> Turn Off Computer
          </button>
        </div>
      </div>
    </>
  )
}
