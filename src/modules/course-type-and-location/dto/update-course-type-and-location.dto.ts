import { createZodDto } from 'nestjs-zod';
import { CreateCourseTypeAndLocationSchema } from './create-course-type-and-location.dto';

export class UpdateCourseTypeAndLocationDto extends createZodDto(
  CreateCourseTypeAndLocationSchema.partial(),
) {}
