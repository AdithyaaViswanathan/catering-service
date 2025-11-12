import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from './LoadingSpinner';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const categories = ['all', 'appetizer', 'main-course', 'dessert', 'beverage', 'other'];
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="menu-page">
      <div className="container">
        <h1>Our Menu</h1>
        <div className="menu-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="menu-grid">
          {filteredItems.length === 0 ? (
            <p>No menu items available in this category.</p>
          ) : (
            filteredItems.map(item => (
              <div key={item._id} className="menu-item-card">
                <div className="menu-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="menu-item-placeholder">No Image</div>
                  )}
                </div>
                <div className="menu-item-content">
                  <h3>{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-footer">
                    <span className="menu-item-price">₹{item.price.toFixed(2)}</span>
                    <span className={`menu-item-status ${item.isAvailable ? 'available' : 'unavailable'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;

