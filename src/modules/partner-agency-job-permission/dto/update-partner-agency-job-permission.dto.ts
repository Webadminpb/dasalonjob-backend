import { createZodDto } from 'nestjs-zod';
import { PartnerAgencyPermissionSchema } from './create-partner-agency-job-permission.dto';

export class UpdatePartnerAgencyPermissionDto extends createZodDto(
  PartnerAgencyPermissionSchema.partial(),
) {}
