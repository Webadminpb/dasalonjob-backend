import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCreditPlanSchema = z.object({
  totalJobs: z.number(),
  totalCourses: z.number(),
  price: z.number(),
  isRecommended: z.boolean().optional(),
});

export class CreateCreditPlanDto extends createZodDto(CreateCreditPlanSchema) {
  @ApiProperty({
    description: 'Total number of jobs allowed in the plan',
    example: 10,
  })
  totalJobs: number;

  @ApiProperty({
    description: 'Total number of courses allowed in the plan',
    example: 5,
  })
  totalCourses: number;

  @ApiProperty({ description: 'Price of the credit plan in INR', example: 999 })
  price: number;

  @ApiPropertyOptional({
    description: 'Flag to mark this plan as recommended',
    example: true,
  })
  isRecommended?: boolean;
}
