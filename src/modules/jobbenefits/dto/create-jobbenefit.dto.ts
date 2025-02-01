import { createZodDto } from 'nestjs-zod';
import { Incentive } from '@prisma/client';
import { z } from 'zod';

export const IncentiveSchema = z.nativeEnum(Incentive);

export const JobBenefitsSchema = z.object({
  benefits: z.array(IncentiveSchema),
});

export class CreateJobBenefitsDto extends createZodDto(JobBenefitsSchema) {}
