import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createPastWorkSchema = z.object({
  videoLink: z.array(z.string()),
  fileIds: z.array(z.string()),
});

export class CreatePastworkDto extends createZodDto(createPastWorkSchema) {}
