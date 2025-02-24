import { createZodDto } from 'nestjs-zod';
import { CreateVenueWorkStationSchema } from './create-venue-workstation.dto';

export class UpdateVenueWorkStationDto extends createZodDto(
  CreateVenueWorkStationSchema.partial(),
) {}
