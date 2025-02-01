// create-venue-main-business-type.dto.ts
import { BusinessType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const VenueMainBusinessTypeSchema = z.object({
  businessType: z.nativeEnum(BusinessType),
});

export class CreateVenueMainBusinessTypeDto extends createZodDto(
  VenueMainBusinessTypeSchema,
) {}
