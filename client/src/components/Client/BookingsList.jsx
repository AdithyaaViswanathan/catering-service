import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import './Client.css';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bookings-list-page">
      <div className="container">
        <h1>My Bookings</h1>
        <div className="bookings-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'assigned' ? 'active' : ''}`}
            onClick={() => setFilter('assigned')}
          >
            Assigned
          </button>
          <button
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <div className="bookings-grid">
          {filteredBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking._id} className="booking-detail-card">
                <div className="booking-detail-header">
                  <h3>Event on {new Date(booking.eventDate).toLocaleDateString()}</h3>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-detail-info">
                  <p><strong>Time:</strong> {booking.eventTime}</p>
                  <p><strong>Location:</strong> {booking.location}</p>
                  <p><strong>Guests:</strong> {booking.numberOfGuests}</p>
                  <p><strong>Total:</strong> ₹{booking.totalPrice.toFixed(2)}</p>
                  {booking.workerId && (
                    <p><strong>Worker:</strong> {booking.workerId.name} ({booking.workerId.email})</p>
                  )}
                  {booking.specialRequests && (
                    <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
                  )}
                </div>
                <div className="booking-menu-items">
                  <h4>Menu Items:</h4>
                  <ul>
                    {booking.menuItems.map((item, index) => (
                      <li key={index}>
                        {item.menuItemId.name} x {item.quantity} - ₹{item.price.toFixed(2)} each
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsList;

