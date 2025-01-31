import { createZodDto } from 'nestjs-zod';
import { createLanagaugeSchema } from './create-langauge.dto';

export class UpdateLangaugeDto extends createZodDto(
  createLanagaugeSchema.partial(),
) {}
