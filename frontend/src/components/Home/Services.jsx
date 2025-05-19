import React from 'react';
import './Services.css';
// Make sure to install react-icons: npm install react-icons
import { FaPlane, FaBriefcase, FaUtensils, FaBed, FaChild, FaWifi } from 'react-icons/fa';

const servicesData = [
  {
    id: 1,
    icon: <FaPlane />,
    title: 'Flight Booking',
    description: 'Book flights to over 100 destinations worldwide with our easy booking system.'
  },
  {
    id: 2,
    icon: <FaUtensils />,
    title: 'In-flight Dining',
    description: 'Enjoy premium meals prepared by top chefs, including special dietary options.'
  },
  {
    id: 3,
    icon: <FaBriefcase />,
    title: 'Extra Baggage',
    description: 'Purchase additional baggage allowance for your convenience.'
  },
  {
    id: 4,
    icon: <FaBed />,
    title: 'Comfortable Seating',
    description: 'Choose from various seat options designed for maximum comfort during your journey.'
  },
  {
    id: 5,
    icon: <FaChild />,
    title: 'Family Services',
    description: 'Special services for families traveling with children and infants.'
  },
  {
    id: 6,
    icon: <FaWifi />,
    title: 'In-flight Wi-Fi',
    description: 'Stay connected with high-speed internet access throughout your flight.'
  }
];

const Services = () => {
  return (
    <div className="services-grid">
      {servicesData.map(service => (
        <div key={service.id} className="service-card">
          <div className="service-icon">{service.icon}</div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <a href="#" className="service-link">Learn More</a>
        </div>
      ))}
    </div>
  );
};

export default Services;