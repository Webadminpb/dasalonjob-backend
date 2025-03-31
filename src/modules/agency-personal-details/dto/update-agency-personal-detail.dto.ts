import { createZodDto } from 'nestjs-zod';
import { AgencyPersonalDetailsSchema } from './create-agency-personal-detail.dto';

export class UpdateAgencyPersonalDetailsDto extends createZodDto(
  AgencyPersonalDetailsSchema.partial(),
) {}
