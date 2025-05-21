"use client"

import { useState, useEffect } from "react"
import "../styles/Dashboard.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function Dashboard({ user }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false); // Not logged in or user object incomplete
      return;
    }

    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/bookings/user/${user._id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch user bookings:", err);
        setError(err.message || "Failed to load your bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to cancel booking.");
        }
        setBookings(prevBookings => prevBookings.filter(b => b._id !== bookingId));
        alert("Booking cancelled successfully.");
    } catch (err) {
        console.error("Cancel booking error:", err);
        alert(`Error: ${err.message}`);
    }
  };

  if (!user) {
    return <div className="dashboard-error">Please log in to view your bookings.</div>
  }

  if (loading) {
    return <div className="loading">Loading your bookings...</div>
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>
                  {booking.flight?.airline || 'N/A'} - {booking.flight?.flightNumber || 'N/A'}
                </h3>
                <span className={`booking-status ${booking.status?.toLowerCase()}`}>{booking.status}</span>
              </div>

              <div className="booking-details">
                <div className="booking-route">
                  <div className="booking-city">
                    <span className="city-name">{booking.flight?.from || 'N/A'}</span>
                    <span className="city-time">{formatDate(booking.flight?.departureTime)}</span>
                  </div>
                  <div className="booking-arrow">→</div>
                  <div className="booking-city">
                    <span className="city-name">{booking.flight?.to || 'N/A'}</span>
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
                  <button 
                    className="cancel-booking-button" 
                    onClick={() => handleCancelBooking(booking._id)}
                  >
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
