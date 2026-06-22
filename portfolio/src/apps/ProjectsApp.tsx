import { projects, experience, courses } from '../data/portfolio'

export function ProjectsApp() {

  return (
    <div className="app-content projects-app">
      <div className="explorer-toolbar">
        <button type="button" className="xp-button" disabled>
          ◀ Back
        </button>
        <button type="button" className="xp-button" disabled>
          ▶ Forward
        </button>
        <button type="button" className="xp-button" disabled>
          ▲ Up
        </button>
        <span className="explorer-address">Address: C:\Projects</span>
      </div>

      <div className="portfolio-pdf-banner">
        <div className="project-icon">🎥</div>
        <div className="project-info">
          <h3>R0xyy YouTube Channel</h3>
          <p>Visit my channel to watch my Anime Music Videos (AMVs) and creative edits!</p>
          <div className="portfolio-pdf-actions">
            <a
              href="https://www.youtube.com/@R0xyy"
              target="_blank"
              rel="noreferrer"
              className="xp-button xp-button-link"
            >
              Visit Channel
            </a>
          </div>
        </div>
      </div>

      <h3 className="section-heading">Projects</h3>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.name} className="project-card">
            <div className="project-icon">📁</div>
            <div className="project-info">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((t) => (
                  <span key={t} className="tech-badge">
                    {t}
                  </span>
                ))}
              </div>
              <a href={project.link} className="xp-link" target="_blank" rel="noreferrer">
                View Project →
              </a>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-heading">Experience</h3>
      <div className="projects-grid">
        {experience.map((item) => (
          <div key={`${item.organization}-${item.period}`} className="project-card">
            <div className="project-icon">💼</div>
            <div className="project-info">
              <h3>{item.role}</h3>
              <p className="project-meta">
                {item.organization}
                {item.location ? ` · ${item.location}` : ''} · {item.period}
              </p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-heading">Courses</h3>
      <div className="projects-grid">
        {courses.map((course) => (
          <div key={course.name} className="project-card">
            <div className="project-icon">🎓</div>
            <div className="project-info">
              <h3>{course.name}</h3>
              <p className="project-meta">
                {course.provider} · {course.period}
              </p>
              <p>{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
