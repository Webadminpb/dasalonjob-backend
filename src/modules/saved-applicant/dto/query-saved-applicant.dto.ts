import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const QuerySavedApplicantSchema = z.object({
  search: z.string(),
  page: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Page must be a positive number',
    }),
  limit: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Limit must be a positive number',
    }),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
});

export class QuerySavedApplicant extends createZodDto(
  QuerySavedApplicantSchema.partial(),
) {}
