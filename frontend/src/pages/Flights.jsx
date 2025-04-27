"use client"

import { useState, useEffect } from "react"
import "../styles/Flights.css"

function Flights({ user, setCurrentPage }) {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  })

  useEffect(() => {
    fetchFlights()
  }, [])

  const fetchFlights = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/flights")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch flights")
      }

      setFlights(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Build query string from search params
      const queryParams = new URLSearchParams()
      if (searchParams.from) queryParams.append("from", searchParams.from)
      if (searchParams.to) queryParams.append("to", searchParams.to)
      if (searchParams.date) queryParams.append("date", searchParams.date)

      const url = `http://localhost:5000/api/flights?${queryParams.toString()}`
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to search flights")
      }

      setFlights(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    })
  }

  const handleBooking = (flightId) => {
    if (!user) {
      setCurrentPage("login")
      return
    }

    // Store selected flight in localStorage for booking page
    localStorage.setItem("selectedFlight", flightId)
    setCurrentPage("booking")
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="flights-container">
      <h2 className="flights-title">Available Flights</h2>

      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-group">
            <label htmlFor="from">From</label>
            <input
              type="text"
              id="from"
              name="from"
              value={searchParams.from}
              onChange={handleInputChange}
              placeholder="Departure City"
            />
          </div>

          <div className="search-group">
            <label htmlFor="to">To</label>
            <input
              type="text"
              id="to"
              name="to"
              value={searchParams.to}
              onChange={handleInputChange}
              placeholder="Arrival City"
            />
          </div>

          <div className="search-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={searchParams.date} onChange={handleInputChange} />
          </div>

          <button type="submit" className="search-button">
            Search Flights
          </button>
        </form>
      </div>

      {error && <div className="flights-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading flights...</div>
      ) : flights.length === 0 ? (
        <div className="no-flights">No flights available for your search criteria.</div>
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
                    <span className="info-value">{flight.duration} minutes</span>
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
                <div className="flight-price">${flight.price}</div>
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
