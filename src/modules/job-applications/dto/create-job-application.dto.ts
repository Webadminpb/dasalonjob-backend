import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobApplicationSchema = z.object({
  jobPostId: z.string(),
  message: z.string().optional(),
});

export class CreateJobApplicationDto extends createZodDto(
  JobApplicationSchema,
) {}
