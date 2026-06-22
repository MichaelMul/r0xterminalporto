import { useState } from 'react'
import { profile } from '../data/portfolio'
import type { AppId } from '../types'
import { useWindows } from '../context/WindowContext'

const folders = [
  { name: 'Local Disk (C:)', icon: '💾', type: 'drive' },
  { name: 'Documents', icon: '📁', type: 'folder' },
  { name: 'Projects', icon: '📁', type: 'folder' },
  { name: 'Education', icon: '📁', type: 'folder' },
]

type FileItem = {
  name: string
  icon: string
  appId?: AppId
  href?: string
}

const fileMap: Record<string, FileItem[]> = {
  Documents: [
    { name: 'youtube_channel.url', icon: '🔗', href: 'https://www.youtube.com/@R0xyy' },
    { name: 'about_r0xyy.txt', icon: '📄' },
  ],
  Projects: [
    { name: 'R0xyy_YouTube_Channel.url', icon: '🔗', href: 'https://www.youtube.com/@R0xyy' },
    { name: 'Hearts2Hearts Album', icon: '🎵', appId: 'music-player' },
    { name: 'cs50-final.zip', icon: '📄' },
    { name: 'web-dev-portfolio.html', icon: '📄' },
  ],
  Education: [
    { name: 'harvard-cs50.txt', icon: '📄' },
    { name: 'online-courses.txt', icon: '📄' },
    { name: 'editing-skills.txt', icon: '📄' },
  ],
}

export function MyComputerApp() {
  const { openApp } = useWindows()
  const [path, setPath] = useState('My Computer')
  const [history, setHistory] = useState<string[]>(['My Computer'])

  const files = fileMap[path] ?? []

  const navigateTo = (nextPath: string) => {
    setPath(nextPath)
    setHistory((prev) => [...prev, nextPath])
  }

  const goBack = () => {
    if (history.length <= 1) return
    const nextHistory = history.slice(0, -1)
    setHistory(nextHistory)
    setPath(nextHistory[nextHistory.length - 1])
  }

  const openFile = (file: FileItem) => {
    if (file.appId) {
      openApp(file.appId)
      return
    }
    if (file.href) {
      window.open(file.href, '_blank')
    }
  }

  return (
    <div className="app-content explorer-app">
      <div className="explorer-toolbar">
        <button
          type="button"
          className="xp-button"
          disabled={history.length <= 1}
          onClick={goBack}
        >
          ◀ Back
        </button>
        <button type="button" className="xp-button" disabled>
          ▶ Forward
        </button>
        <button
          type="button"
          className="xp-button"
          onClick={() => {
            setPath('My Computer')
            setHistory(['My Computer'])
          }}
        >
          ▲ Up
        </button>
        <span className="explorer-address">Address: {path}</span>
      </div>
      <div className="explorer-body">
        <div className="explorer-sidebar">
          <h4>System Tasks</h4>
          <ul>
            <li>View system information</li>
            <li>Add or remove programs</li>
            <li>Change a setting</li>
          </ul>
          <h4>Other Places</h4>
          <ul>
            <li onClick={() => navigateTo('Documents')}>My Documents</li>
            <li>My Pictures</li>
            <li onClick={() => navigateTo('Projects')}>My Projects</li>
          </ul>
          <h4>Details</h4>
          <p className="explorer-details">
            <strong>PortfolioTerminal</strong>
            <br />
            Owner: {profile.name}
            <br />
            Role: {profile.title}
            <br />
            Location: {profile.location}
          </p>
        </div>
        <div className="explorer-main">
          {path === 'My Computer' &&
            folders.map((item) => (
              <button
                key={item.name}
                type="button"
                className="explorer-item"
                onDoubleClick={() => navigateTo(item.name)}
                onClick={() => navigateTo(item.name)}
              >
                <span className="explorer-item-icon">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          {path !== 'My Computer' &&
            files.map((item) => (
              <button
                key={item.name}
                type="button"
                className="explorer-item"
                onDoubleClick={() => openFile(item)}
                title={item.appId || item.href ? 'Double-click to open' : undefined}
              >
                <span className="explorer-item-icon">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
