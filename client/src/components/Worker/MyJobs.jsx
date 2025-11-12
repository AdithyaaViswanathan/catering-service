import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';
import './Worker.css';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await api.get('/bookings/my-jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      await api.put(`/bookings/${jobId}/status`, { status: newStatus });
      setToast({ message: 'Status updated successfully!', type: 'success' });
      fetchMyJobs(); // Refresh the list
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to update status',
        type: 'error'
      });
    }
  };

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter(job => job.status === filter);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="my-jobs-page">
      <div className="container">
        <h1>My Jobs</h1>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="jobs-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
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
        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="job-detail-card">
                <div className="job-detail-header">
                  <h3>Event on {new Date(job.eventDate).toLocaleDateString()}</h3>
                  <span className={`status-badge status-${job.status}`}>
                    {job.status}
                  </span>
                </div>
                <div className="job-detail-info">
                  <p><strong>Time:</strong> {job.eventTime}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Guests:</strong> {job.numberOfGuests}</p>
                  <p><strong>Total Price:</strong> ₹{job.totalPrice.toFixed(2)}</p>
                  {job.specialRequests && (
                    <p><strong>Special Requests:</strong> {job.specialRequests}</p>
                  )}
                  <p><strong>Client:</strong> {job.clientId.name} ({job.clientId.email})</p>
                  {job.clientId.address && (
                    <p><strong>Client Address:</strong> {job.clientId.address}</p>
                  )}
                </div>
                <div className="job-menu-items">
                  <h4>Menu Items:</h4>
                  <ul>
                    {job.menuItems.map((item, index) => (
                      <li key={index}>
                        {item.menuItemId.name} x {item.quantity} - ₹{item.price.toFixed(2)} each
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="job-actions">
                  {job.status === 'assigned' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdateStatus(job._id, 'in-progress')}
                    >
                      Start Job
                    </button>
                  )}
                  {job.status === 'in-progress' && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleUpdateStatus(job._id, 'completed')}
                    >
                      Complete Job
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;

