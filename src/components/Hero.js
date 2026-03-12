import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Hero = () => {
  const heroRef = useRef(null);

  const stats = [
    { number: '13+', label: 'Years Experience' },
    { number: '2M+', label: 'Users Impacted' },
    { number: '20+', label: 'Clients Served' },
  ];

  // GSAP entrance timeline — fires once on page load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // fromTo explicitly sets START state → END state so nothing stays hidden
      tl.fromTo('.hero-badge',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5 })
        .fromTo('.hero-subtitle',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.2')
        .fromTo('.hero-title-word',
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.65 }, '-=0.25')
        .fromTo('.hero-description',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.3')
        .fromTo('.hero-cta',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.25')
        .fromTo('.hero-stats',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2')
        .fromTo('.hero-image-wrapper',
          { autoAlpha: 0, x: 50 },
          { autoAlpha: 1, x: 0, duration: 0.8 }, '-=0.7');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">

            {/* Availability badge */}
            <div className="hero-badge availability-badge">
              <span className="status-dot"></span>
              <span>Available for Work</span>
              <span className="divider">•</span>
              <span>📍 Detroit, MI</span>
            </div>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Omni Designer &amp; Educator
            </p>

            {/* Title — each word wrapped for GSAP stagger */}
            <h1 className="hero-title">
              <span className="hero-title-word">Hi,&nbsp;</span>
              <span className="hero-title-word">I'm&nbsp;</span>
              <span className="hero-title-word name">Scott&nbsp;</span>
              <span className="hero-title-word name">Everett</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              Leading mission-driven digital experiences for nonprofits, government agencies,
              and social enterprises. Translating complex user needs into intuitive solutions
              that create measurable social impact.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta">
              <motion.a
                href="#contact"
                className="btn btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Get in Touch
              </motion.a>
              <motion.a
                href="#projects"
                className="btn btn-outline"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                View My Work
              </motion.a>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div className="stat" key={index}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image">
            <div className="hero-image-wrapper">
              <div className="hero-image-bg"></div>
              <img
                src="/scott.png"
                alt="Scott Everett"
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
