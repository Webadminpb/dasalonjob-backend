import { Module } from '@nestjs/common';
import { FeaturedJobService } from './featured-jobs.service';
import { FeaturedJobController } from './featured-jobs.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FeaturedJobController],
  providers: [FeaturedJobService, PrismaService, JwtService],
})
export class FeaturedJobsModule {}
