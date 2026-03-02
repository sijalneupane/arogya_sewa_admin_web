import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types/auth.types';
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
    { path: '/users', label: 'Users', icon: Users },
  ];

  const hospitalAdminMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctors', label: 'Doctors', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = user?.role.role === UserRole.SUPER_ADMIN ? superAdminMenu : hospitalAdminMenu;

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-56'} bg-primary border-r min-h-screen flex flex-col transition-all duration-300 ease-in-out relative`}>
      <div className="p-4">
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-12 w-12 rounded-full bg-white/88 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="ArogyaSewa Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-base font-bold text-white">ArogyaSewa</h1>
              <p className=" text-xs text-gray-300">Hospital Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button - Desktop Only */}
      <button
        onClick={onToggle}
        className="hidden lg:block absolute -right-3 top-14 h-6 w-6 rounded-full bg-white border shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-[60] p-0"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 relative left-0.5" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 relative left-0.5" />
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
                  ? 'bg-white/20 text-white border-r-4 border-white/60'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-2.5 whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        <button
          onClick={logout}
          className={`flex items-center px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white w-full transition-colors mt-3 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-2.5 whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-xs text-gray-300 truncate">{user?.role.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;