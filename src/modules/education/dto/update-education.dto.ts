import { createZodDto } from 'nestjs-zod';
import { createEducationSchema } from './create-education.dto';

export class UpdateEducationDto extends createZodDto(
  createEducationSchema.partial(),
) {}
