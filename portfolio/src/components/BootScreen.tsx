import { useEffect, useState } from 'react'

interface BootScreenProps {
  onComplete: () => void
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 400)
          return 100
        }
        return p + Math.random() * 15 + 5
      })
    }, 200)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="boot-screen">
      <div className="boot-logo">
        <div className="boot-windows-logo">
          <span className="boot-flag" />
          <span className="boot-flag" />
          <span className="boot-flag" />
          <span className="boot-flag" />
        </div>
        <span className="boot-microsoft">Microsoft</span>
        <span className="boot-edition">Windows XP</span>
      </div>
      <div className="boot-loader">
        <div className="boot-bar-track">
          <div
            className="boot-bar-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="boot-text">Starting up...</p>
      </div>
      <p className="boot-copyright">
        Copyright © 1985-2001 Microsoft Corporation
      </p>
    </div>
  )
}
