import type { AppId } from '../types'
import { AboutMeApp } from '../apps/AboutMeApp'
import { ProjectsApp } from '../apps/ProjectsApp'
import { SkillsApp } from '../apps/SkillsApp'
import { ContactApp } from '../apps/ContactApp'
import { NotepadApp } from '../apps/NotepadApp'
import { MyComputerApp } from '../apps/MyComputerApp'
import { RecycleBinApp } from '../apps/RecycleBinApp'
import { InternetExplorerApp } from '../apps/InternetExplorerApp'
import { CmdApp } from '../apps/CmdApp'
import { DisplayPropertiesApp } from '../apps/DisplayPropertiesApp'
import { MusicPlayerApp } from '../apps/MusicPlayerApp'
import { ReviewsApp } from '../apps/ReviewsApp'

interface AppContentProps {
  appId: AppId
  onClose?: () => void
}

export function AppContent({ appId, onClose }: AppContentProps) {
  switch (appId) {
    case 'about-me':
      return <AboutMeApp />
    case 'projects':
      return <ProjectsApp />
    case 'skills':
      return <SkillsApp />
    case 'contact':
      return <ContactApp />
    case 'notepad':
      return <NotepadApp />
    case 'my-computer':
      return <MyComputerApp />
    case 'recycle-bin':
      return <RecycleBinApp />
    case 'internet-explorer':
      return <InternetExplorerApp />
    case 'cmd':
      return <CmdApp onClose={onClose} />

    case 'display-properties':
      return <DisplayPropertiesApp />
    case 'music-player':
      return <MusicPlayerApp />
    case 'reviews':
      return <ReviewsApp />
    default:
      return <div className="app-content">Application not found.</div>
  }
}
