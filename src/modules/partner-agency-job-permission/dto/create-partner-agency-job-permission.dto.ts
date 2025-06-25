import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PartnerAgencyPermissionSchema = z.object({
  partnerId: z.string(),
  agencyId: z.string(),
  requestedBy: z.enum(['PARTNER', 'AGENCY']),
  approvedBy: z.enum(['PARTNER', 'AGENCY']).optional(),
  approvedAt: z.string().datetime().optional(),
  partnerHasAccess: z.boolean().optional().default(false),
  agencyHasAccess: z.boolean().optional().default(false),
});

export class CreatePartnerAgencyPermissionDto extends createZodDto(
  PartnerAgencyPermissionSchema,
) {
  @ApiProperty({
    example: 'partner_abc123',
    description: 'The ID of the partner',
  })
  partnerId: string;

  @ApiProperty({
    example: 'agency_xyz456',
    description: 'The ID of the agency',
  })
  agencyId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the agency has access to the partner’s resources',
    default: false,
  })
  hasAccess?: boolean;
}
