import { createZodDto } from 'nestjs-zod';
import { AgencyDetailsSchema } from './create-agency-details.dto';

export class UpdateAgencyDetailsDto extends createZodDto(
  AgencyDetailsSchema.partial(),
) {}
