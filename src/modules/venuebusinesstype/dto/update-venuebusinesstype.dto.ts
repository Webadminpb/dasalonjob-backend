import { PartialType } from '@nestjs/mapped-types';
import { VenueMainBusinessTypeSchema } from './create-venuebusinesstype.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateVenuebusinesstypeDto extends createZodDto(
  VenueMainBusinessTypeSchema.partial(),
) {}
