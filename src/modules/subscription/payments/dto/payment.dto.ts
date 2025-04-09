import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPaymentSchema = z.object({
  userId: z.string(),
  subscriptionId: z.string(),
  amount: z.number(),
  currency: z.string(),
  paymentStatus: z.nativeEnum(PaymentStatus),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

const queryPaymentSchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  status: z.string().optional(),
  search: z.string().optional(),
});

export class CreatePaymentDto extends createZodDto(createPaymentSchema) {}
export class UpdatePaymentDto extends createZodDto(
  createPaymentSchema.partial(),
) {}
export class QueryPaymentDto extends createZodDto(queryPaymentSchema) {}
