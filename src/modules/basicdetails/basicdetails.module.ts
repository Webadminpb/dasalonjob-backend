import { Module } from '@nestjs/common';
import { BasicdetailsService } from './basicdetails.service';
import { BasicdetailsController } from './basicdetails.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BasicdetailsController],
  providers: [BasicdetailsService, PrismaService, JwtService],
})
export class BasicdetailsModule {}
