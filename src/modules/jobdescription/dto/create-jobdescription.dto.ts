import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobDescriptionSchema = z.object({
  description: z.string(),
});

export class CreateJobDescriptionDto extends createZodDto(
  JobDescriptionSchema,
) {}
