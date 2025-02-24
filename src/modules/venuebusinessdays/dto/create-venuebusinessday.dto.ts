import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const DaySchema = z.object({
  isActive: z.boolean().default(false),
  from: zDateOptional.optional(),
  to: zDateOptional.optional(),
  offPeakFrom: zDateOptional.optional(),
  offPeakTo: zDateOptional.optional(),
});

export const DaysSchema = z.object({
  monday: DaySchema,
  tuesday: DaySchema,
  wednesday: DaySchema,
  thursday: DaySchema,
  friday: DaySchema,
  saturday: DaySchema,
  sunday: DaySchema,
});

export const VenueMainBusinessDaysSchema = z.object({
  days: DaysSchema,
});

export class CreateVenueMainBusinessDaysDto extends createZodDto(
  VenueMainBusinessDaysSchema,
) {}
