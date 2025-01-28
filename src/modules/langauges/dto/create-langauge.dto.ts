import { Langauge, Proficiency } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createLanagaugeSchema = z.object({
  langauge: z.nativeEnum(Langauge),
  proficiency: z.nativeEnum(Proficiency),
});

export class CreateLangaugeDto extends createZodDto(createLanagaugeSchema) {}
