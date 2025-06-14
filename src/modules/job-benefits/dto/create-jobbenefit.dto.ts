import { createZodDto } from 'nestjs-zod';
import { Incentive } from '@prisma/client';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const IncentiveSchema = z.nativeEnum(Incentive);

export const JobBenefitsSchema = z.object({
  // benefits: z.array(IncentiveSchema),
  healthInsurance: z.boolean().optional(),
  paidTimeOff: z.boolean().optional(),
  flexibleSchedule: z.boolean().optional(),
  employeeDiscount: z.boolean().optional(),
  accomodation: z.boolean().optional(),
  professionalDev: z.boolean().optional(),
  userId: z.string().optional(),
});

export class CreateJobBenefitsDto extends createZodDto(JobBenefitsSchema) {
  @ApiProperty({
    isArray: true,
    enum: Incentive,
    example: [Incentive.EmployeeDiscount, Incentive.Accomodation],
  })
  benefits: Incentive[];

  @ApiProperty({ required: false })
  userId?: string;
}
