import { ApiProperty } from '@nestjs/swagger';
import { HighestEducation } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobQualificationSchema = z.object({
  education: z.nativeEnum(HighestEducation),
  minExperience: z.boolean(),
  certification: z.boolean(),
  isProfessional: z.boolean(),
  languageIds: z.array(z.string()),
  skillIds: z.array(z.string()),
});

export class CreateJobQualificationDto extends createZodDto(
  JobQualificationSchema,
) {
  @ApiProperty({
    enum: HighestEducation,
    example: HighestEducation.Certificate,
  })
  education: HighestEducation;

  @ApiProperty({ example: true })
  minExperience: boolean;

  @ApiProperty({ example: false })
  certification: boolean;

  @ApiProperty({ example: true })
  isProfessional: boolean;
}
