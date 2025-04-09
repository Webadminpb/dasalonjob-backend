import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const AgencyJobDescriptionSchema = z.object({
  description: z.string(),
});

export class CreateAgencyJobDescriptionDto extends createZodDto(
  AgencyJobDescriptionSchema,
) {
  @ApiProperty({
    description: 'Detailed job description',
    example:
      'We are looking for a skilled software engineer to join our team...',
    type: String,
  })
  description: string;
}
