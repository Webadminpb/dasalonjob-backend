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

export class CreateCountryDto extends createZodDto(CreateCountrySchema) {}
