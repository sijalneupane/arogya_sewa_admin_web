import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { Pagination } from '@/components/ui/Pagination';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useHospital } from '@/features/super-admin/hospitals/hooks/useHospital';
import { hospitalApi } from '@/api/hospital.api';

export default function HospitalsPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { hospitals, loading, error, pagination, fetchHospitals } = useHospital({
    name: nameFilter,
    address: addressFilter,
    opened_date_from: dateFrom,
    opened_date_to: dateTo,
  });

  const hasActiveFilters = nameFilter || addressFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setNameFilter('');
    setAddressFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const handlePageChange = (page: number) => {
    fetchHospitals(page);
  };

  const handleDeleteClick = (hospital: { hospital_id: string; name: string }) => {
    setHospitalToDelete({ id: hospital.hospital_id, name: hospital.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!hospitalToDelete) return;
    
    setIsDeleting(true);
    try {
      await hospitalApi.delete(hospitalToDelete.id);
      toast.success('Hospital deleted successfully');
      // Refresh the hospitals list
      fetchHospitals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete hospital');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setHospitalToDelete(null);
    }
  };

  if (error && !loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hospitals</h1>
            <p className="text-gray-600 mt-2">Manage all hospitals in the system</p>
          </div>
          <Link to="/hospitals/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Hospital
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 font-semibold">Error loading hospitals</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
                onClick={() => fetchHospitals()}
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
          <h1 className="text-2xl font-bold text-gray-900">Hospitals</h1>
          <p className="text-gray-600 mt-2">Manage all hospitals in the system</p>
        </div>
        <Link to="/hospitals/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Hospital
          </Button>
        </Link>
      </div>

      <Card className='gap-1'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Hospitals</CardTitle>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              {/* Name search */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Hospital Name</label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              {/* Address search */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Address</label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by address..."
                    value={addressFilter}
                    onChange={(e) => setAddressFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              {/* Opened date from */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Opened from</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                />
              </div>
              {/* Opened date to */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Opened to</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-2">Loading hospitals...</p>
            </div>
          ) : hospitals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hospitals found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-200 table-fixed">
                  <thead>
                    <tr className="border-b">
                      <th className="text-center py-3 px-4 font-medium w-16">Logo</th>
                      <th className="text-center py-3 px-4 font-medium w-[28%]">Hospital Name</th>
                      <th className="text-center py-3 px-4 font-medium w-[22%]">Location</th>
                      <th className="text-center py-3 px-4 font-medium w-[18%]">Contact</th>
                      <th className="text-center py-3 px-4 font-medium w-[14%]">Opened Date</th>
                      <th className="text-center py-3 px-4 font-medium w-[28%] max-w-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((hospital) => (
                      <tr key={hospital.hospital_id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <AvatarPlaceholder
                            name={hospital.name}
                            imageUrl={hospital.logo?.file_url}
                            size="md"
                            shape="rounded"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium ">{hospital.name}</td>
                        <td className="py-3 px-4 truncate">{hospital.location}</td>
                        <td className="py-3 px-4 truncate">
                          {hospital.contact_number && hospital.contact_number.length > 0
                          ? hospital.contact_number.join(', ')
                          : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(hospital.opened_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <ActionMenu
                            viewUrl={`/hospitals/${hospital.hospital_id}`}
                            editUrl={`/hospitals/edit/${hospital.hospital_id}`}
                            showDelete
                            onDelete={() => handleDeleteClick(hospital)}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Hospital"
        description={
          <>
            Are you sure you want to delete <strong>{hospitalToDelete?.name}</strong>? 
            This action cannot be undone and will remove all associated data.
          </>
        }
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}