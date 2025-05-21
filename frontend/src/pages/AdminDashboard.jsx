"use client"

import React, { useState, useEffect, useCallback } from "react"
import "../styles/AdminDashboard.css"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const initialFlightFormState = {
  airline: "",
  flightNumber: "",
  from: "",
  to: "",
  departureTime: "",
  arrivalTime: "",
  price: "",
  availableSeats: "",
  aircraft: "",
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights")
  
  // Flights State
  const [flights, setFlights] = useState([])
  const [loadingFlights, setLoadingFlights] = useState(true)
  const [errorFlights, setErrorFlights] = useState(null)
  const [showAddFlightForm, setShowAddFlightForm] = useState(false)
  const [newFlightData, setNewFlightData] = useState(initialFlightFormState)
  const [editingFlight, setEditingFlight] = useState(null);

  // Bookings State
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [errorBookings, setErrorBookings] = useState(null)

  // Users State
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [errorUsers, setErrorUsers] = useState(null)

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // --- FLIGHTS ---
  const fetchFlights = useCallback(async () => {
    setLoadingFlights(true);
    setErrorFlights(null);
    try {
      const response = await fetch(`${API_BASE_URL}/flights`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch flights");
      }
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error("Fetch flights error:", error);
      setErrorFlights(error.message);
    } finally {
      setLoadingFlights(false);
    }
  }, []);

  const handleNewFlightChange = (e) => {
    const { name, value } = e.target;
    setNewFlightData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewFlight = async (e) => {
    e.preventDefault();
    setErrorFlights(null);
    try {
      const flightDataToSubmit = {
        ...newFlightData,
        price: parseFloat(newFlightData.price),
        availableSeats: parseInt(newFlightData.availableSeats, 10),
      };
      const response = await fetch(`${API_BASE_URL}/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightDataToSubmit),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add flight");
      }
      setNewFlightData(initialFlightFormState);
      setShowAddFlightForm(false);
      fetchFlights();
    } catch (error) {
      console.error("Add flight error:", error);
      setErrorFlights(error.message);
    }
  };

  const handleEditFlight = (flight) => {
    setEditingFlight(flight);
    setNewFlightData({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      from: flight.from,
      to: flight.to,
      departureTime: formatDateForInput(flight.departureTime),
      arrivalTime: formatDateForInput(flight.arrivalTime),
      price: flight.price.toString(),
      availableSeats: flight.availableSeats.toString(),
      aircraft: flight.aircraft || "",
    });
    setShowAddFlightForm(true);
  };

  const handleUpdateFlight = async (e) => {
    e.preventDefault();
    if (!editingFlight) return;
    setErrorFlights(null);
    try {
      const flightDataToSubmit = {
        ...newFlightData,
        price: parseFloat(newFlightData.price),
        availableSeats: parseInt(newFlightData.availableSeats, 10),
      };
      const response = await fetch(`${API_BASE_URL}/flights/${editingFlight._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightDataToSubmit),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update flight");
      }
      setNewFlightData(initialFlightFormState);
      setShowAddFlightForm(false);
      setEditingFlight(null);
      fetchFlights();
    } catch (error) {
      console.error("Update flight error:", error);
      setErrorFlights(error.message);
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    setErrorFlights(null);
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, { method: "DELETE" });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete flight");
      }
      fetchFlights();
    } catch (error) {
      console.error("Delete flight error:", error);
      setErrorFlights(error.message);
    }
  };

  // --- BOOKINGS ---
  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    setErrorBookings(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`); // Uses the new GET /api/bookings route
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      setErrorBookings(error.message);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    setErrorBookings(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update booking status");
      }
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      console.error("Update booking status error:", error);
      setErrorBookings(error.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setErrorBookings(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, { method: "DELETE" });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete booking");
      }
      fetchBookings();
    } catch (error) {
      console.error("Delete booking error:", error);
      setErrorBookings(error.message);
    }
  };

  // --- USERS ---
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch users error:", error);
      setErrorUsers(error.message);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const handleUserRoleChange = async (userId, newRole) => {
    setErrorUsers(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }), // Assuming backend accepts { role: "newRole" }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update user role");
      }
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error("Update user role error:", error);
      setErrorUsers(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete their bookings.")) return;
    setErrorUsers(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, { method: "DELETE" });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete user");
      }
      fetchUsers();
      fetchBookings(); // Also refresh bookings as they might be affected
    } catch (error) {
      console.error("Delete user error:", error);
      setErrorUsers(error.message);
    }
  };


  useEffect(() => {
    if (activeTab === "flights") {
      fetchFlights();
    } else if (activeTab === "bookings") {
      fetchBookings();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, fetchFlights, fetchBookings, fetchUsers]);


  const flightForm = (
    <form onSubmit={editingFlight ? handleUpdateFlight : handleAddNewFlight} className="flight-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="airline">Airline</label>
          <input type="text" id="airline" name="airline" value={newFlightData.airline} onChange={handleNewFlightChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="flightNumber">Flight Number</label>
          <input type="text" id="flightNumber" name="flightNumber" value={newFlightData.flightNumber} onChange={handleNewFlightChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="from">From</label>
          <input type="text" id="from" name="from" value={newFlightData.from} onChange={handleNewFlightChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="to">To</label>
          <input type="text" id="to" name="to" value={newFlightData.to} onChange={handleNewFlightChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="departureTime">Departure Time</label>
          <input type="datetime-local" id="departureTime" name="departureTime" value={newFlightData.departureTime} onChange={handleNewFlightChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="arrivalTime">Arrival Time</label>
          <input type="datetime-local" id="arrivalTime" name="arrivalTime" value={newFlightData.arrivalTime} onChange={handleNewFlightChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input type="number" id="price" name="price" value={newFlightData.price} onChange={handleNewFlightChange} required min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label htmlFor="availableSeats">Available Seats</label>
          <input type="number" id="availableSeats" name="availableSeats" value={newFlightData.availableSeats} onChange={handleNewFlightChange} required min="0" />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="aircraft">Aircraft (Optional)</label>
        <input type="text" id="aircraft" name="aircraft" value={newFlightData.aircraft} onChange={handleNewFlightChange} />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={() => { setShowAddFlightForm(false); setEditingFlight(null); setNewFlightData(initialFlightFormState); }}>Cancel</button>
        <button type="submit" className="submit-button">{editingFlight ? "Update Flight" : "Add Flight"}</button>
      </div>
    </form>
  );

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      <div className="admin-tabs">
        <button className={`tab-button ${activeTab === "flights" ? "active" : ""}`} onClick={() => setActiveTab("flights")}>
          Manage Flights
        </button>
        <button className={`tab-button ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
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
              {!showAddFlightForm && (
                <button className="add-new-button" onClick={() => { setEditingFlight(null); setNewFlightData(initialFlightFormState); setShowAddFlightForm(true); }}>
                  Add New Flight
                </button>
              )}
              {showAddFlightForm && (
                <>
                  <h3>{editingFlight ? "Edit Flight" : "Add New Flight"}</h3>
                  {flightForm}
                </>
              )}
            </div>
            
            {errorFlights && <div className="admin-error">Error: {errorFlights}</div>}

            <div className="flights-list">
              <h3>All Flights</h3>
              {loadingFlights ? (
                <div className="loading">Loading flights...</div>
              ) : flights.length === 0 && !errorFlights ? (
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
                      <th>Aircraft</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((flight) => (
                      <tr key={flight._id}>
                        <td>{flight.airline}</td>
                        <td>{flight.flightNumber}</td>
                        <td>{flight.from} → {flight.to}</td>
                        <td>{formatDateForDisplay(flight.departureTime)}</td>
                        <td>{formatDateForDisplay(flight.arrivalTime)}</td>
                        <td>${flight.price?.toFixed(2)}</td>
                        <td>{flight.availableSeats}</td>
                        <td>{flight.aircraft || "N/A"}</td>
                        <td>
                          <button className="edit-button" onClick={() => handleEditFlight(flight)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDeleteFlight(flight._id)}>Delete</button>
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
            {errorBookings && <div className="admin-error">Error: {errorBookings}</div>}
            {loadingBookings ? (
              <div className="loading">Loading bookings...</div>
            ) : bookings.length === 0 && !errorBookings ? (
              <div className="no-data">No bookings available.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Flight</th>
                    <th>Departure</th>
                    <th>Seats</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id.slice(-6)}...</td>
                      <td>{booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})</td>
                      <td>{booking.flight?.airline} {booking.flight?.flightNumber} ({booking.flight?.from} → {booking.flight?.to})</td>
                      <td>{formatDateForDisplay(booking.flight?.departureTime)}</td>
                      <td>{booking.seats?.join(", ")}</td>
                      <td>${booking.totalPrice?.toFixed(2)}</td>
                      <td>
                        <select
                          className="status-select"
                          value={booking.status}
                          onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="delete-button" onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
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
            {errorUsers && <div className="admin-error">Error: {errorUsers}</div>}
            {loadingUsers ? (
              <div className="loading">Loading users...</div>
            ) : users.length === 0 && !errorUsers ? (
              <div className="no-data">No users registered.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Bookings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id.slice(-6)}...</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          className="status-select"
                          value={user.role}
                          onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{user.bookingsCount}</td>
                      <td>
                        <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                      </td>
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
