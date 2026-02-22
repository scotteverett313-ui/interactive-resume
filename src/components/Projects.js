import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiX, FiExternalLink, FiTag } from 'react-icons/fi';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Close on Escape key + lock body scroll when modal is open
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [selectedProject]);

  const filters = ['all', 'UX/UI', 'Branding', 'Government', 'Education'];

  const projects = [
    {
      title: 'State Benefits Platform',
      category: 'Government',
      description: 'Multi-agency platform improving access to benefits for Detroit residents, serving 2M+ users.',
      longDescription: 'Led end-to-end UX design for a multi-agency benefits platform serving Detroit residents. Conducted extensive user research, accessibility audits, and iterative prototyping to streamline complex government workflows into an intuitive, inclusive experience.',
      tags: ['UX Research', 'Prototyping', 'Accessibility'],
      tools: ['Figma', 'Miro', 'UserZoom'],
      role: 'Lead UX Designer',
      outcome: '2M+ users served · 35% reduction in form drop-off rate',
      image: '/projects/state-benefits.png',
      link: null,
    },
    {
      title: 'AADL Black History Bicentennial Project',
      category: 'Illustration',
      description: 'One of ten artists creating prints for our circulating collection — with eight selected works becoming a new mural on Library Lane.',
      longDescription: 'Selected as one of ten featured artists for the Ann Arbor District Library\'s Black History Bicentennial collection. Eight of my original prints were chosen to become a permanent public mural on Library Lane, celebrating 200 years of Black history and culture.',
      tags: ['Illustration', 'Branding', 'Editorial'],
      tools: ['Procreate', 'Adobe Illustrator', 'Adobe Photoshop'],
      role: 'Illustrator & Artist',
      outcome: '8 works selected for permanent public mural on Library Lane',
      image: '/projects/npr.jpg',
      link: null,
    },
    {
      title: 'Digital Ecosystem Design',
      category: 'UX/UI',
      description: 'End-to-end branding and web design increasing client conversions by up to 40%.',
      longDescription: 'Designed complete digital ecosystems for mission-driven organizations — from brand identity and design systems to responsive web experiences. Integrated SEO strategy and content architecture to drive measurable results.',
      tags: ['Web Design', 'SEO', 'Content Strategy'],
      tools: ['Figma', 'WordPress', 'Adobe Suite'],
      role: 'UX/UI Designer & Strategist',
      outcome: 'Up to 40% increase in client conversions',
      image: '/projects/digital-ecosystem.jpg',
      link: null,
    },
    {
      title: 'Civic Tech Curriculum',
      category: 'Education',
      description: 'Project-based curriculum spanning design thinking, interaction and experience design, visual storytelling, and digital media — from web and app design to foundational digital literacy.',
      longDescription: 'Developed and taught a comprehensive civic tech curriculum for underserved youth in Detroit. Students built real-world digital products addressing community challenges, learning design thinking, prototyping, and storytelling along the way.',
      tags: ['Curriculum Design', 'Mentorship', 'Innovation'],
      tools: ['Figma', 'Notion', 'Google Workspace'],
      role: 'Curriculum Designer & Educator',
      outcome: '10+ cohorts · Hundreds of students empowered with digital skills',
      image: '/projects/civic-tech.jpg',
      link: null,
    },
    {
      title: 'Journey Map Illustrations',
      category: 'UX/UI',
      description: 'Illustrated journey maps and walkthroughs for complex government processes.',
      longDescription: 'Created a series of illustrated journey maps to make dense, complex government service flows legible and human. These visual tools were used in stakeholder presentations, public-facing guides, and internal UX documentation.',
      tags: ['Illustration', 'UX Design', 'Visual Communication'],
      tools: ['Procreate', 'Figma', 'Adobe Illustrator'],
      role: 'UX Illustrator',
      outcome: 'Used across 5+ state agencies to improve service communication',
      image: '/projects/journey-maps.jpg',
      link: null,
    },
    {
      title: 'Mobile Prototype Suite',
      category: 'UX/UI',
      description: '75+ web & mobile prototypes for large-scale state and federal initiatives.',
      longDescription: 'Built an extensive library of 75+ interactive web and mobile prototypes for state and federal digital service initiatives. Each prototype was tested with real users and iterated rapidly to meet accessibility standards and agency requirements.',
      tags: ['Mobile Design', 'Prototyping', 'User Testing'],
      tools: ['Figma', 'InVision', 'Maze'],
      role: 'Senior UX Designer',
      outcome: '75+ prototypes delivered · Multiple federal accessibility certifications',
      image: '/projects/mobile-prototypes.jpg',
      link: null,
    },
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Featured Projects
        </motion.h2>

        <motion.div
          className="projects-filter"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </motion.div>

        <motion.div
          ref={ref}
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                className="project-card"
                key={project.title}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProject(project)}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-image">
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {/* Hover overlay hint */}
                  <div className="project-hover-overlay">
                    <span className="project-hover-label">View Project</span>
                  </div>
                </div>
                <div className="project-content">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span className="project-tag" key={i}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Modal Overlay ── */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedProject(null)}
            />

            {/* Modal Panel */}
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, x: '-50%', y: 'calc(-50% + 40px)', scale: 0.95 }}
              animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
              exit={{ opacity: 0, x: '-50%', y: 'calc(-50% + 40px)', scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Close Button */}
              <button
                className="modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <FiX />
              </button>

              {/* Hero Image */}
              <div className="modal-image">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                />
              </div>

              {/* Content */}
              <div className="modal-body">
                <div className="modal-meta">
                  <span className="modal-category">{selectedProject.category}</span>
                  <span className="modal-role">{selectedProject.role}</span>
                </div>

                <h2 className="modal-title">{selectedProject.title}</h2>

                <p className="modal-description">{selectedProject.longDescription}</p>

                {/* Outcome */}
                <div className="modal-outcome">
                  <span className="modal-outcome-label">Impact</span>
                  <p className="modal-outcome-text">{selectedProject.outcome}</p>
                </div>

                {/* Tools */}
                <div className="modal-section">
                  <span className="modal-section-label">
                    <FiTag style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Tools Used
                  </span>
                  <div className="modal-tools">
                    {selectedProject.tools.map((tool, i) => (
                      <span className="modal-tool-tag" key={i}>{tool}</span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="modal-section">
                  <span className="modal-section-label">Disciplines</span>
                  <div className="modal-tools">
                    {selectedProject.tags.map((tag, i) => (
                      <span className="modal-discipline-tag" key={i}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-cta"
                  >
                    View Case Study <FiExternalLink style={{ marginLeft: '8px' }} />
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
