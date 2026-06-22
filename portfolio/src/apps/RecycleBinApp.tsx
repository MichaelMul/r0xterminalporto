export function RecycleBinApp() {
  return (
    <div className="app-content recycle-app">
      <div className="recycle-empty">
        <span className="recycle-icon">🗑️</span>
        <p>Recycle Bin is empty</p>
        <p className="recycle-hint">
          Items you delete from the desktop are moved to the Recycle Bin.
        </p>
      </div>
    </div>
  )
}
