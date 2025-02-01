import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DaysSchema = z.object({
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
  sunday: z.boolean(),
});

export const VenueMainBusinessDaysSchema = z.object({
  days: DaysSchema,
});

export class CreateVenueMainBusinessDaysDto extends createZodDto(
  VenueMainBusinessDaysSchema,
) {}
