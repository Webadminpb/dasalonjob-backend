import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobPostSchema = z.object({
  jobBasicInfoId: z.string().optional(),
  jobBenefitsId: z.string().optional(),
  jobQualificationId: z.string().optional(),
  skillId: z.string().optional(),
  jobDescriptionId: z.string().optional(),
  languageIds: z.array(z.string()).optional(),
});

export class CreateJobPostDto extends createZodDto(JobPostSchema) {}
