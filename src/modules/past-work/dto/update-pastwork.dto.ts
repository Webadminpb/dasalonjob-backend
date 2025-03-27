import { createZodDto } from 'nestjs-zod';
import { createPastWorkSchema } from './create-pastwork.dto';

export class UpdatePastworkDto extends createZodDto(
  createPastWorkSchema.partial(),
) {}
