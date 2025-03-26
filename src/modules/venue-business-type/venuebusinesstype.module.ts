import { Module } from '@nestjs/common';
import { VenueMainBusinessTypeController } from './venuebusinesstype.controller';
import { VenueMainBusinessTypeService } from './venuebusinesstype.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VenueMainBusinessTypeController],
  providers: [VenueMainBusinessTypeService, PrismaService, JwtService],
})
export class VenuebusinesstypeModule {}
