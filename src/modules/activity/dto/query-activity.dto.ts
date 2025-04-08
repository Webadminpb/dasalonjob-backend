import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryActivitySchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  lastFetchedDate: zDateOptional,
  userId: z.string(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z
    .enum(['createdAt', 'updatedAt', 'order', 'status'])
    .default('createdAt'),
});

export class QueryActivityDto extends createZodDto(QueryActivitySchema) {}
