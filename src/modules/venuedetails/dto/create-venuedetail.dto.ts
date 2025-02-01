import { Gender } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const VenueDetailsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  zipCode: z.string(),
  city: z.string(),
  streetAddress: z.string(),
  gender: z.nativeEnum(Gender),
  fileIds: z.array(z.string()).optional(),
});

export class CreateVenueDetailsDto extends createZodDto(VenueDetailsSchema) {}
