import { z } from 'zod';
export const zDateOptional = z
  .string()
  .nullish()
  .transform((v) => (v ? new Date(v) : null));
