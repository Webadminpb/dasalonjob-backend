import { JobApplicationStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StatusJobApplicationSchema = z.object({
  status: z.nativeEnum(JobApplicationStatus),
});

export class StatusJobApplicationDto extends createZodDto(
  StatusJobApplicationSchema,
) {}
