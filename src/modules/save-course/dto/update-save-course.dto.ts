import { createZodDto } from 'nestjs-zod';
import { CreateSaveCourseSchema } from './create-save-course.dto';

export class UpdateSaveCourseDto extends createZodDto(
  CreateSaveCourseSchema.partial(),
) {}
