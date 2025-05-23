import { Module } from '@nestjs/common';
import { JobQualificationController } from './job-qualification.controller';
import { JobQualificationService } from './job-qualification.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobQualificationController],
  providers: [JobQualificationService, PrismaService, JwtService],
})
export class JobqualificationModule {}
