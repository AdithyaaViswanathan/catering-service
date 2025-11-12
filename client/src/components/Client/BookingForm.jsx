import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';
import './Client.css';

const BookingForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '',
    location: '',
    numberOfGuests: '',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data.filter(item => item.isAvailable));
      setMenuLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemToggle = (item) => {
    const existingIndex = selectedItems.findIndex(sel => sel.menuItemId === item._id);
    if (existingIndex >= 0) {
      setSelectedItems(selectedItems.filter((_, index) => index !== existingIndex));
    } else {
      setSelectedItems([...selectedItems, { menuItemId: item._id, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    setSelectedItems(selectedItems.map(item =>
      item.menuItemId === itemId ? { ...item, quantity: parseInt(quantity) } : item
    ));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, selected) => {
      const item = menuItems.find(m => m._id === selected.menuItemId);
      return total + (item ? item.price * selected.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setToast({ message: 'Please select at least one menu item', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', {
        ...formData,
        numberOfGuests: parseInt(formData.numberOfGuests),
        menuItems: selectedItems
      });
      setToast({ message: 'Booking created successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/client/bookings');
      }, 2000);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to create booking',
        type: 'error'
      });
      setLoading(false);
    }
  };

  if (menuLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="booking-form-page">
      <div className="container">
        <h1>Create New Booking</h1>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="booking-form-container">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-section">
              <h2>Event Details</h2>
              <div className="form-group">
                <label>Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Event Time</label>
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Select Menu Items</h2>
              <div className="menu-selection">
                {menuItems.map(item => {
                  const selected = selectedItems.find(sel => sel.menuItemId === item._id);
                  return (
                    <div key={item._id} className="menu-item-select">
                      <div className="menu-item-select-header">
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => handleItemToggle(item)}
                        />
                        <span>{item.name} - ₹{item.price.toFixed(2)}</span>
                      </div>
                      {selected && (
                        <div className="menu-item-quantity">
                          <label>Quantity:</label>
                          <input
                            type="number"
                            value={selected.quantity}
                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            min="1"
                            style={{ width: '80px', marginLeft: '10px' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h2>Total: ₹{calculateTotal().toFixed(2)}</h2>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : 'Create Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

