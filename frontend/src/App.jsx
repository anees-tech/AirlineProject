"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer" // Import the Footer component
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Flights from "./pages/Flights"
import Booking from "./pages/Booking"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const AdminRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>
    return user && user.role === "admin" ? children : <Navigate to="/flights" />
  }

  const UserRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>
    return user ? children : <Navigate to="/login" />
  }

  if (loading) {
    return <div>Loading application...</div>
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} handleLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/flights" />} />
            <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/flights" />} />
            <Route path="/flights" element={<Flights user={user} />} />
            <Route
              path="/dashboard"
              element={
                <UserRoute>
                  <Dashboard user={user} />
                </UserRoute>
              }
            />
            <Route
              path="/booking/:flightId"
              element={
                <UserRoute>
                  <Booking user={user} />
                </UserRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/flights" />} />
          </Routes>
        </main>
        {/* Replace inline footer with the Footer component */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
