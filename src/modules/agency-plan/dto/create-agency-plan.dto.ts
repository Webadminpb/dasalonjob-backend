import { Plan } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AgencyPlanSchema = z.object({
  plan: z.nativeEnum(Plan),
});

export class CreateAgencyPlanDto extends createZodDto(AgencyPlanSchema) {}
