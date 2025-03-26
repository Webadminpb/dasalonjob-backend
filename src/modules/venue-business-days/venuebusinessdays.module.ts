import { Module } from '@nestjs/common';
import { VenueMainBusinessDaysController } from './venuebusinessdays.controller';
import { VenueMainBusinessDaysService } from './venuebusinessdays.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VenueMainBusinessDaysController],
  providers: [VenueMainBusinessDaysService, PrismaService, JwtService],
})
export class VenuebusinessdaysModule {}
