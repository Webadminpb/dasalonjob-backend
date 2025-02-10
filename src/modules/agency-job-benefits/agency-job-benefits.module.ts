import { Module } from '@nestjs/common';
import { AgencyJobBenefitsService } from './agency-job-benefits.service';
import { AgencyJobBenefitsController } from './agency-job-benefits.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyJobBenefitsController],
  providers: [AgencyJobBenefitsService, PrismaService, JwtService],
})
export class AgencyJobBenefitsModule {}
