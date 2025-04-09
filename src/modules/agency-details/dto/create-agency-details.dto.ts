import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const AgencyDetailsSchema = z.object({
  businessName: z.string(),
  ownerName: z.string(),
  email: z.string().email(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  fileId: z.string().optional(),
});

export class CreateAgencyDetailsDto extends createZodDto(AgencyDetailsSchema) {
  @ApiProperty({
    description: 'Legal name of the agency',
    example: 'Acme Marketing Inc.',
  })
  businessName: string;

  @ApiProperty({
    description: 'Full name of the agency owner',
    example: 'John Doe',
  })
  ownerName: string;

  @ApiProperty({
    description: 'Official agency email address',
    example: 'contact@acme.com',
  })
  email: string;

  @ApiProperty({
    description: 'Country calling code (e.g., +1)',
    example: '+91',
  })
  phoneCode: string;

  @ApiProperty({
    description: 'Primary contact phone number',
    example: '9876543210',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'ID of uploaded document file (optional)',
    example: '650aa9b2c8d91b1d1a31f4a1',
  })
  fileId?: string;
}
