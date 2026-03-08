import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDoctorById } from '@/features/hospital-admin/doctors/hooks/useDoctorById';
import { DoctorEditForm } from '@/features/hospital-admin/doctors/components/DoctorEditForm';
import { UserEditForm } from '@/features/hospital-admin/doctors/components/UserEditForm';
import { UpdateDoctorData, UpdateDoctorUserData } from '@/types/doctor.type';
import { doctorApi } from '@/api/doctor.api';
import toast from 'react-hot-toast';

export default function EditDoctorPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { doctor, loading: fetchLoading, error } = useDoctorById(doctorId);
  const [updatingDoctor, setUpdatingDoctor] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);

  const handleUpdateDoctor = async (data: UpdateDoctorData) => {
    setUpdatingDoctor(true);
    try {
      await doctorApi.update(doctorId!, data);
      toast.success('Doctor information updated successfully');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to update doctor information';
      toast.error(errorMessage);
    } finally {
      setUpdatingDoctor(false);
    }
  };

  const handleUpdateUser = async (data: UpdateDoctorUserData) => {
    setUpdatingUser(true);
    try {
      await doctorApi.updateUserInfo(doctorId!, data);
      toast.success('User information updated successfully');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to update user information';
      toast.error(errorMessage);
    } finally {
      setUpdatingUser(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-semibold">Error loading doctor</p>
            <p className="text-red-500 text-sm mt-1">{error || 'Doctor not found'}</p>
            <Button
              variant="outline"
              className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
              onClick={() => navigate('/doctors')}
            >
              Back to Doctors
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Doctor</h1>
        <p className="text-gray-600 mt-1">Update doctor and user information</p>
      </div>

      {/* Doctor Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorEditForm
            initialValues={{
              experience: doctor.experience,
              bio: doctor.bio,
              department_id: doctor.department?.department_id || null,
              status: doctor.status,
              license_certificate_id: doctor.license_certificate?.file_id || null,
            }}
            initialLicenseCertificate={doctor.license_certificate ?? null}
            onSubmit={handleUpdateDoctor}
            loading={updatingDoctor}
          />
        </CardContent>
      </Card>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <UserEditForm
            initialValues={{
              email: doctor.user.email,
              name: doctor.user.name,
              phone_number: doctor.user.phone_number,
            }}
            onSubmit={handleUpdateUser}
            loading={updatingUser}
          />
        </CardContent>
      </Card>
    </div>
  );
}
