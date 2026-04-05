import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserCircle, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import ProfileImagePicker from '@/components/ui/ProfileImagePicker';
import { FileUploadResponse } from '@/api/fileupload.api';
import { authApi } from '@/api/auth.api';
import { userApi } from '@/api/user.api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^\d{10}$/;

const validateName = (value: string): string | undefined => {
  const trimmedName = value.trim();
  if (!trimmedName) return 'Name is required';
  if (!NAME_REGEX.test(trimmedName)) return 'Name must contain only letters and spaces';
  return undefined;
};

const validateEmail = (value: string): string | undefined => {
  const trimmedEmail = value.trim();
  if (!trimmedEmail) return 'Email is required';
  if (!EMAIL_REGEX.test(trimmedEmail)) return 'Please enter a valid email address';
  return undefined;
};

const validatePhone = (value: string): string | undefined => {
  const trimmedPhone = value.trim();
  if (!trimmedPhone) return 'Phone number is required';
  if (!PHONE_REGEX.test(trimmedPhone)) return 'Phone number must be 10 digits';
  return undefined;
};

const validateNewPassword = (value: string): string | undefined => {
  if (!value) return 'New password is required';
  if (value.length < 6) return 'New password must be at least 6 characters';
  return undefined;
};

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [profileImageId, setProfileImageId] = useState(user?.profile_img?.file_id || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
    email?: string;
    phoneNumber?: string;
  }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const updateProfileMutation = useMutation({
    mutationFn: (data: { email: string; name: string; phone_number: string }) =>
      userApi.update(user!.id, data),
    onSuccess: async () => {
      // Refresh user data from profile endpoint
      const profileRes = await authApi.getProfile();
      setUser(profileRes.data);
      toast.success('Profile updated successfully');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update profile';
      toast.error(message);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { old_password: string; new_password: string; confirm_password: string }) =>
      authApi.changePassword(data),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to change password';
      toast.error(message);
    },
  });

  const handleSaveProfile = useCallback(() => {
    if (!user) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();
    const errors: { name?: string; email?: string; phoneNumber?: string } = {
      name: validateName(trimmedName),
      email: validateEmail(trimmedEmail),
      phoneNumber: validatePhone(trimmedPhone),
    };

    if (Object.values(errors).some(Boolean)) {
      setProfileErrors(errors);
      toast.error('Please fix validation errors');
      return;
    }

    setProfileErrors({});
    updateProfileMutation.mutate({
      name: trimmedName,
      email: trimmedEmail,
      phone_number: trimmedPhone,
    });
  }, [user, name, email, phoneNumber, updateProfileMutation]);

  const handleChangePassword = useCallback(() => {
    const errors = {
      currentPassword: currentPassword ? undefined : 'Current password is required',
      newPassword: validateNewPassword(newPassword),
      confirmPassword: !confirmPassword
        ? 'Please confirm new password'
        : newPassword !== confirmPassword
          ? 'New passwords do not match'
          : undefined,
    };

    if (Object.values(errors).some(Boolean)) {
      setPasswordErrors(errors);
      toast.error('Please fix password errors');
      return;
    }

    setPasswordErrors({});
    changePasswordMutation.mutate({
      old_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  }, [currentPassword, newPassword, confirmPassword, changePasswordMutation]);

  const handleImageChange = useCallback((imageId: string, response?: FileUploadResponse) => {
    setProfileImageId(imageId);
    if (user && response) {
      setUser({
        ...user,
        profile_img: {
          file_id: response.file_id,
          file_url: response.file_url,
          meta_type: response.meta_type,
          file_type: response.file_type,
        },
      });
    }
  }, [user, setUser]);

  return (
    <div className="max-w-5xl mx-2 space-y-5 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Breadcrumb items={[{ label: 'Settings' }]} />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-gray-500 text-sm md:text-base">
          Manage your profile information and security settings.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="admin-card overflow-hidden py-2">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details and profile photo.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {/* Profile Image using ProfileImagePicker */}
          <ProfileImagePicker
            imageId={profileImageId}
            imageUrl={user?.profile_img?.file_url}
            name={user?.name || 'User'}
            onChange={handleImageChange}
          />

          {/* Form Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Personal Details</h4>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                    setProfileErrors((prev) => ({ ...prev, name: validateName(value) }));
                  }}
                  className="bg-white"
                />
                {profileErrors.name && <p className="text-sm text-red-600">{profileErrors.name}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Contact Information</h4>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                      setProfileErrors((prev) => ({ ...prev, email: validateEmail(value) }));
                    }}
                    className="bg-white pr-10"
                  />
                  <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {profileErrors.email && <p className="text-sm text-red-600">{profileErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '');
                      setPhoneNumber(digitsOnly);
                      setProfileErrors((prev) => ({ ...prev, phoneNumber: validatePhone(digitsOnly) }));
                    }}
                    className="bg-white pr-10"
                  />
                  <Phone className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {profileErrors.phoneNumber && <p className="text-sm text-red-600">{profileErrors.phoneNumber}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <Button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              className="px-8 bg-primary hover:bg-primary-2 shadow-lg shadow-primary/20"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security / Change Password Card */}
      <Card className="admin-card overflow-hidden py-2">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="current-pass">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-pass"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentPassword(value);
                    setPasswordErrors((prev) => ({
                      ...prev,
                      currentPassword: value ? undefined : 'Current password is required',
                    }));
                  }}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pass">New Password</Label>
              <div className="relative">
                <Input
                  id="new-pass"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewPassword(value);
                    setPasswordErrors((prev) => ({
                      ...prev,
                      newPassword: validateNewPassword(value),
                      confirmPassword: confirmPassword
                        ? value !== confirmPassword
                          ? 'New passwords do not match'
                          : undefined
                        : prev.confirmPassword,
                    }));
                  }}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>}
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pass">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-pass"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    setPasswordErrors((prev) => ({
                      ...prev,
                      confirmPassword: !value
                        ? 'Please confirm new password'
                        : newPassword !== value
                          ? 'New passwords do not match'
                          : undefined,
                    }));
                  }}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>}
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <Button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              className="bg-primary hover:bg-primary-2"
            >
              {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
