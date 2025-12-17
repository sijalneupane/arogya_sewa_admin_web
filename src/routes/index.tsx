import { Routes, Route, Navigate } from 'react-router-dom'; // Add Navigate
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import LoginPage from '@/pages/Auth/LoginPage';
import ForgotPasswordPage from '@/pages/Auth/ForgotPasswordPage';
import SuperAdminDashboard from '@/pages/SuperAdmin/DashboardPage';
import HospitalsPage from '@/pages/SuperAdmin/HospitalsPage';
import CreateHospitalPage from '@/pages/SuperAdmin/CreateHospitalPage';
import HospitalAdminDashboard from '@/pages/HospitalAdmin/DashboardPage';
import DoctorsPage from '@/pages/HospitalAdmin/DoctorsPage';
import AppointmentsPage from '@/pages/HospitalAdmin/AppointmentsPage';
import CreateDoctorPage from '@/pages/HospitalAdmin/CreateDoctorPage';
import ProfilePage from '@/pages/Shared/ProfilePage';
import SettingsPage from '@/pages/Shared/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Shared Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Super Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/hospitals/create" element={<CreateHospitalPage />} />
          </Route>
          
          {/* Hospital Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']} />}>
            <Route path="/dashboard" element={<HospitalAdminDashboard />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/create" element={<CreateDoctorPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
          </Route>
          
         
        </Route>
      </Route>
      
      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}