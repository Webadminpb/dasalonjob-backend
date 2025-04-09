import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createApplicantSchema = z.object({
  isEducation: z.boolean().optional(),
  isProfessional: z.boolean().optional(),
  isExperience: z.boolean().optional(),
});

export class CreateApplicantDto extends createZodDto(createApplicantSchema) {
  @ApiPropertyOptional({ type: Boolean, example: true })
  isEducation?: boolean;
  @ApiPropertyOptional({ type: Boolean, example: false })
  isProfessional?: boolean;
  @ApiPropertyOptional({ type: Boolean, example: true })
  isExperience?: boolean;
}
