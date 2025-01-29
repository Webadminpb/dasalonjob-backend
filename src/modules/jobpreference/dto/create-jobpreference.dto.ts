import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JoiningAvailability } from '@prisma/client';

export const createJobPreferenceSchema = z.object({
  locations: z.array(z.string()),
  joining: z.nativeEnum(JoiningAvailability),
  salary: z.string(),
});

export class CreateJobpreferenceDto extends createZodDto(
  createJobPreferenceSchema,
) {}
