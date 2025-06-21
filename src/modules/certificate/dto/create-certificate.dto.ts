import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const CertificateSchema = z.object({
  certificateName: z.string().optional(),
  fileId: z.string().optional(),
  certificateId: z.string().optional(),
  instituationName: z.string().optional(),
  description: z.string().optional(),
  isCertificate: z.boolean().optional(),
});

export class CreateCertificateDto extends createZodDto(CertificateSchema) {
  @ApiProperty({ example: 'Full Stack Development' })
  certificateName: string;

  @ApiProperty({ example: 'file-uuid-1234' })
  fileId: string;

  @ApiProperty({ example: 'CERT123456' })
  certificateId: string;

  @ApiProperty({ example: 'Coursera' })
  instituationName: string;

  @ApiPropertyOptional({ example: 'Completed in 2023 with distinction.' })
  description?: string;
}
