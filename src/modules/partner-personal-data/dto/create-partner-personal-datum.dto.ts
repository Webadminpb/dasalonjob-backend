import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Gender } from '@prisma/client';

export const CreatePartnerPersonalDataSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.date().optional(),
  gender: z.nativeEnum(Gender).optional(),
});

export class CreatePartnerPersonalDataDto extends createZodDto(
  CreatePartnerPersonalDataSchema,
) {}
