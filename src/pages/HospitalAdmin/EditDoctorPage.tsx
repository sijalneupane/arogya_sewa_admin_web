import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DoctorForm } from '@/features/hospital-admin/doctors/components/DoctorForm';
import { doctorApi } from '@/api/doctor.api';

export default function EditDoctorPage() {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();

  const { data: response, isLoading } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => doctorApi.getById(doctorId!),
    enabled: !!doctorId,
  });

  const handleSuccess = () => {
    navigate('/doctors');
  };

  if (isLoading) {
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

  if (!response?.data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-600">Doctor not found</div>
      </div>
    );
  }

  const doctor = response.data;

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'Doctors', href: '/doctors' },
        { label: 'Edit Doctor' }
      ]} />
      {/* <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/doctors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Doctor</h1>
          <p className="text-gray-600 mt-2">Update doctor information</p>
        </div>
      </div> */}

      <Card>
        {/* <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader> */}
        <CardContent>
          <DoctorForm
            doctor={{
              id: doctor.doctor_id,
              experience: doctor.experience,
              bio: doctor.bio,
              department_id: doctor.department?.department_id || null,
              status: doctor.status,
              license_certificate_id: doctor.license_certificate?.file_id || null,
              license_certificate: doctor.license_certificate || null,
              user: {
                name: doctor.user.name,
                email: doctor.user.email,
                phone_number: doctor.user.phone_number,
                profile_image_id: doctor.user.profile_img?.file_id || null,
                profile_image_url: doctor.user.profile_img?.file_url || null,
              },
            }}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
