import { Module } from '@nestjs/common';
import { VenueDetailsController } from './venuedetails.controller';
import { VenueDetailsService } from './venuedetails.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VenueDetailsController],
  providers: [VenueDetailsService, PrismaService, JwtService],
})
export class VenuedetailsModule {}
