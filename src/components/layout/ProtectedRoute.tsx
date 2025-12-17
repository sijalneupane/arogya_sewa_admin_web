import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles = [] }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  
  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role if specified
  if (allowedRoles.length > 0 && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <Outlet />;
}