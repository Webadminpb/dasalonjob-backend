import { createZodDto } from 'nestjs-zod';
import { CreatePartnerCourseSchema } from './create-partner-course.dto';

export class UpdatePartnerCourseDto extends createZodDto(
  CreatePartnerCourseSchema.partial(),
) {}
