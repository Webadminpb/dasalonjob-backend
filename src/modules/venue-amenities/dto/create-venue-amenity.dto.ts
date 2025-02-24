import { Amenities } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateVenueAmenitiesSchema = z.object({
  amenities: z.nativeEnum(Amenities),
});

export class CreateVenueAmenitiesDto extends createZodDto(
  CreateVenueAmenitiesSchema,
) {}
