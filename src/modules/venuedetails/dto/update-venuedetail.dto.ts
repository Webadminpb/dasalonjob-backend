// update-venue-details.dto.ts
import { createZodDto } from 'nestjs-zod';
import { VenueDetailsSchema } from './create-venuedetail.dto';

export class UpdateVenueDetailsDto extends createZodDto(
  VenueDetailsSchema.partial(),
) {}
