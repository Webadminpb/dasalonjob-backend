import { createZodDto } from 'nestjs-zod';
import { createUserLanguageSchema } from './create-user-language.dto';

export class UpdateUserLanguageDto extends createZodDto(
  createUserLanguageSchema.partial(),
) {}
