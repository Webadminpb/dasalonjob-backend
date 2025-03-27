import { createZodDto } from 'nestjs-zod';
import { Incentive } from '@prisma/client';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const IncentiveSchema = z.nativeEnum(Incentive);

export const JobBenefitsSchema = z.object({
  benefits: z.array(IncentiveSchema),
  userId: z.string().optional(),
});

export class CreateJobBenefitsDto extends createZodDto(JobBenefitsSchema) {
  @ApiProperty({
    isArray: true,
    enum: Incentive,
    example: [Incentive.EmployeeDiscount, Incentive.Accomodation],
  })
  benefits: Incentive[];
}
