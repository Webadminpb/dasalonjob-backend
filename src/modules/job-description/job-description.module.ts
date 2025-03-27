import { Module } from '@nestjs/common';
import { JobDescriptionController } from './job-description.controller';
import { JobDescriptionService } from './job-description.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobDescriptionController],
  providers: [JobDescriptionService, PrismaService, JwtService],
})
export class JobdescriptionModule {}
