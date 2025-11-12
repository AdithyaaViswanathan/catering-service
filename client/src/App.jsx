import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import RoleRoute from './utils/RoleRoute';

// Shared components
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import MenuPage from './pages/Menu';

// Auth components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Client components
import ClientDashboard from './components/Client/Dashboard';
import BookingForm from './components/Client/BookingForm';
import BookingsList from './components/Client/BookingsList';

// Worker components
import WorkerDashboard from './components/Worker/Dashboard';
import AvailableJobs from './components/Worker/AvailableJobs';
import MyJobs from './components/Worker/MyJobs';

// Admin components
import AdminDashboard from './components/Admin/Dashboard';
import MenuManager from './components/Admin/MenuManager';
import UserManager from './components/Admin/UserManager';
import BookingsManager from './components/Admin/BookingsManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Client routes */}
            <Route
              path="/client/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/client/bookings/new"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['client']}>
                    <BookingForm />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/client/bookings"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['client']}>
                    <BookingsList />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Worker routes */}
            <Route
              path="/worker/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['worker']}>
                    <WorkerDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/worker/available-jobs"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['worker']}>
                    <AvailableJobs />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/worker/my-jobs"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['worker']}>
                    <MyJobs />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <MenuManager />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <UserManager />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <BookingsManager />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

