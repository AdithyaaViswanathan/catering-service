import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import './Worker.css';

const Dashboard = () => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    available: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [availableResponse, myJobsResponse, userResponse] = await Promise.all([
        api.get('/bookings/available'),
        api.get('/bookings/my-jobs'),
        api.get('/users/me')
      ]);

      setAvailableJobs(availableResponse.data);
      setMyJobs(myJobsResponse.data);

      if (userResponse.data.availabilityStatus) {
        setAvailabilityStatus(userResponse.data.availabilityStatus);
      }

      const statsData = {
        available: availableResponse.data.length,
        assigned: myJobsResponse.data.filter(j => j.status === 'assigned').length,
        inProgress: myJobsResponse.data.filter(j => j.status === 'in-progress').length,
        completed: myJobsResponse.data.filter(j => j.status === 'completed').length
      };
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const newStatus = availabilityStatus === 'available' ? 'busy' : 'available';
      await api.put('/users/me', { availabilityStatus: newStatus });
      setAvailabilityStatus(newStatus);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="worker-dashboard">
      <div className="container">
        <h1>Worker Dashboard</h1>
        <div className="availability-toggle">
          <label>Availability Status:</label>
          <button
            className={`btn ${availabilityStatus === 'available' ? 'btn-success' : 'btn-secondary'}`}
            onClick={handleAvailabilityToggle}
          >
            {availabilityStatus === 'available' ? 'Available' : 'Busy'}
          </button>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Available Jobs</h3>
            <p>{stats.available}</p>
          </div>
          <div className="stat-card">
            <h3>Assigned</h3>
            <p>{stats.assigned}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{stats.inProgress}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h2>Available Jobs ({availableJobs.length})</h2>
            {availableJobs.length === 0 ? (
              <p>No available jobs at the moment.</p>
            ) : (
              <div className="jobs-preview">
                {availableJobs.slice(0, 3).map(job => (
                  <div key={job._id} className="job-card">
                    <h3>Event on {new Date(job.eventDate).toLocaleDateString()}</h3>
                    <p>Location: {job.location}</p>
                    <p>Guests: {job.numberOfGuests}</p>
                    <p>Total: ₹{job.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dashboard-section">
            <h2>My Jobs ({myJobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled').length})</h2>
            {myJobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled').length === 0 ? (
              <p>You don't have any active jobs yet.</p>
            ) : (
              <div className="jobs-preview">
                {myJobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled').slice(0, 3).map(job => (
                  <div key={job._id} className="job-card">
                    <h3>Event on {new Date(job.eventDate).toLocaleDateString()}</h3>
                    <p>Location: {job.location}</p>
                    <p>Status: {job.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

