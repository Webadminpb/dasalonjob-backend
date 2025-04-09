import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
    description: 'Minimum required education level',
  })
  education: HighestEducation;

  @ApiProperty({
    enum: UserExperience,
    example: UserExperience.FIVE_PLUS_YEAR,
    description: 'Minimum experience required',
  })
  minExperience: UserExperience;

  @ApiProperty({
    example: true,
    description: 'Whether certification is required',
  })
  certification: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the role is for professionals only',
  })
  isProfessional: boolean;

  @ApiProperty({
    type: [String],
    example: ['langId1', 'langId2'],
    description: 'IDs of required languages',
  })
  languageIds: string[];

  @ApiProperty({
    type: [String],
    example: ['skillId1', 'skillId2'],
    description: 'IDs of required skills',
  })
  skillIds: string[];

  @ApiPropertyOptional({
    example: 'userId123',
    description: 'ID of the user creating this qualification (optional)',
  })
  userId?: string;
}
