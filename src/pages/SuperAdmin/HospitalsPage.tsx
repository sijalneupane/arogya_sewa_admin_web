import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useHospital } from '@/features/super-admin/hospitals/hooks/useHospital';
import { hospitalApi } from '@/api/hospital.api';

export default function HospitalsPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { hospitals, loading, error, pagination, fetchHospitals } = useHospital();

  const filteredHospitals = (hospitals || []).filter((hospital) =>
    hospital.name.toLowerCase().includes(search.toLowerCase()) ||
    hospital.location.toLowerCase().includes(search.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchHospitals(page, pagination?.pageSize || 10);
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
      fetchHospitals(currentPage, pagination?.pageSize || 10);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete hospital');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setHospitalToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hospitals</h1>
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
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">Error: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospitals</h1>
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
        <CardHeader>
          <CardTitle>All Hospitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hospitals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-2">Loading hospitals...</p>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hospitals found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Logo</th>
                      <th className="text-left py-3 px-4 font-medium">Hospital Name</th>
                      <th className="text-left py-3 px-4 font-medium">Location</th>
                      <th className="text-left py-3 px-4 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 font-medium">Opened Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHospitals.map((hospital) => (
                      <tr key={hospital.hospital_id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {hospital.logo?.file_url ? (
                            <img
                              src={hospital.logo.file_url}
                              alt={hospital.name}
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium">{hospital.name}</td>
                        <td className="py-3 px-4">{hospital.location}</td>
                        <td className="py-3 px-4">
                          {hospital.contact_number && hospital.contact_number.length > 0
                            ? hospital.contact_number[0]
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(hospital.opened_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Link
                              to={`/hospitals/${hospital.hospital_id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                            <Link
                              to={`/hospitals/edit/${hospital.hospital_id}`}
                              className="text-green-600 hover:text-green-800 text-sm inline-flex items-center gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDeleteClick(hospital)}
                              className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPage > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing page {pagination.currentPage} of {pagination.totalPage} ({pagination.totalRecords} total records)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
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