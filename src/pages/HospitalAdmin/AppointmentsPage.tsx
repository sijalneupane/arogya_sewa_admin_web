import { useState } from 'react';
import { Search, RefreshCw, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Pagination } from '@/components/ui/Pagination';
import { useHospitalAdminAppointments } from '@/features/hospital-admin/appointments/hooks/useHospitalAdminAppointments';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { ActionMenu } from '@/components/ui/ActionMenu';

function formatAmount(value: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

const PAGE_SIZE = 10;

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

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes('cancel')) return 'bg-red-100 text-red-800';
  if (s.includes('pending')) return 'bg-amber-100 text-amber-900';
  if (s.includes('confirm') || s.includes('complete')) return 'bg-green-100 text-green-800';
  if (s.includes('paid')) return 'bg-emerald-100 text-emerald-900';
  return 'bg-gray-100 text-gray-800';
}

function paymentBadgeClass(payment: string) {
  const p = payment.toLowerCase();
  if (p.includes('unpaid') || p.includes('due')) return 'bg-orange-100 text-orange-900';
  if (p.includes('paid') || p.includes('complete')) return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
}

export default function AppointmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  const { appointments, loading, error, pagination, refetch } = useHospitalAdminAppointments({
    doctor_name: doctorName || undefined,
    patient_name: patientName || undefined,
    status: status || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    appointment_date: appointmentDate || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const hasActiveFilters =
    doctorName ||
    patientName ||
    status ||
    dateFrom ||
    dateTo ||
    appointmentDate;

  const clearFilters = () => {
    setDoctorName('');
    setPatientName('');
    setStatus('');
    setDateFrom('');
    setDateTo('');
    setAppointmentDate('');
    setCurrentPage(1);
  };

  if (error && !loading) {
    return (
      <div className="space-y-4">
        <div>
          <Breadcrumb items={[{ label: 'Appointments' }]} />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 font-semibold">Error loading appointments</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
                onClick={() => refetch()}
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
      <Breadcrumb items={[{ label: 'Appointments' }]} />

      <Card className="gap-1">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All appointments</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className={hasActiveFilters ? 'visible' : 'invisible pointer-events-none'}
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-2 sm:gap-y-2 lg:flex-nowrap lg:gap-x-2">
            <div className="flex w-full flex-col gap-0.5 sm:min-w-[8.5rem] sm:flex-1 lg:min-w-0">
              <label className="text-[11px] font-medium text-gray-500">Doctor</label>
              <div className="relative flex items-center">
                <Search className="absolute left-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Doctor…"
                  value={doctorName}
                  onChange={(e) => {
                    setDoctorName(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-0.5 sm:min-w-[8.5rem] sm:flex-1 lg:min-w-0">
              <label className="text-[11px] font-medium text-gray-500">Patient</label>
              <div className="relative flex items-center">
                <Search className="absolute left-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Patient…"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-0.5 sm:min-w-[7.5rem] sm:flex-1 sm:max-w-[11rem] lg:max-w-none lg:min-w-0">
              <label className="text-[11px] font-medium text-gray-500">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Pending Payment">Pending Payment</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex w-full flex-col gap-0.5 sm:min-w-[9rem] sm:flex-1 sm:max-w-[10.5rem] lg:max-w-none lg:min-w-0">
              <label className="text-[11px] font-medium text-gray-500">Appt. date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => {
                  setAppointmentDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex w-full flex-col gap-0.5 sm:min-w-[min(100%,17rem)] sm:flex-[1.35] lg:min-w-0">
              <label className="text-[11px] font-medium text-gray-500">Date range</label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="min-w-0 flex-1 rounded-md border border-gray-300 py-1.5 px-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  aria-label="From date"
                />
                <span className="shrink-0 text-gray-400 text-xs">–</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="min-w-0 flex-1 rounded-md border border-gray-300 py-1.5 px-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  aria-label="To date"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full" />
              </div>
              <p className="text-gray-600 mt-2">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No appointments match your filters.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Doctor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Slot</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700 w-[1%] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((row) => (
                    <tr key={row.appointment_id} className="border-b border-gray-100 hover:bg-gray-50/80">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <AvatarPlaceholder
                            name={row.patient.user.name}
                            imageUrl={row.patient.user.profile_img?.file_url || undefined}
                            size="sm"
                            className="shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-medium text-gray-900 block truncate">{row.patient.user.name}</span>
                            <p className="text-gray-500 text-xs mt-0.5 truncate">{row.patient.user.phone_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <AvatarPlaceholder
                            name={row.doctor.user.name}
                            imageUrl={row.doctor.user.profile_img?.file_url || undefined}
                            size="sm"
                            className="shrink-0"
                          />
                          <span className="font-medium text-gray-900 truncate">{row.doctor.user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {row.doctor.department?.name ?? '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                        {formatDateTime(row.availability.start_date_time)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(row.status)}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${paymentBadgeClass(row.payment_status)}`}
                        >
                          {row.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-gray-900">
                        {formatAmount(row.total_amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ActionMenu
                          viewUrl={`/appointments/${row.appointment_id}`}
                          showEdit={false}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination && !loading && appointments.length > 0 && (
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
