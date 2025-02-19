import { Module } from '@nestjs/common';
import { JobApplicationMessageService } from './job-application-message.service';
import { JobApplicationMessageController } from './job-application-message.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobApplicationMessageController],
  providers: [JobApplicationMessageService, PrismaService, JwtService],
})
export class JobApplicationMessageModule {}
