import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Public
import Landing  from '../pages/shared/Landing';
import Login    from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import KYC      from '../pages/shared/KYC';
import NotFound from '../pages/shared/NotFound';

// Freelancer
import FreelancerBeranda      from '../pages/freelancer/Beranda';
import FreelancerProfil       from '../pages/freelancer/Profil';
import FreelancerDetailPekerjaan from '../pages/freelancer/DetailPekerjaan';
import FreelancerCoPilot      from '../pages/freelancer/CoPilot';
import FreelancerPesan        from '../pages/freelancer/Pesan';
import FreelancerLamaran      from '../pages/freelancer/StatusLamaran';
import FreelancerKeuangan     from '../pages/freelancer/Keuangan';

// Employer
import EmployerDashboard   from '../pages/employer/Dashboard';
import EmployerVerifikasi  from '../pages/employer/Verifikasi';
import EmployerBuatLowongan from '../pages/employer/BuatLowongan';
import EmployerPelamar     from '../pages/employer/Pelamar';
import EmployerPesan       from '../pages/employer/Pesan';
import EmployerEscrow      from '../pages/employer/Escrow';

const FL = 'freelancer';
const EM = 'employer';

export default function AppRouter() {
  const { role } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          role ? <Navigate to={`/${role}/beranda`} replace /> : <Navigate to="/landing" replace />
        }
      />

      {/* Public */}
      <Route path="/landing"  element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/daftar"   element={<Register />} />
      <Route path="/kyc"      element={<KYC />} />

      {/* Freelancer routes */}
      <Route path="/freelancer/beranda"
        element={<ProtectedRoute role={FL}><FreelancerBeranda /></ProtectedRoute>} />
      <Route path="/freelancer/profil"
        element={<ProtectedRoute role={FL}><FreelancerProfil /></ProtectedRoute>} />
      <Route path="/freelancer/pekerjaan/:jobId"
        element={<ProtectedRoute role={FL}><FreelancerDetailPekerjaan /></ProtectedRoute>} />
      <Route path="/freelancer/co-pilot/:jobId"
        element={<ProtectedRoute role={FL}><FreelancerCoPilot /></ProtectedRoute>} />
      <Route path="/freelancer/pesan"
        element={<ProtectedRoute role={FL}><FreelancerPesan /></ProtectedRoute>} />
      <Route path="/freelancer/pesan/:chatId"
        element={<ProtectedRoute role={FL}><FreelancerPesan /></ProtectedRoute>} />
      <Route path="/freelancer/lamaran"
        element={<ProtectedRoute role={FL}><FreelancerLamaran /></ProtectedRoute>} />
      <Route path="/freelancer/keuangan"
        element={<ProtectedRoute role={FL}><FreelancerKeuangan /></ProtectedRoute>} />

      {/* Employer routes */}
      <Route path="/employer/beranda"
        element={<ProtectedRoute role={EM}><EmployerDashboard /></ProtectedRoute>} />
      <Route path="/employer/verifikasi"
        element={<ProtectedRoute role={EM}><EmployerVerifikasi /></ProtectedRoute>} />
      <Route path="/employer/buat-lowongan"
        element={<ProtectedRoute role={EM} requireVerified><EmployerBuatLowongan /></ProtectedRoute>} />
      <Route path="/employer/pelamar"
        element={<ProtectedRoute role={EM}><EmployerPelamar /></ProtectedRoute>} />
      <Route path="/employer/pelamar/:jobId"
        element={<ProtectedRoute role={EM}><EmployerPelamar /></ProtectedRoute>} />
      <Route path="/employer/pesan"
        element={<ProtectedRoute role={EM}><EmployerPesan /></ProtectedRoute>} />
      <Route path="/employer/pesan/:chatId"
        element={<ProtectedRoute role={EM}><EmployerPesan /></ProtectedRoute>} />
      <Route path="/employer/escrow"
        element={<ProtectedRoute role={EM}><EmployerEscrow /></ProtectedRoute>} />
      <Route path="/employer/escrow/:projectId"
        element={<ProtectedRoute role={EM}><EmployerEscrow /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
