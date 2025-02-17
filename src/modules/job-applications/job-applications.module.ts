import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JobApplicationController } from './job-applications.controller';
import { JobApplicationService } from './job-applications.service';

@Module({
  controllers: [JobApplicationController],
  providers: [JobApplicationService, PrismaService, JwtService],
})
export class JobApplicationsModule {}
