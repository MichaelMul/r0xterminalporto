import { useState } from 'react'
import { profile } from '../data/portfolio'

const bookmarks = [
  { name: 'Email R0xyy', url: `mailto:${profile.email}` },
  { name: 'YouTube Channel', url: 'https://www.youtube.com/@R0xyy' },
  { name: 'Harvard CS50', url: 'https://cs50.harvard.edu/' },
]

export function InternetExplorerApp() {
  const [url, setUrl] = useState('https://cs50.harvard.edu/')
  const [currentUrl, setCurrentUrl] = useState('https://cs50.harvard.edu/')

  const navigate = () => {
    let target = url.trim()
    if (target.startsWith('mailto:')) {
      window.location.href = target
      return
    }
    if (!target.startsWith('http')) {
      target = `https://${target}`
    }
    setCurrentUrl(target)
    setUrl(target)
  }

  return (
    <div className="app-content app-content--fill ie-app">
      <div className="ie-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>
      <div className="ie-toolbar">
        <button type="button" className="xp-button" disabled>
          ◀
        </button>
        <button type="button" className="xp-button" disabled>
          ▶
        </button>
        <button type="button" className="xp-button" onClick={() => navigate()}>
          🏠
        </button>
        <button type="button" className="xp-button" onClick={() => navigate()}>
          🔄
        </button>
      </div>
      <div className="ie-addressbar">
        <span>Address</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && navigate()}
        />
        <button type="button" className="xp-button" onClick={navigate}>
          Go
        </button>
      </div>
      <div className="ie-bookmarks">
        {bookmarks.map((b) => (
          <button
            key={b.name}
            type="button"
            className="ie-bookmark"
            onClick={() => {
              setUrl(b.url)
              if (b.url.startsWith('mailto:')) {
                window.location.href = b.url
              } else {
                setCurrentUrl(b.url)
              }
            }}
          >
            {b.name}
          </button>
        ))}
      </div>
      <iframe
        className="ie-frame"
        src={currentUrl}
        title="Internet Explorer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  )
}
