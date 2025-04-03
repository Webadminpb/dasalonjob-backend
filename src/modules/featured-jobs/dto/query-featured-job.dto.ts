import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryFeaturedJobSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  jobPostId: z.string().optional(),
  adminId: z.string().optional(),
  sort: z.string().optional(),
});

export class QueryFeaturedJobDto extends createZodDto(QueryFeaturedJobSchema) {}
