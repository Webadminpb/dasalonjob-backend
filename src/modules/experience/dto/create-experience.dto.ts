import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JobProfile } from '@prisma/client';
import { zDateOptional } from 'src/common/utils/validation';

export const createExperienceSchema = z.object({
  profile: z.nativeEnum(JobProfile),
  location: z.string(),
  longitude: z.string(),
  latitude: z.string(),
  startDate: zDateOptional,
  endDate: zDateOptional,
  description: z.string().optional(),
});

export class CreateExperienceDto extends createZodDto(createExperienceSchema) {}
