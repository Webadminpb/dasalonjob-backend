import { Langauge, Proficiency } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createSkillsSchema = z.object({
  skills: z.array(z.string()),
});

export class CreateSkillDto extends createZodDto(createSkillsSchema) {}
