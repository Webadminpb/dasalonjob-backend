import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobApplicationSchema = z.object({
  jobPostId: z.string(),
});

export class CreateJobApplicationDto extends createZodDto(
  JobApplicationSchema,
) {}
