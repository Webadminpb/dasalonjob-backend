import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreditType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateSpendCreditSchema = z.object({
  creditType: z.nativeEnum(CreditType),
  applicationData: z.object({
    jobApplicationId: z.string().optional(),
    courseApplicationId: z.string().optional(),
  }),
});
export class ApplicationDataDto {
  @ApiPropertyOptional({
    description: 'Job application ID (if applicable)',
    example: 'job_123456',
  })
  jobApplicationId?: string;

  @ApiPropertyOptional({
    description: 'Course application ID (if applicable)',
    example: 'course_654321',
  })
  courseApplicationId?: string;
}

export class CreateSpendCreditDto extends createZodDto(
  CreateSpendCreditSchema,
) {
  @ApiProperty({ enum: CreditType, description: 'Type of credit being spent' })
  creditType: CreditType;

  @ApiProperty({
    type: ApplicationDataDto,
    description: 'Data for credit usage',
  })
  applicationData: ApplicationDataDto;
}
