import { createZodDto } from 'nestjs-zod';
import { CreateVenueAmenitiesSchema } from './create-venue-amenity.dto';

export class UpdateVenueAmenityDto extends createZodDto(
  CreateVenueAmenitiesSchema.partial(),
) {}
