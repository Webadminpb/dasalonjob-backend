import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createPartnerSocialLinksSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export class CreatePartnerSocialLinksDto extends createZodDto(
  createPartnerSocialLinksSchema,
) {
  @ApiPropertyOptional({
    example: 'https://facebook.com/partner',
    description: 'Facebook profile link',
  })
  facebook?: string;

  @ApiPropertyOptional({
    example: 'https://instagram.com/partner',
    description: 'Instagram profile link',
  })
  instagram?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/partner',
    description: 'LinkedIn profile link',
  })
  linkedin?: string;

  @ApiPropertyOptional({
    example: 'https://partnerwebsite.com',
    description: 'Official website link',
  })
  website?: string;
}
