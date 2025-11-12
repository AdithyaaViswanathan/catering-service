import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';
import './Admin.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      setToast({ message: 'User deleted successfully!', type: 'success' });
      fetchUsers();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to delete user',
        type: 'error'
      });
    }
  };

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(user => user.role === filter);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-manager-page">
      <div className="container">
        <h1>Manage Users</h1>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="users-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'client' ? 'active' : ''}`}
            onClick={() => setFilter('client')}
          >
            Clients
          </button>
          <button
            className={`filter-btn ${filter === 'worker' ? 'active' : ''}`}
            onClick={() => setFilter('worker')}
          >
            Workers
          </button>
          <button
            className={`filter-btn ${filter === 'admin' ? 'active' : ''}`}
            onClick={() => setFilter('admin')}
          >
            Admins
          </button>
        </div>
        <div className="users-grid">
          {filteredUsers.map(user => (
            <div key={user._id} className="user-card">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Role:</strong> {user.role}</p>
              {user.role === 'worker' && (
                <>
                  <p><strong>Skills:</strong> {user.skills?.join(', ') || 'None'}</p>
                  <p><strong>Availability:</strong> {user.availabilityStatus || 'N/A'}</p>
                </>
              )}
              {user.role === 'client' && user.address && (
                <p><strong>Address:</strong> {user.address}</p>
              )}
              <div className="user-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user._id)}
                  disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManager;

