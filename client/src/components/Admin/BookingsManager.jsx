import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';
import './Admin.css';

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

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

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setToast({ message: 'Status updated successfully!', type: 'success' });
      fetchBookings();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to update status',
        type: 'error'
      });
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bookings-manager-page">
      <div className="container">
        <h1>Manage Bookings</h1>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
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
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
        <div className="bookings-grid">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="booking-admin-card">
              <div className="booking-admin-header">
                <h3>Booking #{booking._id.slice(-6)}</h3>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-admin-info">
                <p><strong>Client:</strong> {booking.clientId.name} ({booking.clientId.email})</p>
                {booking.workerId && (
                  <p><strong>Worker:</strong> {booking.workerId.name} ({booking.workerId.email})</p>
                )}
                <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.eventTime}</p>
                <p><strong>Location:</strong> {booking.location}</p>
                <p><strong>Guests:</strong> {booking.numberOfGuests}</p>
                <p><strong>Total:</strong> ₹{booking.totalPrice.toFixed(2)}</p>
                {booking.specialRequests && (
                  <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
                )}
              </div>
              <div className="booking-admin-menu">
                <h4>Menu Items:</h4>
                <ul>
                  {booking.menuItems.map((item, index) => (
                    <li key={index}>
                      {item.menuItemId.name} x {item.quantity} - ₹{item.price.toFixed(2)} each
                    </li>
                  ))}
                </ul>
              </div>
              <div className="booking-admin-actions">
                <select
                  value={booking.status}
                  onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsManager;

