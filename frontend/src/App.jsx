import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

import Login from './pages/Login';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <RoleProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </RoleProtectedRoute>
          } />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
