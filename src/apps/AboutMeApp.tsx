import { profile, education, languages } from '../data/portfolio'

export function AboutMeApp() {
  return (
    <div className="app-content about-app">
      <div className="about-header">
        <div className="about-avatar">👤</div>
        <div>
          <h2>{profile.name}</h2>
          <p className="about-title">{profile.title}</p>
          <p className="about-tagline">{profile.tagline}</p>
        </div>
      </div>
      <div className="about-body">
        {profile.bio.split('\n\n').map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
        <h3 className="about-section-title">Education</h3>
        <ul className="about-list">
          {education.map((item) => (
            <li key={item.school}>
              <strong>{item.degree}</strong> — {item.school}
              {item.period !== 'Graduated' && item.period !== 'Present' && (
                <span> ({item.period})</span>
              )}
              {item.period === 'Present' && <span> (Current)</span>}
            </li>
          ))}
        </ul>
        <h3 className="about-section-title">Languages</h3>
        <p>{languages.join(' · ')}</p>
      </div>
      <div className="about-footer">
        <span>📍 {profile.location}</span>
        <span>✉️ {profile.email}</span>
        <span>🎥 @R0xyy</span>
      </div>
    </div>
  )
}
