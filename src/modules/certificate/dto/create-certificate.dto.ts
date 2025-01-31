import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const CertificateSchema = z.object({
  certificateName: z.string(),
  certificateId: z.string(),
  instituationName: z.string(),
  description: z.string().optional(),
  isProfessional: z.boolean().optional(),
});

export class CreateCertificateDto extends createZodDto(CertificateSchema) {}
