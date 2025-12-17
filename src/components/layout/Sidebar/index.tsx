import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import {
  LayoutDashboard,
  Building,
  Users,
  Calendar,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const superAdminMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hospitals', label: 'Hospitals', icon: Building },
  ];
  
  const hospitalAdminMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctors', label: 'Doctors', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];
  
  const menuItems = user?.role === 'SUPER_ADMIN' ? superAdminMenu : hospitalAdminMenu;
  
  return (
    <div className="w-64 bg-white border-r min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">ArogyaSewa</h1>
        <p className="text-gray-500 text-sm mt-1">Hospital Management</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
        
        <button
          onClick={logout}
          className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors mt-4"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6 border-t">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="font-semibold text-blue-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;