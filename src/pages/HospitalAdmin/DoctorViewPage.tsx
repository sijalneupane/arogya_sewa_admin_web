import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, Briefcase, FileText, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EditDeleteActions } from '@/components/ui/EditDeleteActions';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { useDoctorById } from '@/features/hospital-admin/doctors/hooks/useDoctorById';
import { doctorApi } from '@/api/doctor.api';
import toast from 'react-hot-toast';

const DOCTOR_STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  'On Appointment': 'bg-blue-100 text-blue-700',
  Inactive: 'bg-gray-100 text-gray-600',
};

export default function DoctorViewPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { doctor, loading, error } = useDoctorById(doctorId || '');

  const handleDelete = async () => {
    if (!doctorId) return;
    await doctorApi.delete(doctorId);
    toast.success('Doctor deleted successfully');
    navigate('/doctors');
  };

  if (loading) {
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
      {/* Breadcrumb and Actions */}
      <div className="flex items-center justify-between">
        <Breadcrumb items={[
          { label: 'Doctors', href: '/doctors' },
          { label: doctor.user.name }
        ]} />
        <EditDeleteActions
          editHref={`/doctors/${doctor.doctor_id}/edit`}
          editLabel="Edit Doctor"
          onDelete={handleDelete}
          deleteLabel="Delete Doctor"
          deleteDialogTitle="Delete Doctor"
          deleteDialogDescription={
            <>Are you sure you want to delete <strong>{doctor.user.name}</strong>? This action cannot be undone.</>
          }
        />
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            <div className="shrink-0">
              {doctor.user.profile_img?.file_url ? (
                <ImagePreview
                  src={doctor.user.profile_img.file_url}
                  alt={doctor.user.name}
                  title={doctor.user.name}
                >
                  <AvatarPlaceholder
                    name={doctor.user.name}
                    imageUrl={doctor.user.profile_img.file_url}
                    size="lg"
                    shape="circle"
                    className="cursor-pointer hover:opacity-80 transition-opacity border-2 border-blue-600/20"
                  />
                </ImagePreview>
              ) : (
                <AvatarPlaceholder
                  name={doctor.user.name}
                  size="lg"
                  shape="circle"
                  className="border-2 border-blue-600/20"
                />
              )}
            </div>

            {/* Doctor Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{doctor.user.name}</h2>
                <p className="text-gray-500 text-sm">{doctor.user.email}</p>
              </div>

              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
                    DOCTOR_STATUS_COLORS[doctor.status] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {doctor.status}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Information */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Email Address</label>
                <p className="text-gray-900 font-medium text-sm">{doctor.user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <p className="text-gray-900 font-medium text-sm">{doctor.user.phone_number}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              Professional Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Department</label>
                <p className="text-gray-900 font-medium text-sm">
                  {doctor.department?.name || 'Not assigned'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Experience</label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-gray-400" />
                  <p className="text-gray-900 font-medium text-sm">
                    {doctor.experience}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Certificate */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              License Certificate
            </h3>
            <div className="space-y-3">
              {doctor.license_certificate ? (
                <>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <p className="text-green-600 font-medium text-sm">Uploaded</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">File Type</label>
                    <p className="text-gray-900 font-medium text-sm capitalize">
                      {doctor.license_certificate.meta_type}
                    </p>
                  </div>
                  <div>
                    <a
                      href={doctor.license_certificate.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <FileText className="h-4 w-4" />
                      View License Certificate
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">License certificate not uploaded</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Timeline */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Account Timeline
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Created At</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-gray-900 font-medium text-sm">
                    {new Date(doctor.user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Last Updated</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-gray-900 font-medium text-sm">
                    {new Date(doctor.user.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section (if available) */}
        {doctor.bio && (
          <Card className="md:col-span-2">
            <CardContent className="pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-blue-600" />
                Bio
              </h3>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{doctor.bio}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
