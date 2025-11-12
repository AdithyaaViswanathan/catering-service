import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import './Client.css';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      const bookingsData = response.data;
      setBookings(bookingsData.slice(0, 5)); // Show only recent 5
      
      const statsData = {
        total: bookingsData.length,
        pending: bookingsData.filter(b => b.status === 'pending').length,
        assigned: bookingsData.filter(b => b.status === 'assigned').length,
        completed: bookingsData.filter(b => b.status === 'completed').length
      };
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="client-dashboard">
      <div className="container">
        <h1>Client Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
          <div className="stat-card">
            <h3>Assigned</h3>
            <p>{stats.assigned}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
        <div className="dashboard-actions">
          <Link to="/client/bookings/new" className="btn btn-primary">Create New Booking</Link>
          <Link to="/client/bookings" className="btn btn-secondary">View All Bookings</Link>
        </div>
        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet. <Link to="/client/bookings/new">Create your first booking</Link></p>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>Event on {new Date(booking.eventDate).toLocaleDateString()}</h3>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p>Location: {booking.location}</p>
                  <p>Guests: {booking.numberOfGuests}</p>
                  <p>Total: ₹{booking.totalPrice.toFixed(2)}</p>
                  {booking.workerId && (
                    <p>Worker: {booking.workerId.name}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

