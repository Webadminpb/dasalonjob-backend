import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const sponsoredJobSchema = z.object({
  jobPostId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  priority: z.number(),
  isActive: z.boolean().optional(),
});

export class CreateSponsoredJobDto extends createZodDto(sponsoredJobSchema) {}
