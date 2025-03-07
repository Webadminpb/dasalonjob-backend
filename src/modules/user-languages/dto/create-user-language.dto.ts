import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Proficiency } from '@prisma/client';

export const createUserLanguageSchema = z.object({
  languageId: z.string(),
  proficiency: z.nativeEnum(Proficiency).optional(),
});

export class CreateUserLanguageDto extends createZodDto(
  createUserLanguageSchema,
) {
  @ApiProperty({ description: 'Language ID' })
  languageId: string;

  @ApiProperty({
    description: 'Proficiency level',
    enum: Proficiency,
    required: false,
  })
  proficiency?: Proficiency;
}
