import { ApiProperty } from '@nestjs/swagger';
import { Gender, JobBasicInfoProfileType, JobType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const SalaryRangeSchema = z.object({
  start: z.number().default(0),
  end: z.number().default(0),
});

export const JobBasicInfoSchema = z.object({
  title: z.string(),
  venueId: z.string(),
  profile: z.nativeEnum(JobBasicInfoProfileType),
  jobType: z.nativeEnum(JobType),
  totalOpening: z.number().default(1),
  gender: z.nativeEnum(Gender),
  salaryRange: SalaryRangeSchema,
  deadline: zDateOptional,
  userId: z.string().optional(),
});

export class CreateJobBasicInfoDto extends createZodDto(JobBasicInfoSchema) {
  @ApiProperty({ example: 'Software Engineer' })
  title: string;

  @ApiProperty({
    enum: JobBasicInfoProfileType,
    example: JobBasicInfoProfileType.HairStyling,
  })
  profile: JobBasicInfoProfileType;

  @ApiProperty({ enum: JobType, example: JobType.FullTime })
  jobType: JobType;

  @ApiProperty({ example: 5 })
  totalOpening: number;

  @ApiProperty({ enum: Gender, example: Gender.Male })
  gender: Gender;

  @ApiProperty({
    type: () => SalaryRangeSchema,
    example: { start: 30000, end: 60000 },
  })
  salaryRange: { start: number; end: number };

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', required: false })
  deadline?: Date;

  @ApiProperty({ example: '', required: false })
  userId?: string;
}
