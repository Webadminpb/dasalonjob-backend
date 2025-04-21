import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const querySponsoredJobSchema = z
  .object({
    jobPostId: z.string(),
    search: z.string(),
    page: z.string().transform(Number),
    limit: z.string().transform(Number),
    order: z.enum(['asc', 'desc']).default('desc'),
    sort: z
      .enum(['createdAt', 'updatedAt', 'order', 'status'])
      .default('createdAt'),
  })
  .partial();

export class QuerySponsoredJobDto extends createZodDto(
  querySponsoredJobSchema,
) {}
