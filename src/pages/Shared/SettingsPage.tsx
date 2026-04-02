import { useState, useCallback } from 'react';
import { 
  UserCircle, 
  Lock, 
  Camera, 
  Mail, 
  Phone,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type TabType = 'profile' | 'security';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const handleSaveProfile = useCallback(() => {
    toast.success('Profile updated successfully');
  }, []);

  const handleUpdatePassword = useCallback(() => {
    toast.success('Password updated successfully');
  }, []);

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: UserCircle },
    { id: 'security' as const, label: 'Security', icon: Lock },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Breadcrumb items={[{ label: 'Settings' }]} />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-gray-500 text-sm md:text-base">
          Manage your administrative profile, security protocols, and system notifications.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-white" : "text-gray-400")} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="admin-card overflow-hidden py-2">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                  <CardDescription>Update your personal details and account appearance.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="relative group">
                      <AvatarPlaceholder
                        name={user?.name || 'User'}
                        imageUrl={user?.profile_img?.file_url}
                        size="xl"
                        shape="circle"
                        className="ring-4 ring-white shadow-xl border border-gray-100 h-28 w-28"
                      />
                      <button className="absolute bottom-1 right-1 p-2.5 bg-primary rounded-full text-white shadow-lg hover:bg-primary-2 transition-all transform group-hover:scale-110">
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Your Avatar</h3>
                      <p className="text-sm text-gray-500">JPG, GIF or PNG. Maximum size of 2MB.</p>
                      <div className="flex gap-3 pt-2">
                        <Button size="sm" className="bg-primary hover:bg-primary-2">Upload New</Button>
                        <Button variant="outline" size="sm" className="text-gray-600">Remove</Button>
                      </div>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Personal Details</h4>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.name} className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Administrative bio..." className="min-h-[100px] bg-white resize-none" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Contact Information</h4>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Input id="email" defaultValue={user?.email} disabled className="bg-slate-50 pr-10 border-dashed" />
                          <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Input id="phone" defaultValue={user?.phone_number} className="bg-white pr-10" />
                          <Phone className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-50">
                    <Button onClick={handleSaveProfile} className="px-8 bg-primary hover:bg-primary-2 shadow-lg shadow-primary/20">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="admin-card">
                <CardHeader className="border-b bg-slate-50/50 py-3">
                  <CardTitle className="text-xl">Authentication</CardTitle>
                  <CardDescription>Manage your password and secure your administrative account.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current-pass">Current Password</Label>
                      <Input id="current-pass" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-pass">New Password</Label>
                      <Input id="new-pass" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <Button onClick={handleUpdatePassword} className="bg-primary hover:bg-primary-2">
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100 shadow-sm bg-red-50/30 py-3">
                <CardHeader>
                  <CardTitle className="text-red-800 text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-600/80">
                    Critical actions. These cannot be reversed once performed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300">
                    Deactivate Administrator Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}