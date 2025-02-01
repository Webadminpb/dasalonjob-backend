import { Module } from '@nestjs/common';
import { JobBasicInfoController } from './jobbasicinfo.controller';
import { JobBasicInfoService } from './jobbasicinfo.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobBasicInfoController],
  providers: [JobBasicInfoService, PrismaService, JwtService],
})
export class JobbasicinfoModule {}
