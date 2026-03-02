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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
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

  const menuItems = user?.role.role === 'SUPER_ADMIN' ? superAdminMenu : hospitalAdminMenu;

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-56'} bg-white border-r min-h-screen flex flex-col transition-all duration-300 ease-in-out relative`}>
      <div className="p-4">
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <img
            src="/logo.png"
            alt="ArogyaSewa Logo"
            className="h-9 w-auto"
          />
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-bold text-blue-600">ArogyaSewa</h1>
              <p className="text-gray-500 text-xs">Hospital Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button - Desktop Only */}
      <button
        onClick={onToggle}
        className="hidden lg:block absolute -right-3 top-14 h-6 w-6 rounded-full bg-white border shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-50 p-0 leading-none"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 m-auto" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 m-auto" />
        )}
      </button>

      <nav className="mt-4 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2.5">{item.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={logout}
          className={`flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors mt-3 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2.5">Logout</span>}
        </button>
      </nav>

      <div className="p-4 border-t">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="font-semibold text-blue-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;