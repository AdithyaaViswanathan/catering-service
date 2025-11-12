import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';
import './Admin.css';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizer',
    image: '',
    isAvailable: true
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, formData);
        setToast({ message: 'Menu item updated successfully!', type: 'success' });
      } else {
        await api.post('/menu', formData);
        setToast({ message: 'Menu item created successfully!', type: 'success' });
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'appetizer',
        image: '',
        isAvailable: true
      });
      fetchMenuItems();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to save menu item',
        type: 'error'
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      isAvailable: item.isAvailable
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await api.delete(`/menu/${id}`);
      setToast({ message: 'Menu item deleted successfully!', type: 'success' });
      fetchMenuItems();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to delete menu item',
        type: 'error'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="menu-manager-page">
      <div className="container">
        <h1>Manage Menu</h1>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              category: 'appetizer',
              image: '',
              isAvailable: true
            });
          }}
          style={{ marginBottom: '20px' }}
        >
          {showForm ? 'Cancel' : 'Add New Menu Item'}
        </button>

        {showForm && (
          <div className="menu-form-card">
            <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="main-course">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  Available
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        )}

        <div className="menu-items-grid">
          {menuItems.map(item => (
            <div key={item._id} className="menu-item-admin-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p><strong>Price:</strong> ₹{item.price.toFixed(2)}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Status:</strong> {item.isAvailable ? 'Available' : 'Unavailable'}</p>
              <div className="menu-item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
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

export default MenuManager;

