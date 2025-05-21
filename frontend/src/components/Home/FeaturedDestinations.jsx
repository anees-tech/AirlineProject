import React from 'react';
import './FeaturedDestinations.css'; // We'll create this CSS file next

const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    description: 'The city of lights, love, and iconic landmarks.',
    image: '/img/img3.webp', // Replace with your actual image path
    link: '/flights?to=Paris'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    description: 'A vibrant blend of ancient tradition and futuristic technology.',
    image: '/img/img4.webp', // Replace with your actual image path
    link: '/flights?to=Tokyo'
  },
  {
    id: 3,
    name: 'Rome, Italy',
    description: 'Explore ancient ruins, stunning art, and delicious cuisine.',
    image: '/img/img5.webp', // Replace with your actual image path
    link: '/flights?to=Rome'
  },
  {
    id: 4,
    name: 'New York, USA',
    description: 'The city that never sleeps, offering endless excitement.',
    image: '/img/img6.webp', // Replace with your actual image path
    link: '/flights?to=New York'
  }
];

const FeaturedDestinations = () => {
  return (
    <div className="destinations-grid">
      {destinations.map(destination => (
        <div key={destination.id} className="destination-card">
          <div className="destination-image-wrapper">
            <img src={destination.image} alt={destination.name} />
          </div>
          <div className="destination-content">
            <h3>{destination.name}</h3>
            <p>{destination.description}</p>
            <a href={destination.link} className="btn-explore">Explore Flights</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedDestinations;