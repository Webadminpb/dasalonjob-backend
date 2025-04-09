import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createLanguageSchema = z.object({
  name: z.string(),
  fileId: z.string().optional(),
  // proficiency: z.nativeEnum(Proficiency).optional(),
});

export class CreateLanguageDto extends createZodDto(createLanguageSchema) {
  @ApiProperty({ description: 'Hindi' })
  name: string;

  @ApiProperty({ required: false })
  fileId: string;
}
