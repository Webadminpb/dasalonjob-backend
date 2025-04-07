import { Module } from '@nestjs/common';
import { SalondetailsService } from './salon-details.service';
import { SalondetailsController } from './salon-details.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SalondetailsController],
  providers: [SalondetailsService, PrismaService, JwtService],
})
export class SalondetailsModule {}
