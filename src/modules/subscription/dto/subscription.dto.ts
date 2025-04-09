import { SubscriptionStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createSubscriptionSchema = z.object({
  userId: z.string().optional(),
  planId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(SubscriptionStatus).optional(),
  createdByAdminId: z.string().optional(),
});

const querySubscriptionSchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  search: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  userId: z.string().optional(),
  agencyId: z.string().optional(),
});

export class CreateSubscriptionDto extends createZodDto(
  createSubscriptionSchema,
) {}
export class UpdateSubscriptionDto extends createZodDto(
  createSubscriptionSchema.partial(),
) {}
export class QuerySubscriptionDto extends createZodDto(
  querySubscriptionSchema,
) {}
