import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Deepi Catering Service
          </Link>
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/contact">Contact</Link>
            {isAuthenticated ? (
              <>
                {user.role === 'client' && (
                  <>
                    <Link to="/client/dashboard">Dashboard</Link>
                    <Link to="/client/bookings">My Bookings</Link>
                  </>
                )}
                {user.role === 'worker' && (
                  <>
                    <Link to="/worker/dashboard">Dashboard</Link>
                    <Link to="/worker/available-jobs">Available Jobs</Link>
                    <Link to="/worker/my-jobs">My Jobs</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/menu">Manage Menu</Link>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/bookings">Bookings</Link>
                  </>
                )}
                <span className="navbar-user">Hello, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

