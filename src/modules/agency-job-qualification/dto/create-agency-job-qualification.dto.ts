import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { HighestEducation } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const AgencyJobQualificationSchema = z.object({
  education: z.nativeEnum(HighestEducation),
  minExperience: z.boolean(),
  certification: z.boolean(),
  isProfessional: z.boolean(),
});

export class CreateAgencyJobQualificationDto extends createZodDto(
  AgencyJobQualificationSchema,
) {
  @ApiProperty({
    description: 'Required highest education level',
    enum: HighestEducation,
    example: HighestEducation.Certificate,
  })
  education: HighestEducation;

  @ApiProperty({
    description: 'Whether minimum experience is required',
    example: true,
    type: Boolean,
  })
  minExperience: boolean;

  @ApiProperty({
    description: 'Whether certification is required',
    example: false,
    type: Boolean,
  })
  certification: boolean;

  @ApiProperty({
    description: 'Whether professional qualification is required',
    example: true,
    type: Boolean,
  })
  isProfessional: boolean;
}
