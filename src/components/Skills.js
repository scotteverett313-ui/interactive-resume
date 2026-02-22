import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animated counter component
const AnimatedPercentage = ({ target, inView, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Delay the start of counting based on the card's stagger delay
    const startDelay = setTimeout(() => {
      const duration = 1500; // 1.5 seconds for the count
      const steps = 60; // Number of steps in the animation
      const increment = target / steps;
      const stepDuration = duration / steps;

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
    }, delay * 1000);

    return () => clearTimeout(startDelay);
  }, [inView, target, delay]);

  return <>{count}%</>;
};

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px',
  });

  const skillCategories = [
    {
      title: 'Design Tools',
      percentage: 200,
      skills: ['Figma', 'Adobe Suite', 'Procreate'],
    },
    {
      title: 'UX/UI Methods',
      percentage: 90,
      skills: ['Prototyping', 'Usability Testing', 'Design Systems'],
    },
    {
      title: 'AI in Design',
      percentage: 80,
      skills: ['Research Synthesis', 'Content Generation', 'Workflow Optimization'],
    },
    {
      title: 'Strategy',
      percentage: 95,
      skills: ['Human-Centered Design', 'Journey Mapping', 'Storytelling'],
    },
    {
      title: 'Platforms',
      percentage: 98,
      skills: ['WordPress', 'WIX', 'SEO'],
    },
    {
      title: 'Leadership',
      percentage: 89,
      skills: ['Client Presentations', 'Team Mentoring', 'Workshop Facilitation'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="skills section" id="skills">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Core Skills
        </motion.h2>

        <motion.div
          ref={ref}
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {skillCategories.map((category, index) => (
            <motion.div
              className="skill-category"
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Title */}
              <h3 className="skill-title">{category.title}</h3>

              {/* Big Percentage with counting animation */}
              <motion.div
                className="skill-percentage"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: 'spring' }}
              >
                <AnimatedPercentage
                  target={category.percentage}
                  inView={inView}
                  delay={index * 0.1}
                />
              </motion.div>

              {/* Subtle skill list */}
              <p className="skill-details">
                {category.skills.join(' · ')}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
