import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { HighestEducation } from '@prisma/client';

export const AgencyJobQualificationSchema = z.object({
  partnerIds: z.array(z.string()),
});

export class CreateAgencyPartnerSalonDto extends createZodDto(
  AgencyJobQualificationSchema,
) {}
