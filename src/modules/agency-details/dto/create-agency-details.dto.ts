import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AgencyDetailsSchema = z.object({
  businessName: z.string(),
  ownerName: z.string(),
  email: z.string().email(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  fileId: z.string().optional(),
});

export class CreateAgencyDetailsDto extends createZodDto(AgencyDetailsSchema) {}
