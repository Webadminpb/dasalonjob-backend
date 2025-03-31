import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Gender } from '@prisma/client';

export const AgencyPersonalDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.nativeEnum(Gender),
  dob: z.date(),
});

export class CreateAgencyPersonalDetailsDto extends createZodDto(
  AgencyPersonalDetailsSchema,
) {}
