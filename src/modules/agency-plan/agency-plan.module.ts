import { Module } from '@nestjs/common';
import { AgencyPlanService } from './agency-plan.service';
import { AgencyPlanController } from './agency-plan.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyPlanController],
  providers: [AgencyPlanService, PrismaService, JwtService],
})
export class AgencyPlanModule {}
