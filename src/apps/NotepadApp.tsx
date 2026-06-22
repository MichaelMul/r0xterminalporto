import { readmeContent } from '../data/portfolio'

export function NotepadApp() {
  return (
    <div className="app-content app-content--fill notepad-app">
      <textarea
        className="notepad-textarea"
        defaultValue={readmeContent}
        readOnly
        spellCheck={false}
      />
    </div>
  )
}
