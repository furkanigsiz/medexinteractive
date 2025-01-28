import React from 'react';
import './DepartmentProjects.css';

const getDepartmentName = (id) => {
  const names = {
    'it': 'IT',
    'research': 'Research',
    'data': 'Data',
    'biotech': 'Biotech',
    'medical': 'Medical',
    'ai': 'AI',
    'pharma': 'Pharma',
    'genomics': 'Genomics',
    'innovation': 'Innovation',
    'digital': 'Digital'
  };
  return names[id] || id;
};

const DepartmentProjects = ({ department, projects, onClose }) => {
  return (
    <div className={`department-projects ${department ? 'active' : ''}`}>
      <div className="projects-header">
        <h1>{getDepartmentName(department)} Departmanı Projeleri</h1>
        <button onClick={onClose} className="close-button"> 
          <span>&times;</span>
        </button>
      </div>
      <div className="projects-grid"> 
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-image">
              <img src={project.image} alt={project.title} />
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-status">
                  <span className={`status-badge ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentProjects; 