import { Module } from '@nestjs/common';
import { JobDescriptionController } from './jobdescription.controller';
import { JobDescriptionService } from './jobdescription.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobDescriptionController],
  providers: [JobDescriptionService, PrismaService, JwtService],
})
export class JobdescriptionModule {}
