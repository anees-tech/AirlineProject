import React from 'react';
import '../styles/Footer.css'; // We'll create this CSS file next

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Airline Management System. All rights reserved.</p>
      {/* You can add more footer content here if needed, like links */}
      {/*
      <div className="footer-links">
        <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
      </div>
      */}
    </footer>
  );
}

export default Footer;