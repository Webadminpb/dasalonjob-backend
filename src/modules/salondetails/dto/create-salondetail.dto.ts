import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SalonDetailsSchema = z.object({
  businessName: z.string(),
  ownerName: z.string(),
  email: z.string().email(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  isDasalonAccount: z.boolean().optional(),
});

export class CreateSalonDetailsDto extends createZodDto(SalonDetailsSchema) {
  @ApiProperty({
    description: 'The name of the business',
    example: 'Salon Bliss',
  })
  businessName: string;

  @ApiProperty({ description: 'The name of the owner', example: 'John Doe' })
  ownerName: string;

  @ApiProperty({
    description: 'The email of the salon',
    example: 'salon@example.com',
  })
  email: string;

  @ApiProperty({ description: 'The phone code', example: '+1' })
  phoneCode: string;

  @ApiProperty({ description: 'The phone number', example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Whether it is a Dasalon account',
    required: false,
    example: true,
  })
  isDasalonAccount?: boolean;
}
