import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateSaveCourseSchema = z.object({
  courseId: z.string(),
});

export class CreateSaveCourseDto extends createZodDto(CreateSaveCourseSchema) {}
