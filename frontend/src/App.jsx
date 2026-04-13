import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import ResourceCatalogue from './pages/ResourceCatalogue';
import ResourceDetails from './pages/ResourceDetails';
import Unauthorized from './pages/Unauthorized';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              <Route path="/home" element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } />

              <Route path="/admin" element={
                <RoleProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </RoleProtectedRoute>
              } />

              <Route path="/technician" element={
                <RoleProtectedRoute requiredRole="TECHNICIAN">
                  <TechnicianDashboard />
                </RoleProtectedRoute>
              } />

              <Route path="/resources" element={
                <PrivateRoute>
                  <ResourceCatalogue />
                </PrivateRoute>
              } />

              <Route path="/resources/:id" element={
                <PrivateRoute>
                  <ResourceDetails />
                </PrivateRoute>
              } />

              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
