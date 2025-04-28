"use client"

import { useState, useEffect } from "react"
import "../styles/Dashboard.css"
import { dummyBookings } from "../data/dummyData"

function Dashboard({ user }) {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (!user) return

    const userBookings = dummyBookings.filter(booking => booking.user?._id === user._id)
    setBookings(userBookings)
  }, [user])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (!user) {
    return <div className="dashboard-error">Please log in to view your bookings.</div>
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet (displaying Dummy data).</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>
                  {booking.flight?.airline} - {booking.flight?.flightNumber}
                </h3>
                <span className={`booking-status ${booking.status}`}>{booking.status}</span>
              </div>

              <div className="booking-details">
                <div className="booking-route">
                  <div className="booking-city">
                    <span className="city-name">{booking.flight?.from}</span>
                    <span className="city-time">{formatDate(booking.flight?.departureTime)}</span>
                  </div>

                  <div className="booking-arrow">→</div>

                  <div className="booking-city">
                    <span className="city-name">{booking.flight?.to}</span>
                    <span className="city-time">{formatDate(booking.flight?.arrivalTime)}</span>
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
                      {booking.seatClass ? booking.seatClass.charAt(0).toUpperCase() + booking.seatClass.slice(1) : 'N/A'}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Seats:</span>
                    <span className="info-value">{booking.seats?.join(", ") || 'N/A'}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Booking Date:</span>
                    <span className="info-value">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="booking-footer">
                <div className="booking-price">Total: ${booking.totalPrice?.toFixed(2)}</div>
                {booking.status !== "cancelled" && (
                  <button className="cancel-booking-button" disabled>
                    Cancel Booking (Disabled)
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
