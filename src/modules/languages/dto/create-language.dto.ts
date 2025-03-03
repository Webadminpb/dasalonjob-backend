import { ApiProperty } from '@nestjs/swagger';
import { Language, Proficiency } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createLanguageSchema = z.object({
  language: z.nativeEnum(Language),
  proficiency: z.nativeEnum(Proficiency).optional(),
});

export class CreateLanguageDto extends createZodDto(createLanguageSchema) {
  @ApiProperty({ enum: Language, description: 'Language being added' })
  language: Language;

  @ApiProperty({
    enum: Proficiency,
    required: false,
    description: 'Proficiency level',
  })
  proficiency?: Proficiency;
}
