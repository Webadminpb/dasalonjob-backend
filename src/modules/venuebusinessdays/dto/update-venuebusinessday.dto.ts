import { createZodDto } from 'nestjs-zod';
import { VenueMainBusinessDaysSchema } from './create-venuebusinessday.dto';

export class UpdateVenueMainBusinessDaysDto extends createZodDto(
  VenueMainBusinessDaysSchema.partial(),
) {}
