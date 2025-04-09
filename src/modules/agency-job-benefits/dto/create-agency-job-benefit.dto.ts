import { ApiProperty } from '@nestjs/swagger';
import { Incentive } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AgencyJobBenefitsSchema = z.object({
  benefits: z.array(z.nativeEnum(Incentive)),
});

export class CreateAgencyJobBenefitsDto extends createZodDto(
  AgencyJobBenefitsSchema,
) {
  @ApiProperty({
    description: 'List of job benefits/incentives',
    enum: Incentive,
    isArray: true,
    example: [Incentive.EmployeeDiscount, Incentive.FlexibleSchedule],
  })
  benefits: Incentive[];
}
