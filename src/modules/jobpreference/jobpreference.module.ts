import { Module } from '@nestjs/common';
import { JobpreferenceService } from './jobpreference.service';
import { JobpreferenceController } from './jobpreference.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JobpreferenceController],
  providers: [JobpreferenceService, PrismaService, JwtService],
})
export class JobpreferenceModule {}
