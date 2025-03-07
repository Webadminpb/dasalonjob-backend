import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createLanguageSchema = z.object({
  name: z.string(),
  // proficiency: z.nativeEnum(Proficiency).optional(),
});

export class CreateLanguageDto extends createZodDto(createLanguageSchema) {
  @ApiProperty({ description: 'Hindi' })
  name: string;
}
