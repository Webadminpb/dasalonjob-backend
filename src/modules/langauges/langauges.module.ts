import { Module } from '@nestjs/common';
import { LangaugesService } from './langauges.service';
import { LangaugesController } from './langauges.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LangaugesController],
  providers: [LangaugesService, PrismaService, JwtService],
})
export class LangaugesModule {}
