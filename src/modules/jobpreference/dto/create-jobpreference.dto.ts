import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JoiningAvailability } from '@prisma/client';

export const SalaryRangeSchema = z.object({
  start: z.number().default(0),
  end: z.number().default(0),
});

export const createJobPreferenceSchema = z.object({
  locations: z.array(z.string()),
  joining: z.nativeEnum(JoiningAvailability),
  salary: SalaryRangeSchema,
  skillsIds: z.string().optional(),
});

export class CreateJobpreferenceDto extends createZodDto(
  createJobPreferenceSchema,
) {}
