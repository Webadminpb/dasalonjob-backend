import { ApiProperty } from '@nestjs/swagger';
import { JobPostStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobPostSchema = z.object({
  jobBasicInfoId: z.string().optional(),
  jobBenefitsId: z.string().optional(),
  jobQualificationId: z.string().optional(),
  skillIds: z.array(z.string()).optional(),
  jobDescriptionId: z.string().optional(),
  languageIds: z.array(z.string()).optional(),
  status: z.nativeEnum(JobPostStatus).optional(),
  countryId: z.string().optional(),
  venueId: z.string().optional(),
  userId: z.string().optional(),
  isOpen: z.boolean().optional(),
});

export class CreateJobPostDto extends createZodDto(JobPostSchema) {
  @ApiProperty({
    description: 'Job Basic Info ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  jobBasicInfoId?: string;

  @ApiProperty({
    description: 'Job Benefits ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  jobBenefitsId?: string;

  @ApiProperty({
    description: 'Job Qualification ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  jobQualificationId?: string;

  @ApiProperty({
    description: 'Skill ID',
    example: '123e4567-e89b-12d3-a456-426614174003',
    required: false,
  })
  skillIds?: string[];

  @ApiProperty({
    description: 'Job Description ID',
    example: '123e4567-e89b-12d3-a456-426614174004',
    required: false,
  })
  jobDescriptionId?: string;

  @ApiProperty({
    description: 'Language IDs',
    example: ['en', 'fr'],
    required: false,
    isArray: true,
  })
  languageIds?: string[];

  @ApiProperty({
    description: 'Job post status',
    enum: JobPostStatus,
    required: false,
  })
  status?: JobPostStatus;

  @ApiProperty({
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174005',
    required: false,
  })
  countryId?: string;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({
    description: 'Is job post open',
    example: true,
    required: false,
  })
  isOpen?: boolean;
}
