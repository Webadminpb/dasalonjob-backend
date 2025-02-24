import { Module } from '@nestjs/common';
import { VenueWorkStationController } from './venue-workstation.controller';
import { VenueWorkStationService } from './venue-workstation.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VenueWorkStationController],
  providers: [VenueWorkStationService, PrismaService, JwtService],
})
export class VenueWorkstationModule {}
