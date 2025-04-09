import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, JobType, TotalOpening } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SalaryRangeSchema = z.object({
  start: z.number().int().min(0).default(0),
  end: z.number().int().min(0).default(0),
});

export const AgencyJobBasicInfoSchema = z.object({
  title: z.string(),
  profile: z.string(),
  jobType: z.nativeEnum(JobType),
  totalOpening: z.nativeEnum(TotalOpening),
  gender: z.nativeEnum(Gender),
  salaryRange: SalaryRangeSchema,
  deadline: z.date(),
  partnerIds: z.array(z.string()).optional(),
});

export class CreateAgencyJobBasicInfoDto extends createZodDto(
  AgencyJobBasicInfoSchema,
) {
  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
  })
  title: string;

  @ApiProperty({
    description: 'Job profile/description',
    example: 'Develop and maintain web applications using NestJS',
  })
  profile: string;

  @ApiProperty({
    description: 'Type of employment',
    enum: JobType,
    example: JobType.Freelance,
  })
  jobType: JobType;

  @ApiProperty({
    description: 'Number of open positions',
    enum: TotalOpening,
    example: TotalOpening.One,
  })
  totalOpening: TotalOpening;

  @ApiProperty({
    description: 'Gender preference',
    enum: Gender,
    example: Gender.Male,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Salary range for the position',
    type: 'object',
    example: { start: 50000, end: 80000 },
  })
  salaryRange: { start: number; end: number };

  @ApiProperty({
    description: 'Application deadline',
    type: 'string',
    format: 'date-time',
    example: '2023-12-31T00:00:00Z',
  })
  deadline: Date;

  @ApiPropertyOptional({
    description: 'Associated partner IDs',
    type: [String],
    example: ['partner-id-1', 'partner-id-2'],
    required: false,
  })
  partnerIds?: string[];
}
