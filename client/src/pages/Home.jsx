import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Welcome to Deepi Catering Service</h1>
          <p>Delicious food for your special events</p>
          {!isAuthenticated && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/menu" className="btn btn-secondary">View Menu</Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Event Catering</h3>
              <p>Perfect catering solutions for all your events</p>
            </div>
            <div className="feature-card">
              <h3>Custom Menus</h3>
              <p>Tailored menus to suit your preferences</p>
            </div>
            <div className="feature-card">
              <h3>Professional Service</h3>
              <p>Experienced workers ready to serve</p>
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className="dashboard-link">
          <div className="container">
            {user.role === 'client' && (
              <Link to="/client/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            )}
            {user.role === 'worker' && (
              <Link to="/worker/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

