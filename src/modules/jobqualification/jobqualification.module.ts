import { Module } from '@nestjs/common';
import { JobQualificationController } from './jobqualification.controller';
import { JobQualificationService } from './jobqualification.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobQualificationController],
  providers: [JobQualificationService, PrismaService, JwtService],
})
export class JobqualificationModule {}
