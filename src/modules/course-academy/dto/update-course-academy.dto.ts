import { createZodDto } from 'nestjs-zod';
import { CreateCourseAcademySchema } from './create-course-academy.dto';

export class UpdateCourseAcademyDto extends createZodDto(
  CreateCourseAcademySchema.partial(),
) {}
