export const dummyUsers = [
  { _id: "user1", name: "John Doe", email: "john.doe@example.com", role: "user", createdAt: new Date("2024-01-10T10:00:00Z"), bookingsCount: 2 },
  { _id: "user2", name: "Jane Smith", email: "jane.smith@example.com", role: "user", createdAt: new Date("2024-02-15T11:30:00Z"), bookingsCount: 1 },
  { _id: "admin1", name: "Admin User", email: "admin@example.com", role: "admin", createdAt: new Date("2024-01-01T09:00:00Z"), bookingsCount: 0 },
];

export const dummyFlights = [
   {
    _id: "flight1",
    airline: "Example Air",
    flightNumber: "EA101",
    from: "New York",
    to: "London",
    departureTime: new Date("2025-07-15T09:00:00Z"),
    arrivalTime: new Date("2025-07-15T21:00:00Z"),
    price: 650.00,
    availableSeats: 148, // Adjusted for dummy bookings
    aircraft: "Boeing 777",
    duration: 720,
  },
  {
    _id: "flight2",
    airline: "FlsdasdhyHigh",
    flightNumber: "FH202",
    from: "London",
    to: "Paris",
    departureTime: new Date("2025-07-16T11:30:00Z"),
    arrivalTime: new Date("2025-07-16T12:45:00Z"),
    price: 120.50,
    availableSeats: 78, // Adjusted for dummy bookings
    aircraft: "Airbus A320",
    duration: 75,
  },
  {
    _id: "flight3",
    airline: "Example Air",
    flightNumber: "EA102",
    from: "London",
    to: "New York",
    departureTime: new Date("2025-07-20T14:00:00Z"),
    arrivalTime: new Date("2025-07-20T17:00:00Z"),
    price: 700.00,
    availableSeats: 140,
    aircraft: "Boeing 787",
    duration: 180,
  },
   {
    _id: "flight4",
    airline: "Connect Airways",
    flightNumber: "CA305",
    from: "Paris",
    to: "New York",
    departureTime: new Date("2025-07-18T10:00:00Z"),
    arrivalTime: new Date("2025-07-18T12:30:00Z"),
    price: 850.00,
    availableSeats: 199, // Adjusted for dummy bookings
    aircraft: "Airbus A380",
    duration: 150,
  },
];

export const dummyBookings = [
   {
    _id: "booking1",
    user: dummyUsers[0], // John Doe
    flight: dummyFlights[0], // EA101 NY -> London
    passengers: 1,
    seatClass: "economy",
    seats: ["14A"],
    totalPrice: 650.00,
    status: "confirmed",
    createdAt: new Date("2025-05-01T14:00:00Z"),
  },
  {
    _id: "booking2",
    user: dummyUsers[1], // Jane Smith
    flight: dummyFlights[1], // FH202 London -> Paris
    passengers: 2,
    seatClass: "business",
    seats: ["3B", "3C"],
    totalPrice: 361.50, // 120.50 * 2 * 1.5
    status: "confirmed",
    createdAt: new Date("2025-05-05T10:30:00Z"),
  },
   {
    _id: "booking3",
    user: dummyUsers[0], // John Doe
    flight: dummyFlights[3], // CA305 Paris -> NY
    passengers: 1,
    seatClass: "first",
    seats: ["1A"],
    totalPrice: 2125.00, // 850.00 * 1 * 2.5
    status: "pending",
    createdAt: new Date("2025-05-10T16:45:00Z"),
  },
];