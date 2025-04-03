import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FeaturedJobSchema = z.object({
  jobPostId: z.string(),
  endDate: z.string().datetime(),
  priority: z.number().int().min(1).max(10).optional(),
});

export class CreateFeaturedJobDto extends createZodDto(FeaturedJobSchema) {}
