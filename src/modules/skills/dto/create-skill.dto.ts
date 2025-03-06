import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createSkillsSchema = z.object({
  skills: z.array(z.string()),
});

export class CreateSkillDto extends createZodDto(createSkillsSchema) {
  @ApiProperty({
    isArray: true,
    type: String,
    example: ['JavaScript', 'Node.js', 'TypeScript'],
  })
  skills: string[];
}
