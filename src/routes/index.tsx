import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types/auth.types';

// Pages
import LoginPage from '@/pages/Auth/LoginPage';
import ForgotPasswordPage from '@/pages/Auth/ForgotPasswordPage';
import SuperAdminDashboard from '@/pages/SuperAdmin/DashboardPage';
import HospitalsPage from '@/pages/SuperAdmin/HospitalsPage';
import CreateHospitalPage from '@/pages/SuperAdmin/CreateHospitalPage';
import EditHospitalPage from '@/pages/SuperAdmin/EditHospitalPage';
import HospitalDetailPage from '@/pages/SuperAdmin/HospitalDetailPage';
import UsersPage from '@/pages/SuperAdmin/UsersPage';
import UserDetailPage from '@/pages/SuperAdmin/UserDetailPage';
import HospitalAdminDashboard from '@/pages/HospitalAdmin/DashboardPage';
import DoctorsPage from '@/pages/HospitalAdmin/DoctorsPage';
import CreateDoctorPage from '@/pages/HospitalAdmin/CreateDoctorPage';
import DoctorViewPage from '@/pages/HospitalAdmin/DoctorViewPage';
import EditDoctorPage from '@/pages/HospitalAdmin/EditDoctorPage';
import DepartmentsPage from '@/features/hospital-admin/departments/DepartmentsPage';
import AppointmentsPage from '@/pages/HospitalAdmin/AppointmentsPage';
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
          <Route element={<ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]} />}>
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/hospitals/create" element={<CreateHospitalPage />} />
            <Route path="/hospitals/edit/:id" element={<EditHospitalPage />} />
            <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId" element={<UserDetailPage />} />
          </Route>

          {/* Hospital Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.HOSPITAL_ADMIN]} />}>
            <Route path="/dashboard" element={<HospitalAdminDashboard />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/create" element={<CreateDoctorPage />} />
            <Route path="/doctors/:doctorId" element={<DoctorViewPage />} />
            <Route path="/doctors/:doctorId/edit" element={<EditDoctorPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/hospitals/edit/:id" element={<EditHospitalPage />} />
          </Route>


        </Route>
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}