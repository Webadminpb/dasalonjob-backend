import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryBusinessTypeSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  search: z.string().optional(),
});

export class QueryBusinessTypeDto extends createZodDto(
  QueryBusinessTypeSchema,
) {}
