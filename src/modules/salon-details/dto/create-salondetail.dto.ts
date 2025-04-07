import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const SalonDetailsSchema = z.object({
  businessName: z.string(),
  ownerName: z.string(),
  email: z.string().email(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  isDasalonAccount: z.boolean().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fileIds: z.array(z.string()).optional(),
  dob: zDateOptional,
  gender: z.nativeEnum(Gender).optional(),
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

  @ApiProperty({ description: 'The Firstname optional', example: 'sahil' })
  firstName: string;

  @ApiProperty({ description: 'The lastname optional', example: 'jaggarwal' })
  lastName: string;

  @ApiProperty({ description: 'fileIds optional', example: '' })
  fileIds: string[];

  @ApiProperty({ description: 'date', example: 'sahil' })
  dob: Date;

  @ApiProperty({ description: 'date', example: 'Male' })
  gender: Gender;
}
