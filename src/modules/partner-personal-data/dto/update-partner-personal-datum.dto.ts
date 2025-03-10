import { createZodDto } from 'nestjs-zod';
import { CreatePartnerPersonalDataSchema } from './create-partner-personal-datum.dto';

export class UpdatePartnerPersonalDataDto extends createZodDto(
  CreatePartnerPersonalDataSchema.partial(),
) {}
