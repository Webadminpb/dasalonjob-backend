import { createZodDto } from 'nestjs-zod';
import { CreateSaveJobPostSchema } from './create-save-job-post.dto';

export class UpdateSaveJobPostDto extends createZodDto(
  CreateSaveJobPostSchema.partial(),
) {}
