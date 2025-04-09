import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Gender } from '@prisma/client';

export const CreatePartnerPersonalDataSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.date().optional(),
  gender: z.nativeEnum(Gender).optional(),
});

export class CreatePartnerPersonalDataDto extends createZodDto(
  CreatePartnerPersonalDataSchema,
) {
  @ApiPropertyOptional({
    example: 'John',
    description: 'First name of the partner',
  })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the partner',
  })
  lastName?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '1990-01-01T00:00:00.000Z',
    description: 'Date of birth (ISO format)',
  })
  dob?: Date;

  @ApiPropertyOptional({ enum: Gender, description: 'Gender of the partner' })
  gender?: Gender;
}
