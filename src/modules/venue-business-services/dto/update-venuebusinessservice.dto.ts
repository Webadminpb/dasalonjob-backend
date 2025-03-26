import { createZodDto } from 'nestjs-zod';
import { VenueMainBusinessServicesSchema } from './create-venuebusinessservice.dto';

export class UpdateVenueMainBusinessServicesDto extends createZodDto(
  VenueMainBusinessServicesSchema.partial(),
) {}
