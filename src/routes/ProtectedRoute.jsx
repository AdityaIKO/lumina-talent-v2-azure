import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — guards a route by role and optional verification.
 * Props:
 *   role          — 'freelancer' | 'employer'  (required role for this route)
 *   requireVerified — if true, employer must be verified else redirect to /employer/verifikasi
 */
export default function ProtectedRoute({ children, role, requireVerified = false }) {
  const { role: authRole, verified } = useAuth();
  const location = useLocation();

  // (a) Not logged in → redirect to /login
  if (!authRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // (b) Wrong role → redirect to own dashboard
  if (authRole !== role) {
    return <Navigate to={`/${authRole}/beranda`} replace />;
  }

  // (c) Employer needs verification for certain routes
  if (requireVerified && role === 'employer' && !verified) {
    return <Navigate to="/employer/verifikasi" replace />;
  }

  return children;
}
