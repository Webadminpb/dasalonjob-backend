import { createZodDto } from 'nestjs-zod';
import { createLanguageSchema } from './create-language.dto';

export class UpdateLanguageDto extends createZodDto(
  createLanguageSchema.partial(),
) {}
