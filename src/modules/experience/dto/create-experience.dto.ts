import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JobProfile } from '@prisma/client';
import { zDateOptional } from 'src/common/validation';

export const createExperienceSchema = z.object({
  profile: z.nativeEnum(JobProfile),
  location: z.string(),
  startDate: zDateOptional,
  endDate: zDateOptional,
  description: z.string().optional(),
  isExperience: z.boolean().optional(),
});

export class CreateExperienceDto extends createZodDto(createExperienceSchema) {}
