import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, RefreshCw, Users, Stethoscope, User, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { Pagination } from '@/components/ui/Pagination';
import { useUser } from '@/features/super-admin/users/hooks/useUser';

interface RoleTab {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_TABS: RoleTab[] = [
  { label: 'All Users', value: '', icon: Users },
  { label: 'Doctors', value: 'DOCTOR', icon: Stethoscope },
  { label: 'Patients', value: 'PATIENT', icon: User },
  { label: 'Admins', value: 'HOSPITAL_ADMIN', icon: Shield },
  { label: 'Super Admin', value: 'SUPER_ADMIN', icon: Shield },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { users, loading, error, pagination, fetchUsers } = useUser({
    search: searchQuery,
    role: roleFilter,
  });

  const hasActiveFilters = searchQuery || roleFilter;

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'HOSPITAL_ADMIN':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'DOCTOR':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'PATIENT':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (error && !loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">Manage all users in the system</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 font-semibold">Error loading users</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
                onClick={() => fetchUsers()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage all users in the system</p>
        </div>
      </div>

      <Card className='gap-1'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className={hasActiveFilters ? 'visible' : 'invisible'}
            >
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search input - 35% width on desktop, full width on mobile */}
              <div className="flex flex-col gap-1 w-full lg:w-[35%]">
                <label className="text-xs text-gray-500">Search by Name or Email</label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* iOS-style Segmented Control - 65% width on desktop, full width on mobile */}
              <div className="flex flex-col gap-1 w-full lg:w-[65%]">
                <label className="text-xs text-gray-500">Filter by Role</label>
                <div className="inline-flex bg-gray-100 rounded-xl p-1 w-fit max-w-full flex-wrap">
                  {ROLE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = roleFilter === tab.value;
                    return (
                      <button
                        key={tab.value || 'all'}
                        onClick={() => setRoleFilter(tab.value)}
                        className={`
                          relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200 ease-out whitespace-nowrap
                          ${isActive
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                          }
                        `}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-2">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-200 table-fixed">
                  <thead>
                    <tr className="border-b">
                      <th className="text-center py-3 px-4 font-medium w-16">Profile</th>
                      <th className="text-center py-3 px-4 font-medium w-[18%]">Name</th>
                      <th className="text-center py-3 px-4 font-medium w-[22%]">Email</th>
                      <th className="text-center py-3 px-4 font-medium w-[12%]">Phone</th>
                      <th className="text-center py-3 px-4 font-medium w-[10%]">Role</th>
                      <th className="text-center py-3 px-4 font-medium w-[8%]">Status</th>
                      <th className="text-center py-3 px-4 font-medium w-[12%]">Created At</th>
                      <th className="text-center py-3 px-4 font-medium w-[18%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {user.profile_img?.file_url ? (
                            <img
                              src={user.profile_img.file_url}
                              alt={user.name}
                              className="h-10 w-10 object-cover rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium truncate">{user.name}</td>
                        <td className="py-3 px-4 truncate">{user.email}</td>
                        <td className="py-3 px-4 truncate">{user.phone_number}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role.role)}`}>
                            {user.role.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            user.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <ActionMenu
                            viewUrl={`/users/${user.id}`}
                            editUrl={`/users/${user.id}/edit`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPage > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPage={pagination.totalPage}
                  totalRecords={pagination.totalRecords}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
