import { Module } from '@nestjs/common';
import { AgencyVenueDetailsService } from './agency-venue-details.service';
import { AgencyVenueDetailsController } from './agency-venue-details.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AgencyVenueDetailsController],
  providers: [AgencyVenueDetailsService, PrismaService, JwtService],
})
export class AgencyVenueDetailsModule {}
