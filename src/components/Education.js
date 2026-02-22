import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBook, FiGlobe, FiAward, FiHeart, FiMapPin, FiCheck } from 'react-icons/fi';

const Education = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const education = [
    {
      icon: <FiBook />,
      degree: 'BFA, Illustration',
      school: 'College for Creative Studies',
      location: 'Detroit, MI',
    },
    {
      icon: <FiGlobe />,
      degree: 'Study Abroad',
      school: 'Studio Art Center International',
      location: 'Florence, Italy',
      description: 'Graphic Design & Illustration',
    },
  ];

  const accomplishments = [
    'Award of Excellence Scholarship Recipient',
    'Commissioned Illustrator for NPR\'s How I Built This Podcast',
    'Designed digital solutions impacting 2M+ users in government services',
    'Led 10+ successful projects for mission-driven organizations and social enterprises',
  ];

  const interests = [
    { label: 'Gardening', detail: 'beginner' },
    { label: 'Cooking', detail: 'Turkey Chili Master' },
    { label: 'Community Design', detail: null },
  ];

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
  };

  return (
    <section className="education section" id="education">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Education & Accomplishments
        </motion.h2>

        {/* Top row: 3 columns */}
        <motion.div
          ref={ref}
          className="education-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {education.map((edu, index) => (
            <motion.div
              className="education-card"
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="education-icon">{edu.icon}</div>
              <h3 className="education-degree">{edu.degree}</h3>
              <p className="education-school">{edu.school}</p>
              <p className="education-location"><FiMapPin style={{ marginRight: '4px', verticalAlign: 'middle' }} />{edu.location}</p>
              {edu.description && (
                <p style={{ color: 'var(--medium-gray)', marginTop: '8px', fontSize: '0.9rem' }}>
                  {edu.description}
                </p>
              )}
            </motion.div>
          ))}

          <motion.div
            className="education-card"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="education-icon"><FiHeart /></div>
            <h3 className="education-degree">Interests</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
              {interests.map((interest, i) => (
                <motion.span
                  key={i}
                  style={{
                    background: 'var(--accent-yellow-light)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ scale: 1.05, background: '#f2c031' }}
                >
                  {interest.label}
                  {interest.detail && (
                    <span style={{ color: 'var(--medium-gray)', marginLeft: '4px' }}>
                      ({interest.detail})
                    </span>
                  )}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom row: Accomplishments full width */}
        <motion.div
          className="education-card education-accomplishments"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div className="education-icon" style={{ margin: 0 }}><FiAward /></div>
            <h3 className="education-degree" style={{ margin: 0 }}>Accomplishments</h3>
          </div>
          <div className="accomplishments-grid">
            {accomplishments.map((item, i) => (
              <motion.div
                key={i}
                className="accomplishment-tile"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              >
                <FiCheck className="accomplishment-check" />
                <p className="accomplishment-text">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
