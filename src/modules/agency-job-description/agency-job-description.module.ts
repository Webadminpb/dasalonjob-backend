import { Module } from '@nestjs/common';
import { AgencyJobDescriptionService } from './agency-job-description.service';
import { AgencyJobDescriptionController } from './agency-job-description.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyJobDescriptionController],
  providers: [AgencyJobDescriptionService, PrismaService, JwtService],
})
export class AgencyJobDescriptionModule {}
