const mongoose = require("mongoose")

const flightSchema = new mongoose.Schema(
  {
    airline: {
      type: String,
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    aircraft: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      get: function () {
        return Math.round((this.arrivalTime - this.departureTime) / (1000 * 60))
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  },
)

module.exports = mongoose.model("Flight", flightSchema)
