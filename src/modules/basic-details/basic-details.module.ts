import { Module } from '@nestjs/common';
import { BasicdetailsService } from './basic-details.service';
import { BasicdetailsController } from './basic-details.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BasicdetailsController],
  providers: [BasicdetailsService, PrismaService, JwtService],
})
export class BasicdetailsModule {}
