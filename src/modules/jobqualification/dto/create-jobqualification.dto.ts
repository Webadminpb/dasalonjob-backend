import { ApiProperty } from '@nestjs/swagger';
import { ExperienceRange, HighestEducation } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ExperienceRangeSchema = z.object({
  start: z.number().default(0),
  end: z.number().default(0),
});
export const JobQualificationSchema = z.object({
  education: z.nativeEnum(HighestEducation),
  minExperience: ExperienceRangeSchema,
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
  minExperience: ExperienceRange;

  @ApiProperty({ example: false })
  certification: boolean;

  @ApiProperty({ example: true })
  isProfessional: boolean;
}
