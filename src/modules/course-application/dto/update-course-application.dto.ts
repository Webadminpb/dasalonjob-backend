import { createZodDto } from 'nestjs-zod';
import { CreateCourseApplicationSchema } from './create-course-application.dto';

export class UpdateCourseApplicationDto extends createZodDto(
  CreateCourseApplicationSchema,
) {}
