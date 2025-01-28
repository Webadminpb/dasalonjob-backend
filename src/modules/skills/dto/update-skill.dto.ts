import { createZodDto } from 'nestjs-zod';
import { createSkillsSchema } from './create-skill.dto';

export class UpdateSkillDto extends createZodDto(
  createSkillsSchema.partial(),
) {}
