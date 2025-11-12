import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';
import './Worker.css';

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      const response = await api.get('/bookings/available');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to accept this job?')) {
      return;
    }

    try {
      await api.put(`/bookings/${jobId}/accept`);
      setToast({ message: 'Job accepted successfully!', type: 'success' });
      fetchAvailableJobs(); // Refresh the list
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to accept job',
        type: 'error'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="available-jobs-page">
      <div className="container">
        <h1>Available Jobs</h1>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p>No available jobs at the moment.</p>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="job-detail-card">
                <div className="job-detail-header">
                  <h3>Event on {new Date(job.eventDate).toLocaleDateString()}</h3>
                  <span className="status-badge status-pending">Available</span>
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
                <button
                  className="btn btn-success"
                  onClick={() => handleAcceptJob(job._id)}
                >
                  Accept Job
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableJobs;

