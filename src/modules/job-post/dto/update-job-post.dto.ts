import { PartialType } from '@nestjs/swagger';
import { CreateJobPostDto, JobPostSchema } from './create-job-post.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateJobPostDto extends createZodDto(JobPostSchema.partial()) {}
