import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h2 className="footer-logo">
              {/* You can use an img tag here if you have a logo image */}
              AirlineMS
            </h2>
            <p>
              Your journey, our passion. Experience seamless travel with AirlineMS, connecting you to the world with safety and comfort.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>

          <div className="footer-section contact-info">
            <h3>Contact Us</h3>
            <p><i className="fas fa-map-marker-alt"></i> 123 Airline Avenue, Flight City, Sky 98765</p>
            <p><i className="fas fa-phone"></i> +1 234 567 8900</p>
            <p><i className="fas fa-envelope"></i> support@airlinems.com</p>
          </div>

          <div className="footer-section newsletter-mini">
            <h3>Stay Connected</h3>
            <p>Subscribe to our newsletter for the latest deals and updates.</p>
            <form className="footer-newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} AirlineMS. All Rights Reserved. Designed by DoctrineGirls.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;