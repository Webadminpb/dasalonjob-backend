import { createZodDto } from 'nestjs-zod';
import { CreateCourseDetailsSchema } from './create-course-detail.dto';

export class UpdateCourseDetailsDto extends createZodDto(
  CreateCourseDetailsSchema.partial(),
) {}
