import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  RefreshCw,
  CalendarClock,
  User,
  Stethoscope,
  Wallet,
  Banknote,
  AlertCircle,
  CheckCircle2,
  Clock,
  Receipt,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useHospitalAdminAppointmentById } from '@/features/hospital-admin/appointments/hooks/useHospitalAdminAppointmentById';
import { useAppointmentPayments } from '@/features/hospital-admin/appointments/hooks/useAppointmentPayments';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { cn } from '@/lib/utils';
import { AppointmentPayment } from '@/types/payment.type';
import { isEligibleForCashPayment } from '@/features/hospital-admin/appointments/utils/cashPaymentEligibility';
import { RecordCashPaymentDialog } from '@/features/hospital-admin/appointments/components/RecordCashPaymentDialog';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { appointmentApi } from '@/api/appointment.api';
import toast from 'react-hot-toast';

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

function formatAmount(value: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function toDatetimeLocalValue(date: Date) {
  const offsetMinutes = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offsetMinutes * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function appointmentStatusClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes('cancel')) return 'bg-red-50 text-red-800 ring-red-200';
  if (s.includes('pending')) return 'bg-amber-50 text-amber-900 ring-amber-200';
  if (s.includes('confirm') || s.includes('complete')) return 'bg-emerald-50 text-emerald-900 ring-emerald-200';
  return 'bg-slate-100 text-slate-800 ring-slate-200';
}

function paymentOverviewClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes('unpaid') || s.includes('due') || s.includes('pending')) {
    return 'bg-orange-50 text-orange-900 ring-orange-200';
  }
  if (s.includes('paid') || s.includes('complete')) return 'bg-emerald-50 text-emerald-900 ring-emerald-200';
  return 'bg-slate-100 text-slate-800 ring-slate-200';
}

function recordPaymentStatusClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes('fail') || s.includes('cancel')) return 'bg-red-100 text-red-800';
  if (s.includes('pending')) return 'bg-amber-100 text-amber-900';
  if (s.includes('success') || s.includes('complete') || s.includes('paid')) {
    return 'bg-emerald-100 text-emerald-900';
  }
  return 'bg-slate-100 text-slate-800';
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  tone: 'default' | 'success' | 'warning' | 'muted';
}) {
  const toneRing =
    tone === 'success'
      ? 'ring-emerald-100/80'
      : tone === 'warning'
        ? 'ring-amber-100/80'
        : tone === 'muted'
          ? 'ring-slate-100'
          : 'ring-primary/10';
  const iconBg =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-700'
      : tone === 'warning'
        ? 'bg-amber-50 text-amber-800'
        : tone === 'muted'
          ? 'bg-slate-100 text-slate-600'
          : 'bg-primary/10 text-primary';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1',
        toneRing
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
          {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
        </div>
      </div>
    </div>
  );
}

function PaymentHistorySection({
  payments,
  loading,
  error,
  onRetry,
}: {
  payments: AppointmentPayment[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading payment records…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="font-medium text-red-900">Could not load payments</p>
            <p className="text-sm text-red-700/90">{error}</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="border-red-300" onClick={onRetry}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
        <Receipt className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-3 text-sm font-medium text-foreground">No payment transactions yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Payments linked to this appointment will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">When</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">Amount</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">Method</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">Transaction</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">Paid by</th>
              <th className="min-w-[8rem] px-4 py-3 font-semibold text-foreground">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {payments.map((p) => (
              <tr key={p.payment_id} className="bg-card transition-colors hover:bg-muted/30">
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDateTime(p.paid_at)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-foreground">
                  {formatAmount(p.amount)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary ring-1 ring-primary/15">
                    <CreditCard className="h-3.5 w-3.5 opacity-80" />
                    {p.payment_method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      recordPaymentStatusClass(p.status)
                    )}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="max-w-[11rem] px-4 py-3">
                  <span className="block truncate font-mono text-xs text-muted-foreground" title={p.transaction_id}>
                    {p.transaction_id || '—'}
                  </span>
                  {p.gateway_ref ? (
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground/80" title={p.gateway_ref}>
                      Ref: {p.gateway_ref}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AvatarPlaceholder
                      name={p.paid_by.name}
                      imageUrl={p.paid_by.profile_img?.file_url || undefined}
                      size="sm"
                      className="shrink-0"
                    />
                    <span className="truncate font-medium text-foreground">{p.paid_by.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <span className="line-clamp-2 text-xs" title={p.remarks || undefined}>
                    {p.remarks || '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AppointmentViewPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { appointment, loading, error, refetch } = useHospitalAdminAppointmentById(appointmentId);
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useAppointmentPayments(appointmentId);

  // Task 6.1 — cash payment eligibility and dialog state
  const [cashPaymentOpen, setCashPaymentOpen] = useState(false);
  const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false);
  const [completedAtInput, setCompletedAtInput] = useState(() => toDatetimeLocalValue(new Date()));
  const eligible =
    !loading &&
    !paymentsLoading &&
    appointment !== null &&
    isEligibleForCashPayment(appointment, payments.length);
  const canMarkComplete =
    appointment !== null &&
    appointment.status.toLowerCase().includes('progress') &&
    appointment.due_amount === 0 &&
    appointment.payment_status.toLowerCase().includes('paid');

  const completeMutation = useMutation({
    mutationFn: (completedAt: string) => appointmentApi.complete(appointmentId!, completedAt),
    onSuccess: async () => {
      toast.success('Appointment marked as complete');
      setCompleteConfirmOpen(false);
      await refetch();
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string'
          ? (err as { message: string }).message
          : err instanceof Error
            ? err.message
            : 'Failed to complete appointment';
      toast.error(message);
    },
  });

  if (error && !loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Breadcrumb
          items={[
            { label: 'Appointments', href: '/appointments' },
            { label: 'Details' },
          ]}
        />
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-red-800">Error loading appointment</p>
                <p className="mt-1 text-sm text-red-700/90">{error}</p>
              </div>
              <Button variant="outline" className="border-red-300 text-red-800 shrink-0" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || !appointment) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Breadcrumb
          items={[
            { label: 'Appointments', href: '/appointments' },
            { label: 'Details' },
          ]}
        />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">Loading appointment…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-8">
      <Breadcrumb
        items={[
          { label: 'Appointments', href: '/appointments' },
          { label: 'Details' },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {/* <Link
            to="/appointments"
            className="inline-flex w-fit items-center gap-1.5 rounded-lg text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to appointments
          </Link> */}
          <div>
            {/* <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Appointment</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground sm:text-sm">{appointment.appointment_id}</p> */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
                  appointmentStatusClass(appointment.status)
                )}
              >
                {appointment.status}
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
                  paymentOverviewClass(appointment.payment_status)
                )}
              >
                Billing: {appointment.payment_status}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
                <Clock className="h-3.5 w-3.5" />
                Booked {formatDateTime(appointment.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Task 6.1 — Record Cash Payment button */}
        {eligible && (
          <div className="shrink-0">
            <Button onClick={() => setCashPaymentOpen(true)}>
              <Banknote className="h-4 w-4" />
              Record Cash Payment
            </Button>
          </div>
        )}
        {canMarkComplete && (
          <div className="shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setCompletedAtInput(toDatetimeLocalValue(new Date()));
                setCompleteConfirmOpen(true);
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Wallet}
          label="Total"
          value={formatAmount(appointment.total_amount)}
          tone="default"
        />
        <StatTile
          icon={CheckCircle2}
          label="Paid"
          value={formatAmount(appointment.paid_amount)}
          sub="Recorded on appointment"
          tone="success"
        />
        <StatTile
          icon={AlertCircle}
          label="Due"
          value={formatAmount(appointment.due_amount)}
          tone="warning"
        />
        <StatTile
          icon={Banknote}
          label="Advance"
          value={formatAmount(appointment.advance_fee)}
          tone="muted"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── Patient Card ── */}
        <Card className="overflow-hidden border border-border/80 shadow-md ring-1 ring-border/40">
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-blue-50/80 to-transparent px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold tracking-tight">Patient Information</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Personal & contact details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="flex gap-4">
              <AvatarPlaceholder
                name={appointment.patient.user.name}
                imageUrl={appointment.patient.user.profile_img?.file_url || undefined}
                size="lg"
                shape="rounded"
                className="h-16 w-16 ring-2 ring-border/50"
              />
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold leading-tight text-foreground">
                  {appointment.patient.user.name}
                </p>
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</span>
                    <span className="truncate text-muted-foreground/90">{appointment.patient.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</span>
                    <span className="text-muted-foreground/90">{appointment.patient.user.phone_number}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-border/50 pt-3">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/60">
                    <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">DOB</span>
                    {appointment.patient.dob}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/60">
                    {appointment.patient.gender}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200/60">
                    {appointment.patient.blood_group}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Doctor Card ── */}
        <Card className="overflow-hidden border border-border/80 shadow-md ring-1 ring-border/40">
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-purple-50/80 to-transparent px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold tracking-tight">Doctor Information</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Provider & department</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="flex gap-4">
              <AvatarPlaceholder
                name={appointment.doctor.user.name}
                imageUrl={appointment.doctor.user.profile_img?.file_url || undefined}
                size="lg"
                shape="rounded"
                className="h-16 w-16 ring-2 ring-border/50"
              />
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold leading-tight text-foreground">
                  {appointment.doctor.user.name}
                </p>
                <p className="mt-0.5 inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-purple-200/60">
                  {appointment.doctor.department?.name ?? '—'}
                </p>
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</span>
                    <span className="text-muted-foreground/90">{appointment.doctor.user.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Hospital</span>
                    <span className="truncate text-muted-foreground/90">{appointment.doctor.hospital?.name ?? '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Schedule Card ── */}
      <Card className="overflow-hidden border border-border/80 shadow-md ring-1 ring-border/40">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/80 to-transparent px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CalendarClock className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">Appointment Schedule</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Time slot & consultation details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-4">
          {/* Start / End time row */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200/60 bg-emerald-50/40 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white shadow-sm">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700/70">Start Time</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-emerald-900">
                  {formatDateTime(appointment.availability.start_date_time)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-slate-200/60 bg-slate-50/40 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-400 text-white shadow-sm">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600/70">End Time</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-900">
                  {formatDateTime(appointment.availability.end_date_time)}
                </p>
              </div>
            </div>
          </div>

          {/* Reason + Notes on the same row */}
          {(appointment.reason || appointment.notes) && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className={cn(
                "rounded-lg border px-4 py-3",
                appointment.reason 
                  ? "border-border/80 bg-card shadow-sm" 
                  : "border-dashed border-border/40 bg-muted/10"
              )}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    appointment.reason ? "bg-blue-50 text-blue-600" : "bg-muted text-muted-foreground/50"
                  )}>
                    <FileText className="h-3 w-3" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Reason for Visit</p>
                </div>
                <p className={cn(
                  "text-sm leading-relaxed",
                  appointment.reason ? "text-foreground" : "text-muted-foreground/50 italic"
                )}>
                  {appointment.reason || 'No reason provided'}
                </p>
              </div>
              <div className={cn(
                "rounded-lg border px-4 py-3",
                appointment.notes 
                  ? "border-border/80 bg-card shadow-sm" 
                  : "border-dashed border-border/40 bg-muted/10"
              )}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    appointment.notes ? "bg-amber-50 text-amber-600" : "bg-muted text-muted-foreground/50"
                  )}>
                    <FileText className="h-3 w-3" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Additional Notes</p>
                </div>
                <p className={cn(
                  "text-sm leading-relaxed",
                  appointment.notes ? "text-foreground" : "text-muted-foreground/50 italic"
                )}>
                  {appointment.notes || 'No additional notes'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Payment history</h2>
            <p className="text-sm text-muted-foreground">
              Transactions recorded for this appointment ({paymentsLoading ? '…' : payments.length})
            </p>
          </div>
          {!paymentsLoading && !paymentsError ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => refetchPayments()}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh
            </Button>
          ) : null}
        </div>

        <PaymentHistorySection
          payments={payments}
          loading={paymentsLoading}
          error={paymentsError}
          onRetry={() => refetchPayments()}
        />
      </section>

      {/* Task 6.3 — Record Cash Payment dialog */}
      {appointment && (
        <RecordCashPaymentDialog
          open={cashPaymentOpen}
          onOpenChange={setCashPaymentOpen}
          appointment={appointment}
          onSuccess={() => {
            refetch();
            refetchPayments();
          }}
        />
      )}

      <ConfirmationDialog
        open={completeConfirmOpen}
        onOpenChange={setCompleteConfirmOpen}
        title="Mark appointment as complete?"
        description={
          <div className="space-y-4 text-sm">
            <p>This will update the appointment status to completed.</p>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Appointment</span>
                <span className="font-mono text-xs font-medium">{appointment.appointment_id}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Current status</span>
                <span className="font-medium capitalize">{appointment.status}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="completed-at">Completed at</Label>
              <Input
                id="completed-at"
                type="datetime-local"
                value={completedAtInput}
                onChange={(event) => setCompletedAtInput(event.target.value)}
                step={60}
              />
            </div>
          </div>
        }
        confirmText="Complete Appointment"
        variant="default"
        isLoading={completeMutation.isPending}
        onConfirm={() => completeMutation.mutate(completedAtInput)}
      />
    </div>
  );
}
