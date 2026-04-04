/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

interface UserMenuProps {
  user: any;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuthStore();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
      >
        <AvatarPlaceholder
          name={user?.name || 'User'}
          imageUrl={user?.profile_img?.file_url}
          size="sm"
          shape="circle"
        />
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500">
            {user?.role?.role?.replace('_', ' ')}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-fit min-w-48 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="flex items-center w-full px-2 py-1.5 mt-1 text-sm text-red-600 rounded hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          logout();
          setShowLogoutConfirm(false);
        }}
      />
    </div>
  );
}