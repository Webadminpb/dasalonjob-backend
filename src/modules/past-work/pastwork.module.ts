import { Module } from '@nestjs/common';
import { PastworkService } from './pastwork.service';
import { PastworkController } from './pastwork.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PastworkController],
  providers: [PastworkService, PrismaService, JwtService],
})
export class PastworkModule {}
