import { Module } from '@nestjs/common';
import { SalondetailsService } from './salondetails.service';
import { SalondetailsController } from './salondetails.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SalondetailsController],
  providers: [SalondetailsService, PrismaService, JwtService],
})
export class SalondetailsModule {}
