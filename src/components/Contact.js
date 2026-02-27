import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiPhone, FiGlobe, FiMapPin, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

// ─── Replace these with your EmailJS credentials ───────────────────────────
const EMAILJS_SERVICE_ID  = 'fDj1CqvMn3hc3hFBr';   // from EmailJS → Email Services
const EMAILJS_TEMPLATE_ID = 'template_yro89le';  // from EmailJS → Email Templates
const EMAILJS_PUBLIC_KEY  = 'lV9djCOssav_tktHc4nT8';   // from EmailJS → Account
// ───────────────────────────────────────────────────────────────────────────

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });

  const [isSending, setIsSending]   = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError]           = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(false);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setIsSubmitted(true);
      setFormData({ from_name: '', from_email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error('EmailJS error:', err);
      setError(true);
      setTimeout(() => setError(false), 5000);
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail />,
      label: 'Email',
      value: 'scotteverett313@gmail.com',
      link: 'mailto:scotteverett313@gmail.com',
    },
    {
      icon: <FiPhone />,
      label: 'Phone',
      value: '(313) 806-4874',
      link: 'tel:+13138064874',
    },
    {
      icon: <FiGlobe />,
      label: 'Website',
      value: 'scotteverett.design',
      link: 'https://scotteverett.design',
    },
    {
      icon: <FiMapPin />,
      label: 'Location',
      value: 'Detroit, MI',
      link: null,
    },
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

  // Button label & style based on state
  const buttonContent = () => {
    if (isSending)   return { label: 'Sending...', icon: null,         style: { opacity: 0.7 } };
    if (isSubmitted) return { label: 'Message Sent!', icon: <FiCheck />, style: { background: '#087e8b' } };
    if (error)       return { label: 'Try Again', icon: <FiAlertCircle />, style: { background: '#f95738' } };
    return { label: 'Send Message', icon: <FiSend />, style: {} };
  };

  const btn = buttonContent();

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h2>

        <motion.div
          ref={ref}
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className="contact-info" variants={itemVariants}>
            <h3>Let's Create Something Amazing Together</h3>
            <p>
              Whether you're looking for a UX/UI designer for your next project, need help with
              digital strategy, or want to discuss a speaking opportunity, I'd love to hear from you.
            </p>

            <div className="contact-details">
              {contactInfo.map((info, index) => (
                <motion.div
                  className="contact-item"
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className="contact-icon">{info.icon}</div>
                  <div className="contact-item-text">
                    <p style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', marginBottom: '4px' }}>
                      {info.label}
                    </p>
                    {info.link ? (
                      <a href={info.link} target={info.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                        {info.value}
                      </a>
                    ) : (
                      <span style={{ fontWeight: '500' }}>{info.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            ref={formRef}
            className="contact-form"
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <motion.input
                type="text"
                id="name"
                name="from_name"
                value={formData.from_name}
                onChange={handleChange}
                placeholder="Your name"
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <motion.input
                type="email"
                id="email"
                name="from_email"
                value={formData.from_email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <motion.input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', ...btn.style }}
              whileHover={!isSending ? { scale: 1.02 } : {}}
              whileTap={!isSending ? { scale: 0.98 } : {}}
              disabled={isSending}
            >
              {btn.icon && btn.icon}
              {btn.label}
            </motion.button>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#f95738', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center' }}
              >
                Something went wrong. Please try again or email me directly.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
