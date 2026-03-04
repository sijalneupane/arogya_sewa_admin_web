import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorWithRetry } from '@/components/ui/ErrorWithRetry';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { DepartmentCard } from './components/DepartmentCard';
import { DepartmentForm } from './components/DepartmentForm';
import { useDepartments } from './hooks/useDepartments';
import { departmentApi } from '@/api/department.api';
import { Department, CreateDepartmentData, UpdateDepartmentData } from '@/types/department.type';

export default function DepartmentsPage() {
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { departments, loading, error, fetchDepartments } = useDepartments({
    name: search || undefined,
  });

  const handleAddClick = () => {
    setSelectedDepartment(null);
    setAddDialogOpen(true);
  };

  const handleEditClick = (department: Department) => {
    setSelectedDepartment(department);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteDialogOpen(true);
  };

  const handleAddSubmit = async (data: CreateDepartmentData) => {
    setIsSubmitting(true);
    try {
      await departmentApi.create(data);
      toast.success('Department created successfully');
      setAddDialogOpen(false);
      fetchDepartments();
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Failed to create department';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: UpdateDepartmentData) => {
    if (!selectedDepartment) return;

    setIsSubmitting(true);
    try {
      await departmentApi.update(selectedDepartment.department_id, data);
      toast.success('Department updated successfully');
      setEditDialogOpen(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Failed to update department';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    setIsSubmitting(true);
    try {
      await departmentApi.delete(selectedDepartment.department_id);
      toast.success('Department deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Failed to delete department';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error && !loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 mt-2">Manage departments in your hospital</p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
        <ErrorWithRetry
          title="Error loading departments"
          error={error}
          onRetry={fetchDepartments}
          isLoading={loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-2">Manage departments in your hospital</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
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
              <p className="text-gray-600 mt-2">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No department available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((department) => (
                <DepartmentCard
                  key={department.department_id}
                  department={department}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      <DepartmentForm
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddSubmit}
        isLoading={isSubmitting}
      />

      {/* Edit Department Dialog */}
      <DepartmentForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditSubmit}
        department={selectedDepartment}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Department"
        description={
          <>
            Are you sure you want to delete{' '}
            <strong>{selectedDepartment?.name}</strong>?
            This action cannot be undone.
          </>
        }
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
