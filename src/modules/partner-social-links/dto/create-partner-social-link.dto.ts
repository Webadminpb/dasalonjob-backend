import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createPartnerSocialLinksSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export class CreatePartnerSocialLinksDto extends createZodDto(
  createPartnerSocialLinksSchema,
) {}
