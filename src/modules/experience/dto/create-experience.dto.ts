import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JobProfile } from '@prisma/client';
import { zDateOptional } from 'src/common/utils/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const createExperienceSchema = z.object({
  profile: z.nativeEnum(JobProfile),
  location: z.string(),
  longitude: z.string(),
  latitude: z.string(),
  startDate: zDateOptional,
  endDate: zDateOptional,
  description: z.string().optional(),
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
