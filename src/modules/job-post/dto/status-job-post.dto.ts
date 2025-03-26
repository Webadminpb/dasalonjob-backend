import { ApiProperty } from '@nestjs/swagger';
import { JobPostStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(JobPostStatus),
});

export class CreateJobStatusDto extends createZodDto(JobStatusSchema) {}
