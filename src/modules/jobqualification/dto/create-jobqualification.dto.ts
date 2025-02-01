import { HighestEducation } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobQualificationSchema = z.object({
  education: z.nativeEnum(HighestEducation),
  minExperience: z.boolean(),
  certification: z.boolean(),
  isProfessional: z.boolean(),
});

export class CreateJobQualificationDto extends createZodDto(
  JobQualificationSchema,
) {}
