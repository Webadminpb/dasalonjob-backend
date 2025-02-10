import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { HighestEducation } from '@prisma/client';

export const AgencyJobQualificationSchema = z.object({
  education: z.nativeEnum(HighestEducation),
  minExperience: z.boolean(),
  certification: z.boolean(),
  isProfessional: z.boolean(),
});

export class CreateAgencyJobQualificationDto extends createZodDto(
  AgencyJobQualificationSchema,
) {}
