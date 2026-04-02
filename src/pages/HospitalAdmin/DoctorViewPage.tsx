import { memo, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  User as UserIcon,
  CalendarClock,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EditDeleteActions } from '@/components/ui/EditDeleteActions';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { Pagination } from '@/components/ui/Pagination';
import { useDoctorById } from '@/features/hospital-admin/doctors/hooks/useDoctorById';
import { useDoctorAvailabilities } from '@/features/hospital-admin/doctors/hooks/useDoctorAvailabilities';
import { doctorApi } from '@/api/doctor.api';
import { DoctorAvailability } from '@/types/availability.type';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const DOCTOR_STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  'On Leave': 'bg-amber-100 text-amber-800 border-amber-200',
  Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
};

const AVAIL_PAGE_SIZE = 10;

type BookingFilter = 'all' | 'booked' | 'available';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const AvailabilityRow = memo(function AvailabilityRow({ row }: { row: DoctorAvailability }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3">
      <div className="space-y-3 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
              row.is_booked
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {row.is_booked ? 'Booked' : 'Open'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2 min-w-0">
            <Clock className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start</p>
              <p className="font-medium text-gray-900 wrap-break-word">{formatDateTime(row.start_date_time)}</p>
            </div>
          </div>
          <div className="flex gap-2 min-w-0">
            <Clock className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">End</p>
              <p className="font-medium text-gray-900 wrap-break-word">{formatDateTime(row.end_date_time)}</p>
            </div>
          </div>
        </div>
        {row.note?.trim() ? (
          <p className="text-sm text-gray-600 pt-2 border-t border-gray-200/80">{row.note}</p>
        ) : null}
      </div>
    </div>
  );
});

export default function DoctorViewPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { doctor, loading, error } = useDoctorById(doctorId);

  const [availPage, setAvailPage] = useState(1);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>('all');
  const [futureOnly, setFutureOnly] = useState(true);

  const is_booked =
    bookingFilter === 'all' ? undefined : bookingFilter === 'booked';

  const {
    availabilities,
    loading: availLoading,
    isRefreshing,
    error: availError,
    pagination,
    refetch,
  } = useDoctorAvailabilities(doctor?.doctor_id, {
    page: availPage,
    pageSize: AVAIL_PAGE_SIZE,
    is_booked,
    future_only: futureOnly,
  });

  const onBookingFilterChange = useCallback((value: BookingFilter) => {
    setBookingFilter(value);
    setAvailPage(1);
  }, []);

  const onFutureOnlyChange = useCallback((checked: boolean) => {
    setFutureOnly(checked);
    setAvailPage(1);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!doctorId) return;
    await doctorApi.delete(doctorId);
    toast.success('Doctor deleted successfully');
    navigate('/doctors');
  }, [doctorId, navigate]);

  if (!doctorId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-700 font-medium">Missing doctor ID in URL.</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate('/doctors')}>
            Back to Doctors
          </Button>
        </CardContent>
      </Card>
    );
  }

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Breadcrumb
          items={[
            { label: 'Doctors', href: '/doctors' },
            { label: doctor.user.name },
          ]}
        />
        <EditDeleteActions
          editHref={`/doctors/${doctor.doctor_id}/edit`}
          editLabel="Edit Doctor"
          onDelete={handleDelete}
          deleteLabel="Delete Doctor"
          deleteDialogTitle="Delete Doctor"
          deleteDialogDescription={
            <>
              Are you sure you want to delete <strong>{doctor.user.name}</strong>? This action cannot be
              undone.
            </>
          }
        />
      </div>

      {/* Profile summary — plain surface (lighter paint than multi-layer gradients) */}
      <div className="rounded-xl border border-gray-200 bg-slate-50/80 shadow-sm">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
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
                    className="cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-white shadow-sm border border-gray-100"
                  />
                </ImagePreview>
              ) : (
                <AvatarPlaceholder
                  name={doctor.user.name}
                  size="lg"
                  shape="circle"
                  className="ring-2 ring-white shadow-sm border border-gray-100"
                />
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{doctor.user.name}</h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold ${
                    DOCTOR_STATUS_COLORS[doctor.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {doctor.status}
                </span>
              </div>
              <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <Mail className="h-4 w-4 shrink-0 text-blue-600" />
                {doctor.user.email}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200/80 px-3 py-2 text-sm">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium text-gray-900">{doctor.department?.name || '—'}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200/80 px-3 py-2 text-sm">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-900">{doctor.experience}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200/80 px-3 py-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{doctor.user.phone_number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="gap-0 py-0 overflow-hidden">
            <CardHeader className="border-b bg-gray-50/50 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Availability schedule</CardTitle>
                  <CardDescription>
                    Time slots for this doctor. Filter by booking status and whether the slot is still in
                    the future.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-5 space-y-5">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">
                <div className="flex flex-col gap-1 min-w-[180px]">
                  <label className="text-xs font-medium text-gray-600" htmlFor="booking-filter">
                    Booking status
                  </label>
                  <select
                    id="booking-filter"
                    value={bookingFilter}
                    onChange={(e) => onBookingFilterChange(e.target.value as BookingFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All slots</option>
                    <option value="available">Open only</option>
                    <option value="booked">Booked only</option>
                  </select>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={futureOnly}
                    onChange={(e) => onFutureOnlyChange(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Future slots only</span>
                </label>
              </div>

              {availError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span>{availError}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                    Retry
                  </Button>
                </div>
              )}

              {availLoading && !availError && (
                <div className="flex justify-center py-10" aria-busy="true" aria-label="Loading availability">
                  <div className="inline-block animate-spin">
                    <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-600 rounded-full" />
                  </div>
                </div>
              )}

              {!availLoading && !availError && availabilities.length === 0 && (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                  <CalendarClock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium text-gray-800">No availability in this view</p>
                  <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    Try changing filters or add slots elsewhere if your workflow supports it.
                  </p>
                </div>
              )}

              {!availLoading && !availError && availabilities.length > 0 && (
                <ul
                  className={cn(
                    'space-y-3 transition-opacity duration-150',
                    isRefreshing && 'opacity-60 pointer-events-none'
                  )}
                >
                  {availabilities.map((row) => (
                    <li key={row.availability_id}>
                      <AvailabilityRow row={row} />
                    </li>
                  ))}
                </ul>
              )}

              {pagination && !availError && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPage={pagination.totalPage}
                  totalRecords={pagination.totalRecords}
                  onPageChange={setAvailPage}
                />
              )}
            </CardContent>
          </Card>

          {doctor.bio && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                  Bio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{doctor.bio}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="font-medium text-gray-900 break-all mt-0.5">{doctor.user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="font-medium text-gray-900 mt-0.5 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {doctor.user.phone_number}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                License
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {doctor.license_certificate ? (
                <div className="space-y-3">
                  <p className="text-emerald-700 font-medium">Certificate on file</p>
                  <p className="text-gray-600 capitalize">{doctor.license_certificate.meta_type}</p>
                  <a
                    href={doctor.license_certificate.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    Open document
                  </a>
                </div>
              ) : (
                <p className="text-gray-500">No license uploaded</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="font-medium text-gray-900 mt-0.5">
                  {new Date(doctor.user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="font-medium text-gray-900 mt-0.5">
                  {new Date(doctor.user.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
