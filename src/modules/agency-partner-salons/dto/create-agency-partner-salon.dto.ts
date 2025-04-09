import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AgencyJobQualificationSchema = z.object({
  partnerIds: z.array(z.string()),
});

export class CreateAgencyPartnerSalonDto extends createZodDto(
  AgencyJobQualificationSchema,
) {
  @ApiProperty({
    description: 'Array of partner IDs associated with the salon',
    type: [String],
    example: ['partner-id-1', 'partner-id-2', 'partner-id-3'],
  })
  partnerIds: string[];
}
