import { Module } from '@nestjs/common';
import { VenueDetailsController } from './venue-details.controller';
import { VenueDetailsService } from './venue-details.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VenueDetailsController],
  providers: [VenueDetailsService, PrismaService, JwtService],
})
export class VenuedetailsModule {}
