import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth.store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { cashPaymentSchema, CashPaymentFormValues } from '../schemas/cashPayment.schema';
import { useRecordCashPayment } from '../hooks/useRecordCashPayment';
import { HospitalAdminAppointment } from '@/types/hospitalAdminAppointment.type';
import { useState } from 'react';

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function queryErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type DialogStep = 'form' | 'confirm';

interface RecordCashPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: HospitalAdminAppointment;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RecordCashPaymentDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: RecordCashPaymentDialogProps) {
  // Task 4.1 — internal state
  const [step, setStep] = useState<DialogStep>('form');
  const [pendingValues, setPendingValues] = useState<CashPaymentFormValues | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Task 4.1 — auth context
  const { user } = useAuthStore();

  const dueAmount = appointment.due_amount;

  // Task 4.4 — form setup
  const form = useForm<CashPaymentFormValues>({
    resolver: zodResolver(cashPaymentSchema(dueAmount)),
    defaultValues: {
      amount: dueAmount,
      remarks: '',
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useRecordCashPayment(appointment.appointment_id);

  // Task 4.11 — reset on close
  useEffect(() => {
    if (!open) {
      form.reset({ amount: dueAmount, remarks: '' });
      setStep('form');
      setPendingValues(null);
      setApiError(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Task 4.4 — form submit handler: move to confirm step
  function handleFormSubmit(values: CashPaymentFormValues) {
    setPendingValues(values);
    setStep('confirm');
  }

  // Task 4.7 — confirmation handler
  function handleConfirm() {
    if (!pendingValues || !user) return;
    setApiError(null);

    mutate(
      {
        appointment_id: appointment.appointment_id,
        amount: pendingValues.amount,
        user_id: user.id,
        remarks: pendingValues.remarks,
      },
      {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          setApiError(queryErrorMessage(err, 'Failed to record cash payment. Please try again.'));
          // Stay on confirm step so the error is visible
        },
      }
    );
  }

  // Task 4.7 — cancel confirmation: go back to form with values preserved
  function handleCancelConfirm() {
    setStep('form');
    // pendingValues are preserved; form values remain intact
  }

  // ── Confirmation dialog description ────────────────────────────────────────
  const confirmDescription = pendingValues ? (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Appointment ID</span>
        <span className="font-mono font-medium">{appointment.appointment_id}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Amount</span>
        <span className="font-semibold">{formatAmount(pendingValues.amount)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="shrink-0 text-muted-foreground">Remarks</span>
        <span className="text-right">{pendingValues.remarks}</span>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Task 4.2 + 4.4 — main dialog (form step) */}
      <Dialog open={open && step === 'form'} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Cash Payment</DialogTitle>
            <DialogDescription>
              Review the appointment details and enter the payment information below.
            </DialogDescription>
          </DialogHeader>

          {/* Task 4.2 — Appointment info summary */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Appointment Summary
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Appointment Status</p>
                <p className="font-medium">{appointment.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <p className="font-medium">{appointment.payment_status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start</p>
                <p className="font-medium">{formatDateTime(appointment.availability.start_date_time)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End</p>
                <p className="font-medium">{formatDateTime(appointment.availability.end_date_time)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="font-medium">{formatAmount(appointment.total_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paid Amount</p>
                <p className="font-medium">{formatAmount(appointment.paid_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Due Amount</p>
                <p className="font-semibold text-amber-700">{formatAmount(appointment.due_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Advance Fee</p>
                <p className="font-medium">{formatAmount(appointment.advance_fee)}</p>
              </div>
            </div>
          </div>

          {/* Task 4.4 — Payment form */}
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                aria-invalid={!!form.formState.errors.amount}
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter remarks (5–50 characters)"
                aria-invalid={!!form.formState.errors.remarks}
                {...form.register('remarks')}
              />
              {form.formState.errors.remarks && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.remarks.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
              >
                Review Payment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task 4.7 — Confirmation step */}
      {step === 'confirm' && pendingValues && (
        <ConfirmationDialog
          open={open && step === 'confirm'}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleCancelConfirm();
          }}
          title="Confirm Cash Payment"
          description={
            <div className="space-y-3">
              {confirmDescription}
              {apiError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {apiError}
                </p>
              )}
            </div>
          }
          confirmText="Confirm Payment"
          cancelText="Back to Form"
          variant="default"
          isLoading={isPending}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      )}
    </>
  );
}
