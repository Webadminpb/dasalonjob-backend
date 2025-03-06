import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createSkillsSchema = z.object({
  name: z.string(),
});

export class CreateSkillDto extends createZodDto(createSkillsSchema) {
  @ApiProperty({})
  name: string;
}
