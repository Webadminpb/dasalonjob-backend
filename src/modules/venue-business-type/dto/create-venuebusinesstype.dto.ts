import { BusinessType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const VenueMainBusinessTypeSchema = z.object({
  businessType: z.nativeEnum(BusinessType),
});

export class CreateVenueMainBusinessTypeDto extends createZodDto(
  VenueMainBusinessTypeSchema,
) {
  @ApiProperty({
    description: 'The type of business',
    enum: BusinessType,
    example: BusinessType.HairSalon,
  })
  businessType: BusinessType;
}
