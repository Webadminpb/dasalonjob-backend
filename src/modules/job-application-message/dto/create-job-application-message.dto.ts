import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const createJobApplicationMessageSchema = z.object({
  applicantId: z.string(),
  jobApplicationId: z.string(),
  message: z.string(),
});

export class CreateJobApplicationMessageDto extends createZodDto(
  createJobApplicationMessageSchema,
) {
  @ApiProperty({ type: String, description: 'ID of the applicant' })
  applicantId: string;

  @ApiProperty({ type: String, description: 'ID of the job application' })
  jobApplicationId: string;

  @ApiProperty({ type: String, description: 'Message content', maxLength: 500 })
  message: string;
}
