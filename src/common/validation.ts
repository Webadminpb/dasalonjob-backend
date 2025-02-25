import { z } from 'zod';
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
