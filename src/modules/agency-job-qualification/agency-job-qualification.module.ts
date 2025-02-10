import { Module } from '@nestjs/common';
import { AgencyJobQualificationService } from './agency-job-qualification.service';
import { AgencyJobQualificationController } from './agency-job-qualification.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyJobQualificationController],
  providers: [AgencyJobQualificationService, PrismaService, JwtService],
})
export class AgencyJobQualificationModule {}
