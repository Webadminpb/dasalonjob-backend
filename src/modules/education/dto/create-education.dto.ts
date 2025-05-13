import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { HighestEducation } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const createEducationSchema = z.object({
  school: z.string(),
  attended: zDateOptional,
  graduated: zDateOptional,
  education: z.nativeEnum(HighestEducation),
  fileId: z.string().optional(),
  isProfessionalTrained: z.boolean().optional(),
  isCrmTrained: z.boolean().optional(),
});

export class CreateEducationDto extends createZodDto(createEducationSchema) {
  @ApiProperty({ example: 'XYZ High School' })
  school: string;

  @ApiProperty({ example: '2020-06-01', required: false })
  attended?: any;

  @ApiProperty({ example: '2023-06-01', required: false })
  graduated?: any;

  @ApiProperty({ enum: HighestEducation })
  education: HighestEducation;
}
