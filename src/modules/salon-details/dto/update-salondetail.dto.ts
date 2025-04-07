import { createZodDto } from 'nestjs-zod';
import { SalonDetailsSchema } from './create-salondetail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSalonDetailDto extends createZodDto(
  SalonDetailsSchema.partial(),
) {
  @ApiProperty({
    description: 'The name of the business',
    example: 'Salon Bliss',
    required: false,
  })
  businessName?: string;

  @ApiProperty({
    description: 'The name of the owner',
    example: 'John Doe',
    required: false,
  })
  ownerName?: string;

  @ApiProperty({
    description: 'The email of the salon',
    example: 'salon@example.com',
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
    description: 'Whether it is a Dasalon account',
    required: false,
    example: true,
  })
  isDasalonAccount?: boolean;
}
