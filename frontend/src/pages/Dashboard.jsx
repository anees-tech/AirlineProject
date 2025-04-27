"use client"

import { useState, useEffect } from "react"
import "../styles/Dashboard.css"

function Dashboard({ user }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return

    fetchUserBookings()
  }, [user])

  const fetchUserBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/bookings/user/${user._id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings")
      }

      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking")
      }

      // Remove the cancelled booking from state
      setBookings(bookings.filter((booking) => booking._id !== bookingId))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (!user) {
    return <div className="dashboard-error">Please log in to view your bookings.</div>
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Bookings</h2>

      {error && <div className="dashboard-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
          <p>Browse available flights to make a reservation.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>
                  {booking.flight.airline} - {booking.flight.flightNumber}
                </h3>
                <span className="booking-status">{booking.status}</span>
              </div>

              <div className="booking-details">
                <div className="booking-route">
                  <div className="booking-city">
                    <span className="city-name">{booking.flight.from}</span>
                    <span className="city-time">{formatDate(booking.flight.departureTime)}</span>
                  </div>

                  <div className="booking-arrow">→</div>

                  <div className="booking-city">
                    <span className="city-name">{booking.flight.to}</span>
                    <span className="city-time">{formatDate(booking.flight.arrivalTime)}</span>
                  </div>
                </div>

                <div className="booking-info">
                  <div className="info-item">
                    <span className="info-label">Passengers:</span>
                    <span className="info-value">{booking.passengers}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Class:</span>
                    <span className="info-value">
                      {booking.seatClass.charAt(0).toUpperCase() + booking.seatClass.slice(1)}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Seats:</span>
                    <span className="info-value">{booking.seats.join(", ")}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Booking Date:</span>
                    <span className="info-value">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="booking-footer">
                <div className="booking-price">Total: ${booking.totalPrice.toFixed(2)}</div>
                {booking.status === "confirmed" && (
                  <button className="cancel-booking-button" onClick={() => handleCancelBooking(booking._id)}>
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
