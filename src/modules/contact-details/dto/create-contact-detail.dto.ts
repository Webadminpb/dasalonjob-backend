import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const createContactDetailsSchema = z.object({
  phoneCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  zipCode: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  streetAddress: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  email: z.string().optional(),
});

export class CreateContactDetailsDto extends createZodDto(
  createContactDetailsSchema,
) {
  @ApiPropertyOptional({ example: '+91', description: 'Phone country code' })
  phoneCode?: string;

  @ApiPropertyOptional({ example: '9876543210', description: 'Phone number' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '110001', description: 'ZIP or postal code' })
  zipCode?: string;

  @ApiPropertyOptional({ example: 'Haryana' })
  state?: string;

  @ApiPropertyOptional({ example: 'Hisar' })
  city?: string;

  @ApiPropertyOptional({ example: 'Sainiyan Mohalla, Lane 2' })
  streetAddress?: string;

  @ApiPropertyOptional({
    example: '75.7578',
    description: 'Longitude coordinate',
  })
  longitude?: string;

  @ApiPropertyOptional({
    example: '28.3636',
    description: 'Latitude coordinate',
  })
  latitude?: string;
}
