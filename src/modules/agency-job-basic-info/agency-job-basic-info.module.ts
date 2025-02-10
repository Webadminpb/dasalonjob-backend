import { Module } from '@nestjs/common';
import { AgencyJobBasicInfoService } from './agency-job-basic-info.service';
import { AgencyJobBasicInfoController } from './agency-job-basic-info.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyJobBasicInfoController],
  providers: [AgencyJobBasicInfoService, PrismaService, JwtService],
})
export class AgencyJobBasicInfoModule {}
