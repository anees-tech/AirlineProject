"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../styles/Booking.css"
import { dummyFlights } from "../data/dummyData"

function Booking({ user }) {
  const { flightId } = useParams()
  const navigate = useNavigate()

  const [flight, setFlight] = useState(null)
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    seatClass: "economy",
    seats: ["A1"],
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const selectedFlight = dummyFlights.find((f) => f._id === flightId)

    if (!selectedFlight) {
      console.error("Dummy flight not found for ID:", flightId)
      navigate("/flights")
      return
    }

    setFlight(selectedFlight)

    setBookingData((prev) => ({
      ...prev,
      seats: Array(prev.passengers)
        .fill("")
        .map((_, i) => `Seat ${i + 1}`),
    }))
  }, [user, flightId, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "passengers") {
      const passengerCount = Number.parseInt(value) || 1
      setBookingData({
        ...bookingData,
        passengers: passengerCount,
        seats: Array(passengerCount)
          .fill("")
          .map((_, i) => bookingData.seats[i] || `Seat ${i + 1}`),
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

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!user || !flight) {
      navigate("/login")
      return
    }

    console.log("Simulating booking submission with data:", {
      flightId: flight._id,
      userId: user._id,
      ...bookingData,
      totalPrice: calculateTotalPrice(),
    })

    setShowSuccessMessage(true)

    setTimeout(() => {
      navigate("/dashboard")
    }, 3000)
  }

  const calculateTotalPrice = () => {
    if (!flight) return 0

    const basePrice = flight.price || 0

    const classMultiplier = {
      economy: 1,
      business: 1.5,
      first: 2.5,
    }
    const multiplier = classMultiplier[bookingData.seatClass] || 1

    return basePrice * bookingData.passengers * multiplier
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (showSuccessMessage) {
    return (
      <div className="booking-success">
        <h2>Booking Successful!</h2>
        <p>Your flight booking is simulated.</p>
        <p>Redirecting to your dashboard...</p>
      </div>
    )
  }

  if (!flight) {
    return <div className="loading">Loading flight details...</div>
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
            {[1, 2, 3, 4, 5, 6].map((num) => (
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
          <label>Seat Selection (Example)</label>
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
          <button type="button" className="cancel-button" onClick={() => navigate("/flights")}>
            Cancel
          </button>
          <button type="submit" className="confirm-button">
            Confirm Booking (Simulated)
          </button>
        </div>
      </form>
    </div>
  )
}

export default Booking
