import { ApiProperty } from '@nestjs/swagger';
import { AdditionalServices } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AdditionalServicesSchema = z.nativeEnum(AdditionalServices);

export const VenueMainBusinessServicesSchema = z.object({
  services: z.array(AdditionalServicesSchema),
});

export class CreateVenueMainBusinessServicesDto extends createZodDto(
  VenueMainBusinessServicesSchema,
) {
  @ApiProperty({
    description: 'List of additional services',
    enum: AdditionalServices,
    isArray: true,
  })
  services: AdditionalServices[];
}
