import { profile } from '../data/portfolio'

export function ContactApp() {
  return (
    <div className="app-content contact-app">
      <div className="contact-wizard">
        <div className="wizard-sidebar">
          <h3>Contact Me</h3>
          <p>Get in touch!</p>
        </div>
        <div className="wizard-content">
          <h2>Let's Connect</h2>
          <p>
            I'm always open to discussing new projects, creative ideas, or
            opportunities to collaborate.
          </p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`} className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <span>{profile.email}</span>
              </div>
            </a>
            <a href="https://www.youtube.com/@R0xyy" target="_blank" rel="noreferrer" className="contact-item">
              <span className="contact-icon">🎥</span>
              <div>
                <strong>YouTube</strong>
                <span>@R0xyy</span>
              </div>
            </a>
            <div className="contact-item static">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Location</strong>
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
