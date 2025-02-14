import { Gender, JobType, TotalOpening } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const SalaryRangeSchema = z.object({
  start: z.number().default(0),
  end: z.number().default(0),
});

export const JobBasicInfoSchema = z.object({
  title: z.string(),
  profile: z.string(),
  jobType: z.nativeEnum(JobType),
  totalOpening: z.number().default(1),
  gender: z.nativeEnum(Gender),
  salaryRange: SalaryRangeSchema,
  deadline: zDateOptional,
});

export class CreateJobBasicInfoDto extends createZodDto(JobBasicInfoSchema) {}
