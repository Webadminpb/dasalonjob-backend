import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FeaturedJobSchema = z.object({
  jobPostId: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  priority: z.number().int().min(1).max(10).optional(),
  isActive: z.boolean().optional(),
});

export class CreateFeaturedJobDto extends createZodDto(FeaturedJobSchema) {
  @ApiProperty({
    example: 'job_12345',
    description: 'The ID of the job post to feature',
  })
  jobPostId: string;

  @ApiProperty({
    example: '2025-12-31T23:59:59.999Z',
    description: 'End date for featuring the job',
  })
  endDate: string;

  @ApiPropertyOptional({
    example: 5,
    description:
      'Priority level of the featured job (1-10). Higher means more visible.',
  })
  priority?: number;
}
