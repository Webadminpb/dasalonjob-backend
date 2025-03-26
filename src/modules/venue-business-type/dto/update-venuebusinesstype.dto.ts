import { createZodDto } from 'nestjs-zod';
import { VenueMainBusinessTypeSchema } from './create-venuebusinesstype.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessType } from '@prisma/client';

export class UpdateVenuebusinesstypeDto extends createZodDto(
  VenueMainBusinessTypeSchema.partial(),
) {
  @ApiProperty({
    description: 'The type of business',
    enum: BusinessType,
    example: BusinessType.HairSalon,
    required: false,
  })
  businessType?: BusinessType;
}
