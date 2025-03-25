import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createContactDetailsSchema = z.object({
  phoneCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  zipCode: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  streetAddress: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

export class CreateContactDetailsDto extends createZodDto(
  createContactDetailsSchema,
) {}
