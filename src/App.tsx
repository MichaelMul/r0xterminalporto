import { useState } from 'react'
import type { SessionState } from './types'
import { AudioProvider } from './context/AudioContext'
import { PersonalizationProvider } from './context/PersonalizationContext'
import { WindowProvider } from './context/WindowContext'
import { BootScreen } from './components/BootScreen'
import { LoginScreen } from './components/LoginScreen'
import { Desktop } from './components/Desktop'
import { Taskbar } from './components/Taskbar'
import './styles/xp.css'

function DesktopSession({
  onShutdown,
}: {
  onShutdown: () => void
}) {
  const [startOpen, setStartOpen] = useState(false)

  return (
    <PersonalizationProvider>
      <AudioProvider>
        <WindowProvider>
          <div className="desktop-session">
            <Desktop />
            <Taskbar
              startOpen={startOpen}
              onToggleStart={() => setStartOpen((o) => !o)}
              onShutdown={onShutdown}
            />
          </div>
        </WindowProvider>
      </AudioProvider>
    </PersonalizationProvider>
  )
}

function App() {
  const [session, setSession] = useState<SessionState>('boot')

  if (session === 'boot') {
    return <BootScreen onComplete={() => setSession('login')} />
  }

  if (session === 'login') {
    return <LoginScreen onLogin={() => setSession('desktop')} />
  }

  if (session === 'shutdown') {
    return (
      <div className="shutdown-screen">
        <p>It is now safe to turn off your computer.</p>
        <button type="button" onClick={() => setSession('boot')}>
          Restart
        </button>
      </div>
    )
  }

  return <DesktopSession onShutdown={() => setSession('shutdown')} />
}

export default App
