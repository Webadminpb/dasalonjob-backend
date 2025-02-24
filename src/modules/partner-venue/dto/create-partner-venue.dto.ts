import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePartnerVenueSchema = z.object({
  venueBasicDetailsId: z.string(),
  salonBasicDetailsId: z.string(),
  venueAmenityIds: z.string(),
  venueWorkStationId: z.string(),
  userId: z.string(),
});

export class CreatePartnerVenueDto extends createZodDto(
  CreatePartnerVenueSchema,
) {}
