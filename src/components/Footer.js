import React from 'react';
import { motion } from 'framer-motion';
import { FiLinkedin, FiInstagram, FiGlobe } from 'react-icons/fi';

const Footer = () => {
  const socialLinks = [
    { icon: <FiLinkedin />, label: 'LinkedIn', url: 'https://www.linkedin.com/in/scotteverett313/' },
    { icon: <FiInstagram />, label: 'Instagram: SE Design', url: 'https://www.instagram.com/sedesignpro/?hl=en' },
    { icon: <FiInstagram />, label: 'Instagram: Wesson Art', url: 'https://www.instagram.com/wessonart/?hl=en' },
    { icon: <FiGlobe />, label: 'Website', url: 'https://www.scotteverett.design/' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-logo"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span style={{ color: '#f2c031' }}>Scott</span> Everett
          </motion.div>

          <motion.div
            className="footer-social"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ y: -3, backgroundColor: '#f2c031', color: '#28282a' }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>
            © {currentYear} Scott Everett. All rights reserved. |{' '}
            <span style={{ color: '#f2c031' }}>Designed & Built with care in Detroit</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
