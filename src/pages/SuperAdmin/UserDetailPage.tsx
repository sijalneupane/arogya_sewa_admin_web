import { useParams, Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, User as UserIcon, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { useUserById } from '@/features/super-admin/users/hooks/useUserById';
import { UserRole } from '@/types/auth.types';
import { Button } from '@/components/ui/button';

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, loading, error } = useUserById(userId || '');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case UserRole.HOSPITAL_ADMIN:
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case UserRole.DOCTOR:
        return 'bg-green-100 text-green-700 border-green-300';
      case UserRole.PATIENT:
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Users', href: '/users' }]} />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="h-12 w-12 border-4 border-gray-300 border-t-primary rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading user details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Users', href: '/users' }]} />
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 font-semibold">Error loading user</p>
              <p className="text-red-500 text-sm mt-1">{error || 'User not found'}</p>
              <Button
                variant="outline"
                className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
                onClick={() => navigate('/users')}
              >
                Back to Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Users', href: '/users' },
        { label: user.name }
      ]} />

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {user.profile_img?.file_url ? (
                <ImagePreview
                  src={user.profile_img.file_url}
                  alt={user.name}
                  title={user.name}
                >
                  <AvatarPlaceholder
                    name={user.name}
                    imageUrl={user.profile_img.file_url}
                    size="lg"
                    shape="circle"
                    className="cursor-pointer hover:opacity-80 transition-opacity border-2 border-primary/20"
                  />
                </ImagePreview>
              ) : (
                <AvatarPlaceholder
                  name={user.name}
                  size="lg"
                  shape="circle"
                  className="border-2 border-primary/20"
                />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              <div className="flex gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role.role)}`}>
                  {user.role.role.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  user.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {user.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Information */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Email Address</label>
                <p className="text-gray-900 font-medium text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <p className="text-gray-900 font-medium text-sm">{user.phone_number}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Information */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Role & Permissions
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Role</label>
                <p className="text-gray-900 font-medium text-sm">{user.role.role.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Description</label>
                <p className="text-gray-600 text-sm">{user.role.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Account Timeline
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Created At</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-gray-900 font-medium text-sm">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Last Updated</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-gray-900 font-medium text-sm">
                    {new Date(user.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {user.is_active ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
              Account Status
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Current Status</label>
                <p className={`font-medium text-sm ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">User ID</label>
                <p className="text-gray-900 font-medium font-mono text-xs">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
