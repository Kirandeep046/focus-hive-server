import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleNotifySubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    localStorage.setItem("footerNotifyEmail", email.trim());
    setMessage("Thank you. Career updates will be sent to your email.");
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <section className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="footer-brand-text">
            <h2>FocusHive<span>.ai</span></h2>
            <p>
              An intelligent ecosystem helping students plan, learn, track skills, and accelerate their career growth.
            </p>
            <div className="footer-socials">
              <a href="#twitter" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a href="#github" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <nav className="footer-links" aria-label="Footer navigation">
          <div>
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/job-suggestions">Job Portal</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/plans">Membership</Link>
          </div>

          <div>
            <h3>Career Hub</h3>
            <Link to="/job-suggestions">Saved Jobs</Link>
            <Link to="/job-suggestions">AI Advisor</Link>
            <Link to="/resume-builder">Resume Builder</Link>
            <Link to="/interview-prep">AI Interview Prep</Link>
          </div>

          <div>
            <h3>Support</h3>
            <a href="mailto:support@focushive.com" className="support-link">support@focushive.com</a>
            <a href="tel:+919000000000" className="support-link">+91 90000 00000</a>
            <span className="location-span">New Delhi, India</span>
          </div>
        </nav>

        <section className="footer-newsletter">
          <h3>Stay Career Ready</h3>
          <p>Get instant updates on new job suggestions, interview guidelines, and profile enhancements.</p>
          <form className="footer-subscribe" onSubmit={handleNotifySubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage("");
              }}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {message && <p className="footer-message">{message}</p>}
        </section>
      </div>

      <div className="footer-bottom">
        <span>© 2026 FocusHive AI. All rights reserved.</span>
        <div className="footer-bottom-policies">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
