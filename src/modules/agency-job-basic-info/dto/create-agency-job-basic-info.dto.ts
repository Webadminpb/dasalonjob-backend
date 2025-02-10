import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Gender, JobType, TotalOpening } from '@prisma/client';

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
});

export class CreateAgencyJobBasicInfoDto extends createZodDto(
  AgencyJobBasicInfoSchema,
) {}
