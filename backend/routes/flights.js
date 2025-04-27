const express = require("express")
const router = express.Router()
const Flight = require("../models/Flight")

// Get all flights with optional filtering
router.get("/", async (req, res) => {
  try {
    const { from, to, date } = req.query

    // Build filter object
    const filter = {}
    if (from) filter.from = new RegExp(from, "i")
    if (to) filter.to = new RegExp(to, "i")
    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)

      filter.departureTime = {
        $gte: searchDate,
        $lt: nextDay,
      }
    }

    const flights = await Flight.find(filter).sort({ departureTime: 1 })
    res.json(flights)
  } catch (error) {
    console.error("Get flights error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single flight by ID
router.get("/:id", async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" })
    }

    res.json(flight)
  } catch (error) {
    console.error("Get flight error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new flight
router.post("/", async (req, res) => {
  try {
    const flight = new Flight(req.body)
    await flight.save()
    res.status(201).json(flight)
  } catch (error) {
    console.error("Create flight error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a flight
router.put("/:id", async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" })
    }

    res.json(flight)
  } catch (error) {
    console.error("Update flight error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a flight
router.delete("/:id", async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id)

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" })
    }

    res.json({ message: "Flight deleted successfully" })
  } catch (error) {
    console.error("Delete flight error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
