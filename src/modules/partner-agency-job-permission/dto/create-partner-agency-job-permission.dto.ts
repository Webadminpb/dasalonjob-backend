import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PartnerAgencyPermissionSchema = z.object({
  partnerId: z.string(),
  agencyId: z.string(),
  hasAccess: z.boolean().optional().default(false),
});

export class CreatePartnerAgencyPermissionDto extends createZodDto(
  PartnerAgencyPermissionSchema,
) {}
