import { Language, Proficiency } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createLanagaugeSchema = z.object({
  language: z.nativeEnum(Language),
  proficiency: z.nativeEnum(Proficiency),
});

export class CreateLangaugeDto extends createZodDto(createLanagaugeSchema) {}
