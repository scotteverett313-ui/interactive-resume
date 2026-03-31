import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBook, FiGlobe, FiAward, FiHeart, FiMapPin,
         FiMic, FiUsers, FiLayers } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Counts up from 0 to target when inView becomes true
const CountUp = ({ target, suffix, inView }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const steps = 50;
    const increment = target / steps;
    const stepDuration = 1400 / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span className="accomplishment-count">{count}{suffix}</span>;
};

const Education = () => {
  const sectionRef = useRef(null);

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
    {
      icon: <FiAward />,
      text: 'Award of Excellence Scholarship Recipient',
      featured: false,
    },
    {
      icon: <FiMic />,
      text: "Commissioned Illustrator for NPR's How I Built This Podcast",
      featured: true,
    },
    {
      icon: <FiUsers />,
      textParts: ['Designed digital solutions impacting ', ' users in government services'],
      countTarget: 2,
      countSuffix: 'M+',
      featured: false,
    },
    {
      icon: <FiLayers />,
      textParts: ['Led ', ' successful projects for mission-driven organizations and social enterprises'],
      countTarget: 10,
      countSuffix: '+',
      featured: false,
    },
  ];

  const interests = [
    { label: 'Gardening', emoji: '🌱', detail: 'beginner' },
    { label: 'Cooking', emoji: '🍳', detail: 'Turkey Chili Master' },
    { label: 'Community Design', emoji: '🏙️', detail: null },
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

  // GSAP ScrollTrigger stagger reveal for accomplishment tiles
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.accomplishment-tile',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.education-accomplishments',
            start: 'top 78%',
            toggleActions: 'play none none reset',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="education section" id="education" ref={sectionRef}>
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
              <p className="education-location">
                <FiMapPin style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {edu.location}
              </p>
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
                  {interest.emoji} {interest.label}
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
                className={`accomplishment-tile${item.featured ? ' accomplishment-tile--featured' : ''}`}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                style={{ opacity: 0 }}
              >
                <span className="accomplishment-icon">{item.icon}</span>
                <div className="accomplishment-body">
                  {item.featured && (
                    <span className="accomplishment-badge">Featured</span>
                  )}
                  <p className="accomplishment-text">
                    {item.textParts ? (
                      <>
                        {item.textParts[0]}
                        <CountUp
                          target={item.countTarget}
                          suffix={item.countSuffix}
                          inView={inView}
                        />
                        {item.textParts[1]}
                      </>
                    ) : item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
