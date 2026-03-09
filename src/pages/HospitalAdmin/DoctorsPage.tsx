import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, X, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useDoctors } from '@/features/hospital-admin/doctors/hooks/useDoctors';
import { DoctorTable } from '@/features/hospital-admin/doctors/components/DoctorTable';
import { DepartmentSelect } from '@/features/hospital-admin/doctors/components/DepartmentSelect';
import { StatusSelect } from '@/features/hospital-admin/doctors/components/StatusSelect';
import { Pagination } from '@/components/ui/Pagination';
import { DoctorStatus } from '@/types/doctor.type';

export default function DoctorsPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<DoctorStatus | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const { doctors, loading, error, fetchDoctors, deleteDoctor, pagination } = useDoctors({
    name: searchFilter,
    status: statusFilter || undefined,
    department_id: departmentFilter || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const hasActiveFilters = searchFilter || statusFilter || departmentFilter;

  const clearFilters = () => {
    setSearchFilter('');
    setStatusFilter(null);
    setDepartmentFilter(null);
    setCurrentPage(1);
  };

  const handleDelete = async (doctorId: string) => {
    await deleteDoctor(doctorId);
    fetchDoctors();
  };

  if (error && !loading) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Doctors', href: '/doctors' }]} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
            <p className="text-gray-600 mt-2">Manage doctors in your hospital</p>
          </div>
          <Link to="/doctors/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 font-semibold">Error loading doctors</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
                onClick={fetchDoctors}
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
      <Breadcrumb items={[{ label: 'Doctors' }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-2">Manage doctors in your hospital</p>
        </div>
        <Link to="/doctors/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </Link>
      </div>

      <Card className="gap-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Doctors</CardTitle>
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
          {/* Filters - single row on desktop, 2 cols on mobile */}
          <div className="mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 items-end">
              {/* Name search */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Doctor Name</label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchFilter}
                    onChange={(e) => { setSearchFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              {/* Status filter */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Status</label>
                <StatusSelect
                  value={statusFilter}
                  onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                  placeholder="All statuses"
                />
              </div>
              {/* Department filter */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Department</label>
                <DepartmentSelect
                  value={departmentFilter}
                  onChange={(v) => { setDepartmentFilter(v); setCurrentPage(1); }}
                  placeholder="All departments"
                />
              </div>
            </div>
          </div>

          {/* Doctor Table */}
          <DoctorTable
            doctors={doctors}
            loading={loading}
            onDelete={handleDelete}
          />
          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPage={pagination.totalPage}
              totalRecords={pagination.totalRecords}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
