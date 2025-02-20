import { createZodDto } from 'nestjs-zod';
import { createPartnerSocialLinksSchema } from './create-partner-social-link.dto';

export class UpdatePartnerSocialLinksDto extends createZodDto(
  createPartnerSocialLinksSchema.partial(),
) {}
