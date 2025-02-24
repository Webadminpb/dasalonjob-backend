import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateVenueWorkStationSchema = z.object({
  name: z.string(),
});

export class CreateVenueWorkStationDto extends createZodDto(
  CreateVenueWorkStationSchema,
) {}
