import { Module } from '@nestjs/common';
import { JobBasicInfoController } from './job-basic-info.controller';
import { JobBasicInfoService } from './job-basic-info.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobBasicInfoController],
  providers: [JobBasicInfoService, PrismaService, JwtService],
})
export class JobbasicinfoModule {}
