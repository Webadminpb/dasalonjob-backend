import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
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
) {
  @ApiProperty({
    type: () => Object,
    example: {
      monday: {
        isActive: true,
        from: '2024-01-01T10:00:00.000Z',
        to: '2024-01-01T18:00:00.000Z',
        offPeakFrom: '2024-01-01T14:00:00.000Z',
        offPeakTo: '2024-01-01T16:00:00.000Z',
      },
      tuesday: { isActive: false },
      wednesday: { isActive: false },
      thursday: { isActive: false },
      friday: { isActive: false },
      saturday: { isActive: false },
      sunday: { isActive: false },
    },
    description: 'Each day object defines availability and off-peak times.',
  })
  days: any; // Swagger doc ke liye override kiya gaya. Zod validation actual schema se ho raha hai.
}
