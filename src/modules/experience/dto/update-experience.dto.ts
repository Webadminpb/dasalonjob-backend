import { createZodDto } from 'nestjs-zod';
import { createExperienceSchema } from './create-experience.dto';

export class UpdateExperienceDto extends createZodDto(
  createExperienceSchema.partial(),
) {}
