import { Incentive } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AgencyJobBenefitsSchema = z.object({
  benefits: z.array(z.nativeEnum(Incentive)),
});

export class CreateAgencyJobBenefitsDto extends createZodDto(
  AgencyJobBenefitsSchema,
) {}
