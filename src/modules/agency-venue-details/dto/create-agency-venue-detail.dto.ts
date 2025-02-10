import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Gender, JobProfile, Role } from '@prisma/client';

export const AgencyVenueDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  gender: z.nativeEnum(Gender),
  jobRole: z.nativeEnum(JobProfile),
  fileId: z.string().optional(),
});

export class CreateAgencyVenueDetailsDto extends createZodDto(
  AgencyVenueDetailsSchema,
) {}
