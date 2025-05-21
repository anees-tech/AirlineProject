import React, { useState } from 'react';
import './SearchForm.css'; // We'll create this CSS file next
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const SearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd call onSearch or a similar prop
    // to pass the search criteria to the parent component (Flights.jsx)
    // to then filter flights or make an API call.
    console.log('Search criteria:', { from, to, departureDate, passengers });
    if (onSearch) {
      onSearch({ from, to, date: departureDate, passengers });
    }
    // For now, this is a placeholder.
    alert(`Searching flights from ${from} to ${to} on ${departureDate} for ${passengers} passenger(s). This is a placeholder and doesn't actually filter flights yet.`);
  };

  return (
    <div className="flight-search-form-container">
      <form onSubmit={handleSubmit} className="flight-search-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="from"><FaPlaneDeparture /> From</label>
            <input 
              type="text" 
              id="from" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              placeholder="Departure city or airport" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="to"><FaPlaneArrival /> To</label>
            <input 
              type="text" 
              id="to" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              placeholder="Arrival city or airport" 
              required 
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="departureDate"><FaCalendarAlt /> Departure Date</label>
            <input 
              type="date" 
              id="departureDate" 
              value={departureDate} 
              onChange={(e) => setDepartureDate(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="passengers"><FaUsers /> Passengers</label>
            <input 
              type="number" 
              id="passengers" 
              value={passengers} 
              onChange={(e) => setPassengers(parseInt(e.target.value, 10))} 
              min="1" 
              max="9" 
              required 
            />
          </div>
        </div>
        <div className="form-group form-submit-group">
          <button type="submit" className="btn-search-flights">Search Flights</button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;