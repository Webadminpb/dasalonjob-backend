import { Module } from '@nestjs/common';
import { JobBenefitsController } from './job-benefits.controller';
import { JobBenefitsService } from './job-benefits.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [JobBenefitsController],
  providers: [JobBenefitsService, PrismaService, JwtService],
})
export class JobbenefitsModule {}
