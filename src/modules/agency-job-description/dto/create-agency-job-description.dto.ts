import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AgencyJobDescriptionSchema = z.object({
  description: z.string(),
});

export class CreateAgencyJobDescriptionDto extends createZodDto(
  AgencyJobDescriptionSchema,
) {}
