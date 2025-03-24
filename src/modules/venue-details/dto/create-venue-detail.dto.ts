import { ApiProperty } from '@nestjs/swagger';
import { BusinessType, Gender } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const VenueDetailsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  zipCode: z.string(),
  franchise: z.string().optional(),
  city: z.string(),
  streetAddress: z.string(),
  businessType: z.array(z.nativeEnum(BusinessType)),
  gender: z.nativeEnum(Gender),
  fileIds: z.array(z.string()).optional(),
  state: z.string().optional(),
  countryId: z.string().optional(),
  latitide: z.string().optional(),
  longitude: z.string().optional(),
});

export class CreateVenueDetailsDto extends createZodDto(VenueDetailsSchema) {
  @ApiProperty({ description: 'The name of the venue', example: 'Venue Bliss' })
  name: string;

  @ApiProperty({
    description: 'The email of the venue',
    example: 'venue@example.com',
  })
  email: string;

  @ApiProperty({ description: 'The phone code', example: '+1' })
  phoneCode: string;

  @ApiProperty({ description: 'The phone number', example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({ description: 'The zip code of the venue', example: '12345' })
  zipCode: string;

  @ApiProperty({ description: 'The city of the venue', example: 'New York' })
  city: string;

  @ApiProperty({
    description: 'The street address of the venue',
    example: '123 Main St',
  })
  streetAddress: string;

  @ApiProperty({
    description: 'The gender type',
    enum: Gender,
    example: Gender.Male,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Array of file IDs (optional)',
    type: [String],
    required: false,
    example: ['file1', 'file2'],
  })
  fileIds?: string[];

  @ApiProperty({ description: 'latitude' })
  latitide: string;
  @ApiProperty({ description: 'longitude' })
  longitude: string;
}
