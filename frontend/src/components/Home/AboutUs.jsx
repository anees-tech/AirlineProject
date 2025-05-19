import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-section">
      <div className="container">
        <div className="about-us-content">
          <div className="about-us-text">
            <div className="section-heading">
              <h2>About Our Airline</h2>
              <p>Your Trusted Partner in Air Travel</p>
            </div>
            <p>
              Welcome to AirlineMS, where your journey is our passion. Since our inception, we have been committed to
              providing safe, reliable, and comfortable air travel to destinations across the globe. Our modern fleet,
              experienced crew, and dedication to customer satisfaction set us apart.
            </p>
            <p>
              We believe in connecting people, cultures, and businesses. Whether you're flying for leisure or business,
              we strive to make your experience seamless and enjoyable from booking to landing.
            </p>
            <button className="btn-primary">Learn More About Us</button>
          </div>
          <div className="about-us-image">
            {/* Replace with an actual image from your public/img folder */}
            <img src="/img/logoooo.jpg" alt="Airline Team or Aircraft" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;