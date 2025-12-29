/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface UserMenuProps {
  user: any;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {getUserInitials()}
          </span>
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500">
            {user?.role?.replace('_', ' ')}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4 mr-3" />
            Profile
          </Link>
          
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Link>
          
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <HelpCircle className="h-4 w-4 mr-3" />
            Help & Support
          </a>
          
          <div className="border-t mt-2 pt-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}