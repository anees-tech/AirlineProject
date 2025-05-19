import React from 'react';
import './WhyChooseUs.css';
import { FaShieldAlt, FaPlaneDeparture, FaUsers, FaConciergeBell } from 'react-icons/fa'; // Example icons

const reasons = [
  {
    icon: <FaShieldAlt />,
    title: 'Safety First',
    description: 'Our top priority is the safety and security of our passengers and crew, adhering to the highest international standards.',
  },
  {
    icon: <FaPlaneDeparture />,
    title: 'Extensive Network',
    description: 'Fly to a wide range of domestic and international destinations with our expanding route network.',
  },
  {
    icon: <FaConciergeBell />,
    title: 'Exceptional Service',
    description: 'Experience world-class hospitality from our dedicated and professional team, both on the ground and in the air.',
  },
  {
    icon: <FaUsers />,
    title: 'Customer Focused',
    description: 'We listen to our passengers and continuously strive to enhance your travel experience with us.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us-section">
      <div className="container">
        <div className="section-heading">
          <h2>Why Fly With AirlineMS?</h2>
          <p>Experience the Difference in Air Travel</p>
        </div>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon">{reason.icon}</div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;