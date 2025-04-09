import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, MartialStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const createBasicDetailsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.nativeEnum(Gender),
  dob: zDateOptional,
  martialStatus: z.nativeEnum(MartialStatus).optional(),
  fileId: z.string().optional(),
});

export class CreateBasicdetailDto extends createZodDto(
  createBasicDetailsSchema,
) {
  @ApiPropertyOptional({ example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string;

  @ApiProperty({ enum: Gender, example: Gender.Everyone })
  gender: Gender;

  @ApiProperty({
    example: '1995-08-24',
    description: 'Date of birth (YYYY-MM-DD)',
  })
  dob: Date;

  @ApiPropertyOptional({ enum: MartialStatus, example: MartialStatus.Married })
  martialStatus?: MartialStatus;

  @ApiPropertyOptional({
    example: 'file-id-123',
    description: 'Optional file ID',
  })
  fileId?: string;
}
