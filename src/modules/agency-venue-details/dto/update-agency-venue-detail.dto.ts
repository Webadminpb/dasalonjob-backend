import { PartialType } from '@nestjs/mapped-types';
import { AgencyVenueDetailsSchema } from './create-agency-venue-detail.dto';
import { createZodDto } from 'nestjs-zod';
export class UpdateAgencyVenueDetailsDto extends createZodDto(
  AgencyVenueDetailsSchema.partial(),
) {}
