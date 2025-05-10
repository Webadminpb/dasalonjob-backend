import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const agencyContactDetailSchema = z
  .object({
    phoneCode: z.string(),
    phoneNumber: z.string(),
    zipCode: z.string(),
    state: z.string(),
    streetAddress: z.string(),
    longitude: z.string(),
    latitude: z.string(),
  })
  .partial();

export class CreateAgencyContactDetailDto extends createZodDto(
  agencyContactDetailSchema,
) {}

export class UpdateAgencyContactDetailDto extends createZodDto(
  agencyContactDetailSchema.partial(),
) {}
