import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-gray-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                { id: 'push', label: 'Push Notifications', description: 'Receive browser notifications' },
                { id: 'sms', label: 'SMS Notifications', description: 'Receive text messages' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.id as any)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      notifications[item.id as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-500" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter current password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="outline">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-gray-500" />
              <CardTitle>Language & Region</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="en">English</option>
                  <option value="ne">Nepali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Zone</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="Asia/Kathmandu">Asia/Kathmandu (GMT+5:45)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}  loading={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}