import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    assignedBookings: 0,
    completedBookings: 0,
    totalUsers: 0,
    totalClients: 0,
    totalWorkers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [bookingsResponse, usersResponse] = await Promise.all([
        api.get('/bookings'),
        api.get('/users')
      ]);

      const bookings = bookingsResponse.data;
      const users = usersResponse.data;

      const totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        assignedBookings: bookings.filter(b => b.status === 'assigned').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        totalUsers: users.length,
        totalClients: users.filter(u => u.role === 'client').length,
        totalWorkers: users.filter(u => u.role === 'worker').length,
        totalRevenue: totalRevenue
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{stats.pendingBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Assigned</h3>
            <p>{stats.assignedBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{stats.completedBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Clients</h3>
            <p>{stats.totalClients}</p>
          </div>
          <div className="stat-card">
            <h3>Workers</h3>
            <p>{stats.totalWorkers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

