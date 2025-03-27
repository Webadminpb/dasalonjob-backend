import { Module } from '@nestjs/common';
import { JobpreferenceService } from './job-preference.service';
import { JobpreferenceController } from './job-preference.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobpreferenceController],
  providers: [JobpreferenceService, PrismaService, JwtService],
})
export class JobpreferenceModule {}
