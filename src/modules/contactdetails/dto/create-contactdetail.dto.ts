import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createContactDetailsSchema = z.object({
  phoneCode: z.string().min(1, { message: 'Phone code is required' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
  zipCode: z.string().min(1, { message: 'Zip code is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  streetAddress: z.string().min(1, { message: 'Street address is required' }),
});

export class CreateContactDetailsDto extends createZodDto(
  createContactDetailsSchema,
) {}
