import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createJobApplicationMessageSchema = z.object({
  applicantId: z.string(),
  jobApplicationId: z.string(),
  message: z.string(),
});

export class CreateJobApplicationMessageDto extends createZodDto(
  createJobApplicationMessageSchema,
) {}
