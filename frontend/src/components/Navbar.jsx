"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

function Navbar({ user, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const onLogout = () => {
    handleLogout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <h1>AirlineMS</h1>
          </Link>
        </div>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <span className={`menu-bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`menu-bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`menu-bar ${mobileMenuOpen ? "open" : ""}`}></span>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link className="nav-link" to="/flights">
              Flights
            </Link>
          </li>

          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  My Bookings
                </Link>
              </li>

              {user.role === "admin" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Admin
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="nav-auth">
          {user ? (
            <div className="user-info">
              <span className="username">Welcome, {user.name}</span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link className="auth-btn" to="/login">
                Login
              </Link>
              <Link className="auth-btn" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
