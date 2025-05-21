"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../styles/Booking.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function Booking({ user }) {
  const { flightId } = useParams()
  const navigate = useNavigate()

  const [flight, setFlight] = useState(null)
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    seatClass: "economy",
    seats: ["A1"],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingError, setBookingError] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchFlightDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_BASE_URL}/flights/${flightId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setFlight(data)
        setBookingData((prev) => ({
          ...prev,
          seats: Array(prev.passengers)
            .fill("")
            .map((_, i) => `Seat ${i + 1} (auto)`),
        }))
      } catch (err) {
        console.error("Failed to fetch flight details:", err)
        setError(err.message || "Failed to load flight details.")
        setFlight(null)
      } finally {
        setLoading(false)
      }
    }

    fetchFlightDetails()
  }, [user, flightId, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingError(null)

    if (name === "passengers") {
      const passengerCount = Number.parseInt(value) || 1
      setBookingData({
        ...bookingData,
        passengers: passengerCount,
        seats: Array(passengerCount)
          .fill("")
          .map((_, i) => bookingData.seats[i] || `P${i + 1} Seat`),
      })
    } else {
      setBookingData({
        ...bookingData,
        [name]: value,
      })
    }
  }

  const handleSeatChange = (index, value) => {
    setBookingError(null)
    const updatedSeats = [...bookingData.seats]
    updatedSeats[index] = value
    setBookingData({
      ...bookingData,
      seats: updatedSeats,
    })
  }

  const calculateTotalPrice = () => {
    if (!flight) return 0
    const basePrice = flight.price || 0
    const classMultiplier = { economy: 1, business: 1.5, first: 2.5 }
    const multiplier = classMultiplier[bookingData.seatClass] || 1
    return basePrice * bookingData.passengers * multiplier
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBookingError(null)

    if (!user || !flight) {
      setBookingError("User or flight data is missing. Please try again.")
      return
    }

    if (bookingData.seats.some((seat) => !seat.trim())) {
      setBookingError("Please assign a seat for each passenger.")
      return
    }

    const finalBookingData = {
      flightId: flight._id,
      userId: user._id,
      passengers: bookingData.passengers,
      seatClass: bookingData.seatClass,
      seats: bookingData.seats,
      totalPrice: calculateTotalPrice(),
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalBookingData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Booking failed. Please try again.")
      }

      setShowSuccessMessage(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 3000)
    } catch (err) {
      console.error("Booking submission error:", err)
      setBookingError(err.message || "An unexpected error occurred during booking.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading && !flight) {
    return <div className="loading">Loading flight details...</div>
  }

  if (error) {
    return (
      <div className="booking-error">
        Error: {error} <button onClick={() => navigate("/flights")}>Go to Flights</button>
      </div>
    )
  }

  if (showSuccessMessage) {
    return (
      <div className="booking-success">
        <h2>Booking Successful!</h2>
        <p>Your flight booking has been confirmed.</p>
        <p>Redirecting to your dashboard...</p>
      </div>
    )
  }

  if (!flight) {
    return (
      <div className="loading">
        Flight details not available. Please try selecting a flight again.{" "}
        <button onClick={() => navigate("/flights")}>Go to Flights</button>
      </div>
    )
  }

  return (
    <div className="booking-container">
      <h2 className="booking-title">Complete Your Booking</h2>

      <div className="flight-summary">
        <h3>Flight Details</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span className="summary-label">Airline:</span>
            <span className="summary-value">{flight.airline}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Flight:</span>
            <span className="summary-value">{flight.flightNumber}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">From:</span>
            <span className="summary-value">{flight.from}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">To:</span>
            <span className="summary-value">{flight.to}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Departure:</span>
            <span className="summary-value">{formatDate(flight.departureTime)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Arrival:</span>
            <span className="summary-value">{formatDate(flight.arrivalTime)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Available Seats:</span>
            <span className="summary-value">{flight.availableSeats}</span>
          </div>
        </div>
      </div>

      {bookingError && <div className="booking-error">{bookingError}</div>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="passengers">Number of Passengers</label>
          <select
            id="passengers"
            name="passengers"
            value={bookingData.passengers}
            onChange={handleInputChange}
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="seatClass">Seat Class</label>
          <select
            id="seatClass"
            name="seatClass"
            value={bookingData.seatClass}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>

        <div className="form-group">
          <label>Seat Selection</label>
          <p className="seat-selection-note">
            Enter desired seat numbers (e.g., 12A, 23C). Availability not guaranteed.
          </p>
          <div className="seats-container">
            {bookingData.seats.map((seat, index) => (
              <div key={index} className="seat-input">
                <label htmlFor={`seat-${index}`}>Passenger {index + 1} Seat</label>
                <input
                  type="text"
                  id={`seat-${index}`}
                  value={seat}
                  onChange={(e) => handleSeatChange(index, e.target.value)}
                  placeholder="e.g. 12A"
                  required
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="price-summary">
          <div className="price-row">
            <span>Base Price:</span>
            <span>
              ${flight.price?.toFixed(2)} × {bookingData.passengers} passenger(s)
            </span>
          </div>
          {bookingData.seatClass !== "economy" && (
            <div className="price-row">
              <span>Class Upgrade ({bookingData.seatClass}):</span>
              <span>{bookingData.seatClass === "business" ? "+50%" : "+150%"}</span>
            </div>
          )}
          <div className="price-total">
            <span>Total Price:</span>
            <span>${calculateTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/flights")}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="confirm-button"
            disabled={loading || flight.availableSeats < bookingData.passengers}
          >
            {loading
              ? "Processing..."
              : flight.availableSeats < bookingData.passengers
              ? "Not Enough Seats"
              : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Booking
