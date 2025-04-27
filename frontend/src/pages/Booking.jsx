"use client"

import { useState, useEffect } from "react"
import "../styles/Booking.css"

function Booking({ user, setCurrentPage }) {
  const [flight, setFlight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    seatClass: "economy",
    seats: [],
  })
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      setCurrentPage("login")
      return
    }

    const flightId = localStorage.getItem("selectedFlight")
    if (!flightId) {
      setCurrentPage("flights")
      return
    }

    fetchFlightDetails(flightId)
  }, [user, setCurrentPage])

  const fetchFlightDetails = async (flightId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/flights/${flightId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch flight details")
      }

      setFlight(data)

      // Initialize seats array based on passenger count
      setBookingData((prev) => ({
        ...prev,
        seats: Array(prev.passengers)
          .fill("")
          .map((_, i) => `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`),
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "passengers") {
      const passengerCount = Number.parseInt(value)
      setBookingData({
        ...bookingData,
        passengers: passengerCount,
        seats: Array(passengerCount)
          .fill("")
          .map((_, i) => `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`),
      })
    } else {
      setBookingData({
        ...bookingData,
        [name]: value,
      })
    }
  }

  const handleSeatChange = (index, value) => {
    const updatedSeats = [...bookingData.seats]
    updatedSeats[index] = value
    setBookingData({
      ...bookingData,
      seats: updatedSeats,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setCurrentPage("login")
      return
    }

    try {
      setLoading(true)

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightId: flight._id,
          userId: user._id,
          passengers: bookingData.passengers,
          seatClass: bookingData.seatClass,
          seats: bookingData.seats,
          totalPrice: calculateTotalPrice(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking")
      }

      setBookingSuccess(true)
      localStorage.removeItem("selectedFlight")

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        setCurrentPage("dashboard")
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!flight) return 0

    const basePrice = flight.price

    // Apply multiplier based on seat class
    const classMultiplier = {
      economy: 1,
      business: 1.5,
      first: 2.5,
    }

    return basePrice * bookingData.passengers * classMultiplier[bookingData.seatClass]
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return <div className="loading">Loading booking details...</div>
  }

  if (error) {
    return <div className="booking-error">{error}</div>
  }

  if (bookingSuccess) {
    return (
      <div className="booking-success">
        <h2>Booking Successful!</h2>
        <p>Your flight has been booked successfully.</p>
        <p>You will be redirected to your dashboard in a few seconds...</p>
      </div>
    )
  }

  if (!flight) {
    return <div className="booking-error">Flight not found. Please select a flight first.</div>
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
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="passengers">Number of Passengers</label>
          <select id="passengers" name="passengers" value={bookingData.passengers} onChange={handleInputChange}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="seatClass">Seat Class</label>
          <select id="seatClass" name="seatClass" value={bookingData.seatClass} onChange={handleInputChange}>
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>

        <div className="form-group">
          <label>Seat Selection</label>
          <div className="seats-container">
            {bookingData.seats.map((seat, index) => (
              <div key={index} className="seat-input">
                <label htmlFor={`seat-${index}`}>Passenger {index + 1}</label>
                <input
                  type="text"
                  id={`seat-${index}`}
                  value={seat}
                  onChange={(e) => handleSeatChange(index, e.target.value)}
                  placeholder="e.g. A1, B3"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="price-summary">
          <div className="price-row">
            <span>Base Price:</span>
            <span>
              ${flight.price} × {bookingData.passengers} passenger(s)
            </span>
          </div>
          {bookingData.seatClass !== "economy" && (
            <div className="price-row">
              <span>Class Upgrade:</span>
              <span>{bookingData.seatClass === "business" ? "50%" : "150%"} surcharge</span>
            </div>
          )}
          <div className="price-total">
            <span>Total Price:</span>
            <span>${calculateTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => setCurrentPage("flights")}>
            Cancel
          </button>
          <button type="submit" className="confirm-button" disabled={loading}>
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Booking
