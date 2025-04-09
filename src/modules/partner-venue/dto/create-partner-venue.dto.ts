import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePartnerVenueSchema = z.object({
  venueBasicDetailsId: z.string(),
  salonBasicDetailsId: z.string(),
  venueAmenityIds: z.string(),
  venueWorkStationIds: z.array(z.string()),
  venueMainBusinessDaysId: z.string(),
});

export class CreatePartnerVenueDto extends createZodDto(
  CreatePartnerVenueSchema,
) {
  @ApiProperty({ type: String, description: 'ID of the venue basic details' })
  venueBasicDetailsId: string;

  @ApiProperty({ type: String, description: 'ID of the salon basic details' })
  salonBasicDetailsId: string;

  @ApiProperty({ type: String, description: 'ID of the venue amenities' })
  venueAmenityIds: string;

  @ApiProperty({ type: [String], description: 'ID of the venue workstation' })
  venueWorkStationIds: string[];

  @ApiProperty({
    type: String,
    description: 'ID of the venue main business days',
  })
  venueMainBusinessDaysId: string;

  // @ApiProperty({ type: String, description: 'ID of the user' })
  // userId: string;
}
