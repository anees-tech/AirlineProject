import React from 'react';
import './LatestNews.css';

const newsData = [
  {
    id: 1,
    title: 'New Direct Flights to Bali Starting Next Month',
    date: 'May 15, 2025',
    image: '/img/news/t.shirt.avif', // Replace with your actual image path
    excerpt: 'We are excited to announce new direct flights to Bali starting June 1st, with special introductory fares available now.',
    category: 'New Routes'
  },
  {
    id: 2,
    title: 'Enhanced Premium Economy Experience',
    date: 'May 10, 2025',
    image: '/img/news/women-dress.jpg', // Replace with your actual image path
    excerpt: 'Our premium economy class has been revamped with more legroom, improved dining options, and exclusive amenities.',
    category: 'Upgrades'
  },
  {
    id: 3,
    title: 'Summer Travel Deals: Up to 30% Off',
    date: 'May 5, 2025',
    image: '/img/news/women-shoes.jpeg', // Replace with your actual image path
    excerpt: 'Plan your summer getaway with our limited-time promotion offering up to 30% off selected international destinations.',
    category: 'Offers'
  },
];

const LatestNews = () => {
  return (
    <div className="news-grid">
      {newsData.map((news) => (
        <article key={news.id} className="news-card-article"> {/* Changed to article and renamed class */}
          <div className="news-image-wrapper"> {/* Renamed class */}
            <img src={news.image} alt={news.title} />
            <span className="news-category-badge">{news.category}</span> {/* Added category */}
          </div>
          <div className="news-content-wrapper"> {/* Renamed class */}
            <p className="news-meta-date">{news.date}</p> {/* Renamed class */}
            <h3>{news.title}</h3>
            <p className="news-excerpt">{news.excerpt}</p>
            <a href="#" className="read-more-link">Read More &rarr;</a> {/* Renamed class and added arrow */}
          </div>
        </article>
      ))}
    </div>
  );
};

export default LatestNews;