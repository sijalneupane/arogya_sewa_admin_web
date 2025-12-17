import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Building, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="+977 9841000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    defaultValue={user?.role?.replace('_', ' ') || ''}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={loading}>
                  Update Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{user?.hospitalId ? 'Hospital ID: ' + user.hospitalId : 'No hospital assigned'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Joined {new Date(user?.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}