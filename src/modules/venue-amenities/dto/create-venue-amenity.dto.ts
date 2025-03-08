import { ApiProperty } from '@nestjs/swagger';
import { Amenities } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateVenueAmenitiesSchema = z.object({
  amenities: z.array(z.nativeEnum(Amenities)),
});

export class CreateVenueAmenitiesDto extends createZodDto(
  CreateVenueAmenitiesSchema,
) {
  @ApiProperty({
    enum: [Amenities],
    description: 'Type of amenity available at the venue',
  })
  amenities: Amenities[];
}
