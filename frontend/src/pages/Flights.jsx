"use client"

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Styles
import "../styles/Flights.css"; // Styles for the flights list
import "../styles/Home.css";    // Styles for general homepage sections
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Homepage Section Components
import SearchForm from '../components/Home/SearchForm';
import AboutUs from '../components/Home/AboutUs';
import FeaturedDestinations from '../components/Home/FeaturedDestinations';
import Services from '../components/Home/Services';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import Testimonials from '../components/Home/Testimonials';
import LatestNews from '../components/Home/LatestNews';
import FAQ from '../components/Home/FAQ';
import Newsletter from '../components/Home/Newsletter';

// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function Flights({ user }) {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}/flights`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFlights(data);
            } catch (err) {
                console.error("Failed to fetch flights:", err);
                setError(err.message || "Failed to load flights. Please try again later.");
                setFlights([]); // Clear flights on error
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    const handleBooking = (flightId) => {
        if (!user) {
            navigate("/login");
            return;
        }
        navigate(`/booking/${flightId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDuration = (departureTime, arrivalTime) => {
        if (!departureTime || !arrivalTime) return "N/A";
        const durationMs = new Date(arrivalTime) - new Date(departureTime);
        if (durationMs <= 0) return "N/A";
        const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        return `${hours}h ${minutes}m`;
    };

    const handleFlightSearch = () => {
        // Implement flight search logic here
    };

    return (
        <>
            <div className="home-container">
                {/* Hero Slider Section */}
                <section className="hero-slider">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                    >
                        <SwiperSlide>
                            <div className="hero-slide" style={{ backgroundImage: 'url(/img/first.avif)' }}>
                                <div className="hero-content">
                                    <h1>Explore the World with Us</h1>
                                    <p>Discover amazing destinations at affordable prices</p>
                                    <button className="btn-primary" onClick={() => document.getElementById('search-form-section')?.scrollIntoView({ behavior: 'smooth' })}>Book Now</button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="hero-slide" style={{ backgroundImage: 'url(/img/img1.webp)' }}>
                                <div className="hero-content">
                                    <h1>Experience Luxury in the Skies</h1>
                                    <p>Premium service with comfort and style</p>
                                    <button className="btn-primary">View Offers</button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="hero-slide" style={{ backgroundImage: 'url(/img/img2.jpg)' }}>
                                <div className="hero-content">
                                    <h1>Your Journey Begins Here</h1>
                                    <p>Safe and reliable flights to over 100 destinations</p>
                                    <button className="btn-primary">Learn More</button>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </section>

                {/* Search Form Section */}
                <section className="search-section" id="search-form-section">
                    <div className="container">
                        {/* Pass a real search handler if you implement search */}
                        <SearchForm onSearch={handleFlightSearch} />
                    </div>
                </section>

                {/* Real-time Flights List Section */}
                <div className="flights-container">
                    <h2 className="flights-title">Available Flights</h2>

                    {loading && <div className="loading">Loading flights...</div>}

                    {error && <div className="flights-error">{error}</div>}

                    {!loading && !error && flights.length === 0 && (
                        <div className="no-flights">No flights available at the moment. Please check back later.</div>
                    )}

                    {!loading && !error && flights.length > 0 && (
                        <div className="flights-list">
                            {flights.map((flight) => (
                                <div key={flight._id} className="flight-card">
                                    <div className="flight-header">
                                        <h3>{flight.airline}</h3>
                                        <span className="flight-number">Flight #{flight.flightNumber}</span>
                                    </div>

                                    <div className="flight-details">
                                        <div className="flight-route">
                                            <div className="flight-city">
                                                <span className="city-name">{flight.from}</span>
                                                <span className="city-time">{formatDate(flight.departureTime)}</span>
                                            </div>
                                            <div className="flight-arrow">→</div>
                                            <div className="flight-city">
                                                <span className="city-name">{flight.to}</span>
                                                <span className="city-time">{formatDate(flight.arrivalTime)}</span>
                                            </div>
                                        </div>
                                        <div className="flight-info">
                                            <div className="info-item">
                                                <span className="info-label">Duration:</span>
                                                <span className="info-value">{formatDuration(flight.departureTime, flight.arrivalTime)}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Aircraft:</span>
                                                <span className="info-value">{flight.aircraft || "N/A"}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Available Seats:</span>
                                                <span className="info-value">{flight.availableSeats}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flight-footer">
                                        <div className="flight-price">${flight.price?.toFixed(2)}</div>
                                        <button className="book-button" onClick={() => handleBooking(flight._id)}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* About Us Section */}
                <AboutUs />

                {/* Featured Destinations */}
                <section className="featured-section">
                    <div className="container">
                        <div className="section-heading">
                            <h2>Featured Destinations</h2>
                            <p>Explore our most popular flight destinations</p>
                        </div>
                        <FeaturedDestinations />
                    </div>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <div className="container">
                        <div className="section-heading">
                            <h2>Our Services</h2>
                            <p>We offer a wide range of services to enhance your travel experience</p>
                        </div>
                        <Services />
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <WhyChooseUs />

                {/* Testimonial Section */}
                <section className="testimonial-section">
                    <div className="container">
                        <div className="section-heading">
                            <h2>What Our Customers Say</h2>
                            <p>Read about experiences from our satisfied customers</p>
                        </div>
                        <Testimonials />
                    </div>
                </section>

                {/* Latest News */}
                <section className="news-section">
                    <div className="container">
                        <div className="section-heading">
                            <h2>Latest News</h2>
                            <p>Stay updated with our newest routes and special offers</p>
                        </div>
                        <LatestNews />
                    </div>
                </section>

                {/* FAQ Section */}
                <FAQ />

                {/* Newsletter */}
                <section className="newsletter-section">
                    <div className="container">
                        <Newsletter />
                    </div>
                </section>
            </div>
        </>
    );
}

export default Flights;
