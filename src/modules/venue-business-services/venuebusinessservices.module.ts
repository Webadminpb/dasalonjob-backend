import { Module } from '@nestjs/common';
import { VenueMainBusinessServicesController } from './venuebusinessservices.controller';
import { VenueMainBusinessServicesService } from './venuebusinessservices.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VenueMainBusinessServicesController],
  providers: [VenueMainBusinessServicesService, PrismaService, JwtService],
})
export class VenuebusinessservicesModule {}
