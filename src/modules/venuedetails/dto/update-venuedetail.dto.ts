import { createZodDto } from 'nestjs-zod';
import { VenueDetailsSchema } from './create-venuedetail.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class UpdateVenueDetailsDto extends createZodDto(
  VenueDetailsSchema.partial(),
) {
  @ApiProperty({
    description: 'The name of the venue',
    example: 'Venue Bliss',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The email of the venue',
    example: 'venue@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The phone code',
    example: '+1',
    required: false,
  })
  phoneCode?: string;

  @ApiProperty({
    description: 'The phone number',
    example: '1234567890',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'The zip code of the venue',
    example: '12345',
    required: false,
  })
  zipCode?: string;

  @ApiProperty({
    description: 'The city of the venue',
    example: 'New York',
    required: false,
  })
  city?: string;

  @ApiProperty({
    description: 'The street address of the venue',
    example: '123 Main St',
    required: false,
  })
  streetAddress?: string;

  @ApiProperty({
    description: 'The gender type',
    enum: Gender,
    example: Gender.Male,
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    description: 'Array of file IDs (optional)',
    type: [String],
    required: false,
    example: ['file1', 'file2'],
  })
  fileIds?: string[];
}
