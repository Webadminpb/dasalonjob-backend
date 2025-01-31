import { PartialType } from '@nestjs/mapped-types';
import {
  CertificateSchema,
  CreateCertificateDto,
} from './create-certificate.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateCertificateDto extends createZodDto(
  CertificateSchema.partial(),
) {}
