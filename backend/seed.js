const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Flight = require("./models/Flight");
const Booking = require("./models/Booking");

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/airline_management";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected for seeding...");

    // --- Clear Existing Data ---
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Flight.deleteMany({});
    await Booking.deleteMany({});
    console.log("Existing data cleared.");

    // --- Seed Users ---
    console.log("Seeding users...");
    const usersData = [
      { name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" }, // Hash passwords in production!
      { name: "John Doe", email: "john.doe@example.com", password: "password123", role: "user" },
      { name: "Jane Smith", email: "jane.smith@example.com", password: "password123", role: "user" },
    ];
    const createdUsers = await User.insertMany(usersData);
    console.log(`${createdUsers.length} users seeded.`);

    // --- Seed Flights ---
    console.log("Seeding flights...");
    const flightsData = [
      {
        airline: "Example Air",
        flightNumber: "EA101",
        from: "New York",
        to: "London",
        departureTime: new Date("2025-07-15T09:00:00Z"),
        arrivalTime: new Date("2025-07-15T21:00:00Z"),
        price: 650.00,
        availableSeats: 150,
        aircraft: "Boeing 777",
      },
      {
        airline: "FlyHigh",
        flightNumber: "FH202",
        from: "London",
        to: "Paris",
        departureTime: new Date("2025-07-16T11:30:00Z"),
        arrivalTime: new Date("2025-07-16T12:45:00Z"),
        price: 120.50,
        availableSeats: 80,
        aircraft: "Airbus A320",
      },
      {
        airline: "Example Air",
        flightNumber: "EA102",
        from: "London",
        to: "New York",
        departureTime: new Date("2025-07-20T14:00:00Z"),
        arrivalTime: new Date("2025-07-20T17:00:00Z"), // Shorter duration for example
        price: 700.00,
        availableSeats: 140,
        aircraft: "Boeing 787",
      },
       {
        airline: "Connect Airways",
        flightNumber: "CA305",
        from: "Paris",
        to: "New York",
        departureTime: new Date("2025-07-18T10:00:00Z"),
        arrivalTime: new Date("2025-07-18T12:30:00Z"),
        price: 850.00,
        availableSeats: 200,
        aircraft: "Airbus A380",
      },
    ];
    const createdFlights = await Flight.insertMany(flightsData);
    console.log(`${createdFlights.length} flights seeded.`);

    // --- Seed Bookings ---
    console.log("Seeding bookings...");
    // Ensure we have users and flights created to link bookings
    if (createdUsers.length > 1 && createdFlights.length > 0) {
      const bookingsData = [
        {
          user: createdUsers[1]._id, // John Doe
          flight: createdFlights[0]._id, // EA101 NY -> London
          passengers: 1,
          seatClass: "economy",
          seats: ["14A"],
          totalPrice: createdFlights[0].price * 1,
          status: "confirmed",
        },
        {
          user: createdUsers[2]._id, // Jane Smith
          flight: createdFlights[1]._id, // FH202 London -> Paris
          passengers: 2,
          seatClass: "business",
          seats: ["3B", "3C"],
          totalPrice: createdFlights[1].price * 2 * 1.5, // Example business class price
          status: "confirmed",
        },
         {
          user: createdUsers[1]._id, // John Doe
          flight: createdFlights[3]._id, // CA305 Paris -> NY
          passengers: 1,
          seatClass: "first",
          seats: ["1A"],
          totalPrice: createdFlights[3].price * 1 * 2.5, // Example first class price
          status: "confirmed",
        },
      ];

      // Update available seats for booked flights
      for (const booking of bookingsData) {
          const flight = await Flight.findById(booking.flight);
          if (flight && flight.availableSeats >= booking.passengers) {
              flight.availableSeats -= booking.passengers;
              await flight.save();
          } else {
              console.warn(`Could not create booking for flight ${booking.flight}: Not enough seats or flight not found.`);
              // Optionally remove this booking from bookingsData if seat check fails
          }
      }

      const createdBookings = await Booking.insertMany(bookingsData.filter(b => b)); // Filter out potentially removed bookings
      console.log(`${createdBookings.length} bookings seeded.`);
    } else {
      console.log("Skipping booking seeding: Not enough users or flights created.");
    }

    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

// Run the seed function
seedDatabase();