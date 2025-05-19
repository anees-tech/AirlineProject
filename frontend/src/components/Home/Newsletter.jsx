import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Here you would typically send the email to your backend
    console.log('Subscribing email:', email);
    setSubmitted(true);
    setEmail(''); // Clear input after submission
  };

  return (
    <div className="newsletter-signup-container"> {/* Renamed class */}
      <h2>Subscribe to Our Newsletter</h2>
      <p>Stay updated with our latest offers, news, and travel tips!</p>
      
      {!submitted ? (
        <form className="newsletter-form-element" onSubmit={handleSubmit}> {/* Renamed class */}
          <div className="form-input-group">
            <input 
              type="email" 
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email for newsletter"
            />
            <button type="submit">Subscribe</button>
          </div>
          {error && <p className="newsletter-error">{error}</p>}
        </form>
      ) : (
        <div className="thank-you-message">
          <p>Thank you for subscribing! Check your inbox for a confirmation (simulated).</p>
        </div>
      )}
      
      <div className="privacy-note">
        We respect your privacy. Unsubscribe at any time.
      </div>
    </div>
  );
};

export default Newsletter;