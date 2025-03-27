import { ApiProperty } from '@nestjs/swagger';
import { HighestEducation, UserExperience } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ExperienceRangeSchema = z.object({
  start: z.number().default(0),
  end: z.number().default(0),
});
export const JobQualificationSchema = z.object({
  education: z.nativeEnum(HighestEducation),
  minExperience: z.nativeEnum(UserExperience),
  certification: z.boolean(),
  isProfessional: z.boolean(),
  languageIds: z.array(z.string()),
  skillIds: z.array(z.string()),
  userId: z.string().optional(),
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
  minExperience: UserExperience;

  @ApiProperty({ example: false })
  certification: boolean;

  @ApiProperty({ example: true })
  isProfessional: boolean;
}
