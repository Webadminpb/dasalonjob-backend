import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateSaveJobPostSchema = z.object({
  jobPostId: z.string(),
});

export class CreateASaveJobPostDto extends createZodDto(
  CreateSaveJobPostSchema,
) {}
