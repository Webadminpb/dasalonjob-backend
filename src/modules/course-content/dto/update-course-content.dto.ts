import { createZodDto } from 'nestjs-zod';
import { CreateCourseContentSchema } from './create-course-content.dto';

export class UpdateCourseContentDto extends createZodDto(
  CreateCourseContentSchema.partial(),
) {}
