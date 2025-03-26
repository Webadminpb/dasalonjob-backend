import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateWhatsAppGroupSchema = z.object({
  name: z.string(),
  link: z.string(),
  city: z.string(),
  description: z.string().optional(),
});

export class CreateWhatsappGroupDto extends createZodDto(
  CreateWhatsAppGroupSchema,
) {}
