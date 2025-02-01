import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SalonDetailsSchema = z.object({
  businessName: z.string(),
  ownerName: z.string(),
  email: z.string().email(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  isDasalonAccount: z.boolean().optional(),
});

export class CreateSalonDetailsDto extends createZodDto(SalonDetailsSchema) {}
