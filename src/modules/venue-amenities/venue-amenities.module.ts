import { Module } from '@nestjs/common';
import { VenueAmenitiesService } from './venue-amenities.service';
import { VenueAmenitiesController } from './venue-amenities.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VenueAmenitiesController],
  providers: [VenueAmenitiesService, PrismaService, JwtService],
})
export class VenueAmenitiesModule {}
