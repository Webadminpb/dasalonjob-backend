import { z } from 'zod';
import { Prisma } from '@prisma/client';
export const zDateOptional = z
  .string()
  .nullish()
  .transform((v) => (v ? new Date(v) : null));

export const zYearOptional = z
  .string()
  .nullish()
  .refine((v) => !v || /^\d{4}$/.test(v), {
    message: 'Date should be a valid year (YYYY)',
  })
  .transform((v) => (v ? parseInt(v, 10) : null));

export const createDateBeforeFilter = (
  date?: string | Date | null,
): Prisma.DateTimeFilter | undefined => {
  if (!date) return undefined;
  const dateValue = date instanceof Date ? date.toISOString() : date;

  return { lt: dateValue };
};
