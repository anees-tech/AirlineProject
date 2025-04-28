"use client"

import { useState } from "react"
import "../styles/AdminDashboard.css"
// Import dummy data
import { dummyFlights, dummyBookings, dummyUsers } from "../data/dummyData"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights")
  // Use dummy data directly
  const [flights] = useState(dummyFlights)
  const [bookings] = useState(dummyBookings)
  const [users] = useState(dummyUsers)

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "flights" ? "active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          Manage Flights
        </button>
        <button
          className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          Manage Bookings
        </button>
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          Manage Users
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "flights" && (
          <div className="flights-management">
            <div className="flight-form-container">
              <h3>Add/Edit Flights (Disabled)</h3>
              <p>Flight management via API is disabled. Displaying static data.</p>
            </div>

            <div className="flights-list">
              <h3>All Flights</h3>
              {flights.length === 0 ? (
                <div className="no-data">No flights available.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Airline</th>
                      <th>Flight #</th>
                      <th>Route</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Price</th>
                      <th>Seats</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((flight) => (
                      <tr key={flight._id}>
                        <td>{flight.airline}</td>
                        <td>{flight.flightNumber}</td>
                        <td>
                          {flight.from} → {flight.to}
                        </td>
                        <td>{formatDate(flight.departureTime)}</td>
                        <td>{formatDate(flight.arrivalTime)}</td>
                        <td>${flight.price?.toFixed(2)}</td>
                        <td>{flight.availableSeats}</td>
                        <td>
                          <button className="edit-button" disabled>Edit</button>
                          <button className="delete-button" disabled>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-management">
            <h3>All Bookings</h3>
            {bookings.length === 0 ? (
              <div className="no-data">No bookings available.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Flight</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Passengers</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}...</td>
                      <td>{booking.user?.name || 'N/A'}</td>
                      <td>
                        {booking.flight?.airline} {booking.flight?.flightNumber}
                      </td>
                      <td>
                        {booking.flight?.from} → {booking.flight?.to}
                      </td>
                      <td>{formatDate(booking.flight?.departureTime)}</td>
                      <td>{booking.passengers}</td>
                      <td>${booking.totalPrice?.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={booking.status}
                          disabled
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-management">
            <h3>All Users</h3>
            {users.length === 0 ? (
              <div className="no-data">No users available.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id.substring(0, 8)}...</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>{user.bookingsCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
