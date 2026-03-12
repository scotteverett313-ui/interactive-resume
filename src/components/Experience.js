import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const experiences = [
    {
      date: 'May 2024 - Present',
      role: 'Founder & Lead Designer',
      company: 'SE|Design Studio',
      location: 'Detroit, MI',
      description: [
        'Branding, websites & digital ecosystems for 20+ clients',
        'Increased traffic and conversions by up to 40%',
        'SEO, content strategy & digital storytelling',
      ],
    },
    {
      date: 'Sep 2022 - Present',
      role: 'Lecturer',
      company: 'University of Michigan',
      location: 'Flint, MI',
      description: [
        'Teach 25+ students in human-centered design & civic tech',
        'Project-based curriculum in sustainability & healthcare',
        'Mentor students through real-world design challenges',
      ],
    },
    {
      date: 'Sep 2018 - 2022',
      role: 'Sr. UX/UI Designer',
      company: 'Civilla',
      location: 'Detroit, MI',
      description: [
        'Built 75+ web & mobile prototypes for state/federal initiatives',
        'User research informing services for 2M+ residents',
        'Design lead on multi-agency benefits platform',
        'Journey maps, walkthroughs & brand collateral',
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // GSAP ScrollTrigger — draw the timeline line as user scrolls
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.timeline-line-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 75%',
            end: 'bottom 35%',
            scrub: 1.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="experience section" id="experience">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Experience
        </motion.h2>

        <motion.div
          ref={ref}
          className="timeline"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* GSAP animated line — draws as you scroll */}
          <div className="timeline-line-fill" />

          {experiences.map((exp, index) => (
            <motion.div
              className="timeline-item"
              key={index}
              variants={itemVariants}
            >
              <div className="timeline-dot"></div>
              <motion.div
                className="timeline-content"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <span className="timeline-date">{exp.date}</span>
                <h3 className="timeline-role">{exp.role}</h3>
                <p className="timeline-company">{exp.company}</p>
                <p className="timeline-location">📍 {exp.location}</p>
                <ul className="timeline-description">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
