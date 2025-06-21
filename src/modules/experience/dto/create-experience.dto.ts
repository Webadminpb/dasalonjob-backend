import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JobProfile } from '@prisma/client';
import { zDateOptional } from 'src/common/utils/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const createExperienceSchema = z.object({
  profileId: z.string().optional(),
  location: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  startDate: zDateOptional,
  endDate: zDateOptional,
  description: z.string().optional(),
  isFresher: z.boolean().optional(),
});

export class CreateExperienceDto extends createZodDto(createExperienceSchema) {
  @ApiProperty({ enum: JobProfile })
  profile: JobProfile;

  @ApiProperty({ example: 'New Delhi, India' })
  location: string;

  @ApiProperty({ example: '77.1025' })
  longitude: string;

  @ApiProperty({ example: '28.7041' })
  latitude: string;

  @ApiPropertyOptional({ example: '2023-01-01' })
  startDate?: any;

  @ApiPropertyOptional({ example: '2024-01-01' })
  endDate?: any;

  @ApiPropertyOptional({
    example: 'Worked on backend development with Node.js',
  })
  description?: string;
}
