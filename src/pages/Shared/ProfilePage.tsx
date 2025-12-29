import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import ProfileView from '@/features/shared/profile/components/ProfileView';
import ProfileEditForm from '@/features/shared/profile/components/ProfileEditForm';
import { User } from '@/types/auth.types';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSuccess = (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update your account information' : 'View your account information'}
        </p>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileEditForm user={user} onCancel={handleCancel} onSuccess={handleSuccess} />
        </div>
      ) : (
        <ProfileView user={user} onEditClick={handleEditClick} />
      )}
    </div>
  );
}