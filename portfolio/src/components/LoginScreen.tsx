import { profile } from '../data/portfolio'

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="login-instruction">
          <p>To begin, click your user name</p>
        </div>
        <div className="login-users">
          <button type="button" className="login-user" onClick={onLogin}>
            <div className="login-avatar">👤</div>
            <span>{profile.name}</span>
          </button>
          <button type="button" className="login-user guest" onClick={onLogin}>
            <div className="login-avatar guest-avatar">👥</div>
            <span>Guest</span>
          </button>
        </div>
      </div>
      <div className="login-right">
        <div className="login-windows-logo">
          <span className="boot-flag" />
          <span className="boot-flag" />
          <span className="boot-flag" />
          <span className="boot-flag" />
        </div>
        <span className="login-microsoft">Microsoft</span>
        <span className="login-windows">Windows XP</span>
        <span className="login-home">Home Edition</span>
        <p className="login-after">
          After you log on, you can add or change accounts.
        </p>
        <p className="login-turn-off">Turn off computer</p>
      </div>
    </div>
  )
}
