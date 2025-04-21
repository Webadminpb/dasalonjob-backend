import { Module } from '@nestjs/common';
import { SponsoredJobService } from './sponsored-job-service';
import { SponsoredJobController } from './sponsored-job.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [SponsoredJobController],
  providers: [SponsoredJobService, PrismaService, JwtService],
})
export class SponsoredJobModule {}
