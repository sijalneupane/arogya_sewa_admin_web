import { Doctor } from '@/types/doctor.type';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { useState } from 'react';

interface DoctorTableProps {
  doctors: Doctor[];
  loading: boolean;
  onDelete: (doctorId: string) => Promise<void>;
}

const DOCTOR_STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  'On Appointment': 'bg-blue-100 text-blue-700',
  Inactive: 'bg-gray-100 text-gray-600',
};

export function DoctorTable({ doctors, loading, onDelete }: DoctorTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (doctor: { doctor_id: string; user: { name: string } }) => {
    setDoctorToDelete({ id: doctor.doctor_id, name: doctor.user.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(doctorToDelete.id);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
        </div>
        <p className="text-gray-600 mt-2">Loading doctors...</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No doctors found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-center py-3 px-2 font-medium w-10">Profile</th>
              <th className="text-center py-3 px-2 font-medium">Doctor Name</th>
              <th className="text-center py-3 px-2 font-medium whitespace-nowrap">Phone Number</th>
              <th className="text-center py-3 px-2 font-medium w-36">Department</th>
              <th className="text-center py-3 px-2 font-medium w-32">Status</th>
              <th className="text-center py-3 px-2 font-medium w-28">Experience</th>
              <th className="text-center py-3 px-2 font-medium w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.doctor_id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <AvatarPlaceholder
                    name={doctor.user.name}
                    imageUrl={doctor.user.profile_img?.file_url}
                    size="md"
                    shape="circle"
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="font-medium truncate">{doctor.user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{doctor.user.email}</div>
                </td>
                <td className="py-2 px-3 truncate">{doctor.user.phone_number}</td>
                <td className="py-2 px-3 truncate">
                  {doctor.department?.name || <span className="text-gray-400">—</span>}
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                      DOCTOR_STATUS_COLORS[doctor.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {doctor.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="text-sm text-gray-700">{doctor.experience}</span>
                </td>
                <td className="py-2 px-3 text-center">
                  <ActionMenu
                    viewUrl={`/doctors/${doctor.doctor_id}`}
                    editUrl={`/doctors/${doctor.doctor_id}/edit`}
                    showDelete
                    onDelete={() => handleDeleteClick(doctor)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Doctor"
        description={
          <>
            Are you sure you want to delete <strong>{doctorToDelete?.name}</strong>?
            This action cannot be undone and will remove all associated data.
          </>
        }
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
