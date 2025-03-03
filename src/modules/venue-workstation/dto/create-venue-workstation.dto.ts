import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateVenueWorkStationSchema = z.object({
  name: z.string(),
});

export class CreateVenueWorkStationDto extends createZodDto(
  CreateVenueWorkStationSchema,
) {
  @ApiProperty({ type: String, description: 'Name of the venue workstation' })
  name: string;
}
