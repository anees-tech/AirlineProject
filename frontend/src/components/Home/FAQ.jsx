import React, { useState } from 'react';
import './FAQ.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqData = [
  {
    question: 'What is the baggage allowance for economy class?',
    answer: 'For economy class, you are typically allowed one checked bag up to 23kg (50lbs) and one carry-on bag plus a personal item. Please check your specific ticket details as allowances can vary by route.',
  },
  {
    question: 'How can I check-in for my flight?',
    answer: 'You can check-in online through our website or mobile app starting 24 hours before departure. Airport check-in counters are also available, typically opening 3 hours before international flights and 2 hours before domestic flights.',
  },
  {
    question: 'Can I change my flight booking?',
    answer: 'Yes, changes to bookings are possible subject to the fare rules of your ticket. Fees and fare differences may apply. You can manage your booking online or contact our customer service for assistance.',
  },
  {
    question: 'What measures are you taking for passenger safety during COVID-19?',
    answer: 'We have implemented enhanced cleaning protocols, mandatory mask-wearing, and modified in-flight services to ensure the health and safety of our passengers and crew. Please visit our dedicated COVID-19 information page for the latest updates.',
  },
  {
    question: 'Do you offer special meals?',
    answer: 'Yes, we offer a variety of special meals to cater to dietary and religious requirements. Please request your special meal at least 24-48 hours before your flight through our "Manage Booking" section or by contacting customer service.',
  },
];

const FAQItem = ({ faq, index, toggleFAQ, active }) => {
  return (
    <div className={`faq-item ${active ? 'active' : ''}`}>
      <button className="faq-question" onClick={() => toggleFAQ(index)}>
        {faq.question}
        <span className="faq-icon">
          {active ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      <div className="faq-answer">
        <p>{faq.answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-heading">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common queries about our services</p>
        </div>
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <FAQItem 
              key={index} 
              faq={faq} 
              index={index} 
              toggleFAQ={toggleFAQ} 
              active={activeIndex === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;