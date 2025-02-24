import { Module } from '@nestjs/common';
import { PartnerVenueService } from './partner-venue.service';
import { PartnerVenueController } from './partner-venue.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PartnerVenueController],
  providers: [PartnerVenueService, PrismaService, JwtService],
})
export class PartnerVenueModule {}
