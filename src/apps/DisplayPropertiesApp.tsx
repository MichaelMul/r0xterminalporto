import { useRef, useState } from 'react'
import { DEFAULT_WALLPAPER } from '../data/media'
import { usePersonalization } from '../context/PersonalizationContext'

export function DisplayPropertiesApp() {
  const { wallpaper, wallpaperStyle, setWallpaperFromFile, resetWallpaper } =
    usePersonalization()
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties | null>(
    null,
  )
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeStyle = previewStyle ?? wallpaperStyle

  const handleBrowse = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      setError(null)
      setMessage(null)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Could not read that image.'))
        reader.readAsDataURL(file)
      })
      setPendingFile(file)
      setPreviewStyle({
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      })
      setMessage(`Selected: ${file.name}. Click Apply to set as wallpaper.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load image.')
    }
  }

  const handleApply = async () => {
    if (!pendingFile) {
      setError('Choose an image first.')
      return
    }

    try {
      await setWallpaperFromFile(pendingFile)
      setPendingFile(null)
      setPreviewStyle(null)
      setMessage('Wallpaper updated successfully.')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not apply wallpaper.')
    }
  }

  const handleReset = () => {
    resetWallpaper()
    setPendingFile(null)
    setPreviewStyle(null)
    setMessage('Restored default Bliss wallpaper.')
    setError(null)
  }

  return (
    <div className="app-content display-props-app">
      <div className="display-props-layout">
        <div className="display-props-sidebar">
          <h3>Display Properties</h3>
          <ul>
            <li className="active">Desktop</li>
            <li className="disabled">Screen Saver</li>
            <li className="disabled">Appearance</li>
            <li className="disabled">Settings</li>
          </ul>
        </div>
        <div className="display-props-main">
          <h2>Desktop</h2>
          <p className="display-props-desc">
            Choose a picture from your computer to use as your desktop
            background.
          </p>

          <div className="display-preview-wrap">
            <div className="display-preview-label">Preview</div>
            <div className="display-preview" style={activeStyle} />
          </div>

          <div className="display-props-actions">
            <button
              type="button"
              className="xp-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse...
            </button>
            <button
              type="button"
              className="xp-button"
              onClick={handleApply}
              disabled={!pendingFile}
            >
              Apply
            </button>
            <button type="button" className="xp-button" onClick={handleReset}>
              Restore Default
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleBrowse}
            />
          </div>

          <p className="display-props-current">
            Current: {wallpaper ? 'Custom image' : 'Bliss (Windows XP default)'}
          </p>
          {!wallpaper && (
            <p className="display-props-note">
              Default image: {DEFAULT_WALLPAPER}
            </p>
          )}
          {message && <p className="display-props-message">{message}</p>}
          {error && <p className="display-props-error">{error}</p>}
        </div>
      </div>
    </div>
  )
}
