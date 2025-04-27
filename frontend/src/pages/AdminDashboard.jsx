"use client"

import { useState, useEffect } from "react"
import "../styles/AdminDashboard.css"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights")
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [flightForm, setFlightForm] = useState({
    airline: "",
    flightNumber: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    availableSeats: "",
    aircraft: "",
  })
  const [editingFlightId, setEditingFlightId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    setError("")

    try {
      let endpoint
      switch (activeTab) {
        case "flights":
          endpoint = "flights"
          break
        case "bookings":
          endpoint = "bookings"
          break
        case "users":
          endpoint = "users"
          break
        default:
          endpoint = "flights"
      }

      const response = await fetch(`http://localhost:5000/api/${endpoint}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch ${endpoint}`)
      }

      switch (activeTab) {
        case "flights":
          setFlights(data)
          break
        case "bookings":
          setBookings(data)
          break
        case "users":
          setUsers(data)
          break
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFlightFormChange = (e) => {
    const { name, value } = e.target
    setFlightForm({
      ...flightForm,
      [name]: value,
    })
  }

  const handleFlightSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const method = editingFlightId ? "PUT" : "POST"
      const url = editingFlightId
        ? `http://localhost:5000/api/flights/${editingFlightId}`
        : "http://localhost:5000/api/flights"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to save flight")
      }

      // Reset form and refresh data
      setFlightForm({
        airline: "",
        flightNumber: "",
        from: "",
        to: "",
        departureTime: "",
        arrivalTime: "",
        price: "",
        availableSeats: "",
        aircraft: "",
      })
      setEditingFlightId(null)
      fetchData()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditFlight = (flight) => {
    setFlightForm({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      from: flight.from,
      to: flight.to,
      departureTime: new Date(flight.departureTime).toISOString().slice(0, 16),
      arrivalTime: new Date(flight.arrivalTime).toISOString().slice(0, 16),
      price: flight.price,
      availableSeats: flight.availableSeats,
      aircraft: flight.aircraft,
    })
    setEditingFlightId(flight._id)
  }

  const handleDeleteFlight = async (flightId) => {
    if (!confirm("Are you sure you want to delete this flight?")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/flights/${flightId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete flight")
      }

      // Refresh data
      fetchData()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status")
      }

      // Refresh data
      fetchData()
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

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <div className="admin-content">
          {activeTab === "flights" && (
            <div className="flights-management">
              <div className="flight-form-container">
                <h3>{editingFlightId ? "Edit Flight" : "Add New Flight"}</h3>
                <form className="flight-form" onSubmit={handleFlightSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="airline">Airline</label>
                      <input
                        type="text"
                        id="airline"
                        name="airline"
                        value={flightForm.airline}
                        onChange={handleFlightFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="flightNumber">Flight Number</label>
                      <input
                        type="text"
                        id="flightNumber"
                        name="flightNumber"
                        value={flightForm.flightNumber}
                        onChange={handleFlightFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="from">From</label>
                      <input
                        type="text"
                        id="from"
                        name="from"
                        value={flightForm.from}
                        onChange={handleFlightFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="to">To</label>
                      <input
                        type="text"
                        id="to"
                        name="to"
                        value={flightForm.to}
                        onChange={handleFlightFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="departureTime">Departure Time</label>
                      <input
                        type="datetime-local"
                        id="departureTime"
                        name="departureTime"
                        value={flightForm.departureTime}
                        onChange={handleFlightFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="arrivalTime">Arrival Time</label>
                      <input
                        type="datetime-local"
                        id="arrivalTime"
                        name="arrivalTime"
                        value={flightForm.arrivalTime}
                        onChange={handleFlightFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="price">Price ($)</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={flightForm.price}
                        onChange={handleFlightFormChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="availableSeats">Available Seats</label>
                      <input
                        type="number"
                        id="availableSeats"
                        name="availableSeats"
                        value={flightForm.availableSeats}
                        onChange={handleFlightFormChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="aircraft">Aircraft</label>
                    <input
                      type="text"
                      id="aircraft"
                      name="aircraft"
                      value={flightForm.aircraft}
                      onChange={handleFlightFormChange}
                      required
                    />
                  </div>

                  <div className="form-actions">
                    {editingFlightId && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                          setFlightForm({
                            airline: "",
                            flightNumber: "",
                            from: "",
                            to: "",
                            departureTime: "",
                            arrivalTime: "",
                            price: "",
                            availableSeats: "",
                            aircraft: "",
                          })
                          setEditingFlightId(null)
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="submit-button">
                      {editingFlightId ? "Update Flight" : "Add Flight"}
                    </button>
                  </div>
                </form>
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
                          <td>${flight.price}</td>
                          <td>{flight.availableSeats}</td>
                          <td>
                            <button className="edit-button" onClick={() => handleEditFlight(flight)}>
                              Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteFlight(flight._id)}>
                              Delete
                            </button>
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
                        <td>{booking.user.name}</td>
                        <td>
                          {booking.flight.airline} {booking.flight.flightNumber}
                        </td>
                        <td>
                          {booking.flight.from} → {booking.flight.to}
                        </td>
                        <td>{formatDate(booking.flight.departureTime)}</td>
                        <td>{booking.passengers}</td>
                        <td>${booking.totalPrice.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={booking.status}
                            onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
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
      )}
    </div>
  )
}

export default AdminDashboard
