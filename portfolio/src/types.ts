export type SessionState = 'boot' | 'login' | 'desktop' | 'shutdown'

export type AppId =
  | 'about-me'
  | 'projects'
  | 'skills'
  | 'contact'
  | 'notepad'
  | 'my-computer'
  | 'recycle-bin'
  | 'internet-explorer'
  | 'cmd'
  | 'display-properties'
  | 'music-player'
  | 'reviews'

export interface AppDefinition {
  id: AppId
  title: string
  icon: string
  defaultWidth: number
  defaultHeight: number
  desktop?: boolean
  startMenu?: boolean
}

export interface WindowState {
  id: string
  appId: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  zIndex: number
}

export interface DesktopIconState {
  appId: AppId
  label: string
  x: number
  y: number
}
