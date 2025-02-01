import { Module } from '@nestjs/common';
import { JobBenefitsController } from './jobbenefits.controller';
import { JobBenefitsService } from './jobbenefits.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [JobBenefitsController],
  providers: [JobBenefitsService, PrismaService, JwtService],
})
export class JobbenefitsModule {}
