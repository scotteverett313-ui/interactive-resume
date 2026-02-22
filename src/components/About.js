import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiTarget, FiCpu, FiUsers, FiGlobe } from 'react-icons/fi';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const highlights = [
    {
      icon: <FiTarget />,
      title: 'Human-Centered Design',
      description: 'Full-cycle UX from discovery to implementation',
    },
    {
      icon: <FiCpu />,
      title: 'AI in Design',
      description: 'Research synthesis & rapid prototyping',
    },
    {
      icon: <FiUsers />,
      title: 'Accessibility',
      description: 'Inclusive digital products for all users',
    },
    {
      icon: <FiGlobe />,
      title: 'Social Impact',
      description: 'Mission-driven design for positive change',
    },
  ];

  return (
    <section className="about section" id="about">
      <div className="container">
        <motion.div
          ref={ref}
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className="about-image-wrapper" variants={itemVariants}>
            <div className="about-image-accent"></div>
            <img
              src="/scott.png"
              alt="Scott Everett"
              className="about-img"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </motion.div>

          <div className="about-text">
            <motion.h2 className="section-title" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.h3 variants={itemVariants}>
              Designing Digital Experiences That Drive Measurable Social Impact
            </motion.h3>
            <motion.p variants={itemVariants}>
              Currently Founder of SE|Design serving 20+ mission-driven clients and UX Lecturer at
              the University of Michigan. Expert in full-cycle UX process from discovery and user
              research through design systems implementation.
            </motion.p>
            <motion.p variants={itemVariants}>
              With a proven track record of translating complex user needs into intuitive solutions
              that serve 2M+ users while mentoring design teams and presenting to stakeholders.
              Passionate about accessibility, inclusive design, and creating digital products that matter.
            </motion.p>

            <motion.div className="about-highlights" variants={itemVariants}>
              {highlights.map((highlight, index) => (
                <motion.div
                  className="about-highlight"
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="highlight-icon">{highlight.icon}</div>
                  <div className="highlight-text">
                    <h4>{highlight.title}</h4>
                    <p>{highlight.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
