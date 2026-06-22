import { skills, languages } from '../data/portfolio'

export function SkillsApp() {
  return (
    <div className="app-content skills-app">
      <p className="skills-intro">
        Technical skills and expertise from my education, courses, and hands-on
        experience:
      </p>
      <div className="skills-list">
        {skills.map((group) => (
          <div key={group.category} className="skill-group">
            <h3>{group.category}</h3>
            <div className="skill-items">
              {group.items.map((skill) => (
                <div key={skill} className="skill-item">
                  <span className="skill-dot" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="skill-group">
        <h3>Languages</h3>
        <div className="skill-items">
          {languages.map((lang) => (
            <div key={lang} className="skill-item">
              <span className="skill-dot" />
              {lang}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
