import { PartialType } from '@nestjs/mapped-types';
import { AgencyJobBasicInfoSchema } from './create-agency-job-basic-info.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateAgencyJobBasicInfoDto extends createZodDto(
  AgencyJobBasicInfoSchema.partial(),
) {}
