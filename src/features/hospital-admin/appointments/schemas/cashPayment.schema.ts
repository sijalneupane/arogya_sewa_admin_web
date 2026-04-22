import { z } from 'zod';

export const cashPaymentSchema = (dueAmount: number) =>
  z.object({
    amount: z
      .number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
      .refine((val) => val === dueAmount, {
        message: `Amount must equal the due amount (${dueAmount})`,
      }),
    remarks: z
      .string()
      .min(5, 'Remarks must be at least 5 characters')
      .max(50, 'Remarks must not exceed 50 characters'),
  });

export type CashPaymentFormValues = z.infer<ReturnType<typeof cashPaymentSchema>>;
