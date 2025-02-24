import { createZodDto } from 'nestjs-zod';
import { CreatePartnerVenueSchema } from './create-partner-venue.dto';

export class UpdatePartnerVenueDto extends createZodDto(
  CreatePartnerVenueSchema.partial(),
) {}
