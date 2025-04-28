"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Flights.css"
import { dummyFlights } from "../data/dummyData"

function Flights({ user }) {
  const [flights] = useState(dummyFlights)
  const navigate = useNavigate()

  const handleBooking = (flightId) => {
    if (!user) {
      navigate("/login")
      return
    }
    navigate(`/booking/${flightId}`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="flights-container">
      <h2 className="flights-title">Available Flights</h2>

      <div className="search-container">
        <p>Flight search is disabled. Displaying Dummy data.</p>
      </div>

      {flights.length === 0 ? (
        <div className="no-flights">No flights available.</div>
      ) : (
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
                    <span className="info-value">{flight.duration ? `${flight.duration} minutes` : "N/A"}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Aircraft:</span>
                    <span className="info-value">{flight.aircraft}</span>
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
  )
}

export default Flights
