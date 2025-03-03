import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobApplicationSchema = z.object({
  jobPostId: z.string(),
  message: z.string().optional(),
});

export class CreateJobApplicationDto extends createZodDto(
  JobApplicationSchema,
) {
  @ApiProperty({
    type: String,
    description: 'ID of the job post being applied to',
  })
  jobPostId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional message from the applicant',
  })
  message?: string;
}
