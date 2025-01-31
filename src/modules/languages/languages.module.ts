import { Module } from '@nestjs/common';
import { LangaugesService } from './languages.service';
import { LangaugesController } from './languages.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LangaugesController],
  providers: [LangaugesService, PrismaService, JwtService],
})
export class LangaugesModule {}
