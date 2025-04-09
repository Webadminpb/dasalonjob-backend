import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Gender } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const AgencyPersonalDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.nativeEnum(Gender),
  dob: z.date(),
});

export class CreateAgencyPersonalDetailsDto extends createZodDto(
  AgencyPersonalDetailsSchema,
) {
  @ApiProperty({
    description: "Individual's first name",
    example: 'John',
    minLength: 1,
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: "Individual's last name",
    example: 'Doe',
    minLength: 1,
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description: 'Gender identity',
    enum: Gender,
    example: Gender.Male,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD format)',
    type: 'string',
    format: 'date',
    example: '1990-01-15',
  })
  dob: Date;
}
