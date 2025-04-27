const express = require("express")
const router = express.Router()
const Booking = require("../models/Booking")
const Flight = require("../models/Flight")

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email").populate("flight").sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get bookings for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate("flight").sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get user bookings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user", "name email").populate("flight")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { flightId, userId, passengers, seatClass, seats, totalPrice } = req.body

    // Check if flight exists and has enough seats
    const flight = await Flight.findById(flightId)
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" })
    }

    if (flight.availableSeats < passengers) {
      return res.status(400).json({ message: "Not enough seats available" })
    }

    // Create booking
    const booking = new Booking({
      user: userId,
      flight: flightId,
      passengers,
      seatClass,
      seats,
      totalPrice,
    })

    await booking.save()

    // Update available seats on flight
    flight.availableSeats -= passengers
    await flight.save()

    res.status(201).json(booking)
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update booking status
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // If cancelling a booking, update flight's available seats
    if (status === "cancelled" && booking.status !== "cancelled") {
      const flight = await Flight.findById(booking.flight)
      if (flight) {
        flight.availableSeats += booking.passengers
        await flight.save()
      }
    }

    booking.status = status
    await booking.save()

    res.json(booking)
  } catch (error) {
    console.error("Update booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // If booking is not cancelled, update flight's available seats
    if (booking.status !== "cancelled") {
      const flight = await Flight.findById(booking.flight)
      if (flight) {
        flight.availableSeats += booking.passengers
        await flight.save()
      }
    }

    await Booking.findByIdAndDelete(req.params.id)

    res.json({ message: "Booking cancelled successfully" })
  } catch (error) {
    console.error("Delete booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
