import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
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

  const stats = [
    { number: '13+', label: 'Years Experience' },
    { number: '2M+', label: 'Users Impacted' },
    { number: '20+', label: 'Clients Served' },
  ];

  return (
    <section className="hero" id="hero">
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-text">
            <motion.div className="availability-badge" variants={itemVariants}>
              <span className="status-dot"></span>
              <span>Available for Work</span>
              <span className="divider">•</span>
              <span>📍 Detroit, MI</span>
            </motion.div>
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Omni Designer & Educator
            </motion.p>
            <motion.h1 className="hero-title" variants={itemVariants}>
              Hi, I'm <span className="name">Scott Everett</span>
            </motion.h1>
            <motion.p className="hero-description" variants={itemVariants}>
              Leading mission-driven digital experiences for nonprofits, government agencies,
              and social enterprises. Translating complex user needs into intuitive solutions
              that create measurable social impact.
            </motion.p>
            <motion.div className="hero-cta" variants={itemVariants}>
              <a href="#contact" className="btn btn-primary">
                Get in Touch
              </a>
              <a href="#projects" className="btn btn-outline">
                View My Work
              </a>
            </motion.div>
            <motion.div className="hero-stats" variants={itemVariants}>
              {stats.map((stat, index) => (
                <div className="stat" key={index}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="hero-image"
            variants={itemVariants}
          >
            <div className="hero-image-wrapper">
              <div className="hero-image-bg"></div>
              <img
                src="/scott.png"
                alt="Scott Everett"
                className="hero-img"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
