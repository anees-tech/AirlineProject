import React from 'react';
import './Testimonials.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Remember to import Swiper styles in your main Flights.jsx or App.jsx
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

const testimonialsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Business Traveler',
    image: '/img/testimonials/kids-sneaker.jpeg', // Replace with your actual image path
    quote: 'The service I received was exceptional! The comfort and amenities during my business trip made it a pleasure to fly with this airline. I highly recommend their business class service.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Frequent Flyer',
    image: '/img/testimonials/kids-tablet.jpg', // Replace with your actual image path
    quote: 'As someone who flies regularly, I appreciate the consistency and reliability of this airline. The loyalty program is excellent, and the staff is always friendly and professional.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Family Traveler',
    image: '/img/testimonials/kids-toys.jpeg', // Replace with your actual image path
    quote: 'Traveling with kids can be stressful, but this airline made it so much easier. The family-friendly services and accommodations for children were fantastic. We\'ll definitely fly with them again!',
    rating: 4,
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'First-time Flyer',
    image: '/img/testimonials/men-dress.jpeg', // Replace with your actual image path
    quote: 'I was nervous about flying for the first time, but the staff was incredibly helpful and made me feel at ease. The entire experience exceeded my expectations.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <div className="testimonials-slider-container"> {/* Renamed class */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="testimonialSwiper"
      >
        {testimonialsData.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {'★'.repeat(testimonial.rating)}
                {'☆'.repeat(5 - testimonial.rating)}
              </div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                <div className="author-details">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;