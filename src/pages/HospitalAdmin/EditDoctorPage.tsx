import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
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
