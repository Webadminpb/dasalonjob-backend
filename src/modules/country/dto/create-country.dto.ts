import { ApiProperty } from '@nestjs/swagger';
import { CountryStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const CreateCountrySchema = z.object({
  name: z.string(),
  code: z.string(),
  currencyName: z.string(),
  currencySymbol: z.string(),
  currencyCode: z.string(),
  pincodeLength: z.number(),
  phoneNumberLength: z.number(),
  status: z.nativeEnum(CountryStatus).optional(),
});

export class CreateCountryDto extends createZodDto(CreateCountrySchema) {
  @ApiProperty({ example: 'India' })
  name: string;

  @ApiProperty({ example: 'IN' })
  code: string;

  @ApiProperty({ example: 'Indian Rupee' })
  currencyName: string;

  @ApiProperty({ example: '₹' })
  currencySymbol: string;

  @ApiProperty({ example: 'INR' })
  currencyCode: string;

  @ApiProperty({ example: 6, description: 'Length of the postal code' })
  pincodeLength: number;

  @ApiProperty({ example: 10, description: 'Length of the phone number' })
  phoneNumberLength: number;

  @ApiProperty({
    enum: CountryStatus,
    example: CountryStatus.ACTIVE,
    required: false,
  })
  status?: CountryStatus;
}
