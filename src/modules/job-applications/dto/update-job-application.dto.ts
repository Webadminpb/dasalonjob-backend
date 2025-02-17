import { PartialType } from '@nestjs/swagger';
import {
  CreateJobApplicationDto,
  JobApplicationSchema,
} from './create-job-application.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateJobApplicationDto extends createZodDto(
  JobApplicationSchema.partial(),
) {}
